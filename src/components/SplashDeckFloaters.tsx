'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
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

function pickCard(decks: CardDeck[], type: 'black' | 'white', salt: number): Card {
  if (decks.length === 0) return type === 'black' ? FALLBACK_BLACK : FALLBACK_WHITE
  const deck = decks[salt % decks.length]
  const pool = type === 'black' ? deck.cards.blackCards : deck.cards.whiteCards
  if (pool.length === 0) return type === 'black' ? FALLBACK_BLACK : FALLBACK_WHITE
  return pool[Math.floor(Math.random() * pool.length)]
}

function Floater({ side, card }: { side: 'left' | 'right'; card: Card }) {
  const reduceMotion = useReducedMotion()
  const [spins, setSpins] = useState(0)
  const restRotate = side === 'left' ? -8 : 6
  const floatY = side === 'left' ? [0, -14, 0] : [0, -10, 0]
  const floatDuration = side === 'left' ? 3.6 : 4.4

  const spin = useCallback(() => {
    setSpins((n) => n + 1)
  }, [])

  return (
    <div
      className="pointer-events-auto absolute hidden lg:block"
      style={{
        top: side === 'left' ? '14%' : '20%',
        [side]: '4%',
        zIndex: 5,
        width: 180,
        perspective: 900,
      }}
    >
      <m.div
        animate={reduceMotion ? undefined : { y: floatY }}
        transition={
          reduceMotion
            ? { duration: 0.01 }
            : { duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <m.div
          role="button"
          tabIndex={0}
          aria-label="Spin this card"
          onClick={spin}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              spin()
            }
          }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          animate={{
            rotateY: reduceMotion ? 0 : spins * 360,
            rotateZ: restRotate,
          }}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { type: 'spring', stiffness: 80, damping: 14, mass: 0.8 }
          }
          className="select-none"
          style={{ cursor: 'pointer', transformStyle: 'preserve-3d' }}
        >
          <GameCard card={card} size="sm" showFooter />
        </m.div>
      </m.div>
    </div>
  )
}

export function SplashDeckFloaters() {
  const [decks, setDecks] = useState<CardDeck[] | null>(null)

  useEffect(() => {
    let cancelled = false
    void import('@/data/cards').then((mod) => {
      if (!cancelled) setDecks(mod.allDecks)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const black = useMemo(
    () => (decks ? pickCard(decks, 'black', 0) : FALLBACK_BLACK),
    [decks],
  )
  const white = useMemo(
    () => (decks ? pickCard(decks, 'white', 1) : FALLBACK_WHITE),
    [decks],
  )

  return (
    <>
      <Floater side="left" card={black} />
      <Floater side="right" card={white} />
    </>
  )
}
