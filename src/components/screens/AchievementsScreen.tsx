'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ACHIEVEMENTS, RARITY_COLORS, ACHIEVEMENT_TARGETS } from '@/data/achievements'
import { useAchievements } from '@/hooks/useAchievements'

interface AchievementsScreenProps {
  open: boolean
  onClose: () => void
}

export function AchievementsScreen({ open, onClose }: AchievementsScreenProps) {
  const { unlockedAchievements, getProgress } = useAchievements()
  const totalUnlocked = unlockedAchievements.size
  const totalAchievements = ACHIEVEMENTS.length

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open, handleEsc])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: 'var(--theme-overlay)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievements-title"
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
              <div>
                <h2
                  id="achievements-title"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 28,
                    color: 'var(--theme-text)',
                  }}
                >
                  Achievements
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 14,
                    color: 'var(--theme-text-muted)',
                    marginTop: 2,
                  }}
                >
                  {totalUnlocked}/{totalAchievements} unlocked
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close achievements"
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

            {/* Achievement Grid */}
            <div className="grid grid-cols-2 gap-3 p-6 md:grid-cols-3">
              {ACHIEVEMENTS.map((achievement) => {
                const unlocked = unlockedAchievements.has(achievement.id)
                const progress = getProgress(achievement.id)
                const rarityColor = RARITY_COLORS[achievement.rarity]

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{
                      backgroundColor: unlocked ? 'var(--theme-surface)' : 'var(--theme-bg)',
                      border: `3px solid ${unlocked ? 'var(--theme-border)' : 'var(--theme-shadow-soft)'}`,
                      borderRadius: 16,
                      overflow: 'hidden',
                      opacity: unlocked ? 1 : 0.5,
                      boxShadow: unlocked ? '4px 4px 0px var(--theme-shadow)' : 'none',
                    }}
                  >
                    {/* Rarity strip */}
                    <div
                      style={{
                        height: 5,
                        backgroundColor: unlocked ? rarityColor : 'var(--theme-shadow-soft)',
                      }}
                    />

                    <div className="flex flex-col items-center px-3 py-4 text-center">
                      {/* Icon */}
                      <span style={{ fontSize: 36, lineHeight: 1 }}>
                        {unlocked ? achievement.icon : '🔒'}
                      </span>

                      {/* Name */}
                      <p
                        className="mt-2"
                        style={{
                          fontFamily: 'var(--font-archivo)',
                          fontSize: 14,
                          color: unlocked ? 'var(--theme-text)' : 'var(--theme-text-muted)',
                          lineHeight: 1.2,
                        }}
                      >
                        {achievement.name}
                      </p>

                      {/* Description */}
                      <p
                        className="mt-1"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 11,
                          color: 'var(--theme-text-muted)',
                          lineHeight: 1.3,
                        }}
                      >
                        {achievement.description}
                      </p>

                      {/* Rarity badge */}
                      <span
                        className="mt-2 inline-block"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: unlocked ? rarityColor : 'var(--theme-text-muted)',
                          border: `2px solid ${unlocked ? rarityColor : 'var(--theme-shadow-soft)'}`,
                          borderRadius: 6,
                          padding: '2px 8px',
                        }}
                      >
                        {achievement.rarity}
                      </span>

                      {/* Progress bar (only for trackable + not-yet-unlocked) */}
                      {!unlocked && progress && ACHIEVEMENT_TARGETS[achievement.id] && (
                        <div className="mt-2 w-full">
                          <div
                            style={{
                              width: '100%',
                              height: 6,
                              backgroundColor: 'var(--theme-shadow-soft)',
                              borderRadius: 3,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(progress.ratio * 100, 100)}%`,
                                height: '100%',
                                backgroundColor: rarityColor,
                                borderRadius: 3,
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                          <p
                            className="mt-1"
                            style={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: 10,
                              color: 'var(--theme-text-muted)',
                            }}
                          >
                            {progress.current}/{progress.target}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 text-center"
              style={{ borderTop: '3px solid var(--theme-border)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: 'var(--theme-text-muted)',
                }}
              >
                Keep playing to unlock them all 🏆
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AchievementsScreen
