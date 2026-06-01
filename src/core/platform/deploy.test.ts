import { describe, it, expect } from 'vitest'
import viteConfig from '../../../vite.config.ts?raw'
import appTsx from './App.tsx?raw'
import deployWorkflow from '../../../.github/workflows/deploy.yml?raw'

/**
 * Guards the GitHub Pages deploy contract so a future edit can't silently break
 * the live link (https://maozepstein.github.io/algo/). These check the build
 * config — they do NOT check the repo's Pages "Source" setting, which must be
 * "GitHub Actions" (a one-time toggle in repo Settings → Pages).
 */
describe('GitHub Pages deploy config', () => {
  it('vite base is env-driven so the Pages build can serve from /algo/', () => {
    expect(viteConfig).toContain('process.env.VITE_BASE')
  })

  it('the router basename follows the deploy base (so routes resolve under /algo/)', () => {
    expect(appTsx).toContain('import.meta.env.BASE_URL')
    expect(appTsx).toContain('basename=')
  })

  it('the deploy workflow builds with the project base and an SPA 404 fallback', () => {
    expect(deployWorkflow, 'workflow must set the /algo/ base').toContain('VITE_BASE: /algo/')
    expect(deployWorkflow, 'workflow must create a 404.html SPA fallback').toContain('dist/404.html')
    expect(deployWorkflow, 'workflow must use the Pages deploy action').toMatch(
      /actions\/deploy-pages/,
    )
  })
})
