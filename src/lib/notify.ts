import { loadSupabase } from '@/lib/supabase'
import { registerServiceWorker } from '@/lib/pwa'
import { alertsMuted } from '@/lib/pushStore'

export function requestTurnNotifications() {
  if (alertsMuted()) return
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') {
    void Notification.requestPermission()
  }
  void registerServiceWorker()
}

export function notifyIfHidden(title: string, body: string) {
  if (typeof window === 'undefined') return
  if (alertsMuted()) return
  if (typeof Notification === 'undefined') return
  if (document.visibilityState === 'visible') return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, tag: 'cai-turn' })
  } catch {
    // Some WebViews throw if the document is not focused
  }
}

export async function requestTurnPush(roomCode: string, exceptPlayerId: string) {
  if (!roomCode) return
  try {
    const supabase = await loadSupabase()
    if (!supabase) return
    await supabase.functions.invoke('notify-turn', {
      body: { roomCode, exceptPlayerId },
    })
  } catch {
    /* Function may not be deployed yet; in-tab alerts still work. */
  }
}
