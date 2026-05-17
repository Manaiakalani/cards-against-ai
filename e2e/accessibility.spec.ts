import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa'];
const AXE_EXCLUDES = ['#__next-build-watcher', '[data-nextjs-dialog-overlay]', 'nextjs-portal'];

function axeScan(page: import('@playwright/test').Page) {
  let builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
  for (const sel of AXE_EXCLUDES) builder = builder.exclude(sel);
  return builder.analyze();
}

async function navigateToLobby(page: import('@playwright/test').Page) {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: /HOST GAME/i }).click();
  await page.getByPlaceholder(/enter your name/i).fill('test');
  await page.getByRole('button', { name: /let.*s go/i }).click();
}

async function navigateToPlaying(page: import('@playwright/test').Page) {
  await navigateToLobby(page);
  await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  await page.waitForTimeout(1500);
}

async function navigateToResults(page: import('@playwright/test').Page) {
  await navigateToPlaying(page);
  const isPick2 = (await page.locator('text=PICK 2').count()) > 0;
  const cards = page.locator('.grid > div');
  await cards.nth(0).click();
  await page.waitForTimeout(200);
  if (isPick2) { await cards.nth(1).click(); await page.waitForTimeout(200); }
  await page.getByRole('button', { name: /LOCK IT IN/i }).click();
  await page.waitForSelector('text=KEEP GOING', { timeout: 15000 });
  await page.waitForTimeout(500);
}

async function navigateToScoreboard(page: import('@playwright/test').Page) {
  await navigateToResults(page);
  await page.getByRole('button', { name: /KEEP GOING/i }).click();
  await page.waitForSelector('text=STANDINGS', { timeout: 10000 });
  await page.waitForTimeout(500);
}

for (const vp of [
  { name: 'Desktop (1280x900)', width: 1280, height: 900 },
  { name: 'Mobile (375x667)', width: 375, height: 667 },
]) {
  test.describe(`Accessibility - ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('Splash screen has no a11y violations', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(2500);
      const { violations } = await axeScan(page);
      expect(violations).toEqual([]);
    });

    test('Lobby screen has no a11y violations', async ({ page }) => {
      await navigateToLobby(page);
      await page.waitForTimeout(1500);
      const { violations } = await axeScan(page);
      expect(violations).toEqual([]);
    });

    test('Playing screen has no a11y violations', async ({ page }) => {
      await navigateToPlaying(page);
      await page.waitForTimeout(1000);
      const { violations } = await axeScan(page);
      expect(violations).toEqual([]);
    });

    test('Results screen has no a11y violations', async ({ page }) => {
      await navigateToResults(page);
      await page.waitForTimeout(1500);
      const { violations } = await axeScan(page);
      expect(violations).toEqual([]);
    });

    test('Scoreboard screen has no a11y violations', async ({ page }) => {
      await navigateToScoreboard(page);
      await page.waitForTimeout(1500);
      const { violations } = await axeScan(page);
      expect(violations).toEqual([]);
    });
  });
}
