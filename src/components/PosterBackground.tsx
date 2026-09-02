'use client'

import React from 'react'

interface PosterBackgroundProps {
  words: string[]
  opacity?: number
}

export const PosterBackground = React.memo(function PosterBackground({ words, opacity }: PosterBackgroundProps) {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    word: words[i % words.length],
    isOutline: i % 2 === 1,
  }))

  return (
    <div
      className="poster-bg pointer-events-none fixed inset-0 select-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0, opacity: opacity ?? 'var(--theme-poster-opacity)' }}
    >
      <div className="poster-bg-inner flex flex-col justify-start">
        {rows.map((row, i) => (
          <div
            key={i}
            className={row.isOutline ? 'poster-row poster-row-outline' : 'poster-row'}
          >
            {row.word}
          </div>
        ))}
      </div>
    </div>
  )
})
