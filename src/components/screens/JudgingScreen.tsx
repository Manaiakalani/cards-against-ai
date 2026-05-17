'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { GameHUD } from '@/components/GameHUD'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

const FAN_ANGLES = [-20, -10, 0, 10, 20]

export default function JudgingScreen() {
  const { gameState, pickWinner, botPickWinner } = useGame()
  const [selectedSubmissionIdx, setSelectedSubmissionIdx] = useState<number | null>(null)

  const humanPlayer = gameState.players.find((p) => p.id === 'player-1')
  const isHumanCzar = humanPlayer?.isCardCzar ?? false
  const czar = gameState.players.find((p) => p.id === gameState.czarId)

  // Auto-pick for bot czar
  useEffect(() => {
    if (isHumanCzar) return
    const timer = setTimeout(() => {
      botPickWinner()
    }, 2000)
    return () => clearTimeout(timer)
  }, [isHumanCzar, botPickWinner])

  // Reset selection on new round
  useEffect(() => {
    setSelectedSubmissionIdx(null)
  }, [gameState.currentRound])

  function handlePickWinner() {
    if (selectedSubmissionIdx === null) return
    const submission = gameState.submissions[selectedSubmissionIdx]
    if (submission) {
      pickWinner(submission.playerId)
    }
  }

  // Bot czar deliberating view
  if (!isHumanCzar) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F4F4EE' }}>
        <PosterBackground words={['czar', 'judge', 'verdict']} />
        <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-14">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full text-5xl"
            style={{
              backgroundColor: czar?.avatarBg ?? '#DDA0DD',
              border: '3px solid #111',
            }}
          >
            {czar?.avatar ?? '🤔'}
          </motion.div>
          <h2
            className="mb-2 text-center"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '36px',
              color: '#111',
            }}
          >
            The Czar is Deliberating...
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '16px',
              color: '#888',
            }}
          >
            {czar?.name ?? 'Bot'} is choosing a winner
          </p>
        </div>
      </div>
    )
  }

  // Human czar judging view
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F4F4EE' }}>
      <PosterBackground words={['czar', 'judge', 'verdict']} />
      <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />

      <div className="relative z-10 flex flex-col items-center px-4 pt-16 pb-8">
        {/* Status Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 inline-block px-5 py-2"
          style={{
            backgroundColor: '#111',
            borderRadius: '8px',
            fontFamily: 'var(--font-archivo)',
            fontSize: '14px',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Pick the Winner
        </motion.div>

        {/* Game Board */}
        <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
          {/* Black Card */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative flex-shrink-0"
            style={{ transform: 'rotate(-4deg)' }}
          >
            {gameState.currentBlackCard && (
              <GameCard
                card={gameState.currentBlackCard}
                size="lg"
                rotation={-4}
              />
            )}
            <div className="absolute -right-4 -top-4">
              <Sticker color="pink" rotation={8}>
                CARD CZAR
              </Sticker>
            </div>
          </motion.div>

          {/* Submitted Cards Fan */}
          <div className="relative flex min-h-[340px] w-full max-w-lg items-center justify-center">
            {gameState.submissions.map((sub, i) => {
              const angle = FAN_ANGLES[i % FAN_ANGLES.length] ?? 0
              const isSelected = selectedSubmissionIdx === i

              return (
                <motion.div
                  key={sub.playerId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{
                    opacity: 1,
                    y: isSelected ? -16 : 0,
                    rotate: angle,
                    scale: isSelected ? 1.08 : 1,
                  }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${50 + (i - (gameState.submissions.length - 1) / 2) * 70}px`,
                    transformOrigin: 'bottom center',
                    zIndex: isSelected ? 20 : 10 - Math.abs(angle),
                    boxShadow: isSelected
                      ? '0 0 0 3px #66FF00, 6px 6px 0px #111'
                      : undefined,
                    borderRadius: '16px',
                  }}
                  onClick={() => setSelectedSubmissionIdx(i)}
                >
                  <GameCard card={sub.card} size="md" isSelected={isSelected} />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Spacer for bottom nav */}
        <div className="h-28" />
      </div>

      <BottomNav>
        <NavButton
          variant="primary"
          onClick={handlePickWinner}
          disabled={selectedSubmissionIdx === null}
        >
          PICK WINNER
        </NavButton>
      </BottomNav>
    </div>
  )
}
