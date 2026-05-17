# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - Mobile (375x667) >> Splash screen should have no accessibility violations
- Location: e2e/accessibility.spec.ts:166:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 173

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
+               "contrastRatio": 2.82,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#929291",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.82 (foreground color: #929291, background color: #f4f4ee, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<p class=\"mt-2\" style=\"font-family: var(--font-inter); font-size: 14px; color: var(--theme-text-secondary); background-color: var(--theme-backdrop); padding: 4px 12px; border-radius: 4px; opacity: 0; transform: translateY(8.84169px);\">189 Cards • 6 Decks • Unlimited Bad Takes</p>",
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
+   Element has insufficient color contrast of 2.82 (foreground color: #929291, background color: #f4f4ee, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"mt-2\" style=\"font-family: var(--font-inter); font-size: 14px; color: var(--theme-text-secondary); background-color: var(--theme-backdrop); padding: 4px 12px; border-radius: 4px; opacity: 0; transform: translateY(8.84169px);\">189 Cards • 6 Decks • Unlimited Bad Takes</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "p:nth-child(5)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f1f4e9",
+               "contrastRatio": 1.04,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#ecefe4",
+               "fontSize": "13.5pt (18px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.04 (foreground color: #ecefe4, background color: #f1f4e9, font size: 13.5pt (18px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"cursor-pointer upper...\" tabindex=\"0\" style=\"font-family:var(--fo...\">",
+                 "target": Array [
+                   ".mt-10 > .uppercase.cursor-pointer:nth-child(1)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.04 (foreground color: #ecefe4, background color: #f1f4e9, font size: 13.5pt (18px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button class=\"cursor-pointer upper...\" tabindex=\"0\" style=\"font-family:var(--fo...\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mt-10 > .uppercase.cursor-pointer:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f4ee",
+               "contrastRatio": 1.04,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#efefe9",
+               "fontSize": "13.5pt (18px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.04 (foreground color: #efefe9, background color: #f4f4ee, font size: 13.5pt (18px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"cursor-pointer upper...\" tabindex=\"0\" style=\"font-family:var(--fo...\">",
+                 "target": Array [
+                   ".mt-10 > .uppercase.cursor-pointer:nth-child(2)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.04 (foreground color: #efefe9, background color: #f4f4ee, font size: 13.5pt (18px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button class=\"cursor-pointer upper...\" tabindex=\"0\" style=\"font-family:var(--fo...\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mt-10 > .uppercase.cursor-pointer:nth-child(2)",
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
> 176 |     expect(results.violations).toEqual([]);
      |                                ^ Error: expect(received).toEqual(expected) // deep equality
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
```