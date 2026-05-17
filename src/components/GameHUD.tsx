'use client'

import { Player } from '@/types/game'

interface GameHUDProps {
  round: number
  totalRounds?: number
  players: Player[]
  czarId: string
  roomCode: string
}

export function GameHUD({ round, totalRounds, players, czarId, roomCode }: GameHUDProps) {
  const leadScore = Math.max(...players.map((p) => p.score), 0)

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5"
      style={{
        height: 52,
        backgroundColor: 'rgba(244, 244, 238, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '3px solid #111111',
      }}
    >
      {/* Left: Room code */}
      <div
        className="flex items-center rounded px-3 py-1"
        style={{
          border: '2px solid #111111',
          backgroundColor: '#FFFFFF',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 14,
            letterSpacing: 2,
            color: '#111111',
          }}
        >
          {roomCode}
        </span>
      </div>

      {/* Center: Round indicator */}
      <span
        className="uppercase"
        style={{
          fontFamily: 'var(--font-archivo)',
          fontSize: 18,
          color: '#111111',
        }}
      >
        ROUND {round}
        {totalRounds ? ` of ${totalRounds}` : ''}
      </span>

      {/* Right: Player score pills */}
      <div className="flex items-center gap-2">
        {players.map((player) => {
          const isCzar = player.id === czarId
          const isLeader = player.score === leadScore && leadScore > 0

          return (
            <div
              key={player.id}
              className="flex items-center gap-1.5 rounded-full px-2 py-1"
              style={{
                backgroundColor: isLeader ? '#66FF00' : '#FFFFFF',
                border: '2px solid #111111',
              }}
            >
              <div
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: player.avatarBg,
                  border: '2px solid #111',
                  fontSize: 14,
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
                  color: '#111111',
                }}
              >
                {player.score}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
