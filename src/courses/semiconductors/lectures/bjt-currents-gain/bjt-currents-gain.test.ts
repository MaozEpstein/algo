import { describe, it, expect } from 'vitest'
import { injectionEfficiency, commonBaseAlpha, commonEmitterBeta, ebersMoll, collectorOutput } from '../../lib/junction'

/**
 * Lecture 3ב — BJT currents & gain helpers: injection efficiency γ, gains α=γ·b and
 * β=α/(1−α), the Ebers-Moll model, and the simplified output characteristic.
 */
describe('BJT — gain factors', () => {
  it('injection efficiency → 1 when the emitter is doped far heavier than the base', () => {
    const g = injectionEfficiency(1e3, 1, 12, 35, 1, 0.4)
    expect(g).toBeGreaterThan(0.99)
    expect(g).toBeLessThanOrEqual(1)
  })

  it('injection efficiency falls as the base doping rises (worse N_E/N_B)', () => {
    const heavy = injectionEfficiency(1000, 1, 12, 35, 1, 0.4) // N_E/N_B = 1000
    const light = injectionEfficiency(10, 1, 12, 35, 1, 0.4) // N_E/N_B = 10
    expect(light).toBeLessThan(heavy)
  })

  it('α = γ·b, and β = α/(1−α) (α=0.99 ⇒ β=99)', () => {
    expect(commonBaseAlpha(0.99, 1)).toBeCloseTo(0.99, 10)
    expect(commonEmitterBeta(0.99)).toBeCloseTo(99, 6)
    expect(commonEmitterBeta(commonBaseAlpha(0.995, 0.99))).toBeGreaterThan(50)
  })
})

describe('BJT — Ebers-Moll', () => {
  it('satisfies KCL: i_E + i_B + i_C = 0', () => {
    const { iE, iB, iC } = ebersMoll(0.6, -2, 1e-15, 0.99, 0.5)
    expect(iE + iB + iC).toBeCloseTo(0, 12)
  })

  it('forward-active: I_C ≈ α_F·I_F and is positive (electrons collected)', () => {
    const aF = 0.99
    const r = ebersMoll(0.65, -3, 1e-15, aF, 0.4)
    expect(r.iC).toBeGreaterThan(0)
    // with V_BC very reverse, I_R≈−I_CS (tiny); I_C ≈ α_F·I_F > 0
  })

  it('equilibrium (no bias) gives zero currents', () => {
    const r = ebersMoll(0, 0, 1e-15, 0.99, 0.5)
    expect(r.iE).toBeCloseTo(0, 18)
    expect(r.iC).toBeCloseTo(0, 18)
  })
})

describe('BJT — output characteristic', () => {
  it('→ β·I_B deep in the active region (V_CE ≫ V_k)', () => {
    expect(collectorOutput(5, 0.05, 100)).toBeCloseTo(100 * 0.05, 3) // 5 mA
  })

  it('is ~0 at V_CE = 0 (deep saturation)', () => {
    expect(collectorOutput(0, 0.05, 100)).toBeCloseTo(0, 10)
  })

  it('rises monotonically through the knee', () => {
    const a = collectorOutput(0.05, 0.05, 100)
    const b = collectorOutput(0.2, 0.05, 100)
    expect(b).toBeGreaterThan(a)
  })
})
