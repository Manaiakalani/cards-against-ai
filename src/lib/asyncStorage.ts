import type { AsyncGameSummary, GameState } from '@/types/game'
import { isPlayersTurn } from '@/lib/gameEngine'

const MEMBER_KEY = 'cai-async-members'
const GAMES_KEY = 'cai-async-games'
const CHANGE_EVENT = 'cai-async-games-change'

export interface AsyncMembership {
  playerId: string
  name: string
  avatar: string
  avatarBg: string
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getMembership(roomCode: string): AsyncMembership | null {
  const all = readJson<Record<string, AsyncMembership>>(MEMBER_KEY, {})
  return all[roomCode.toUpperCase()] ?? null
}

export function saveMembership(roomCode: string, membership: AsyncMembership) {
  const all = readJson<Record<string, AsyncMembership>>(MEMBER_KEY, {})
  all[roomCode.toUpperCase()] = membership
  writeJson(MEMBER_KEY, all)
}

const EMPTY_GAMES: AsyncGameSummary[] = []
let cachedGames: AsyncGameSummary[] = EMPTY_GAMES
let cachedGamesJson = ''

export function listAsyncGames(): AsyncGameSummary[] {
  if (typeof window === 'undefined') return EMPTY_GAMES
  const json = localStorage.getItem(GAMES_KEY) ?? ''
  if (json === cachedGamesJson) return cachedGames
  cachedGamesJson = json
  try {
    const parsed = json ? (JSON.parse(json) as AsyncGameSummary[]) : []
    cachedGames = parsed.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
  } catch {
    cachedGames = EMPTY_GAMES
  }
  return cachedGames
}

export function getEmptyAsyncGames(): AsyncGameSummary[] {
  return EMPTY_GAMES
}

export function rememberAsyncGame(state: GameState, playerId: string) {
  const summaries = listAsyncGames().filter((g) => g.roomCode !== state.roomCode)
  if (state.phase === 'menu') {
    writeJson(GAMES_KEY, summaries)
    return
  }
  summaries.unshift({
    roomCode: state.roomCode,
    playerId,
    name: state.players.find((p) => p.id === playerId)?.name ?? 'You',
    phase: state.phase,
    myTurn: isPlayersTurn(state, playerId),
    updatedAt: new Date().toISOString(),
    playerCount: state.players.filter((p) => !p.isBot).length,
  })
  writeJson(GAMES_KEY, summaries.slice(0, 12))
}

export function forgetAsyncGame(roomCode: string) {
  writeJson(
    GAMES_KEY,
    listAsyncGames().filter((g) => g.roomCode !== roomCode.toUpperCase()),
  )
}

export function subscribeAsyncGames(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function inviteUrl(roomCode: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set('room', roomCode)
  return url.toString()
}
