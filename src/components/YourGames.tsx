'use client'

import { useGame } from '@/contexts/GameContext'
import { forgetAsyncGame } from '@/lib/asyncStorage'

const PHASE_LABEL: Record<string, string> = {
  lobby: 'Pregame',
  playing: 'Your hand',
  revealing: 'Reveal',
  judging: 'Judging',
  results: 'Winner',
  scoreboard: 'Standings',
  ended: 'Finished',
}

export function YourGames() {
  const { asyncGames, resumeAsyncGame } = useGame()
  const open = asyncGames.filter((g) => g.phase !== 'ended' && g.phase !== 'menu')
  if (open.length === 0) return null

  return (
    <div className="w-full max-w-md px-2">
      <p
        className="mb-2 text-center uppercase tracking-wider"
        style={{
          fontFamily: 'var(--font-archivo)',
          fontSize: 12,
          color: 'var(--theme-text-muted)',
        }}
      >
        Your async tables
      </p>
      <div className="flex flex-col gap-2">
        {open.map((game) => (
          <div
            key={game.roomCode}
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: '3px solid var(--theme-border)',
              boxShadow: '4px 4px 0 var(--theme-shadow-soft)',
            }}
          >
            <button
              type="button"
              onClick={() => resumeAsyncGame(game.roomCode)}
              className="min-w-0 flex-1 cursor-pointer text-left"
            >
              <span className="flex items-center gap-2">
                <span
                  className="tracking-[0.2em]"
                  style={{ fontFamily: 'var(--font-archivo)', fontSize: 16, color: 'var(--theme-text)' }}
                >
                  {game.roomCode}
                </span>
                {game.myTurn && (
                  <span
                    className="rounded-full px-2 py-0.5 uppercase"
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      backgroundColor: '#66FF00',
                      color: '#111111',
                      border: '2px solid var(--theme-border)',
                    }}
                  >
                    YOUR TURN
                  </span>
                )}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 12,
                  color: game.myTurn ? '#166534' : 'var(--theme-text-muted)',
                }}
              >
                {PHASE_LABEL[game.phase] ?? game.phase}
                {` · ${game.playerCount}p`}
              </span>
            </button>
            <button
              type="button"
              aria-label={`Dismiss ${game.roomCode}`}
              onClick={() => forgetAsyncGame(game.roomCode)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
              style={{
                fontFamily: 'var(--font-archivo)',
                backgroundColor: 'var(--theme-surface-alt)',
                border: '2px solid var(--theme-border)',
                color: 'var(--theme-text)',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
