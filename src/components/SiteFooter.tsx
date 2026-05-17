'use client'

import { Code2, MessageSquarePlus, GitPullRequestArrow } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer
      className="flex flex-col items-center gap-2 px-4 py-6"
      style={{
        backgroundColor: 'rgba(244, 244, 238, 0.9)',
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
          className="inline-flex items-center gap-1.5 underline transition-colors hover:text-[#111]"
          style={{ color: '#444' }}
        >
          <Code2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          GitHub ↗
        </a>
        <span style={{ color: '#999' }}>•</span>
        <a
          href="https://github.com/Manaiakalani/Cards/issues/new?labels=new-deck&template=deck_submission.md&title=%5BDeck%5D+"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline transition-colors hover:text-[#111]"
          style={{ color: '#444' }}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Submit a Deck ↗
        </a>
        <span style={{ color: '#999' }}>•</span>
        <a
          href="https://github.com/Manaiakalani/Cards/pulls"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline transition-colors hover:text-[#111]"
          style={{ color: '#444' }}
        >
          <GitPullRequestArrow className="h-3.5 w-3.5" strokeWidth={1.75} />
          Contribute ↗
        </a>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: '#777',
        }}
      >
        Open source — submit new card decks via GitHub Issues or PR
      </p>
    </footer>
  )
}
