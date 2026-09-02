import { z } from 'zod'
import { isSupabaseConfigured, loadSupabase } from '@/lib/supabase'
import { parseGameState } from '@/lib/wireProtocol'
import type { GameState } from '@/types/game'

const AsyncSnapshotSchema = z.object({
  version: z.number(),
  state: z.unknown(),
  updatedAt: z.string().optional(),
})

const SaveResultSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), version: z.number() }),
  z.object({
    ok: z.literal(false),
    version: z.number(),
    state: z.unknown(),
  }),
])

export interface AsyncSnapshot {
  version: number
  state: GameState
  updatedAt?: string
}

let lastCreateAt = 0
const CREATE_COOLDOWN_MS = 3000
const CREATE_WINDOW_MS = 15 * 60 * 1000
const CREATE_MAX_PER_WINDOW = 6
let createTimes: number[] = []

function assertCreateAllowed() {
  const now = Date.now()
  createTimes = createTimes.filter((t) => now - t < CREATE_WINDOW_MS)
  if (now - lastCreateAt < CREATE_COOLDOWN_MS) {
    throw new Error('Hang on — give that last table a second.')
  }
  if (createTimes.length >= CREATE_MAX_PER_WINDOW) {
    throw new Error('Slow down — too many tables in a short span.')
  }
  lastCreateAt = now
}

function recordCreate() {
  createTimes.push(Date.now())
}

export function isAsyncBackendReady(): boolean {
  return isSupabaseConfigured
}

export async function fetchAsyncGame(roomCode: string): Promise<AsyncSnapshot | null> {
  const supabase = await loadSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.rpc('get_async_game', {
    p_code: roomCode.toUpperCase(),
  })
  if (error || data == null) return null
  const parsed = AsyncSnapshotSchema.safeParse(data)
  if (!parsed.success) return null
  const state = parseGameState(parsed.data.state)
  if (!state) return null
  return {
    version: parsed.data.version,
    state,
    updatedAt: parsed.data.updatedAt,
  }
}

export async function createAsyncGame(roomCode: string, state: GameState): Promise<AsyncSnapshot> {
  const supabase = await loadSupabase()
  if (!supabase) throw new Error('Supabase is not configured')
  assertCreateAllowed()
  const { data, error } = await supabase.rpc('create_async_game', {
    p_code: roomCode.toUpperCase(),
    p_state: state,
  })
  if (error) {
    throw new Error(
      error.message.includes('function') || error.code === 'PGRST202'
        ? 'Async tables are not enabled on this project yet.'
        : error.message,
    )
  }
  recordCreate()
  const parsed = AsyncSnapshotSchema.safeParse(data)
  if (parsed.success) {
    const stateParsed = parseGameState(parsed.data.state)
    if (stateParsed) return { version: parsed.data.version, state: stateParsed }
  }
  return { version: 1, state }
}

export async function saveAsyncGame(
  roomCode: string,
  expectedVersion: number,
  state: GameState,
): Promise<{ ok: true; version: number } | { ok: false; version: number; state: GameState }> {
  const supabase = await loadSupabase()
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.rpc('save_async_game', {
    p_code: roomCode.toUpperCase(),
    p_expected_version: expectedVersion,
    p_state: state,
  })
  if (error) throw new Error(error.message)
  const parsed = SaveResultSchema.safeParse(data)
  if (!parsed.success) throw new Error('Unexpected save response')
  if (parsed.data.ok) return { ok: true, version: parsed.data.version }
  const conflict = parseGameState(parsed.data.state)
  if (!conflict) throw new Error('Corrupt async game')
  return { ok: false, version: parsed.data.version, state: conflict }
}

/** Lightweight check used by the join dialog — does not throw on missing setup. */
export async function peekAsyncGame(roomCode: string): Promise<boolean> {
  try {
    const snap = await fetchAsyncGame(roomCode)
    return Boolean(snap)
  } catch {
    return false
  }
}
