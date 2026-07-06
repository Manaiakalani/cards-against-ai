'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useMultiplayer, hydrateClientState } from '@/hooks/useMultiplayer'
import type { useGameState } from '@/hooks/useGameState'
import type { Card, GameAction, GameState } from '@/types/game'

type GameEngine = ReturnType<typeof useGameState>

/**
 * Wraps the local `useGameState` engine with multiplayer awareness.
 *
 * In client mode, player-facing actions are sent to the host over the
 * Supabase Realtime channel instead of mutating local state directly; in
 * host/local mode they call straight through to the engine. This hook also
 * owns the host's remote-action reducer (`handleRemoteAction`) and the
 * effect that broadcasts state to clients whenever it changes.
 *
 * Split out of GameContext.tsx so the context/provider itself stays thin —
 * everything network-related lives here, and GameContext just wires this
 * hook's output into the public GameContextType.
 */
export function useNetworkedGame(engine: GameEngine) {
  // Handle remote actions (host receives from clients)
  const handleRemoteAction = useCallback(
    (action: GameAction) => {
      switch (action.type) {
        case 'player:submit':
          engine.submitCards(action.playerId, action.payload.cards)
          break
        case 'player:pick_winner':
          engine.pickWinner(action.payload.winnerId)
          break
        case 'player:reboot':
          engine.rebootHand(action.playerId)
          break
        case 'player:update_settings':
          engine.updateSettings(action.payload.settings)
          break
        case 'player:next_round':
          engine.nextRound()
          break
        case 'player:continue':
          engine.continueFromScoreboard()
          break
        case 'player:join':
        case 'player:leave':
        case 'player:start_game':
        case 'player:new_game':
          // Not sent over the wire in this app: joins/leaves are driven by
          // Supabase Presence, and start/new-game are host-initiated only.
          // Listed so the switch stays exhaustive if that ever changes.
          break
        default: {
          // Compile-time guarantee: if a new GameActionType is added without
          // a case above, this line fails to type-check.
          const unhandled: never = action
          void unhandled
        }
      }
    },
    [engine]
  )

  const mp = useMultiplayer({
    onStateUpdate: (broadcast) => {
      // Client receives state from host
      if (mp.mpState.role === 'client') {
        engine.setFullState(hydrateClientState(broadcast))
      }
    },
    onAction: (action) => {
      // Host receives actions from clients
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
      // Client: detect host leaving
      if (mp.mpState.role === 'client' && player.isHost) {
        engine.setFullState({
          ...engine.gameState,
          phase: 'menu',
        })
        mp.disconnect()
      }
    },
  })

  // Broadcast state to clients whenever game state changes (host only)
  useEffect(() => {
    if (mp.isHost && mp.mpState.connected) {
      mp.broadcastState(engine.gameState)
    }
  }, [engine.gameState, mp.isHost, mp.mpState.connected, mp.broadcastState])

  // Proxied actions: in client mode, send network action instead of local engine
  const submitCards = useCallback(
    (playerId: string, cards: Card[]) => {
      if (mp.isClient) {
        mp.sendAction({ type: 'player:submit', playerId, payload: { cards } })
      } else {
        engine.submitCards(playerId, cards)
      }
    },
    [mp.isClient, mp.sendAction, engine.submitCards]
  )

  const submitCard = useCallback(
    (playerId: string, card: Card) => submitCards(playerId, [card]),
    [submitCards]
  )

  const pickWinner = useCallback(
    (winnerId: string) => {
      if (mp.isClient) {
        mp.sendAction({
          type: 'player:pick_winner',
          playerId: mp.mpState.playerId,
          payload: { winnerId },
        })
      } else {
        engine.pickWinner(winnerId)
      }
    },
    [mp.isClient, mp.sendAction, mp.mpState.playerId, engine.pickWinner]
  )

  const rebootHand = useCallback(
    (playerId: string) => {
      if (mp.isClient) {
        mp.sendAction({ type: 'player:reboot', playerId })
      } else {
        engine.rebootHand(playerId)
      }
    },
    [mp.isClient, mp.sendAction, engine.rebootHand]
  )

  const nextRound = useCallback(() => {
    if (mp.isClient) {
      mp.sendAction({
        type: 'player:next_round',
        playerId: mp.mpState.playerId,
      })
    } else {
      engine.nextRound()
    }
  }, [mp.isClient, mp.sendAction, mp.mpState.playerId, engine.nextRound])

  const continueFromScoreboard = useCallback(() => {
    if (mp.isClient) {
      mp.sendAction({
        type: 'player:continue',
        playerId: mp.mpState.playerId,
      })
    } else {
      engine.continueFromScoreboard()
    }
  }, [mp.isClient, mp.sendAction, mp.mpState.playerId, engine.continueFromScoreboard])

  const finishReveal = useCallback(() => {
    // Only host can advance phases
    if (mp.isClient) return
    engine.finishReveal()
  }, [mp.isClient, engine.finishReveal])

  const updateSettings = useCallback(
    (updates: Partial<GameState['settings']>) => {
      if (mp.isClient) {
        mp.sendAction({
          type: 'player:update_settings',
          playerId: mp.mpState.playerId,
          payload: { settings: updates },
        })
      } else {
        engine.updateSettings(updates)
      }
    },
    [mp.isClient, mp.sendAction, mp.mpState.playerId, engine.updateSettings]
  )

  const newGame = useCallback(() => {
    mp.disconnect()
    engine.newGame()
  }, [mp.disconnect, engine.newGame])

  // Multiplayer-specific actions
  const hostGame = useCallback(
    (playerInfo: { name: string; avatar: string; avatarBg: string }) => {
      const { roomCode } = mp.createRoom(playerInfo)
      engine.setRoomCode(roomCode)
      engine.goToLobby()
      // Add host to player list immediately
      engine.addRemotePlayer({
        id: 'player-1',
        ...playerInfo,
      })
    },
    [mp.createRoom, engine.setRoomCode, engine.goToLobby, engine.addRemotePlayer]
  )

  const joinGame = useCallback(
    (
      roomCode: string,
      playerInfo: { name: string; avatar: string; avatarBg: string }
    ) => {
      mp.joinRoom(roomCode, playerInfo)
    },
    [mp.joinRoom]
  )

  const myPlayerId = mp.isMultiplayer ? mp.mpState.playerId : 'player-1'

  return useMemo(
    () => ({
      updateSettings,
      rebootHand,
      submitCard,
      submitCards,
      finishReveal,
      pickWinner,
      nextRound,
      continueFromScoreboard,
      newGame,
      // Multiplayer
      mpState: mp.mpState,
      presencePlayers: mp.presencePlayers,
      isMultiplayer: mp.isMultiplayer,
      isHost: mp.isHost,
      isClient: mp.isClient,
      myPlayerId,
      hostGame,
      joinGame,
      disconnect: mp.disconnect,
    }),
    [
      updateSettings,
      rebootHand,
      submitCard,
      submitCards,
      finishReveal,
      pickWinner,
      nextRound,
      continueFromScoreboard,
      newGame,
      mp.mpState,
      mp.presencePlayers,
      mp.isMultiplayer,
      mp.isHost,
      mp.isClient,
      myPlayerId,
      hostGame,
      joinGame,
      mp.disconnect,
    ]
  )
}
