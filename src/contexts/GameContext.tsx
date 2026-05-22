'use client'

import { createContext, useContext, useMemo, useCallback, useEffect, ReactNode } from 'react'
import { useGameState } from '@/hooks/useGameState'
import {
  useMultiplayer,
  sanitizeStateForPlayer,
  hydrateClientState,
} from '@/hooks/useMultiplayer'
import {
  GameState,
  Card,
  MultiplayerState,
  PresencePlayer,
  GameAction,
} from '@/types/game'
import { GlobalOverlay } from '@/components/GlobalOverlay'
import { MotionProvider } from '@/components/MotionProvider'

type GameContextType = {
  gameState: GameState
  goToLobby: () => void
  updateSettings: (updates: Partial<GameState['settings']>) => void
  startGame: (playerName: string, botCount?: number) => void
  redrawHand: (playerId: string) => void
  rebootHand: (playerId: string) => void
  submitCard: (playerId: string, card: Card) => void
  submitCards: (playerId: string, cards: Card[]) => void
  botSubmit: () => void
  finishReveal: () => void
  pickWinner: (winnerId: string) => void
  botPickWinner: () => void
  nextRound: () => void
  continueFromScoreboard: () => void
  newGame: () => void
  // Multiplayer
  mpState: MultiplayerState
  presencePlayers: PresencePlayer[]
  isMultiplayer: boolean
  isHost: boolean
  isClient: boolean
  myPlayerId: string
  hostGame: (playerInfo: { name: string; avatar: string; avatarBg: string }) => void
  joinGame: (roomCode: string, playerInfo: { name: string; avatar: string; avatarBg: string }) => void
  disconnect: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const engine = useGameState()

  // Handle remote actions (host receives from clients)
  const handleRemoteAction = useCallback(
    (action: GameAction) => {
      switch (action.type) {
        case 'player:submit':
          if (action.payload?.cards) {
            engine.submitCards(action.playerId, action.payload.cards)
          }
          break
        case 'player:pick_winner':
          if (action.payload?.winnerId) {
            engine.pickWinner(action.payload.winnerId)
          }
          break
        case 'player:reboot':
          engine.rebootHand(action.playerId)
          break
        case 'player:update_settings':
          if (action.payload?.settings) {
            engine.updateSettings(action.payload.settings)
          }
          break
        case 'player:next_round':
          engine.nextRound()
          break
        case 'player:continue':
          engine.continueFromScoreboard()
          break
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

  const myPlayerId = mp.isMultiplayer
    ? mp.mpState.playerId
    : 'player-1'

  const value = useMemo<GameContextType>(
    () => ({
      gameState: engine.gameState,
      goToLobby: engine.goToLobby,
      updateSettings,
      startGame: engine.startGame,
      redrawHand: engine.redrawHand,
      rebootHand,
      submitCard,
      submitCards,
      botSubmit: engine.botSubmit,
      finishReveal,
      pickWinner,
      botPickWinner: engine.botPickWinner,
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
      engine.gameState,
      engine.goToLobby,
      updateSettings,
      engine.startGame,
      engine.redrawHand,
      rebootHand,
      submitCard,
      submitCards,
      engine.botSubmit,
      finishReveal,
      pickWinner,
      engine.botPickWinner,
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

  return (
    <GameContext.Provider value={value}>
      <MotionProvider>
        {children}
        <GlobalOverlay />
      </MotionProvider>
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
