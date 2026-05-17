'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { useSound } from '@/hooks/useSound'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { GameHUD } from '@/components/GameHUD'
import { Sticker } from '@/components/Sticker'

export default function RevealScreen() {
  const { gameState, finishReveal } = useGame()
  const { play } = useSound()
  const [revealedCount, setRevealedCount] = useState(0)

  const submissions = gameState.submissions
  const totalCards = submissions.length

  // Stagger reveal: flip one card every 0.8s
  useEffect(() => {
    if (revealedCount >= totalCards) {
      // All revealed — wait a beat then move to judging
      const timer = setTimeout(() => {
        finishReveal()
      }, 1200)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      play('reveal')
      setRevealedCount(prev => prev + 1)
    }, 800)

    return () => clearTimeout(timer)
  }, [revealedCount, totalCards, finishReveal, play])

  return (
    <div className="relative h-dvh overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <PosterBackground words={['the', 'big', 'reveal']} opacity={0.15} />
      <GameHUD
        round={gameState.currentRound}
        players={gameState.players}
        czarId={gameState.czarId}
        roomCode={gameState.roomCode}
      />

      <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto px-4 pt-12 pb-8">
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <Sticker color="pink" rotation={-2}>
            THE BIG REVEAL
          </Sticker>
        </motion.div>

        {/* Black Card */}
        {gameState.currentBlackCard && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <GameCard card={gameState.currentBlackCard} size="sm" rotation={-2} />
          </motion.div>
        )}

        {/* Submitted Cards — flip one by one */}
        <div className="grid w-full max-w-lg grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
          <AnimatePresence>
            {submissions.map((sub, i) => {
              const isRevealed = i < revealedCount

              return (
                <motion.div
                  key={sub.playerId}
                  initial={{ rotateY: 180, opacity: 0.8 }}
                  animate={{
                    rotateY: isRevealed ? 0 : 180,
                    opacity: 1,
                    scale: isRevealed ? [1, 1.08, 1] : 1,
                  }}
                  transition={{
                    rotateY: { duration: 0.5, ease: 'easeOut' },
                    scale: { duration: 0.3, delay: 0.2 },
                  }}
                  style={{ perspective: '600px' }}
                >
                  {isRevealed ? (
                    <div className="flex flex-col gap-2">
                      {sub.cards.map((card, ci) => (
                        <GameCard key={card.id} card={card} size="sm" rotation={ci === 1 ? 2 : 0} />
                      ))}
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 160,
                        height: 220,
                        backgroundColor: '#666',
                        borderRadius: 16,
                        border: '3px solid var(--theme-border)',
                        boxShadow: '4px 4px 0px var(--theme-shadow)',
                      }}
                    >
                      <span style={{ fontSize: 48, opacity: 0.5 }}>🃏</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {submissions.map((_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: i < revealedCount ? '#66FF00' : 'var(--theme-border-light)',
                border: '2px solid var(--theme-border)',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </motion.div>

        <div className="h-8" />
      </div>
    </div>
  )
}
