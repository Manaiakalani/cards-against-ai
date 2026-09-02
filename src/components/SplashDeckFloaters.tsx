'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { GameCard } from '@/components/GameCard'
import type { Card, CardDeck } from '@/types/game'

const FALLBACK_BLACK: Card = {
  id: 'splash-black',
  text: 'The next _____ will be my entire personality.',
  type: 'black',
}

const FALLBACK_WHITE: Card = {
  id: 'splash-white',
  text: 'Vibe coding at 3 AM with zero tests',
  type: 'white',
}

function pickFromDecks(
  decks: CardDeck[],
  type: 'black' | 'white',
  cursor: number,
  excludeId?: string,
): { card: Card; cursor: number } {
  if (decks.length === 0) {
    return { card: type === 'black' ? FALLBACK_BLACK : FALLBACK_WHITE, cursor }
  }
  for (let i = 0; i < decks.length; i++) {
    const deck = decks[(cursor + i) % decks.length]
    const pool = type === 'black' ? deck.cards.blackCards : deck.cards.whiteCards
    const choices = excludeId ? pool.filter((c) => c.id !== excludeId) : pool
    if (choices.length === 0) continue
    return {
      card: choices[Math.floor(Math.random() * choices.length)],
      cursor: cursor + i + 1,
    }
  }
  return { card: type === 'black' ? FALLBACK_BLACK : FALLBACK_WHITE, cursor: cursor + 1 }
}

function Floater({
  side,
  type,
  decks,
}: {
  side: 'left' | 'right'
  type: 'black' | 'white'
  decks: CardDeck[]
}) {
  const reduceMotion = useReducedMotion()
  const cursor = useRef(side === 'left' ? 0 : 1)
  const [exitDir, setExitDir] = useState(side === 'left' ? -1 : 1)
  const [card, setCard] = useState<Card>(type === 'black' ? FALLBACK_BLACK : FALLBACK_WHITE)

  const dealNext = useCallback(
    (dir: number) => {
      const next = pickFromDecks(decks, type, cursor.current, card.id)
      cursor.current = next.cursor
      setExitDir(dir)
      queueMicrotask(() => setCard(next.card))
    },
    [card.id, decks, type],
  )

  const restRotate = side === 'left' ? -8 : 6

  return (
    <div
      className="pointer-events-auto absolute hide-short hidden md:block"
      style={{
        top: side === 'left' ? '16%' : '22%',
        [side]: '6%',
        zIndex: 5,
        width: 180,
      }}
    >
      <AnimatePresence initial={false}>
        <m.div
          key={card.id}
          drag={reduceMotion ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.85}
          whileHover={{ scale: 1.04, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 20 }}
          initial={{ x: 0, rotate: restRotate, opacity: 0, scale: 0.92 }}
          animate={{ x: 0, rotate: restRotate, opacity: 0.92, scale: 1 }}
          exit={{
            x: exitDir * 280,
            rotate: exitDir * 28 + restRotate,
            opacity: 0,
            transition: { duration: reduceMotion ? 0.01 : 0.28 },
          }}
          onDragEnd={(_, info) => {
            const gone = Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 650
            if (gone) dealNext(info.offset.x >= 0 ? 1 : -1)
          }}
          onTap={() => dealNext(side === 'left' ? -1 : 1)}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          role="button"
          tabIndex={0}
          aria-label={`Draw a new ${type} card. Drag left or right, or press Enter.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              dealNext(side === 'left' ? -1 : 1)
            }
            if (e.key === 'ArrowLeft') dealNext(-1)
            if (e.key === 'ArrowRight') dealNext(1)
          }}
          className="select-none"
          style={{ touchAction: 'pan-y' }}
        >
          <GameCard card={card} size="sm" showFooter />
        </m.div>
      </AnimatePresence>
    </div>
  )
}

export function SplashDeckFloaters() {
  const [decks, setDecks] = useState<CardDeck[]>([])

  useEffect(() => {
    let cancelled = false
    void import('@/data/cards').then((mod) => {
      if (!cancelled) setDecks(mod.allDecks)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Floater side="left" type="black" decks={decks} />
      <Floater side="right" type="white" decks={decks} />
    </>
  )
}
