'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { useGame } from '@/contexts/GameContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useSound } from '@/hooks/useSound'
import { HelpModal } from '@/components/HelpModal'
import { AchievementToast } from '@/components/AchievementToast'

export function GlobalOverlay() {
  const { gameState, newGame } = useGame()
  const { isDark, toggleTheme } = useTheme()
  const { isMuted, toggleMute } = useSound()
  const [helpOpen, setHelpOpen] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)

  const isInGame = !['menu', 'lobby'].includes(gameState.phase)

  return (
    <>
      {/* Sound mute toggle */}
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: isInGame ? 64 : 16,
          right: 120,
          width: 44,
          height: 44,
          backgroundColor: 'var(--theme-surface)',
          color: 'var(--theme-text)',
          border: '3px solid var(--theme-border)',
          boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
          transition: 'top 0.3s ease',
        }}
      >
        {isMuted
          ? <VolumeX className="h-5 w-5" strokeWidth={2} />
          : <Volume2 className="h-5 w-5" strokeWidth={2} />
        }
      </motion.button>

      {/* Theme toggle — always visible, next to help */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: isInGame ? 64 : 16,
          right: 68,
          width: 44,
          height: 44,
          backgroundColor: 'var(--theme-surface)',
          color: 'var(--theme-text)',
          border: '3px solid var(--theme-border)',
          boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
          transition: 'top 0.3s ease',
        }}
      >
        {isDark
          ? <Sun className="h-5 w-5" strokeWidth={2} />
          : <Moon className="h-5 w-5" strokeWidth={2} />
        }
      </motion.button>

      {/* Help "?" button — always visible */}
      <motion.button
        onClick={() => setHelpOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="How to play"
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: isInGame ? 64 : 16,
          right: 16,
          width: 44,
          height: 44,
          backgroundColor: 'var(--theme-text)',
          color: 'var(--theme-bg)',
          border: '3px solid var(--theme-border)',
          boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
          fontFamily: 'var(--font-archivo)',
          fontSize: 22,
          transition: 'top 0.3s ease',
        }}
      >
        ?
      </motion.button>

      {/* Quit button — only during active game */}
      <AnimatePresence>
        {isInGame && !confirmQuit && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setConfirmQuit(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Quit game"
            className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
            style={{
              top: 64,
              left: 16,
              width: 44,
              height: 44,
              backgroundColor: '#FF4242',
              color: 'white',
              border: '3px solid var(--theme-border)',
              boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
              fontFamily: 'var(--font-inter)',
              fontSize: 18,
            }}
          >
            ✕
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quit confirmation */}
      <AnimatePresence>
        {confirmQuit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmQuit(false)}
              className="fixed inset-0 z-[200]"
              style={{ backgroundColor: 'var(--theme-overlay)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2"
              role="dialog"
              aria-modal="true"
              aria-label="Quit game confirmation"
              style={{
                width: 'calc(100vw - 3rem)',
                maxWidth: 340,
                backgroundColor: 'var(--theme-bg)',
                border: '4px solid var(--theme-border)',
                borderRadius: 24,
                boxShadow: '10px 10px 0px var(--theme-shadow)',
                padding: '32px 28px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🚪</span>
              <h3
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 24,
                  color: 'var(--theme-text)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}
              >
                Quit Game?
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 14,
                  color: 'var(--theme-text-secondary)',
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                Your progress will be lost. No take-backs, bestie.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmQuit(false)}
                  className="flex-1 cursor-pointer rounded-full py-3"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 16,
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)',
                    border: '3px solid var(--theme-border)',
                    boxShadow: '4px 4px 0px var(--theme-shadow)',
                  }}
                >
                  Stay
                </button>
                <button
                  onClick={() => {
                    setConfirmQuit(false)
                    newGame()
                  }}
                  className="flex-1 cursor-pointer rounded-full py-3"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 16,
                    textTransform: 'uppercase',
                    backgroundColor: '#FF4242',
                    color: 'white',
                    border: '3px solid var(--theme-border)',
                    boxShadow: '4px 4px 0px var(--theme-shadow)',
                  }}
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Help modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Achievement toasts */}
      <AchievementToast />
    </>
  )
}
