import { expect, type Page } from '@playwright/test'

export async function assertCenteredDialog(
  page: Page,
  dialogName: string | RegExp,
  closeName: string,
  shot?: string,
) {
  const dialog = page.getByRole('dialog', { name: dialogName })
  await expect(dialog).toBeVisible()
  const close = page.getByRole('button', { name: closeName })
  await expect(close).toBeVisible()
  await expect.poll(async () => (await close.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(40)

  const metrics = await page.evaluate((name) => {
    const el = document.querySelector('[role="dialog"][aria-labelledby], [role="dialog"][aria-label]')
    const btn = document.querySelector(`button[aria-label="${name}"]`)
    if (!el || !btn) return null
    const d = el.getBoundingClientRect()
    const c = btn.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const hit = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2)
    return {
      vw,
      vh,
      x: d.x,
      y: d.y,
      w: d.width,
      h: d.height,
      rightGap: vw - d.right,
      bottomGap: vh - d.bottom,
      hCenterOff: Math.abs(d.left - (vw - d.right)),
      vCenterOff: Math.abs(d.top - (vh - d.bottom)),
      closeTop: c.top,
      closeRight: c.right,
      closeOnTop: Boolean(hit && (btn === hit || btn.contains(hit))),
    }
  }, closeName)

  expect(metrics, 'dialog metrics').toBeTruthy()
  const minGap = metrics!.vh < 500 ? 4 : 8
  expect(metrics!.x).toBeGreaterThanOrEqual(minGap)
  expect(metrics!.y).toBeGreaterThanOrEqual(minGap)
  expect(metrics!.rightGap).toBeGreaterThanOrEqual(minGap)
  expect(metrics!.bottomGap).toBeGreaterThanOrEqual(minGap)
  expect(metrics!.hCenterOff).toBeLessThan(16)
  expect(metrics!.vCenterOff).toBeLessThan(metrics!.vh < 500 ? 32 : 24)
  expect(metrics!.closeTop).toBeGreaterThanOrEqual(minGap)
  expect(metrics!.closeRight).toBeLessThanOrEqual(metrics!.vw - minGap)
  expect(metrics!.closeOnTop).toBe(true)
  expect(metrics!.w).toBeLessThan(metrics!.vw - minGap * 2)
  expect(metrics!.h).toBeLessThan(metrics!.vh - minGap * 2)

  if (shot) {
    await page.screenshot({
      path: `test-results/screenshots/${shot}.png`,
      animations: 'disabled',
    })
  }
}
