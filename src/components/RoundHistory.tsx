'use client'

import { memo, useCallback, useMemo, useSyncExternalStore } from 'react'
import { m } from 'framer-motion'
import type { RoundResult, Player } from '@/types/game'
import { ModalCloseButton, ModalFrame } from '@/components/ModalFrame'

// ─── Favorites localStorage via useSyncExternalStore ─────────────────

const FAV_KEY = 'cai-favorites'
const FAV_CHANGE_EVENT = 'favorites-change'

interface FavEntry {
  key: string
  result: RoundResult
  winnerName: string
  winnerAvatar: string
  winnerAvatarBg: string
}

let cachedFavs: FavEntry[] = []
let cachedFavsJson = ''

function getFavsClient(): FavEntry[] {
  const json = localStorage.getItem(FAV_KEY) ?? ''
  if (json === cachedFavsJson) return cachedFavs
  cachedFavsJson = json
  cachedFavs = json ? JSON.parse(json) : []
  return cachedFavs
}

const SERVER_FAVS: FavEntry[] = []

function getFavsServer(): FavEntry[] {
  return SERVER_FAVS
}

function subscribeFavs(callback: () => void): () => void {
  window.addEventListener(FAV_CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(FAV_CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

function writeFavs(favs: FavEntry[]): void {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs))
  window.dispatchEvent(new Event(FAV_CHANGE_EVENT))
}

function comboKey(result: RoundResult): string {
  return `${result.blackCard.id}:${result.winningCards.map((c) => c.id).join(',')}`
}

function useFavorites() {
  const favs = useSyncExternalStore(subscribeFavs, getFavsClient, getFavsServer)

  const toggle = useCallback(
    (result: RoundResult, players: Player[]) => {
      const key = comboKey(result)
      const current = getFavsClient()
      if (current.some((f) => f.key === key)) {
        writeFavs(current.filter((f) => f.key !== key))
      } else {
        const winner = players.find((p) => p.id === result.winnerId)
        writeFavs([
          ...current,
          {
            key,
            result,
            winnerName: winner?.name ?? 'Unknown',
            winnerAvatar: winner?.avatar ?? '?',
            winnerAvatarBg: winner?.avatarBg ?? '#DDA0DD',
          },
        ])
      }
    },
    []
  )

  const isFav = useCallback(
    (result: RoundResult) => {
      return favs.some((f) => f.key === comboKey(result))
    },
    [favs]
  )

  return { favs, toggle, isFav }
}

export { useFavorites, type FavEntry }

// ─── Round entry (shared between game + favorites views) ─────────────

const RoundEntry = memo(function RoundEntry({
  result,
  winnerName,
  winnerAvatar,
  winnerAvatarBg,
  isFav,
  onToggle,
  index,
}: {
  result: RoundResult
  winnerName: string
  winnerAvatar: string
  winnerAvatarBg: string
  isFav: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <m.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="relative flex flex-col gap-2 p-4"
      style={{
        backgroundColor: 'var(--theme-surface)',
        border: '3px solid var(--theme-border)',
        borderRadius: 16,
        boxShadow: '4px 4px 0px var(--theme-shadow-soft)',
      }}
    >
      {/* Top row: round number + winner + star */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'var(--theme-text)',
              fontFamily: 'var(--font-archivo)',
              fontSize: 14,
              color: 'var(--theme-bg)',
            }}
          >
            {result.round}
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
              style={{
                backgroundColor: winnerAvatarBg,
                border: '2px solid var(--theme-border)',
              }}
            >
              {winnerAvatar}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 14,
                color: 'var(--theme-text)',
              }}
            >
              {winnerName}
            </span>
          </div>
        </div>

        {/* Star toggle */}
        <m.button
          onClick={onToggle}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          className="cursor-pointer"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            lineHeight: 1,
            filter: isFav ? 'none' : 'grayscale(1) opacity(0.4)',
            transition: 'filter 0.15s ease',
          }}
        >
          ⭐
        </m.button>
      </div>

      {/* Black card text */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--theme-text)',
          lineHeight: 1.4,
        }}
      >
        {result.blackCard.text.replace(/_+/g, '____')}
      </p>

      {/* Winning white card(s) */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          color: '#1A7A00',
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        → {result.winningCards.map((c) => c.text).join(' + ')}
      </p>
    </m.div>
  )
})

interface RoundHistoryProps {
  open: boolean
  onClose: () => void
  roundHistory?: RoundResult[]
  players?: Player[]
  favoritesOnly?: boolean
}

export function RoundHistory({
  open,
  onClose,
  roundHistory = [],
  players = [],
  favoritesOnly = false,
}: RoundHistoryProps) {
  const { favs, toggle, isFav } = useFavorites()

  const title = favoritesOnly ? 'FAVORITES' : 'ROUND HISTORY'
  const emptyMessage = favoritesOnly
    ? 'No favorites yet - star your best combos!'
    : 'No rounds played yet. Start a game!'

  // Build display entries (memoized to avoid recomputing on unrelated re-renders)
  const entries = useMemo(() => {
    if (favoritesOnly) {
      return favs.map((f) => ({
        result: f.result,
        winnerName: f.winnerName,
        winnerAvatar: f.winnerAvatar,
        winnerAvatarBg: f.winnerAvatarBg,
      }))
    }
    return roundHistory.map((r) => {
      const winner = players.find((p) => p.id === r.winnerId)
      return {
        result: r,
        winnerName: winner?.name ?? 'Unknown',
        winnerAvatar: winner?.avatar ?? '?',
        winnerAvatarBg: winner?.avatarBg ?? '#DDA0DD',
      }
    })
  }, [favoritesOnly, favs, roundHistory, players])

  return (
    <ModalFrame open={open} onClose={onClose} labelledBy="round-history-title">
            <div className="cai-dialog-header">
              <h2
                id="round-history-title"
                style={{
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 28,
                  fontWeight: 900,
                  color: 'var(--theme-text)',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h2>
              <ModalCloseButton onClick={onClose} label="Close history" />
            </div>

            <div className="cai-dialog-body px-6 py-5">
              {entries.length === 0 ? (
                <div
                  className="flex min-h-[10rem] flex-col items-center justify-center px-2 py-10"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  <span className="mb-3 text-4xl">
                    {favoritesOnly ? '⭐' : '📜'}
                  </span>
                  <p
                    className="text-center"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 15,
                      lineHeight: 1.5,
                    }}
                  >
                    {emptyMessage}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {entries.map((entry, i) => (
                    <RoundEntry
                      key={`${entry.result.round}-${i}`}
                      result={entry.result}
                      winnerName={entry.winnerName}
                      winnerAvatar={entry.winnerAvatar}
                      winnerAvatarBg={entry.winnerAvatarBg}
                      isFav={isFav(entry.result)}
                      onToggle={() => toggle(entry.result, players)}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 px-6 py-3 text-center"
              style={{ borderTop: '3px solid var(--theme-border)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: 'var(--theme-text-muted)',
                }}
              >
                {favoritesOnly
                  ? `${entries.length} favorite${entries.length !== 1 ? 's' : ''}`
                  : `${entries.length} round${entries.length !== 1 ? 's' : ''} played`}
              </p>
            </div>
    </ModalFrame>
  )
}
