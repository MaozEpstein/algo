import { describe, it, expect } from 'vitest'
import { MATERIALS, builtInVoltage, junctionState, niAt, thermalVoltage } from '../../lib/junction'
import { pnJunctionEqLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('PN junction physics', () => {
  it('thermal voltage ≈ 25.85 mV at 300K', () => {
    expect(thermalVoltage(300)).toBeCloseTo(0.02585, 4)
  })

  it('built-in voltage for symmetric Si junction (1e16) ≈ 0.70 V', () => {
    const vbi = builtInVoltage(1e16, 1e16, MATERIALS.Si.ni)
    expect(vbi).toBeGreaterThan(0.66)
    expect(vbi).toBeLessThan(0.74)
  })

  it('V_bi grows with doping', () => {
    const lo = builtInVoltage(1e15, 1e15, MATERIALS.Si.ni)
    const hi = builtInVoltage(1e18, 1e18, MATERIALS.Si.ni)
    expect(hi).toBeGreaterThan(lo)
  })

  it('charge neutrality: N_A·d_p = N_D·d_n, and d = d_n + d_p', () => {
    const s = junctionState(2e16, 5e15, MATERIALS.Si)
    expect(2e16 * s.dp).toBeCloseTo(5e15 * s.dn, 4)
    expect(s.d).toBeCloseTo(s.dn + s.dp, 12)
  })

  it('peak field equals 2·V_bi/d at equilibrium', () => {
    const s = junctionState(1e16, 1e16, MATERIALS.Si)
    expect(s.Emax).toBeCloseTo((2 * s.Vbi) / s.d, 0)
  })

  it('heavier doping ⇒ thinner depletion region and higher peak field', () => {
    const light = junctionState(1e15, 1e15, MATERIALS.Si)
    const heavy = junctionState(1e18, 1e18, MATERIALS.Si)
    expect(heavy.d).toBeLessThan(light.d)
    expect(heavy.Emax).toBeGreaterThan(light.Emax)
  })

  it('forward bias shrinks the depletion region vs equilibrium', () => {
    const eq = junctionState(1e16, 1e16, MATERIALS.Si, 0)
    const fwd = junctionState(1e16, 1e16, MATERIALS.Si, 0.4)
    expect(fwd.d).toBeLessThan(eq.d)
  })

  it('one-sided junction: depletion sits mostly in the lightly-doped side', () => {
    // n+ p junction (Nd >> Na) → most depletion on the p-side
    const s = junctionState(1e15, 1e18, MATERIALS.Si)
    expect(s.dp).toBeGreaterThan(s.dn)
  })

  it('n_i(T): equals the 300K value at 300K and rises with temperature', () => {
    expect(niAt(MATERIALS.Si, 300)).toBeCloseTo(MATERIALS.Si.ni, 0)
    expect(niAt(MATERIALS.Si, 400)).toBeGreaterThan(niAt(MATERIALS.Si, 300))
  })

  it('V_bi drops as the junction heats up (n_i grows)', () => {
    const cool = junctionState(1e16, 1e16, MATERIALS.Si, 0, 300)
    const hot = junctionState(1e16, 1e16, MATERIALS.Si, 0, 400)
    expect(hot.Vbi).toBeLessThan(cool.Vbi)
  })
})

describe('lecture registration', () => {
  it('is an explainer, number 1.1, registered in the semiconductors course', () => {
    expect(pnJunctionEqLecture.explainer).toBe(true)
    expect(pnJunctionEqLecture.number).toBe(1.1)
    expect(pnJunctionEqLecture.algorithms).toHaveLength(0)
    expect(pnJunctionEqLecture.id).toBe('pn-junction-equilibrium')
    expect(LECTURE_LIST.some((l) => l.id === 'pn-junction-equilibrium')).toBe(true)
  })
})
