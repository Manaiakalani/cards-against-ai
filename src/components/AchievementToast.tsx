'use client'

import { useEffect, useState, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ACHIEVEMENTS, RARITY_COLORS, type AchievementRarity } from '@/data/achievements'

interface ToastItem {
  id: string
  name: string
  icon: string
  rarity: AchievementRarity
  key: number
}

let toastKey = 0

export function AchievementToast() {
  const [queue, setQueue] = useState<ToastItem[]>([])

  const dismiss = useCallback((key: number) => {
    setQueue(prev => prev.filter(t => t.key !== key))
  }, [])

  // Auto-dismiss after 4 s
  useEffect(() => {
    if (queue.length === 0) return
    const first = queue[0]
    const timer = setTimeout(() => dismiss(first.key), 4000)
    return () => clearTimeout(timer)
  }, [queue, dismiss])

  // Public API: other components call this via a module-level function
  useEffect(() => {
    pushToast = (achievementIds: string[]) => {
      const items: ToastItem[] = achievementIds
        .map(id => {
          const a = ACHIEVEMENTS.find(x => x.id === id)
          if (!a) return null
          return { id: a.id, name: a.name, icon: a.icon, rarity: a.rarity, key: ++toastKey }
        })
        .filter((x): x is ToastItem => x !== null)

      setQueue(prev => [...prev, ...items])
    }
    return () => {
      pushToast = () => {}
    }
  }, [])

  const current = queue[0] ?? null

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[300] flex flex-col items-end gap-3"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {current && (
          <m.div
            key={current.key}
            initial={{ opacity: 0, x: 80, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 80, y: -10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="pointer-events-auto flex items-center gap-3"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: '4px solid var(--theme-border)',
              borderRadius: 16,
              padding: '12px 20px',
              boxShadow: '6px 6px 0px var(--theme-shadow)',
              minWidth: 240,
              cursor: 'pointer',
            }}
            onClick={() => dismiss(current.key)}
          >
            {/* Rarity strip */}
            <div
              style={{
                width: 6,
                alignSelf: 'stretch',
                borderRadius: 3,
                backgroundColor: RARITY_COLORS[current.rarity],
                flexShrink: 0,
              }}
            />

            {/* Icon */}
            <span style={{ fontSize: 32, lineHeight: 1 }}>{current.icon}</span>

            {/* Text */}
            <div className="flex flex-col">
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: RARITY_COLORS[current.rarity],
                }}
              >
                {current.rarity}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 16,
                  color: 'var(--theme-text)',
                  lineHeight: 1.2,
                }}
              >
                {current.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 12,
                  color: 'var(--theme-text-muted)',
                }}
              >
                Achievement unlocked!
              </span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Call this from anywhere to queue achievement toasts.
 * Safe to call before the component mounts (calls are silently dropped).
 */
export let pushToast: (achievementIds: string[]) => void = () => {}
