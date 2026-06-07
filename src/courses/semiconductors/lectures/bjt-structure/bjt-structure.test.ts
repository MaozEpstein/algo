import { describe, it, expect } from 'vitest'
import { baseTransportFactor } from '../../lib/junction'

/**
 * Lecture 3א — BJT base transport factor b = 1/cosh(W_B/L_B). A thin base → b→1
 * (almost everything reaches the collector), and b decreases monotonically as the
 * base widens. The thin-base approximation b ≈ 1 − W_B²/2L_B² must match cosh.
 */
describe('BJT — base transport factor', () => {
  const L = 5.9e-3 // ~59 µm (electrons in a Si base), cm

  it('→ 1 as the base gets very thin (W_B ≪ L_B)', () => {
    expect(baseTransportFactor(1e-6, L)).toBeCloseTo(1, 6)
    expect(baseTransportFactor(1e-4, L)).toBeGreaterThan(0.999)
  })

  it('decreases monotonically as the base widens', () => {
    const widths = [0.2e-4, 1e-4, 3e-4, 10e-4, 30e-4]
    for (let i = 1; i < widths.length; i++) {
      expect(baseTransportFactor(widths[i], L)).toBeLessThan(baseTransportFactor(widths[i - 1], L))
    }
  })

  it('matches the thin-base approximation 1 − W_B²/2L_B² for W_B ≪ L_B', () => {
    const WB = 2e-4
    const approx = 1 - (WB * WB) / (2 * L * L)
    expect(baseTransportFactor(WB, L)).toBeCloseTo(approx, 6)
  })

  it('gives 1/cosh(1) ≈ 0.648 at W_B = L_B', () => {
    expect(baseTransportFactor(L, L)).toBeCloseTo(1 / Math.cosh(1), 10)
    expect(baseTransportFactor(L, L)).toBeCloseTo(0.6481, 4)
  })

  it('stays within (0,1]', () => {
    for (const WB of [0, 1e-4, 1e-3, 1e-2, 1]) {
      const b = baseTransportFactor(WB, L)
      expect(b).toBeGreaterThan(0)
      expect(b).toBeLessThanOrEqual(1)
    }
  })
})
