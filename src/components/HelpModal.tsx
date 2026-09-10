'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { deckMeta } from '@/data/deckMeta'
import { ModalCloseButton, ModalFrame } from '@/components/ModalFrame'
import { LICENSE_URL, SITE_LINKS } from '@/lib/tokens'
import { useGame } from '@/contexts/GameContext'
import { alertsMuted, savePushSubscription, setAlertsMuted, subscribeAlertsChange } from '@/lib/pushStore'
import { subscribeToPush, unsubscribeFromPush } from '@/lib/pwa'

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
    body: 'Host an async game and share the code. Friends can join in the lobby or drop in later. Install the app (Android) or Add to Home Screen (iPhone) and allow alerts so this device can ping when it is YOUR TURN.',
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
  const [bodyEl, setBodyEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (open) setPane('rules')
  }, [open])

  useEffect(() => {
    bodyEl?.scrollTo({ top: 0 })
  }, [pane, bodyEl])

  return (
    <ModalFrame open={open} onClose={onClose} labelledBy="help-modal-title">
            <div className="cai-dialog-header">
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
              <ModalCloseButton onClick={onClose} label="Close help" />
            </div>

            <div ref={setBodyEl} className="cai-dialog-body">
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
                <AlertsToggle />
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
                <div>
                  <p style={legalHead}>Turn alerts</p>
                  <p style={legalBody}>
                    If you allow notifications, this device can ping when it is your turn. Mute them below without digging through system settings.
                  </p>
                  <div className="mt-3">
                    <AlertsToggle />
                  </div>
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
            </div>

            <div
              className="flex flex-shrink-0 flex-col items-center gap-3 px-6 py-4"
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
    </ModalFrame>
  )
}

function AlertsToggle() {
  const { gameState, isAsync, myPlayerId } = useGame()
  const [muted, setMuted] = useState(alertsMuted)

  useEffect(() => subscribeAlertsChange(() => setMuted(alertsMuted())), [])

  return (
    <button
      type="button"
      aria-pressed={!muted}
      onClick={async () => {
        const next = !muted
        setMuted(next)
        setAlertsMuted(next)
        if (next) {
          await unsubscribeFromPush()
          return
        }
        if (!isAsync || !gameState.roomCode || !myPlayerId) return
        const sub = await subscribeToPush()
        if (sub) await savePushSubscription(gameState.roomCode, myPlayerId, sub)
      }}
      className="inline-flex min-h-10 cursor-pointer items-center uppercase"
      style={{
        fontFamily: 'var(--font-archivo)',
        fontSize: 12,
        backgroundColor: muted ? 'var(--theme-surface)' : '#66FF00',
        color: '#111111',
        border: '3px solid var(--theme-border)',
        padding: '6px 12px',
        borderRadius: 12,
        boxShadow: '3px 3px 0px var(--theme-shadow-soft)',
        letterSpacing: '0.03em',
      }}
    >
      {muted ? 'Unmute turn alerts' : 'Mute turn alerts'}
    </button>
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
