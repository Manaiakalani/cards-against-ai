'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { GameState, Player, Card } from '@/types/game'
import { getAllCards, shuffle, drawCards } from '@/data/cards'

const BOT_NAMES = [
  { name: 'no_thoughts_ceo', emoji: '🧠', bg: '#7FFFD4' },
  { name: 'delulu_vc', emoji: '💅', bg: '#F08080' },
  { name: 'touch_grass_404', emoji: '🌿', bg: '#FFD700' },
  { name: 'main_character', emoji: '✨', bg: '#DDA0DD' },
  { name: 'slay_intern', emoji: '💀', bg: '#87CEEB' },
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
    phase: 'menu',
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
      selectedDecks: ['brainrot', 'terminally-online', 'gen-z', 'millennial', 'ai-fever', 'gaming'],
    },
    roomCode: generateRoomCode(),
    czarId: '',
  })

  const [blackCardPool, setBlackCardPool] = useState<Card[]>([])
  const [whiteCardPool, setWhiteCardPool] = useState<Card[]>([])

  // Refs for latest pool values to avoid stale closures in callbacks
  const blackPoolRef = useRef(blackCardPool)
  const whitePoolRef = useRef(whiteCardPool)

  // Sync refs in effect (not during render) per React rules
  useEffect(() => { blackPoolRef.current = blackCardPool }, [blackCardPool])
  useEffect(() => { whitePoolRef.current = whiteCardPool }, [whiteCardPool])
  const goToLobby = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'lobby' }))
  }, [])

  const startGame = useCallback((playerName: string, botCount: number = 3) => {
    const { blackCards, whiteCards } = getAllCards(gameState.settings.selectedDecks)
    if (blackCards.length === 0 || whiteCards.length === 0) return

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

    // First czar is a bot so the human gets to play right away
    allPlayers[1].isCardCzar = true
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
      czarId: allPlayers[1].id,
    }))
  }, [gameState.settings.selectedDecks])

  const redrawHand = useCallback((playerId: string) => {
    setGameState(prev => {
      if (prev.phase !== 'playing') return prev
      if (prev.submissions.some(s => s.playerId === playerId)) return prev

      const player = prev.players.find(p => p.id === playerId)
      if (!player) return prev

      // Use ref for latest pool value to avoid stale closure
      let pool = [...whitePoolRef.current, ...player.hand]
      pool = shuffle(pool)
      const { drawn, remaining } = drawCards(pool, HAND_SIZE)
      setWhiteCardPool(remaining)

      const newPlayers = prev.players.map(p =>
        p.id === playerId
          ? { ...p, hand: drawn, selectedCard: null }
          : p
      )

      return { ...prev, players: newPlayers }
    })
  }, [])

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
      const newSubmissions = [...prev.submissions]
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

  function resolveWinner(prev: GameState, winnerId: string): GameState {
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
  }

  const pickWinner = useCallback((winnerId: string) => {
    setGameState(prev => resolveWinner(prev, winnerId))
  }, [])

  const botPickWinner = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== 'judging') return prev
      if (prev.submissions.length === 0) return prev
      const randomIdx = Math.floor(Math.random() * prev.submissions.length)
      return resolveWinner(prev, prev.submissions[randomIdx].playerId)
    })
  }, [])

  // Results → Scoreboard (show standings)
  const nextRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'scoreboard',
    }))
  }, [])

  // Scoreboard → Playing (deal next round)
  const continueFromScoreboard = useCallback(() => {
    setGameState(prev => {
      const playerCount = prev.players.length
      const currentCzarIndex = prev.players.findIndex(p => p.id === prev.czarId)
      const nextCzarIndex = (currentCzarIndex + 1) % playerCount

      // Use refs for latest pool values to avoid stale closure
      if (blackPoolRef.current.length === 0) return prev
      const nextBlack = blackPoolRef.current[0]
      setBlackCardPool(blackPoolRef.current.slice(1))

      let pool = [...whitePoolRef.current]
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
  }, [])

  const newGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'menu',
      currentRound: 0,
      currentBlackCard: null,
      players: [],
      submissions: [],
      roundWinner: null,
      roundHistory: [],
      czarId: '',
      roomCode: generateRoomCode(),
    }))
    setBlackCardPool([])
    setWhiteCardPool([])
  }, [])

  return {
    gameState,
    goToLobby,
    startGame,
    redrawHand,
    submitCard,
    botSubmit,
    pickWinner,
    botPickWinner,
    nextRound,
    continueFromScoreboard,
    newGame,
  }
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
