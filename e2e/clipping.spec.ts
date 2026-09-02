import { test, expect } from '@playwright/test'

test.describe('Top chrome is not clipped', () => {
  test('splash CARDS title sits fully below overlay buttons', async ({ page }) => {
    await page.goto('/')
    const title = page.getByRole('heading', { name: 'CARDS' })
    await expect(title).toBeVisible()

    const metrics = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const help = document.querySelector('button[aria-label="How to play"]')
      if (!h1 || !help) return null
      const t = h1.getBoundingClientRect()
      const b = help.getBoundingClientRect()
      const body = document.querySelector('.screen-body')
      return {
        titleTop: t.top,
        titleBottom: t.bottom,
        helpBottom: b.bottom,
        bodyScrollTop: body?.scrollTop ?? 0,
        canScrollUp: (body?.scrollTop ?? 0) > 1,
      }
    })

    expect(metrics).toBeTruthy()
    expect(metrics!.titleTop).toBeGreaterThanOrEqual(metrics!.helpBottom - 8)
    expect(metrics!.titleTop).toBeGreaterThanOrEqual(8)
    await page.screenshot({ path: 'test-results/screenshots/splash-clip-check.png', animations: 'disabled' })
  })

  test('playing HUD room code and avatars sit fully in the viewport', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /HOST GAME/i }).click()
    await page.getByPlaceholder(/enter your name/i).fill('clipcheck')
    await page.getByRole('button', { name: /let.*s go/i }).click()
    await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })

    const metrics = await page.evaluate(() => {
      const scores = document.querySelector('[aria-label="Player scores"]')
      const help = document.querySelector('button[aria-label="How to play"]')
      const room = document.querySelector('[aria-label="Player scores"]')
        ?.parentElement
      if (!scores || !help || !room) return null
      const s = scores.getBoundingClientRect()
      const row = room.getBoundingClientRect()
      return {
        rowTop: row.top,
        scoresTop: s.top,
        helpTop: help.getBoundingClientRect().top,
        viewportH: window.innerHeight,
      }
    })

    expect(metrics).toBeTruthy()
    expect(metrics!.rowTop).toBeGreaterThanOrEqual(0)
    expect(metrics!.scoresTop).toBeGreaterThanOrEqual(4)
    await page.screenshot({ path: 'test-results/screenshots/playing-clip-check.png', animations: 'disabled' })
  })

  test('solo bots button is gold and labeled', async ({ page }) => {
    await page.goto('/')
    const solo = page.getByRole('button', { name: /play solo with bots/i })
    if ((await solo.count()) === 0) {
      test.skip(true, 'Solo button only renders when multiplayer is configured')
      return
    }
    await expect(solo).toBeVisible()
    const bg = await solo.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bg).toMatch(/255,\s*215,\s*0/)
  })

  test('desktop splash cards can be drawn', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Floaters are desktop-only')
    await page.goto('/')
    const black = page.getByRole('button', { name: /draw a new black card/i })
    await expect(black).toBeVisible()
    await black.click()
    await expect(page.getByRole('button', { name: /draw a new black card/i })).toBeVisible()
  })
})
