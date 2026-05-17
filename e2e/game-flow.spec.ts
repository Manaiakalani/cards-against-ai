import { test, expect } from '@playwright/test'

test.describe('Cards Against Silicon Valley — Full Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Should land on splash screen
    await expect(page.getByRole('heading', { name: 'CARDS' })).toBeVisible()
  })

  test('splash screen renders with title and play button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SILICON VALLEY' })).toBeVisible()
    await expect(page.getByText('The party game for horrible tech people')).toBeVisible()
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible()
  })

  test('navigates from splash to lobby', async ({ page }) => {
    await page.getByRole('button', { name: /play/i }).click()
    await expect(page.getByText('THE BOARDROOM')).toBeVisible()
    await expect(page.getByPlaceholder(/enter your name/i)).toBeVisible()
  })

  test('lobby shows room code and bot selector', async ({ page }) => {
    await page.getByRole('button', { name: /play/i }).click()
    await expect(page.getByText('Room Code')).toBeVisible()
    await expect(page.getByText('Bots:')).toBeVisible()
  })

  test('cannot start game without entering name', async ({ page }) => {
    await page.getByRole('button', { name: /play/i }).click()
    const startBtn = page.getByRole('button', { name: /start game/i })
    await expect(startBtn).toBeDisabled()
  })

  test('full game flow: lobby → play → judge → results → scoreboard', async ({ page }) => {
    // Navigate to lobby
    await page.getByRole('button', { name: /play/i }).click()

    // Enter name and start
    await page.getByPlaceholder(/enter your name/i).fill('TestPlayer')
    const startBtn = page.getByRole('button', { name: /start game/i })
    await expect(startBtn).toBeEnabled()
    await startBtn.click()

    // Should be in playing phase
    await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/cards remaining/i)).toBeVisible()

    // Should see the HUD with round info
    await expect(page.getByText('ROUND 1')).toBeVisible()

    // Click on the first card in the grid
    const confirmBtn = page.getByRole('button', { name: /confirm selection/i })
    await expect(confirmBtn).toBeDisabled()

    const cardGrid = page.locator('.grid')
    const firstCard = cardGrid.locator('> div').first()
    await firstCard.click()

    // Confirm should now be enabled
    await expect(confirmBtn).toBeEnabled({ timeout: 2000 })
    await confirmBtn.click()

    // Should show "Card Submitted!" then transition to judging
    await expect(page.getByText(/submitted/i)).toBeVisible({ timeout: 3000 })

    // Bot czar should auto-judge — wait for results screen
    await expect(page.getByText('WINNER REVEALED')).toBeVisible({ timeout: 10000 })

    // Click next round
    await page.getByRole('button', { name: /next round/i }).click()

    // Should show scoreboard
    await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/after round 1/i)).toBeVisible()

    // Continue to next round
    await page.getByRole('button', { name: /next round/i }).click()

    // Should be back in playing for round 2
    await expect(page.getByText('ROUND 2')).toBeVisible({ timeout: 5000 })
  })

  test('redraw hand works and is limited to once per round', async ({ page }) => {
    await page.getByRole('button', { name: /play/i }).click()
    await page.getByPlaceholder(/enter your name/i).fill('TestPlayer')
    await page.getByRole('button', { name: /start game/i }).click()
    await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })

    // Redraw button should be enabled
    const redrawBtn = page.getByRole('button', { name: /redraw hand/i })
    await expect(redrawBtn).toBeEnabled()
    await redrawBtn.click()

    // After redraw, button should show "REDRAWN" and be disabled
    await expect(page.getByRole('button', { name: /redrawn/i })).toBeDisabled({ timeout: 2000 })
  })
})
