'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { Sticker } from '@/components/Sticker'
import { SiteFooter } from '@/components/SiteFooter'

const CONFETTI_COLORS = ['#FF4242', '#66FF00', '#FFB6C1', '#111111']

function ConfettiPiece({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
  const left = 5 + (index * 17) % 90
  const delay = index * 0.12
  const size = 6 + (index % 3) * 4

  return (
    <motion.div
      initial={{ y: -20, opacity: 0.8, rotate: 0 }}
      animate={{
        y: '100vh',
        rotate: [0, 180, 360],
        opacity: [0.8, 0.8, 0],
      }}
      transition={{
        duration: 3 + (index % 3),
        delay,
        repeat: Infinity,
        ease: 'easeIn',
      }}
      className="pointer-events-none fixed z-5"
      style={{
        left: `${left}%`,
        top: '-20px',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
      }}
    />
  )
}

export default function EndScreen() {
  const { gameState, newGame } = useGame()

  const sortedPlayers = useMemo(
    () => [...gameState.players].sort((a, b) => b.score - a.score),
    [gameState.players]
  )
  const winner = sortedPlayers[0]
  const confetti = useMemo(() => Array.from({ length: 30 }, (_, i) => i), [])

  const totalRounds = gameState.roundHistory.length
  const winnerRounds = gameState.roundHistory.filter(r => r.winnerId === winner?.id).length

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F4F4EE' }}>
      <PosterBackground words={['slay', 'iconic', 'legend']} opacity={0.9} />

      {/* Confetti */}
      {confetti.map((i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="relative mb-4"
        >
          <span
            style={{
              fontSize: '120px',
              filter: 'drop-shadow(8px 12px 0px rgba(0,0,0,0.15))',
              display: 'block',
            }}
          >
            🏆
          </span>
          <div className="absolute -right-6 -top-2">
            <Sticker color="pink" rotation={15}>
              SLAY
            </Sticker>
          </div>
        </motion.div>

        {/* Winner Title */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-2 text-center"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(48px, 10vw, 84px)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            color: '#66FF00',
            WebkitTextStroke: '2px #111',
            textShadow: '6px 6px 0px #111',
          }}
        >
          THE GOAT
        </motion.h1>

        {/* Winner Name Badge */}
        {winner && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 inline-block"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '32px',
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-5"
        >
          {[
            { value: winner?.score ?? 0, label: 'Points' },
            { value: winnerRounds, label: 'Rounds Won' },
            { value: totalRounds, label: 'Total Rounds' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{
                background: 'white',
                border: '3px solid #111',
                padding: 'clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                boxShadow: '6px 6px 0px #111',
                minWidth: 'clamp(80px, 15vw, 120px)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '36px',
                  color: '#111',
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: '#666',
                  fontWeight: 900,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Final Standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  background: i === 0 ? '#66FF00' : 'white',
                  border: '3px solid #111',
                  boxShadow: i === 0 ? '6px 6px 0px #111' : '4px 4px 0px rgba(0,0,0,0.1)',
                  transform: `rotate(${i % 2 === 0 ? -0.5 : 0.8}deg)${i === 0 ? ' scale(1.03)' : ''}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: '24px',
                      color: i === 0 ? '#111' : '#ccc',
                      width: '28px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    style={{
                      backgroundColor: player.avatarBg,
                      border: '2px solid #111',
                    }}
                  >
                    {player.avatar}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: '18px',
                      color: '#111',
                    }}
                  >
                    {player.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '28px',
                    color: '#111',
                  }}
                >
                  {player.score}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Best Combos */}
        {gameState.roundHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="w-full max-w-4xl"
          >
            <div
              className="mb-4 inline-block px-4 py-1"
              style={{
                backgroundColor: '#FFB6C1',
                border: '2px solid #111',
                fontFamily: 'var(--font-archivo)',
                fontSize: '18px',
                color: '#111',
                textTransform: 'uppercase',
                transform: 'rotate(1deg)',
              }}
            >
              Best Combos
            </div>

            <div className="flex flex-col gap-4">
              {gameState.roundHistory.map((result, i) => {
                const roundWinner = gameState.players.find(p => p.id === result.winnerId)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + i * 0.08 }}
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{
                      backgroundColor: 'white',
                      border: '3px solid #111',
                      boxShadow: '4px 4px 0px #111',
                    }}
                  >
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: '#111',
                        fontFamily: 'var(--font-archivo)',
                        fontSize: '16px',
                        color: 'white',
                      }}
                    >
                      {result.round}
                    </div>
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex-1">
                        <GameCard card={result.blackCard} size="sm" showFooter={false} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '20px', color: '#ccc' }}>+</span>
                      <div className="flex-1">
                        <GameCard card={result.winningCard} size="sm" showFooter={false} />
                      </div>
                    </div>
                    {roundWinner && (
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                          style={{ backgroundColor: roundWinner.avatarBg, border: '2px solid #111' }}
                        >
                          {roundWinner.avatar}
                        </div>
                        <span className="text-sm" style={{ fontFamily: 'var(--font-archivo)', color: '#111' }}>
                          {roundWinner.name}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Play Again Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 mb-12"
        >
          <motion.button
            onClick={newGame}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px #111111' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px #111111' }}
            className="cursor-pointer"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '24px',
              textTransform: 'uppercase',
              backgroundColor: '#66FF00',
              color: '#111',
              padding: 'clamp(16px, 3vw, 24px) clamp(36px, 8vw, 60px)',
              borderRadius: '100px',
              border: '4px solid #111',
              boxShadow: '0px 8px 0px #111',
            }}
          >
            RUN IT BACK
          </motion.button>
        </motion.div>

        <SiteFooter />
      </div>
    </div>
  )
}
