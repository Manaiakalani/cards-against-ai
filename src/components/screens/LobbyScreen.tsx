'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { allDecks } from '@/data/cards'
import { PosterBackground } from '@/components/PosterBackground'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

const MAX_PLAYERS = 6
const BOT_PREVIEWS = [
  { name: 'no_thoughts_ceo', emoji: '🧠', bg: '#7FFFD4' },
  { name: 'delulu_vc', emoji: '💅', bg: '#F08080' },
  { name: 'touch_grass_404', emoji: '🌿', bg: '#FFD700' },
  { name: 'main_character', emoji: '✨', bg: '#DDA0DD' },
  { name: 'slay_intern', emoji: '💀', bg: '#87CEEB' },
]

export default function LobbyScreen() {
  const { gameState, startGame, updateSettings } = useGame()
  const [playerName, setPlayerName] = useState('')
  const [botCount, setBotCount] = useState(3)
  const [selectedDecks, setSelectedDecks] = useState<string[]>(
    gameState.settings.selectedDecks
  )
  const [timerEnabled, setTimerEnabled] = useState(
    gameState.settings.timerEnabled ?? false
  )
  const [timerSeconds, setTimerSeconds] = useState(
    gameState.settings.timerSeconds ?? 60
  )
  const [winnersPick, setWinnersPick] = useState(
    gameState.settings.winnersPick ?? false
  )
  const [rebootEnabled, setRebootEnabled] = useState(
    gameState.settings.rebootEnabled ?? false
  )

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

  function toggleDeck(deckId: string) {
    const next = selectedDecks.includes(deckId)
      ? selectedDecks.filter((d) => d !== deckId)
      : [...selectedDecks, deckId]
    if (next.length === 0) return
    setSelectedDecks(next)
    updateSettings({ selectedDecks: next })
  }

  function handleTimerToggle(enabled: boolean) {
    setTimerEnabled(enabled)
    updateSettings({ timerEnabled: enabled, timerSeconds })
  }

  function handleTimerSeconds(seconds: number) {
    setTimerSeconds(seconds)
    updateSettings({ timerEnabled, timerSeconds: seconds })
  }

  function handleWinnersPick(enabled: boolean) {
    setWinnersPick(enabled)
    updateSettings({ winnersPick: enabled })
  }

  function handleReboot(enabled: boolean) {
    setRebootEnabled(enabled)
    updateSettings({ rebootEnabled: enabled })
  }

  const totalCardsInPlay = allDecks
    .filter((d) => selectedDecks.includes(d.id))
    .reduce((sum, d) => sum + d.cards.blackCards.length + d.cards.whiteCards.length, 0)

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <PosterBackground words={['touch', 'grass', 'never']} />

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
          THE PREGAME
        </motion.h1>

        {/* Room Code Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          className="mb-4 inline-block text-center"
          style={{
            background: 'var(--theme-surface)',
            border: '4px solid var(--theme-border)',
            padding: '12px 32px',
            boxShadow: '8px 8px 0px var(--theme-shadow-soft)',
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
              color: 'var(--theme-text)',
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
                  borderStyle: player ? 'solid' : 'dashed',
                  borderColor: player ? 'var(--theme-border)' : 'var(--theme-border-light)',
                  borderWidth: player?.isHost ? '4px' : '3px',
                  backgroundColor: player ? 'var(--theme-surface)' : 'transparent',
                  boxShadow: player
                    ? player.isHost
                      ? '8px 8px 0px #FFB6C1'
                      : '5px 5px 0px var(--theme-shadow)'
                    : 'none',
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
                        border: '3px solid var(--theme-border)',
                        fontSize: '32px',
                      }}
                    >
                      {player.emoji}
                    </div>
                    <span
                      className="max-w-full truncate px-2"
                      style={{
                        fontFamily: 'var(--font-archivo)',
                        fontSize: '20px',
                        color: 'var(--theme-text)',
                      }}
                    >
                      {player.name}
                    </span>
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-inter)', color: 'var(--theme-text-muted)' }}
                    >
                      {player.role}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--theme-text-muted)' }}
                  >
                    Waiting for Talent…
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
            placeholder="Enter your name…"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart()
            }}
            className="w-full px-5 py-3 text-lg outline-none focus-visible:ring-4 focus-visible:ring-[#66FF00] placeholder:text-gray-400"
            spellCheck={false}
            autoComplete="off"
            style={{
              fontFamily: 'var(--font-archivo)',
              border: '3px solid var(--theme-border)',
              borderRadius: '12px',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
            }}
          />

          {/* Bot Count Selector */}
          <div className="flex items-center justify-center gap-3">
            <span
              className="text-sm uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--theme-text)' }}
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
                  border: '3px solid var(--theme-border)',
                  borderRadius: '10px',
                  backgroundColor: botCount === count ? '#66FF00' : 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  boxShadow: botCount === count ? '3px 3px 0px var(--theme-shadow)' : 'none',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deck Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 w-full max-w-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '20px',
                color: 'var(--theme-text)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              DECKS
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                color: '#66FF00',
                fontWeight: 600,
              }}
            >
              {totalCardsInPlay} cards in play
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {allDecks.map((deck) => {
              const isSelected = selectedDecks.includes(deck.id)
              const cardCount = deck.cards.blackCards.length + deck.cards.whiteCards.length
              return (
                <button
                  key={deck.id}
                  onClick={() => toggleDeck(deck.id)}
                  className="relative flex flex-col items-center gap-1 px-3 py-4 transition-transform hover:scale-[1.03] cursor-pointer"
                  style={{
                    border: isSelected
                      ? '3px solid #66FF00'
                      : '3px dashed var(--theme-border-light)',
                    borderRadius: '14px',
                    backgroundColor: 'var(--theme-surface)',
                    opacity: isSelected ? 1 : 0.55,
                    boxShadow: isSelected ? '4px 4px 0px var(--theme-shadow)' : 'none',
                  }}
                >
                  {isSelected && (
                    <span
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs"
                      style={{
                        backgroundColor: '#66FF00',
                        border: '2px solid var(--theme-border)',
                        fontWeight: 700,
                        color: '#111',
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  )}
                  <span style={{ fontSize: '28px' }}>{deck.icon}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: '13px',
                      color: 'var(--theme-text)',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {deck.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '11px',
                      color: 'var(--theme-text-muted)',
                    }}
                  >
                    {cardCount} cards
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Timer Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '16px',
                color: 'var(--theme-text)',
              }}
            >
              ⏱️ Round Timer
            </span>
            <button
              onClick={() => handleTimerToggle(!timerEnabled)}
              className="cursor-pointer px-4 py-1 transition-transform hover:scale-105"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '14px',
                border: '3px solid var(--theme-border)',
                borderRadius: '10px',
                backgroundColor: timerEnabled ? '#66FF00' : 'var(--theme-surface)',
                color: timerEnabled ? '#111' : 'var(--theme-text)',
                boxShadow: timerEnabled ? '3px 3px 0px var(--theme-shadow)' : 'none',
              }}
            >
              {timerEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {timerEnabled && (
            <div className="mt-3 flex items-center justify-center gap-3">
              {[30, 60, 90].map((s) => (
                <button
                  key={s}
                  onClick={() => handleTimerSeconds(s)}
                  className="flex h-10 items-center justify-center px-4 transition-transform hover:scale-110 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '16px',
                    border: '3px solid var(--theme-border)',
                    borderRadius: '10px',
                    backgroundColor: timerSeconds === s ? '#66FF00' : 'var(--theme-surface)',
                    color: timerSeconds === s ? '#111' : 'var(--theme-text)',
                    boxShadow: timerSeconds === s ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  }}
                >
                  {s}s
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* House Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 w-full max-w-md"
        >
          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '16px',
              color: 'var(--theme-text)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            🏠 HOUSE RULES
          </h2>
          <div className="flex flex-col gap-3">
            {/* Winner's Pick */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '14px',
                    color: 'var(--theme-text)',
                  }}
                >
                  👑 Winner&apos;s Pick
                </span>
                <p
                  className="mt-0.5"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    color: 'var(--theme-text-muted)',
                  }}
                >
                  Round winner becomes next czar
                </p>
              </div>
              <button
                onClick={() => handleWinnersPick(!winnersPick)}
                className="cursor-pointer px-4 py-1 transition-transform hover:scale-105"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '14px',
                  border: '3px solid var(--theme-border)',
                  borderRadius: '10px',
                  backgroundColor: winnersPick ? '#66FF00' : 'var(--theme-surface)',
                  color: winnersPick ? '#111' : 'var(--theme-text)',
                  boxShadow: winnersPick ? '3px 3px 0px var(--theme-shadow)' : 'none',
                }}
              >
                {winnersPick ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Reboot the Universe */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '14px',
                    color: 'var(--theme-text)',
                  }}
                >
                  💥 Reboot the Universe
                </span>
                <p
                  className="mt-0.5"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    color: 'var(--theme-text-muted)',
                  }}
                >
                  Spend 1 point to redraw entire hand
                </p>
              </div>
              <button
                onClick={() => handleReboot(!rebootEnabled)}
                className="cursor-pointer px-4 py-1 transition-transform hover:scale-105"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '14px',
                  border: '3px solid var(--theme-border)',
                  borderRadius: '10px',
                  backgroundColor: rebootEnabled ? '#66FF00' : 'var(--theme-surface)',
                  color: rebootEnabled ? '#111' : 'var(--theme-text)',
                  boxShadow: rebootEnabled ? '3px 3px 0px var(--theme-shadow)' : 'none',
                }}
              >
                {rebootEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
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
          LET&apos;S GO 🔥
        </NavButton>
      </BottomNav>
    </div>
  )
}
