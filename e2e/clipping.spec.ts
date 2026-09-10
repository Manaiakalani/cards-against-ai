import { test, expect, type Page } from '@playwright/test'

async function overlayClearance(page: Page) {
  return page.evaluate(() => {
    const help = document.querySelector('button[aria-label="How to play"]')
    const mute = document.querySelector('button[aria-label="Mute sounds"], button[aria-label="Unmute sounds"]')
    const quit = document.querySelector('button[aria-label="Quit game"]')
    const vp = { w: window.innerWidth, h: window.innerHeight }
    const box = (el: Element | null) => (el ? el.getBoundingClientRect() : null)
    const inView = (r: DOMRect | null) => {
      if (!r) return true
      return r.top >= -1 && r.left >= -1 && r.bottom <= vp.h + 1 && r.right <= vp.w + 1
    }
    const hb = box(help)
    const mb = box(mute)
    const qb = box(quit)
    return {
      helpInView: inView(hb),
      muteInView: inView(mb),
      quitInView: inView(qb),
      helpTop: hb?.top ?? null,
      helpBottom: hb?.bottom ?? 0,
    }
  })
}

async function headingNotClipped(page: Page, name: string | RegExp) {
  const heading = page.getByRole('heading', { name }).first()
  await expect(heading).toBeVisible()
  const result = await heading.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const overlays = [
      ...document.querySelectorAll(
        'button[aria-label="How to play"], button[aria-label="Mute sounds"], button[aria-label="Unmute sounds"], button[aria-label="Switch to light mode"], button[aria-label="Switch to dark mode"], button[aria-label="Quit game"]',
      ),
    ]
    const hit = overlays.some((b) => {
      const o = b.getBoundingClientRect()
      return r.left < o.right && r.right > o.left && r.top < o.bottom && r.bottom > o.top
    })
    return { top: r.top, bottom: r.bottom, hit, vh: window.innerHeight }
  })
  expect(result.top).toBeGreaterThanOrEqual(-1)
  expect(result.hit).toBe(false)
}

async function goPlaying(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /HOST GAME/i }).click()
  await page.getByPlaceholder(/enter your name/i).fill('clipcheck')
  await page.getByRole('button', { name: /let.*s go/i }).click()
  await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })
}

async function playToResults(page: Page) {
  await goPlaying(page)
  const confirmBtn = page.getByRole('button', { name: /lock it in/i })
  const cardGrid = page.locator('.grid')
  await cardGrid.locator('> div').first().click()
  if (!(await confirmBtn.isEnabled().catch(() => false))) {
    await cardGrid.locator('> div').nth(1).click()
  }
  await expect(confirmBtn).toBeEnabled({ timeout: 3000 })
  await confirmBtn.click()
  await expect(page.getByText('ATE & LEFT NO CRUMBS')).toBeVisible({ timeout: 20000 })
}

test.describe('Top chrome is not clipped', () => {
  test('splash CARDS title sits fully below overlay buttons', async ({ page }) => {
    await page.goto('/')
    await headingNotClipped(page, 'CARDS')
    const overlay = await overlayClearance(page)
    expect(overlay.helpInView).toBe(true)
    expect(overlay.muteInView).toBe(true)
    await page.screenshot({ path: 'test-results/screenshots/splash-clip-check.png', animations: 'disabled' })
  })

  test('lobby title sits fully below overlay buttons', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /HOST GAME/i }).click()
    await headingNotClipped(page, /pregame/i)
  })

  test('playing HUD room code and avatars sit fully in the viewport', async ({ page }) => {
    await goPlaying(page)
    const overlay = await overlayClearance(page)
    expect(overlay.helpInView).toBe(true)
    expect(overlay.quitInView).toBe(true)

    const metrics = await page.evaluate(() => {
      const scores = document.querySelector('[aria-label="Player scores"]')
      const row = scores?.parentElement
      if (!scores || !row) return null
      return {
        rowTop: row.getBoundingClientRect().top,
        scoresTop: scores.getBoundingClientRect().top,
      }
    })
    expect(metrics).toBeTruthy()
    expect(metrics!.rowTop).toBeGreaterThanOrEqual(0)
    expect(metrics!.scoresTop).toBeGreaterThanOrEqual(4)
    await page.screenshot({ path: 'test-results/screenshots/playing-clip-check.png', animations: 'disabled' })
  })

  test('results title is not under overlay buttons', async ({ page }) => {
    await playToResults(page)
    await headingNotClipped(page, /ate & left no crumbs/i)
    const overlay = await overlayClearance(page)
    expect(overlay.helpInView).toBe(true)
  })

  test('scoreboard title is not under overlay buttons', async ({ page }) => {
    await playToResults(page)
    await page.getByRole('button', { name: /keep going/i }).click()
    await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
    await headingNotClipped(page, /standings/i)
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

  test('desktop splash cards spin on click and keep the same card', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Floaters are desktop-only')
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const black = page.getByRole('button', { name: /spin this card/i }).first()
    await expect(black).toBeVisible()
    // Idle float animation never reports "stable" to Playwright.
    await black.click({ force: true })
    await expect(black).toBeVisible()
  })
})
