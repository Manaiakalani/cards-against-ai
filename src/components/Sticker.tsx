'use client'

import { type ReactNode } from 'react'

interface StickerProps {
  children: ReactNode
  color?: 'green' | 'pink' | 'red' | 'black'
  rotation?: number
  className?: string
}

const colorMap = {
  green: { bg: '#66FF00', text: '#111111' },
  pink: { bg: '#FFB6C1', text: '#111111' },
  red: { bg: '#FF4242', text: '#FFFFFF' },
  black: { bg: '#111111', text: '#FFFFFF' },
} as const

export function Sticker({
  children,
  color = 'green',
  rotation = 0,
  className = '',
}: StickerProps) {
  const { bg, text } = colorMap[color]

  return (
    <span
      className={`inline-block px-4 py-1.5 uppercase tracking-wide ${className}`}
      style={{
        fontFamily: 'var(--font-archivo)',
        fontSize: '14px',
        fontWeight: 400,
        color: text,
        backgroundColor: bg,
        border: '2px solid var(--theme-border)',
        boxShadow: '4px 4px 0px var(--theme-shadow)',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        borderRadius: '6px',
      }}
    >
      {children}
    </span>
  )
}
