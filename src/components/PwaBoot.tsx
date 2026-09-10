'use client'

import { useEffect, useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { isIosSafari, isStandaloneDisplay, registerServiceWorker } from '@/lib/pwa'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaBoot() {
  const { gameState } = useGame()
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [iosHint, setIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    void registerServiceWorker()
    const onPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    setIosHint(isIosSafari() && !isStandaloneDisplay())
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const onLobby = gameState.phase === 'lobby'
  const onHome = gameState.phase === 'menu'
  if (dismissed || isStandaloneDisplay()) return null
  const showAndroid = Boolean(installEvent) && (onHome || onLobby)
  const showIos = iosHint && onLobby
  if (!showAndroid && !showIos) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-[90] flex justify-center px-3 sm:bottom-4">
      <div
        className="pointer-events-auto inline-flex max-w-md items-center gap-2 rounded-full px-3 py-2 uppercase"
        style={{
          fontFamily: 'var(--font-archivo)',
          fontSize: 12,
          letterSpacing: '0.03em',
          backgroundColor: '#111111',
          color: '#66FF00',
          border: '3px solid var(--theme-border)',
          boxShadow: '3px 3px 0 var(--theme-shadow-soft)',
          minHeight: 40,
        }}
      >
        {showAndroid ? (
          <button
            type="button"
            className="cursor-pointer uppercase"
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit' }}
            onClick={async () => {
              await installEvent?.prompt()
              setInstallEvent(null)
            }}
          >
            Install app · turn alerts
          </button>
        ) : (
          <span>Share → Add to Home Screen for turn alerts</span>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          className="cursor-pointer"
          style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit' }}
          onClick={() => setDismissed(true)}
        >
          ×
        </button>
      </div>
    </div>
  )
}
