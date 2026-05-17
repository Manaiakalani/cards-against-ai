'use client'

import { Player } from '@/types/game'

interface TimerInfo {
  timeLeft: number
  progress: number
  isUrgent: boolean
}

interface GameHUDProps {
  round: number
  totalRounds?: number
  players: Player[]
  czarId: string
  roomCode: string
  timer?: TimerInfo
}

export function GameHUD({ round, totalRounds, players, czarId, roomCode, timer }: GameHUDProps) {
  const leadScore = Math.max(...players.map((p) => p.score), 0)

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex flex-col"
      style={{
        backgroundColor: 'var(--theme-backdrop)',
        backdropFilter: 'blur(8px)',
        borderBottom: '3px solid var(--theme-border)',
      }}
    >
      <div
        className="flex items-center justify-between px-5"
        style={{ height: 52 }}
      >
        {/* Left: Room code */}
        <div
          className="flex items-center rounded px-3 py-1"
          style={{
            border: '2px solid var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 14,
              letterSpacing: 2,
              color: 'var(--theme-text)',
            }}
          >
            {roomCode}
          </span>
        </div>

        {/* Center: Round indicator + timer */}
        <div className="flex items-center gap-3">
          <span
            className="uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 18,
              color: 'var(--theme-text)',
            }}
          >
            ROUND {round}
            {totalRounds ? ` of ${totalRounds}` : ''}
          </span>
          {timer && (
            <span
              className="rounded-full px-2.5 py-0.5"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 16,
                fontVariantNumeric: 'tabular-nums',
                color: timer.isUrgent ? 'white' : 'var(--theme-text)',
                backgroundColor: timer.isUrgent ? '#FF4242' : 'var(--theme-surface)',
                border: '2px solid var(--theme-border)',
                animation: timer.isUrgent ? 'pulse 0.5s infinite alternate' : undefined,
              }}
            >
              {timer.timeLeft}s
            </span>
          )}
        </div>

        {/* Right: Player score pills — scrollable on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto sm:gap-2">
          {players.map((player) => {
            const isCzar = player.id === czarId
            const isLeader = player.score === leadScore && leadScore > 0

            return (
              <div
                key={player.id}
                className="flex flex-shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 sm:gap-1.5 sm:px-2 sm:py-1"
                style={{
                  backgroundColor: isLeader ? '#66FF00' : 'var(--theme-surface)',
                  border: '2px solid var(--theme-border)',
                }}
              >
                <div
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: player.avatarBg,
                    border: '2px solid var(--theme-border)',
                    fontSize: 12,
                  }}
                >
                  {player.avatar}
                  {isCzar && (
                    <span
                      className="absolute"
                      style={{ top: -8, right: -4, fontSize: 12 }}
                    >
                      👑
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 14,
                    fontWeight: 400,
                    color: 'var(--theme-text)',
                  }}
                >
                  {player.score}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timer progress bar */}
      {timer && (
        <div style={{ height: 3, backgroundColor: 'var(--theme-border-light)' }}>
          <div
            style={{
              height: '100%',
              width: `${timer.progress * 100}%`,
              backgroundColor: timer.isUrgent ? '#FF4242' : '#66FF00',
              transition: 'width 1s linear, background-color 0.3s',
            }}
          />
        </div>
      )}
    </div>
  )
}
