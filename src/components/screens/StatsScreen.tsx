'use client'

import { useState, useEffect, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useStats, type GameStats } from '@/hooks/useStats'
import { allDecks } from '@/data/cards'

// ─── Helpers ─────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  if (ms === 0) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatFastestGame(ms: number): string {
  if (ms === 0) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}m ${s}s`
}

function winRate(stats: GameStats): string {
  if (stats.gamesPlayed === 0) return '0%'
  return `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%`
}

function getDeckDisplay(deckId: string): { name: string; icon: string } {
  if (!deckId) return { name: 'None yet', icon: '📦' }
  const deck = allDecks.find((d) => d.id === deckId)
  if (!deck) return { name: deckId, icon: '📦' }
  return { name: deck.name, icon: deck.icon }
}

// ─── Stat card data builder ──────────────────────────────────────────

function buildCards(stats: GameStats) {
  const fav = getDeckDisplay(stats.favoriteDeck)
  return [
    {
      emoji: '🎮',
      label: 'Games Played / Won',
      value: `${stats.gamesPlayed} / ${stats.gamesWon}`,
    },
    {
      emoji: '🏆',
      label: 'Win Rate',
      value: winRate(stats),
    },
    {
      emoji: '🔥',
      label: 'Best Win Streak',
      value: `${stats.bestStreak}`,
    },
    {
      emoji: '🃏',
      label: 'Cards Played',
      value: `${stats.cardsPlayed}`,
    },
    {
      emoji: '⏱️',
      label: 'Total Play Time',
      value: formatTime(stats.totalPlayTimeMs),
    },
    {
      emoji: '🎯',
      label: 'Rounds Won / Played',
      value: `${stats.roundsWon} / ${stats.roundsPlayed}`,
    },
    {
      emoji: '🔄',
      label: 'Redraws Used',
      value: `${stats.redrawsUsed}`,
    },
    {
      emoji: '⚡',
      label: 'Fastest Game',
      value: formatFastestGame(stats.fastestGameMs),
    },
    {
      emoji: fav.icon,
      label: 'Favorite Deck',
      value: fav.name,
    },
  ] as const
}

// ─── Component ───────────────────────────────────────────────────────

interface StatsScreenProps {
  open: boolean
  onClose: () => void
}

export function StatsScreen({ open, onClose }: StatsScreenProps) {
  const { stats, resetStats } = useStats()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open, handleEsc])

  const cards = buildCards(stats)

  const handleReset = () => {
    if (confirmReset) {
      resetStats()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: 'var(--theme-overlay)' }}
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-modal-title"
            style={{
              maxHeight: 'calc(100vh - 4rem)',
              backgroundColor: 'var(--theme-bg)',
              border: '4px solid var(--theme-border)',
              borderRadius: 24,
              boxShadow: '12px 12px 0px var(--theme-shadow)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '3px solid var(--theme-border)' }}
            >
              <h2
                id="stats-modal-title"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 28,
                  fontWeight: 900,
                  color: 'var(--theme-text)',
                  letterSpacing: '-0.02em',
                }}
              >
                YOUR STATS
              </h2>
              <button
                onClick={onClose}
                aria-label="Close stats"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--theme-text)',
                  color: 'var(--theme-bg)',
                  border: 'none',
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 20,
                }}
              >
                ✕
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 px-6 py-5 md:grid-cols-3">
              {cards.map((card, i) => (
                <m.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col items-center gap-1 p-4"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    border: '3px solid var(--theme-border)',
                    borderRadius: 16,
                    boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
                  }}
                >
                  <span className="text-2xl">{card.emoji}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 24,
                      fontWeight: 900,
                      color: 'var(--theme-text)',
                      lineHeight: 1.1,
                      textAlign: 'center',
                    }}
                  >
                    {card.value}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 12,
                      color: 'var(--theme-text-muted)',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    {card.label}
                  </span>
                </m.div>
              ))}
            </div>

            {/* Reset button */}
            <div
              className="flex justify-center px-6 py-4"
              style={{ borderTop: '3px solid var(--theme-border)' }}
            >
              <button
                onClick={handleReset}
                onBlur={() => setConfirmReset(false)}
                className="cursor-pointer px-6 py-2"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: confirmReset ? '#FFFFFF' : '#C62828',
                  backgroundColor: confirmReset ? '#C62828' : 'transparent',
                  border: '3px solid #C62828',
                  borderRadius: 12,
                  boxShadow: confirmReset ? '4px 4px 0px var(--theme-shadow)' : 'none',
                  transition: 'background-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
                }}
              >
                {confirmReset ? 'Confirm Reset' : 'Reset All Stats'}
              </button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
