'use client'

import { createContext, useContext, useEffect, ReactNode, useCallback, useMemo, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function subscribe(callback: () => void) {
  const onChange = () => {
    themeCache = null
    callback()
  }
  window.addEventListener('storage', onChange)
  window.addEventListener('theme-change', onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener('theme-change', onChange)
  }
}

let themeCache: Theme | null = null

function readTheme(): Theme {
  const stored = localStorage.getItem('cai-theme')
  if (stored === 'dark' || stored === 'light') return stored
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function getSnapshot(): Theme {
  if (!themeCache) themeCache = readTheme()
  return themeCache
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
    themeCache = next
    localStorage.setItem('cai-theme', next)
    window.dispatchEvent(new Event('theme-change'))
  }, [theme])

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', toggleTheme }),
    [theme, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
