'use client'

import { useCallback, useSyncExternalStore } from 'react'

// ─── Types ───────────────────────────────────────────────────────────

export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  roundsPlayed: number
  roundsWon: number
  cardsPlayed: number
  redrawsUsed: number
  bestStreak: number
  currentStreak: number
  totalPlayTimeMs: number
  fastestGameMs: number
  favoriteDeck: string
  deckUsage: Record<string, number>
}

// ─── Constants ───────────────────────────────────────────────────────

const STORAGE_KEY = 'cai-game-stats'
const STATS_CHANGE_EVENT = 'stats-change'

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  roundsPlayed: 0,
  roundsWon: 0,
  cardsPlayed: 0,
  redrawsUsed: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalPlayTimeMs: 0,
  fastestGameMs: 0,
  favoriteDeck: '',
  deckUsage: {},
}

// ─── Storage helpers ─────────────────────────────────────────────────

function readStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATS }
    return { ...DEFAULT_STATS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATS }
  }
}

function writeStats(stats: GameStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  window.dispatchEvent(new Event(STATS_CHANGE_EVENT))
}

// ─── useSyncExternalStore glue ───────────────────────────────────────

function subscribe(callback: () => void): () => void {
  window.addEventListener(STATS_CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(STATS_CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

// Memoisation layer — useSyncExternalStore requires stable references
let cachedStats: GameStats = DEFAULT_STATS
let cachedStatsJson = ''

function getSnapshot(): GameStats {
  const json = localStorage.getItem(STORAGE_KEY) ?? ''
  if (json === cachedStatsJson) return cachedStats
  cachedStatsJson = json
  cachedStats = readStats()
  return cachedStats
}

function getServerSnapshot(): GameStats {
  return DEFAULT_STATS
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useStats() {
  const stats = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const recordRoundWin = useCallback(() => {
    const s = readStats()
    s.roundsPlayed += 1
    s.roundsWon += 1
    s.currentStreak += 1
    if (s.currentStreak > s.bestStreak) {
      s.bestStreak = s.currentStreak
    }
    writeStats(s)
  }, [])

  const recordRoundLoss = useCallback(() => {
    const s = readStats()
    s.roundsPlayed += 1
    s.currentStreak = 0
    writeStats(s)
  }, [])

  const recordGameEnd = useCallback(
    (won: boolean, durationMs: number, deckIds: string[]) => {
      const s = readStats()
      s.gamesPlayed += 1
      if (won) s.gamesWon += 1
      s.totalPlayTimeMs += durationMs
      if (durationMs > 0 && (s.fastestGameMs === 0 || durationMs < s.fastestGameMs)) {
        s.fastestGameMs = durationMs
      }
      for (const id of deckIds) {
        s.deckUsage[id] = (s.deckUsage[id] ?? 0) + 1
      }
      // Recompute favoriteDeck
      let maxCount = 0
      for (const [deckId, count] of Object.entries(s.deckUsage)) {
        if (count > maxCount) {
          maxCount = count
          s.favoriteDeck = deckId
        }
      }
      writeStats(s)
    },
    [],
  )

  const recordCardPlayed = useCallback((count = 1) => {
    const s = readStats()
    s.cardsPlayed += count
    writeStats(s)
  }, [])

  const recordRedraw = useCallback(() => {
    const s = readStats()
    s.redrawsUsed += 1
    writeStats(s)
  }, [])

  const resetStats = useCallback(() => {
    writeStats({ ...DEFAULT_STATS })
  }, [])

  return {
    stats,
    recordRoundWin,
    recordRoundLoss,
    recordGameEnd,
    recordCardPlayed,
    recordRedraw,
    resetStats,
  }
}
