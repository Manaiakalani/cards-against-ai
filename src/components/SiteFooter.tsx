'use client'

import { Code2, Sparkles, GitPullRequestArrow } from 'lucide-react'
import { SITE_LINKS } from '@/lib/tokens'

const icons = {
  GitHub: Code2,
  'Submit a Deck': Sparkles,
  Contribute: GitPullRequestArrow,
} as const

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
        {SITE_LINKS.map(({ href, label, color, darkColor, bg, darkBg }) => {
          const Icon = icons[label]
          return (
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
              ['--_footer-bg-light' as string]: bg,
              ['--_footer-bg-dark' as string]: darkBg,
              ['--_footer-fg-light' as string]: color,
              ['--_footer-fg-dark' as string]: darkColor,
            }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            {label}
          </a>
          )
        })}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--theme-text-muted)',
        }}
      >
        Open source - submit new card decks via GitHub Issues or PR
      </p>
    </footer>
  )
}
