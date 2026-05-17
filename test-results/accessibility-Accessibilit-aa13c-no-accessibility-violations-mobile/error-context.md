# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - Mobile (375x667) >> Lobby screen should have no accessibility violations
- Location: e2e/accessibility.spec.ts:179:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 147

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
+               "contrastRatio": 2.58,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#999999",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.58 (foreground color: #999999, background color: #f4f4ee, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"relative h-dvh overflow-hidden\" style=\"background-color: var(--theme-bg);\">",
+                 "target": Array [
+                   ".h-dvh",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.58 (foreground color: #999999, background color: #f4f4ee, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"mt-0.5\" style=\"font-family: var(--font-inter); font-size: 13px; color: var(--theme-text-muted);\">7 Cards Remaining</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mt-0\\.5",
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
+   Object {
+     "description": "Ensure elements that have scrollable content are accessible by keyboard in Safari",
+     "help": "Scrollable region must have keyboard access",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable?application=playwright",
+     "id": "scrollable-region-focusable",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "focusable-content",
+             "impact": "serious",
+             "message": "Element should have focusable content",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "focusable-element",
+             "impact": "serious",
+             "message": "Element should be focusable",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element should have focusable content
+   Element should be focusable",
+         "html": "<div class=\"flex min-w-0 items-center gap-1 overflow-x-auto\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".min-w-0",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.keyboard",
+       "wcag2a",
+       "wcag211",
+       "wcag213",
+       "TTv5",
+       "TT4.a",
+       "EN-301-549",
+       "EN-9.2.1.1",
+       "EN-9.2.1.3",
+       "RGAAv4",
+       "RGAA-7.3.2",
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
        - paragraph [ref=e27]: "Red flag: they think _____ is a personality trait."
      - generic [ref=e29]:
        - button "A \"profitable\" business model based on vibes and oat milk Cards Against AI" [ref=e31] [cursor=pointer]:
          - generic [ref=e32]: A "profitable" business model based on vibes and oat milk
          - generic [ref=e37]: Cards Against AI
        - button "My emotional support Stanley cup Cards Against AI" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: My emotional support Stanley cup
          - generic [ref=e45]: Cards Against AI
        - button "A Slack channel dedicated entirely to complaining about Slack Cards Against AI" [ref=e47] [cursor=pointer]:
          - generic [ref=e48]: A Slack channel dedicated entirely to complaining about Slack
          - generic [ref=e53]: Cards Against AI
        - button "Being absolutely feral about celebrity drama Cards Against AI" [ref=e55] [cursor=pointer]:
          - generic [ref=e56]: Being absolutely feral about celebrity drama
          - generic [ref=e61]: Cards Against AI
        - button "My situationship's situationship Cards Against AI" [ref=e63] [cursor=pointer]:
          - generic [ref=e64]: My situationship's situationship
          - generic [ref=e69]: Cards Against AI
        - button "The 2008 financial crisis ruining our vibes permanently Cards Against AI" [ref=e71] [cursor=pointer]:
          - generic [ref=e72]: The 2008 financial crisis ruining our vibes permanently
          - generic [ref=e77]: Cards Against AI
        - button "Calling a bug a \"feature flag experiment\" Cards Against AI" [ref=e79] [cursor=pointer]:
          - generic [ref=e80]: Calling a bug a "feature flag experiment"
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
> 200 |     expect(results.violations).toEqual([]);
      |                                ^ Error: expect(received).toEqual(expected) // deep equality
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
  287 |     const cardButtons = await page.locator('button:has-text(/^[A-Za-z]/)').count();
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
```