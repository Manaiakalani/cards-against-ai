'use client'

import { type ReactNode } from 'react'
import { PosterBackground } from '@/components/PosterBackground'

interface ScreenShellProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  overlay?: ReactNode
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
  overlay,
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
      {overlay ? (
        <div className="pointer-events-none absolute inset-0 z-20">{overlay}</div>
      ) : null}
      {footer ? <div className="screen-footer">{footer}</div> : null}
    </div>
  )
}
