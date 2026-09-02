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

/** How this table is being played. Async games persist to Supabase and do not require everyone online. */
export type PlayMode = 'local' | 'live' | 'async'

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
  playMode: PlayMode
  blackCardPool: Card[]
  whiteCardPool: Card[]
  /** Player ids who already used the free redraw this round */
  roundRedraws: string[]
  /** Player ids who already paid for Reboot this round */
  roundReboots: string[]
}

export interface AsyncGameSummary {
  roomCode: string
  playerId: string
  name: string
  phase: GamePhase
  myTurn: boolean
  updatedAt: string
  playerCount: number
}

export interface PlayerInfo {
  name: string
  avatar: string
  avatarBg: string
}

// ── Multiplayer ──

export type MultiplayerRole = 'host' | 'client' | 'local' | 'async'

export type GameActionType =
  | 'player:join'
  | 'player:leave'
  | 'player:submit'
  | 'player:pick_winner'
  | 'player:reboot'
  | 'player:redraw'
  | 'player:rename'
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
  | { type: 'player:redraw'; playerId: string }
  | { type: 'player:rename'; playerId: string; payload: { name: string } }
  | { type: 'player:update_settings'; playerId: string; payload: { settings: Partial<GameSettings> } }
  | { type: 'player:start_game'; playerId: string; payload?: { botCount?: number } }
  | { type: 'player:next_round'; playerId: string }
  | { type: 'player:continue'; playerId: string }
  | { type: 'player:new_game'; playerId: string }

/** State broadcast from host to clients — hands and draw piles are stripped */
export interface BroadcastGameState extends Omit<GameState, 'players' | 'blackCardPool' | 'whiteCardPool'> {
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
