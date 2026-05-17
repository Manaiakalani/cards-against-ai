export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  condition: (stats: AchievementStats) => boolean
}

export interface AchievementStats {
  roundsWon: number
  roundsPlayed: number
  gamesPlayed: number
  gamesWon: number
  cardsPlayed: number
  currentStreak: number
  bestStreak: number
  fastestSubmitMs: number
  czarRoundsPlayed: number
  redrawsUsed: number
  pick2Played: number
  perfectGames: number
}

export const DEFAULT_STATS: AchievementStats = {
  roundsWon: 0,
  roundsPlayed: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  cardsPlayed: 0,
  currentStreak: 0,
  bestStreak: 0,
  fastestSubmitMs: Infinity,
  czarRoundsPlayed: 0,
  redrawsUsed: 0,
  pick2Played: 0,
  perfectGames: 0,
}

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: '#66FF00',
  rare: '#87CEEB',
  epic: '#DDA0DD',
  legendary: '#FFD700',
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Win your first round',
    icon: '🩸',
    rarity: 'common',
    condition: (stats) => stats.roundsWon >= 1,
  },
  {
    id: 'hat-trick',
    name: 'Hat Trick',
    description: 'Win 3 rounds in a single game',
    icon: '🎩',
    rarity: 'common',
    condition: (stats) => stats.currentStreak >= 3 || stats.bestStreak >= 3,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Submit a card in under 5 seconds',
    icon: '⚡',
    rarity: 'rare',
    condition: (stats) => stats.fastestSubmitMs < 5000 && stats.fastestSubmitMs > 0,
  },
  {
    id: 'czar-favorite',
    name: "Czar's Fave",
    description: 'Win 5 rounds total',
    icon: '👑',
    rarity: 'common',
    condition: (stats) => stats.roundsWon >= 5,
  },
  {
    id: 'card-shark',
    name: 'Card Shark',
    description: 'Play 100 cards total',
    icon: '🦈',
    rarity: 'rare',
    condition: (stats) => stats.cardsPlayed >= 100,
  },
  {
    id: 'streak-king',
    name: 'On a Heater',
    description: 'Win 3 rounds in a row',
    icon: '🔥',
    rarity: 'rare',
    condition: (stats) => stats.bestStreak >= 3,
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play 10 games',
    icon: '🎖️',
    rarity: 'common',
    condition: (stats) => stats.gamesPlayed >= 10,
  },
  {
    id: 'champion',
    name: 'GOAT Status',
    description: 'Win 5 games',
    icon: '🏆',
    rarity: 'epic',
    condition: (stats) => stats.gamesWon >= 5,
  },
  {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Win a game in under 5 minutes',
    icon: '⏱️',
    rarity: 'epic',
    // Tracked externally — the stat field signals the game was fast enough
    condition: (stats) => stats.gamesWon >= 1 && stats.fastestSubmitMs < 5000 && stats.fastestSubmitMs > 0,
  },
  {
    id: 'redraw-master',
    name: 'Shuffleboard',
    description: 'Use redraw 10 times total',
    icon: '🔄',
    rarity: 'rare',
    condition: (stats) => stats.redrawsUsed >= 10,
  },
  {
    id: 'pick2-pro',
    name: 'Double Trouble',
    description: 'Win with a Pick-2 card 3 times',
    icon: '✌️',
    rarity: 'epic',
    condition: (stats) => stats.pick2Played >= 3,
  },
  {
    id: 'perfect-game',
    name: 'Flawless Victory',
    description: 'Win a game without losing any round',
    icon: '💎',
    rarity: 'legendary',
    condition: (stats) => stats.perfectGames >= 1,
  },
  {
    id: 'hundred-games',
    name: 'No Life',
    description: 'Play 100 games total',
    icon: '💀',
    rarity: 'legendary',
    condition: (stats) => stats.gamesPlayed >= 100,
  },
]

/** Map of trackable achievement targets for progress bars */
export const ACHIEVEMENT_TARGETS: Record<string, { stat: keyof AchievementStats; target: number }> = {
  'czar-favorite': { stat: 'roundsWon', target: 5 },
  'card-shark': { stat: 'cardsPlayed', target: 100 },
  'veteran': { stat: 'gamesPlayed', target: 10 },
  'champion': { stat: 'gamesWon', target: 5 },
  'redraw-master': { stat: 'redrawsUsed', target: 10 },
  'pick2-pro': { stat: 'pick2Played', target: 3 },
  'hundred-games': { stat: 'gamesPlayed', target: 100 },
}
