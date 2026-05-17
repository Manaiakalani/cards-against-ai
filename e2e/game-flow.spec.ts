import { test, expect } from '@playwright/test'

test.describe('Cards Against AI — Full Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Should land on splash screen
    await expect(page.getByRole('heading', { name: 'CARDS' })).toBeVisible()
  })

  test('splash screen renders with title and play button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AI' })).toBeVisible()
    await expect(page.getByText('The party game for chronically online people')).toBeVisible()
    await expect(page.getByRole('button', { name: 'PLAY', exact: true })).toBeVisible()
  })

  test('navigates from splash to lobby', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    await expect(page.getByText('THE PREGAME')).toBeVisible()
    await expect(page.getByPlaceholder(/enter your name/i)).toBeVisible()
  })

  test('lobby shows room code and bot selector', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    await expect(page.getByText('Room Code')).toBeVisible()
    await expect(page.getByText('Bots:')).toBeVisible()
  })

  test('cannot start game without entering name', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    const startBtn = page.getByRole('button', { name: /let.*s go/i })
    await expect(startBtn).toBeDisabled()
  })

  test('full game flow: lobby → play → judge → results → scoreboard', async ({ page }) => {
    // Navigate to lobby
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()

    // Enter name and start
    await page.getByPlaceholder(/enter your name/i).fill('TestPlayer')
    const startBtn = page.getByRole('button', { name: /let.*s go/i })
    await expect(startBtn).toBeEnabled()
    await startBtn.click()

    // Should be in playing phase
    await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/cards remaining|pick \d+ cards/i)).toBeVisible()

    // Should see the HUD with round info
    await expect(page.getByText('ROUND 1')).toBeVisible()

    // Click on the first card in the grid
    const confirmBtn = page.getByRole('button', { name: /lock it in/i })
    await expect(confirmBtn).toBeDisabled()

    const cardGrid = page.locator('.grid')
    await cardGrid.locator('> div').first().click()

    // If button is still disabled, this is a Pick-2 card — select another
    const isEnabled = await confirmBtn.isEnabled().catch(() => false)
    if (!isEnabled) {
      await cardGrid.locator('> div').nth(1).click()
    }

    // Confirm should now be enabled
    await expect(confirmBtn).toBeEnabled({ timeout: 3000 })
    await confirmBtn.click()

    // Should show "Card Submitted!" then transition to judging
    await expect(page.getByText(/submitted/i)).toBeVisible({ timeout: 3000 })

    // Bot czar should auto-judge — wait for results screen (includes reveal phase)
    await expect(page.getByText('ATE & LEFT NO CRUMBS')).toBeVisible({ timeout: 20000 })

    // Click keep going
    await page.getByRole('button', { name: /keep going/i }).click()

    // Should show scoreboard
    await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/after round 1/i)).toBeVisible()

    // Continue to next round
    await page.getByRole('button', { name: /keep going/i }).click()

    // Should be back in playing for round 2
    await expect(page.getByText('ROUND 2')).toBeVisible({ timeout: 5000 })
  })

  test('redraw hand works and is limited to once per round', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    await page.getByPlaceholder(/enter your name/i).fill('TestPlayer')
    await page.getByRole('button', { name: /let.*s go/i }).click()
    await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })

    // Redraw button should be enabled
    const redrawBtn = page.getByRole('button', { name: /new hand/i })
    await expect(redrawBtn).toBeEnabled()
    await redrawBtn.click()

    // After redraw, button should show "DEALT" and be disabled
    await expect(page.getByRole('button', { name: /dealt/i })).toBeDisabled({ timeout: 2000 })
  })
})
