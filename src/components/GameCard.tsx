'use client'

import React from 'react'
import { m } from 'framer-motion'
import { CardIcon } from './CardIcon'

interface CardData {
  id: string
  text: string
  type: 'black' | 'white'
}

interface GameCardProps {
  card: CardData
  variant?: 'black' | 'white'
  isSelected?: boolean
  isHovered?: boolean
  onClick?: () => void
  showFooter?: boolean
  size?: 'sm' | 'md' | 'lg'
  rotation?: number
  className?: string
  /** Fill the parent cell instead of a fixed max width (hand grid). */
  fill?: boolean
}

const sizeMap = {
  sm: { w: 180, h: 260, fontSize: 18, footerSize: 10, px: 16, pt: 20, iconSize: 9 },
  md: { w: 240, h: 340, fontSize: 21, footerSize: 11, px: 20, pt: 24, iconSize: 11 },
  lg: { w: 280, h: 400, fontSize: 24, footerSize: 12, px: 24, pt: 28, iconSize: 12 },
} as const

const BLANK_PATTERN = /(_____+)/
const BLANK_TEST = /^_+$/

function renderCardText(text: string, isBlack: boolean) {
  const parts = text.split(BLANK_PATTERN)
  return parts.map((part, i) => {
    if (BLANK_TEST.test(part)) {
      return (
        <span
          key={i}
          className="inline-block mx-1"
          style={{
            borderBottom: `3px solid ${isBlack ? '#FFFFFF' : '#111111'}`,
            minWidth: 'min(80px, 40%)',
          }}
        >
          &nbsp;
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export const GameCard = React.memo(function GameCard({
  card,
  variant,
  isSelected = false,
  onClick,
  showFooter = true,
  size = 'md',
  rotation = 0,
  className = '',
  fill = false,
}: GameCardProps) {
  const effectiveVariant = variant ?? card.type
  const isBlack = effectiveVariant === 'black'
  const dims = sizeMap[size]

  return (
    <m.div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
      whileHover={onClick ? { scale: 1.03, y: fill ? -2 : -6 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        cai-card relative flex flex-col justify-between
        ${onClick ? 'cursor-pointer focus-visible:ring-4 focus-visible:ring-[#66FF00] focus-visible:outline-none' : ''}
        ${isSelected ? 'cai-card-selected ring-[6px] ring-[#66FF00]' : ''}
        ${className}
      `}
      style={{
        width: '100%',
        height: fill ? '100%' : undefined,
        maxWidth: fill ? 'none' : dims.w,
        maxHeight: fill ? '100%' : undefined,
        minWidth: 0,
        minHeight: 0,
        aspectRatio: fill ? undefined : `${dims.w} / ${dims.h}`,
        padding: fill
          ? 'clamp(6px, 1.2vh, 16px) clamp(6px, 1.2vh, 16px) clamp(6px, 1vh, 12px)'
          : `${dims.pt}px ${dims.px}px ${dims.px}px`,
        borderRadius: 18,
        backgroundColor: isBlack ? '#111111' : '#FFFFFF',
        color: isBlack ? '#FFFFFF' : '#111111',
        border: isSelected
          ? '3px solid #66FF00'
          : isBlack
            ? '3px solid var(--theme-border-light)'
            : '3px solid var(--theme-border)',
        transform: `rotate(${rotation}deg)${isSelected ? ' translateY(-8px)' : ''}`,
        userSelect: 'none',
        touchAction: onClick ? 'manipulation' : undefined,
      }}
    >
      {/* Card text */}
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: fill ? 'clamp(10px, 1.7vh, 16px)' : dims.fontSize,
          fontWeight: 700,
          lineHeight: 1.3,
          overflowWrap: 'break-word',
        }}
      >
        {renderCardText(card.text, isBlack)}
      </div>

      {/* Footer */}
      {showFooter && (
        <div
          className="flex items-center gap-2 mt-auto"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: dims.footerSize,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          <CardIcon
            color={isBlack ? '#FFFFFF' : '#111111'}
            size={dims.iconSize}
          />
          <span>Cards Against AI</span>
        </div>
      )}
    </m.div>
  )
})
