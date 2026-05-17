'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  ACHIEVEMENTS,
  DEFAULT_STATS,
  type AchievementStats,
  type Achievement,
  ACHIEVEMENT_TARGETS,
} from '@/data/achievements'

const STATS_KEY = 'cai-achievement-stats'
const UNLOCKED_KEY = 'cai-achievements'
const CHANGE_EVENT = 'achievement-change'

// ── External-store helpers (SSR-safe, same pattern as ThemeContext) ──

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

function getStatsSnapshot(): AchievementStats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) }
  } catch { /* corrupted data — use defaults */ }
  return { ...DEFAULT_STATS }
}

function getUnlockedSnapshot(): Set<string> {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch { /* corrupted data — use defaults */ }
  return new Set()
}

// Stable server snapshots (object refs never change → no hydration mismatch)
const SERVER_STATS: AchievementStats = { ...DEFAULT_STATS }
const SERVER_UNLOCKED: string[] = []

// Memoisation layer so useSyncExternalStore doesn't re-render on every
// subscribe tick when nothing actually changed.
let cachedStats: AchievementStats = SERVER_STATS
let cachedStatsJson = ''

function getStatsClient(): AchievementStats {
  const json = localStorage.getItem(STATS_KEY) ?? ''
  if (json === cachedStatsJson) return cachedStats
  cachedStatsJson = json
  cachedStats = getStatsSnapshot()
  return cachedStats
}

function getStatsServer(): AchievementStats {
  return SERVER_STATS
}

let cachedUnlocked: string[] = SERVER_UNLOCKED
let cachedUnlockedJson = ''

function getUnlockedClient(): string[] {
  const json = localStorage.getItem(UNLOCKED_KEY) ?? ''
  if (json === cachedUnlockedJson) return cachedUnlocked
  cachedUnlockedJson = json
  cachedUnlocked = Array.from(getUnlockedSnapshot())
  return cachedUnlocked
}

function getUnlockedServer(): string[] {
  return SERVER_UNLOCKED
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useAchievements() {
  const stats = useSyncExternalStore(subscribe, getStatsClient, getStatsServer)
  const unlockedList = useSyncExternalStore(subscribe, getUnlockedClient, getUnlockedServer)
  const unlockedAchievements = new Set(unlockedList)

  /**
   * Merge partial stats, persist, check all conditions, and return
   * any *newly* unlocked achievement IDs.
   */
  const checkAndUnlock = useCallback((partial: Partial<AchievementStats>): string[] => {
    const prev = getStatsSnapshot()
    const next: AchievementStats = { ...prev, ...partial }

    // Keep the best streak ever
    if (next.currentStreak > next.bestStreak) {
      next.bestStreak = next.currentStreak
    }
    // Keep the fastest submit ever (lower is better)
    if (partial.fastestSubmitMs !== undefined && prev.fastestSubmitMs < next.fastestSubmitMs) {
      next.fastestSubmitMs = prev.fastestSubmitMs
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(next))

    const alreadyUnlocked = getUnlockedSnapshot()
    const newlyUnlocked: string[] = []

    for (const a of ACHIEVEMENTS) {
      if (alreadyUnlocked.has(a.id)) continue
      if (a.condition(next)) {
        alreadyUnlocked.add(a.id)
        newlyUnlocked.push(a.id)
      }
    }

    if (newlyUnlocked.length > 0) {
      localStorage.setItem(UNLOCKED_KEY, JSON.stringify(Array.from(alreadyUnlocked)))
    }

    window.dispatchEvent(new Event(CHANGE_EVENT))
    return newlyUnlocked
  }, [])

  /**
   * Get progress toward an achievement (0–1). Returns `null` if the
   * achievement has no trackable numeric target.
   */
  const getProgress = useCallback(
    (id: string): { current: number; target: number; ratio: number } | null => {
      const target = ACHIEVEMENT_TARGETS[id]
      if (!target) return null
      const current = stats[target.stat] as number
      const clamped = Math.min(current, target.target)
      return { current: clamped, target: target.target, ratio: clamped / target.target }
    },
    [stats],
  )

  return {
    stats,
    unlockedAchievements,
    checkAndUnlock,
    getProgress,
    allAchievements: ACHIEVEMENTS as readonly Achievement[],
  }
}
