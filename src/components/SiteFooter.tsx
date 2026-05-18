'use client'

import { Code2, MessageSquarePlus, GitPullRequestArrow } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer
      className="flex flex-col items-center gap-2 px-4 py-6"
      style={{
        backgroundColor: 'var(--theme-backdrop)',
        borderRadius: 12,
      }}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center"
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
        }}
      >
        <a
          href="https://github.com/Manaiakalani/Cards"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline transition-colors hover:text-[var(--theme-text)]"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          <Code2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          GitHub ↗
        </a>
        <span style={{ color: 'var(--theme-text-muted)' }}>•</span>
        <a
          href="https://github.com/Manaiakalani/Cards/issues/new?labels=new-deck&template=deck_submission.md&title=%5BDeck%5D+"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline transition-colors hover:text-[var(--theme-text)]"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Submit a Deck ↗
        </a>
        <span style={{ color: 'var(--theme-text-muted)' }}>•</span>
        <a
          href="https://github.com/Manaiakalani/Cards/pulls"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline transition-colors hover:text-[var(--theme-text)]"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          <GitPullRequestArrow className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Contribute ↗
        </a>
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
