import { test, expect } from '@playwright/test'
import { assertCenteredDialog } from './helpers/assertDialog'

const DEVICES = [
  { name: 'iphone-se', w: 375, h: 667, mobile: true },
  { name: 'iphone-14', w: 390, h: 844, mobile: true },
  { name: 'iphone-15-pro-max', w: 430, h: 932, mobile: true },
  { name: 'pixel-7', w: 412, h: 915, mobile: true },
  { name: 'iphone-landscape', w: 932, h: 430, mobile: true },
  { name: 'ipad-mini', w: 768, h: 1024, mobile: true },
  { name: 'ipad-air', w: 820, h: 1180, mobile: true },
  { name: 'laptop', w: 1280, h: 800, mobile: false },
  { name: 'desktop', w: 1440, h: 900, mobile: false },
  { name: '1080p', w: 1920, h: 1080, mobile: false },
] as const

const DIALOGS = [
  { open: /📊 stats/i, name: /your stats/i, close: 'Close stats', id: 'stats' },
  { open: /🏆 achievements/i, name: /achievements/i, close: 'Close achievements', id: 'achievements' },
  { open: 'How to play', name: /how to play/i, close: 'Close help', id: 'help' },
  { open: /⭐ favorites/i, name: /favorites/i, close: 'Close history', id: 'favorites' },
] as const

for (const device of DEVICES) {
  test.describe(`${device.name} ${device.w}x${device.h}`, () => {
    test.use({
      viewport: { width: device.w, height: device.h },
      isMobile: device.mobile,
      hasTouch: device.mobile,
    })

    for (const dialog of DIALOGS) {
      test(`${dialog.id} is a centered card with a tappable X`, async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: dialog.open }).click()
        await assertCenteredDialog(
          page,
          dialog.name,
          dialog.close,
          device.name === 'iphone-15-pro-max' || device.name === 'desktop' || device.name === 'iphone-landscape'
            ? `${device.name}-${dialog.id}`
            : undefined,
        )
        await page.getByRole('button', { name: dialog.close }).click()
        await expect(page.getByRole('dialog', { name: dialog.name })).toHaveCount(0)
      })
    }
  })
}
