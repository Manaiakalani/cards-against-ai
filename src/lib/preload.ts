import { isSupabaseConfigured, preloadSupabase } from '@/lib/supabase'

export function scheduleIdle(work: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const ric = window.requestIdleCallback
  if (typeof ric === 'function') {
    const id = ric(() => work(), { timeout: 2500 })
    return () => window.cancelIdleCallback(id)
  }
  const t = window.setTimeout(work, 1)
  return () => window.clearTimeout(t)
}

/** Warm the next-screen chunks after the splash can paint. */
export function preloadPlayChunks() {
  void import('@/components/screens/LobbyScreen')
  void import('@/data/cards')
  if (isSupabaseConfigured) preloadSupabase()
}
