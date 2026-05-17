'use client'

import { useGame } from '@/contexts/GameContext'
import SplashScreen from '@/components/screens/SplashScreen'
import LobbyScreen from '@/components/screens/LobbyScreen'
import PlayingScreen from '@/components/screens/PlayingScreen'
import JudgingScreen from '@/components/screens/JudgingScreen'
import ResultsScreen from '@/components/screens/ResultsScreen'
import ScoreboardScreen from '@/components/screens/ScoreboardScreen'
import EndScreen from '@/components/screens/EndScreen'

export default function Home() {
  const { gameState } = useGame()

  switch (gameState.phase) {
    case 'menu':
      return <SplashScreen />
    case 'lobby':
      return <LobbyScreen />
    case 'playing':
      return <PlayingScreen key={`playing-${gameState.currentRound}`} />
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
