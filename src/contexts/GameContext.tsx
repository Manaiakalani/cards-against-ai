'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useNetworkedGame } from '@/hooks/useNetworkedGame'
import {
  GameState,
  Card,
  MultiplayerState,
  PresencePlayer,
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
  // All multiplayer wiring (remote-action reducer, state broadcast, and the
  // client/host-aware proxied actions) lives in this hook — see
  // useNetworkedGame.ts for details.
  const net = useNetworkedGame(engine)

  const value = useMemo<GameContextType>(
    () => ({
      gameState: engine.gameState,
      goToLobby: engine.goToLobby,
      updateSettings: net.updateSettings,
      startGame: engine.startGame,
      redrawHand: engine.redrawHand,
      rebootHand: net.rebootHand,
      submitCard: net.submitCard,
      submitCards: net.submitCards,
      botSubmit: engine.botSubmit,
      finishReveal: net.finishReveal,
      pickWinner: net.pickWinner,
      botPickWinner: engine.botPickWinner,
      nextRound: net.nextRound,
      continueFromScoreboard: net.continueFromScoreboard,
      newGame: net.newGame,
      // Multiplayer
      mpState: net.mpState,
      presencePlayers: net.presencePlayers,
      isMultiplayer: net.isMultiplayer,
      isHost: net.isHost,
      isClient: net.isClient,
      myPlayerId: net.myPlayerId,
      hostGame: net.hostGame,
      joinGame: net.joinGame,
      disconnect: net.disconnect,
    }),
    [
      engine.gameState,
      engine.goToLobby,
      engine.startGame,
      engine.redrawHand,
      engine.botSubmit,
      engine.botPickWinner,
      net,
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
