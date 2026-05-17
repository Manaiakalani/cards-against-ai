# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - Desktop (1280x900) >> Results screen should have no accessibility violations
- Location: e2e/accessibility.spec.ts:70:7

# Error details

```
Error: locator.count: Unexpected token "/" while parsing css selector "button:has-text(/^[A-Za-z]/)". Did you mean to CSS.escape it?
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic:
      - generic:
        - generic: no cap
        - generic: fr fr
        - generic: lowkey
        - generic: no cap
        - generic: fr fr
        - generic: lowkey
        - generic: no cap
        - generic: fr fr
        - generic: lowkey
        - generic: no cap
        - generic: fr fr
        - generic: lowkey
    - generic [ref=e4]:
      - generic [ref=e6]: 9A5NXK
      - generic [ref=e8]: ROUND 1
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: 🦄
          - generic [ref=e12]: "0"
        - generic [ref=e13]:
          - generic [ref=e14]:
            - text: 🧠
            - generic [ref=e15]: 👑
          - generic [ref=e16]: "0"
        - generic [ref=e17]:
          - generic [ref=e18]: 💅
          - generic [ref=e19]: "0"
        - generic [ref=e20]:
          - generic [ref=e21]: 🌿
          - generic [ref=e22]: "0"
    - generic [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - heading "Your Hand" [level=2] [ref=e26]
          - paragraph [ref=e27]: 7 Cards Remaining
        - paragraph [ref=e29]: No cap fr fr, _____ just hits different.
      - generic [ref=e31]:
        - button "Machine learning but it learned the wrong lesson Cards Against AI" [ref=e33] [cursor=pointer]:
          - generic [ref=e34]: Machine learning but it learned the wrong lesson
          - generic [ref=e39]: Cards Against AI
        - button "Gaslight, gatekeep, girlboss Cards Against AI" [ref=e41] [cursor=pointer]:
          - generic [ref=e42]: Gaslight, gatekeep, girlboss
          - generic [ref=e47]: Cards Against AI
        - button "Being permanently online but emotionally unavailable Cards Against AI" [ref=e49] [cursor=pointer]:
          - generic [ref=e50]: Being permanently online but emotionally unavailable
          - generic [ref=e55]: Cards Against AI
        - button "Printing MapQuest directions and still getting lost Cards Against AI" [ref=e57] [cursor=pointer]:
          - generic [ref=e58]: Printing MapQuest directions and still getting lost
          - generic [ref=e63]: Cards Against AI
        - button "Sending a TikTok that says \"this is literally us\" (it's not) Cards Against AI" [ref=e65] [cursor=pointer]:
          - generic [ref=e66]: Sending a TikTok that says "this is literally us" (it's not)
          - generic [ref=e71]: Cards Against AI
        - button "Letting AI write my entire performance review Cards Against AI" [ref=e73] [cursor=pointer]:
          - generic [ref=e74]: Letting AI write my entire performance review
          - generic [ref=e79]: Cards Against AI
        - button "Crying to Phoebe Bridgers at 2 AM Cards Against AI" [ref=e81] [cursor=pointer]:
          - generic [ref=e82]: Crying to Phoebe Bridgers at 2 AM
          - generic [ref=e87]: Cards Against AI
    - generic [ref=e88]:
      - button "🔄 NEW HAND" [ref=e89] [cursor=pointer]
      - button "LOCK IT IN" [disabled] [ref=e90] [cursor=pointer]
  - button "Mute sounds" [ref=e91] [cursor=pointer]:
    - img [ref=e92]
  - button "Switch to dark mode" [ref=e96] [cursor=pointer]:
    - img [ref=e97]
  - button "How to play" [ref=e99] [cursor=pointer]: "?"
  - button "Quit game" [ref=e100] [cursor=pointer]: ✕
  - button "Open Next.js Dev Tools" [ref=e106] [cursor=pointer]:
    - img [ref=e107]
  - alert [ref=e110]
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
  20  |     expect(results.violations).toEqual([]);
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
> 88  |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
      |                                                                            ^ Error: locator.count: Unexpected token "/" while parsing css selector "button:has-text(/^[A-Za-z]/)". Did you mean to CSS.escape it?
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
  121 |     await page.click('button:has-text("let\'s go")');
  122 | 
  123 |     // Wait for playing screen
  124 |     await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  125 |     await page.waitForTimeout(500);
  126 | 
  127 |     // Check if it's a Pick-2 round
  128 |     const isPick2 = await page.locator('text=PICK 2').count() > 0;
  129 | 
  130 |     // Select cards
  131 |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
  132 |     if (isPick2 && cardButtons >= 2) {
  133 |       // Select first two cards for Pick-2
  134 |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  135 |       await page.waitForTimeout(200);
  136 |       await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
  137 |     } else {
  138 |       // Select first card for regular round
  139 |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  140 |     }
  141 | 
  142 |     // Click LOCK IT IN
  143 |     await page.click('button:has-text("LOCK IT IN")');
  144 |     await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
  145 |     await page.waitForTimeout(500);
  146 | 
  147 |     // Click KEEP GOING to go to scoreboard
  148 |     await page.click('button:has-text("KEEP GOING")');
  149 |     await page.waitForSelector('text=STANDINGS', { timeout: 10000 });
  150 |     await page.waitForTimeout(500);
  151 | 
  152 |     const results = await new AxeBuilder({ page })
  153 |       .withTags(['wcag2a', 'wcag2aa'])
  154 |       .exclude('#__next-build-watcher')
  155 |       .exclude('[data-nextjs-dialog-overlay]')
  156 |       .analyze();
  157 | 
  158 |     expect(results.violations).toEqual([]);
  159 |   });
  160 | });
  161 | 
  162 | // Mobile viewport tests
  163 | test.describe('Accessibility - Mobile (375x667)', () => {
  164 |   test.use({ viewport: { width: 375, height: 667 } });
  165 | 
  166 |   test('Splash screen should have no accessibility violations', async ({ page }) => {
  167 |     await page.goto(baseUrl);
  168 |     await page.waitForLoadState('networkidle');
  169 | 
  170 |     const results = await new AxeBuilder({ page })
  171 |       .withTags(['wcag2a', 'wcag2aa'])
  172 |       .exclude('#__next-build-watcher')
  173 |       .exclude('[data-nextjs-dialog-overlay]')
  174 |       .analyze();
  175 | 
  176 |     expect(results.violations).toEqual([]);
  177 |   });
  178 | 
  179 |   test('Lobby screen should have no accessibility violations', async ({ page }) => {
  180 |     await page.goto(baseUrl);
  181 |     await page.waitForLoadState('networkidle');
  182 | 
  183 |     // Click HOST GAME button
  184 |     await page.click('button:has-text("HOST GAME")');
  185 |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  186 | 
  187 |     // Fill name field
  188 |     await page.fill('input[placeholder*="enter your name" i]', 'test');
```