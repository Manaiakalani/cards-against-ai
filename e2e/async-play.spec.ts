import { test, expect } from '@playwright/test'

test.describe('Async play UI', () => {
  test('solo splash does not show async host without supabase', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /HOST GAME/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /PLAY ASYNC/i })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /JOIN GAME/i })).toHaveCount(0)
  })

  test('help modal mentions async tables and live card counts', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'How to play' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('Async tables')).toBeVisible()
    await expect(dialog.getByText(/cards • \d+ decks/i)).toBeVisible()
  })

  test('InTuneD deck is listed in the lobby', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /HOST GAME/i }).click()
    await expect(page.getByRole('button', { name: /InTuneD/i })).toBeVisible()
  })

  test('splash has a skip link and version badge', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /skip to game/i })).toBeAttached()
    await expect(page.getByText('v1.1')).toBeVisible()
  })

  test('help mentions YOUR TURN on the home list', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'How to play' }).click()
    await expect(page.getByRole('dialog').getByText(/YOUR TURN/)).toBeVisible()
  })

  test('help menu has GitHub, submit, privacy, and license at the bottom', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'How to play' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('link', { name: /github/i })).toBeVisible()
    await expect(dialog.getByRole('link', { name: /submit a deck/i })).toBeVisible()
    await dialog.getByRole('button', { name: /^privacy$/i }).click()
    await expect(dialog.getByRole('heading', { name: 'Privacy' })).toBeVisible()
    await expect(dialog.getByText(/rybbit/i)).toBeVisible()
    await dialog.getByRole('button', { name: /^license$/i }).click()
    await expect(dialog.getByRole('heading', { name: 'License' })).toBeVisible()
    await expect(dialog.getByText(/MIT License/i)).toBeVisible()
    await expect(dialog.getByRole('link', { name: /full license on github/i })).toBeVisible()
  })
})
