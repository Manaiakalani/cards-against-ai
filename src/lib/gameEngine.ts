import type { Card, GameSettings, GameState, Player, PlayMode, Submission } from '@/types/game'
import { drawCards, shuffle } from '@/data/cardUtils'

export const HAND_SIZE = 7

export const DEFAULT_SETTINGS: GameSettings = {
  maxPlayers: 6,
  roundTime: 90,
  winningScore: 7,
  selectedDecks: [
    'brainrot',
    'terminally-online',
    'gen-z',
    'millennial',
    'ai-fever',
    'gaming',
    'crypto',
    'startup',
    'intuned',
  ],
  timerEnabled: false,
  timerSeconds: 60,
  winnersPick: false,
  rebootEnabled: false,
}

export const BOT_POOL = [
  { name: 'no_thoughts_ceo', emoji: '🧠', bg: '#7FFFD4' },
  { name: 'delulu_vc', emoji: '💅', bg: '#F08080' },
  { name: 'touch_grass_404', emoji: '🌿', bg: '#FFD700' },
  { name: 'main_character', emoji: '✨', bg: '#DDA0DD' },
  { name: 'slay_intern', emoji: '💀', bg: '#87CEEB' },
  { name: 'git_push_force', emoji: '💥', bg: '#FF6B6B' },
  { name: 'sudo_make_coffee', emoji: '☕', bg: '#D2B48C' },
  { name: 'localhost_3000', emoji: '🖥️', bg: '#98FB98' },
  { name: 'dev_null', emoji: '🕳️', bg: '#778899' },
  { name: 'ratio_queen', emoji: '👑', bg: '#FFD700' },
  { name: 'unhinged_reply_guy', emoji: '🔥', bg: '#FF4500' },
  { name: 'parasocial_andy', emoji: '📱', bg: '#BA55D3' },
  { name: 'doom_scroller', emoji: '📜', bg: '#4682B4' },
  { name: 'pivot_to_ai', emoji: '🤖', bg: '#00CED1' },
  { name: 'series_a_ghost', emoji: '👻', bg: '#E6E6FA' },
  { name: 'equity_only_pay', emoji: '📉', bg: '#FFA07A' },
  { name: 'chaotic_neutral', emoji: '🎲', bg: '#FF69B4' },
  { name: 'npc_energy', emoji: '🧍', bg: '#F0E68C' },
  { name: 'sigma_grindset', emoji: '🐺', bg: '#708090' },
  { name: 'emotional_damage', emoji: '💔', bg: '#DC143C' },
]

export function pickRandomBots(count: number) {
  const shuffled = [...BOT_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

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

export function createHumanPlayer(
  name: string,
  extras?: Partial<Pick<Player, 'id' | 'avatar' | 'avatarBg' | 'isHost'>>,
): Player {
  return {
    id: extras?.id ?? 'player-1',
    name,
    score: 0,
    isHost: extras?.isHost ?? true,
    isCardCzar: false,
    isConnected: true,
    avatar: extras?.avatar ?? '🦄',
    avatarBg: extras?.avatarBg ?? '#FFD700',
    hand: [],
    selectedCard: null,
    isBot: false,
  }
}

export function createInitialState(): GameState {
  return {
    phase: 'menu',
    currentRound: 0,
    currentBlackCard: null,
    players: [],
    submissions: [],
    roundWinner: null,
    roundHistory: [],
    settings: { ...DEFAULT_SETTINGS },
    roomCode: generateRoomCode(),
    czarId: '',
    playMode: 'local',
    blackCardPool: [],
    whiteCardPool: [],
  }
}

function clonePlayer(p: Player): Player {
  return { ...p, hand: [...p.hand], selectedCard: p.selectedCard }
}

export function goToLobby(state: GameState): GameState {
  return { ...state, phase: 'lobby' }
}

export function updateSettings(state: GameState, updates: Partial<GameSettings>): GameState {
  return { ...state, settings: { ...state.settings, ...updates } }
}

export function setRoomCode(state: GameState, roomCode: string): GameState {
  return { ...state, roomCode }
}

export function setPlayMode(state: GameState, playMode: PlayMode): GameState {
  return { ...state, playMode }
}

export function renamePlayer(state: GameState, playerId: string, name: string): GameState {
  const trimmed = name.trim().slice(0, 20)
  if (!trimmed) return state
  return {
    ...state,
    players: state.players.map((p) => (p.id === playerId ? { ...p, name: trimmed } : p)),
  }
}

export function beginHostedLobby(
  state: GameState,
  opts: {
    roomCode: string
    playMode: PlayMode
    host: { id: string; name: string; avatar: string; avatarBg: string }
  },
): GameState {
  const host = createHumanPlayer(opts.host.name, {
    id: opts.host.id,
    avatar: opts.host.avatar,
    avatarBg: opts.host.avatarBg,
    isHost: true,
  })
  return {
    ...state,
    phase: 'lobby',
    roomCode: opts.roomCode,
    playMode: opts.playMode,
    players: [host],
    submissions: [],
    roundWinner: null,
    roundHistory: [],
    currentRound: 0,
    currentBlackCard: null,
    czarId: '',
    blackCardPool: [],
    whiteCardPool: [],
  }
}

export function startGame(
  state: GameState,
  playerName: string,
  botCount: number,
  cards: { blackCards: Card[]; whiteCards: Card[] },
): GameState {
  if (cards.blackCards.length === 0 || cards.whiteCards.length === 0) return state

  let shuffledWhite = shuffle(cards.whiteCards)
  const shuffledBlack = shuffle(cards.blackCards)

  const existingHumans = state.players.filter((p) => !p.isBot).map(clonePlayer)

  let human: Player
  if (existingHumans.length > 0 && existingHumans[0].id === 'player-1') {
    human = { ...existingHumans[0], name: playerName || existingHumans[0].name }
  } else {
    human = createHumanPlayer(playerName)
  }

  const remotes = existingHumans.filter((p) => p.id !== 'player-1')
  const roster = pickRandomBots(botCount)
  const bots = Array.from({ length: botCount }, (_, i) => createBot(i, roster))
  const allPlayers = [human, ...remotes, ...bots].map(clonePlayer)

  for (const player of allPlayers) {
    const { drawn, remaining } = drawCards(shuffledWhite, HAND_SIZE)
    player.hand = drawn
    shuffledWhite = remaining
  }

  const firstCzarIdx = allPlayers.findIndex((p) => p.isBot)
  const czarIdx = firstCzarIdx >= 0 ? firstCzarIdx : allPlayers.length > 1 ? 1 : 0
  allPlayers[czarIdx].isCardCzar = true

  let next: GameState = {
    ...state,
    phase: 'playing',
    currentRound: 1,
    currentBlackCard: shuffledBlack[0],
    players: allPlayers,
    submissions: [],
    roundWinner: null,
    czarId: allPlayers[czarIdx].id,
    blackCardPool: shuffledBlack.slice(1),
    whiteCardPool: shuffledWhite,
  }

  if (state.playMode === 'async') {
    next = botSubmit(next)
  }

  return next
}

export function redrawHand(state: GameState, playerId: string): GameState {
  if (state.phase !== 'playing') return state
  if (state.submissions.some((s) => s.playerId === playerId)) return state

  const player = state.players.find((p) => p.id === playerId)
  if (!player) return state

  const pool = shuffle([...state.whiteCardPool, ...player.hand])
  const { drawn, remaining } = drawCards(pool, HAND_SIZE)

  return {
    ...state,
    whiteCardPool: remaining,
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, hand: drawn, selectedCard: null } : p,
    ),
  }
}

export function rebootHand(state: GameState, playerId: string): GameState {
  if (state.phase !== 'playing') return state
  if (!state.settings.rebootEnabled) return state
  if (state.submissions.some((s) => s.playerId === playerId)) return state

  const player = state.players.find((p) => p.id === playerId)
  if (!player || player.score < 1) return state

  const pool = shuffle([...state.whiteCardPool, ...player.hand])
  const { drawn, remaining } = drawCards(pool, HAND_SIZE)

  return {
    ...state,
    whiteCardPool: remaining,
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, hand: drawn, selectedCard: null, score: p.score - 1 } : p,
    ),
  }
}

export function submitCards(state: GameState, playerId: string, cards: Card[]): GameState {
  if (state.phase !== 'playing') return state
  if (playerId === state.czarId) return state
  if (state.submissions.some((s) => s.playerId === playerId)) return state
  if (cards.length === 0) return state

  const player = state.players.find((p) => p.id === playerId)
  if (!player) return state

  const blanks = state.currentBlackCard?.blanks ?? 1
  if (cards.length !== blanks) return state

  const cardIds = new Set(cards.map((c) => c.id))
  const ownsAll = cards.every((c) => player.hand.some((h) => h.id === c.id))
  if (!ownsAll) return state

  const newSubmissions: Submission[] = [...state.submissions, { playerId, cards }]
  const newPlayers = state.players.map((p) =>
    p.id === playerId
      ? { ...p, hand: p.hand.filter((c) => !cardIds.has(c.id)), selectedCard: cards[0] }
      : p,
  )

  const nonCzarPlayers = newPlayers.filter((p) => !p.isCardCzar)
  const allSubmitted = nonCzarPlayers.every((p) => newSubmissions.some((s) => s.playerId === p.id))

  return {
    ...state,
    players: newPlayers,
    submissions: newSubmissions,
    phase: allSubmitted ? 'revealing' : state.phase,
  }
}

export function botSubmit(state: GameState): GameState {
  if (state.phase !== 'playing') return state

  const blanks = state.currentBlackCard?.blanks ?? 1
  const botPlayers = state.players.filter((p) => p.isBot && !p.isCardCzar)
  const newSubmissions: Submission[] = [...state.submissions]
  let newPlayers = state.players.map(clonePlayer)

  for (const bot of botPlayers) {
    if (newSubmissions.some((s) => s.playerId === bot.id)) continue
    const live = newPlayers.find((p) => p.id === bot.id)
    if (!live || live.hand.length < blanks) continue

    const shuffledHand = shuffle(live.hand)
    const selectedCards = shuffledHand.slice(0, blanks)
    const selectedIds = new Set(selectedCards.map((c) => c.id))

    newSubmissions.push({ playerId: bot.id, cards: selectedCards })
    newPlayers = newPlayers.map((p) =>
      p.id === bot.id
        ? { ...p, hand: p.hand.filter((c) => !selectedIds.has(c.id)), selectedCard: selectedCards[0] }
        : p,
    )
  }

  const nonCzarPlayers = newPlayers.filter((p) => !p.isCardCzar)
  const allSubmitted = nonCzarPlayers.every((p) => newSubmissions.some((s) => s.playerId === p.id))

  return {
    ...state,
    players: newPlayers,
    submissions: newSubmissions,
    phase: allSubmitted ? 'revealing' : state.phase,
  }
}

export function finishReveal(state: GameState): GameState {
  if (state.phase !== 'revealing') return state
  return { ...state, phase: 'judging' }
}

function resolveWinner(state: GameState, winnerId: string): GameState {
  const winningSubmission = state.submissions.find((s) => s.playerId === winnerId)
  if (!winningSubmission || !state.currentBlackCard) return state

  const newPlayers = state.players.map((p) =>
    p.id === winnerId ? { ...p, score: p.score + 1 } : p,
  )

  const roundResult = {
    blackCard: state.currentBlackCard,
    winningCards: winningSubmission.cards,
    winnerId,
    czarId: state.czarId,
    round: state.currentRound,
  }

  const winner = newPlayers.find((p) => p.id === winnerId)
  const gameOver = winner && winner.score >= state.settings.winningScore

  return {
    ...state,
    players: newPlayers,
    roundWinner: winnerId,
    roundHistory: [...state.roundHistory, roundResult],
    phase: gameOver ? 'ended' : 'results',
  }
}

export function pickWinner(state: GameState, winnerId: string): GameState {
  if (state.phase !== 'judging') return state
  return resolveWinner(state, winnerId)
}

export function botPickWinner(state: GameState): GameState {
  if (state.phase !== 'judging') return state
  if (state.submissions.length === 0) return state
  const randomIdx = Math.floor(Math.random() * state.submissions.length)
  return resolveWinner(state, state.submissions[randomIdx].playerId)
}

export function nextRound(state: GameState): GameState {
  if (state.phase !== 'results') return state
  return { ...state, phase: 'scoreboard' }
}

export function peekNextCzarId(state: GameState): string {
  const playerCount = state.players.length
  if (playerCount === 0) return state.czarId
  const currentCzarIndex = state.players.findIndex((p) => p.id === state.czarId)
  const fallback = currentCzarIndex >= 0 ? (currentCzarIndex + 1) % playerCount : 0

  if (state.settings.winnersPick && state.roundWinner) {
    const winnerIdx = state.players.findIndex((p) => p.id === state.roundWinner)
    if (winnerIdx !== -1) return state.players[winnerIdx].id
  }

  return state.players[fallback].id
}

export function continueFromScoreboard(state: GameState): GameState {
  if (state.phase !== 'scoreboard') return state
  if (state.blackCardPool.length === 0) return state

  const nextCzarId = peekNextCzarId(state)
  const nextCzarIndex = state.players.findIndex((p) => p.id === nextCzarId)

  const nextBlack = state.blackCardPool[0]
  let pool = [...state.whiteCardPool]
  const newPlayers = state.players.map((p, i) => {
    const cardsNeeded = Math.max(0, HAND_SIZE - p.hand.length)
    const { drawn, remaining } = drawCards(pool, cardsNeeded)
    pool = remaining
    return {
      ...p,
      hand: [...p.hand, ...drawn],
      selectedCard: null,
      isCardCzar: i === nextCzarIndex,
    }
  })

  let next: GameState = {
    ...state,
    phase: 'playing',
    currentRound: state.currentRound + 1,
    currentBlackCard: nextBlack,
    players: newPlayers,
    submissions: [],
    roundWinner: null,
    czarId: newPlayers[nextCzarIndex]?.id ?? state.czarId,
    blackCardPool: state.blackCardPool.slice(1),
    whiteCardPool: pool,
  }

  if (state.playMode === 'async') {
    next = botSubmit(next)
  }

  return next
}

export function newGame(state: GameState): GameState {
  return {
    ...createInitialState(),
    settings: { ...state.settings },
  }
}

export function addRemotePlayer(
  state: GameState,
  info: { id: string; name: string; avatar: string; avatarBg: string },
): GameState {
  if (state.phase !== 'lobby') return state
  if (state.players.some((p) => p.id === info.id)) return state
  if (state.players.length >= state.settings.maxPlayers) return state

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

  return { ...state, players: [...state.players, newPlayer] }
}

export function removeRemotePlayer(state: GameState, playerId: string): GameState {
  if (state.phase === 'lobby') {
    return { ...state, players: state.players.filter((p) => p.id !== playerId) }
  }
  return {
    ...state,
    players: state.players.map((p) => (p.id === playerId ? { ...p, isConnected: false } : p)),
  }
}

export function waitingOn(state: GameState): Player[] {
  if (state.phase !== 'playing') return []
  return state.players.filter(
    (p) => !p.isCardCzar && !state.submissions.some((s) => s.playerId === p.id),
  )
}

export function isPlayersTurn(state: GameState, playerId: string): boolean {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return false
  if (state.phase === 'lobby') return false
  if (state.phase === 'playing') {
    return !player.isCardCzar && !state.submissions.some((s) => s.playerId === playerId)
  }
  if (state.phase === 'judging') return player.isCardCzar
  if (state.phase === 'results' || state.phase === 'scoreboard') return true
  return false
}
