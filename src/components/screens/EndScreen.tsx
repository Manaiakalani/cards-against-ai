'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'

export default function EndScreen() {
  const { gameState, newGame } = useGame()

  // Find winner (highest score)
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F4F4EE' }}>
      <PosterBackground words={['exit', 'unicorn', 'liquid']} opacity={0.9} />

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        {/* Winner Hero */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center"
        >
          <h1
            className="mb-2 text-center"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '80px',
              lineHeight: 1,
              color: '#66FF00',
              WebkitTextStroke: '2px #111',
              filter: 'drop-shadow(6px 6px 0px #111)',
            }}
          >
            THE UNICORN
          </h1>

          {winner && (
            <>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-center"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '120px',
                  lineHeight: 1,
                  color: '#111111',
                }}
              >
                {winner.name}
              </motion.h2>

              {/* Score Pill */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="mb-12 inline-block px-8 py-3"
                style={{
                  backgroundColor: '#FFB6C1',
                  border: '4px solid #111',
                  borderRadius: '16px',
                  boxShadow: '8px 8px 0px #111',
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '32px',
                  color: '#111',
                }}
              >
                {winner.score} {winner.score === 1 ? 'Point' : 'Points'}
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Winning Combos Section */}
        {gameState.roundHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full max-w-4xl"
          >
            <div
              className="mb-6 inline-block px-6 py-2"
              style={{
                backgroundColor: '#111',
                borderRadius: '8px',
                fontFamily: 'var(--font-archivo)',
                fontSize: '24px',
                color: 'white',
                transform: 'rotate(1deg)',
              }}
            >
              WINNING COMBOS
            </div>

            <div className="flex flex-col gap-6">
              {gameState.roundHistory.map((result, i) => {
                const roundWinner = gameState.players.find(
                  (p) => p.id === result.winnerId
                )
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{
                      backgroundColor: 'white',
                      border: '3px solid #111',
                      boxShadow: '4px 4px 0px #111',
                    }}
                  >
                    {/* Round Number */}
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

                    {/* Card Pair */}
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex-1">
                        <GameCard card={result.blackCard} size="sm" />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-archivo)',
                          fontSize: '20px',
                          color: '#ccc',
                        }}
                      >
                        +
                      </span>
                      <div className="flex-1">
                        <GameCard card={result.winningCard} size="sm" />
                      </div>
                    </div>

                    {/* Winner Name */}
                    {roundWinner && (
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                          style={{
                            backgroundColor: roundWinner.avatarBg,
                            border: '2px solid #111',
                          }}
                        >
                          {roundWinner.avatar}
                        </div>
                        <span
                          className="text-sm"
                          style={{
                            fontFamily: 'var(--font-archivo)',
                            color: '#111',
                          }}
                        >
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

        {/* Spacer for bottom nav */}
        <div className="h-28" />
      </div>

      <BottomNav>
        <NavButton variant="primary" onClick={newGame}>
          NEW GAME
        </NavButton>
      </BottomNav>
    </div>
  )
}
