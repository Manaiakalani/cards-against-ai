'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { GameState, Card } from '@/types/game'
import { GlobalOverlay } from '@/components/GlobalOverlay'

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
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGameState()

  return (
    <GameContext.Provider value={game}>
      {children}
      <GlobalOverlay />
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
