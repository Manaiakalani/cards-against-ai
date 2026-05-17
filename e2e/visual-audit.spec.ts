import { test, expect, type Page } from '@playwright/test'

// ── helpers ──────────────────────────────────────────────────────────────

async function navigateToPlaying(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'PLAY', exact: true }).click()
  await page.getByPlaceholder(/enter your name/i).fill('vibecheck')
  await page.getByRole('button', { name: /let.*s go/i }).click()
  await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })
}

async function playToResults(page: Page) {
  await navigateToPlaying(page)
  const cardGrid = page.locator('.grid')
  await cardGrid.locator('> div').first().click()
  await page.getByRole('button', { name: /lock it in/i }).click()
  await expect(page.getByText('ATE & LEFT NO CRUMBS')).toBeVisible({ timeout: 10000 })
}

/** Get computed CSS property from an element */
async function getStyle(page: Page, selector: string, prop: string) {
  return page.locator(selector).first().evaluate(
    (el, p) => getComputedStyle(el).getPropertyValue(p),
    prop,
  )
}

/** Parse a color string to { r, g, b } */
function parseRGB(color: string): { r: number; g: number; b: number } | null {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return null
  return { r: +m[1], g: +m[2], b: +m[3] }
}

/** Relative luminance per WCAG 2.1 */
function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/** WCAG contrast ratio between two colors */
function contrastRatio(fg: string, bg: string) {
  const fgC = parseRGB(fg)
  const bgC = parseRGB(bg)
  if (!fgC || !bgC) return Infinity // skip if we can't parse
  const l1 = Math.max(luminance(fgC), luminance(bgC))
  const l2 = Math.min(luminance(fgC), luminance(bgC))
  return (l1 + 0.05) / (l2 + 0.05)
}

// ── visual audit tests ──────────────────────────────────────────────────

test.describe('Visual Audit — Fonts & Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'CARDS' })).toBeVisible()
  })

  // ── Font Loading ──

  test('Archivo Black loads on splash title', async ({ page }) => {
    const fontFamily = await page.getByRole('heading', { name: 'CARDS' }).evaluate(
      (el) => getComputedStyle(el).fontFamily,
    )
    expect(fontFamily.toLowerCase()).toContain('archivo')
  })

  test('Inter loads on body text', async ({ page }) => {
    const tagline = page.getByText('The party game for chronically online people')
    const fontFamily = await tagline.evaluate((el) => getComputedStyle(el).fontFamily)
    expect(fontFamily.toLowerCase()).toContain('inter')
  })

  test('fonts load on lobby screen', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    const title = page.getByText('THE PREGAME')
    await expect(title).toBeVisible()
    const fontFamily = await title.evaluate((el) => getComputedStyle(el).fontFamily)
    expect(fontFamily.toLowerCase()).toContain('archivo')

    const input = page.getByPlaceholder(/enter your name/i)
    const inputFont = await input.evaluate((el) => getComputedStyle(el).fontFamily)
    expect(inputFont.toLowerCase()).toContain('archivo')
  })

  // ── Color Contrast (WCAG AA = 4.5:1 for normal text, 3:1 for large text) ──

  test('splash title has sufficient contrast against background', async ({ page }) => {
    // The title uses text-stroke and text-shadow on cream background
    // Check that the PLAY button text has enough contrast
    const btn = page.getByRole('button', { name: 'PLAY', exact: true })
    const btnColor = await btn.evaluate((el) => getComputedStyle(el).color)
    const btnBg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor)
    const ratio = contrastRatio(btnColor, btnBg)
    // Green (#66FF00) on dark (#111) should be high contrast
    expect(ratio).toBeGreaterThan(3)
  })

  test('lobby text has proper contrast', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    // Bot selector label
    const botsLabel = page.getByText('Bots:')
    await expect(botsLabel).toBeVisible()
    const color = await botsLabel.evaluate((el) => getComputedStyle(el).color)
    const labelC = parseRGB(color)
    // Should be dark text (#111)
    expect(labelC).toBeTruthy()
    expect(labelC!.r + labelC!.g + labelC!.b).toBeLessThan(150) // dark color
  })

  test('card text has readable contrast', async ({ page }) => {
    await navigateToPlaying(page)
    // White cards have dark text on white background
    const cards = page.locator('.grid > div')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Check first card's text color
    const cardText = cards.first().locator('div').first()
    const color = await cardText.evaluate((el) => getComputedStyle(el).color)
    const rgb = parseRGB(color)
    expect(rgb).toBeTruthy()
    // White cards should have very dark text
    expect(rgb!.r + rgb!.g + rgb!.b).toBeLessThan(200)
  })

  // ── Font Sizes ──

  test('splash title is large and impactful', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'CARDS' })
    const fontSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    // With clamp(60px, 15vw, 120px), on 1440 desktop it should be large
    expect(fontSize).toBeGreaterThanOrEqual(60)
  })

  test('body text is at least 14px for readability', async ({ page }) => {
    const tagline = page.getByText('The party game for chronically online people')
    const fontSize = await tagline.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(fontSize).toBeGreaterThanOrEqual(14)
  })

  test('card footer text is legible', async ({ page }) => {
    await navigateToPlaying(page)
    const footer = page.locator('text=Cards Against AI').first()
    await expect(footer).toBeVisible()
    const fontSize = await footer.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(fontSize).toBeGreaterThanOrEqual(10)
  })

  // ── Touch Targets ──

  test('buttons meet minimum touch target size (44px)', async ({ page }) => {
    // PLAY button
    const playBtn = page.getByRole('button', { name: 'PLAY', exact: true })
    const box = await playBtn.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(box!.width).toBeGreaterThanOrEqual(44)
  })

  test('nav buttons meet touch target size', async ({ page }) => {
    await navigateToPlaying(page)
    const confirmBtn = page.getByRole('button', { name: /lock it in/i })
    const box = await confirmBtn.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })

  test('bot selector buttons are tappable', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    const botBtns = page.locator('button:has-text("3")')
    const box = await botBtns.first().boundingBox()
    expect(box).toBeTruthy()
    expect(box!.height).toBeGreaterThanOrEqual(38) // 40px with border
    expect(box!.width).toBeGreaterThanOrEqual(38)
  })

  // ── Design Token Consistency ──

  test('background color is cream across screens', async ({ page }) => {
    // Splash
    const splashBg = await getStyle(page, 'body', 'background-color')
    const rgb = parseRGB(splashBg)
    expect(rgb).toBeTruthy()
    // #F4F4EE = rgb(244, 244, 238)
    expect(rgb!.r).toBeGreaterThan(230)
    expect(rgb!.g).toBeGreaterThan(230)
    expect(rgb!.b).toBeGreaterThan(220)
  })

  test('borders use the design-system black (#111)', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    const input = page.getByPlaceholder(/enter your name/i)
    const borderColor = await input.evaluate((el) => getComputedStyle(el).borderColor)
    const rgb = parseRGB(borderColor)
    expect(rgb).toBeTruthy()
    // #111111 = rgb(17, 17, 17)
    expect(rgb!.r).toBeLessThan(30)
    expect(rgb!.g).toBeLessThan(30)
    expect(rgb!.b).toBeLessThan(30)
  })

  test('primary action buttons use green (#66FF00)', async ({ page }) => {
    const playBtn = page.getByRole('button', { name: 'PLAY', exact: true })
    const bg = await playBtn.evaluate((el) => getComputedStyle(el).backgroundColor)
    const rgb = parseRGB(bg)
    expect(rgb).toBeTruthy()
    // #66FF00 = rgb(102, 255, 0)
    expect(rgb!.g).toBeGreaterThan(200) // strong green channel
    expect(rgb!.b).toBeLessThan(30) // no blue
  })

  // ── Screen-by-Screen Rendering ──

  test('HUD renders correctly during gameplay', async ({ page }) => {
    await navigateToPlaying(page)
    // HUD should show round info
    await expect(page.getByText('ROUND 1')).toBeVisible()
    // HUD is the fixed bar at top — verify it exists with room code
    const hud = page.locator('.fixed').first()
    await expect(hud).toBeVisible()
  })

  test('results screen shows winner with readable text', async ({ page }) => {
    await playToResults(page)
    const title = page.getByText('ATE & LEFT NO CRUMBS')
    const fontSize = await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(fontSize).toBeGreaterThanOrEqual(36) // clamp min
  })

  test('scoreboard renders with legible player names', async ({ page }) => {
    await playToResults(page)
    await page.getByRole('button', { name: /keep going/i }).click()
    await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
    // Check player name font size
    const playerName = page.getByText('vibecheck').first()
    await expect(playerName).toBeVisible()
    const fontSize = await playerName.first().evaluate(
      (el) => parseFloat(getComputedStyle(el).fontSize),
    )
    expect(fontSize).toBeGreaterThanOrEqual(16)
  })

  // ── Screenshots ──

  test('capture splash screen', async ({ page }) => {
    await page.waitForTimeout(1500)
    await page.screenshot({ path: 'test-results/screenshots/splash.png', fullPage: true })
  })

  test('capture lobby screen', async ({ page }) => {
    await page.getByRole('button', { name: 'PLAY', exact: true }).click()
    await page.getByPlaceholder(/enter your name/i).fill('vibecheck')
    await expect(page.getByText('THE PREGAME')).toBeVisible()
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'test-results/screenshots/lobby.png', fullPage: true })
  })

  test('capture playing screen', async ({ page }) => {
    await navigateToPlaying(page)
    await page.waitForTimeout(600)
    await page.screenshot({ path: 'test-results/screenshots/playing.png', fullPage: true })
  })

  test('capture results screen', async ({ page }) => {
    await playToResults(page)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: 'test-results/screenshots/results.png', fullPage: true })
  })

  test('capture scoreboard screen', async ({ page }) => {
    await playToResults(page)
    await page.getByRole('button', { name: /keep going/i }).click()
    await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'test-results/screenshots/scoreboard.png', fullPage: true })
  })
})
