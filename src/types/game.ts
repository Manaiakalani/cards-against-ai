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
}

export type GamePhase = 'menu' | 'lobby' | 'playing' | 'judging' | 'results' | 'scoreboard' | 'ended'

export interface RoundResult {
  blackCard: Card
  winningCard: Card
  winnerId: string
  czarId: string
  round: number
}

export interface GameState {
  phase: GamePhase
  currentRound: number
  currentBlackCard: Card | null
  players: Player[]
  submissions: { playerId: string; card: Card }[]
  roundWinner: string | null
  roundHistory: RoundResult[]
  settings: GameSettings
  roomCode: string
  czarId: string
}
