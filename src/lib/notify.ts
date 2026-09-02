export function requestTurnNotifications() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') {
    void Notification.requestPermission()
  }
}

export function notifyIfHidden(title: string, body: string) {
  if (typeof window === 'undefined') return
  if (typeof Notification === 'undefined') return
  if (document.visibilityState === 'visible') return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, tag: 'cai-turn' })
  } catch {
    // Some WebViews throw if the document is not focused
  }
}
