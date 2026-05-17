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
