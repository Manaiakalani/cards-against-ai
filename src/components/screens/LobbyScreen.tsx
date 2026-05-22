'use client'

import { useState, useMemo } from 'react'
import { m } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { allDecks } from '@/data/cards'
import { BOT_POOL, pickRandomBots } from '@/hooks/useGameState'
import { PosterBackground } from '@/components/PosterBackground'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

const MAX_PLAYERS = 6

export default function LobbyScreen() {
  const { gameState, startGame, updateSettings, newGame, isMultiplayer, isHost, isClient, presencePlayers, mpState } = useGame()
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const botRoster = useMemo(() => pickRandomBots(MAX_PLAYERS - 1), [])

  // Remote human players from Presence (excluding self)
  const remoteHumans = isMultiplayer
    ? presencePlayers.filter((p) => p.id !== mpState.playerId)
    : []

  const totalPlayers = (playerName.trim() ? 1 : 0) + remoteHumans.length + botCount
  const slots = Array.from({ length: MAX_PLAYERS })

  const filledSlots: { name: string; emoji: string; bg: string; role: string; isHost: boolean; isOnline?: boolean }[] = []
  if (playerName.trim()) {
    filledSlots.push({ name: playerName, emoji: '🦄', bg: '#FFD700', role: isHost ? 'Host' : 'You', isHost: true, isOnline: true })
  }
  for (const remote of remoteHumans) {
    filledSlots.push({
      name: remote.name,
      emoji: remote.avatar,
      bg: remote.avatarBg,
      role: remote.isHost ? 'Host' : 'Player',
      isHost: remote.isHost,
      isOnline: true,
    })
  }
  for (let i = 0; i < botCount; i++) {
    const bot = botRoster[i]
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
        <m.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4 text-center"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(36px, 8vw, 64px)',
            lineHeight: 1,
            color: 'white',
            WebkitTextStroke: '2px var(--theme-shadow)',
            textShadow: '6px 6px 0px var(--theme-shadow)',
            textWrap: 'balance',
          }}
        >
          THE PREGAME
        </m.h1>

        {/* Room Code Card */}
        <m.div
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
              fontSize: 'clamp(24px, 6vw, 36px)',
              letterSpacing: '4px',
              color: 'var(--theme-text)',
            }}
          >
            {gameState.roomCode}
          </div>
        </m.div>

        {/* Player Count Sticker */}
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Sticker color="pink" rotation={-2}>
            {totalPlayers} / {MAX_PLAYERS} Players Joined
          </Sticker>
        </m.div>

        {/* Player Grid */}
        <div className="mt-8 grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {slots.map((_, i) => {
            const player = filledSlots[i]
            const rotation = i % 2 === 0 ? -1.5 : 1.5

            return (
              <m.div
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
                      className="relative flex items-center justify-center rounded-full"
                      style={{
                        width: '72px',
                        height: '72px',
                        backgroundColor: player.bg,
                        border: '3px solid var(--theme-border)',
                        fontSize: '32px',
                      }}
                    >
                      {player.emoji}
                      {player.isOnline && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: '#66FF00',
                            border: '2px solid var(--theme-border)',
                          }}
                        />
                      )}
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
              </m.div>
            )
          })}
        </div>

        {/* Name Input + Bot Selector */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex w-full max-w-md flex-col gap-4"
        >
          <label className="sr-only" htmlFor="player-name-input">Your name</label>
          <input
            id="player-name-input"
            type="text"
            placeholder="Enter your name…"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart()
            }}
            className="w-full px-5 py-3 text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#66FF00] placeholder:text-[var(--theme-text-muted)]"
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
            {Array.from({ length: MAX_PLAYERS - 1 - remoteHumans.length }, (_, i) => i).map((count) => (
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
                  color: botCount === count ? '#111' : 'var(--theme-text)',
                  boxShadow: botCount === count ? '3px 3px 0px var(--theme-shadow)' : 'none',
                }}
              >
                {count}
              </button>
            ))}
          </div>

          {/* Multiplayer status */}
          {isMultiplayer && (
            <div
              className="mt-2 flex items-center justify-center gap-2 rounded-full px-4 py-1.5"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: mpState.connected ? 'rgba(102,255,0,0.15)' : 'rgba(255,66,66,0.15)',
                color: mpState.connected ? '#166534' : '#9B2C2C',
                border: `2px solid ${mpState.connected ? '#166534' : '#9B2C2C'}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: mpState.connected ? '#66FF00' : '#FF4242',
                  display: 'inline-block',
                }}
              />
              {mpState.connected ? `Room: ${gameState.roomCode}` : 'Connecting...'}
            </div>
          )}
        </m.div>

        {/* Deck Selector */}
        <m.div
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
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '14px',
                fontWeight: 900,
                backgroundColor: '#66FF00',
                color: '#111',
                border: '2px solid var(--theme-border)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              🃏 {totalCardsInPlay} cards in play
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
                        color: 'var(--theme-text)',
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
                      fontSize: '12px',
                      color: 'var(--theme-text-muted)',
                    }}
                  >
                    {cardCount} cards
                  </span>
                </button>
              )
            })}
          </div>
        </m.div>

        {/* Timer Toggle */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 w-full max-w-md"
        >
          <div
            className="flex items-center justify-between rounded-xl px-5 py-4"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: '3px solid var(--theme-border)',
              boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '18px',
                color: 'var(--theme-text)',
              }}
            >
              ⏱️ Round Timer
            </span>
            <button
              onClick={() => handleTimerToggle(!timerEnabled)}
              className="cursor-pointer px-5 py-2 transition-transform hover:scale-105"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '15px',
                fontWeight: 900,
                border: '3px solid var(--theme-border)',
                borderRadius: '100px',
                backgroundColor: timerEnabled ? '#66FF00' : 'var(--theme-surface-alt)',
                color: 'var(--theme-text)',
                boxShadow: timerEnabled ? '3px 3px 0px var(--theme-shadow)' : 'none',
                minWidth: '72px',
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
                    color: 'var(--theme-text)',
                    boxShadow: timerSeconds === s ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  }}
                >
                  {s}s
                </button>
              ))}
            </div>
          )}
        </m.div>

        {/* House Rules */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 w-full max-w-md"
        >
          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '18px',
              color: 'var(--theme-text)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            🏠 HOUSE RULES
          </h2>
          <div className="flex flex-col gap-3">
            {/* Winner's Pick */}
            <div
              className="flex items-center justify-between rounded-xl px-5 py-4"
              style={{
                backgroundColor: 'var(--theme-surface)',
                border: '3px solid var(--theme-border)',
                boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '16px',
                    color: 'var(--theme-text)',
                  }}
                >
                  👑 Winner&apos;s Pick
                </span>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    color: 'var(--theme-text-secondary)',
                    lineHeight: 1.3,
                  }}
                >
                  Round winner becomes next czar
                </p>
              </div>
              <button
                onClick={() => handleWinnersPick(!winnersPick)}
                className="cursor-pointer px-5 py-2 transition-transform hover:scale-105"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '15px',
                  fontWeight: 900,
                  border: '3px solid var(--theme-border)',
                  borderRadius: '100px',
                  backgroundColor: winnersPick ? '#66FF00' : 'var(--theme-surface-alt)',
                  color: 'var(--theme-text)',
                  boxShadow: winnersPick ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  minWidth: '72px',
                }}
              >
                {winnersPick ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Reboot the Universe */}
            <div
              className="flex items-center justify-between rounded-xl px-5 py-4"
              style={{
                backgroundColor: 'var(--theme-surface)',
                border: '3px solid var(--theme-border)',
                boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '16px',
                    color: 'var(--theme-text)',
                  }}
                >
                  💥 Reboot the Universe
                </span>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    color: 'var(--theme-text-secondary)',
                    lineHeight: 1.3,
                  }}
                >
                  Spend 1 point to redraw entire hand
                </p>
              </div>
              <button
                onClick={() => handleReboot(!rebootEnabled)}
                className="cursor-pointer px-5 py-2 transition-transform hover:scale-105"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '15px',
                  fontWeight: 900,
                  border: '3px solid var(--theme-border)',
                  borderRadius: '100px',
                  backgroundColor: rebootEnabled ? '#66FF00' : 'var(--theme-surface-alt)',
                  color: 'var(--theme-text)',
                  boxShadow: rebootEnabled ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  minWidth: '72px',
                }}
              >
                {rebootEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </m.div>

        {/* Spacer for bottom nav */}
        <div className="h-36" />
      </div>

      <BottomNav>
        <NavButton
          variant="secondary"
          onClick={newGame}
        >
          ← BACK
        </NavButton>
        {isClient ? (
          <NavButton
            variant="primary"
            disabled
          >
            ⏳ WAITING FOR HOST...
          </NavButton>
        ) : (
          <NavButton
            variant="primary"
            onClick={handleStart}
            disabled={!playerName.trim() || (totalPlayers < 2)}
          >
            LET&apos;S GO 🔥
          </NavButton>
        )}
      </BottomNav>
    </div>
  )
}
