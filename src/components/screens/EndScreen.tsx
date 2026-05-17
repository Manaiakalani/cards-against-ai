'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { Sticker } from '@/components/Sticker'
import { SiteFooter } from '@/components/SiteFooter'
import { useAchievements } from '@/hooks/useAchievements'
import { useStats } from '@/hooks/useStats'
import { pushToast } from '@/components/AchievementToast'
import { useSound } from '@/hooks/useSound'
import { RoundHistory } from '@/components/RoundHistory'
import type { RoundResult } from '@/types/game'

// --- Enhanced confetti system ---

const CONFETTI_COLORS = [
  '#FF4242', '#66FF00', '#FFB6C1', '#111111',
  '#FFD700', '#FF69B4', '#00FFFF', '#FF8C00',
]

type ConfettiShape = 'square' | 'circle' | 'strip'

interface ConfettiConfig {
  color: string
  shape: ConfettiShape
  left: number
  size: number
  delay: number
  duration: number
  drift: number
  rotateSpeed: number
}

function buildConfetti(index: number): ConfettiConfig {
  const seed1 = ((index * 7919) % 97) / 97
  const seed2 = ((index * 6271) % 89) / 89
  const seed3 = ((index * 4973) % 83) / 83
  const shapes: ConfettiShape[] = ['square', 'circle', 'strip']

  return {
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    shape: shapes[index % 3],
    left: 2 + seed1 * 96,
    size: 5 + seed2 * 9,
    delay: seed3 * 3,
    duration: 2.5 + seed1 * 3,
    drift: (seed2 - 0.5) * 120,
    rotateSpeed: 180 + seed3 * 540,
  }
}

function ConfettiPiece({ config }: { config: ConfettiConfig }) {
  const { color, shape, left, size, delay, duration, drift, rotateSpeed } = config

  const shapeStyle: React.CSSProperties =
    shape === 'circle'
      ? { width: size, height: size, borderRadius: '50%', backgroundColor: color }
      : shape === 'strip'
        ? { width: size * 0.35, height: size * 1.8, backgroundColor: color, borderRadius: 1 }
        : { width: size, height: size, backgroundColor: color }

  return (
    <motion.div
      initial={{ y: -30, x: 0, opacity: 0.9, rotate: 0, scale: 1 }}
      animate={{
        y: '105vh',
        x: [0, drift * 0.5, drift, drift * 0.7],
        rotate: [0, rotateSpeed, rotateSpeed * 2],
        opacity: [0.9, 0.9, 0.7, 0],
        scale: [1, 1, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeIn',
      }}
      className="pointer-events-none fixed z-5"
      style={{ left: `${left}%`, top: '-30px', ...shapeStyle }}
    />
  )
}

// --- Animated count-up hook ---

function useCountUp(target: number, durationMs = 1500, delayMs = 0): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    const start = performance.now() + delayMs
    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const progress = Math.min(elapsed / durationMs, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [target, durationMs, delayMs])

  useEffect(() => {
    animate()
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return value
}

// --- Best combo picker ---

function pickBestCombo(
  roundHistory: RoundResult[],
  winnerId: string | undefined,
): RoundResult | null {
  if (roundHistory.length === 0) return null
  const humanWin = roundHistory.find(r => r.winnerId === 'player-1')
  if (humanWin) return humanWin
  if (winnerId) {
    const winnerWin = roundHistory.find(r => r.winnerId === winnerId)
    if (winnerWin) return winnerWin
  }
  return roundHistory[0]
}

// --- Main component ---

export default function EndScreen() {
  const { gameState, newGame } = useGame()
  const { stats: achStats, checkAndUnlock } = useAchievements()
  const { recordGameEnd } = useStats()
  const { play } = useSound()
  const tracked = useRef(false)
  const [showHistory, setShowHistory] = useState(false)

  const sortedPlayers = useMemo(
    () => [...gameState.players].sort((a, b) => b.score - a.score),
    [gameState.players]
  )
  const winner = sortedPlayers[0]

  const confettiConfigs = useMemo(
    () => Array.from({ length: 50 }, (_, i) => buildConfetti(i)),
    []
  )

  const totalRounds = gameState.roundHistory.length
  const winnerRounds = gameState.roundHistory.filter(r => r.winnerId === winner?.id).length
  const humanWon = winner?.id === 'player-1'
  const humanLosses = gameState.roundHistory.filter(r => r.winnerId !== 'player-1').length

  const bestCombo = useMemo(
    () => pickBestCombo(gameState.roundHistory, winner?.id),
    [gameState.roundHistory, winner?.id]
  )
  const bestComboPlayer = useMemo(
    () => bestCombo ? gameState.players.find(p => p.id === bestCombo.winnerId) : null,
    [bestCombo, gameState.players]
  )

  // Animated stat counters (staggered)
  const animScore = useCountUp(winner?.score ?? 0, 1500, 500)
  const animWinnerRounds = useCountUp(winnerRounds, 1500, 700)
  const animTotalRounds = useCountUp(totalRounds, 1500, 900)

  // Track game end for stats + achievements (once)
  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    play('gameEnd')
    // Estimate game duration from round count (~30s per round)
    const estimatedDurationMs = totalRounds * 30_000
    recordGameEnd(humanWon, estimatedDurationMs, gameState.settings.selectedDecks)

    const newlyUnlocked = checkAndUnlock({
      gamesPlayed: achStats.gamesPlayed + 1,
      ...(humanWon ? { gamesWon: achStats.gamesWon + 1 } : {}),
      ...(humanWon && humanLosses === 0 ? { perfectGames: achStats.perfectGames + 1 } : {}),
    })
    if (newlyUnlocked.length > 0) pushToast(newlyUnlocked)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  const headlineText = humanWon
    ? 'YOU ATE THE WHOLE TABLE 🏆'
    : 'DEFEATED BY THE ALGORITHM 🤖'

  return (
    <div className="relative h-dvh overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <PosterBackground words={['slay', 'iconic', 'legend']} opacity={0.9} />

      {/* Enhanced Confetti */}
      {confettiConfigs.map((cfg, i) => (
        <ConfettiPiece key={i} config={cfg} />
      ))}

      <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto px-4 py-8">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="relative mb-4"
        >
          <span
            style={{
              fontSize: 'clamp(72px, 15vw, 120px)',
              filter: 'drop-shadow(8px 12px 0px var(--theme-shadow-soft))',
              display: 'block',
            }}
          >
            {humanWon ? '🏆' : '🤖'}
          </span>
          <div className="absolute -right-6 -top-2">
            <Sticker color="pink" rotation={15}>
              {humanWon ? 'SLAY' : 'GG'}
            </Sticker>
          </div>
        </motion.div>

        {/* Winner Headline */}
        <motion.h1
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 10 }}
          className="mb-2 text-center"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(36px, 8vw, 72px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: humanWon ? '#66FF00' : '#FF4242',
            WebkitTextStroke: '2px #111',
            textShadow: '6px 6px 0px #111',
            textWrap: 'balance',
          }}
        >
          {headlineText}
        </motion.h1>

        {/* Winner Name Badge */}
        {winner && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 14 }}
            className="mb-8 inline-block"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(22px, 5vw, 32px)',
              fontWeight: 900,
              background: '#111',
              color: 'white',
              padding: '10px 30px',
              transform: 'rotate(-2deg)',
            }}
          >
            {winner.name}
          </motion.div>
        )}

        {/* Animated Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-5"
        >
          {[
            { value: animScore, label: 'Points' },
            { value: animWinnerRounds, label: 'Rounds Won' },
            { value: animTotalRounds, label: 'Total Rounds' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="flex flex-col items-center"
              style={{
                background: 'var(--theme-surface)',
                border: '3px solid var(--theme-border)',
                padding: 'clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                boxShadow: '6px 6px 0px var(--theme-shadow)',
                minWidth: 'clamp(80px, 15vw, 120px)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 'clamp(32px, 7vw, 48px)',
                  fontWeight: 900,
                  color: 'var(--theme-text)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: 'var(--theme-text-secondary)',
                  fontWeight: 900,
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Best Combo Highlight */}
        {bestCombo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 140, damping: 16 }}
            className="mb-10 w-full max-w-xl"
          >
            <div
              className="mb-4 inline-block px-4 py-1"
              style={{
                backgroundColor: '#FFB6C1',
                border: '2px solid var(--theme-border)',
                fontFamily: 'var(--font-archivo)',
                fontSize: '18px',
                color: 'var(--theme-text)',
                textTransform: 'uppercase',
                transform: 'rotate(1deg)',
              }}
            >
              Best Combo
            </div>

            <motion.div
              animate={{
                boxShadow: [
                  '6px 6px 0px var(--theme-shadow), 0 0 0px 0px rgba(102,255,0,0)',
                  '6px 6px 0px var(--theme-shadow), 0 0 20px 6px rgba(102,255,0,0.35)',
                  '6px 6px 0px var(--theme-shadow), 0 0 0px 0px rgba(102,255,0,0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative overflow-hidden p-5"
              style={{
                backgroundColor: 'var(--theme-surface)',
                border: '4px solid var(--theme-border)',
              }}
            >
              {/* Round badge + winner */}
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: '#111',
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '14px',
                    color: 'white',
                  }}
                >
                  R{bestCombo.round}
                </div>
                {bestComboPlayer && (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                      style={{ backgroundColor: bestComboPlayer.avatarBg, border: '2px solid var(--theme-border)' }}
                    >
                      {bestComboPlayer.avatar}
                    </div>
                    <span
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-archivo)', color: 'var(--theme-text)' }}
                    >
                      {bestComboPlayer.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Cards */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div className="w-full sm:flex-1">
                  <GameCard card={bestCombo.blackCard} size="sm" showFooter={false} />
                </div>
                <span
                  className="hidden sm:block"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '24px',
                    color: 'var(--theme-text-muted)',
                    paddingTop: '12px',
                  }}
                >
                  +
                </span>
                <div className="flex w-full flex-col gap-2 sm:flex-1">
                  {bestCombo.winningCards.map(card => (
                    <GameCard key={card.id} card={card} size="sm" showFooter={false} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Final Standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-8 w-full max-w-lg"
        >
          <div
            className="mb-4 inline-block px-4 py-1"
            style={{
              backgroundColor: '#111',
              fontFamily: 'var(--font-archivo)',
              fontSize: '18px',
              color: 'white',
              textTransform: 'uppercase',
              transform: 'rotate(-1deg)',
            }}
          >
            Final Standings
          </div>
          <div className="flex flex-col gap-3">
            {sortedPlayers.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.08 }}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  background: i === 0 ? '#66FF00' : 'var(--theme-surface)',
                  border: '3px solid var(--theme-border)',
                  boxShadow: i === 0 ? '6px 6px 0px var(--theme-shadow)' : '4px 4px 0px var(--theme-shadow-soft)',
                  transform: `rotate(${i % 2 === 0 ? -0.5 : 0.8}deg)${i === 0 ? ' scale(1.03)' : ''}`,
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(18px, 3.5vw, 24px)',
                      color: i === 0 ? 'var(--theme-text)' : 'var(--theme-text-muted)',
                      width: '28px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    style={{
                      backgroundColor: player.avatarBg,
                      border: '2px solid var(--theme-border)',
                    }}
                  >
                    {player.avatar}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(14px, 3vw, 18px)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    {player.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 'clamp(20px, 4vw, 28px)',
                    color: 'var(--theme-text)',
                  }}
                >
                  {player.score}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Play Again + History Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-12 mb-4 flex flex-col items-center gap-4"
        >
          <motion.button
            onClick={newGame}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px var(--theme-shadow)' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px var(--theme-shadow)' }}
            className="cursor-pointer"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '24px',
              textTransform: 'uppercase',
              backgroundColor: '#66FF00',
              color: 'var(--theme-text)',
              padding: 'clamp(16px, 3vw, 24px) clamp(36px, 8vw, 60px)',
              borderRadius: '100px',
              border: '4px solid var(--theme-border)',
              boxShadow: '0px 8px 0px var(--theme-shadow)',
            }}
          >
            RUN IT BACK
          </motion.button>
          <motion.button
            onClick={() => setShowHistory(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '14px',
              backgroundColor: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              border: '3px solid var(--theme-border)',
              padding: '10px 20px',
              borderRadius: 12,
              boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
            }}
          >
            📜 History
          </motion.button>
        </motion.div>

        <div className="mb-12" />

        <SiteFooter />
      </div>

      {/* Round History Modal */}
      <RoundHistory
        open={showHistory}
        onClose={() => setShowHistory(false)}
        roundHistory={gameState.roundHistory}
        players={gameState.players}
      />
    </div>
  )
}
