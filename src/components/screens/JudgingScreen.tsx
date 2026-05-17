'use client'

import React, { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { useSound } from '@/hooks/useSound'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { GameHUD } from '@/components/GameHUD'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

export default function JudgingScreen() {
  const { gameState, pickWinner, botPickWinner } = useGame()
  const { play } = useSound()
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

  function handlePickWinner() {
    if (selectedSubmissionIdx === null) return
    const submission = gameState.submissions[selectedSubmissionIdx]
    if (submission) {
      play('winner')
      pickWinner(submission.playerId)
    }
  }

  // Bot czar deliberating view
  if (!isHumanCzar) {
    return (
      <div className="relative h-dvh overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <PosterBackground words={['slay', 'ate', 'period']} />
        <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-12">
          <m.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full text-5xl"
            style={{
              backgroundColor: czar?.avatarBg ?? '#DDA0DD',
              border: '3px solid var(--theme-border)',
            }}
          >
            {czar?.avatar ?? '🤔'}
          </m.div>
          <h2
            className="mb-2 text-center"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(24px, 5vw, 36px)',
              color: 'var(--theme-text)',
            }}
          >
            The Czar is Deliberating…
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '16px',
              color: 'var(--theme-text-muted)',
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
    <div className="relative h-dvh overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <PosterBackground words={['slay', 'ate', 'period']} />
      <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />

      <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto px-4 pt-12 pb-8">
        {/* Status Badge */}
        <m.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 inline-block px-5 py-2"
          style={{
            backgroundColor: 'var(--theme-text)',
            borderRadius: '8px',
            fontFamily: 'var(--font-archivo)',
            fontSize: '14px',
            color: 'var(--theme-bg)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Pick the Winner
        </m.div>

        {/* Game Board */}
        <div className="flex w-full max-w-5xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
          {/* Black Card */}
          <m.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative flex-shrink-0"
            style={{ transform: 'rotate(-4deg)' }}
          >
            {gameState.currentBlackCard && (
              <GameCard
                card={gameState.currentBlackCard}
                size="sm"
                rotation={-4}
              />
            )}
            <div className="absolute -right-4 -top-4">
              <Sticker color="pink" rotation={8}>
                MAIN JUDGE
              </Sticker>
            </div>
          </m.div>

          {/* Submitted Cards — Grid on mobile, spread on desktop */}
          <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            {gameState.submissions.map((sub, i) => {
              const isSelected = selectedSubmissionIdx === i

              return (
                <m.div
                  key={sub.playerId}
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{
                    opacity: 1,
                    y: isSelected ? -16 : 0,
                    scale: isSelected ? 1.08 : 1,
                  }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300 }}
                  className="cursor-pointer focus-visible:ring-4 focus-visible:ring-[#66FF00] focus-visible:outline-none"
                  style={{
                    zIndex: isSelected ? 20 : 10,
                    boxShadow: isSelected
                      ? '0 0 0 3px #66FF00, 6px 6px 0px var(--theme-shadow)'
                      : undefined,
                    borderRadius: '16px',
                    touchAction: 'manipulation',
                  }}
                  onClick={() => {
                    play('select')
                    setSelectedSubmissionIdx(i)
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      play('select')
                      setSelectedSubmissionIdx(i)
                    }
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {sub.cards.map((card, ci) => (
                      <GameCard key={card.id} card={card} size="sm" isSelected={isSelected} rotation={ci === 1 ? 2 : 0} />
                    ))}
                  </div>
                </m.div>
              )
            })}
          </div>
        </div>

        {/* Spacer for bottom nav */}
        <div className="h-36" />
      </div>

      <BottomNav>
        <NavButton
          variant="primary"
          onClick={handlePickWinner}
          disabled={selectedSubmissionIdx === null}
        >
          CROWN THEM 👑
        </NavButton>
      </BottomNav>
    </div>
  )
}
