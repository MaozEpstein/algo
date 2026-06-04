import { describe, it, expect } from 'vitest'
import {
  MATERIALS,
  diodeCurrents,
  diodeDynamicResistance,
  lumpedDiodeCurrent,
  nonIdealCurrents,
  recombCurrent,
  terminalVoltage,
  thermalVoltage,
} from '../../lib/junction'
import { nonIdealDiodeLecture } from './index'
import { LECTURE_LIST } from '../../registry'

const Si = MATERIALS.Si
const NA = 1e16
const ND = 1e17
const TAU0 = 1e-6 // effective SRH lifetime (s)

describe('non-ideal diode — recombination & the n=1 / n=2 crossover', () => {
  it('recombination dominates at low forward bias (n=2 regime)', () => {
    const lo = nonIdealCurrents(NA, ND, Si, 0.2, TAU0)
    expect(lo.Jrec).toBeGreaterThan(lo.Jdiff)
  })

  it('diffusion dominates at higher forward bias (n=1 regime)', () => {
    const hi = nonIdealCurrents(NA, ND, Si, 0.55, TAU0)
    expect(hi.Jdiff).toBeGreaterThan(hi.Jrec)
  })

  it('a crossover exists between the two regimes', () => {
    const lo = nonIdealCurrents(NA, ND, Si, 0.2, TAU0)
    const hi = nonIdealCurrents(NA, ND, Si, 0.55, TAU0)
    // Jdiff−Jrec flips sign between the two points ⇒ they cross somewhere between
    expect(Math.sign(lo.Jdiff - lo.Jrec)).not.toBe(Math.sign(hi.Jdiff - hi.Jrec))
  })

  it('Jtot is the sum of the two branches', () => {
    const c = nonIdealCurrents(NA, ND, Si, 0.4, TAU0)
    expect(c.Jtot).toBeCloseTo(c.Jdiff + c.Jrec, 20)
  })

  it('the recombination branch carries about half the log-slope of diffusion (n=2 vs n=1)', () => {
    // local slope of log10(J) w.r.t. V, sampled symmetrically
    const slope = (f: (v: number) => number, v: number, h = 1e-3) =>
      (Math.log10(f(v + h)) - Math.log10(f(v - h))) / (2 * h)
    const v = 0.25
    const sDiff = slope((x) => diodeCurrents(NA, ND, Si, x).J, v)
    const sRec = slope((x) => recombCurrent(NA, ND, Si, x, TAU0), v)
    // ~2× (the W(V) widening shaves the recombination slope a touch below VT/2)
    expect(sDiff / sRec).toBeGreaterThan(1.8)
    expect(sDiff / sRec).toBeLessThan(2.3)
  })
})

describe('non-ideal diode — non-saturating reverse current', () => {
  it('the reverse current GROWS in magnitude with reverse bias (∝ W), unlike the ideal −J_S', () => {
    const r1 = nonIdealCurrents(NA, ND, Si, -1, TAU0)
    const r5 = nonIdealCurrents(NA, ND, Si, -5, TAU0)
    expect(Math.abs(r5.Jtot)).toBeGreaterThan(Math.abs(r1.Jtot))
    expect(r5.W).toBeGreaterThan(r1.W) // the √(V_bi+|V|) widening is what drives it
    expect(r5.Jtot).toBeLessThan(0) // it is a (small) reverse current
  })
})

describe('non-ideal diode — series resistance & the lumped model', () => {
  it('terminal voltage adds the I·R_s drop and shifts the curve to the right', () => {
    const c = nonIdealCurrents(NA, ND, Si, 0.6, TAU0)
    const rs = 0.5 // Ω·cm²
    expect(terminalVoltage(0.6, c.Jtot, rs)).toBeCloseTo(0.6 + c.Jtot * rs, 6)
    expect(terminalVoltage(0.6, c.Jtot, rs)).toBeGreaterThan(0.6) // bend is to the right
  })

  it('the lumped model with n=2 has half the log-slope of n=1', () => {
    const slope = (n: number, v: number, h = 1e-3) =>
      (Math.log10(lumpedDiodeCurrent(NA, ND, Si, v + h, n)) -
        Math.log10(lumpedDiodeCurrent(NA, ND, Si, v - h, n))) /
      (2 * h)
    expect(slope(1, 0.3) / slope(2, 0.3)).toBeCloseTo(2, 1)
  })
})

describe('non-ideal diode — ideal limit', () => {
  it('as τ₀→∞ the recombination current vanishes and Jtot recovers Shockley', () => {
    const ideal = nonIdealCurrents(NA, ND, Si, 0.3, 1e30)
    expect(Math.abs(ideal.Jrec)).toBeLessThan(Math.abs(ideal.Jdiff) * 1e-6)
    expect(ideal.Jtot).toBeCloseTo(diodeCurrents(NA, ND, Si, 0.3).J, 5)
  })

  it('the n=2 forward current grows slower than the n=1 diffusion current', () => {
    const v1 = recombCurrent(NA, ND, Si, 0.2, TAU0)
    const v2 = recombCurrent(NA, ND, Si, 0.3, TAU0)
    expect(v1).toBeGreaterThan(0)
    expect(v2).toBeGreaterThan(v1)
    // over 0.1 V it grows by ~e^{0.1/2V_T}, strictly less than the n=1 e^{0.1/V_T}
    const grow = v2 / v1
    expect(grow).toBeGreaterThan(4)
    expect(grow).toBeLessThan(Math.exp(0.1 / thermalVoltage(300)))
  })
})

describe('non-ideal diode — high-level injection & dynamic resistance', () => {
  it('high injection rolls the diffusion slope toward n=2 above the knee', () => {
    const jkf = 1e-3
    const jHL = (v: number) => nonIdealCurrents(NA, ND, Si, v, 1e30, 300, jkf).Jdiff // τ₀ huge → isolate diffusion
    const jId = (v: number) => nonIdealCurrents(NA, ND, Si, v, 1e30, 300).Jdiff
    const slope = (f: (v: number) => number, v: number, h = 1e-3) => (Math.log(f(v + h)) - Math.log(f(v - h))) / (2 * h)
    expect(jHL(0.6)).toBeLessThan(jId(0.6)) // rolled below the ideal line
    const r = slope(jId, 0.6) / slope(jHL, 0.6)
    expect(r).toBeGreaterThan(1.9) // ≈ ×2 (half the log-slope ⇒ n→2)
    expect(r).toBeLessThan(2.1)
  })

  it('dynamic resistance r_d = n·V_T/I scales with n and drops as 1/I', () => {
    expect(diodeDynamicResistance(1, 1e-3)).toBeCloseTo(thermalVoltage(300) / 1e-3, 8)
    expect(diodeDynamicResistance(2, 1e-3)).toBeCloseTo(2 * diodeDynamicResistance(1, 1e-3), 8)
    expect(diodeDynamicResistance(1, 1e-2)).toBeLessThan(diodeDynamicResistance(1, 1e-3))
  })
})

describe('lecture registration', () => {
  it('is an explainer, number 2.2, registered in the semiconductors course', () => {
    expect(nonIdealDiodeLecture.explainer).toBe(true)
    expect(nonIdealDiodeLecture.number).toBe(2.2)
    expect(nonIdealDiodeLecture.algorithms).toHaveLength(0)
    expect(nonIdealDiodeLecture.id).toBe('non-ideal-diode')
    expect(LECTURE_LIST.some((l) => l.id === 'non-ideal-diode')).toBe(true)
  })

  it('carries the full study aids (glossary, formulas, variables dictionary)', () => {
    expect(nonIdealDiodeLecture.glossary?.length).toBeGreaterThan(0)
    expect(nonIdealDiodeLecture.formulas?.length).toBeGreaterThan(0)
    expect(nonIdealDiodeLecture.symbols?.length).toBeGreaterThan(0)
  })
})
