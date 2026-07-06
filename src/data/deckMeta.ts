// Lightweight deck metadata — id/name/description/icon plus precomputed
// card counts, with none of the ~350 cards' actual text. UI that only
// displays deck labels and counts (splash stats, the lobby deck picker,
// the stats screen) should import this instead of `@/data/cards`, whose
// full text content is only needed once a game actually starts.
//
// Counts are a static snapshot of the arrays in `cards.ts` (verified via
// `allDecks[i].cards.blackCards/whiteCards.length` at the time this was
// written). If a deck's card list changes, update its counts here too —
// a mismatch only affects displayed numbers, not dealt cards, since
// `getAllCards()` in `cards.ts` remains the actual source of truth used
// to build hands.
export interface DeckMeta {
  id: string
  name: string
  description: string
  icon: string
  blackCount: number
  whiteCount: number
}

export const deckMeta: DeckMeta[] = [
  {
    id: 'brainrot',
    name: 'Brainrot & AI Slop',
    description: 'Startup culture meets chronically online chaos',
    icon: '🧠',
    blackCount: 20,
    whiteCount: 28,
  },
  {
    id: 'terminally-online',
    name: 'Terminally Online',
    description: 'Tech, memes, and the internet was a mistake',
    icon: '💀',
    blackCount: 14,
    whiteCount: 25,
  },
  {
    id: 'gen-z',
    name: 'Unhinged Gen Z',
    description: 'Slay, situationships, and therapy-speak fluency',
    icon: '✨',
    blackCount: 13,
    whiteCount: 24,
  },
  {
    id: 'millennial',
    name: 'Elder Millennial',
    description: 'Nostalgia, student loans, and "adulting is a scam"',
    icon: '🫠',
    blackCount: 13,
    whiteCount: 22,
  },
  {
    id: 'ai-fever',
    name: 'AI Fever Dream',
    description: 'GPT wrappers, vibe coding, and sentient toasters',
    icon: '🤖',
    blackCount: 10,
    whiteCount: 10,
  },
  {
    id: 'gaming',
    name: 'Gamer Lore',
    description: 'NPC behavior, rage quits, and RGB everything',
    icon: '🎮',
    blackCount: 10,
    whiteCount: 12,
  },
  {
    id: 'crypto',
    name: 'Crypto & Web3',
    description: 'NFT disasters, blockchain bros, and diamond hands',
    icon: '💎',
    blackCount: 8,
    whiteCount: 15,
  },
  {
    id: 'startup',
    name: 'Startup Life',
    description: 'Pitch decks, pivots, and ping pong tables',
    icon: '🚀',
    blackCount: 8,
    whiteCount: 15,
  },
  {
    id: 'intuned',
    name: 'InTuneD',
    description: 'Teams chaos, ADO nightmares, and Intune compliance disasters',
    icon: '🎯',
    blackCount: 25,
    whiteCount: 40,
  },
  {
    id: 'oncall',
    name: 'On-Call Nightmares',
    description: 'ICM bridges, pager duty, and 3 AM prod incidents',
    icon: '🚨',
    blackCount: 15,
    whiteCount: 20,
  },
]
