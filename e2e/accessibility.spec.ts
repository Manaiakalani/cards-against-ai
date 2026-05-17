import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const baseUrl = 'http://localhost:3000';

// Desktop viewport tests
test.describe('Accessibility - Desktop (1280x900)', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('Splash screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Lobby screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Click HOST GAME button
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });

    // Fill name field
    await page.fill('input[placeholder*="enter your name" i]', 'test');

    // Click "let's go" button
    await page.click('button:has-text("let\'s go")');
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Playing screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Navigate to lobby
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
    await page.fill('input[placeholder*="enter your name" i]', 'test');
    await page.click('button:has-text("let\'s go")');

    // Wait for playing screen
    await page.waitForSelector('text=Your Hand', { timeout: 10000 });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Results screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Navigate to lobby
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
    await page.fill('input[placeholder*="enter your name" i]', 'test');
    await page.click('button:has-text("let\'s go")');

    // Wait for playing screen
    await page.waitForSelector('text=Your Hand', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Check if it's a Pick-2 round
    const isPick2 = await page.locator('text=PICK 2').count() > 0;

    // Select cards
    const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
    if (isPick2 && cardButtons >= 2) {
      // Select first two cards for Pick-2
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
    } else {
      // Select first card for regular round
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
    }

    // Click LOCK IT IN
    await page.click('button:has-text("LOCK IT IN")');
    await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Scoreboard screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Navigate to lobby
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
    await page.fill('input[placeholder*="enter your name" i]', 'test');
    await page.click('button:has-text("let\'s go")');

    // Wait for playing screen
    await page.waitForSelector('text=Your Hand', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Check if it's a Pick-2 round
    const isPick2 = await page.locator('text=PICK 2').count() > 0;

    // Select cards
    const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
    if (isPick2 && cardButtons >= 2) {
      // Select first two cards for Pick-2
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
    } else {
      // Select first card for regular round
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
    }

    // Click LOCK IT IN
    await page.click('button:has-text("LOCK IT IN")');
    await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Click KEEP GOING to go to scoreboard
    await page.click('button:has-text("KEEP GOING")');
    await page.waitForSelector('text=STANDINGS', { timeout: 10000 });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

// Mobile viewport tests
test.describe('Accessibility - Mobile (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Splash screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Lobby screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Click HOST GAME button
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });

    // Fill name field
    await page.fill('input[placeholder*="enter your name" i]', 'test');

    // Click "let's go" button
    await page.click('button:has-text("let\'s go")');
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Playing screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Navigate to lobby
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
    await page.fill('input[placeholder*="enter your name" i]', 'test');
    await page.click('button:has-text("let\'s go")');

    // Wait for playing screen
    await page.waitForSelector('text=Your Hand', { timeout: 10000 });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Results screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Navigate to lobby
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
    await page.fill('input[placeholder*="enter your name" i]', 'test');
    await page.click('button:has-text("let\'s go")');

    // Wait for playing screen
    await page.waitForSelector('text=Your Hand', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Check if it's a Pick-2 round
    const isPick2 = await page.locator('text=PICK 2').count() > 0;

    // Select cards
    const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
    if (isPick2 && cardButtons >= 2) {
      // Select first two cards for Pick-2
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
    } else {
      // Select first card for regular round
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
    }

    // Click LOCK IT IN
    await page.click('button:has-text("LOCK IT IN")');
    await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Scoreboard screen should have no accessibility violations', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Navigate to lobby
    await page.click('button:has-text("HOST GAME")');
    await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
    await page.fill('input[placeholder*="enter your name" i]', 'test');
    await page.click('button:has-text("let\'s go")');

    // Wait for playing screen
    await page.waitForSelector('text=Your Hand', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Check if it's a Pick-2 round
    const isPick2 = await page.locator('text=PICK 2').count() > 0;

    // Select cards
    const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
    if (isPick2 && cardButtons >= 2) {
      // Select first two cards for Pick-2
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
    } else {
      // Select first card for regular round
      await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
    }

    // Click LOCK IT IN
    await page.click('button:has-text("LOCK IT IN")');
    await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Click KEEP GOING to go to scoreboard
    await page.click('button:has-text("KEEP GOING")');
    await page.waitForSelector('text=STANDINGS', { timeout: 10000 });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#__next-build-watcher')
      .exclude('[data-nextjs-dialog-overlay]')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
