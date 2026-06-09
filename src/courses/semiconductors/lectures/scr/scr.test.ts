import { describe, it, expect } from 'vitest'
import { scrAlphaSum, scrAnodeCurrent, breakoverVoltage, scrCurve } from '../../lib/junction'

describe('SCR — latch (two-transistor model)', () => {
  it('anode current rises steeply and diverges as α1+α2 → 1⁻', () => {
    const below = scrAnodeCurrent(0.4, 0.4, 1e-3, 1e-6) // sum 0.8
    const near = scrAnodeCurrent(0.49, 0.49, 1e-3, 1e-6) // sum 0.98
    expect(near).toBeGreaterThan(below)
    expect(scrAnodeCurrent(0.5, 0.5, 1e-3, 1e-6)).toBe(Infinity) // sum = 1 → latched
    expect(scrAnodeCurrent(0.6, 0.6, 1e-3, 1e-6)).toBe(Infinity) // sum > 1 → latched
  })
  it('the latch boundary is the SUM α1+α2=1 (⇔ β1β2=1)', () => {
    expect(scrAlphaSum(0.5, 0.5)).toBe(1)
    const a = 0.5
    const beta = a / (1 - a) // β1=β2=1 at α=0.5 → β1β2=1
    expect(beta * beta).toBeCloseTo(1, 6)
  })
})

describe('SCR — breakover voltage', () => {
  it('decreases as the gate current increases', () => {
    expect(breakoverVoltage(0)).toBeGreaterThan(breakoverVoltage(1e-4))
    expect(breakoverVoltage(1e-4)).toBeGreaterThan(breakoverVoltage(1e-3))
  })
})

describe('SCR — forward characteristic (S-curve)', () => {
  const pts = scrCurve(0, { VBO0: 8, Ih: 0.4, Von: 1.1, Imax: 5 })
  it('reaches the on-state current (~I_max)', () => {
    expect(Math.max(...pts.map((p) => p.I))).toBeCloseTo(5, 1)
  })
  it('contains an NDR fold: somewhere V decreases while I increases', () => {
    const ndr = pts.some((p, i) => i > 0 && p.V < pts[i - 1].V && p.I > pts[i - 1].I)
    expect(ndr).toBe(true)
  })
  it('breakover voltage (peak forward V) drops with gate drive', () => {
    const vbf0 = Math.max(...scrCurve(0).map((p) => p.V))
    const vbfHi = Math.max(...scrCurve(0.9).map((p) => p.V))
    expect(vbfHi).toBeLessThan(vbf0)
  })
})
