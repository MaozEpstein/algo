import { test, expect, type Page } from '@playwright/test'

/**
 * UI smoke crawler. Discovers every course → lecture from the picker/home pages
 * (react-router <Link>s render real anchors), then visits each lecture and clicks
 * through its tab bar, asserting four invariants on every state:
 *   • no console errors / uncaught page errors
 *   • no `.katex-error` (a KaTeX render failure)
 *   • no raw `$…` leaking into visible text (an un-rendered math delimiter)
 *   • no horizontal overflow (a clipped / runaway-width layout)
 * These are exactly the runtime/visual faults that tsc + eslint can't catch in
 * this RTL + KaTeX + SVG app. The test asserts invariants, not content, so it
 * stays green across content edits and only fails on a genuine regression.
 */

// a leaked KaTeX delimiter: `$` immediately followed by a letter/backslash/brace
const RAW_DOLLAR = /\$[A-Za-z\\{]/

async function uniqueHrefs(page: Page, substr: string): Promise<string[]> {
  const hrefs = await page
    .locator(`a[href*="${substr}"]`)
    .evaluateAll((els) => els.map((a) => (a as HTMLAnchorElement).getAttribute('href') || ''))
  return [...new Set(hrefs.filter(Boolean))]
}

async function findFaults(page: Page, consoleErrors: string[]): Promise<string[]> {
  const faults: string[] = []
  if (consoleErrors.length) faults.push(`console: ${consoleErrors.slice(0, 3).join(' | ').slice(0, 200)}`)
  if (await page.locator('.katex-error').count()) faults.push('.katex-error present')
  const text = await page.locator('main').innerText().catch(() => '')
  if (RAW_DOLLAR.test(text)) faults.push('raw $ in visible text')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  if (overflow) faults.push('horizontal overflow')
  return faults
}

test('every lecture & tab renders cleanly (no console / KaTeX / $ / overflow faults)', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message))
  const reset = () => (consoleErrors.length = 0)

  const issues: string[] = []

  // 1) courses from the picker → 2) lectures from each course home
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const courses = await uniqueHrefs(page, '/c/')

  const lectures = new Set<string>()
  for (const c of courses) {
    await page.goto(c)
    await page.waitForLoadState('networkidle')
    for (const l of await uniqueHrefs(page, '/lecture/')) lectures.add(l)
  }
  expect(lectures.size, 'crawler should discover lectures').toBeGreaterThan(0)

  // 3) visit each lecture, check the landing state and each tab-bar state
  for (const lec of lectures) {
    reset()
    await page.goto(lec)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(250)
    for (const f of await findFaults(page, consoleErrors)) issues.push(`${lec} — ${f}`)

    const tabs = page.locator('main nav button')
    const n = await tabs.count()
    for (let i = 0; i < n; i++) {
      const label = (await tabs.nth(i).innerText().catch(() => `tab${i}`)).replace(/\s+/g, ' ').trim()
      reset()
      await tabs.nth(i).click().catch(() => {})
      await page.waitForTimeout(250)
      for (const f of await findFaults(page, consoleErrors)) issues.push(`${lec} [${label}] — ${f}`)
    }
  }

  expect(issues, `UI faults:\n${issues.join('\n')}`).toEqual([])
})
