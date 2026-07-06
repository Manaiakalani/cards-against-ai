import { Card } from '@/types/game'

// Generic, content-free array helpers used by the game engine after a
// round has already started (the card pool is already in memory by then).
// Kept separate from `cards.ts` — which holds the actual ~350 cards of
// deck text — so callers that only need shuffling/drawing logic (e.g.
// `useGameState.ts`, statically imported from the very first render) don't
// have to pull in that much larger module just for these two functions.

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function drawCards(pool: Card[], count: number): { drawn: Card[]; remaining: Card[] } {
  const shuffled = shuffle(pool)
  return {
    drawn: shuffled.slice(0, count),
    remaining: shuffled.slice(count),
  }
}
