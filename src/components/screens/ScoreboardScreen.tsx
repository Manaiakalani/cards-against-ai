'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'
import { GameCard } from '@/components/GameCard'

export default function ScoreboardScreen() {
  const { gameState, continueFromScoreboard } = useGame()
  const { players, currentRound, roundHistory, czarId } = gameState

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leadScore = sortedPlayers[0]?.score ?? 0
  const lastResult = roundHistory[roundHistory.length - 1]

  // Find the next czar (the czarId in gameState is already set for the next round)
  const nextCzar = players.find((p) => p.id === czarId)

  const rotations = [-1, 1.5, -0.5, 1, -1.5, 0.5]

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#F4F4EE' }}
    >
      <PosterBackground words={['funding', 'round', 'valuation']} opacity={0.4} />

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        {/* Header */}
        <div className="flex w-full max-w-[800px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.h1
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 'clamp(48px, 10vw, 84px)',
                fontWeight: 400,
                lineHeight: 0.9,
                color: '#111111',
                textTransform: 'uppercase',
              }}
            >
              STANDINGS
            </motion.h1>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="mt-3"
            >
              <Sticker color="pink" rotation={-3}>
                After Round {currentRound}
              </Sticker>
            </motion.div>
          </div>

          {/* Next Czar badge */}
          {nextCzar && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 11,
                  color: '#888888',
                }}
              >
                Next Czar
              </span>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  border: '3px solid #111111',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '4px 4px 0px #111111',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: nextCzar.avatarBg,
                    border: '2px solid #111',
                    fontSize: 16,
                  }}
                >
                  {nextCzar.avatar}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 16,
                    color: '#111111',
                  }}
                >
                  {nextCzar.name}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Player score list */}
        <div className="mt-10 flex w-full max-w-[800px] flex-col gap-4">
          {sortedPlayers.map((player, i) => {
            const isLeader = player.score === leadScore && leadScore > 0
            const rotation = rotations[i % rotations.length]

            return (
              <motion.div
                key={player.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.15 * i,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                className="flex items-center justify-between"
                style={{
                  padding: 'clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px)',
                  backgroundColor: isLeader ? '#66FF00' : '#FFFFFF',
                  border: '4px solid #111111',
                  borderRadius: 12,
                  boxShadow: '10px 10px 0px rgba(0,0,0,0.1)',
                  transform: `rotate(${rotation}deg)${isLeader ? ' scale(1.05)' : ''}`,
                  zIndex: isLeader ? 10 : 1,
                  position: 'relative',
                }}
              >
                {/* Left: rank + avatar + name */}
                <div className="flex items-center gap-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(20px, 3vw, 32px)',
                      color: '#111111',
                      minWidth: 40,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: player.avatarBg,
                      border: '3px solid #111',
                      fontSize: 24,
                    }}
                  >
                    {player.avatar}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 22,
                      color: '#111111',
                    }}
                  >
                    {player.name}
                  </span>
                  {player.isBot && (
                    <span
                      className="rounded px-2 py-0.5 text-xs uppercase"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        backgroundColor: '#EEE',
                        color: '#888',
                        border: '1px solid #CCC',
                      }}
                    >
                      Bot
                    </span>
                  )}
                </div>

                {/* Right: score */}
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(24px, 4vw, 42px)',
                      color: '#111111',
                    }}
                  >
                    {player.score}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 14,
                      color: '#666666',
                    }}
                  >
                    pts
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Last round winning combo */}
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <span
              className="uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                color: '#888888',
              }}
            >
              Last Round Winner
            </span>
            <div className="flex items-center gap-4">
              <GameCard
                card={lastResult.blackCard}
                size="sm"
                showFooter={false}
                rotation={-2}
              />
              <GameCard
                card={lastResult.winningCard}
                variant="white"
                size="sm"
                showFooter={false}
                rotation={3}
              />
              <div className="ml-2 flex flex-col items-start">
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 18,
                    color: '#111111',
                  }}
                >
                  {players.find((p) => p.id === lastResult.winnerId)?.name ?? 'Unknown'}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    color: '#999',
                  }}
                >
                  won the round
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Spacer for bottom nav */}
        <div className="h-32" />
      </div>

      <BottomNav>
        <NavButton variant="primary" onClick={continueFromScoreboard}>
          NEXT ROUND →
        </NavButton>
      </BottomNav>
    </div>
  )
}
