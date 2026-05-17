'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { CardIcon } from '@/components/CardIcon'

export default function SplashScreen() {
  const { goToLobby } = useGame()

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
      style={{ backgroundColor: '#F4F4EE' }}
    >
      <PosterBackground words={['cards', 'against', 'artificial intelligence']} opacity={0.9} />

      {/* Decorative floating cards — hidden on mobile */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: '15%',
          left: '10%',
          width: 220,
          height: 320,
          borderRadius: 18,
          backgroundColor: '#111111',
          border: '3px solid #333',
          boxShadow: '15px 25px 45px rgba(0,0,0,0.25)',
          transform: 'rotate(-8deg)',
          opacity: 0.35,
          padding: '24px 20px',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#FFFFFF',
          }}
        >
          The next _____ will disrupt the entire _____.
        </span>
      </div>
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: '20%',
          right: '8%',
          width: 200,
          height: 290,
          borderRadius: 18,
          backgroundColor: '#FFFFFF',
          border: '3px solid #111111',
          boxShadow: '15px 25px 45px rgba(0,0,0,0.25)',
          transform: 'rotate(6deg)',
          opacity: 0.3,
          padding: '24px 20px',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#111111',
          }}
        >
          A blockchain-powered cat
        </span>
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
            color: '#666666',
          }}
        >
          The party game for horrible AI people
        </motion.p>

        {/* Deck info */}
        <motion.p
          variants={fadeUp}
          className="mt-2"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: '#999999',
          }}
        >
          176 Cards • 6 Decks • Unlimited Bad Takes
        </motion.p>

        {/* Play button */}
        <motion.div variants={fadeUp} className="mt-10">
          <motion.button
            onClick={goToLobby}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px #111111' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px #111111' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="cursor-pointer uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 400,
              backgroundColor: '#66FF00',
              color: '#111111',
              border: '4px solid #111111',
              padding: 'clamp(16px, 3vw, 24px) clamp(40px, 8vw, 80px)',
              borderRadius: 100,
              boxShadow: '0px 8px 0px #111111',
            }}
          >
            PLAY
          </motion.button>
        </motion.div>

        {/* Version footer */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex items-center gap-3"
          style={{ color: '#AAAAAA' }}
        >
          <CardIcon color="#AAAAAA" size={10} />
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: '#AAAAAA',
            }}
          >
            v1.0 MVP
          </span>
          <CardIcon color="#AAAAAA" size={10} />
        </motion.div>
      </motion.div>
    </div>
  )
}
