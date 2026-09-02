'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { GameState, Player, Card } from '@/types/game'
import * as engine from '@/lib/gameEngine'

export { BOT_POOL, pickRandomBots } from '@/lib/gameEngine'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => engine.createInitialState())

  const stateRef = useRef(gameState)
  useEffect(() => {
    stateRef.current = gameState
  }, [gameState])

  const selectedDecksRef = useRef(gameState.settings.selectedDecks)
  useEffect(() => {
    selectedDecksRef.current = gameState.settings.selectedDecks
  }, [gameState.settings.selectedDecks])

  const apply = useCallback((fn: (s: GameState) => GameState): GameState => {
    const next = fn(stateRef.current)
    stateRef.current = next
    setGameState(next)
    return next
  }, [])

  const goToLobby = useCallback(() => {
    apply(engine.goToLobby)
  }, [apply])

  const updateSettings = useCallback(
    (updates: Partial<GameState['settings']>) => {
      apply((s) => engine.updateSettings(s, updates))
    },
    [apply],
  )

  const isStartingRef = useRef(false)

  const startGame = useCallback(
    async (playerName: string, botCount: number = 3): Promise<GameState | null> => {
      if (isStartingRef.current) return null
      isStartingRef.current = true
      try {
        const { getAllCards } = await import('@/data/cards')
        const cards = getAllCards(selectedDecksRef.current)
        if (cards.blackCards.length === 0 || cards.whiteCards.length === 0) return null
        return apply((s) => engine.startGame(s, playerName, botCount, cards))
      } finally {
        isStartingRef.current = false
      }
    },
    [apply],
  )

  const redrawHand = useCallback(
    (playerId: string) => {
      apply((s) => engine.redrawHand(s, playerId))
    },
    [apply],
  )

  const rebootHand = useCallback(
    (playerId: string) => {
      apply((s) => engine.rebootHand(s, playerId))
    },
    [apply],
  )

  const submitCards = useCallback(
    (playerId: string, cards: Card[]) => {
      apply((s) => engine.submitCards(s, playerId, cards))
    },
    [apply],
  )

  const submitCard = useCallback(
    (playerId: string, card: Card) => {
      submitCards(playerId, [card])
    },
    [submitCards],
  )

  const botSubmit = useCallback(() => {
    apply(engine.botSubmit)
  }, [apply])

  const finishReveal = useCallback(() => {
    apply(engine.finishReveal)
  }, [apply])

  const pickWinner = useCallback(
    (winnerId: string) => {
      apply((s) => engine.pickWinner(s, winnerId))
    },
    [apply],
  )

  const botPickWinner = useCallback(() => {
    apply(engine.botPickWinner)
  }, [apply])

  const nextRound = useCallback(() => {
    apply(engine.nextRound)
  }, [apply])

  const continueFromScoreboard = useCallback(() => {
    apply(engine.continueFromScoreboard)
  }, [apply])

  const newGame = useCallback(() => {
    apply(engine.newGame)
  }, [apply])

  const addRemotePlayer = useCallback(
    (info: { id: string; name: string; avatar: string; avatarBg: string }) => {
      apply((s) => engine.addRemotePlayer(s, info))
    },
    [apply],
  )

  const removeRemotePlayer = useCallback(
    (playerId: string) => {
      apply((s) => engine.removeRemotePlayer(s, playerId))
    },
    [apply],
  )

  const setRoomCode = useCallback(
    (code: string) => {
      apply((s) => engine.setRoomCode(s, code))
    },
    [apply],
  )

  const setPlayMode = useCallback(
    (mode: GameState['playMode']) => {
      apply((s) => engine.setPlayMode(s, mode))
    },
    [apply],
  )

  const renamePlayer = useCallback(
    (playerId: string, name: string) => {
      apply((s) => engine.renamePlayer(s, playerId, name))
    },
    [apply],
  )

  const beginHostedLobby = useCallback(
    (opts: {
      roomCode: string
      playMode: GameState['playMode']
      host: { id: string; name: string; avatar: string; avatarBg: string }
    }) => {
      return apply((s) => engine.beginHostedLobby(s, opts))
    },
    [apply],
  )

  const setFullState = useCallback((state: GameState) => {
    stateRef.current = state
    setGameState(state)
  }, [])

  const getState = useCallback(() => stateRef.current, [])

  return {
    gameState,
    getState,
    apply,
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
    addRemotePlayer,
    removeRemotePlayer,
    setRoomCode,
    setPlayMode,
    renamePlayer,
    beginHostedLobby,
    setFullState,
  }
}

// Re-export so existing lobby imports keep working
export type { Player }
