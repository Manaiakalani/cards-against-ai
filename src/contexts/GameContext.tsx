'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { GameState, Card } from '@/types/game'

type GameContextType = {
  gameState: GameState
  goToLobby: () => void
  startGame: (playerName: string, botCount?: number) => void
  submitCard: (playerId: string, card: Card) => void
  botSubmit: () => void
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
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
