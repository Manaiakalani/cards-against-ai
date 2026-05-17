import { Card, CardDeck } from '@/types/game'

// ─── Silicon Valley (original from design files) ──────────────────────
const svBlack: Card[] = [
  { id: 'sv-b1', text: "To survive the crypto winter, we had to pivot our core business model to _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b2', text: "Our Series A pitch deck accidentally included _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b3', text: "The CEO said our north star metric should be _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b4', text: "Our Series A pitch deck was 60 slides about _____ disrupting the _____ industry.", type: 'black', blanks: 2, category: 'startup' },
  { id: 'sv-b5', text: "We raised $50M to build _____ for dogs.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b6', text: "My series A pitch deck was mostly just a 45-minute presentation about _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b7', text: "I'm not saying the culture is toxic, but our HR department is basically _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'sv-b8', text: "We just closed a Series B by promising investors _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b9', text: "Our pivot to AI is really just _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'sv-b10', text: "The board fired the CEO for _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b11', text: "YC rejected us because our demo was just _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b12', text: "Our company culture can best be described as _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'sv-b13', text: "The real reason we're in stealth mode is _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'sv-b14', text: "Our all-hands meeting devolved into a heated debate about _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'sv-b15', text: "In my exit interview, I said the worst part was _____.", type: 'black', blanks: 1, category: 'work' },
]

const svWhite: Card[] = [
  { id: 'sv-w1', text: "Selling our office plants as NFTs.", type: 'white', category: 'startup' },
  { id: 'sv-w2', text: "An AI that just outputs \"gm\" and costs $20/mo.", type: 'white', category: 'ai' },
  { id: 'sv-w3', text: "Begging on LinkedIn.", type: 'white', category: 'social' },
  { id: 'sv-w4', text: "Blockchain-powered avocado toast delivery.", type: 'white', category: 'crypto' },
  { id: 'sv-w5', text: "A mindfulness app that just sends push notifications saying \"hustle\".", type: 'white', category: 'startup' },
  { id: 'sv-w6', text: "A 15-minute city that's just a single WeWork.", type: 'white', category: 'startup' },
  { id: 'sv-w7', text: "Promising \"infinite scalability\" with a spreadsheet.", type: 'white', category: 'startup' },
  { id: 'sv-w8', text: "Hiring a \"Vibe Architect\" for $300k/year.", type: 'white', category: 'work' },
  { id: 'sv-w9', text: "Pivot to AI (renaming the IF statements).", type: 'white', category: 'ai' },
  { id: 'sv-w10', text: "Calling a bug a \"feature flag experiment.\"", type: 'white', category: 'programming' },
  { id: 'sv-w11', text: "A blockchain-based mood board.", type: 'white', category: 'crypto' },
  { id: 'sv-w12', text: "\"Disrupting\" the sandwich industry.", type: 'white', category: 'startup' },
  { id: 'sv-w13', text: "Pivoting to Web3 mid-sprint.", type: 'white', category: 'crypto' },
  { id: 'sv-w14', text: "Shipping an MVP with zero features.", type: 'white', category: 'startup' },
  { id: 'sv-w15', text: "A meditation app for VCs.", type: 'white', category: 'startup' },
  { id: 'sv-w16', text: "Burning runway on kombucha deliveries.", type: 'white', category: 'startup' },
  { id: 'sv-w17', text: "Declaring \"stealth mode\" after the leak.", type: 'white', category: 'startup' },
  { id: 'sv-w18', text: "The ethical implications of breeding dog-sized horses.", type: 'white', category: 'startup' },
  { id: 'sv-w19', text: "Burning man photos I swore I deleted.", type: 'white', category: 'lifestyle' },
  { id: 'sv-w20', text: "How my keto diet cured my fear of failure.", type: 'white', category: 'lifestyle' },
  { id: 'sv-w21', text: "An 18-year-old dropout from Stanford with a god complex.", type: 'white', category: 'startup' },
  { id: 'sv-w22', text: "Replacing the board with a Magic 8-Ball.", type: 'white', category: 'startup' },
  { id: 'sv-w23', text: "Paying $8/mo to be bullied by Elon.", type: 'white', category: 'social' },
  { id: 'sv-w24', text: "A Series A round led by a guy in a Patagonia vest.", type: 'white', category: 'startup' },
  { id: 'sv-w25', text: "Rebranding to include more gradients.", type: 'white', category: 'startup' },
  { id: 'sv-w26', text: "A Slack channel dedicated entirely to complaining about Slack.", type: 'white', category: 'work' },
  { id: 'sv-w27', text: "A \"profitable\" business model based on vibes and caffeine.", type: 'white', category: 'startup' },
  { id: 'sv-w28', text: "Pivoting to a \"Bio-Hacking\" retreat that is just sleeping in a tent.", type: 'white', category: 'startup' },
]

// ─── Tech Culture (from Cards repo) ──────────────────────────────────
const techBlack: Card[] = [
  { id: 'b1', text: "My code isn't working because of _____.", type: 'black', blanks: 1, category: 'programming' },
  { id: 'b2', text: "The real reason I can't sleep at night is _____.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'b3', text: "I spent 3 hours debugging, and the problem was _____.", type: 'black', blanks: 1, category: 'programming' },
  { id: 'b4', text: "My app crashed because of _____.", type: 'black', blanks: 1, category: 'programming' },
  { id: 'b5', text: "TikTok's algorithm thinks I like _____.", type: 'black', blanks: 1, category: 'social' },
  { id: 'b6', text: "Generation Alpha doesn't understand _____.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'b7', text: "My biggest flex is _____.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'b8', text: "Discord mods be like: _____.", type: 'black', blanks: 1, category: 'social' },
  { id: 'b9', text: "POV: You're explaining _____ to your parents.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'b10', text: "The worst part about remote work is _____.", type: 'black', blanks: 1, category: 'work' },
]

const techWhite: Card[] = [
  { id: 'w1', text: "JavaScript being JavaScript", type: 'white', category: 'programming' },
  { id: 'w2', text: "A missing semicolon from 2019", type: 'white', category: 'programming' },
  { id: 'w3', text: "Accidentally pushing to main", type: 'white', category: 'programming' },
  { id: 'w4', text: "Crying in React documentation", type: 'white', category: 'programming' },
  { id: 'w5', text: "Stack Overflow copy-paste solutions", type: 'white', category: 'programming' },
  { id: 'w6', text: "CSS not doing what it's supposed to do", type: 'white', category: 'programming' },
  { id: 'w7', text: "TikTok algorithms knowing me too well", type: 'white', category: 'social' },
  { id: 'w8', text: "My entire personality being Discord memes", type: 'white', category: 'social' },
  { id: 'w9', text: "Instagram story viewers who never like posts", type: 'white', category: 'social' },
  { id: 'w10', text: "Twitter drama at 3 AM", type: 'white', category: 'social' },
  { id: 'w11', text: "Getting ratio'd by a 14-year-old", type: 'white', category: 'social' },
  { id: 'w12', text: "LinkedIn influencers' motivational posts", type: 'white', category: 'social' },
  { id: 'w13', text: "My WiFi password: \"password123\"", type: 'white', category: 'tech' },
  { id: 'w14', text: "47 Chrome tabs and 3GB of RAM", type: 'white', category: 'tech' },
  { id: 'w15', text: "Forgetting to charge my AirPods", type: 'white', category: 'tech' },
  { id: 'w16', text: "Auto-correct changing \"ducking\" to... well", type: 'white', category: 'tech' },
  { id: 'w17', text: "Being permanently online but emotionally unavailable", type: 'white', category: 'lifestyle' },
  { id: 'w18', text: "Main character energy but side character budget", type: 'white', category: 'lifestyle' },
  { id: 'w19', text: "Millennial skinny jeans", type: 'white', category: 'generational' },
  { id: 'w20', text: "Explaining what \"bussin\" means to your manager", type: 'white', category: 'generational' },
  { id: 'w21', text: "Using \"periodt\" unironically", type: 'white', category: 'generational' },
  { id: 'w22', text: "That one friend who still uses Facebook", type: 'white', category: 'social' },
  { id: 'w23', text: "Slack notifications during vacation", type: 'white', category: 'work' },
  { id: 'w24', text: "Pretending to work while actually watching TikTok", type: 'white', category: 'work' },
  { id: 'w25', text: "Zoom fatigue but make it permanent", type: 'white', category: 'work' },
]

// ─── Gen Z (from Cards repo) ─────────────────────────────────────────
const genZBlack: Card[] = [
  { id: 'gz-b1', text: "My TikTok FYP is full of _____.", type: 'black', blanks: 1, category: 'social' },
  { id: 'gz-b2', text: "I can't even _____, no cap fr fr.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'gz-b3', text: "POV: You're explaining _____ to your parents.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'gz-b4', text: "This AI thinks _____ is the meaning of life.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'gz-b5', text: "Why I'm chronically online: _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'gz-b6', text: "Main character energy but make it _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'gz-b7', text: "It's giving _____ vibes.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'gz-b8', text: "Discord mods when they see _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gz-b9', text: "Touch grass? I'd rather touch _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'gz-b10', text: "The real reason I have trust issues: _____.", type: 'black', blanks: 1, category: 'culture' },
]

const genZWhite: Card[] = [
  { id: 'gz-w1', text: "Crying to Phoebe Bridgers at 2 AM", type: 'white', category: 'culture' },
  { id: 'gz-w2', text: "My entire personality being Taylor Swift eras", type: 'white', category: 'culture' },
  { id: 'gz-w3', text: "Gaslight, gatekeep, girlboss", type: 'white', category: 'slang' },
  { id: 'gz-w4', text: "Unhinged group chat at 3 AM", type: 'white', category: 'social' },
  { id: 'gz-w5', text: "Being absolutely feral about celebrity drama", type: 'white', category: 'culture' },
  { id: 'gz-w6', text: "Therapy speak in everyday conversations", type: 'white', category: 'culture' },
  { id: 'gz-w7', text: "Spotify Wrapped anxiety", type: 'white', category: 'tech' },
  { id: 'gz-w8', text: "Having 47 browser tabs open permanently", type: 'white', category: 'tech' },
  { id: 'gz-w9', text: "Romanticizing my mental breakdown", type: 'white', category: 'culture' },
  { id: 'gz-w10', text: "Being chronically online but also touch-starved", type: 'white', category: 'internet' },
  { id: 'gz-w11', text: "Dark academia aesthetic but make it ADHD", type: 'white', category: 'culture' },
  { id: 'gz-w12', text: "Parasocial relationships with YouTubers", type: 'white', category: 'social' },
  { id: 'gz-w13', text: "Micro-dosing on validation through likes", type: 'white', category: 'social' },
  { id: 'gz-w14', text: "Being the designated tech support for millennials", type: 'white', category: 'generational' },
  { id: 'gz-w15', text: "Explaining NFTs like they're not a scam", type: 'white', category: 'crypto' },
  { id: 'gz-w16', text: "My BeReal at the worst possible moment", type: 'white', category: 'social' },
  { id: 'gz-w17', text: "Making everything about my rising sign", type: 'white', category: 'culture' },
  { id: 'gz-w18', text: "Having main character syndrome in supporting character situations", type: 'white', category: 'culture' },
  { id: 'gz-w19', text: "Trauma dumping in TikTok comments", type: 'white', category: 'social' },
  { id: 'gz-w20', text: "My entire sense of humor being gen z slang", type: 'white', category: 'slang' },
]

// ─── Millennial (from Cards repo) ────────────────────────────────────
const milBlack: Card[] = [
  { id: 'mil-b1', text: "Remember when _____ was actually good?", type: 'black', blanks: 1, category: 'nostalgia' },
  { id: 'mil-b2', text: "I'm not old, I just remember _____.", type: 'black', blanks: 1, category: 'nostalgia' },
  { id: 'mil-b3', text: "Back in my day, _____ was free.", type: 'black', blanks: 1, category: 'economy' },
  { id: 'mil-b4', text: "My student loan payment went to _____.", type: 'black', blanks: 1, category: 'economy' },
  { id: 'mil-b5', text: "I peaked during the era of _____.", type: 'black', blanks: 1, category: 'nostalgia' },
  { id: 'mil-b6', text: "Kids these days don't understand _____.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'mil-b7', text: "My midlife crisis involves buying _____.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'mil-b8', text: "I feel personally attacked by _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'mil-b9', text: "The housing market is so bad, I'm considering _____.", type: 'black', blanks: 1, category: 'economy' },
  { id: 'mil-b10', text: "My therapist says I have trauma from _____.", type: 'black', blanks: 1, category: 'culture' },
]

const milWhite: Card[] = [
  { id: 'mil-w1', text: "Dial-up internet sounds", type: 'white', category: 'nostalgia' },
  { id: 'mil-w2', text: "Burning CDs for your crush", type: 'white', category: 'nostalgia' },
  { id: 'mil-w3', text: "Having to rewind VHS tapes", type: 'white', category: 'nostalgia' },
  { id: 'mil-w4', text: "Blockbuster late fees", type: 'white', category: 'nostalgia' },
  { id: 'mil-w5', text: "MySpace top 8 drama", type: 'white', category: 'social' },
  { id: 'mil-w6', text: "Having to print MapQuest directions", type: 'white', category: 'nostalgia' },
  { id: 'mil-w7', text: "The anxiety of calling someone's house phone", type: 'white', category: 'nostalgia' },
  { id: 'mil-w8', text: "Spending hours perfecting your AIM away message", type: 'white', category: 'nostalgia' },
  { id: 'mil-w9', text: "The financial crisis ruining our career prospects", type: 'white', category: 'economy' },
  { id: 'mil-w10', text: "Being told we killed the diamond industry", type: 'white', category: 'economy' },
  { id: 'mil-w11', text: "Peak Facebook when it was actually fun", type: 'white', category: 'social' },
  { id: 'mil-w12', text: "The golden age of Adult Swim", type: 'white', category: 'culture' },
  { id: 'mil-w13', text: "Flash games on Newgrounds", type: 'white', category: 'gaming' },
  { id: 'mil-w14', text: "The distinct pain of being a Sears catalog kid", type: 'white', category: 'nostalgia' },
  { id: 'mil-w15', text: "Explaining the internet to our parents", type: 'white', category: 'generational' },
  { id: 'mil-w16', text: "The shame of still using Facebook", type: 'white', category: 'social' },
  { id: 'mil-w17', text: "Remembering life before smartphones", type: 'white', category: 'nostalgia' },
  { id: 'mil-w18', text: "Being old enough to remember good SNL", type: 'white', category: 'culture' },
  { id: 'mil-w19', text: "The distinct trauma of 2016-2020", type: 'white', category: 'culture' },
  { id: 'mil-w20', text: "Having to explain memes to Gen X", type: 'white', category: 'generational' },
]

// ─── Expansion: AI & Crypto ──────────────────────────────────────────
const aiCryptoBlack: Card[] = [
  { id: 'ai-b1', text: "ChatGPT refused to help me with _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b2', text: "The AI uprising started with _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b3', text: "I asked the AI to write code for _____ and it became sentient.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'crypto-b1', text: "I lost my life savings on _____.", type: 'black', blanks: 1, category: 'crypto' },
  { id: 'crypto-b2', text: "Web3 will revolutionize _____.", type: 'black', blanks: 1, category: 'crypto' },
  { id: 'crypto-b3', text: "The metaverse needs more _____.", type: 'black', blanks: 1, category: 'crypto' },
]

const aiCryptoWhite: Card[] = [
  { id: 'ai-w1', text: "Teaching AI to be racist accidentally", type: 'white', category: 'ai' },
  { id: 'ai-w2', text: "AI-generated art that's suspiciously good", type: 'white', category: 'ai' },
  { id: 'ai-w3', text: "Machine learning but it learns the wrong things", type: 'white', category: 'ai' },
  { id: 'crypto-w1', text: "Dogecoin to the moon 🚀", type: 'white', category: 'crypto' },
  { id: 'crypto-w2', text: "NFTs of someone else's art", type: 'white', category: 'crypto' },
  { id: 'crypto-w3', text: "Diamond hands during the crash", type: 'white', category: 'crypto' },
]

// ─── Expansion: Gaming ───────────────────────────────────────────────
const gamingBlack: Card[] = [
  { id: 'gaming-b1', text: "My gaming setup is missing _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gaming-b2', text: "I rage quit because of _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gaming-b3', text: "Streamers nowadays only talk about _____.", type: 'black', blanks: 1, category: 'gaming' },
]

const gamingWhite: Card[] = [
  { id: 'gaming-w1', text: "Getting headshot by a 12-year-old", type: 'white', category: 'gaming' },
  { id: 'gaming-w2', text: "RGB lighting on literally everything", type: 'white', category: 'gaming' },
  { id: 'gaming-w3', text: "Spending $500 on skins for a free game", type: 'white', category: 'gaming' },
]

// ─── Deck definitions ────────────────────────────────────────────────
export const allDecks: CardDeck[] = [
  {
    id: 'silicon-valley',
    name: 'Silicon Valley',
    description: 'Startup culture, VCs, and pivot-to-AI energy',
    icon: '🦄',
    cards: { blackCards: svBlack, whiteCards: svWhite },
  },
  {
    id: 'tech-culture',
    name: 'Tech Culture',
    description: 'Programming, social media, and digital life chaos',
    icon: '💻',
    cards: { blackCards: techBlack, whiteCards: techWhite },
  },
  {
    id: 'gen-z',
    name: 'Gen Z Vibes',
    description: 'TikTok, chronically online humor, and therapy speak',
    icon: '📱',
    cards: { blackCards: genZBlack, whiteCards: genZWhite },
  },
  {
    id: 'millennial',
    name: 'Millennial Memories',
    description: 'Nostalgia, student loans, and "back in my day"',
    icon: '🏠',
    cards: { blackCards: milBlack, whiteCards: milWhite },
  },
  {
    id: 'ai-crypto',
    name: 'AI & Crypto Chaos',
    description: 'ChatGPT fails, NFT disasters, and blockchain bros',
    icon: '🤖',
    cards: { blackCards: aiCryptoBlack, whiteCards: aiCryptoWhite },
  },
  {
    id: 'gaming',
    name: 'Gaming Culture',
    description: 'Streamers, rage quits, and RGB everything',
    icon: '🎮',
    cards: { blackCards: gamingBlack, whiteCards: gamingWhite },
  },
]

export function getAllCards(deckIds?: string[]) {
  const decks = deckIds
    ? allDecks.filter(d => deckIds.includes(d.id))
    : allDecks

  return {
    blackCards: decks.flatMap(d => d.cards.blackCards),
    whiteCards: decks.flatMap(d => d.cards.whiteCards),
  }
}

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
