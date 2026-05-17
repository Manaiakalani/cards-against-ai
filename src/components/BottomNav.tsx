'use client'

import { type ReactNode } from 'react'

interface BottomNavProps {
  children: ReactNode
}

export function BottomNav({ children }: BottomNavProps) {
  return (
    <div
      className="fixed flex items-center gap-2 rounded-full p-2"
      style={{
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        border: '4px solid #111111',
        boxShadow: '8px 12px 0px rgba(0,0,0,0.15)',
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      {children}
    </div>
  )
}
