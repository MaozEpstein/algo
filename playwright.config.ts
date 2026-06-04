import { defineConfig, devices } from '@playwright/test'

/**
 * Smoke-test config. Builds the app and serves the production preview, then runs
 * the crawler in e2e/ that visits every lecture + tab and asserts there are no
 * UI faults (console errors, KaTeX errors, leaked `$`, horizontal overflow).
 * Run with `npm run test:smoke`. Kept separate from the fast vitest unit suite.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
