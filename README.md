# 🃏 Cards Against AI

**The party game for chronically online people.**

> You know that feeling when you're three meetings deep, your Slack is on fire, someone just said "let's circle back" unironically, and you're pretty sure the intern is using ChatGPT to write their standups? Yeah. We made a card game about that.

[![Deploy to GitHub Pages](https://github.com/Manaiakalani/cards-against-ai/actions/workflows/deploy.yml/badge.svg)](https://github.com/Manaiakalani/cards-against-ai/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[Play Now](https://manaiakalani.github.io/cards-against-ai/)** | **[Submit a Deck](https://github.com/Manaiakalani/cards-against-ai/issues/new)**

---

## What is this

Cards Against AI is a Cards Against Humanity-style game built for people who spend too much time on the internet, in Slack, and arguing about whether that alert is actually a Sev 2.

One player draws a black prompt card. Everyone else plays their funniest (worst?) white card. The Card Czar picks a winner. Repeat until someone questions their life choices.

## The decks

| Deck | Vibe |
|------|------|
| 🧠 Brainrot & AI Slop | For when the algorithm is your personality |
| 📱 Terminally Online | Touch grass? Never heard of it |
| 💀 Unhinged Gen Z | No thoughts, just vibes and existential dread |
| 👴 Elder Millennial | Avocado toast discourse and killing industries |
| 🤖 AI Fever Dream | The machines are sentient and they're judging you |
| 🎮 Gamer Lore | Skill issue tbh |
| 🪙 Crypto & Web3 | Number go up (and then very much down) |
| 🚀 Startup Life | We're not a family, we're a ~~company~~ cult |
| 🎵 InTuneD | Music hot takes that will get you unfollowed |
| 🔥 On-Call Nightmares | PagerDuty at 3am on a Friday |

**357 cards** across **10 decks**. All terrible. You're welcome.

## Features

- **Real-time multiplayer** via Supabase Realtime (host a room, share the code, ruin friendships)
- **Solo mode** with AI bots that have questionable taste
- **House rules** - Winner's Pick, Reboot the Universe, round timers
- **Neo-brutalist UI** that looks like a poster from a design school dropout
- **Dark mode** for gaming at 2am like a responsible adult
- **Stats & achievements** because we all need external validation
- **Favorites** - star your best combos for posterity (or blackmail)
- **Fully responsive** - works on your phone, your laptop, your smart fridge

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Multiplayer | Supabase Realtime |
| Hosting | GitHub Pages (static export) |
| Testing | Playwright (140 tests) |

## Getting started

```bash
# Clone it
git clone https://github.com/Manaiakalani/cards-against-ai.git
cd cards-against-ai

# Install deps
npm install

# Run it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start being terrible.

### Multiplayer setup (optional)

If you want real-time multiplayer, you'll need a [Supabase](https://supabase.com) project (free tier works fine):

```bash
cp .env.example .env.local
# Fill in your Supabase URL and anon key
```

Without Supabase credentials, the game runs perfectly in single-player mode with bots.

## Contributing

Got a deck idea? A card that made you ugly-laugh? We want it.

1. **Submit a deck** via [GitHub Issues](https://github.com/Manaiakalani/cards-against-ai/issues/new)
2. **Open a PR** with new cards in `src/data/cards.ts`
3. **Report bugs** (or "features" as we like to call them)

### Card format

```typescript
{ id: 'deck-w1', text: 'Your card text here', type: 'white', category: 'your-deck' }
{ id: 'deck-b1', text: 'Your prompt with _____.', type: 'black', blanks: 1, category: 'your-deck' }
```

## License

[MIT](./LICENSE) - do whatever you want, just don't blame us when HR gets involved.

---

<p align="center">
  <em>Built with questionable judgment and too much caffeine.</em>
  <br>
  <strong>Star this repo</strong> if it made you exhale through your nose.
</p>
