# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - Desktop (1280x900) >> Splash screen should have no accessibility violations
- Location: e2e/accessibility.spec.ts:10:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 103

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4ee",
+               "contrastRatio": 2.34,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#a1a19f",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.34 (foreground color: #a1a19f, background color: #f4f4ee, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<p class=\"mt-2\" style=\"font-family: var(--font-inter); font-size: 14px; color: var(--theme-text-secondary); background-color: var(--theme-backdrop); padding: 4px 12px; border-radius: 4px; opacity: 0; transform: translateY(12.0349px);\">189 Cards • 6 Decks • Unlimited Bad Takes</p>",
+                 "target": Array [
+                   "p:nth-child(5)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"relative flex h-dvh items-center justify-center overflow-hidden\" style=\"background-color:var(--theme-bg)\">",
+                 "target": Array [
+                   ".h-dvh",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.34 (foreground color: #a1a19f, background color: #f4f4ee, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"mt-2\" style=\"font-family: var(--font-inter); font-size: 14px; color: var(--theme-text-secondary); background-color: var(--theme-backdrop); padding: 4px 12px; border-radius: 4px; opacity: 0; transform: translateY(12.0349px);\">189 Cards • 6 Decks • Unlimited Bad Takes</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "p:nth-child(5)",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+   Object {
+     "description": "Ensure <meta name=\"viewport\"> does not disable text scaling and zooming",
+     "help": "Zooming and scaling must not be disabled",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright",
+     "id": "meta-viewport",
+     "impact": "moderate",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": "user-scalable=no",
+             "id": "meta-viewport",
+             "impact": "moderate",
+             "message": "user-scalable=no on <meta> tag disables zooming on mobile devices",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   user-scalable=no on <meta> tag disables zooming on mobile devices",
+         "html": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover\">",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           "meta[name=\"viewport\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.sensory-and-visual-cues",
+       "wcag2aa",
+       "wcag144",
+       "EN-301-549",
+       "EN-9.1.4.4",
+       "ACT",
+       "RGAAv4",
+       "RGAA-10.4.2",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic:
      - generic:
        - generic: slay
        - generic: brainrot
        - generic: unhinged
        - generic: slay
        - generic: brainrot
        - generic: unhinged
        - generic: slay
        - generic: brainrot
        - generic: unhinged
        - generic: slay
        - generic: brainrot
        - generic: unhinged
    - generic:
      - generic:
        - generic:
          - text: The next
          - text: will be my entire personality.
        - generic:
          - generic: Cards Against AI
    - generic:
      - generic:
        - generic: Vibe coding at 3 AM with zero tests
        - generic:
          - generic: Cards Against AI
    - generic [ref=e3]:
      - heading "CARDS" [level=1] [ref=e5]
      - generic [ref=e7]: AGAINST
      - heading "AI" [level=2] [ref=e9]
      - paragraph [ref=e10]: The party game for chronically online people
      - paragraph [ref=e11]: 189 Cards • 6 Decks • Unlimited Bad Takes
      - generic [ref=e12]:
        - button "🎮 HOST GAME" [ref=e13] [cursor=pointer]
        - button "🔗 JOIN GAME" [ref=e14] [cursor=pointer]
      - generic [ref=e15]:
        - button "📊 Stats" [ref=e16] [cursor=pointer]
        - button "🏆 Achievements" [ref=e17] [cursor=pointer]
        - button "⭐ Favorites" [ref=e18] [cursor=pointer]
      - generic [ref=e23]: v1.0 MVP
      - contentinfo [ref=e28]:
        - generic [ref=e29]:
          - link "GitHub ↗" [ref=e30] [cursor=pointer]:
            - /url: https://github.com/Manaiakalani/Cards
            - img [ref=e31]
            - text: GitHub ↗
          - generic [ref=e35]: •
          - link "Submit a Deck ↗" [ref=e36] [cursor=pointer]:
            - /url: https://github.com/Manaiakalani/Cards/issues/new?labels=new-deck&template=deck_submission.md&title=%5BDeck%5D+
            - img [ref=e37]
            - text: Submit a Deck ↗
          - generic [ref=e39]: •
          - link "Contribute ↗" [ref=e40] [cursor=pointer]:
            - /url: https://github.com/Manaiakalani/Cards/pulls
            - img [ref=e41]
            - text: Contribute ↗
        - paragraph [ref=e46]: Open source — submit new card decks via GitHub Issues or PR
  - button "Mute sounds" [ref=e47] [cursor=pointer]:
    - img [ref=e48]
  - button "Switch to dark mode" [ref=e52] [cursor=pointer]:
    - img [ref=e53]
  - button "How to play" [ref=e55] [cursor=pointer]: "?"
  - button "Open Next.js Dev Tools" [ref=e61] [cursor=pointer]:
    - img [ref=e62]
  - alert [ref=e65]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AxeBuilder } from '@axe-core/playwright';
  3   | 
  4   | const baseUrl = 'http://localhost:3000';
  5   | 
  6   | // Desktop viewport tests
  7   | test.describe('Accessibility - Desktop (1280x900)', () => {
  8   |   test.use({ viewport: { width: 1280, height: 900 } });
  9   | 
  10  |   test('Splash screen should have no accessibility violations', async ({ page }) => {
  11  |     await page.goto(baseUrl);
  12  |     await page.waitForLoadState('networkidle');
  13  | 
  14  |     const results = await new AxeBuilder({ page })
  15  |       .withTags(['wcag2a', 'wcag2aa'])
  16  |       .exclude('#__next-build-watcher')
  17  |       .exclude('[data-nextjs-dialog-overlay]')
  18  |       .analyze();
  19  | 
> 20  |     expect(results.violations).toEqual([]);
      |                                ^ Error: expect(received).toEqual(expected) // deep equality
  21  |   });
  22  | 
  23  |   test('Lobby screen should have no accessibility violations', async ({ page }) => {
  24  |     await page.goto(baseUrl);
  25  |     await page.waitForLoadState('networkidle');
  26  | 
  27  |     // Click HOST GAME button
  28  |     await page.click('button:has-text("HOST GAME")');
  29  |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  30  | 
  31  |     // Fill name field
  32  |     await page.fill('input[placeholder*="enter your name" i]', 'test');
  33  | 
  34  |     // Click "let's go" button
  35  |     await page.click('button:has-text("let\'s go")');
  36  |     await page.waitForTimeout(500);
  37  | 
  38  |     const results = await new AxeBuilder({ page })
  39  |       .withTags(['wcag2a', 'wcag2aa'])
  40  |       .exclude('#__next-build-watcher')
  41  |       .exclude('[data-nextjs-dialog-overlay]')
  42  |       .analyze();
  43  | 
  44  |     expect(results.violations).toEqual([]);
  45  |   });
  46  | 
  47  |   test('Playing screen should have no accessibility violations', async ({ page }) => {
  48  |     await page.goto(baseUrl);
  49  |     await page.waitForLoadState('networkidle');
  50  | 
  51  |     // Navigate to lobby
  52  |     await page.click('button:has-text("HOST GAME")');
  53  |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  54  |     await page.fill('input[placeholder*="enter your name" i]', 'test');
  55  |     await page.click('button:has-text("let\'s go")');
  56  | 
  57  |     // Wait for playing screen
  58  |     await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  59  |     await page.waitForTimeout(500);
  60  | 
  61  |     const results = await new AxeBuilder({ page })
  62  |       .withTags(['wcag2a', 'wcag2aa'])
  63  |       .exclude('#__next-build-watcher')
  64  |       .exclude('[data-nextjs-dialog-overlay]')
  65  |       .analyze();
  66  | 
  67  |     expect(results.violations).toEqual([]);
  68  |   });
  69  | 
  70  |   test('Results screen should have no accessibility violations', async ({ page }) => {
  71  |     await page.goto(baseUrl);
  72  |     await page.waitForLoadState('networkidle');
  73  | 
  74  |     // Navigate to lobby
  75  |     await page.click('button:has-text("HOST GAME")');
  76  |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  77  |     await page.fill('input[placeholder*="enter your name" i]', 'test');
  78  |     await page.click('button:has-text("let\'s go")');
  79  | 
  80  |     // Wait for playing screen
  81  |     await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  82  |     await page.waitForTimeout(500);
  83  | 
  84  |     // Check if it's a Pick-2 round
  85  |     const isPick2 = await page.locator('text=PICK 2').count() > 0;
  86  | 
  87  |     // Select cards
  88  |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
  89  |     if (isPick2 && cardButtons >= 2) {
  90  |       // Select first two cards for Pick-2
  91  |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  92  |       await page.waitForTimeout(200);
  93  |       await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
  94  |     } else {
  95  |       // Select first card for regular round
  96  |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  97  |     }
  98  | 
  99  |     // Click LOCK IT IN
  100 |     await page.click('button:has-text("LOCK IT IN")');
  101 |     await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
  102 |     await page.waitForTimeout(500);
  103 | 
  104 |     const results = await new AxeBuilder({ page })
  105 |       .withTags(['wcag2a', 'wcag2aa'])
  106 |       .exclude('#__next-build-watcher')
  107 |       .exclude('[data-nextjs-dialog-overlay]')
  108 |       .analyze();
  109 | 
  110 |     expect(results.violations).toEqual([]);
  111 |   });
  112 | 
  113 |   test('Scoreboard screen should have no accessibility violations', async ({ page }) => {
  114 |     await page.goto(baseUrl);
  115 |     await page.waitForLoadState('networkidle');
  116 | 
  117 |     // Navigate to lobby
  118 |     await page.click('button:has-text("HOST GAME")');
  119 |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  120 |     await page.fill('input[placeholder*="enter your name" i]', 'test');
```