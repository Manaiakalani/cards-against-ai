'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { CardIcon } from '@/components/CardIcon'
import { SiteFooter } from '@/components/SiteFooter'
import { StatsScreen } from '@/components/screens/StatsScreen'
import { AchievementsScreen } from '@/components/screens/AchievementsScreen'

export default function SplashScreen() {
  const { goToLobby } = useGame()
  const [showStats, setShowStats] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)

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
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
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
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Title block */}
        <motion.div variants={fadeUp}>
          <h1
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(60px, 15vw, 120px)',
              fontWeight: 400,
              lineHeight: 0.9,
              color: 'white',
              WebkitTextStroke: '3px #111',
              textShadow: '8px 8px 0px #111',
            }}
          >
            CARDS
          </h1>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-2">
          <span
            className="inline-block px-5 py-1"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: 'white',
              backgroundColor: '#111111',
              transform: 'rotate(-2deg)',
            }}
          >
            AGAINST
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-2">
          <h2
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(48px, 12vw, 96px)',
              fontWeight: 400,
              lineHeight: 1,
              color: '#66FF00',
              WebkitTextStroke: '2px #111',
              textShadow: '6px 6px 0px #111',
            }}
          >
            AI
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
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
        </motion.p>

        {/* Deck info */}
        <motion.p
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
          189 Cards • 6 Decks • Unlimited Bad Takes
        </motion.p>

        {/* Play button */}
        <motion.div variants={fadeUp} className="mt-10">
          <motion.button
            onClick={goToLobby}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px var(--theme-shadow)' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px var(--theme-shadow)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="cursor-pointer uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 400,
              backgroundColor: '#66FF00',
              color: 'var(--theme-text)',
              border: '4px solid var(--theme-border)',
              padding: 'clamp(16px, 3vw, 24px) clamp(40px, 8vw, 80px)',
              borderRadius: 100,
              boxShadow: '0px 8px 0px var(--theme-shadow)',
            }}
          >
            PLAY
          </motion.button>
        </motion.div>

        {/* Menu buttons row */}
        <motion.div variants={fadeUp} className="mt-4 flex gap-3">
          <motion.button
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
          </motion.button>
          <motion.button
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
          </motion.button>
        </motion.div>

        {/* Version footer */}
        <motion.div
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
        </motion.div>

        {/* Footer */}
        <motion.div variants={fadeUp} className="mt-4">
          <SiteFooter />
        </motion.div>
      </motion.div>

      {/* Modals */}
      <StatsScreen open={showStats} onClose={() => setShowStats(false)} />
      <AchievementsScreen open={showAchievements} onClose={() => setShowAchievements(false)} />
    </div>
  )
}
