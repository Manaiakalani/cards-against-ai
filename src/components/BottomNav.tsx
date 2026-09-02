'use client'

import { type ReactNode } from 'react'

interface BottomNavProps {
  children: ReactNode
}

export function BottomNav({ children }: BottomNavProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 rounded-full p-1.5 sm:p-2"
      style={{
        backgroundColor: 'var(--theme-surface)',
        border: '4px solid var(--theme-border)',
        boxShadow: '8px 12px 0px var(--theme-shadow-soft)',
        maxWidth: 'calc(100vw - 1.5rem)',
      }}
    >
      {children}
    </div>
  )
}
