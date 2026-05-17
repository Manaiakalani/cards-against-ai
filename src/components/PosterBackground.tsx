'use client'

interface PosterBackgroundProps {
  words: string[]
  opacity?: number
}

export function PosterBackground({ words, opacity }: PosterBackgroundProps) {
  // Repeat words enough times to fill the viewport vertically
  const rows = Array.from({ length: 12 }, (_, i) => ({
    word: words[i % words.length],
    isOutline: i % 2 === 1,
  }))

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ zIndex: 0, opacity: opacity ?? 'var(--theme-poster-opacity)' }}
    >
      <div
        className="flex flex-col justify-start"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '120vw',
          height: '140vh',
          transform: 'rotate(-12deg)',
        }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className="whitespace-nowrap leading-none"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: '18vw',
              fontWeight: 400,
              lineHeight: 0.75,
              textTransform: 'lowercase',
              letterSpacing: '-0.04em',
              color: row.isOutline ? 'transparent' : 'var(--theme-poster-color)',
              WebkitTextStroke: row.isOutline ? '3px var(--theme-poster-color)' : undefined,
              paddingRight: '2vw',
            }}
          >
            {row.word}
          </div>
        ))}
      </div>
    </div>
  )
}
