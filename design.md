# Design System: Cards Against Silicon Valley

**Project:** Cards Against Silicon Valley — A brutalist party card game for tech culture

---

### 1. Visual Theme & Atmosphere

**North Star: "Startup pitch deck meets punk rock poster shop."**

A high-energy, brutalist poster-art aesthetic that feels like a Y Combinator demo day got hijacked by a graphic design zine. Bold, unapologetic, and dripping with Silicon Valley irony. The design uses oversized rotated typography as atmospheric wallpaper, hard-edged geometric shapes, and a tight 5-color palette applied with maximum contrast. Every surface feels tactile — thick borders, hard drop shadows, and sticker-like badges create a collage energy. The tone is playful irreverence aimed at tech-native players who'll immediately recognize the startup jargon being skewered.

**Density:** High — layered elements, overlapping cards, rotated stickers. But generous negative space on the cream background prevents claustrophobia.

**Aesthetic Category:** Neo-brutalist / Poster Art / Zine Collage

---

### 2. Color Palette & Roles

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Warm Parchment Cream | `#F4F4EE` | Page background — the "paper" everything sits on |
| Alarm Red | `#FF4242` | Poster text, danger accents, destructive actions |
| Electric Lime | `#66FF00` | Primary action (confirm, play, winner), success states, leader highlight |
| Bubblegum Pink | `#FFB6C1` | Secondary accent, sticker backgrounds, round tags, czar badges |
| Pitch Black | `#111111` | Card backgrounds (black cards), text, thick borders, hard shadows |
| Pure White | `#FFFFFF` | White card backgrounds, nav pill backgrounds |
| Burnished Gold | `#FFD700` | Avatar backgrounds, special achievement accents |

**Color Rules:**
- **Never** use gradients — this is a flat, hard-edge system
- **Alarm Red** is for atmospheric poster text only; never for buttons or interactive elements
- **Electric Lime** is the sole primary action color — it means "do the thing"
- **Pitch Black** carries all structural weight: borders, shadows, text, black cards
- Hard shadows are always `Pitch Black` — no soft/blurred shadows

---

### 3. Typography Rules

| Role | Font | Weight | Size Range | Character |
|---|---|---|---|---|
| Display / Headlines | Archivo Black | 400 (Black is the only weight) | 48–120px | All-caps, tight letter-spacing (-0.04em), compressed line-height (0.75–0.9). Used for poster backgrounds and hero announcements. |
| Headings / Labels | Archivo Black | 400 | 16–42px | Uppercase, used for player names, button text, sticker labels, card footers |
| Body / Card Text | Inter | 700 | 22–28px | Card content text. Bold weight for readability at card scale. Tight line-height (1.2–1.3). |
| Captions / Metadata | Inter | 900 | 11–14px | Uppercase, wide letter-spacing (0.05em). Used for card footers ("Cards Against Silicon Valley"), status badges. |

**Hierarchy Strategy:** Size and weight establish hierarchy — not color. All text is either `#111111` or `#FFFFFF`. The only colored text is Alarm Red in poster backgrounds.

---

### 4. Component Stylings

#### Buttons (Pill-Shaped Actions)
- **Shape:** `border-radius: 9999px` (full pill), no visible border
- **Primary (Confirm/Play):** Background `#66FF00`, text `#111111`, font Archivo Black 18px uppercase
- **Secondary (Redraw/Alt):** Background `#FFB6C1`, text `#111111`
- **Disabled:** Same as primary but `opacity: 0.5`, `filter: grayscale(1)`, `cursor: not-allowed`
- **Hover:** `filter: brightness(0.9)`, slight scale `1.02`
- **Active:** `transform: scale(0.95)`

#### Navigation Pill Bar
- **Container:** Background white, `border-radius: 100px`, `padding: 8px`, `border: 4px solid #111111`
- **Shadow:** `box-shadow: 8px 12px 0px rgba(0,0,0,0.15)` — hard offset shadow
- **Position:** Fixed bottom center (`bottom: 40px`), `z-index: 100`

#### Cards
- **Dimensions:** 320×460px (large) or 280×400px (standard)
- **Border-radius:** 18px
- **Padding:** 28–32px horizontal, 24–28px vertical
- **Shadow:** `box-shadow: 15px 25px 45px rgba(0,0,0,0.25)`
- **Black Card:** Background `#111111`, text white, `border: 2px solid #333`
- **White Card:** Background white, text `#111111`, `border: 3px solid #111111`
- **Card Footer:** Archivo Black 11–13px, uppercase, `letter-spacing: 0.05em`, icon pair + "Cards Against Silicon Valley"
- **Hover:** `scale(1.03–1.05)`, `translateY(-10px)`, spring easing `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
- **Selected State:** `border-color: #66FF00`, `box-shadow: 0 0 0 6px #66FF00, ...`, lifted position
- **Blank (fill-in):** `display: inline-block`, `width: 100–120px`, `border-bottom: 3px solid white`

#### Sticker Badges
- **Shape:** Rectangular, no border-radius (or minimal 4px)
- **Border:** `2px solid #111111`
- **Shadow:** `box-shadow: 4px 4px 0px #111111` (hard, no blur)
- **Background:** Varies — Electric Lime, Bubblegum Pink, Alarm Red, or Pitch Black
- **Text:** Archivo Black 14–16px, uppercase
- **Often rotated** 3–15° for collage energy
- **Ticket variant:** SVG zigzag edges (top/bottom sawtooth path), dashed internal borders

#### Poster Background
- **Position:** Fixed, oversized (`120vw × 140vh`), offset (`top: -20%, left: -10%`)
- **Transform:** `rotate(-12deg)` — always diagonal
- **Opacity:** 0.4–0.9 (varies by screen importance)
- **Content:** 3–4 rows of repeated words in Archivo Black at `18vw` font-size
- **Two text styles:** Solid fill `#FF4242` alternating with outline-only (`-webkit-text-stroke: 3px #FF4242, color: transparent`)
- **Words change per screen:** "disrupt / synergy / pivot", "winner / unicorn / exit", "czar / judge / verdict", etc.

#### Player Cards (Lobby)
- **Size:** Grid items, `height: 240px`, `border-radius: 18px`
- **Border:** `3px solid #111111`
- **Shadow:** `box-shadow: 10px 10px 0px rgba(0,0,0,0.1)`
- **Slight rotation:** Alternating `-1.5deg` / `1.5deg`
- **Status indicator:** 12px green dot, top-right
- **Empty slot:** `border: 3px dashed #ccc`, transparent background, placeholder text

#### Leaderboard Rows
- **Border:** `4px solid #111111`
- **Shadow:** `box-shadow: 12px 12px 0px rgba(0,0,0,0.1)`
- **Leader row:** Background `#66FF00` instead of white
- **Hover:** `translate(-4px, -4px)` + shadow intensifies to `16px 16px 0px #111111`
- **Rank:** Archivo Black 24–32px
- **Points:** Archivo Black 32–48px + "PTS" suffix label

---

### 5. Layout Principles

- **Centered content** — Max-width 800–1400px, horizontally centered
- **Poster background fills the viewport** — acts as visual wallpaper behind all content
- **Fixed bottom navigation** — pill bar always accessible
- **Card arrangements:** Fan layout (overlapping, rotated cards) for hand views; grid layout for selection views
- **Z-index layering:** Background poster (0) → Content (10) → Stickers (20) → Navigation (100) → Toasts/Modals (200)
- **Whitespace:** Generous gaps between major sections (40–60px), tight internal padding on cards

---

### 6. Motion & Animation

- **Card hover:** Spring easing `cubic-bezier(0.175, 0.885, 0.32, 1.275)`, 0.2s duration
- **Card selection:** Scale up + translate up, green glow border appears
- **Button press:** Scale down to 0.95, then spring back
- **Winner reveal:** `bounceIn` keyframe (scale 0.3→1.05→0.9→1), 0.8s
- **Confetti:** CSS falling animation with staggered delays, rotating 720deg
- **Page transitions:** Fade opacity 0→1, 0.3s ease
- **Sticker badges:** Subtle bounce/pulse for emphasis on winner screens

---

### 7. Iconography

- **Card icon pair:** Two small rectangles (12×16px), one solid + one rotated 15° (outline or solid), represents the game's cards-in-hand motif
- **Appears in:** Card footers, nav buttons, branding
- **No external icon library** — all icons are inline SVG or CSS shapes
