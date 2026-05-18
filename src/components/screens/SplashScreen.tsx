'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { allDecks } from '@/data/cards'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { CardIcon } from '@/components/CardIcon'
import { SiteFooter } from '@/components/SiteFooter'
import dynamic from 'next/dynamic'

const StatsScreen = dynamic(
  () => import('@/components/screens/StatsScreen').then((mod) => mod.StatsScreen),
  { ssr: false }
)
const AchievementsScreen = dynamic(
  () => import('@/components/screens/AchievementsScreen').then((mod) => mod.AchievementsScreen),
  { ssr: false }
)
const RoundHistory = dynamic(
  () => import('@/components/RoundHistory').then((mod) => mod.RoundHistory),
  { ssr: false }
)

export default function SplashScreen() {
  const { goToLobby } = useGame()
  const [showStats, setShowStats] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  const totalCards = useMemo(
    () => allDecks.reduce((sum, d) => sum + d.cards.blackCards.length + d.cards.whiteCards.length, 0),
    []
  )

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && showJoin) setShowJoin(false)
  }, [showJoin])

  useEffect(() => {
    if (showJoin) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [showJoin, handleEsc])

  const stagger = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12 },
    },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
    },
  }

  return (
    <div
      className="relative flex h-dvh items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <PosterBackground words={['slay', 'brainrot', 'unhinged']} opacity={0.9} />

      {/* Decorative floating cards — hidden on mobile */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: '15%',
          left: '10%',
          transform: 'rotate(-8deg)',
          opacity: 0.8,
          zIndex: 1,
        }}
      >
        <GameCard
          card={{ id: 'splash-black', text: 'The next _____ will be my entire personality.', type: 'black' }}
          size="sm"
          showFooter
        />
      </div>
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: '20%',
          right: '8%',
          transform: 'rotate(6deg)',
          opacity: 0.8,
          zIndex: 1,
        }}
      >
        <GameCard
          card={{ id: 'splash-white', text: 'Vibe coding at 3 AM with zero tests', type: 'white' }}
          size="sm"
          showFooter
        />
      </div>

      {/* Main content */}
      <m.div
        className="relative z-10 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Title block */}
        <m.div variants={fadeUp}>
          <h1
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(60px, 15vw, 120px)',
              fontWeight: 400,
              lineHeight: 0.9,
              color: 'white',
              WebkitTextStroke: '3px var(--theme-shadow)',
              textShadow: '8px 8px 0px var(--theme-shadow)',
            }}
          >
            CARDS
          </h1>
        </m.div>

        <m.div variants={fadeUp} className="mt-2">
          <span
            className="inline-block px-5 py-1"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: 'var(--theme-bg)',
              backgroundColor: 'var(--theme-text)',
              transform: 'rotate(-2deg)',
            }}
          >
            AGAINST
          </span>
        </m.div>

        <m.div variants={fadeUp} className="mt-2">
          <h2
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(48px, 12vw, 96px)',
              fontWeight: 400,
              lineHeight: 1,
              color: '#66FF00',
              WebkitTextStroke: '2px var(--theme-shadow)',
              textShadow: '6px 6px 0px var(--theme-shadow)',
            }}
          >
            AI
          </h2>
        </m.div>

        {/* Tagline */}
        <m.p
          variants={fadeUp}
          className="mt-6 uppercase tracking-wider"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 18,
            color: 'var(--theme-text)',
            fontWeight: 700,
            backgroundColor: 'var(--theme-backdrop)',
            padding: '6px 16px',
            borderRadius: 6,
          }}
        >
          The party game for chronically online people
        </m.p>

        {/* Deck info */}
        <m.p
          variants={fadeUp}
          className="mt-2"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'var(--theme-text-secondary)',
            backgroundColor: 'var(--theme-backdrop)',
            padding: '4px 12px',
            borderRadius: 4,
          }}
        >
          {totalCards} Cards • {allDecks.length} Decks • Unlimited Bad Takes
        </m.p>

        {/* Host / Join buttons */}
        <m.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <m.button
            onClick={goToLobby}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px var(--theme-shadow)' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px var(--theme-shadow)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="cursor-pointer uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 400,
              backgroundColor: '#66FF00',
              color: 'var(--theme-text)',
              border: '4px solid var(--theme-border)',
              padding: 'clamp(14px, 2.5vw, 20px) clamp(36px, 7vw, 64px)',
              borderRadius: 100,
              boxShadow: '0px 8px 0px var(--theme-shadow)',
            }}
          >
            🎮 HOST GAME
          </m.button>
          <m.button
            onClick={() => setShowJoin(true)}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px var(--theme-shadow)' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px var(--theme-shadow)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="cursor-pointer uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 400,
              backgroundColor: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              border: '4px solid var(--theme-border)',
              padding: 'clamp(14px, 2.5vw, 20px) clamp(36px, 7vw, 64px)',
              borderRadius: 100,
              boxShadow: '0px 8px 0px var(--theme-shadow)',
            }}
          >
            🔗 JOIN GAME
          </m.button>
        </m.div>

        {/* Menu buttons row */}
        <m.div variants={fadeUp} className="mt-4 flex flex-wrap justify-center gap-3">
          <m.button
            onClick={() => setShowStats(true)}
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
            📊 Stats
          </m.button>
          <m.button
            onClick={() => setShowAchievements(true)}
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
            🏆 Achievements
          </m.button>
          <m.button
            onClick={() => setShowFavorites(true)}
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
            ⭐ Favorites
          </m.button>
        </m.div>

        {/* Version footer */}
        <m.div
          variants={fadeUp}
          className="mt-6 flex items-center gap-3"
          style={{ color: 'var(--theme-text-muted)' }}
        >
          <CardIcon color="var(--theme-text-muted)" size={10} />
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--theme-text-muted)',
            }}
          >
            v1.0 MVP
          </span>
          <CardIcon color="var(--theme-text-muted)" size={10} />
        </m.div>

        {/* Footer */}
        <m.div variants={fadeUp} className="mt-4">
          <SiteFooter />
        </m.div>
      </m.div>

      {/* Modals */}
      <StatsScreen open={showStats} onClose={() => setShowStats(false)} />
      <AchievementsScreen open={showAchievements} onClose={() => setShowAchievements(false)} />
      <RoundHistory
        open={showFavorites}
        onClose={() => setShowFavorites(false)}
        favoritesOnly
      />

      {/* Join Game Modal */}
      <AnimatePresence>
        {showJoin && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowJoin(false)}
          >
            <m.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-lg p-8 shadow-hard"
              style={{
                backgroundColor: 'var(--theme-bg)',
                border: '4px solid var(--theme-border)',
              }}
            >
              <button
                onClick={() => setShowJoin(false)}
                className="absolute top-2 right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--theme-text)',
                  color: 'var(--theme-bg)',
                  border: '2px solid var(--theme-border)',
                  fontSize: 14,
                }}
              >
                ✕
              </button>

              <h2
                className="mb-2 text-center uppercase"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 28,
                  fontWeight: 900,
                  color: 'var(--theme-text)',
                }}
              >
                JOIN GAME
              </h2>
              <p
                className="mb-6 text-center"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 14,
                  color: 'var(--theme-muted)',
                }}
              >
                Enter the room code from a host
              </p>

              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="ROOM CODE"
                maxLength={6}
                className="mb-4 w-full rounded-lg px-4 py-3 text-center tracking-[4px] uppercase"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 24,
                  fontWeight: 900,
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  border: '3px solid var(--theme-border)',
                }}
              />

              <div
                className="rounded-lg p-4 text-center"
                style={{
                  backgroundColor: 'var(--theme-accent)',
                  border: '2px solid var(--theme-border)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--theme-text)',
                  }}
                >
                  🚧 Multiplayer Coming Soon
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    color: 'var(--theme-muted)',
                  }}
                >
                  Online multiplayer is in development. For now, host a game and play with AI bots!
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
