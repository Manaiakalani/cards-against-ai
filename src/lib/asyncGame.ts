import { z } from 'zod'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
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

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.phase === 'string' &&
    typeof v.roomCode === 'string' &&
    Array.isArray(v.players) &&
    Array.isArray(v.blackCardPool) &&
    Array.isArray(v.whiteCardPool)
  )
}

export function isAsyncBackendReady(): boolean {
  return isSupabaseConfigured
}

export async function fetchAsyncGame(roomCode: string): Promise<AsyncSnapshot | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('get_async_game', {
    p_code: roomCode.toUpperCase(),
  })
  if (error || data == null) return null
  const parsed = AsyncSnapshotSchema.safeParse(data)
  if (!parsed.success || !isGameState(parsed.data.state)) return null
  return {
    version: parsed.data.version,
    state: parsed.data.state,
    updatedAt: parsed.data.updatedAt,
  }
}

export async function createAsyncGame(roomCode: string, state: GameState): Promise<AsyncSnapshot> {
  if (!supabase) throw new Error('Supabase is not configured')
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
  const parsed = AsyncSnapshotSchema.safeParse(data)
  if (parsed.success && isGameState(parsed.data.state)) {
    return { version: parsed.data.version, state: parsed.data.state }
  }
  return { version: 1, state }
}

export async function saveAsyncGame(
  roomCode: string,
  expectedVersion: number,
  state: GameState,
): Promise<{ ok: true; version: number } | { ok: false; version: number; state: GameState }> {
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
  if (!isGameState(parsed.data.state)) throw new Error('Corrupt async game')
  return { ok: false, version: parsed.data.version, state: parsed.data.state }
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
