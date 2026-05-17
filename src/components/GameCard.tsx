'use client'

import { motion } from 'framer-motion'
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
}

const sizeMap = {
  sm: { w: 220, h: 320, fontSize: 22, footerSize: 11, px: 20, pt: 24, iconSize: 10 },
  md: { w: 280, h: 400, fontSize: 25, footerSize: 12, px: 24, pt: 28, iconSize: 12 },
  lg: { w: 320, h: 460, fontSize: 28, footerSize: 13, px: 28, pt: 32, iconSize: 14 },
} as const

function renderCardText(text: string, isBlack: boolean) {
  const parts = text.split(/(_____+)/)
  return parts.map((part, i) => {
    if (/^_+$/.test(part)) {
      return (
        <span
          key={i}
          className="inline-block mx-1"
          style={{
            borderBottom: `3px solid ${isBlack ? '#FFFFFF' : '#111111'}`,
            minWidth: '80px',
          }}
        >
          &nbsp;
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function GameCard({
  card,
  variant,
  isSelected = false,
  onClick,
  showFooter = true,
  size = 'md',
  rotation = 0,
  className = '',
}: GameCardProps) {
  const effectiveVariant = variant ?? card.type
  const isBlack = effectiveVariant === 'black'
  const dims = sizeMap[size]

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05, y: -10 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative flex flex-col justify-between
        ${onClick ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-[6px] ring-[#66FF00]' : ''}
        ${className}
      `}
      style={{
        width: dims.w,
        height: dims.h,
        padding: `${dims.pt}px ${dims.px}px ${dims.px}px`,
        borderRadius: 18,
        backgroundColor: isBlack ? '#111111' : '#FFFFFF',
        color: isBlack ? '#FFFFFF' : '#111111',
        border: isSelected
          ? '3px solid #66FF00'
          : isBlack
            ? '3px solid #333333'
            : '3px solid #111111',
        boxShadow: isSelected
          ? '0 0 30px rgba(102, 255, 0, 0.3), 15px 25px 45px rgba(0,0,0,0.25)'
          : '15px 25px 45px rgba(0,0,0,0.25)',
        transform: `rotate(${rotation}deg)${isSelected ? ' translateY(-8px)' : ''}`,
        userSelect: 'none',
      }}
    >
      {/* Card text */}
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: dims.fontSize,
          fontWeight: 700,
          lineHeight: 1.3,
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
          <span>Cards Against Silicon Valley</span>
        </div>
      )}
    </motion.div>
  )
}
