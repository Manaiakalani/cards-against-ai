'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { Card } from '@/types/game'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { GameHUD } from '@/components/GameHUD'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

export default function PlayingScreen() {
  const { gameState, submitCard, botSubmit, redrawHand } = useGame()
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [hasRedrawn, setHasRedrawn] = useState(false)

  const humanPlayer = gameState.players.find((p) => p.id === 'player-1')
  const isPlayerCzar = humanPlayer?.isCardCzar ?? false

  // When human is czar, auto-trigger bot submissions
  useEffect(() => {
    if (!isPlayerCzar) return
    const timer = setTimeout(() => {
      botSubmit()
    }, 1000)
    return () => clearTimeout(timer)
  }, [isPlayerCzar, botSubmit])

  const handleSelectCard = useCallback((card: Card) => {
    if (submitted) return
    setSelectedCard((prev) => (prev?.id === card.id ? null : card))
  }, [submitted])

  const handleConfirm = useCallback(() => {
    if (!selectedCard || !humanPlayer) return
    setSubmitted(true)
    submitCard('player-1', selectedCard)

    // Bots submit after a short random delay
    const delay = 500 + Math.random() * 1000
    setTimeout(() => {
      botSubmit()
    }, delay)
  }, [selectedCard, humanPlayer, submitCard, botSubmit])

  const handleRedraw = useCallback(() => {
    if (hasRedrawn || submitted) return
    redrawHand('player-1')
    setSelectedCard(null)
    setHasRedrawn(true)
  }, [hasRedrawn, submitted, redrawHand])

  // Czar waiting view
  if (isPlayerCzar) {
    return (
      <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F4F4EE' }}>
        <PosterBackground words={['equity', 'scaling', 'burn rate']} opacity={0.15} />
        <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-14">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              backgroundColor: '#FFB6C1',
              border: '3px solid #111',
              fontSize: '48px',
            }}
          >
            👑
          </motion.div>
          <h2
            className="mb-3 text-center"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(28px, 5vw, 42px)',
              color: '#111',
            }}
          >
            You&apos;re the Card Czar
          </h2>
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '18px',
              color: '#666',
            }}
          >
            Waiting for submissions...
          </p>
          <motion.div
            className="mt-6 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {gameState.players
              .filter((p) => !p.isCardCzar)
              .map((p) => {
                const hasSubmitted = gameState.submissions.some(
                  (s) => s.playerId === p.id
                )
                return (
                  <motion.div
                    key={p.id}
                    animate={{ opacity: hasSubmitted ? 1 : 0.4 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    style={{
                      backgroundColor: p.avatarBg,
                      border: '2px solid #111',
                    }}
                  >
                    {p.avatar}
                  </motion.div>
                )
              })}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F4F4EE' }}>
      <PosterBackground words={['equity', 'scaling', 'burn rate']} opacity={0.15} />
      <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />

      <div className="relative z-10 flex flex-col px-6 pt-16 pb-8">
        {/* Top Section: Title + Mini Black Card */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 'clamp(28px, 5vw, 42px)',
                color: '#111',
                lineHeight: 1.1,
              }}
            >
              Your Hand
            </h2>
            <p
              className="mt-1"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '16px',
                color: '#888',
              }}
            >
              {humanPlayer?.hand.length ?? 0} Cards Remaining
            </p>
          </div>

          {/* Mini Black Card */}
          {gameState.currentBlackCard && (
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex-shrink-0 px-4 py-3"
              style={{
                maxWidth: '260px',
                backgroundColor: '#111',
                borderRadius: '16px',
                border: '3px solid #111',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
              }}
            >
              <p
                className="text-sm leading-snug"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: 'white',
                }}
              >
                {gameState.currentBlackCard.text.replace(/_+/g, '_____')}
              </p>
            </motion.div>
          )}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {humanPlayer?.hand.map((card, i) => {
              const isSelected = selectedCard?.id === card.id
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: isSelected ? -8 : 0,
                    scale: isSelected ? 1.03 : 1,
                  }}
                  whileHover={{ scale: submitted ? 1 : 1.05, y: submitted ? 0 : -4 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative"
                  style={{
                    filter: isSelected ? 'none' : undefined,
                    boxShadow: isSelected
                      ? '0 0 0 3px #66FF00, 6px 6px 0px #111'
                      : undefined,
                    borderRadius: '16px',
                  }}
                >
                  <GameCard
                    card={card}
                    size="md"
                    isSelected={isSelected}
                    onClick={() => handleSelectCard(card)}
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: -6 }}
                      className="absolute -right-2 -top-3 z-20"
                    >
                      <Sticker color="green" rotation={-6}>
                        SELECTED
                      </Sticker>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Submitted overlay */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center"
          >
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '24px',
                color: '#111',
              }}
            >
              Card Submitted! Waiting for others...
            </p>
          </motion.div>
        )}

        {/* Spacer for bottom nav */}
        <div className="h-36" />
      </div>

      <BottomNav>
        <NavButton variant="secondary" onClick={handleRedraw} disabled={hasRedrawn || submitted}>
          {hasRedrawn ? '✓ REDRAWN' : 'REDRAW HAND'}
        </NavButton>
        <NavButton
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedCard || submitted}
        >
          CONFIRM SELECTION
        </NavButton>
      </BottomNav>
    </div>
  )
}
