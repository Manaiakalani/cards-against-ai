'use client'

import { createContext, useContext, useCallback, useMemo, ReactNode } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useNetworkedGame } from '@/hooks/useNetworkedGame'
import {
  GameState,
  Card,
  MultiplayerState,
  PresencePlayer,
  PlayerInfo,
  AsyncGameSummary,
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
  renamePlayer: (playerId: string, name: string) => void
  // Multiplayer
  mpState: MultiplayerState
  presencePlayers: PresencePlayer[]
  isMultiplayer: boolean
  isHost: boolean
  isClient: boolean
  isAsync: boolean
  myPlayerId: string
  hostGame: (playerInfo: PlayerInfo) => void
  hostAsyncGame: (playerInfo: PlayerInfo) => void
  joinGame: (roomCode: string, playerInfo: PlayerInfo) => void | Promise<void>
  resumeAsyncGame: (roomCode: string) => void
  disconnect: () => void
  copyInvite: () => Promise<boolean>
  asyncGames: AsyncGameSummary[]
  asyncError: string | null
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const engine = useGameState()
  const net = useNetworkedGame(engine)

  const botSubmit = useCallback(() => {
    if (net.isAsync) return
    if (!net.isClient) engine.botSubmit()
  }, [net.isAsync, net.isClient, engine])

  const botPickWinner = useCallback(() => {
    if (net.isAsync) {
      net.botPickWinner()
      return
    }
    if (!net.isClient) engine.botPickWinner()
  }, [net, engine])

  const value = useMemo<GameContextType>(
    () => ({
      gameState: engine.gameState,
      goToLobby: engine.goToLobby,
      updateSettings: net.updateSettings,
      startGame: net.startGame,
      redrawHand: net.redrawHand,
      rebootHand: net.rebootHand,
      submitCard: net.submitCard,
      submitCards: net.submitCards,
      botSubmit,
      finishReveal: net.finishReveal,
      pickWinner: net.pickWinner,
      botPickWinner,
      nextRound: net.nextRound,
      continueFromScoreboard: net.continueFromScoreboard,
      newGame: net.newGame,
      renamePlayer: net.renamePlayer,
      mpState: net.mpState,
      presencePlayers: net.presencePlayers,
      isMultiplayer: net.isMultiplayer,
      isHost: net.isHost,
      isClient: net.isClient,
      isAsync: net.isAsync,
      myPlayerId: net.myPlayerId,
      hostGame: net.hostGame,
      hostAsyncGame: net.hostAsyncGame,
      joinGame: net.joinGame,
      resumeAsyncGame: net.resumeAsyncGame,
      disconnect: net.disconnect,
      copyInvite: net.copyInvite,
      asyncGames: net.asyncGames,
      asyncError: net.asyncError,
    }),
    [
      engine.gameState,
      engine.goToLobby,
      botSubmit,
      botPickWinner,
      net,
    ],
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
