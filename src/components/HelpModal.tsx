'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

const RULES = [
  {
    emoji: '🃏',
    title: 'The Setup',
    body: 'Each round, a black prompt card is shown. Everyone (except the judge) picks their funniest white answer card.',
  },
  {
    emoji: '👑',
    title: 'The Judge',
    body: 'One player is the judge each round. They pick the answer that makes them laugh the hardest. The judge rotates every round.',
  },
  {
    emoji: '🏆',
    title: 'Scoring',
    body: 'Win a round = 1 point. First to the score limit wins the whole game. It\'s that simple.',
  },
  {
    emoji: '🔄',
    title: 'New Hand',
    body: 'Hate your cards? You can redraw your entire hand once per round. Use it wisely.',
  },
  {
    emoji: '💀',
    title: 'The Vibe',
    body: 'Be unhinged. Be chaotic. The funniest, most cursed answer wins. There are no wrong answers (except boring ones).',
  },
]

export function HelpModal({ open, onClose }: HelpModalProps) {
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
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
            style={{
              maxHeight: 'calc(100vh - 4rem)',
              backgroundColor: '#F4F4EE',
              border: '4px solid #111',
              borderRadius: 24,
              boxShadow: '12px 12px 0px #111',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '3px solid #111' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 28,
                  color: '#111',
                  textTransform: 'uppercase',
                }}
              >
                How to Play
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                style={{
                  backgroundColor: '#111',
                  color: 'white',
                  border: 'none',
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 20,
                }}
              >
                ✕
              </button>
            </div>

            {/* Rules */}
            <div className="flex flex-col gap-4 px-6 py-5">
              {RULES.map((rule, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 text-2xl">{rule.emoji}</span>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-archivo)',
                        fontSize: 16,
                        color: '#111',
                        marginBottom: 2,
                      }}
                    >
                      {rule.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 14,
                        color: '#555',
                        lineHeight: 1.5,
                      }}
                    >
                      {rule.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 text-center"
              style={{ borderTop: '3px solid #111' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: '#888',
                }}
              >
                189 cards • 6 decks • infinite chaos
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
