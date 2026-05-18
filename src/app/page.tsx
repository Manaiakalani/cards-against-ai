'use client'

import dynamic from 'next/dynamic'
import { AnimatePresence, m } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import SplashScreen from '@/components/screens/SplashScreen'

function SkeletonFallback() {
  return (
    <div
      className="flex h-dvh flex-col items-center justify-center gap-4"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      {/* Pulsing card silhouettes */}
      <div className="flex gap-4">
        <div
          className="animate-pulse rounded-xl"
          style={{
            width: 100,
            height: 140,
            backgroundColor: 'var(--theme-surface-alt)',
            border: '3px solid var(--theme-border)',
            transform: 'rotate(-4deg)',
          }}
        />
        <div
          className="animate-pulse rounded-xl"
          style={{
            width: 100,
            height: 140,
            backgroundColor: 'var(--theme-surface)',
            border: '3px solid var(--theme-border)',
            transform: 'rotate(3deg)',
            animationDelay: '150ms',
          }}
        />
      </div>
      <div
        className="animate-pulse rounded-lg"
        style={{
          width: 160,
          height: 20,
          backgroundColor: 'var(--theme-surface-alt)',
        }}
      />
    </div>
  )
}

const LobbyScreen = dynamic(() => import('@/components/screens/LobbyScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})
const PlayingScreen = dynamic(() => import('@/components/screens/PlayingScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})
const RevealScreen = dynamic(() => import('@/components/screens/RevealScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})
const JudgingScreen = dynamic(() => import('@/components/screens/JudgingScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})
const ResultsScreen = dynamic(() => import('@/components/screens/ResultsScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})
const ScoreboardScreen = dynamic(() => import('@/components/screens/ScoreboardScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})
const EndScreen = dynamic(() => import('@/components/screens/EndScreen'), {
  ssr: false,
  loading: SkeletonFallback,
})

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
}

function PhaseScreen({ phase, round }: { phase: string; round: number }) {
  switch (phase) {
    case 'menu':
      return <SplashScreen />
    case 'lobby':
      return <LobbyScreen />
    case 'playing':
      return <PlayingScreen key={`playing-${round}`} />
    case 'revealing':
      return <RevealScreen key={`reveal-${round}`} />
    case 'judging':
      return <JudgingScreen key={`judging-${round}`} />
    case 'results':
      return <ResultsScreen />
    case 'scoreboard':
      return <ScoreboardScreen />
    case 'ended':
      return <EndScreen />
    default:
      return <SplashScreen />
  }
}

export default function Home() {
  const { gameState } = useGame()

  return (
    <AnimatePresence mode="wait">
      <m.div key={gameState.phase} {...pageTransition} className="contents">
        <PhaseScreen phase={gameState.phase} round={gameState.currentRound} />
      </m.div>
    </AnimatePresence>
  )
}
