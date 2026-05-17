'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

export default function ScoreboardScreen() {
  const { gameState, continueFromScoreboard } = useGame()
  const { players, currentRound, roundHistory, czarId } = gameState

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leadScore = sortedPlayers[0]?.score ?? 0
  const lastResult = roundHistory[roundHistory.length - 1]

  // Find the next czar (the czarId in gameState is already set for the next round)
  const nextCzar = players.find((p) => p.id === czarId)

  const rotations = [-0.5, 0.8, -0.3, 0.5, -0.8, 0.3]

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: '#F4F4EE' }}
    >
      <PosterBackground words={['main', 'character', 'energy']} opacity={0.4} />

      <div className="relative z-10 flex flex-col items-center px-6 py-12 sm:px-8">
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
        <div className="mt-10 flex w-full max-w-[800px] flex-col gap-4 overflow-hidden px-2">
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
                  boxShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                  transform: `rotate(${rotation}deg)${isLeader ? ' scale(1.05)' : ''}`,
                  zIndex: isLeader ? 10 : 1,
                  position: 'relative',
                }}
              >
                {/* Left: rank + avatar + name */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(20px, 3vw, 32px)',
                      color: '#111111',
                      minWidth: 28,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="flex flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: player.avatarBg,
                      border: '3px solid #111',
                      fontSize: 20,
                    }}
                  >
                    {player.avatar}
                  </div>
                  <span
                    className="truncate"
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(16px, 2.5vw, 22px)',
                      color: '#111111',
                    }}
                  >
                    {player.name}
                  </span>
                  {player.isBot && (
                    <span
                      className="hidden rounded px-2 py-0.5 text-xs uppercase sm:inline"
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
                <div className="flex flex-shrink-0 items-baseline gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(22px, 4vw, 42px)',
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
            className="mt-12 flex w-full max-w-[800px] flex-col items-center gap-3"
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
            <div
              className="flex w-full items-center gap-3 rounded-2xl p-4"
              style={{
                backgroundColor: 'white',
                border: '3px solid #111',
                boxShadow: '4px 4px 0px #111',
              }}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg"
                style={{
                  backgroundColor: players.find((p) => p.id === lastResult.winnerId)?.avatarBg ?? '#DDA0DD',
                  border: '2px solid #111',
                }}
              >
                {players.find((p) => p.id === lastResult.winnerId)?.avatar ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#111',
                  }}
                >
                  {lastResult.blackCard.text.replace(/_+/g, '____')}
                </p>
                <p
                  className="mt-0.5 truncate"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    color: '#2D8C00',
                    fontWeight: 700,
                  }}
                >
                  → {lastResult.winningCard.text}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-sm"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  color: '#111',
                }}
              >
                {players.find((p) => p.id === lastResult.winnerId)?.name ?? 'Unknown'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Inline Next Round button */}
        <div className="mt-8 mb-12 flex justify-center">
          <NavButton variant="primary" onClick={continueFromScoreboard}>
            KEEP GOING →
          </NavButton>
        </div>
      </div>
    </div>
  )
}
