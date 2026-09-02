import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** iOS home-screen icon — same mark as app/icon.svg, rasterized. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          backgroundColor: '#F4F4EE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 78,
            height: 110,
            backgroundColor: '#111111',
            borderRadius: 14,
            transform: 'rotate(-16deg) translate(-22px, 2px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 12px',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', width: 48, height: 10, borderRadius: 4, backgroundColor: '#F4F4EE' }} />
          <div style={{ display: 'flex', width: 34, height: 10, borderRadius: 4, backgroundColor: '#66FF00' }} />
          <div style={{ display: 'flex', width: 42, height: 10, borderRadius: 4, backgroundColor: 'rgba(244,244,238,0.45)' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            width: 78,
            height: 110,
            backgroundColor: '#FFFFFF',
            border: '6px solid #111111',
            borderRadius: 14,
            transform: 'rotate(12deg) translate(18px, 6px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 12px',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', width: 48, height: 10, borderRadius: 4, backgroundColor: '#111111' }} />
          <div style={{ display: 'flex', width: 32, height: 10, borderRadius: 4, backgroundColor: 'rgba(17,17,17,0.35)' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 12,
            width: 52,
            height: 52,
            borderRadius: 999,
            backgroundColor: '#66FF00',
            border: '5px solid #111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111111',
            fontSize: 36,
            fontWeight: 900,
            fontFamily: 'Arial Black, Impact, sans-serif',
            lineHeight: 1,
          }}
        >
          !
        </div>
      </div>
    ),
    { ...size },
  )
}
