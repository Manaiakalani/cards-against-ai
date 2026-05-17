'use client'

interface CardIconProps {
  color?: string
  size?: number
}

export function CardIcon({ color = 'currentColor', size = 12 }: CardIconProps) {
  const w = size
  const h = size * 1.4

  return (
    <span className="inline-flex items-end" style={{ gap: size * -0.25 }}>
      <span
        className="rounded-sm inline-block"
        style={{
          width: w,
          height: h,
          backgroundColor: color,
        }}
      />
      <span
        className="rounded-sm inline-block"
        style={{
          width: w,
          height: h,
          backgroundColor: 'transparent',
          border: `1.5px solid ${color}`,
          transform: 'rotate(15deg)',
        }}
      />
    </span>
  )
}
