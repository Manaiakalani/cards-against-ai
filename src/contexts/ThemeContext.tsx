'use client'

import { createContext, useContext, useEffect, ReactNode, useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('theme-change', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('theme-change', callback)
  }
}

function getSnapshot(): Theme {
  const stored = localStorage.getItem('cai-theme')
  if (stored === 'dark' || stored === 'light') return stored
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('cai-theme', next)
    window.dispatchEvent(new Event('theme-change'))
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
