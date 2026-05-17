'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { HelpModal } from '@/components/HelpModal'

export function GlobalOverlay() {
  const { gameState, newGame } = useGame()
  const [helpOpen, setHelpOpen] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)

  const isInGame = !['menu', 'lobby'].includes(gameState.phase)

  return (
    <>
      {/* Help "?" button — always visible */}
      <motion.button
        onClick={() => setHelpOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: isInGame ? 64 : 16,
          right: 16,
          width: 44,
          height: 44,
          backgroundColor: '#111',
          color: 'white',
          border: '3px solid #111',
          boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
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
            className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
            style={{
              top: 64,
              left: 16,
              width: 44,
              height: 44,
              backgroundColor: '#FF4242',
              color: 'white',
              border: '3px solid #111',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
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
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'calc(100vw - 3rem)',
                maxWidth: 340,
                backgroundColor: '#F4F4EE',
                border: '4px solid #111',
                borderRadius: 24,
                boxShadow: '10px 10px 0px #111',
                padding: '32px 28px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🚪</span>
              <h3
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 24,
                  color: '#111',
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
                  color: '#666',
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
                    backgroundColor: 'white',
                    color: '#111',
                    border: '3px solid #111',
                    boxShadow: '4px 4px 0px #111',
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
                    border: '3px solid #111',
                    boxShadow: '4px 4px 0px #111',
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
    </>
  )
}
