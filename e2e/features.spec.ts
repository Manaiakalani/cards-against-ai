import { test, expect } from '@playwright/test'

// ── helpers ──────────────────────────────────────────────────────────────

async function goToLobby(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /HOST GAME/i }).click()
  await expect(page.getByText('THE PREGAME')).toBeVisible()
}

// ── Splash screen: Stats & Achievements ──────────────────────────────────

test.describe('Splash — Stats & Achievements buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'CARDS' })).toBeVisible()
  })

  test('Stats and Achievements buttons are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Stats/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Achievements/i })).toBeVisible()
  })

  test('clicking Stats opens the stats modal', async ({ page }) => {
    await page.getByRole('button', { name: /Stats/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('YOUR STATS')).toBeVisible()
  })

  test('clicking Achievements opens the achievements modal', async ({ page }) => {
    await page.getByRole('button', { name: /Achievements/i }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Achievements' })).toBeVisible()
  })
})

// ── Global overlay: Sound mute & Dark mode toggles ───────────────────────

test.describe('Global overlay controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'CARDS' })).toBeVisible()
  })

  test('sound mute toggle is visible', async ({ page }) => {
    const muteBtn = page.getByRole('button', { name: /mute sounds|unmute sounds/i })
    await expect(muteBtn).toBeVisible()
  })

  test('theme toggle is visible', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /switch to/i })
    await expect(themeBtn).toBeVisible()
  })
})

// ── Lobby: Deck selector ─────────────────────────────────────────────────

test.describe('Lobby — Deck selector', () => {
  test.beforeEach(async ({ page }) => {
    await goToLobby(page)
  })

  test('deck selector section is visible with at least one deck toggle', async ({ page }) => {
    await expect(page.getByText('DECKS')).toBeVisible()
    // Each deck is a button inside the deck grid
    const deckButtons = page.locator('.grid.grid-cols-2 button')
    await expect(deckButtons.first()).toBeVisible()
    expect(await deckButtons.count()).toBeGreaterThanOrEqual(1)
  })

  test('can toggle a deck off and back on', async ({ page }) => {
    // The deck grid: second grid on the page (first is player grid)
    const deckButtons = page.locator('.grid.grid-cols-2 button')
    const firstDeck = deckButtons.first()

    // Initially selected — has solid border (opacity 1)
    await expect(firstDeck).toBeVisible()

    // Toggle off
    await firstDeck.click()
    // Toggle back on
    await firstDeck.click()
    // Should still be visible — no crash
    await expect(firstDeck).toBeVisible()
  })
})

// ── Lobby: Timer toggle ──────────────────────────────────────────────────

test.describe('Lobby — Timer toggle', () => {
  test.beforeEach(async ({ page }) => {
    await goToLobby(page)
  })

  test('timer toggle is visible', async ({ page }) => {
    await expect(page.getByText('⏱️ Round Timer')).toBeVisible()
    // The OFF/ON button next to it
    const timerBtn = page.getByRole('button', { name: /^OFF$|^ON$/i }).first()
    await expect(timerBtn).toBeVisible()
  })

  test('can toggle timer on and off', async ({ page }) => {
    // Find the timer toggle — it's the first OFF button near "Round Timer"
    const timerSection = page.locator('text=⏱️ Round Timer').locator('..')
    const timerBtn = timerSection.getByRole('button', { name: /^OFF$|^ON$/i })

    // Initially OFF
    await expect(timerBtn).toHaveText('OFF')

    // Toggle ON
    await timerBtn.click()
    await expect(timerBtn).toHaveText('ON')

    // Timer options should appear (30s, 60s, 90s)
    await expect(page.getByRole('button', { name: '30s' })).toBeVisible()
    await expect(page.getByRole('button', { name: '60s' })).toBeVisible()
    await expect(page.getByRole('button', { name: '90s' })).toBeVisible()

    // Toggle back OFF
    await timerBtn.click()
    await expect(timerBtn).toHaveText('OFF')
  })
})

// ── Lobby: House rules ──────────────────────────────────────────────────

test.describe('Lobby — House rules', () => {
  test.beforeEach(async ({ page }) => {
    await goToLobby(page)
  })

  test('house rules section is visible with both options', async ({ page }) => {
    await expect(page.getByText('HOUSE RULES')).toBeVisible()
    await expect(page.getByText(/Winner.*s Pick/)).toBeVisible()
    await expect(page.getByText(/Reboot the Universe/)).toBeVisible()
  })

  test('Winner\'s Pick toggle switches between ON/OFF', async ({ page }) => {
    const winnersSection = page.getByText(/Winner.*s Pick/).locator('..').locator('..')
    const toggleBtn = winnersSection.getByRole('button', { name: /^OFF$|^ON$/i })

    await expect(toggleBtn).toHaveText('OFF')
    await toggleBtn.click()
    await expect(toggleBtn).toHaveText('ON')
    await toggleBtn.click()
    await expect(toggleBtn).toHaveText('OFF')
  })

  test('Reboot the Universe toggle switches between ON/OFF', async ({ page }) => {
    const rebootSection = page.getByText(/Reboot the Universe/).locator('..').locator('..')
    const toggleBtn = rebootSection.getByRole('button', { name: /^OFF$|^ON$/i })

    await expect(toggleBtn).toHaveText('OFF')
    await toggleBtn.click()
    await expect(toggleBtn).toHaveText('ON')
    await toggleBtn.click()
    await expect(toggleBtn).toHaveText('OFF')
  })
})
