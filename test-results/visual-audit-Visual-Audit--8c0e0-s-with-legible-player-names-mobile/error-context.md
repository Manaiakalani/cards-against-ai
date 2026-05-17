# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-audit.spec.ts >> Visual Audit — Fonts & Colors >> scoreboard renders with legible player names
- Location: e2e/visual-audit.spec.ts:246:7

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 16
Received:    14
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic:
      - generic:
        - generic: main
        - generic: character
        - generic: energy
        - generic: main
        - generic: character
        - generic: energy
        - generic: main
        - generic: character
        - generic: energy
        - generic: main
        - generic: character
        - generic: energy
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e6]:
            - heading "STANDINGS" [level=1] [ref=e7]
            - generic:
              - generic: After Round 1
          - generic [ref=e8]:
            - generic [ref=e9]: Next Czar
            - generic [ref=e10]:
              - generic [ref=e11]: 🧠
              - generic [ref=e12]: no_thoughts_ceo
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15]:
              - generic [ref=e16]: "1"
              - generic [ref=e17]: 💅
              - generic [ref=e18]: delulu_vc
            - generic [ref=e19]:
              - generic [ref=e20]: "1"
              - generic [ref=e21]: pts
          - generic [ref=e22]:
            - generic [ref=e23]:
              - generic [ref=e24]: "2"
              - generic [ref=e25]: 🦄
              - generic [ref=e26]: vibecheck
            - generic [ref=e27]:
              - generic [ref=e28]: "0"
              - generic [ref=e29]: pts
          - generic [ref=e30]:
            - generic [ref=e31]:
              - generic [ref=e32]: "3"
              - generic [ref=e33]: 🧠
              - generic [ref=e34]: no_thoughts_ceo
            - generic [ref=e35]:
              - generic [ref=e36]: "0"
              - generic [ref=e37]: pts
          - generic [ref=e38]:
            - generic [ref=e39]:
              - generic [ref=e40]: "4"
              - generic [ref=e41]: 🌿
              - generic [ref=e42]: touch_grass_404
            - generic [ref=e43]:
              - generic [ref=e44]: "0"
              - generic [ref=e45]: pts
        - generic [ref=e46]:
          - generic [ref=e47]: Last Round Winner
          - generic [ref=e48]:
            - generic [ref=e49]: 💅
            - generic [ref=e50]:
              - paragraph [ref=e51]: That's so demure, so mindful, so ____.
              - paragraph [ref=e52]: → Millennial skinny jeans in a wide-leg world
            - generic [ref=e53]: delulu_vc
      - generic [ref=e54]:
        - button "KEEP GOING →" [ref=e55] [cursor=pointer]
        - button "📜 History" [ref=e56] [cursor=pointer]
  - button "Mute sounds" [ref=e57] [cursor=pointer]:
    - img [ref=e58]
  - button "Switch to dark mode" [ref=e62] [cursor=pointer]:
    - img [ref=e63]
  - button "How to play" [ref=e65] [cursor=pointer]: "?"
  - button "Quit game" [ref=e66] [cursor=pointer]: ✕
  - button "Open Next.js Dev Tools" [ref=e72] [cursor=pointer]:
    - img [ref=e73]
  - alert [ref=e76]
```

# Test source

```ts
  156 | 
  157 |   test('card footer text is legible', async ({ page }) => {
  158 |     await navigateToPlaying(page)
  159 |     const footer = page.locator('text=Cards Against AI').first()
  160 |     await expect(footer).toBeVisible()
  161 |     const fontSize = await footer.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  162 |     expect(fontSize).toBeGreaterThanOrEqual(10)
  163 |   })
  164 | 
  165 |   // ── Touch Targets ──
  166 | 
  167 |   test('buttons meet minimum touch target size (44px)', async ({ page }) => {
  168 |     // PLAY button
  169 |     const playBtn = page.getByRole('button', { name: /HOST GAME/i })
  170 |     const box = await playBtn.boundingBox()
  171 |     expect(box).toBeTruthy()
  172 |     expect(box!.height).toBeGreaterThanOrEqual(44)
  173 |     expect(box!.width).toBeGreaterThanOrEqual(44)
  174 |   })
  175 | 
  176 |   test('nav buttons meet touch target size', async ({ page }) => {
  177 |     await navigateToPlaying(page)
  178 |     const confirmBtn = page.getByRole('button', { name: /lock it in/i })
  179 |     const box = await confirmBtn.boundingBox()
  180 |     expect(box).toBeTruthy()
  181 |     expect(box!.height).toBeGreaterThanOrEqual(44)
  182 |   })
  183 | 
  184 |   test('bot selector buttons are tappable', async ({ page }) => {
  185 |     await page.getByRole('button', { name: /HOST GAME/i }).click()
  186 |     const botBtns = page.locator('button:has-text("3")')
  187 |     const box = await botBtns.first().boundingBox()
  188 |     expect(box).toBeTruthy()
  189 |     expect(box!.height).toBeGreaterThanOrEqual(38) // 40px with border
  190 |     expect(box!.width).toBeGreaterThanOrEqual(38)
  191 |   })
  192 | 
  193 |   // ── Design Token Consistency ──
  194 | 
  195 |   test('background color is cream across screens', async ({ page }) => {
  196 |     // Splash
  197 |     const splashBg = await getStyle(page, 'body', 'background-color')
  198 |     const rgb = parseRGB(splashBg)
  199 |     expect(rgb).toBeTruthy()
  200 |     // #F4F4EE = rgb(244, 244, 238)
  201 |     expect(rgb!.r).toBeGreaterThan(230)
  202 |     expect(rgb!.g).toBeGreaterThan(230)
  203 |     expect(rgb!.b).toBeGreaterThan(220)
  204 |   })
  205 | 
  206 |   test('borders use the design-system black (#111)', async ({ page }) => {
  207 |     await page.getByRole('button', { name: /HOST GAME/i }).click()
  208 |     const input = page.getByPlaceholder(/enter your name/i)
  209 |     const borderColor = await input.evaluate((el) => getComputedStyle(el).borderColor)
  210 |     const rgb = parseRGB(borderColor)
  211 |     expect(rgb).toBeTruthy()
  212 |     // #111111 = rgb(17, 17, 17)
  213 |     expect(rgb!.r).toBeLessThan(30)
  214 |     expect(rgb!.g).toBeLessThan(30)
  215 |     expect(rgb!.b).toBeLessThan(30)
  216 |   })
  217 | 
  218 |   test('primary action buttons use green (#66FF00)', async ({ page }) => {
  219 |     const playBtn = page.getByRole('button', { name: /HOST GAME/i })
  220 |     const bg = await playBtn.evaluate((el) => getComputedStyle(el).backgroundColor)
  221 |     const rgb = parseRGB(bg)
  222 |     expect(rgb).toBeTruthy()
  223 |     // #66FF00 = rgb(102, 255, 0)
  224 |     expect(rgb!.g).toBeGreaterThan(200) // strong green channel
  225 |     expect(rgb!.b).toBeLessThan(30) // no blue
  226 |   })
  227 | 
  228 |   // ── Screen-by-Screen Rendering ──
  229 | 
  230 |   test('HUD renders correctly during gameplay', async ({ page }) => {
  231 |     await navigateToPlaying(page)
  232 |     // HUD should show round info — "ROUND 1" on desktop, "R1" on mobile
  233 |     await expect(page.getByText(/R(OUND )?1/)).toBeVisible()
  234 |     // HUD is the fixed bar at top — verify it exists
  235 |     const hud = page.locator('.fixed').first()
  236 |     await expect(hud).toBeVisible()
  237 |   })
  238 | 
  239 |   test('results screen shows winner with readable text', async ({ page }) => {
  240 |     await playToResults(page)
  241 |     const title = page.getByText('ATE & LEFT NO CRUMBS')
  242 |     const fontSize = await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  243 |     expect(fontSize).toBeGreaterThanOrEqual(28) // clamp min
  244 |   })
  245 | 
  246 |   test('scoreboard renders with legible player names', async ({ page }) => {
  247 |     await playToResults(page)
  248 |     await page.getByRole('button', { name: /keep going/i }).click()
  249 |     await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
  250 |     // Check player name font size
  251 |     const playerName = page.getByText('vibecheck').first()
  252 |     await expect(playerName).toBeVisible()
  253 |     const fontSize = await playerName.first().evaluate(
  254 |       (el) => parseFloat(getComputedStyle(el).fontSize),
  255 |     )
> 256 |     expect(fontSize).toBeGreaterThanOrEqual(16)
      |                      ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  257 |   })
  258 | 
  259 |   // ── Screenshots ──
  260 | 
  261 |   test('capture splash screen', async ({ page }) => {
  262 |     await page.waitForTimeout(1500)
  263 |     await page.screenshot({ path: 'test-results/screenshots/splash.png', fullPage: true })
  264 |   })
  265 | 
  266 |   test('capture lobby screen', async ({ page }) => {
  267 |     await page.getByRole('button', { name: /HOST GAME/i }).click()
  268 |     await page.getByPlaceholder(/enter your name/i).fill('vibecheck')
  269 |     await expect(page.getByText('THE PREGAME')).toBeVisible()
  270 |     await page.waitForTimeout(800)
  271 |     await page.screenshot({ path: 'test-results/screenshots/lobby.png', fullPage: true })
  272 |   })
  273 | 
  274 |   test('capture playing screen', async ({ page }) => {
  275 |     await navigateToPlaying(page)
  276 |     await page.waitForTimeout(600)
  277 |     await page.screenshot({ path: 'test-results/screenshots/playing.png', fullPage: true })
  278 |   })
  279 | 
  280 |   test('capture results screen', async ({ page }) => {
  281 |     await playToResults(page)
  282 |     await page.waitForTimeout(1200)
  283 |     await page.screenshot({ path: 'test-results/screenshots/results.png', fullPage: true })
  284 |   })
  285 | 
  286 |   test('capture scoreboard screen', async ({ page }) => {
  287 |     await playToResults(page)
  288 |     await page.getByRole('button', { name: /keep going/i }).click()
  289 |     await expect(page.getByText('STANDINGS')).toBeVisible({ timeout: 5000 })
  290 |     await page.waitForTimeout(800)
  291 |     await page.screenshot({ path: 'test-results/screenshots/scoreboard.png', fullPage: true })
  292 |   })
  293 | })
  294 | 
```