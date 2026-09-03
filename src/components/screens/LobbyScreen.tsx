'use client'

import { useState, useMemo, useEffect } from 'react'
import { m } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { deckMeta } from '@/data/deckMeta'
import { pickRandomBots } from '@/hooks/useGameState'
import { ScreenShell } from '@/components/ScreenShell'
import { BottomNav } from '@/components/BottomNav'
import { NavButton } from '@/components/NavButton'
import { Sticker } from '@/components/Sticker'

const MAX_PLAYERS = 6

export default function LobbyScreen() {
  const { gameState, startGame, updateSettings, newGame, isMultiplayer, isHost, isClient, isAsync, presencePlayers, mpState, renamePlayer, myPlayerId, copyInvite } = useGame()
  const [playerName, setPlayerName] = useState(
    () => gameState.players.find((p) => p.id === myPlayerId)?.name ?? '',
  )
  const [botCount, setBotCount] = useState(() => (isAsync ? 0 : 3))
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
  const [copied, setCopied] = useState(false)

  const botRoster = useMemo(() => pickRandomBots(MAX_PLAYERS - 1), [])

  // Warm the deck-content chunk in the background as soon as the lobby
  // mounts, so `startGame`'s dynamic import of `@/data/cards` (~350 cards
  // of text, not needed until now) is normally already cached by the time
  // the player actually clicks Start.
  useEffect(() => {
    import('@/data/cards')
  }, [])

  useEffect(() => {
    if (!playerName.trim()) return
    const t = window.setTimeout(() => renamePlayer(myPlayerId, playerName), 400)
    return () => window.clearTimeout(t)
  }, [playerName, myPlayerId, renamePlayer])

  // Remote human players: live uses Presence; async uses persisted game state
  const remoteHumans = isAsync
    ? gameState.players
        .filter((p) => !p.isBot && p.id !== myPlayerId)
        .map((p) => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          avatarBg: p.avatarBg,
          isHost: p.isHost,
        }))
    : isMultiplayer
      ? presencePlayers.filter((p) => p.id !== mpState.playerId)
      : []

  const totalPlayers = (playerName.trim() ? 1 : 0) + remoteHumans.length + botCount
  const canStart = Boolean(playerName.trim()) && totalPlayers >= 2
  const startHint = !playerName.trim()
    ? 'Type your name to start.'
    : totalPlayers < 2
      ? isAsync
        ? 'Need one more player. Wait for a friend, or add a bot.'
        : 'Add a bot or another player to start.'
      : null
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

  const totalCardsInPlay = deckMeta
    .filter((d) => selectedDecks.includes(d.id))
    .reduce((sum, d) => sum + d.blackCount + d.whiteCount, 0)

  return (
    <ScreenShell
      words={['touch', 'grass', 'never']}
      bodyClassName="overlay-pad flex flex-col items-center px-3 pb-3 sm:px-4 sm:pb-4"
      footer={
        <BottomNav>
          <NavButton variant="secondary" onClick={newGame}>
            ← BACK
          </NavButton>
          {isClient ? (
            <NavButton variant="primary" disabled>
              ⏳ WAITING FOR HOST…
            </NavButton>
          ) : (
            <NavButton
              variant="primary"
              onClick={handleStart}
              disabled={!canStart}
            >
              LET&apos;S GO 🔥
            </NavButton>
          )}
        </BottomNav>
      }
    >
        {/* Title + room */}
        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-2 text-center"
          style={{
            fontFamily: 'var(--font-archivo)',
            fontSize: 'clamp(28px, min(8vw, 7vh), 64px)',
            lineHeight: 1.08,
            paddingTop: '0.06em',
            color: 'white',
            WebkitTextStroke: '2px var(--theme-shadow)',
            textShadow: '6px 6px 0px var(--theme-shadow)',
            textWrap: 'balance',
          }}
        >
          THE PREGAME
        </m.h1>

        {/* Room Code Card */}
        <m.button
          type="button"
          onClick={async () => {
            const shared = await copyInvite()
            if (!shared) {
              try {
                await navigator.clipboard.writeText(gameState.roomCode)
              } catch {
                return
              }
            }
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          className="mb-2 inline-block cursor-pointer text-center"
          style={{
            background: 'var(--theme-surface)',
            border: '4px solid var(--theme-border)',
            padding: '8px 20px',
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
            {copied ? 'Copied invite' : 'Room Code · tap to copy'}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 'clamp(20px, min(6vw, 4vh), 36px)',
              letterSpacing: '4px',
              color: 'var(--theme-text)',
            }}
          >
            {gameState.roomCode}
          </div>
        </m.button>

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
        {isAsync && (
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-2"
          >
            <Sticker color="green" rotation={3}>
              Async · play on your own time
            </Sticker>
          </m.div>
        )}
        {isClient ? (
          <p
            className="mt-2 max-w-sm text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: 'var(--theme-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            The host starts the round. You can close this tab and come back.
          </p>
        ) : startHint ? (
          <p
            className="mt-2 max-w-sm text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: 'var(--theme-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            {startHint}
          </p>
        ) : null}

        {/* Name Input + Bot Selector — first so you can start without hunting */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 flex w-full max-w-md flex-col gap-2"
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
            className="w-full px-5 py-2.5 text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#66FF00] placeholder:text-[var(--theme-placeholder)]"
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
                aria-pressed={botCount === count}
                className="flex h-11 w-11 items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '18px',
                  border: '3px solid var(--theme-border)',
                  borderRadius: '10px',
                  backgroundColor: botCount === count ? '#66FF00' : 'var(--theme-surface)',
                  color: botCount === count ? '#111111' : 'var(--theme-text)',
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
              {mpState.connected ? `Room: ${gameState.roomCode}` : 'Connecting…'}
            </div>
          )}
        </m.div>

        {/* Player chips */}
        <div className="mt-2 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2">
          {slots.map((_, i) => {
            const player = filledSlots[i]
            return (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="flex items-center gap-2 rounded-full px-2 py-1.5"
                style={{
                  minWidth: 0,
                  borderStyle: player ? 'solid' : 'dashed',
                  borderColor: player ? 'var(--theme-border)' : 'var(--theme-border-light)',
                  borderWidth: 2,
                  backgroundColor: player ? 'var(--theme-surface)' : 'transparent',
                  boxShadow: player?.isHost ? '3px 3px 0px #FFB6C1' : undefined,
                }}
              >
                {player ? (
                  <>
                    <div
                      className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: player.bg,
                        border: '2px solid var(--theme-border)',
                        fontSize: 18,
                      }}
                    >
                      {player.emoji}
                    </div>
                    <span
                      className="max-w-[7rem] truncate pr-1"
                      style={{
                        fontFamily: 'var(--font-archivo)',
                        fontSize: 13,
                        color: 'var(--theme-text)',
                      }}
                    >
                      {player.name}
                    </span>
                  </>
                ) : (
                  <span
                    className="px-2 text-xs"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--theme-text-muted)' }}
                  >
                    Waiting for Talent…
                  </span>
                )}
              </m.div>
            )
          })}
        </div>

        {/* Deck Selector */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 w-full max-w-2xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '16px',
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
                color: '#111111',
                border: '2px solid var(--theme-border)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              🃏 {totalCardsInPlay} cards in play
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {deckMeta.map((deck) => {
              const isSelected = selectedDecks.includes(deck.id)
              const cardCount = deck.blackCount + deck.whiteCount
              return (
                <button
                  key={deck.id}
                  onClick={() => toggleDeck(deck.id)}
                  aria-pressed={isSelected}
                  className="relative flex min-h-11 items-center gap-2 px-2 py-1.5 transition-transform hover:scale-[1.03] cursor-pointer"
                  style={{
                    border: isSelected
                      ? '3px solid #66FF00'
                      : '3px dashed var(--theme-border-light)',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-surface)',
                    opacity: isSelected ? 1 : 0.55,
                    boxShadow: isSelected ? '3px 3px 0px var(--theme-shadow)' : 'none',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{deck.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate"
                      style={{
                        fontFamily: 'var(--font-archivo)',
                        fontSize: '12px',
                        color: 'var(--theme-text)',
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
                  </span>
                </button>
              )
            })}
          </div>
        </m.div>

        {/* Timer Toggle — hidden for async; a round clock makes no sense when people play hours apart */}
        {!isAsync && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-3 w-full max-w-md"
        >
          <div
            className="flex items-center justify-between rounded-xl px-4 py-2.5"
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
              aria-pressed={timerEnabled}
              className="cursor-pointer px-5 py-2 transition-transform hover:scale-105"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: '15px',
                fontWeight: 900,
                border: '3px solid var(--theme-border)',
                borderRadius: '100px',
                backgroundColor: timerEnabled ? '#66FF00' : 'var(--theme-surface-alt)',
                color: timerEnabled ? '#111111' : 'var(--theme-text)',
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
                  aria-pressed={timerSeconds === s}
                  className="flex h-10 items-center justify-center px-4 transition-transform hover:scale-110 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: '16px',
                    border: '3px solid var(--theme-border)',
                    borderRadius: '10px',
                    backgroundColor: timerSeconds === s ? '#66FF00' : 'var(--theme-surface)',
                    color: timerSeconds === s ? '#111111' : 'var(--theme-text)',
                    boxShadow: timerSeconds === s ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  }}
                >
                  {s}s
                </button>
              ))}
            </div>
          )}
        </m.div>
        )}

        {/* House Rules */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="hide-short mt-2 w-full max-w-md pb-2"
        >
          <h2
            className="mb-2"
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
          <div className="flex flex-col gap-2">
            {/* Winner's Pick */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-2.5"
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
                  className="hide-short mt-1"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    color: 'var(--theme-text-secondary)',
                    lineHeight: 1.3,
                  }}
                >
                  Round winner becomes next czar
                </p>
              </div>
              <button
                onClick={() => handleWinnersPick(!winnersPick)}
                aria-pressed={winnersPick}
                className="cursor-pointer px-5 py-2 transition-transform hover:scale-105"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '15px',
                  fontWeight: 900,
                  border: '3px solid var(--theme-border)',
                  borderRadius: '100px',
                  backgroundColor: winnersPick ? '#66FF00' : 'var(--theme-surface-alt)',
                  color: winnersPick ? '#111111' : 'var(--theme-text)',
                  boxShadow: winnersPick ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  minWidth: '72px',
                }}
              >
                {winnersPick ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Reboot the Universe */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-2.5"
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
                  className="hide-short mt-1"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    color: 'var(--theme-text-secondary)',
                    lineHeight: 1.3,
                  }}
                >
                  Spend 1 point to redraw entire hand
                </p>
              </div>
              <button
                onClick={() => handleReboot(!rebootEnabled)}
                aria-pressed={rebootEnabled}
                className="cursor-pointer px-5 py-2 transition-transform hover:scale-105"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: '15px',
                  fontWeight: 900,
                  border: '3px solid var(--theme-border)',
                  borderRadius: '100px',
                  backgroundColor: rebootEnabled ? '#66FF00' : 'var(--theme-surface-alt)',
                  color: rebootEnabled ? '#111111' : 'var(--theme-text)',
                  boxShadow: rebootEnabled ? '3px 3px 0px var(--theme-shadow)' : 'none',
                  minWidth: '72px',
                }}
              >
                {rebootEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </m.div>
    </ScreenShell>
  )
}
