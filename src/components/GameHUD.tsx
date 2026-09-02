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
      className="relative z-50 flex shrink-0 flex-col"
      style={{
        backgroundColor: 'var(--theme-backdrop)',
        backdropFilter: 'blur(8px)',
        borderBottom: '3px solid var(--theme-border)',
      }}
    >
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1"
        style={{
          minHeight: 44,
          paddingLeft: 'clamp(48px, 6vw, 56px)',
          paddingRight: 'clamp(148px, 24vw, 168px)',
          paddingTop: 6,
          paddingBottom: 6,
        }}
      >
        <div
          className="flex items-center rounded px-2 py-0.5"
          style={{
            border: '2px solid var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 12,
              letterSpacing: 2,
              color: 'var(--theme-text)',
            }}
          >
            {roomCode}
          </span>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className="uppercase whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 12,
              color: 'var(--theme-text)',
              textWrap: 'balance',
            }}
          >
            ROUND {round}
            {totalRounds ? `/${totalRounds}` : ''}
          </span>
          {timer && (
            <span
              className="rounded-full px-2 py-0.5"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 13,
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

        <div className="flex w-full min-w-0 flex-wrap items-center gap-1 sm:w-auto" tabIndex={0} role="region" aria-label="Player scores">
          {players.map((player) => {
            const isCzar = player.id === czarId
            const isLeader = player.score === leadScore && leadScore > 0

            return (
              <div
                key={player.id}
                className="flex flex-shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5"
                style={{
                  backgroundColor: isLeader ? '#66FF00' : 'var(--theme-surface)',
                  border: '2px solid var(--theme-border)',
                  color: isLeader ? '#111111' : 'var(--theme-text)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: player.avatarBg,
                    border: '2px solid var(--theme-border)',
                    fontSize: 12,
                    lineHeight: 1,
                  }}
                >
                  {player.avatar}
                </div>
                {isCzar && (
                  <span style={{ fontSize: 11, lineHeight: 1 }} aria-hidden="true">
                    👑
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 12,
                    fontWeight: 400,
                    color: isLeader ? '#111111' : 'var(--theme-text)',
                    fontVariantNumeric: 'tabular-nums',
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
