'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'
import { RoundHistory } from '@/components/RoundHistory'

export default function ScoreboardScreen() {
  const { gameState, continueFromScoreboard } = useGame()
  const { players, currentRound, roundHistory, czarId } = gameState
  const [showHistory, setShowHistory] = useState(false)

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leadScore = sortedPlayers[0]?.score ?? 0
  const lastResult = roundHistory[roundHistory.length - 1]

  // Find the next czar (the czarId in gameState is already set for the next round)
  const nextCzar = players.find((p) => p.id === czarId)

  const rotations = [-0.5, 0.8, -0.3, 0.5, -0.8, 0.3]

  return (
    <div
      className="relative h-dvh overflow-hidden"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <PosterBackground words={['main', 'character', 'energy']} opacity={0.4} />

      <div className="relative z-10 flex h-full flex-col">
        {/* Scrollable content */}
        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain px-6 pt-8 pb-4 sm:px-8">
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
                color: 'var(--theme-text)',
                textWrap: 'balance',
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
                  color: 'var(--theme-text-muted)',
                }}
              >
                Next Czar
              </span>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  border: '3px solid var(--theme-border)',
                  backgroundColor: 'var(--theme-surface)',
                  boxShadow: '4px 4px 0px var(--theme-shadow)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: nextCzar.avatarBg,
                    border: '2px solid var(--theme-border)',
                    fontSize: 16,
                  }}
                >
                  {nextCzar.avatar}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 16,
                    color: 'var(--theme-text)',
                  }}
                >
                  {nextCzar.name}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Player score list */}
        <div className="mt-6 flex w-full max-w-[800px] flex-col gap-3 px-2">
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
                className="flex min-w-0 items-center justify-between"
                style={{
                  padding: 'clamp(10px, 1.5vw, 16px) clamp(12px, 2.5vw, 28px)',
                  backgroundColor: isLeader ? '#66FF00' : 'var(--theme-surface)',
                  border: '3px solid var(--theme-border)',
                  borderRadius: 12,
                  boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
                  transform: `rotate(${rotation}deg)${isLeader ? ' scale(1.03)' : ''}`,
                  zIndex: isLeader ? 10 : 1,
                  position: 'relative',
                }}
              >
                {/* Left: rank + avatar + name */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(18px, 2.5vw, 28px)',
                      color: 'var(--theme-text)',
                      minWidth: 24,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="flex flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: player.avatarBg,
                      border: '2px solid var(--theme-border)',
                      fontSize: 18,
                    }}
                  >
                    {player.avatar}
                  </div>
                  <span
                    className="truncate"
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 'clamp(14px, 2vw, 20px)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    {player.name}
                  </span>
                  {player.isBot && (
                    <span
                      className="hidden rounded px-2 py-0.5 text-xs uppercase sm:inline"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        backgroundColor: 'var(--theme-surface-alt)',
                        color: 'var(--theme-text-muted)',
                        border: '1px solid var(--theme-border-light)',
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
                      fontSize: 'clamp(20px, 3.5vw, 38px)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    {player.score}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 13,
                      color: 'var(--theme-text-secondary)',
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
            className="mt-6 flex w-full max-w-[800px] flex-col items-center gap-3"
          >
            <span
              className="uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                color: 'var(--theme-text-muted)',
              }}
            >
              Last Round Winner
            </span>
            <div
              className="flex w-full items-center gap-3 rounded-2xl p-4"
              style={{
                backgroundColor: 'var(--theme-surface)',
                border: '3px solid var(--theme-border)',
                boxShadow: '4px 4px 0px var(--theme-shadow)',
              }}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg"
                style={{
                  backgroundColor: players.find((p) => p.id === lastResult.winnerId)?.avatarBg ?? '#DDA0DD',
                  border: '2px solid var(--theme-border)',
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
                    color: 'var(--theme-text)',
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
                  → {lastResult.winningCards.map(c => c.text).join(' + ')}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-sm"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  color: 'var(--theme-text)',
                }}
              >
                {players.find((p) => p.id === lastResult.winnerId)?.name ?? 'Unknown'}
              </span>
            </div>
          </motion.div>
        )}
        </div>

        {/* Pinned bottom CTA — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex shrink-0 items-center justify-center gap-4 px-4 pb-6 pt-3"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          <NavButton variant="primary" onClick={continueFromScoreboard}>
            KEEP GOING →
          </NavButton>
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
      </div>

      {/* Round History Modal */}
      <RoundHistory
        open={showHistory}
        onClose={() => setShowHistory(false)}
        roundHistory={roundHistory}
        players={players}
      />
    </div>
  )
}
