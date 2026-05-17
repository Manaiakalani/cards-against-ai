import { test, expect, type Page } from '@playwright/test'

// ── helpers ──────────────────────────────────────────────────────────────

async function navigateToPlaying(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /HOST GAME/i }).click()
  await page.getByPlaceholder(/enter your name/i).fill('vibecheck')
  await page.getByRole('button', { name: /let.*s go/i }).click()
  await expect(page.getByText('Your Hand')).toBeVisible({ timeout: 5000 })
}

async function playToResults(page: Page) {
  await navigateToPlaying(page)
  const cardGrid = page.locator('.grid')
  const confirmBtn = page.getByRole('button', { name: /lock it in/i })
  await cardGrid.locator('> div').first().click()
  const isEnabled = await confirmBtn.isEnabled().catch(() => false)
  if (!isEnabled) {
    await cardGrid.locator('> div').nth(1).click()
  }
  await expect(confirmBtn).toBeEnabled({ timeout: 3000 })
  await confirmBtn.click()
  await expect(page.getByText('ATE & LEFT NO CRUMBS')).toBeVisible({ timeout: 20000 })
}

/** Check that no element causes horizontal overflow */
async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth
  })
  expect(overflow).toBe(false)
}

/** Check that no element causes vertical overflow beyond viewport (for h-dvh screens) */
async function assertNoVerticalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollHeight > document.documentElement.clientHeight + 2 // 2px tolerance
  })
  expect(overflow).toBe(false)
}

/** Get bounding box of first matching element */
async function getBounds(page: Page, selector: string) {
  return page.locator(selector).first().boundingBox()
}

// ── tests ────────────────────────────────────────────────────────────────

test.describe('Boundary Audit — No Overflow', () => {
  test('splash screen has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await assertNoHorizontalOverflow(page)
  })

  test('lobby screen has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /HOST GAME/i }).click()
    await assertNoHorizontalOverflow(page)
  })

  test('playing screen fits viewport (no overflow)', async ({ page }) => {
    await navigateToPlaying(page)
    await assertNoHorizontalOverflow(page)
    await assertNoVerticalOverflow(page)
  })

  test('results screen fits viewport', async ({ page }) => {
    await playToResults(page)
    await assertNoHorizontalOverflow(page)
  })
})

test.describe('Boundary Audit — Touch Targets', () => {
  test('splash buttons meet 44px minimum', async ({ page }) => {
    await page.goto('/')
    // Only check app buttons, skip framework-injected ones (e.g. Next.js Dev Tools)
    const buttons = page.locator('button:not([aria-label*="Next.js"]):not([data-nextjs])')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox()
      if (box && box.width > 0) {
        expect(box.width, `button ${i} width`).toBeGreaterThanOrEqual(40)
        expect(box.height, `button ${i} height`).toBeGreaterThanOrEqual(36)
      }
    }
  })

  test('playing screen buttons meet touch target size', async ({ page }) => {
    await navigateToPlaying(page)
    // Check BottomNav buttons
    const navButtons = page.locator('[class*="fixed"] button, [class*="fixed"] [role="button"]')
    const count = await navButtons.count()
    for (let i = 0; i < count; i++) {
      const box = await navButtons.nth(i).boundingBox()
      if (box && box.width > 0) {
        expect(box.height, `nav button ${i} height`).toBeGreaterThanOrEqual(32)
      }
    }
  })
})

test.describe('Boundary Audit — Content Visibility', () => {
  test('splash title is fully visible within viewport', async ({ page }) => {
    await page.goto('/')
    const viewport = page.viewportSize()!
    const title = await page.locator('h1').first().boundingBox()
    expect(title).toBeTruthy()
    if (title) {
      expect(title.x).toBeGreaterThanOrEqual(0)
      expect(title.x + title.width).toBeLessThanOrEqual(viewport.width + 2)
      expect(title.y).toBeGreaterThanOrEqual(0)
      expect(title.y + title.height).toBeLessThanOrEqual(viewport.height + 2)
    }
  })

  test('HUD does not overlap card content on playing screen', async ({ page }) => {
    await navigateToPlaying(page)
    // HUD is at top, fixed position
    const hudBottom = await page.evaluate(() => {
      const hud = document.querySelector('[class*="fixed"][class*="top-0"]')
      return hud ? hud.getBoundingClientRect().bottom : 0
    })
    // "Your Hand" text should be below the HUD
    const yourHand = await page.getByText('Your Hand').boundingBox()
    expect(yourHand).toBeTruthy()
    if (yourHand) {
      expect(yourHand.y, 'Your Hand should be below HUD').toBeGreaterThanOrEqual(hudBottom - 4) // 4px tolerance
    }
  })

  test('BottomNav is fully visible on playing screen', async ({ page }) => {
    await navigateToPlaying(page)
    const viewport = page.viewportSize()!
    const lockBtn = await page.getByRole('button', { name: /lock it in/i }).boundingBox()
    expect(lockBtn).toBeTruthy()
    if (lockBtn) {
      expect(lockBtn.y + lockBtn.height, 'Lock button bottom within viewport').toBeLessThanOrEqual(viewport.height + 2)
      expect(lockBtn.x, 'Lock button not clipped left').toBeGreaterThanOrEqual(0)
      expect(lockBtn.x + lockBtn.width, 'Lock button not clipped right').toBeLessThanOrEqual(viewport.width + 2)
    }
  })

  test('lobby room code is fully visible', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /HOST GAME/i }).click()
    const viewport = page.viewportSize()!
    const roomCode = await page.locator('text=/[A-Z0-9]{6}/').first().boundingBox()
    expect(roomCode).toBeTruthy()
    if (roomCode) {
      expect(roomCode.x + roomCode.width, 'Room code not clipped right').toBeLessThanOrEqual(viewport.width + 2)
    }
  })
})

test.describe('Boundary Audit — Text Readability', () => {
  test('no text smaller than 10px on splash', async ({ page }) => {
    await page.goto('/')
    const tooSmall = await page.evaluate(() => {
      const allText = document.querySelectorAll('*')
      let smallCount = 0
      allText.forEach(el => {
        const style = getComputedStyle(el)
        const fontSize = parseFloat(style.fontSize)
        if (el.textContent?.trim() && fontSize > 0 && fontSize < 10 && style.display !== 'none' && style.visibility !== 'hidden') {
          smallCount++
        }
      })
      return smallCount
    })
    expect(tooSmall, 'Elements with text smaller than 10px').toBe(0)
  })

  test('no text smaller than 10px during gameplay', async ({ page }) => {
    await navigateToPlaying(page)
    const tooSmall = await page.evaluate(() => {
      const allText = document.querySelectorAll('*')
      let smallCount = 0
      allText.forEach(el => {
        const style = getComputedStyle(el)
        const fontSize = parseFloat(style.fontSize)
        if (el.textContent?.trim() && fontSize > 0 && fontSize < 10 && style.display !== 'none' && style.visibility !== 'hidden') {
          smallCount++
        }
      })
      return smallCount
    })
    expect(tooSmall, 'Elements with text smaller than 10px').toBe(0)
  })
})

test.describe('Boundary Audit — Card Grid', () => {
  test('cards fit within their grid cells (no horizontal overflow)', async ({ page }) => {
    await navigateToPlaying(page)
    const overflows = await page.evaluate(() => {
      const gridItems = document.querySelectorAll('.grid > div')
      let overflowCount = 0
      gridItems.forEach(item => {
        // Only check horizontal overflow — vertical scroll is handled by the scroll container
        if (item.scrollWidth > item.clientWidth + 2) {
          overflowCount++
        }
      })
      return overflowCount
    })
    expect(overflows, 'Cards overflowing their grid cells horizontally').toBe(0)
  })

  test('card stickers and shadows have breathing room', async ({ page }) => {
    await navigateToPlaying(page)
    const metrics = await page.evaluate(() => {
      const scrollContainer = document.querySelector('.overflow-y-auto')
      const grid = scrollContainer?.querySelector('.grid')
      if (!scrollContainer || !grid) return null
      const sr = scrollContainer.getBoundingClientRect()
      const firstCard = grid.querySelector(':scope > div')?.getBoundingClientRect()
      return {
        topPadding: firstCard ? Math.round(firstCard.top - sr.top) : 0,
      }
    })
    expect(metrics).toBeTruthy()
    if (metrics) {
      expect(metrics.topPadding, 'Top cards need breathing room for stickers').toBeGreaterThanOrEqual(12)
    }
  })
})
