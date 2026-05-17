'use client'

import { useGame } from '@/contexts/GameContext'
import LobbyScreen from '@/components/screens/LobbyScreen'
import PlayingScreen from '@/components/screens/PlayingScreen'
import JudgingScreen from '@/components/screens/JudgingScreen'
import ResultsScreen from '@/components/screens/ResultsScreen'
import EndScreen from '@/components/screens/EndScreen'

export default function Home() {
  const { gameState } = useGame()

  switch (gameState.phase) {
    case 'lobby':
      return <LobbyScreen />
    case 'playing':
      return <PlayingScreen />
    case 'judging':
      return <JudgingScreen />
    case 'results':
      return <ResultsScreen />
    case 'ended':
      return <EndScreen />
    default:
      return <LobbyScreen />
  }
}
