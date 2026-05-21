'use client'

import { Code2, Sparkles, GitPullRequestArrow } from 'lucide-react'

const links = [
  {
    href: 'https://github.com/Manaiakalani/Cards',
    label: 'GitHub',
    Icon: Code2,
    color: '#555',
    darkColor: '#E0E0E0',
    bg: 'rgba(85,85,85,0.08)',
    darkBg: 'rgba(224,224,224,0.1)',
  },
  {
    href: 'https://github.com/Manaiakalani/Cards/issues/new?labels=new-deck&template=deck_submission.md&title=%5BDeck%5D+',
    label: 'Submit a Deck',
    Icon: Sparkles,
    color: '#9B2C2C',
    darkColor: '#FF6B6B',
    bg: 'rgba(155,44,44,0.06)',
    darkBg: 'rgba(255,107,107,0.12)',
  },
  {
    href: 'https://github.com/Manaiakalani/Cards/pulls',
    label: 'Contribute',
    Icon: GitPullRequestArrow,
    color: '#166534',
    darkColor: '#66FF00',
    bg: 'rgba(22,101,52,0.06)',
    darkBg: 'rgba(102,255,0,0.12)',
  },
] as const

export function SiteFooter() {
  return (
    <footer
      className="flex flex-col items-center gap-3 px-4 py-6"
      style={{
        backgroundColor: 'var(--theme-backdrop)',
        borderRadius: 12,
      }}
    >
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {links.map(({ href, label, Icon, color, darkColor, bg, darkBg }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium no-underline transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              fontFamily: 'var(--font-inter)',
              backgroundColor: `var(--_footer-bg, ${bg})`,
              color: `var(--_footer-fg, ${color})`,
              border: `1.5px solid color-mix(in srgb, var(--_footer-fg, ${color}) 20%, transparent)`,
              // CSS custom props for dark mode override
              ['--_footer-bg-light' as string]: bg,
              ['--_footer-bg-dark' as string]: darkBg,
              ['--_footer-fg-light' as string]: color,
              ['--_footer-fg-dark' as string]: darkColor,
            }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--theme-text-muted)',
        }}
      >
        Open source — submit new card decks via GitHub Issues or PR
      </p>
    </footer>
  )
}
