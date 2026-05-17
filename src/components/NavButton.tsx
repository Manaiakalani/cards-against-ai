'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface NavButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark'
  disabled?: boolean
}

const variantStyles = {
  primary: { backgroundColor: '#66FF00', color: '#111111' },
  secondary: { backgroundColor: '#FFB6C1', color: '#111111' },
  dark: { backgroundColor: '#111111', color: '#FFFFFF' },
} as const

export function NavButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: NavButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      className={`
        rounded-full uppercase cursor-pointer px-8 py-4
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      `}
      style={{
        fontFamily: 'var(--font-archivo)',
        fontSize: '18px',
        fontWeight: 400,
        letterSpacing: '0.02em',
        border: 'none',
        ...variantStyles[variant],
      }}
    >
      {children}
    </motion.button>
  )
}
