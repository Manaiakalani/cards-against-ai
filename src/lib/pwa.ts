import { VAPID_PUBLIC_KEY } from '@/lib/vapidPublic'
import { alertsMuted, deletePushSubscription } from '@/lib/pushStore'
import type { PushSub } from '@/types/game'

let registerPromise: Promise<ServiceWorkerRegistration | null> | null = null

export function appBasePath(): string {
  if (typeof window === 'undefined') return ''
  if (window.location.pathname.startsWith('/cards-against-ai')) return '/cards-against-ai'
  return ''
}

export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null)
  }
  if (!registerPromise) {
    const base = appBasePath()
    registerPromise = navigator.serviceWorker
      .register(`${base}/sw.js`, { scope: `${base}/` || '/' })
      .catch(() => null)
  }
  return registerPromise
}

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(normalized)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

export async function subscribeToPush(): Promise<PushSub | null> {
  if (typeof window === 'undefined') return null
  if (alertsMuted()) return null
  if (!('Notification' in window) || !('PushManager' in window)) return null
  const registration = await registerServiceWorker()
  if (!registration) return null
  if (Notification.permission === 'denied') return null
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null
  }
  try {
    const existing = await registration.pushManager.getSubscription()
    const sub =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      }))
    const json = sub.toJSON()
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return null
    return { endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth }
  } catch {
    return null
  }
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches
}

export async function unsubscribeFromPush() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const registration = await registerServiceWorker()
    const sub = await registration?.pushManager.getSubscription()
    const endpoint = sub?.endpoint
    await sub?.unsubscribe()
    if (endpoint) await deletePushSubscription(endpoint)
  } catch {
    /* already gone */
  }
}

export function listenForNotificationOpen() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return () => {}
  const onMessage = (event: MessageEvent) => {
    const url = event.data?.type === 'cai-open' ? event.data.url : null
    if (typeof url === 'string' && url) window.location.assign(url)
  }
  navigator.serviceWorker.addEventListener('message', onMessage)
  return () => navigator.serviceWorker.removeEventListener('message', onMessage)
}

export function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document)
  const webkit = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
  return ios && webkit
}
