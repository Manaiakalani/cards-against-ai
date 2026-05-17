'use client'

import { useState, useCallback } from 'react'
import { GameState, GamePhase, Player, Card } from '@/types/game'
import { getAllCards, shuffle, drawCards } from '@/data/cards'

const BOT_NAMES = [
  { name: 'VC_DARREN', emoji: '📉', bg: '#7FFFD4' },
  { name: 'GPT_Slayer', emoji: '🤖', bg: '#F08080' },
  { name: 'CryptoBro88', emoji: '₿', bg: '#FFD700' },
  { name: 'AgileCoach', emoji: '☕', bg: '#DDA0DD' },
  { name: 'Intern_Ex', emoji: '🫠', bg: '#87CEEB' },
]

const HAND_SIZE = 7

function createBot(index: number): Player {
  const bot = BOT_NAMES[index % BOT_NAMES.length]
  return {
    id: `bot-${index}`,
    name: bot.name,
    score: 0,
    isHost: false,
    isCardCzar: false,
    isConnected: true,
    avatar: bot.emoji,
    avatarBg: bot.bg,
    hand: [],
    selectedCard: null,
    isBot: true,
  }
}

function createHumanPlayer(name: string): Player {
  return {
    id: 'player-1',
    name,
    score: 0,
    isHost: true,
    isCardCzar: false,
    isConnected: true,
    avatar: '🦄',
    avatarBg: '#FFD700',
    hand: [],
    selectedCard: null,
    isBot: false,
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'lobby',
    currentRound: 0,
    currentBlackCard: null,
    players: [],
    submissions: [],
    roundWinner: null,
    roundHistory: [],
    settings: {
      maxPlayers: 6,
      roundTime: 90,
      winningScore: 7,
      selectedDecks: ['silicon-valley', 'tech-culture', 'gen-z', 'millennial', 'ai-crypto', 'gaming'],
    },
    roomCode: generateRoomCode(),
    czarId: '',
  })

  const [blackCardPool, setBlackCardPool] = useState<Card[]>([])
  const [whiteCardPool, setWhiteCardPool] = useState<Card[]>([])

  const startGame = useCallback((playerName: string, botCount: number = 3) => {
    const { blackCards, whiteCards } = getAllCards(gameState.settings.selectedDecks)
    let shuffledWhite = shuffle(whiteCards)
    const shuffledBlack = shuffle(blackCards)

    const human = createHumanPlayer(playerName)
    const bots = Array.from({ length: botCount }, (_, i) => createBot(i))
    const allPlayers = [human, ...bots]

    // Deal hands
    for (const player of allPlayers) {
      const { drawn, remaining } = drawCards(shuffledWhite, HAND_SIZE)
      player.hand = drawn
      shuffledWhite = remaining
    }

    // First czar is the human
    allPlayers[0].isCardCzar = true
    const firstBlack = shuffledBlack[0]

    setBlackCardPool(shuffledBlack.slice(1))
    setWhiteCardPool(shuffledWhite)

    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      currentRound: 1,
      currentBlackCard: firstBlack,
      players: allPlayers,
      submissions: [],
      roundWinner: null,
      czarId: allPlayers[0].id,
    }))
  }, [gameState.settings.selectedDecks])

  const submitCard = useCallback((playerId: string, card: Card) => {
    setGameState(prev => {
      const alreadySubmitted = prev.submissions.some(s => s.playerId === playerId)
      if (alreadySubmitted) return prev

      const newSubmissions = [...prev.submissions, { playerId, card }]

      // Remove card from player's hand
      const newPlayers = prev.players.map(p =>
        p.id === playerId
          ? { ...p, hand: p.hand.filter(c => c.id !== card.id), selectedCard: card }
          : p
      )

      // Check if all non-czar players have submitted
      const nonCzarPlayers = newPlayers.filter(p => !p.isCardCzar)
      const allSubmitted = nonCzarPlayers.every(p =>
        newSubmissions.some(s => s.playerId === p.id)
      )

      return {
        ...prev,
        players: newPlayers,
        submissions: newSubmissions,
        phase: allSubmitted ? 'judging' : prev.phase,
      }
    })
  }, [])

  const botSubmit = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== 'playing') return prev

      const botPlayers = prev.players.filter(p => p.isBot && !p.isCardCzar)
      let newSubmissions = [...prev.submissions]
      let newPlayers = [...prev.players]

      for (const bot of botPlayers) {
        if (newSubmissions.some(s => s.playerId === bot.id)) continue
        if (bot.hand.length === 0) continue

        const randomCard = bot.hand[Math.floor(Math.random() * bot.hand.length)]
        newSubmissions.push({ playerId: bot.id, card: randomCard })
        newPlayers = newPlayers.map(p =>
          p.id === bot.id
            ? { ...p, hand: p.hand.filter(c => c.id !== randomCard.id), selectedCard: randomCard }
            : p
        )
      }

      const nonCzarPlayers = newPlayers.filter(p => !p.isCardCzar)
      const allSubmitted = nonCzarPlayers.every(p =>
        newSubmissions.some(s => s.playerId === p.id)
      )

      return {
        ...prev,
        players: newPlayers,
        submissions: newSubmissions,
        phase: allSubmitted ? 'judging' : prev.phase,
      }
    })
  }, [])

  const pickWinner = useCallback((winnerId: string) => {
    setGameState(prev => {
      const winningSubmission = prev.submissions.find(s => s.playerId === winnerId)
      if (!winningSubmission || !prev.currentBlackCard) return prev

      const newPlayers = prev.players.map(p =>
        p.id === winnerId ? { ...p, score: p.score + 1 } : p
      )

      const roundResult = {
        blackCard: prev.currentBlackCard,
        winningCard: winningSubmission.card,
        winnerId,
        czarId: prev.czarId,
        round: prev.currentRound,
      }

      const winner = newPlayers.find(p => p.id === winnerId)
      const gameOver = winner && winner.score >= prev.settings.winningScore

      return {
        ...prev,
        players: newPlayers,
        roundWinner: winnerId,
        roundHistory: [...prev.roundHistory, roundResult],
        phase: gameOver ? 'ended' : 'results',
      }
    })
  }, [])

  const botPickWinner = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== 'judging') return prev
      if (prev.submissions.length === 0) return prev

      const randomIdx = Math.floor(Math.random() * prev.submissions.length)
      const winnerId = prev.submissions[randomIdx].playerId

      const winningSubmission = prev.submissions[randomIdx]
      if (!prev.currentBlackCard) return prev

      const newPlayers = prev.players.map(p =>
        p.id === winnerId ? { ...p, score: p.score + 1 } : p
      )

      const roundResult = {
        blackCard: prev.currentBlackCard,
        winningCard: winningSubmission.card,
        winnerId,
        czarId: prev.czarId,
        round: prev.currentRound,
      }

      const winner = newPlayers.find(p => p.id === winnerId)
      const gameOver = winner && winner.score >= prev.settings.winningScore

      return {
        ...prev,
        players: newPlayers,
        roundWinner: winnerId,
        roundHistory: [...prev.roundHistory, roundResult],
        phase: gameOver ? 'ended' : 'results',
      }
    })
  }, [])

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const playerCount = prev.players.length
      const currentCzarIndex = prev.players.findIndex(p => p.id === prev.czarId)
      const nextCzarIndex = (currentCzarIndex + 1) % playerCount

      // Draw new black card
      if (blackCardPool.length === 0) return prev
      const nextBlack = blackCardPool[0]
      setBlackCardPool(pool => pool.slice(1))

      // Replenish hands
      let pool = [...whiteCardPool]
      const newPlayers = prev.players.map((p, i) => {
        const cardsNeeded = HAND_SIZE - p.hand.length
        const { drawn, remaining } = drawCards(pool, cardsNeeded)
        pool = remaining
        return {
          ...p,
          hand: [...p.hand, ...drawn],
          selectedCard: null,
          isCardCzar: i === nextCzarIndex,
        }
      })
      setWhiteCardPool(pool)

      return {
        ...prev,
        phase: 'playing',
        currentRound: prev.currentRound + 1,
        currentBlackCard: nextBlack,
        players: newPlayers,
        submissions: [],
        roundWinner: null,
        czarId: newPlayers[nextCzarIndex].id,
      }
    })
  }, [blackCardPool, whiteCardPool])

  const newGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'lobby',
      currentRound: 0,
      currentBlackCard: null,
      players: [],
      submissions: [],
      roundWinner: null,
      roundHistory: [],
      czarId: '',
    }))
    setBlackCardPool([])
    setWhiteCardPool([])
  }, [])

  return {
    gameState,
    startGame,
    submitCard,
    botSubmit,
    pickWinner,
    botPickWinner,
    nextRound,
    newGame,
  }
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
