'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  seconds: number
  enabled: boolean
  onExpire: () => void
}

export function useTimer({ seconds, enabled, onExpire }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [isRunning, setIsRunning] = useState(false)
  const expireRef = useRef(onExpire)

  // Sync ref to avoid stale closure
  useEffect(() => { expireRef.current = onExpire }, [onExpire])

  const start = useCallback(() => {
    if (!enabled) return
    setTimeLeft(seconds)
    setIsRunning(true)
  }, [enabled, seconds])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(seconds)
    setIsRunning(false)
  }, [seconds])

  useEffect(() => {
    if (!isRunning || !enabled) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsRunning(false)
          expireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, enabled])

  const progress = seconds > 0 ? timeLeft / seconds : 0
  const isUrgent = timeLeft <= 10 && timeLeft > 0 && isRunning
  const isWarning = timeLeft <= 20 && timeLeft > 10 && isRunning

  return { timeLeft, progress, isRunning, isUrgent, isWarning, start, stop, reset }
}
