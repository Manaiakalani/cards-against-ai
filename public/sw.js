/* Cards Against AI — installability + turn push */
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  /* Network-only. Presence of this listener makes Chromium treat the SW as a PWA. */
})

self.addEventListener('push', (event) => {
  let payload = {
    title: 'Your turn',
    body: 'Cards Against AI — play a card or judge.',
    url: './',
  }
  try {
    if (event.data) payload = { ...payload, ...event.data.json() }
  } catch {
    /* ignore malformed payloads */
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: 'cai-turn',
      icon: './icon-192.png',
      badge: './icon.png',
      data: { url: payload.url || './' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const dest = new URL(event.notification.data?.url || './', self.registration.scope).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => 'focus' in client)
      if (existing) return existing.focus()
      return self.clients.openWindow(dest)
    }),
  )
})
