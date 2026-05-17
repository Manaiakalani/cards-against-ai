'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { GameState, Card } from '@/types/game'
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
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const {
    gameState,
    goToLobby,
    updateSettings,
    startGame,
    redrawHand,
    rebootHand,
    submitCard,
    submitCards,
    botSubmit,
    finishReveal,
    pickWinner,
    botPickWinner,
    nextRound,
    continueFromScoreboard,
    newGame,
  } = useGameState()

  const value = useMemo<GameContextType>(() => ({
    gameState,
    goToLobby,
    updateSettings,
    startGame,
    redrawHand,
    rebootHand,
    submitCard,
    submitCards,
    botSubmit,
    finishReveal,
    pickWinner,
    botPickWinner,
    nextRound,
    continueFromScoreboard,
    newGame,
  }), [
    gameState,
    goToLobby,
    updateSettings,
    startGame,
    redrawHand,
    rebootHand,
    submitCard,
    submitCards,
    botSubmit,
    finishReveal,
    pickWinner,
    botPickWinner,
    nextRound,
    continueFromScoreboard,
    newGame,
  ])

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
