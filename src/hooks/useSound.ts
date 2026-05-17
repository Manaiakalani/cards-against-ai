'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'

// Mute state stored in localStorage, synced like ThemeContext
function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('cai-muted') === 'true'
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(cb: () => void): () => void {
  const handler = () => cb()
  window.addEventListener('sound-mute-change', handler)
  return () => window.removeEventListener('sound-mute-change', handler)
}

type SoundName = 'select' | 'submit' | 'reveal' | 'tick' | 'winner' | 'gameEnd'

const SOUNDS: Record<SoundName, { freq: number; duration: number; type: OscillatorType; ramp?: number; freq2?: number }> = {
  select: { freq: 800, duration: 0.06, type: 'square' },
  submit: { freq: 400, duration: 0.15, type: 'sine', ramp: 0.01, freq2: 800 },
  reveal: { freq: 300, duration: 0.12, type: 'triangle', ramp: 0.02, freq2: 600 },
  tick: { freq: 1000, duration: 0.04, type: 'square' },
  winner: { freq: 523, duration: 0.4, type: 'sine', ramp: 0.05, freq2: 784 },
  gameEnd: { freq: 392, duration: 0.6, type: 'sine', ramp: 0.1, freq2: 784 },
}

export function useSound() {
  const isMuted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ctxRef = useRef<AudioContext | null>(null)

  const play = useCallback((name: SoundName) => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('cai-muted') === 'true') return

    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext()
      }
      const ctx = ctxRef.current
      const config = SOUNDS[name]
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = config.type
      osc.frequency.setValueAtTime(config.freq, ctx.currentTime)
      if (config.freq2 && config.ramp) {
        osc.frequency.linearRampToValueAtTime(config.freq2, ctx.currentTime + config.ramp)
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + config.duration)
    } catch {
      // AudioContext may fail in some environments
    }
  }, [])

  const toggleMute = useCallback(() => {
    const next = localStorage.getItem('cai-muted') !== 'true'
    localStorage.setItem('cai-muted', String(next))
    window.dispatchEvent(new Event('sound-mute-change'))
  }, [])

  return { isMuted, play, toggleMute }
}
