'use client'

import { waitingOn } from '@/lib/gameEngine'
import type { GameState } from '@/types/game'

export function WaitingRoster({ gameState }: { gameState: GameState }) {
  const pending = waitingOn(gameState)
  const done = gameState.players.filter(
    (p) => !p.isCardCzar && !pending.some((w) => w.id === p.id),
  )

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {gameState.players
          .filter((p) => !p.isCardCzar)
          .map((p) => {
            const hasSubmitted = gameState.submissions.some((s) => s.playerId === p.id)
            return (
              <div
                key={p.id}
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                title={`${p.name}${hasSubmitted ? ' — locked in' : ' — still thinking'}`}
                style={{
                  backgroundColor: p.avatarBg,
                  border: '2px solid var(--theme-border)',
                  opacity: hasSubmitted ? 1 : 0.4,
                }}
              >
                {p.avatar}
              </div>
            )
          })}
      </div>
      {gameState.playMode === 'async' && (
        <p
          className="max-w-sm text-center"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'var(--theme-text-secondary)',
            lineHeight: 1.4,
          }}
        >
          {pending.length === 0
            ? 'Everyone is in. Flipping cards…'
            : `${pending.length} still to play${done.length ? ` · ${done.length} locked in` : ''}. Close the tab — this table waits.`}
        </p>
      )}
    </div>
  )
}
