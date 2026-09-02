'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
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
    if (channelRef.current && supabase) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  const hydrate = useCallback(
    (state: GameState, version: number, pid: string) => {
      applyingRemoteRef.current = true
      versionRef.current = version
      latestRef.current = state
      gameEngine.setFullState(state)
      rememberAsyncGame(state, pid)
      queueMicrotask(() => {
        applyingRemoteRef.current = false
      })
    },
    [gameEngine],
  )

  const refetch = useCallback(async () => {
    const code = roomRef.current
    if (!code) return
    const snap = await fetchAsyncGame(code)
    if (!snap) return
    if (snap.version <= versionRef.current) return
    hydrate(snap.state, snap.version, playerRef.current)
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
      if (!supabase) return
      const channel = supabase.channel(`async:${roomCode}`, {
        config: { broadcast: { self: false } },
      })
      channel.on('broadcast', { event: 'async:update' }, () => {
        void refetch()
      })
      channel.subscribe()
      channelRef.current = channel
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
    [gameEngine, hydrate, ping],
  )

  const hostAsyncGame = useCallback(
    async (playerInfo: PlayerInfo) => {
      setError(null)
      const roomCode = engine.generateRoomCode()
      const hostId = 'player-1'
      const next = gameEngine.beginHostedLobby({
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
        gameEngine.newGame()
      }
    },
    [gameEngine, setupChannel],
  )

  const joinAsyncGame = useCallback(
    async (roomCode: string, playerInfo: PlayerInfo): Promise<boolean> => {
      setError(null)
      const code = roomCode.toUpperCase()
      const snap = await fetchAsyncGame(code)
      if (!snap) return false

      const existing = getMembership(code)
      const returning = existing
        ? snap.state.players.find((p) => p.id === existing.playerId)
        : undefined

      roomRef.current = code
      setActive(true)
      setupChannel(code)

      if (returning) {
        playerRef.current = returning.id
        setPlayerId(returning.id)
        hydrate(snap.state, snap.version, returning.id)
        return true
      }

      if (snap.state.phase !== 'lobby') {
        setError('That game already started. Ask the host for a new code.')
        setActive(false)
        teardownChannel()
        return true
      }

      const newId = generatePlayerId()
      versionRef.current = snap.version
      latestRef.current = snap.state
      gameEngine.setFullState(snap.state)
      playerRef.current = newId
      setPlayerId(newId)
      saveMembership(code, { playerId: newId, ...playerInfo })

      const joined = await persistAction((s) =>
        engine.addRemotePlayer(s, { id: newId, ...playerInfo }),
      )
      if (!joined) {
        setActive(false)
        teardownChannel()
      }
      return true
    },
    [gameEngine, hydrate, persistAction, setupChannel, teardownChannel],
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

  const wrap =
    <A extends unknown[]>(action: (state: GameState, ...args: A) => GameState) =>
    (...args: A) => {
      if (!active) {
        gameEngine.setFullState(action(gameEngine.gameState, ...args))
        return
      }
      void persistAction((s) => action(s, ...args))
    }

  const startGame = useCallback(
    async (playerName: string, botCount?: number) => {
      const next = await gameEngine.startGame(playerName, botCount)
      if (active && next) {
        // startGame already applied locally; persist that snapshot
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
    [active, gameEngine, hydrate, ping],
  )

  const copyInvite = useCallback(async () => {
    const code = roomRef.current || gameEngine.gameState.roomCode
    if (!code) return false
    try {
      await navigator.clipboard.writeText(inviteUrl(code))
      return true
    } catch {
      return false
    }
  }, [gameEngine.gameState.roomCode])

  return {
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
    submitCards: wrap((s, playerId: string, cards: Card[]) =>
      engine.submitCards(s, playerId, cards),
    ),
    pickWinner: wrap((s, winnerId: string) => engine.pickWinner(s, winnerId)),
    rebootHand: wrap((s, pid: string) => engine.rebootHand(s, pid)),
    redrawHand: wrap((s, pid: string) => engine.redrawHand(s, pid)),
    nextRound: wrap(engine.nextRound),
    continueFromScoreboard: wrap(engine.continueFromScoreboard),
    finishReveal: wrap(engine.finishReveal),
    updateSettings: wrap((s, updates: Partial<GameState['settings']>) =>
      engine.updateSettings(s, updates),
    ),
    renamePlayer: wrap((s, pid: string, name: string) => engine.renamePlayer(s, pid, name)),
    botSubmit: wrap(engine.botSubmit),
    botPickWinner: wrap(engine.botPickWinner),
    setError,
  }
}
