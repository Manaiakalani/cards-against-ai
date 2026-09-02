'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { deckMeta } from '@/data/deckMeta'
import { PosterBackground } from '@/components/PosterBackground'
import { GameCard } from '@/components/GameCard'
import { CardIcon } from '@/components/CardIcon'
import { Code2, Sparkles, GitPullRequestArrow } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { SITE_LINKS } from '@/lib/tokens'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { YourGames } from '@/components/YourGames'
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

const footerIcons = {
  GitHub: Code2,
  'Submit a Deck': Sparkles,
  Contribute: GitPullRequestArrow,
} as const

function readRoomParam(): string {
  if (typeof window === 'undefined') return ''
  const room = new URLSearchParams(window.location.search)
    .get('room')
    ?.toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6)
  return room && room.length === 6 ? room : ''
}

export default function SplashScreen() {
  const { goToLobby, hostGame, hostAsyncGame, joinGame, mpState, asyncError } = useGame()
  const [showStats, setShowStats] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [joinCode, setJoinCode] = useState(readRoomParam)
  const [showJoin, setShowJoin] = useState(() => readRoomParam().length === 6)
  const [joinName, setJoinName] = useState('')
  const [joining, setJoining] = useState(false)
  const [asyncBusy, setAsyncBusy] = useState(false)

  const totalCards = useMemo(
    () => deckMeta.reduce((sum, d) => sum + d.blackCount + d.whiteCount, 0),
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

  // When an error occurs while joining, the user must be able to dismiss the
  // dialog or retry. We derive an "effectively joining" flag that becomes false
  // when an error is present, without needing setState in an effect.
  const effectivelyJoining = joining && !mpState.error

  const joinTrapRef = useFocusTrap<HTMLDivElement>(showJoin)

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
      className="relative flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto"
      style={{
        backgroundColor: 'var(--theme-bg)',
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
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
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(14px, 3vw, 18px)',
            color: 'var(--theme-text)',
            fontWeight: 900,
            backgroundColor: 'var(--theme-surface)',
            padding: '10px 20px',
            borderRadius: 12,
            border: '3px solid var(--theme-border)',
            boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          The party game for chronically online people
        </m.p>

        {/* Deck info */}
        <m.div
          variants={fadeUp}
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
        >
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 14,
              fontWeight: 900,
              backgroundColor: '#66FF00',
              color: '#111111',
              border: '2px solid var(--theme-border)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            🃏 {totalCards} Cards
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 14,
              fontWeight: 900,
              backgroundColor: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              border: '2px solid var(--theme-border)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            📦 {deckMeta.length} Decks
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 14,
              fontWeight: 900,
              backgroundColor: '#FF4242',
              color: '#111111',
              border: '2px solid var(--theme-border)',
            }}
          >
            🔥 Unlimited Bad Takes
          </span>
        </m.div>

        {/* Host / Join buttons */}
        <m.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <m.button
            onClick={() => {
              if (isSupabaseConfigured) {
                hostGame({ name: '', avatar: '🦄', avatarBg: '#FFD700' })
              } else {
                goToLobby()
              }
            }}
            whileHover={{ y: 2, boxShadow: '0px 6px 0px var(--theme-shadow)' }}
            whileTap={{ y: 6, boxShadow: '0px 2px 0px var(--theme-shadow)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="cursor-pointer uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 900,
              backgroundColor: '#66FF00',
              color: '#111111',
              border: '4px solid var(--theme-border)',
              padding: 'clamp(14px, 2.5vw, 20px) clamp(36px, 7vw, 64px)',
              borderRadius: 100,
              boxShadow: '0px 8px 0px var(--theme-shadow)',
              letterSpacing: '0.04em',
            }}
          >
            🎮 HOST GAME
          </m.button>
          {isSupabaseConfigured && (
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
          )}
        </m.div>

        {isSupabaseConfigured && (
          <m.div variants={fadeUp} className="mt-3 flex flex-col items-center gap-2">
            <m.button
              onClick={async () => {
                setAsyncBusy(true)
                await hostAsyncGame({ name: '', avatar: '🦄', avatarBg: '#FFD700' })
                setAsyncBusy(false)
              }}
              disabled={asyncBusy}
              whileHover={{ y: 2, boxShadow: '0px 6px 0px var(--theme-shadow)' }}
              whileTap={{ y: 6, boxShadow: '0px 2px 0px var(--theme-shadow)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="cursor-pointer uppercase"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 'clamp(16px, 2.6vw, 20px)',
                fontWeight: 400,
                backgroundColor: '#FFB6C1',
                color: '#111111',
                border: '4px solid var(--theme-border)',
                padding: 'clamp(12px, 2vw, 16px) clamp(28px, 6vw, 48px)',
                borderRadius: 100,
                boxShadow: '0px 8px 0px var(--theme-shadow)',
                letterSpacing: '0.04em',
                opacity: asyncBusy ? 0.6 : 1,
              }}
            >
              {asyncBusy ? '⏳ OPENING TABLE…' : '⏳ PLAY ASYNC'}
            </m.button>
            <p
              className="max-w-xs px-4 text-center"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                color: 'var(--theme-text-muted)',
                lineHeight: 1.4,
              }}
            >
              Take turns on your own time. Share a code, play a card, come back later.
            </p>
            <button
              type="button"
              onClick={goToLobby}
              className="cursor-pointer underline-offset-4 hover:underline"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 13,
                color: 'var(--theme-text-secondary)',
                background: 'none',
                border: 'none',
                padding: '8px 12px',
              }}
            >
              or play solo with bots
            </button>
          </m.div>
        )}

        {asyncError && (
          <m.p
            variants={fadeUp}
            className="mt-3 max-w-sm px-4 text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: '#C62828',
              fontWeight: 600,
            }}
          >
            {asyncError}
          </m.p>
        )}

        <YourGames />

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

        {/* Footer card */}
        <m.div
          variants={fadeUp}
          className="mt-6 flex flex-col items-center gap-4 w-full px-4 py-5"
          style={{
            backgroundColor: 'var(--theme-surface)',
            border: '3px solid var(--theme-border)',
            borderRadius: 16,
            boxShadow: '0px 6px 0px var(--theme-shadow)',
            maxWidth: 480,
          }}
        >
          {/* Version + links row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span
              className="footer-link inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
              style={{
                fontFamily: 'var(--font-inter)',
                backgroundColor: 'var(--_footer-bg, rgba(85,85,85,0.12))',
                color: 'var(--_footer-fg, #333)',
                border: '2px solid color-mix(in srgb, var(--_footer-fg, #333) 25%, transparent)',
                ['--_footer-bg-dark' as string]: 'rgba(224,224,224,0.15)',
                ['--_footer-fg-dark' as string]: '#E0E0E0',
              }}
            >
              <CardIcon color="currentColor" size={14} />
              v1.0 MVP
            </span>
            {SITE_LINKS.map(({ href, label, color, darkColor, bg, darkBg }) => {
              const Icon = footerIcons[label]
              return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold no-underline transition-all duration-150 hover:scale-105 active:scale-95"
                style={{
                  fontFamily: 'var(--font-inter)',
                  backgroundColor: `var(--_footer-bg, ${bg})`,
                  color: `var(--_footer-fg, ${color})`,
                  border: `2px solid color-mix(in srgb, var(--_footer-fg, ${color}) 25%, transparent)`,
                  ['--_footer-bg-dark' as string]: darkBg,
                  ['--_footer-fg-dark' as string]: darkColor,
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {label}
              </a>
              )
            })}
          </div>
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--theme-text-muted)',
              letterSpacing: '0.01em',
            }}
          >
            Open source - submit new card decks via GitHub Issues or PR
          </p>
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
            onClick={() => { if (!effectivelyJoining) setShowJoin(false) }}
          >
            <m.div
              ref={joinTrapRef}
              tabIndex={-1}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-lg p-8 shadow-hard"
              role="dialog"
              aria-modal="true"
              aria-label="Join game"
              style={{
                backgroundColor: 'var(--theme-bg)',
                border: '4px solid var(--theme-border)',
              }}
            >
              <button
                onClick={() => { if (!effectivelyJoining) setShowJoin(false) }}
                aria-label="Close join dialog"
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
                  color: 'var(--theme-text-muted)',
                }}
              >
                Live party or async table — same code either way
              </p>

              <label className="sr-only" htmlFor="join-room-code">Room code</label>
              <input
                id="join-room-code"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="ROOM CODE"
                maxLength={6}
                autoComplete="off"
                spellCheck={false}
                disabled={effectivelyJoining}
                className="mb-4 w-full rounded-lg px-4 py-3 text-center tracking-[4px] uppercase"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 24,
                  fontWeight: 900,
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  border: '3px solid var(--theme-border)',
                  opacity: effectivelyJoining ? 0.5 : 1,
                }}
              />

              <label className="sr-only" htmlFor="join-player-name">Your name</label>
              <input
                id="join-player-name"
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value.slice(0, 20))}
                placeholder="Your name"
                maxLength={20}
                autoComplete="off"
                spellCheck={false}
                disabled={effectivelyJoining}
                className="mb-6 w-full rounded-lg px-4 py-3 text-center"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 18,
                  fontWeight: 700,
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  border: '3px solid var(--theme-border)',
                  opacity: effectivelyJoining ? 0.5 : 1,
                }}
              />

              {(mpState.error || asyncError) && (
                <div
                  className="mb-4 rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: 'rgba(255,66,66,0.1)',
                    border: '2px solid #FF4242',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#C62828',
                  }}
                >
                  {mpState.error || asyncError}
                </div>
              )}

              <button
                onClick={() => {
                  if (joinCode.length !== 6 || !joinName.trim()) return
                  setJoining(true)
                  void joinGame(joinCode, {
                    name: joinName.trim(),
                    avatar: '🎮',
                    avatarBg: '#87CEEB',
                  })
                }}
                disabled={joinCode.length !== 6 || !joinName.trim() || effectivelyJoining}
                className="w-full cursor-pointer rounded-full px-6 py-4 text-center uppercase"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 18,
                  fontWeight: 900,
                  backgroundColor: joinCode.length === 6 && joinName.trim() && !effectivelyJoining ? '#66FF00' : 'var(--theme-surface-alt)',
                  color: joinCode.length === 6 && joinName.trim() && !effectivelyJoining ? '#111111' : 'var(--theme-text-muted)',
                  border: '3px solid var(--theme-border)',
                  boxShadow: '0px 6px 0px var(--theme-shadow)',
                  letterSpacing: '0.04em',
                }}
              >
                {effectivelyJoining ? '⏳ Connecting...' : '🔗 JOIN'}
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
