'use client'

import { type ReactNode } from 'react'
import { m } from 'framer-motion'

interface NavButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark'
  disabled?: boolean
}

const variantStyles = {
  primary: { backgroundColor: '#66FF00', color: '#111111', shadow: 'var(--theme-shadow)' },
  secondary: { backgroundColor: '#FFB6C1', color: '#111111', shadow: 'var(--theme-shadow)' },
  dark: { backgroundColor: '#111111', color: '#FFFFFF', shadow: 'var(--theme-shadow)' },
} as const

export function NavButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: NavButtonProps) {
  const { shadow, ...bg } = variantStyles[variant]

  return (
    <m.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { y: 4, boxShadow: `0px 2px 0px ${shadow}` }}
      whileHover={disabled ? undefined : { y: 1, boxShadow: `0px 5px 0px ${shadow}` }}
      className={`
        rounded-full uppercase cursor-pointer px-5 py-3 sm:px-8 sm:py-4
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      `}
      style={{
        fontFamily: 'var(--font-archivo)',
        fontSize: 'clamp(14px, 2vw, 18px)',
        fontWeight: 400,
        letterSpacing: '0.02em',
        border: '3px solid var(--theme-border)',
        boxShadow: `0px 6px 0px ${shadow}`,
        transition: 'filter 0.1s',
        ...bg,
      }}
    >
      {children}
    </m.button>
  )
}
