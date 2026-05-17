# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - Desktop (1280x900) >> Scoreboard screen should have no accessibility violations
- Location: e2e/accessibility.spec.ts:113:7

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
      - generic [ref=e6]: 59S3KK
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
        - paragraph [ref=e29]: I'm in my _____ era.
      - generic [ref=e31]:
        - button "Saying \"I can't even\" and genuinely meaning it Cards Against AI" [ref=e33] [cursor=pointer]:
          - generic [ref=e34]: Saying "I can't even" and genuinely meaning it
          - generic [ref=e39]: Cards Against AI
        - button "Using ChatGPT to write my apology text Cards Against AI" [ref=e41] [cursor=pointer]:
          - generic [ref=e42]: Using ChatGPT to write my apology text
          - generic [ref=e47]: Cards Against AI
        - button "Main character syndrome in a Costco parking lot Cards Against AI" [ref=e49] [cursor=pointer]:
          - generic [ref=e50]: Main character syndrome in a Costco parking lot
          - generic [ref=e55]: Cards Against AI
        - button "Quiet quitting but loud complaining Cards Against AI" [ref=e57] [cursor=pointer]:
          - generic [ref=e58]: Quiet quitting but loud complaining
          - generic [ref=e63]: Cards Against AI
        - button "A Slack channel dedicated entirely to complaining about Slack Cards Against AI" [ref=e65] [cursor=pointer]:
          - generic [ref=e66]: A Slack channel dedicated entirely to complaining about Slack
          - generic [ref=e71]: Cards Against AI
        - button "Rage-quitting life but respawning at your desk job Cards Against AI" [ref=e73] [cursor=pointer]:
          - generic [ref=e74]: Rage-quitting life but respawning at your desk job
          - generic [ref=e79]: Cards Against AI
        - button "That one friend who still uses Facebook Cards Against AI" [ref=e81] [cursor=pointer]:
          - generic [ref=e82]: That one friend who still uses Facebook
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
> 131 |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
      |                                                                            ^ Error: locator.count: Unexpected token "/" while parsing css selector "button:has-text(/^[A-Za-z]/)". Did you mean to CSS.escape it?
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
  189 | 
  190 |     // Click "let's go" button
  191 |     await page.click('button:has-text("let\'s go")');
  192 |     await page.waitForTimeout(500);
  193 | 
  194 |     const results = await new AxeBuilder({ page })
  195 |       .withTags(['wcag2a', 'wcag2aa'])
  196 |       .exclude('#__next-build-watcher')
  197 |       .exclude('[data-nextjs-dialog-overlay]')
  198 |       .analyze();
  199 | 
  200 |     expect(results.violations).toEqual([]);
  201 |   });
  202 | 
  203 |   test('Playing screen should have no accessibility violations', async ({ page }) => {
  204 |     await page.goto(baseUrl);
  205 |     await page.waitForLoadState('networkidle');
  206 | 
  207 |     // Navigate to lobby
  208 |     await page.click('button:has-text("HOST GAME")');
  209 |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  210 |     await page.fill('input[placeholder*="enter your name" i]', 'test');
  211 |     await page.click('button:has-text("let\'s go")');
  212 | 
  213 |     // Wait for playing screen
  214 |     await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  215 |     await page.waitForTimeout(500);
  216 | 
  217 |     const results = await new AxeBuilder({ page })
  218 |       .withTags(['wcag2a', 'wcag2aa'])
  219 |       .exclude('#__next-build-watcher')
  220 |       .exclude('[data-nextjs-dialog-overlay]')
  221 |       .analyze();
  222 | 
  223 |     expect(results.violations).toEqual([]);
  224 |   });
  225 | 
  226 |   test('Results screen should have no accessibility violations', async ({ page }) => {
  227 |     await page.goto(baseUrl);
  228 |     await page.waitForLoadState('networkidle');
  229 | 
  230 |     // Navigate to lobby
  231 |     await page.click('button:has-text("HOST GAME")');
```