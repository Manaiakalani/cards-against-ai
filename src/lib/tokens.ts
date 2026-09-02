/** Design-system colors from design.md. Ink-on-accent is always #111. */
export const COLOR = {
  cream: '#F4F4EE',
  lime: '#66FF00',
  pink: '#FFB6C1',
  red: '#FF4242',
  danger: '#C62828',
  gold: '#FFD700',
  ink: '#111111',
  white: '#FFFFFF',
} as const

export const GITHUB_REPO = 'https://github.com/Manaiakalani/cards-against-ai'
export const SITE_URL = 'https://manaiakalani.github.io/cards-against-ai/'
export const SITE_VERSION = 'v1.1'

export const SITE_LINKS = [
  {
    href: GITHUB_REPO,
    label: 'GitHub',
    color: '#555',
    darkColor: '#E0E0E0',
    bg: 'rgba(85,85,85,0.12)',
    darkBg: 'rgba(224,224,224,0.15)',
  },
  {
    href: `${GITHUB_REPO}/issues/new`,
    label: 'Submit a Deck',
    color: '#9B2C2C',
    darkColor: '#FF6B6B',
    bg: 'rgba(155,44,44,0.08)',
    darkBg: 'rgba(255,107,107,0.15)',
  },
  {
    href: `${GITHUB_REPO}/pulls`,
    label: 'Contribute',
    color: '#166534',
    darkColor: '#66FF00',
    bg: 'rgba(22,101,52,0.08)',
    darkBg: 'rgba(102,255,0,0.15)',
  },
] as const
