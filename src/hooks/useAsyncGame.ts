'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSupabase, loadSupabase } from '@/lib/supabase'
import {
  createAsyncGame,
  fetchAsyncGame,
  saveAsyncGame,
} from '@/lib/asyncGame'
import {
  forgetAsyncGame,
  getMembership,
  inviteUrl,
  rememberAsyncGame,
  saveMembership,
} from '@/lib/asyncStorage'
import * as engine from '@/lib/gameEngine'
import { notifyIfHidden, requestTurnNotifications } from '@/lib/notify'
import { isPlayersTurn } from '@/lib/gameEngine'
import type { useGameState } from '@/hooks/useGameState'
import type { Card, GameState, PlayerInfo } from '@/types/game'
import type { RealtimeChannel } from '@supabase/supabase-js'

type GameEngine = ReturnType<typeof useGameState>

function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useAsyncGame(gameEngine: GameEngine) {
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState('')
  const versionRef = useRef(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const applyingRemoteRef = useRef(false)
  const roomRef = useRef('')
  const playerRef = useRef('')
  const latestRef = useRef(gameEngine.gameState)
  useEffect(() => {
    latestRef.current = gameEngine.gameState
  }, [gameEngine.gameState])

  const teardownChannel = useCallback(() => {
    const sb = getSupabase()
    if (channelRef.current && sb) {
      sb.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  const setFullState = gameEngine.setFullState
  const getState = gameEngine.getState
  const beginHostedLobby = gameEngine.beginHostedLobby
  const resetGame = gameEngine.newGame
  const startEngineGame = gameEngine.startGame

  const hydrate = useCallback(
    (state: GameState, version: number, pid: string) => {
      applyingRemoteRef.current = true
      versionRef.current = version
      latestRef.current = state
      setFullState(state)
      rememberAsyncGame(state, pid)
      queueMicrotask(() => {
        applyingRemoteRef.current = false
      })
    },
    [setFullState],
  )

  const refetch = useCallback(async () => {
    const code = roomRef.current
    if (!code) return
    const snap = await fetchAsyncGame(code)
    if (!snap) return
    if (snap.version <= versionRef.current) return
    const wasTurn = isPlayersTurn(latestRef.current, playerRef.current)
    hydrate(snap.state, snap.version, playerRef.current)
    if (!wasTurn && isPlayersTurn(snap.state, playerRef.current)) {
      notifyIfHidden('Your turn', 'Cards Against AI — play a card or judge.')
    }
  }, [hydrate])

  const ping = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'async:update',
      payload: { version: versionRef.current },
    })
  }, [])

  const setupChannel = useCallback(
    (roomCode: string) => {
      teardownChannel()
      void loadSupabase().then((sb) => {
        if (!sb || roomRef.current !== roomCode) return
        const channel = sb.channel(`async:${roomCode}`, {
          config: { broadcast: { self: false } },
        })
        channel.on('broadcast', { event: 'async:update' }, () => {
          void refetch()
        })
        channel.subscribe()
        channelRef.current = channel
      })
    },
    [refetch, teardownChannel],
  )

  const persistAction = useCallback(
    async (action: (state: GameState) => GameState): Promise<GameState | null> => {
      const code = roomRef.current
      if (!code) return null

      let current = latestRef.current
      for (let attempt = 0; attempt < 6; attempt++) {
        const next = action(current)
        if (next === current) return current

        try {
          const result = await saveAsyncGame(code, versionRef.current, next)
          if (result.ok) {
            versionRef.current = result.version
            hydrate(next, result.version, playerRef.current)
            ping()
            return next
          }
          current = result.state
          hydrate(result.state, result.version, playerRef.current)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not save the game')
          return null
        }
      }

      setError('This table got busy. Refresh and try again.')
      return null
    },
    [hydrate, ping],
  )

  const hostAsyncGame = useCallback(
    async (playerInfo: PlayerInfo) => {
      setError(null)
      requestTurnNotifications()
      const roomCode = engine.generateRoomCode()
      const hostId = 'player-1'
      const next = beginHostedLobby({
        roomCode,
        playMode: 'async',
        host: { id: hostId, ...playerInfo },
      })
      roomRef.current = roomCode
      playerRef.current = hostId
      setPlayerId(hostId)
      setActive(true)
      try {
        const snap = await createAsyncGame(roomCode, next)
        versionRef.current = snap.version
        saveMembership(roomCode, { playerId: hostId, ...playerInfo })
        rememberAsyncGame(next, hostId)
        setupChannel(roomCode)
      } catch (err) {
        setActive(false)
        roomRef.current = ''
        playerRef.current = ''
        setPlayerId('')
        setError(err instanceof Error ? err.message : 'Could not create async room')
        resetGame()
      }
    },
    [beginHostedLobby, resetGame, setupChannel],
  )

  const joinAsyncGame = useCallback(
    async (
      roomCode: string,
      playerInfo: PlayerInfo,
      knownPlayerId?: string,
    ): Promise<boolean> => {
      setError(null)
      requestTurnNotifications()
      const code = roomCode.toUpperCase()
      const snap = await fetchAsyncGame(code)
      if (!snap) return false

      const existing = getMembership(code)
      const returning = snap.state.players.find(
        (p) =>
          p.id === knownPlayerId ||
          (existing ? p.id === existing.playerId : false),
      )

      if (returning) {
        roomRef.current = code
        playerRef.current = returning.id
        setPlayerId(returning.id)
        setActive(true)
        setupChannel(code)
        hydrate(snap.state, snap.version, returning.id)
        return true
      }

      if (snap.state.phase !== 'lobby') {
        setError('That game already started. Ask the host for a new code.')
        return false
      }

      const newId = generatePlayerId()
      roomRef.current = code
      playerRef.current = newId
      versionRef.current = snap.version
      latestRef.current = snap.state
      setFullState(snap.state)
      setPlayerId(newId)
      setActive(true)
      setupChannel(code)
      saveMembership(code, { playerId: newId, ...playerInfo })

      const joined = await persistAction((s) =>
        engine.addRemotePlayer(s, { id: newId, ...playerInfo }),
      )
      if (!joined) {
        setActive(false)
        setPlayerId('')
        roomRef.current = ''
        playerRef.current = ''
        teardownChannel()
        return false
      }
      return true
    },
    [hydrate, persistAction, setFullState, setupChannel, teardownChannel],
  )

  const resumeAsyncGame = useCallback(
    async (roomCode: string) => {
      setError(null)
      const code = roomCode.toUpperCase()
      const membership = getMembership(code)
      const snap = await fetchAsyncGame(code)
      if (!snap) {
        setError('Could not find that table. It may have expired.')
        forgetAsyncGame(code)
        return
      }
      const pid =
        membership?.playerId && snap.state.players.some((p) => p.id === membership.playerId)
          ? membership.playerId
          : snap.state.players.find((p) => !p.isBot)?.id ?? 'player-1'

      roomRef.current = code
      playerRef.current = pid
      setPlayerId(pid)
      setActive(true)
      hydrate(snap.state, snap.version, pid)
      setupChannel(code)
    },
    [hydrate, setupChannel],
  )

  const seedBackup = useCallback(async (state: GameState) => {
    try {
      const snap = await createAsyncGame(state.roomCode, state)
      versionRef.current = snap.version
      roomRef.current = state.roomCode
    } catch {
      // Live games still work if async backup isn't available
    }
  }, [])

  const persistBackup = useCallback(async (state: GameState) => {
    if (!roomRef.current && state.roomCode) roomRef.current = state.roomCode
    const code = roomRef.current || state.roomCode
    if (!code || versionRef.current < 1) return
    try {
      const result = await saveAsyncGame(code, versionRef.current, state)
      if (result.ok) versionRef.current = result.version
      else versionRef.current = result.version
    } catch {
      // Ignore backup failures
    }
  }, [])

  const disconnect = useCallback(() => {
    teardownChannel()
    setActive(false)
    setPlayerId('')
    roomRef.current = ''
    playerRef.current = ''
    versionRef.current = 0
    setError(null)
  }, [teardownChannel])

  useEffect(() => {
    return () => teardownChannel()
  }, [teardownChannel])

  useEffect(() => {
    if (!active) return
    const onVis = () => {
      if (document.visibilityState === 'visible') void refetch()
    }
    document.addEventListener('visibilitychange', onVis)
    const interval = window.setInterval(() => void refetch(), 12_000)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.clearInterval(interval)
    }
  }, [active, refetch])

  const run = useCallback(
    (action: (state: GameState) => GameState) => {
      if (!active) {
        setFullState(action(getState()))
        return
      }
      void persistAction(action)
    },
    [active, persistAction, setFullState, getState],
  )

  const submitCards = useCallback(
    (playerId: string, cards: Card[]) => {
      run((s) => engine.submitCards(s, playerId, cards))
    },
    [run],
  )
  const pickWinner = useCallback(
    (winnerId: string) => {
      run((s) => engine.pickWinner(s, winnerId))
    },
    [run],
  )
  const rebootHand = useCallback(
    (pid: string) => {
      run((s) => engine.rebootHand(s, pid))
    },
    [run],
  )
  const redrawHand = useCallback(
    (pid: string) => {
      run((s) => engine.redrawHand(s, pid))
    },
    [run],
  )
  const nextRound = useCallback(() => {
    run(engine.nextRound)
  }, [run])
  const continueFromScoreboard = useCallback(() => {
    run(engine.continueFromScoreboard)
  }, [run])
  const finishReveal = useCallback(() => {
    run(engine.finishReveal)
  }, [run])
  const updateSettings = useCallback(
    (updates: Partial<GameState['settings']>) => {
      run((s) => engine.updateSettings(s, updates))
    },
    [run],
  )
  const renamePlayer = useCallback(
    (pid: string, name: string) => {
      run((s) => engine.renamePlayer(s, pid, name))
    },
    [run],
  )
  const botSubmit = useCallback(() => {
    run(engine.botSubmit)
  }, [run])
  const botPickWinner = useCallback(() => {
    run(engine.botPickWinner)
  }, [run])

  const startGame = useCallback(
    async (playerName: string, botCount?: number) => {
      const next = await startEngineGame(playerName, botCount)
      if (active && next) {
        try {
          const result = await saveAsyncGame(roomRef.current, versionRef.current, next)
          if (result.ok) {
            versionRef.current = result.version
            rememberAsyncGame(next, playerRef.current)
            ping()
          } else {
            hydrate(result.state, result.version, playerRef.current)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not start async game')
        }
      }
    },
    [active, startEngineGame, hydrate, ping],
  )

  const copyInvite = useCallback(async () => {
    const code = roomRef.current || getState().roomCode
    if (!code) return false
    try {
      await navigator.clipboard.writeText(inviteUrl(code))
      return true
    } catch {
      return false
    }
  }, [getState])

  return useMemo(
    () => ({
      active,
      error,
      playerId,
      hostAsyncGame,
      joinAsyncGame,
      resumeAsyncGame,
      disconnect,
      persistAction,
      startGame,
      copyInvite,
      refetch,
      seedBackup,
      persistBackup,
      submitCards,
      pickWinner,
      rebootHand,
      redrawHand,
      nextRound,
      continueFromScoreboard,
      finishReveal,
      updateSettings,
      renamePlayer,
      botSubmit,
      botPickWinner,
      setError,
    }),
    [
      active,
      error,
      playerId,
      hostAsyncGame,
      joinAsyncGame,
      resumeAsyncGame,
      disconnect,
      persistAction,
      startGame,
      copyInvite,
      refetch,
      seedBackup,
      persistBackup,
      submitCards,
      pickWinner,
      rebootHand,
      redrawHand,
      nextRound,
      continueFromScoreboard,
      finishReveal,
      updateSettings,
      renamePlayer,
      botSubmit,
      botPickWinner,
    ],
  )
}
