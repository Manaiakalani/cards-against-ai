'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { GameState, Player, Card, Submission } from '@/types/game'
import { getAllCards, shuffle, drawCards } from '@/data/cards'

export const BOT_POOL = [
  // OGs
  { name: 'no_thoughts_ceo', emoji: '🧠', bg: '#7FFFD4' },
  { name: 'delulu_vc', emoji: '💅', bg: '#F08080' },
  { name: 'touch_grass_404', emoji: '🌿', bg: '#FFD700' },
  { name: 'main_character', emoji: '✨', bg: '#DDA0DD' },
  { name: 'slay_intern', emoji: '💀', bg: '#87CEEB' },
  // Tech bros
  { name: 'git_push_force', emoji: '💥', bg: '#FF6B6B' },
  { name: 'sudo_make_coffee', emoji: '☕', bg: '#D2B48C' },
  { name: 'localhost_3000', emoji: '🖥️', bg: '#98FB98' },
  { name: 'dev_null', emoji: '🕳️', bg: '#778899' },
  // Chronically online
  { name: 'ratio_queen', emoji: '👑', bg: '#FFD700' },
  { name: 'unhinged_reply_guy', emoji: '🔥', bg: '#FF4500' },
  { name: 'parasocial_andy', emoji: '📱', bg: '#BA55D3' },
  { name: 'doom_scroller', emoji: '📜', bg: '#4682B4' },
  // Startup culture
  { name: 'pivot_to_ai', emoji: '🤖', bg: '#00CED1' },
  { name: 'series_a_ghost', emoji: '👻', bg: '#E6E6FA' },
  { name: 'equity_only_pay', emoji: '📉', bg: '#FFA07A' },
  // Vibes
  { name: 'chaotic_neutral', emoji: '🎲', bg: '#FF69B4' },
  { name: 'npc_energy', emoji: '🧍', bg: '#F0E68C' },
  { name: 'sigma_grindset', emoji: '🐺', bg: '#708090' },
  { name: 'emotional_damage', emoji: '💔', bg: '#DC143C' },
]

export function pickRandomBots(count: number) {
  const shuffled = [...BOT_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const HAND_SIZE = 7

function createBot(index: number, roster: typeof BOT_POOL): Player {
  const bot = roster[index % roster.length]
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
      selectedDecks: ['brainrot', 'terminally-online', 'gen-z', 'millennial', 'ai-fever', 'gaming', 'crypto', 'startup'],
      timerEnabled: false,
      timerSeconds: 60,
      winnersPick: false,
      rebootEnabled: false,
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

  const updateSettings = useCallback((updates: Partial<GameState['settings']>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }))
  }, [])

  // Ref for selectedDecks to keep startGame callback stable
  const selectedDecksRef = useRef(gameState.settings.selectedDecks)
  useEffect(() => { selectedDecksRef.current = gameState.settings.selectedDecks }, [gameState.settings.selectedDecks])

  const startGame = useCallback((playerName: string, botCount: number = 3) => {
    const { blackCards, whiteCards } = getAllCards(selectedDecksRef.current)
    if (blackCards.length === 0 || whiteCards.length === 0) return

    let shuffledWhite = shuffle(whiteCards)
    const shuffledBlack = shuffle(blackCards)

    setGameState(prev => {
      // Keep existing human players from lobby (host + remote)
      const existingHumans = prev.players.filter(p => !p.isBot)

      let human: Player
      if (existingHumans.length > 0 && existingHumans[0].id === 'player-1') {
        // Host already in player list — update name
        human = { ...existingHumans[0], name: playerName }
      } else {
        human = createHumanPlayer(playerName)
      }

      const remotes = existingHumans.filter(p => p.id !== 'player-1')
      const roster = pickRandomBots(botCount)
      const bots = Array.from({ length: botCount }, (_, i) => createBot(i, roster))
      const allPlayers = [human, ...remotes, ...bots]

      // Deal hands
      for (const player of allPlayers) {
        const { drawn, remaining } = drawCards(shuffledWhite, HAND_SIZE)
        player.hand = drawn
        shuffledWhite = remaining
      }

      // First czar: prefer a bot so human plays first, fallback to second player
      const firstCzarIdx = allPlayers.findIndex(p => p.isBot)
      const czarIdx = firstCzarIdx >= 0 ? firstCzarIdx : (allPlayers.length > 1 ? 1 : 0)
      allPlayers[czarIdx].isCardCzar = true
      const firstBlack = shuffledBlack[0]

      setBlackCardPool(shuffledBlack.slice(1))
      setWhiteCardPool(shuffledWhite)

      return {
        ...prev,
        phase: 'playing',
        currentRound: 1,
        currentBlackCard: firstBlack,
        players: allPlayers,
        submissions: [],
        roundWinner: null,
        czarId: allPlayers[czarIdx].id,
      }
    })
  }, [])

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

  // Reboot the Universe: spend 1 point to redraw entire hand
  const rebootHand = useCallback((playerId: string) => {
    setGameState(prev => {
      if (prev.phase !== 'playing') return prev
      if (!prev.settings.rebootEnabled) return prev
      if (prev.submissions.some(s => s.playerId === playerId)) return prev

      const player = prev.players.find(p => p.id === playerId)
      if (!player || player.score < 1) return prev

      let pool = [...whitePoolRef.current, ...player.hand]
      pool = shuffle(pool)
      const { drawn, remaining } = drawCards(pool, HAND_SIZE)
      setWhiteCardPool(remaining)

      const newPlayers = prev.players.map(p =>
        p.id === playerId
          ? { ...p, hand: drawn, selectedCard: null, score: p.score - 1 }
          : p
      )

      return { ...prev, players: newPlayers }
    })
  }, [])

  const submitCards = useCallback((playerId: string, cards: Card[]) => {
    setGameState(prev => {
      const alreadySubmitted = prev.submissions.some(s => s.playerId === playerId)
      if (alreadySubmitted) return prev

      const newSubmissions: Submission[] = [...prev.submissions, { playerId, cards }]

      // Remove cards from player's hand
      const cardIds = new Set(cards.map(c => c.id))
      const newPlayers = prev.players.map(p =>
        p.id === playerId
          ? { ...p, hand: p.hand.filter(c => !cardIds.has(c.id)), selectedCard: cards[0] }
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
        phase: allSubmitted ? 'revealing' : prev.phase,
      }
    })
  }, [])

  // Backward-compatible single-card submit
  const submitCard = useCallback((playerId: string, card: Card) => {
    submitCards(playerId, [card])
  }, [submitCards])

  const botSubmit = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== 'playing') return prev

      const blanks = prev.currentBlackCard?.blanks ?? 1
      const botPlayers = prev.players.filter(p => p.isBot && !p.isCardCzar)
      const newSubmissions: Submission[] = [...prev.submissions]
      let newPlayers = [...prev.players]

      for (const bot of botPlayers) {
        if (newSubmissions.some(s => s.playerId === bot.id)) continue
        if (bot.hand.length < blanks) continue

        // Pick random cards for the number of blanks
        const shuffledHand = shuffle(bot.hand)
        const selectedCards = shuffledHand.slice(0, blanks)
        const selectedIds = new Set(selectedCards.map(c => c.id))

        newSubmissions.push({ playerId: bot.id, cards: selectedCards })
        newPlayers = newPlayers.map(p =>
          p.id === bot.id
            ? { ...p, hand: p.hand.filter(c => !selectedIds.has(c.id)), selectedCard: selectedCards[0] }
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
        phase: allSubmitted ? 'revealing' : prev.phase,
      }
    })
  }, [])

  // Move from revealing to judging
  const finishReveal = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== 'revealing') return prev
      return { ...prev, phase: 'judging' }
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
      winningCards: winningSubmission.cards,
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

      // Winner's Pick: round winner becomes next czar, else rotate
      let nextCzarIndex: number
      if (prev.settings.winnersPick && prev.roundWinner) {
        nextCzarIndex = prev.players.findIndex(p => p.id === prev.roundWinner)
        if (nextCzarIndex === -1) nextCzarIndex = (currentCzarIndex + 1) % playerCount
      } else {
        nextCzarIndex = (currentCzarIndex + 1) % playerCount
      }

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

  /** Add a remote human player during lobby phase */
  const addRemotePlayer = useCallback(
    (info: { id: string; name: string; avatar: string; avatarBg: string }) => {
      setGameState((prev) => {
        if (prev.phase !== 'lobby') return prev
        if (prev.players.some((p) => p.id === info.id)) return prev
        if (prev.players.length >= prev.settings.maxPlayers) return prev
        const newPlayer: Player = {
          id: info.id,
          name: info.name,
          score: 0,
          isHost: false,
          isCardCzar: false,
          isConnected: true,
          avatar: info.avatar,
          avatarBg: info.avatarBg,
          hand: [],
          selectedCard: null,
          isBot: false,
        }
        return { ...prev, players: [...prev.players, newPlayer] }
      })
    },
    []
  )

  /** Remove a remote player (disconnect) */
  const removeRemotePlayer = useCallback((playerId: string) => {
    setGameState((prev) => {
      // In lobby, remove entirely
      if (prev.phase === 'lobby') {
        return {
          ...prev,
          players: prev.players.filter((p) => p.id !== playerId),
        }
      }
      // During game, mark disconnected
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, isConnected: false } : p
        ),
      }
    })
  }, [])

  /** Override the room code (used when host creates a multiplayer room) */
  const setRoomCode = useCallback((code: string) => {
    setGameState((prev) => ({ ...prev, roomCode: code }))
  }, [])

  /** Direct state setter for client mode — receives host-broadcast state */
  const setFullState = useCallback((state: GameState) => {
    setGameState(state)
  }, [])

  return {
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
    addRemotePlayer,
    removeRemotePlayer,
    setRoomCode,
    setFullState,
  }
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
