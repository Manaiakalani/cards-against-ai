'use client'

import { type ReactNode } from 'react'
import { PosterBackground } from '@/components/PosterBackground'

interface ScreenShellProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  words?: string[]
  posterOpacity?: number
  /** Extra class on the outer shell */
  className?: string
  /** Extra class on the scrollable body */
  bodyClassName?: string
}

/**
 * One-viewport shell: the page itself does not scroll.
 * Long content scrolls inside the body; the footer (CTAs) stays on screen.
 */
export function ScreenShell({
  children,
  header,
  footer,
  words,
  posterOpacity,
  className = '',
  bodyClassName = '',
}: ScreenShellProps) {
  return (
    <div className={`screen ${className}`} style={{ backgroundColor: 'var(--theme-bg)' }}>
      {words ? <PosterBackground words={words} opacity={posterOpacity} /> : null}
      {header}
      <div className={`screen-body ${bodyClassName}`}>{children}</div>
      {footer ? <div className="screen-footer">{footer}</div> : null}
    </div>
  )
}
