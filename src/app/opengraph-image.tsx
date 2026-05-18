import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Cards Against AI — The unhinged party card game for the chronically online'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111111',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern words */}
        {['SLAY', 'ICONIC', 'BRUH', 'NO CAP', 'GOAT', 'UNHINGED', 'YEET', 'BASED'].map(
          (word, i) => (
            <div
              key={word}
              style={{
                position: 'absolute',
                fontFamily: 'sans-serif',
                fontSize: 120,
                fontWeight: 900,
                color: 'rgba(255,255,255,0.04)',
                textTransform: 'uppercase',
                transform: `rotate(-12deg)`,
                top: `${-40 + (i % 4) * 180}px`,
                left: `${-100 + Math.floor(i / 4) * 700}px`,
                whiteSpace: 'nowrap',
              }}
            >
              {word}
            </div>
          ),
        )}

        {/* Cards */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
          {/* Black card */}
          <div
            style={{
              width: 200,
              height: 260,
              backgroundColor: '#1A1A1A',
              border: '4px solid #333',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              transform: 'rotate(-6deg)',
              boxShadow: '8px 8px 0px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, fontFamily: 'sans-serif', lineHeight: 1.3 }}>
              What&apos;s the next big thing in AI?
            </div>
            <div style={{ marginTop: 'auto', color: '#666', fontSize: 12, fontFamily: 'sans-serif' }}>
              CARDS AGAINST AI
            </div>
          </div>
          {/* White card */}
          <div
            style={{
              width: 200,
              height: 260,
              backgroundColor: '#F4F4EE',
              border: '4px solid #111',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              transform: 'rotate(4deg)',
              boxShadow: '8px 8px 0px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ color: '#111', fontSize: 22, fontWeight: 700, fontFamily: 'sans-serif', lineHeight: 1.3 }}>
              A sentient toaster with strong opinions
            </div>
            <div style={{ marginTop: 'auto', color: '#999', fontSize: 12, fontFamily: 'sans-serif' }}>
              CARDS AGAINST AI
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 72,
            fontWeight: 900,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: -2,
            textShadow: '6px 6px 0px rgba(0,0,0,0.8)',
            lineHeight: 1,
          }}
        >
          CARDS AGAINST AI
        </div>

        {/* Green accent bar */}
        <div
          style={{
            marginTop: 16,
            backgroundColor: '#66FF00',
            padding: '8px 32px',
            borderRadius: 100,
            border: '3px solid #111',
          }}
        >
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: 20,
              fontWeight: 900,
              color: '#111',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            The unhinged party card game
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
