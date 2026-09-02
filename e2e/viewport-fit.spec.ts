import { test, expect } from '@playwright/test'

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '390x667', width: 390, height: 667 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1440x900', width: 1440, height: 900 },
]

function inViewport(
  box: { x: number; y: number; width: number; height: number } | null,
  vp: { width: number; height: number },
) {
  expect(box).toBeTruthy()
  expect(box!.y).toBeGreaterThanOrEqual(-1)
  expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 2)
  expect(box!.x).toBeGreaterThanOrEqual(-1)
  expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 2)
}

for (const vp of VIEWPORTS) {
  test.describe(`Viewport fit ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('splash HOST GAME is on screen without scrolling', async ({ page }) => {
      await page.goto('/')
      const btn = page.getByRole('button', { name: /HOST GAME/i })
      await expect(btn).toBeVisible()
      inViewport(await btn.boundingBox(), vp)
      const title = await page.getByRole('heading', { name: 'CARDS' }).boundingBox()
      expect(title).toBeTruthy()
      expect(title!.y).toBeGreaterThanOrEqual(-1)
    })

    test('lobby LET\'S GO stays pinned in the viewport', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: /HOST GAME/i }).click()
      const go = page.getByRole('button', { name: /let.*s go/i })
      await expect(go).toBeVisible()
      inViewport(await go.boundingBox(), vp)
      const title = await page.getByRole('heading', { name: /pregame/i }).boundingBox()
      expect(title).toBeTruthy()
      expect(title!.y).toBeGreaterThanOrEqual(-1)
    })
  })
}
