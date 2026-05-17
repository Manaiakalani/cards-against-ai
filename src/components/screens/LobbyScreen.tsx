'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { PosterBackground } from '@/components/PosterBackground'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

const MAX_PLAYERS = 6
const BOT_PREVIEWS = [
  { name: 'VC_DARREN', emoji: '📉', bg: '#7FFFD4' },
  { name: 'GPT_Slayer', emoji: '🤖', bg: '#F08080' },
  { name: 'CryptoBro88', emoji: '₿', bg: '#FFD700' },
  { name: 'AgileCoach', emoji: '☕', bg: '#DDA0DD' },
  { name: 'Intern_Ex', emoji: '🫠', bg: '#87CEEB' },
]

export default function LobbyScreen() {
  const { gameState, startGame } = useGame()
  const [playerName, setPlayerName] = useState('')
  const [botCount, setBotCount] = useState(3)

  const totalPlayers = 1 + botCount
  const slots = Array.from({ length: MAX_PLAYERS })

  const filledSlots: { name: string; emoji: string; bg: string; role: string; isHost: boolean }[] = []
  if (playerName.trim()) {
    filledSlots.push({ name: playerName, emoji: '🦄', bg: '#FFD700', role: 'Host', isHost: true })
  }
  for (let i = 0; i < botCount; i++) {
    const bot = BOT_PREVIEWS[i]
    filledSlots.push({ name: bot.name, emoji: bot.emoji, bg: bot.bg, role: 'Bot', isHost: false })
  }

  function handleStart() {
    if (!playerName.trim()) return
    startGame(playerName.trim(), botCount)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F4F4EE' }}>
      <PosterBackground words={['lobby', 'waiting', 'series a']} />

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        {/* Title */}
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4 text-center"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(36px, 8vw, 64px)',
            lineHeight: 1,
            color: 'white',
            WebkitTextStroke: '2px #111',
            textShadow: '6px 6px 0px #111',
          }}
        >
          THE BOARDROOM
        </motion.h1>

        {/* Room Code Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          className="mb-4 inline-block text-center"
          style={{
            background: 'white',
            border: '4px solid #111',
            padding: '12px 32px',
            boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
            transform: 'rotate(-2deg)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '12px',
              textTransform: 'uppercase',
              opacity: 0.5,
              marginBottom: '2px',
            }}
          >
            Room Code
          </div>
          <div
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '36px',
              letterSpacing: '4px',
              color: '#111',
            }}
          >
            {gameState.roomCode}
          </div>
        </motion.div>

        {/* Player Count Sticker */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Sticker color="pink" rotation={-2}>
            {totalPlayers} / {MAX_PLAYERS} Players Joined
          </Sticker>
        </motion.div>

        {/* Player Grid */}
        <div className="mt-8 grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {slots.map((_, i) => {
            const player = filledSlots[i]
            const rotation = i % 2 === 0 ? -1.5 : 1.5

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="relative flex flex-col items-center justify-center gap-3"
                style={{
                  minHeight: '180px',
                  borderRadius: '18px',
                  border: player ? '3px solid #111' : '3px dashed #ccc',
                  backgroundColor: player ? 'white' : 'transparent',
                  boxShadow: player
                    ? player.isHost
                      ? '8px 8px 0px #FFB6C1'
                      : '5px 5px 0px #111'
                    : 'none',
                  borderWidth: player?.isHost ? '4px' : '3px',
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {player ? (
                  <>
                    {/* Host badge */}
                    {player.isHost && (
                      <div className="absolute -right-3 -top-3">
                        <Sticker color="green" rotation={12}>
                          HOST
                        </Sticker>
                      </div>
                    )}
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: '72px',
                        height: '72px',
                        backgroundColor: player.bg,
                        border: '3px solid #111',
                        fontSize: '32px',
                      }}
                    >
                      {player.emoji}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-archivo)',
                        fontSize: '20px',
                        color: '#111',
                      }}
                    >
                      {player.name}
                    </span>
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-inter)', color: '#999' }}
                    >
                      {player.role}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-inter)', color: '#ccc' }}
                  >
                    Waiting for Talent...
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Name Input + Bot Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex w-full max-w-md flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Enter your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart()
            }}
            className="w-full px-5 py-3 text-lg outline-none placeholder:text-gray-400"
            style={{
              fontFamily: 'var(--font-archivo)',
              border: '3px solid #111',
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#111',
            }}
          />

          {/* Bot Count Selector */}
          <div className="flex items-center justify-center gap-3">
            <span
              className="text-sm uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-archivo)', color: '#111' }}
            >
              Bots:
            </span>
            {[2, 3, 4, 5].map((count) => (
              <button
                key={count}
                onClick={() => setBotCount(count)}
                className="flex h-10 w-10 items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '18px',
                  border: '3px solid #111',
                  borderRadius: '10px',
                  backgroundColor: botCount === count ? '#66FF00' : 'white',
                  color: '#111',
                  boxShadow: botCount === count ? '3px 3px 0px #111' : 'none',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Spacer for bottom nav */}
        <div className="h-36" />
      </div>

      <BottomNav>
        <NavButton
          variant="primary"
          onClick={handleStart}
          disabled={!playerName.trim()}
        >
          START GAME
        </NavButton>
      </BottomNav>
    </div>
  )
}
