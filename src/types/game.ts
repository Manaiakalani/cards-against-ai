export interface Card {
  id: string
  text: string
  type: 'black' | 'white'
  blanks?: number
  category?: string
}

export interface CardDeck {
  id: string
  name: string
  description: string
  icon: string
  cards: {
    blackCards: Card[]
    whiteCards: Card[]
  }
}

export interface Player {
  id: string
  name: string
  score: number
  isHost: boolean
  isCardCzar: boolean
  isConnected: boolean
  avatar: string
  avatarBg: string
  hand: Card[]
  selectedCard: Card | null
  isBot: boolean
}

export interface GameSettings {
  maxPlayers: number
  roundTime: number
  winningScore: number
  selectedDecks: string[]
  timerEnabled: boolean
  timerSeconds: number
  winnersPick: boolean
  rebootEnabled: boolean
}

export type GamePhase = 'menu' | 'lobby' | 'playing' | 'revealing' | 'judging' | 'results' | 'scoreboard' | 'ended'

export interface Submission {
  playerId: string
  cards: Card[]
}

export interface RoundResult {
  blackCard: Card
  winningCards: Card[]
  winnerId: string
  czarId: string
  round: number
}

export interface GameState {
  phase: GamePhase
  currentRound: number
  currentBlackCard: Card | null
  players: Player[]
  submissions: Submission[]
  roundWinner: string | null
  roundHistory: RoundResult[]
  settings: GameSettings
  roomCode: string
  czarId: string
}

// ── Multiplayer ──

export type MultiplayerRole = 'host' | 'client' | 'local'

export type GameActionType =
  | 'player:join'
  | 'player:leave'
  | 'player:submit'
  | 'player:pick_winner'
  | 'player:reboot'
  | 'player:update_settings'
  | 'player:start_game'
  | 'player:next_round'
  | 'player:continue'
  | 'player:new_game'

/**
 * Actions sent client → host over the Supabase Realtime channel.
 * Modeled as a discriminated union (keyed by `type`) so each variant's
 * `payload` is exactly what that action needs — no optional grab-bag,
 * and the host's reducer switch can be checked for exhaustiveness.
 */
export type GameAction =
  | { type: 'player:join'; playerId: string; payload: { name: string; avatar: string; avatarBg: string } }
  | { type: 'player:leave'; playerId: string }
  | { type: 'player:submit'; playerId: string; payload: { cards: Card[] } }
  | { type: 'player:pick_winner'; playerId: string; payload: { winnerId: string } }
  | { type: 'player:reboot'; playerId: string }
  | { type: 'player:update_settings'; playerId: string; payload: { settings: Partial<GameSettings> } }
  | { type: 'player:start_game'; playerId: string; payload?: { botCount?: number } }
  | { type: 'player:next_round'; playerId: string }
  | { type: 'player:continue'; playerId: string }
  | { type: 'player:new_game'; playerId: string }

/** State broadcast from host to clients — hands are per-player filtered */
export interface BroadcastGameState extends Omit<GameState, 'players'> {
  players: Omit<Player, 'hand'>[]
  yourHand: Card[]
  yourId: string
}

export interface PresencePlayer {
  id: string
  name: string
  avatar: string
  avatarBg: string
  isHost: boolean
  onlineAt: string
}

export interface MultiplayerState {
  role: MultiplayerRole
  connected: boolean
  roomCode: string
  playerId: string
  error: string | null
}
