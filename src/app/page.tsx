'use client'

import dynamic from 'next/dynamic'
import { useGame } from '@/contexts/GameContext'
import SplashScreen from '@/components/screens/SplashScreen'

const LoadingFallback = () => <div className="min-h-screen bg-background" />

const LobbyScreen = dynamic(() => import('@/components/screens/LobbyScreen'), {
  ssr: false,
  loading: LoadingFallback,
})
const PlayingScreen = dynamic(() => import('@/components/screens/PlayingScreen'), {
  ssr: false,
  loading: LoadingFallback,
})
const RevealScreen = dynamic(() => import('@/components/screens/RevealScreen'), {
  ssr: false,
  loading: LoadingFallback,
})
const JudgingScreen = dynamic(() => import('@/components/screens/JudgingScreen'), {
  ssr: false,
  loading: LoadingFallback,
})
const ResultsScreen = dynamic(() => import('@/components/screens/ResultsScreen'), {
  ssr: false,
  loading: LoadingFallback,
})
const ScoreboardScreen = dynamic(() => import('@/components/screens/ScoreboardScreen'), {
  ssr: false,
  loading: LoadingFallback,
})
const EndScreen = dynamic(() => import('@/components/screens/EndScreen'), {
  ssr: false,
  loading: LoadingFallback,
})

export default function Home() {
  const { gameState } = useGame()

  switch (gameState.phase) {
    case 'menu':
      return <SplashScreen />
    case 'lobby':
      return <LobbyScreen />
    case 'playing':
      return <PlayingScreen key={`playing-${gameState.currentRound}`} />
    case 'revealing':
      return <RevealScreen key={`reveal-${gameState.currentRound}`} />
    case 'judging':
      return <JudgingScreen key={`judging-${gameState.currentRound}`} />
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
