'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { useSound } from '@/hooks/useSound'
import { useTimer } from '@/hooks/useTimer'
import { useAchievements } from '@/hooks/useAchievements'
import { useStats } from '@/hooks/useStats'
import { pushToast } from '@/components/AchievementToast'
import { Card } from '@/types/game'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { GameHUD } from '@/components/GameHUD'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

// Stagger container for card dealing animation
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const cardDealVariants = {
  hidden: (rotate: number) => ({
    opacity: 0,
    y: 60,
    scale: 0.8,
    rotate,
  }),
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
}

export default function PlayingScreen() {
  const { gameState, submitCard, submitCards, botSubmit, redrawHand, rebootHand } = useGame()
  const { play } = useSound()
  const { checkAndUnlock, stats: achStats } = useAchievements()
  const { recordCardPlayed, recordRedraw } = useStats()
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [hasRebooted, setHasRebooted] = useState(false)
  const [hasRedrawn, setHasRedrawn] = useState(false)
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const roundStartRef = useRef(Date.now())
  const [isDealt, setIsDealt] = useState(false)
  const dealRotationsRef = useRef<number[]>([])

  const humanPlayer = gameState.players.find((p) => p.id === 'player-1')
  const isPlayerCzar = humanPlayer?.isCardCzar ?? false
  const blanks = gameState.currentBlackCard?.blanks ?? 1
  const { timerEnabled, timerSeconds } = gameState.settings

  // Timer: auto-submit random card(s) when time expires
  const handleTimerExpire = useCallback(() => {
    if (submitted || isPlayerCzar || !humanPlayer) return
    const hand = humanPlayer.hand
    if (hand.length === 0) return

    play('tick')
    if (blanks === 1) {
      const randomCard = hand[Math.floor(Math.random() * hand.length)]
      setSubmitted(true)
      submitCard('player-1', randomCard)
    } else {
      const shuffled = [...hand].sort(() => Math.random() - 0.5)
      const picks = shuffled.slice(0, Math.min(blanks, hand.length))
      setSubmitted(true)
      submitCards('player-1', picks)
    }

    const delay = 500 + Math.random() * 1000
    botTimerRef.current = setTimeout(() => { botSubmit() }, delay)
  }, [submitted, isPlayerCzar, humanPlayer, blanks, submitCard, submitCards, botSubmit, play])

  const timer = useTimer({
    seconds: timerSeconds,
    enabled: timerEnabled && !isPlayerCzar,
    onExpire: handleTimerExpire,
  })

  // Start timer when playing phase begins
  useEffect(() => {
    if (timerEnabled && !isPlayerCzar) {
      timer.start()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup bot timer on unmount
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current)
    }
  }, [])

  // Generate random rotations for deal animation; mark dealt after stagger completes
  useEffect(() => {
    const handSize = humanPlayer?.hand.length ?? 0
    dealRotationsRef.current = Array.from(
      { length: handSize },
      () => (Math.random() - 0.5) * 16,
    )
    const dealDuration = handSize * 60 + 500
    const t = setTimeout(() => setIsDealt(true), dealDuration)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // When human is czar, auto-trigger bot submissions
  useEffect(() => {
    if (!isPlayerCzar) return
    const t = setTimeout(() => { botSubmit() }, 1000)
    return () => clearTimeout(t)
  }, [isPlayerCzar, botSubmit])

  // Play tick sound when timer is urgent
  useEffect(() => {
    if (timer.isUrgent && timer.isRunning) {
      play('tick')
    }
  }, [timer.timeLeft, timer.isUrgent, timer.isRunning, play])

  const handleSelectCard = useCallback((card: Card) => {
    if (submitted) return
    play('select')
    setSelectedCards(prev => {
      const isAlreadySelected = prev.some(c => c.id === card.id)
      if (isAlreadySelected) {
        return prev.filter(c => c.id !== card.id)
      }
      if (prev.length >= blanks) {
        // Replace the oldest selection
        return [...prev.slice(1), card]
      }
      return [...prev, card]
    })
  }, [submitted, blanks, play])

  const handleConfirm = useCallback(() => {
    if (selectedCards.length !== blanks || !humanPlayer) return
    setSubmitted(true)
    timer.stop()
    play('submit')

    // Track stats
    const submitMs = Date.now() - roundStartRef.current
    recordCardPlayed(selectedCards.length)
    const newlyUnlocked = checkAndUnlock({
      cardsPlayed: achStats.cardsPlayed + selectedCards.length,
      fastestSubmitMs: submitMs,
    })
    if (newlyUnlocked.length > 0) pushToast(newlyUnlocked)

    if (blanks === 1) {
      submitCard('player-1', selectedCards[0])
    } else {
      submitCards('player-1', selectedCards)
    }

    // Bots submit after a short random delay
    const delay = 500 + Math.random() * 1000
    botTimerRef.current = setTimeout(() => { botSubmit() }, delay)
  }, [selectedCards, blanks, humanPlayer, submitCard, submitCards, botSubmit, timer, play, recordCardPlayed, checkAndUnlock, achStats.cardsPlayed])

  const handleRedraw = useCallback(() => {
    if (hasRedrawn || submitted) return
    redrawHand('player-1')
    setSelectedCards([])
    setHasRedrawn(true)
    recordRedraw()
    checkAndUnlock({ redrawsUsed: achStats.redrawsUsed + 1 })
  }, [hasRedrawn, submitted, redrawHand, recordRedraw, checkAndUnlock, achStats.redrawsUsed])

  const handleReboot = useCallback(() => {
    if (hasRebooted || submitted) return
    if (!humanPlayer || humanPlayer.score < 1) return
    rebootHand('player-1')
    setSelectedCards([])
    setHasRebooted(true)
    play('submit')
  }, [hasRebooted, submitted, humanPlayer, rebootHand, play])

  // Czar waiting view
  if (isPlayerCzar) {
    return (
      <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <PosterBackground words={['no cap', 'fr fr', 'lowkey']} opacity={0.15} />
        <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-14">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              backgroundColor: '#FFB6C1',
              border: '3px solid var(--theme-border)',
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
              color: 'var(--theme-text)',
            }}
          >
            You&apos;re the Card Czar
          </h2>
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '18px',
              color: 'var(--theme-text-secondary)',
            }}
          >
            Waiting for everyone to lock in…
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
                      border: '2px solid var(--theme-border)',
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
    <div className="relative h-dvh overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <PosterBackground words={['no cap', 'fr fr', 'lowkey']} opacity={0.15} />
      <GameHUD round={gameState.currentRound} players={gameState.players} czarId={gameState.czarId} roomCode={gameState.roomCode} timer={timerEnabled ? { timeLeft: timer.timeLeft, progress: timer.progress, isUrgent: timer.isUrgent } : undefined} />

      <div className="relative z-10 flex h-full flex-col px-4 pt-12 pb-24 sm:px-6 sm:pt-14">
        {/* Top Section: Title + Mini Black Card */}
        <div className="mb-3 flex flex-shrink-0 flex-col gap-2 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 'clamp(22px, 4vw, 36px)',
                color: 'var(--theme-text)',
                lineHeight: 1.1,
              }}
            >
              Your Hand
            </h2>
            <p
              className="mt-0.5"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                color: 'var(--theme-text-muted)',
              }}
            >
              {blanks > 1 ? `Pick ${blanks} cards` : `${humanPlayer?.hand.length ?? 0} Cards Remaining`}
            </p>
          </div>

          {/* Mini Black Card */}
          {gameState.currentBlackCard && (
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex-shrink-0 px-3 py-2"
              style={{
                maxWidth: '240px',
                backgroundColor: '#111',
                borderRadius: '12px',
                border: '2px solid var(--theme-border)',
                boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
              }}
            >
              <p
                className="text-xs leading-snug sm:text-sm"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: 'white',
                }}
              >
                {gameState.currentBlackCard.text.replace(/_+/g, '_____')}
              </p>
              {blanks > 1 && (
                <span
                  className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: '#FF4242',
                    color: 'white',
                    fontFamily: 'var(--font-archivo)',
                  }}
                >
                  PICK {blanks}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Card Grid — scrollable area */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-lg" style={{ WebkitOverflowScrolling: 'touch' }}>
          <motion.div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4"
            variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {humanPlayer?.hand.map((card, i) => {
              const selectionIndex = selectedCards.findIndex(c => c.id === card.id)
              const isSelected = selectionIndex >= 0
              return (
                <motion.div
                  key={card.id}
                  custom={dealRotationsRef.current[i] ?? 0}
                  variants={cardDealVariants}
                  initial={isDealt ? false : undefined}
                  animate={isDealt ? {
                    opacity: 1,
                    y: isSelected ? -8 : 0,
                    scale: isSelected ? 1.03 : 1,
                    rotate: 0,
                  } : undefined}
                  whileHover={{ scale: submitted ? 1 : 1.05, y: submitted ? 0 : -4 }}
                  transition={isDealt ? { type: 'spring', stiffness: 400, damping: 30 } : undefined}
                  className="relative"
                  style={{
                    filter: isSelected ? 'none' : undefined,
                    boxShadow: isSelected
                      ? '0 0 0 3px #66FF00, 6px 6px 0px var(--theme-shadow)'
                      : undefined,
                    borderRadius: '16px',
                  }}
                >
                  <GameCard
                    card={card}
                    size="sm"
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
                        {blanks > 1 ? `#${selectionIndex + 1}` : 'THIS ONE'}
                      </Sticker>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
        </div>

        {/* Submitted overlay */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-shrink-0 flex-col items-center"
          >
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '20px',
                color: 'var(--theme-text)',
              }}
            >
              Card{blanks > 1 ? 's' : ''} Submitted! Waiting for others…
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav>
        <NavButton variant="secondary" onClick={handleRedraw} disabled={hasRedrawn || submitted}>
          {hasRedrawn ? '✓ DEALT' : '🔄 NEW HAND'}
        </NavButton>
        {gameState.settings.rebootEnabled && (
          <NavButton
            variant="dark"
            onClick={handleReboot}
            disabled={hasRebooted || submitted || (humanPlayer?.score ?? 0) < 1}
          >
            {hasRebooted ? '✓ REBOOTED' : '💥 REBOOT (-1pt)'}
          </NavButton>
        )}
        <NavButton
          variant="primary"
          onClick={handleConfirm}
          disabled={selectedCards.length !== blanks || submitted}
        >
          LOCK IT IN
        </NavButton>
      </BottomNav>
    </div>
  )
}
