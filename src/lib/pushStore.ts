import { loadSupabase } from '@/lib/supabase'
import type { PushSub } from '@/types/game'

const MUTE_KEY = 'cai-alerts-muted'

export function alertsMuted(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setAlertsMuted(muted: boolean) {
  if (typeof window === 'undefined') return
  try {
    if (muted) window.localStorage.setItem(MUTE_KEY, '1')
    else window.localStorage.removeItem(MUTE_KEY)
    window.dispatchEvent(new Event('cai-alerts-change'))
  } catch {
    /* private mode */
  }
}

export function subscribeAlertsChange(callback: () => void) {
  window.addEventListener('cai-alerts-change', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('cai-alerts-change', callback)
    window.removeEventListener('storage', callback)
  }
}

export async function savePushSubscription(roomCode: string, playerId: string, sub: PushSub) {
  const supabase = await loadSupabase()
  if (!supabase) return false
  const { error } = await supabase.from('push_subscriptions').upsert({
    endpoint: sub.endpoint,
    room_code: roomCode.toUpperCase(),
    player_id: playerId,
    p256dh: sub.p256dh,
    auth: sub.auth,
    updated_at: new Date().toISOString(),
  })
  return !error
}

export async function deletePushSubscription(endpoint: string) {
  const supabase = await loadSupabase()
  if (!supabase || !endpoint) return
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
}
