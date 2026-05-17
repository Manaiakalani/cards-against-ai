'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

const CONFETTI_COLORS = ['#FF4242', '#66FF00', '#FFB6C1', '#111111', '#FFD700', '#87CEEB', '#DDA0DD']

function ConfettiPiece({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
  const left = 10 + (index * 13) % 80
  const delay = index * 0.15
  const width = 10 + (index % 3) * 6
  const height = 14 + (index % 4) * 4

  return (
    <motion.div
      initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: '100vh',
        x: [0, (index % 2 === 0 ? 30 : -30), 0],
        rotate: [0, 180, 360],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 3 + (index % 2),
        delay,
        repeat: Infinity,
        ease: 'easeIn',
      }}
      className="pointer-events-none absolute z-50"
      style={{
        left: `${left}%`,
        top: '-20px',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        border: '2px solid #111',
      }}
    />
  )
}

export default function ResultsScreen() {
  const { gameState, nextRound } = useGame()

  const latestResult = gameState.roundHistory[gameState.roundHistory.length - 1]
  const winner = gameState.players.find((p) => p.id === latestResult?.winnerId)
  const czar = gameState.players.find((p) => p.id === latestResult?.czarId)

  const confettiPieces = useMemo(() => Array.from({ length: 8 }, (_, i) => i), [])

  if (!latestResult) return null

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <PosterBackground words={['ate', 'left no', 'crumbs']} opacity={0.9} />

      {/* Confetti */}
      {confettiPieces.map((i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        {/* Title */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="mb-2 text-center"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(36px, 8vw, 64px)',
            lineHeight: 1,
            color: 'var(--theme-text)',
            filter: 'drop-shadow(4px 4px 0px var(--theme-shadow-soft))',
          }}
        >
          ATE & LEFT NO CRUMBS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--theme-text-secondary)',
          }}
        >
          Round {latestResult.round} &bull; The Main Event
        </motion.p>

        {/* Winning Pair */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0"
        >
          <div style={{ transform: 'rotate(-4deg)' }} className="sm:translate-x-5">
            <GameCard card={latestResult.blackCard} size="sm" rotation={-4} />
          </div>
          <div className="relative flex flex-col gap-2 sm:-translate-x-5" style={{ transform: 'rotate(4deg)' }}>
            {latestResult.winningCards.map((card, ci) => (
              <GameCard key={card.id} card={card} size="sm" rotation={ci === 0 ? 4 : 6} />
            ))}
            {/* Winner Ticket Sticker */}
            <div className="absolute -right-3 -top-3 z-20">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 6 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <Sticker color="green" rotation={6}>
                  THEY ATE
                </Sticker>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Judge Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Winner Info */}
          {winner && (
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                style={{
                  backgroundColor: winner.avatarBg,
                  border: '3px solid var(--theme-border)',
                }}
              >
                {winner.avatar}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '28px',
                  color: 'var(--theme-text)',
                }}
              >
                {winner.name}
              </span>
            </div>
          )}

          {/* Inline Next Round button */}
          <div className="my-6">
            <NavButton variant="primary" onClick={nextRound}>
              KEEP GOING →
            </NavButton>
          </div>

          {/* Czar Badge */}
          {czar && (
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                style={{
                  backgroundColor: czar.avatarBg,
                  border: '2px solid var(--theme-border)',
                }}
              >
                {czar.avatar}
              </div>
              <span
                className="text-sm uppercase tracking-wide"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: 'var(--theme-text-muted)',
                }}
              >
                Judged by
              </span>
              <span
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                {czar.name}
              </span>
            </div>
          )}
        </motion.div>

        <div className="h-8" />
      </div>
    </div>
  )
}
