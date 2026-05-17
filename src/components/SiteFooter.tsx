'use client'

export function SiteFooter() {
  return (
    <footer
      className="flex flex-col items-center gap-2 px-4 py-6"
      style={{ color: '#999' }}
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
          className="underline transition-colors hover:text-[#111]"
          style={{ color: '#888' }}
        >
          GitHub ↗
        </a>
        <span style={{ color: '#ccc' }}>•</span>
        <a
          href="https://github.com/Manaiakalani/Cards/issues/new?labels=new-deck&template=deck_submission.md&title=%5BDeck%5D+"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-[#111]"
          style={{ color: '#888' }}
        >
          Submit a Deck ↗
        </a>
        <span style={{ color: '#ccc' }}>•</span>
        <a
          href="https://github.com/Manaiakalani/Cards/pulls"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-[#111]"
          style={{ color: '#888' }}
        >
          Contribute ↗
        </a>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: '#bbb',
        }}
      >
        Open source — submit new card decks via GitHub Issues or PR
      </p>
    </footer>
  )
}
