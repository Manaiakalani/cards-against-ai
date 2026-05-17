# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - Mobile (375x667) >> Scoreboard screen should have no accessibility violations
- Location: e2e/accessibility.spec.ts:269:7

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
      - generic [ref=e6]: ROUND 1
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]: 🦄
          - generic [ref=e10]: "0"
        - generic [ref=e11]:
          - generic [ref=e12]:
            - text: 🧠
            - generic [ref=e13]: 👑
          - generic [ref=e14]: "0"
        - generic [ref=e15]:
          - generic [ref=e16]: 💅
          - generic [ref=e17]: "0"
        - generic [ref=e18]:
          - generic [ref=e19]: 🌿
          - generic [ref=e20]: "0"
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]:
          - heading "Your Hand" [level=2] [ref=e24]
          - paragraph [ref=e25]: 7 Cards Remaining
        - paragraph [ref=e27]: Understood the assignment? Bestie, I turned in _____.
      - generic [ref=e29]:
        - button "Manifesting rent money Cards Against AI" [ref=e31] [cursor=pointer]:
          - generic [ref=e32]: Manifesting rent money
          - generic [ref=e37]: Cards Against AI
        - button "Blockbuster late fees that exceeded the movie's value Cards Against AI" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: Blockbuster late fees that exceeded the movie's value
          - generic [ref=e45]: Cards Against AI
        - button "Being absolutely feral about celebrity drama Cards Against AI" [ref=e47] [cursor=pointer]:
          - generic [ref=e48]: Being absolutely feral about celebrity drama
          - generic [ref=e53]: Cards Against AI
        - button "A GPT wrapper with $50M in funding Cards Against AI" [ref=e55] [cursor=pointer]:
          - generic [ref=e56]: A GPT wrapper with $50M in funding
          - generic [ref=e61]: Cards Against AI
        - button "Main character energy but NPC budget Cards Against AI" [ref=e63] [cursor=pointer]:
          - generic [ref=e64]: Main character energy but NPC budget
          - generic [ref=e69]: Cards Against AI
        - button "Replacing the entire engineering team with a Claude subscription Cards Against AI" [ref=e71] [cursor=pointer]:
          - generic [ref=e72]: Replacing the entire engineering team with a Claude subscription
          - generic [ref=e77]: Cards Against AI
        - button "My entire Spotify Wrapped being one artist on repeat Cards Against AI" [ref=e79] [cursor=pointer]:
          - generic [ref=e80]: My entire Spotify Wrapped being one artist on repeat
          - generic [ref=e85]: Cards Against AI
    - generic [ref=e86]:
      - button "🔄 NEW HAND" [ref=e87] [cursor=pointer]
      - button "LOCK IT IN" [disabled] [ref=e88] [cursor=pointer]
  - button "Mute sounds" [ref=e89] [cursor=pointer]:
    - img [ref=e90]
  - button "Switch to dark mode" [ref=e94] [cursor=pointer]:
    - img [ref=e95]
  - button "How to play" [ref=e97] [cursor=pointer]: "?"
  - button "Quit game" [ref=e98] [cursor=pointer]: ✕
  - button "Open Next.js Dev Tools" [ref=e104] [cursor=pointer]:
    - img [ref=e105]
  - alert [ref=e108]
```

# Test source

```ts
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
  232 |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  233 |     await page.fill('input[placeholder*="enter your name" i]', 'test');
  234 |     await page.click('button:has-text("let\'s go")');
  235 | 
  236 |     // Wait for playing screen
  237 |     await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  238 |     await page.waitForTimeout(500);
  239 | 
  240 |     // Check if it's a Pick-2 round
  241 |     const isPick2 = await page.locator('text=PICK 2').count() > 0;
  242 | 
  243 |     // Select cards
  244 |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
  245 |     if (isPick2 && cardButtons >= 2) {
  246 |       // Select first two cards for Pick-2
  247 |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  248 |       await page.waitForTimeout(200);
  249 |       await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
  250 |     } else {
  251 |       // Select first card for regular round
  252 |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  253 |     }
  254 | 
  255 |     // Click LOCK IT IN
  256 |     await page.click('button:has-text("LOCK IT IN")');
  257 |     await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
  258 |     await page.waitForTimeout(500);
  259 | 
  260 |     const results = await new AxeBuilder({ page })
  261 |       .withTags(['wcag2a', 'wcag2aa'])
  262 |       .exclude('#__next-build-watcher')
  263 |       .exclude('[data-nextjs-dialog-overlay]')
  264 |       .analyze();
  265 | 
  266 |     expect(results.violations).toEqual([]);
  267 |   });
  268 | 
  269 |   test('Scoreboard screen should have no accessibility violations', async ({ page }) => {
  270 |     await page.goto(baseUrl);
  271 |     await page.waitForLoadState('networkidle');
  272 | 
  273 |     // Navigate to lobby
  274 |     await page.click('button:has-text("HOST GAME")');
  275 |     await page.waitForSelector('input[placeholder*="enter your name" i]', { timeout: 5000 });
  276 |     await page.fill('input[placeholder*="enter your name" i]', 'test');
  277 |     await page.click('button:has-text("let\'s go")');
  278 | 
  279 |     // Wait for playing screen
  280 |     await page.waitForSelector('text=Your Hand', { timeout: 10000 });
  281 |     await page.waitForTimeout(500);
  282 | 
  283 |     // Check if it's a Pick-2 round
  284 |     const isPick2 = await page.locator('text=PICK 2').count() > 0;
  285 | 
  286 |     // Select cards
> 287 |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
      |                                                                            ^ Error: locator.count: Unexpected token "/" while parsing css selector "button:has-text(/^[A-Za-z]/)". Did you mean to CSS.escape it?
  288 |     if (isPick2 && cardButtons >= 2) {
  289 |       // Select first two cards for Pick-2
  290 |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  291 |       await page.waitForTimeout(200);
  292 |       await page.locator('button:has-text(/^[A-Za-z]/)').nth(1).click();
  293 |     } else {
  294 |       // Select first card for regular round
  295 |       await page.locator('button:has-text(/^[A-Za-z]/)').first().click();
  296 |     }
  297 | 
  298 |     // Click LOCK IT IN
  299 |     await page.click('button:has-text("LOCK IT IN")');
  300 |     await page.waitForSelector('text=KEEP GOING', { timeout: 10000 });
  301 |     await page.waitForTimeout(500);
  302 | 
  303 |     // Click KEEP GOING to go to scoreboard
  304 |     await page.click('button:has-text("KEEP GOING")');
  305 |     await page.waitForSelector('text=STANDINGS', { timeout: 10000 });
  306 |     await page.waitForTimeout(500);
  307 | 
  308 |     const results = await new AxeBuilder({ page })
  309 |       .withTags(['wcag2a', 'wcag2aa'])
  310 |       .exclude('#__next-build-watcher')
  311 |       .exclude('[data-nextjs-dialog-overlay]')
  312 |       .analyze();
  313 | 
  314 |     expect(results.violations).toEqual([]);
  315 |   });
  316 | });
  317 | 
```