'use client'

import { useEffect, useCallback, useState, type CSSProperties, type ReactNode } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { deckMeta } from '@/data/deckMeta'
import { LICENSE_URL, SITE_LINKS } from '@/lib/tokens'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

type HelpPane = 'rules' | 'privacy' | 'license'

const RULES = [
  {
    emoji: '🃏',
    title: 'The Setup',
    body: 'Each round, a black prompt card is shown. Everyone (except the judge) picks their funniest white answer card.',
  },
  {
    emoji: '👑',
    title: 'The Judge',
    body: 'One player is the judge each round. They pick the answer that makes them laugh the hardest. The judge rotates every round.',
  },
  {
    emoji: '🏆',
    title: 'Scoring',
    body: 'Win a round = 1 point. First to the score limit wins the whole game. It\'s that simple.',
  },
  {
    emoji: '🔄',
    title: 'New Hand',
    body: 'Hate your cards? You can redraw your entire hand once per round. Use it wisely.',
  },
  {
    emoji: '⏳',
    title: 'Async tables',
    body: 'Host an async game and share the code. Friends can join in the lobby or drop in later. Everyone plays a card when they can — nobody has to stay in the tab. Come back when it is YOUR TURN on the home list.',
  },
  {
    emoji: '💀',
    title: 'The Vibe',
    body: 'Be unhinged. Be chaotic. The funniest, most cursed answer wins. There are no wrong answers (except boring ones).',
  },
]

const totalCards = deckMeta.reduce((sum, d) => sum + d.blackCount + d.whiteCount, 0)

const TITLES: Record<HelpPane, string> = {
  rules: 'How to Play',
  privacy: 'Privacy',
  license: 'License',
}

function MenuChip({
  children,
  href,
  onClick,
  bg,
  color = 'var(--theme-text)',
  active = false,
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  bg: string
  color?: string
  active?: boolean
}) {
  const style: CSSProperties = {
    fontFamily: 'var(--font-archivo)',
    fontSize: 11,
    backgroundColor: bg,
    color,
    border: '3px solid var(--theme-border)',
    padding: '6px 10px',
    minHeight: 40,
    borderRadius: 12,
    boxShadow: active ? '1px 1px 0px var(--theme-shadow-soft)' : '3px 3px 0px var(--theme-shadow-soft)',
    transform: active ? 'translate(2px, 2px)' : undefined,
    letterSpacing: '0.03em',
  }
  const className = 'inline-flex items-center justify-center cursor-pointer uppercase no-underline'
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style} aria-pressed={active}>
      {children}
    </button>
  )
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  const [pane, setPane] = useState<HelpPane>('rules')

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      setPane('rules')
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open, handleEsc])

  const trapRef = useFocusTrap<HTMLDivElement>(open)

  useEffect(() => {
    trapRef.current?.scrollTo({ top: 0 })
  }, [pane])

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: 'var(--theme-overlay)' }}
          />

          <m.div
            ref={trapRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain shadow-hard-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
            style={{
              maxHeight: 'calc(100vh - 4rem)',
              backgroundColor: 'var(--theme-bg)',
              border: '4px solid var(--theme-border)',
              borderRadius: 24,
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '3px solid var(--theme-border)' }}
            >
              <div>
                {pane !== 'rules' && (
                  <button
                    type="button"
                    onClick={() => setPane('rules')}
                    className="mb-1 cursor-pointer uppercase"
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: 11,
                      color: 'var(--theme-text-muted)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                    }}
                  >
                    ← How to Play
                  </button>
                )}
                <h2
                  id="help-modal-title"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 28,
                    color: 'var(--theme-text)',
                  }}
                >
                  {TITLES[pane]}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close help"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--theme-text)',
                  color: 'var(--theme-bg)',
                  border: 'none',
                  fontFamily: 'var(--font-archivo)',
                  fontSize: 20,
                }}
              >
                ✕
              </button>
            </div>

            {pane === 'rules' && (
              <div className="flex flex-col gap-4 px-6 py-5">
                {RULES.map((rule, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 text-2xl">{rule.emoji}</span>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-archivo)',
                          fontSize: 16,
                          color: 'var(--theme-text)',
                        }}
                      >
                        {rule.title}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 14,
                          color: 'var(--theme-text-secondary)',
                          lineHeight: 1.5,
                        }}
                      >
                        {rule.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pane === 'privacy' && (
              <div className="flex flex-col gap-4 px-6 py-5">
                <p style={legalBody}>
                  No accounts. No email. Pick a fake name. We are not HR.
                </p>
                <div>
                  <p style={legalHead}>On your device</p>
                  <p style={legalBody}>
                    Stats, mute, and saved tables stay in this browser. Clear the site and they&apos;re gone.
                  </p>
                </div>
                <div>
                  <p style={legalHead}>Multiplayer</p>
                  <p style={legalBody}>
                    We only keep what the table needs: the room code, the name on your avatar, and the cards you play.
                  </p>
                </div>
                <div>
                  <p style={legalHead}>Visits</p>
                  <p style={legalBody}>
                    We count page views so we know the game is alive. No ads. We don&apos;t sell your data.
                  </p>
                </div>
              </div>
            )}

            {pane === 'license' && (
              <div className="flex flex-col gap-4 px-6 py-5">
                <p style={legalHead}>MIT License</p>
                <p style={legalBody}>
                  Copyright 2026 Manaiakalani. Do whatever you want with the code, just don&apos;t blame us when HR gets involved.
                </p>
                <p style={legalBody}>
                  This is not Cards Against Humanity. CAH is someone else&apos;s trademark. We are a fan-made party game about AI brainrot.
                </p>
                <a
                  href={LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit cursor-pointer uppercase no-underline"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    fontSize: 13,
                    backgroundColor: '#FFD700',
                    color: '#111111',
                    border: '3px solid var(--theme-border)',
                    padding: '8px 12px',
                    minHeight: 40,
                    borderRadius: 12,
                    boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
                  }}
                >
                  Full license on GitHub
                </a>
              </div>
            )}

            <div
              className="flex flex-col items-center gap-3 px-6 py-4"
              style={{ borderTop: '3px solid var(--theme-border)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: 'var(--theme-text-muted)',
                }}
              >
                {totalCards} cards • {deckMeta.length} decks • infinite chaos
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <MenuChip href={SITE_LINKS[0].href} bg="var(--theme-surface)">
                  GitHub
                </MenuChip>
                <MenuChip href={SITE_LINKS[1].href} bg="#FFB6C1" color="#111111">
                  Submit a Deck
                </MenuChip>
                <MenuChip
                  onClick={() => setPane('privacy')}
                  bg="#66FF00"
                  color="#111111"
                  active={pane === 'privacy'}
                >
                  Privacy
                </MenuChip>
                <MenuChip
                  onClick={() => setPane('license')}
                  bg="#FFD700"
                  color="#111111"
                  active={pane === 'license'}
                >
                  License
                </MenuChip>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}

const legalHead: CSSProperties = {
  fontFamily: 'var(--font-archivo)',
  fontSize: 16,
  color: 'var(--theme-text)',
  marginBottom: 4,
}

const legalBody: CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 14,
  color: 'var(--theme-text-secondary)',
  lineHeight: 1.5,
}
