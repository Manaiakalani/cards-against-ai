'use client'

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { useMultiplayer, hydrateClientState } from '@/hooks/useMultiplayer'
import { useAsyncGame } from '@/hooks/useAsyncGame'
import { getEmptyAsyncGames, listAsyncGames, subscribeAsyncGames } from '@/lib/asyncStorage'
import { fetchAsyncGame } from '@/lib/asyncGame'
import { getMembership, saveMembership } from '@/lib/asyncStorage'
import { setPlayMode } from '@/lib/gameEngine'
import { requestTurnNotifications } from '@/lib/notify'
import type { useGameState } from '@/hooks/useGameState'
import type { Card, GameAction, GameState, PlayerInfo } from '@/types/game'

type GameEngine = ReturnType<typeof useGameState>

function subscribeGames(cb: () => void) {
  return subscribeAsyncGames(cb)
}

/**
 * Wraps the local `useGameState` engine with multiplayer awareness.
 *
 * Live mode: player-facing actions go over the Supabase Realtime channel
 * (host-authoritative). Async mode: actions are applied locally then
 * persisted with optimistic locking so people can play on their own time.
 */
export function useNetworkedGame(engine: GameEngine) {
  const asyncGame = useAsyncGame(engine)
  const isAsync = asyncGame.active || engine.gameState.playMode === 'async'

  const handleRemoteAction = useCallback(
    (action: GameAction) => {
      const { players, czarId, phase } = engine.gameState
      const sender = players.find((p) => p.id === action.playerId)
      if (!sender) return

      switch (action.type) {
        case 'player:submit':
          if (phase !== 'playing' || action.playerId === czarId) return
          engine.submitCards(action.playerId, action.payload.cards)
          break
        case 'player:pick_winner':
          if (phase !== 'judging' || action.playerId !== czarId) return
          engine.pickWinner(action.payload.winnerId)
          break
        case 'player:reboot':
          if (phase !== 'playing') return
          engine.rebootHand(action.playerId)
          break
        case 'player:redraw':
          if (phase !== 'playing') return
          engine.redrawHand(action.playerId)
          break
        case 'player:rename':
          engine.renamePlayer(action.playerId, action.payload.name)
          break
        case 'player:update_settings':
          if (phase !== 'lobby') return
          engine.updateSettings(action.payload.settings)
          break
        case 'player:next_round':
          if (phase !== 'results') return
          engine.nextRound()
          break
        case 'player:continue':
          if (phase !== 'scoreboard') return
          engine.continueFromScoreboard()
          break
        case 'player:join':
        case 'player:leave':
        case 'player:start_game':
        case 'player:new_game':
          break
        default: {
          const unhandled: never = action
          void unhandled
        }
      }
    },
    [engine],
  )

  const mp = useMultiplayer({
    onStateUpdate: (broadcast) => {
      if (mp.mpState.role === 'client') {
        engine.setFullState(hydrateClientState(broadcast))
      }
    },
    onAction: (action) => {
      if (mp.mpState.role === 'host') {
        handleRemoteAction(action)
      }
    },
    onPlayerJoin: (player) => {
      if (mp.mpState.role === 'host') {
        engine.addRemotePlayer({
          id: player.id,
          name: player.name,
          avatar: player.avatar,
          avatarBg: player.avatarBg,
        })
      }
    },
    onPlayerLeave: (player) => {
      if (mp.mpState.role === 'host') {
        engine.removeRemotePlayer(player.id)
      }
      if (mp.mpState.role === 'client' && player.isHost) {
        const st = engine.getState()
        const info = getMembership(st.roomCode)
        void (async () => {
          const snap = await fetchAsyncGame(st.roomCode)
          if (snap && info) {
            const ok = await asyncGame.joinAsyncGame(st.roomCode, info, mp.mpState.playerId)
            if (ok) {
              await asyncGame.persistAction((s) => setPlayMode(s, 'async'))
              mp.disconnect()
              return
            }
          }
          engine.setFullState({ ...engine.getState(), phase: 'menu' })
          mp.disconnect()
        })()
      }
    },
  })

  useEffect(() => {
    if (mp.isHost && mp.mpState.connected) {
      mp.broadcastState(engine.gameState)
    }
  }, [engine.gameState, mp.isHost, mp.mpState.connected, mp.broadcastState])

  useEffect(() => {
    if (!mp.isHost || engine.gameState.playMode !== 'live') return
    const t = window.setTimeout(() => {
      void asyncGame.persistBackup(engine.gameState)
    }, 400)
    return () => window.clearTimeout(t)
  }, [engine.gameState, mp.isHost, asyncGame.persistBackup])

  const submitCards = useCallback(
    (playerId: string, cards: Card[]) => {
      if (isAsync) {
        asyncGame.submitCards(playerId, cards)
      } else if (mp.isClient) {
        mp.sendAction({ type: 'player:submit', playerId, payload: { cards } })
      } else {
        engine.submitCards(playerId, cards)
      }
    },
    [isAsync, asyncGame, mp.isClient, mp.sendAction, engine],
  )

  const submitCard = useCallback(
    (playerId: string, card: Card) => submitCards(playerId, [card]),
    [submitCards],
  )

  const pickWinner = useCallback(
    (winnerId: string) => {
      if (isAsync) {
        asyncGame.pickWinner(winnerId)
      } else if (mp.isClient) {
        mp.sendAction({
          type: 'player:pick_winner',
          playerId: mp.mpState.playerId,
          payload: { winnerId },
        })
      } else {
        engine.pickWinner(winnerId)
      }
    },
    [isAsync, asyncGame, mp.isClient, mp.sendAction, mp.mpState.playerId, engine],
  )

  const rebootHand = useCallback(
    (playerId: string) => {
      if (isAsync) {
        asyncGame.rebootHand(playerId)
      } else if (mp.isClient) {
        mp.sendAction({ type: 'player:reboot', playerId })
      } else {
        engine.rebootHand(playerId)
      }
    },
    [isAsync, asyncGame, mp.isClient, mp.sendAction, engine],
  )

  const redrawHand = useCallback(
    (playerId: string) => {
      if (isAsync) {
        asyncGame.redrawHand(playerId)
      } else if (mp.isClient) {
        mp.sendAction({ type: 'player:redraw', playerId })
      } else {
        engine.redrawHand(playerId)
      }
    },
    [isAsync, asyncGame, mp.isClient, mp.sendAction, engine],
  )

  const nextRound = useCallback(() => {
    if (isAsync) {
      asyncGame.nextRound()
    } else if (mp.isClient) {
      mp.sendAction({
        type: 'player:next_round',
        playerId: mp.mpState.playerId,
      })
    } else {
      engine.nextRound()
    }
  }, [isAsync, asyncGame, mp.isClient, mp.sendAction, mp.mpState.playerId, engine])

  const continueFromScoreboard = useCallback(() => {
    if (isAsync) {
      asyncGame.continueFromScoreboard()
    } else if (mp.isClient) {
      mp.sendAction({
        type: 'player:continue',
        playerId: mp.mpState.playerId,
      })
    } else {
      engine.continueFromScoreboard()
    }
  }, [isAsync, asyncGame, mp.isClient, mp.sendAction, mp.mpState.playerId, engine])

  const finishReveal = useCallback(() => {
    if (isAsync) {
      asyncGame.finishReveal()
      return
    }
    if (mp.isClient) return
    engine.finishReveal()
  }, [isAsync, asyncGame, mp.isClient, engine])

  const updateSettings = useCallback(
    (updates: Partial<GameState['settings']>) => {
      if (isAsync) {
        asyncGame.updateSettings(updates)
      } else if (mp.isClient) {
        mp.sendAction({
          type: 'player:update_settings',
          playerId: mp.mpState.playerId,
          payload: { settings: updates },
        })
      } else {
        engine.updateSettings(updates)
      }
    },
    [isAsync, asyncGame, mp.isClient, mp.sendAction, mp.mpState.playerId, engine],
  )

  const renamePlayer = useCallback(
    (playerId: string, name: string) => {
      if (isAsync) {
        asyncGame.renamePlayer(playerId, name)
      } else if (mp.isClient) {
        mp.sendAction({
          type: 'player:rename',
          playerId,
          payload: { name },
        })
      } else {
        engine.renamePlayer(playerId, name)
      }
    },
    [isAsync, asyncGame, mp.isClient, mp.sendAction, engine],
  )

  const newGame = useCallback(() => {
    asyncGame.disconnect()
    mp.disconnect()
    engine.newGame()
  }, [asyncGame, mp, engine])

  const hostGame = useCallback(
    (playerInfo: PlayerInfo) => {
      requestTurnNotifications()
      const { roomCode } = mp.createRoom(playerInfo)
      const next = engine.beginHostedLobby({
        roomCode,
        playMode: 'live',
        host: { id: 'player-1', ...playerInfo },
      })
      saveMembership(roomCode, { playerId: 'player-1', ...playerInfo })
      void asyncGame.seedBackup(next)
    },
    [mp, engine, asyncGame.seedBackup],
  )

  const joinGame = useCallback(
    async (roomCode: string, playerInfo: PlayerInfo) => {
      requestTurnNotifications()
      const code = roomCode.toUpperCase()
      const snap = await fetchAsyncGame(code)
      if (snap?.state.playMode === 'async') {
        await asyncGame.joinAsyncGame(code, playerInfo)
        return
      }

      const { playerId } = mp.joinRoom(code, playerInfo)
      saveMembership(code, { playerId, ...playerInfo })

      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 200))
        const st = engine.getState()
        if (st.roomCode === code && st.phase !== 'menu') return
      }

      if (snap) {
        const ok = await asyncGame.joinAsyncGame(code, playerInfo, playerId)
        if (ok) {
          await asyncGame.persistAction((s) => setPlayMode(s, 'async'))
          mp.disconnect()
          return
        }
        mp.disconnect()
        return
      }

      asyncGame.setError('No table with that code. Ask the host to open it again.')
      mp.disconnect()
    },
    [
      asyncGame.joinAsyncGame,
      asyncGame.persistAction,
      asyncGame.setError,
      engine.getState,
      mp,
    ],
  )

  const startGame = useCallback(
    async (playerName: string, botCount?: number) => {
      if (isAsync) {
        await asyncGame.startGame(playerName, botCount)
        return
      }
      await engine.startGame(playerName, botCount)
    },
    [isAsync, asyncGame, engine],
  )

  const myPlayerId = isAsync
    ? asyncGame.playerId || 'player-1'
    : mp.isMultiplayer
      ? mp.mpState.playerId
      : 'player-1'

  const asyncGames = useSyncExternalStore(subscribeGames, listAsyncGames, getEmptyAsyncGames)

  const mpState = isAsync
    ? {
        role: 'async' as const,
        connected: true,
        roomCode: engine.gameState.roomCode,
        playerId: asyncGame.playerId,
        error: asyncGame.error ?? mp.mpState.error,
      }
    : mp.mpState

  return useMemo(
    () => ({
      updateSettings,
      rebootHand,
      redrawHand,
      submitCard,
      submitCards,
      finishReveal,
      pickWinner,
      nextRound,
      continueFromScoreboard,
      newGame,
      startGame,
      renamePlayer,
      mpState,
      presencePlayers: mp.presencePlayers,
      isMultiplayer: mp.isMultiplayer || isAsync,
      isHost: isAsync ? myPlayerId === 'player-1' : mp.isHost,
      isClient: isAsync ? myPlayerId !== 'player-1' : mp.isClient,
      isAsync,
      myPlayerId,
      hostGame,
      hostAsyncGame: asyncGame.hostAsyncGame,
      joinGame,
      resumeAsyncGame: asyncGame.resumeAsyncGame,
      disconnect: () => {
        asyncGame.disconnect()
        mp.disconnect()
      },
      copyInvite: asyncGame.copyInvite,
      asyncGames,
      asyncError: asyncGame.error,
      botPickWinner: asyncGame.botPickWinner,
    }),
    [
      updateSettings,
      rebootHand,
      redrawHand,
      submitCard,
      submitCards,
      finishReveal,
      pickWinner,
      nextRound,
      continueFromScoreboard,
      newGame,
      startGame,
      renamePlayer,
      mpState,
      mp.presencePlayers,
      mp.isMultiplayer,
      mp.isHost,
      mp.isClient,
      mp.disconnect,
      isAsync,
      myPlayerId,
      hostGame,
      asyncGame.hostAsyncGame,
      asyncGame.resumeAsyncGame,
      asyncGame.copyInvite,
      asyncGame.disconnect,
      asyncGame.error,
      asyncGame.botPickWinner,
      asyncGame.persistAction,
      joinGame,
      asyncGames,
    ],
  )
}
