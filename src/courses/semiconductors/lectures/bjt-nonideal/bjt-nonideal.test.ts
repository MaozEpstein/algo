import { describe, it, expect } from 'vitest'
import {
  avalancheMultiplication,
  betaVsIc,
  bvCeo,
  collectorOutput,
  collectorOutputEarly,
  currentGainAC,
  earlyResistance,
  emitterResistance,
  gummelIb,
  gummelIc,
  parallelR,
  rPi,
  transconductance,
  voltageGainCB,
  voltageGainCE,
} from '../../lib/junction'

/** Lecture 3ג — non-ideal BJT helpers: Early effect, breakdown, β(I_C)/Gummel,
 *  small-signal model, and the f_T rolloff. */
describe('BJT — Early effect', () => {
  it('adds an upward slope: I_C(V_CE) with Early > the flat value, and rises with V_CE', () => {
    const flat = collectorOutput(4, 0.02, 100)
    const early = collectorOutputEarly(4, 0.02, 100, 60)
    expect(early).toBeGreaterThan(flat)
    expect(collectorOutputEarly(5, 0.02, 100, 60)).toBeGreaterThan(collectorOutputEarly(2, 0.02, 100, 60))
  })
  it('output resistance r_o = V_A/I_C', () => {
    expect(earlyResistance(60, 1e-3)).toBeCloseTo(60000, 6)
  })
})

describe('BJT — breakdown', () => {
  it('BV_CEO is below BV_CBO and falls as β rises', () => {
    expect(bvCeo(60, 100)).toBeLessThan(60)
    expect(bvCeo(60, 200)).toBeLessThan(bvCeo(60, 50))
  })
  it('avalanche multiplication diverges toward the breakdown voltage', () => {
    expect(avalancheMultiplication(0, 60)).toBeCloseTo(1, 6)
    expect(avalancheMultiplication(55, 60)).toBeGreaterThan(avalancheMultiplication(30, 60))
  })
})

describe('BJT — β(I_C) and Gummel', () => {
  it('β peaks in the mid current range and falls at both extremes', () => {
    const mid = betaVsIc(1e-3, 120, 1e-6, 1e-2)
    const lo = betaVsIc(1e-8, 120, 1e-6, 1e-2)
    const hi = betaVsIc(1e-1, 120, 1e-6, 1e-2)
    expect(mid).toBeGreaterThan(lo)
    expect(mid).toBeGreaterThan(hi)
  })
  it('Gummel: β = I_C/I_B is large in the mid-range (gap between the lines)', () => {
    const vbe = 0.6
    const beta = gummelIc(vbe, 1e-15) / gummelIb(vbe, 1e-15, 120, 2e-13)
    expect(beta).toBeGreaterThan(20)
  })
})

describe('BJT — small-signal & f_T', () => {
  it('g_m = I_C/V_T and r_π = β/g_m', () => {
    const gm = transconductance(1e-3)
    expect(gm).toBeCloseTo(1e-3 / 0.025852, 4)
    expect(rPi(100, gm)).toBeCloseTo(100 / gm, 6)
  })
  it('|β(f)| → β0 at low f and equals 1 at f = f_T', () => {
    expect(currentGainAC(120, 1, 3e8)).toBeCloseTo(120, 1)
    expect(currentGainAC(120, 3e8, 3e8)).toBeCloseTo(1, 1)
  })
  it('parallelR is symmetric and below the smaller resistor', () => {
    expect(parallelR(60000, 5000)).toBeCloseTo(parallelR(5000, 60000), 6)
    expect(parallelR(60000, 5000)).toBeLessThan(5000)
  })
  it('CE voltage gain is negative and saturates at −g_m·r_o as R_C grows', () => {
    const gm = transconductance(1e-3)
    const ro = earlyResistance(60, 1e-3)
    expect(voltageGainCE(gm, ro, 5000)).toBeLessThan(0)
    // huge R_C → gain approaches −g_m·r_o = −V_A/V_T
    expect(Math.abs(voltageGainCE(gm, ro, 1e9))).toBeCloseTo(gm * ro, 0)
  })
  it('CB voltage gain equals the CE gain in magnitude but is positive (non-inverting)', () => {
    const gm = transconductance(1e-3)
    const ro = earlyResistance(60, 1e-3)
    expect(voltageGainCB(gm, ro, 5000)).toBeGreaterThan(0)
    expect(voltageGainCB(gm, ro, 5000)).toBeCloseTo(-voltageGainCE(gm, ro, 5000), 6)
  })
  it('emitter resistance r_e = 1/g_m is low (tens of ohms at 1 mA)', () => {
    const gm = transconductance(1e-3)
    expect(emitterResistance(gm)).toBeCloseTo(1 / gm, 6)
    expect(emitterResistance(gm)).toBeLessThan(40) // ≈ V_T/I_C ≈ 25.9 Ω
  })
})
