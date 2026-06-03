import { describe, it, expect } from 'vitest'
import {
  MATERIALS,
  conductionLevel,
  diffusionCoeff,
  diffusionLength,
  diodeCurrents,
  effectiveLength,
  shortBaseCurrentFactor,
  shortBaseProfile,
  thermalVoltage,
} from '../../lib/junction'
import { idealDiodeLecture } from './index'
import { LECTURE_LIST } from '../../registry'

const Si = MATERIALS.Si
const Ge = MATERIALS.Ge

describe('ideal diode — physics', () => {
  it('Einstein relation and diffusion length are positive and consistent', () => {
    const D = diffusionCoeff(Si.mup, 300)
    expect(D).toBeCloseTo(thermalVoltage(300) * Si.mup, 6)
    expect(diffusionLength(D, Si.taup)).toBeCloseTo(Math.sqrt(D * Si.taup), 12)
  })

  it('saturation current is positive and splits into electron + hole parts', () => {
    const c = diodeCurrents(1e16, 1e17, Si, 0, 300)
    expect(c.Js).toBeGreaterThan(0)
    expect(c.JsP).toBeGreaterThan(0)
    expect(c.JsN).toBeGreaterThan(0)
    expect(c.Js).toBeCloseTo(c.JsP + c.JsN, 20)
  })

  it('the less-doped side dominates the injection', () => {
    // N_A < N_D  ⇒  electron injection into p (J_{S,n}) dominates
    expect(diodeCurrents(1e16, 1e17, Si, 0, 300).JsN).toBeGreaterThan(diodeCurrents(1e16, 1e17, Si, 0, 300).JsP)
    // swap the doping ⇒  hole injection dominates
    expect(diodeCurrents(1e17, 1e16, Si, 0, 300).JsP).toBeGreaterThan(diodeCurrents(1e17, 1e16, Si, 0, 300).JsN)
  })

  it('narrower-gap Ge has a much larger saturation current than Si', () => {
    const jsSi = diodeCurrents(1e16, 1e17, Si, 0, 300).Js
    const jsGe = diodeCurrents(1e16, 1e17, Ge, 0, 300).Js
    expect(jsGe).toBeGreaterThan(jsSi)
  })

  it('saturation current rises with temperature (∝ n_i²)', () => {
    const cold = diodeCurrents(1e16, 1e17, Si, 0, 300).Js
    const hot = diodeCurrents(1e16, 1e17, Si, 0, 350).Js
    expect(hot).toBeGreaterThan(cold)
  })

  it('Shockley I–V: zero at equilibrium, exponential forward, saturated reverse', () => {
    const Js = diodeCurrents(1e16, 1e17, Si, 0, 300).Js
    expect(diodeCurrents(1e16, 1e17, Si, 0, 300).J).toBeCloseTo(0, 20)
    // forward grows exponentially
    const f1 = diodeCurrents(1e16, 1e17, Si, 0.4, 300).J
    const f2 = diodeCurrents(1e16, 1e17, Si, 0.5, 300).J
    expect(f1).toBeGreaterThan(0)
    expect(f2).toBeGreaterThan(f1)
    expect(f2 / f1).toBeCloseTo(Math.exp(0.1 / thermalVoltage(300)), 0)
    // reverse saturates at −J_S (within e^{−0.5/V_T} of it)
    expect(diodeCurrents(1e16, 1e17, Si, -0.5, 300).J).toBeCloseTo(-Js, 12)
  })
})

describe('long vs short base diode', () => {
  const L = 1e-3 // cm

  it('long base (W_B ≫ L) recovers the exponential profile and L_eff → L', () => {
    const WB = 10 * L
    expect(shortBaseProfile(0, WB, L)).toBeCloseTo(1, 6) // Δp(0)/Δp(0)=1
    expect(shortBaseProfile(0.5 * L, WB, L)).toBeCloseTo(Math.exp(-0.5), 3)
    expect(effectiveLength(WB, L)).toBeGreaterThan(0.99 * L) // tanh(10)≈1
    expect(shortBaseCurrentFactor(WB, L)).toBeCloseTo(1, 3)
  })

  it('short base (W_B ≪ L) gives a linear profile and L_eff → W_B', () => {
    const WB = 0.05 * L
    // midpoint of a linear profile sits at ~0.5
    expect(shortBaseProfile(0.5 * WB, WB, L)).toBeCloseTo(0.5, 2)
    expect(effectiveLength(WB, L)).toBeLessThan(L) // shorter effective length
    expect(effectiveLength(WB, L)).toBeGreaterThan(0.9 * WB) // → W_B
    expect(shortBaseCurrentFactor(WB, L)).toBeGreaterThan(15) // coth(0.05)≈20 → big boost
  })

  it('the excess minority vanishes at the ohmic contact (x = W_B)', () => {
    expect(shortBaseProfile(2e-4, 2e-4, 5e-4)).toBeCloseTo(0, 10)
  })
})

describe('conductionLevel — circuit-animation drive (perceptual 0..1)', () => {
  it('is 0 for reverse and equilibrium (blocked), within [0,1] everywhere', () => {
    expect(conductionLevel(1e16, 1e17, Si, -2, 300)).toBe(0)
    expect(conductionLevel(1e16, 1e17, Si, 0, 300)).toBe(0)
    for (const v of [-1, 0, 0.3, 0.6, 0.9]) {
      const l = conductionLevel(1e16, 1e17, Si, v, 300)
      expect(l).toBeGreaterThanOrEqual(0)
      expect(l).toBeLessThanOrEqual(1)
    }
  })

  it('rises monotonically through forward bias and saturates at 1', () => {
    const a = conductionLevel(1e16, 1e17, Si, 0.4, 300)
    const b = conductionLevel(1e16, 1e17, Si, 0.55, 300)
    const c = conductionLevel(1e16, 1e17, Si, 0.7, 300)
    expect(b).toBeGreaterThan(a)
    expect(c).toBeGreaterThan(b)
    expect(conductionLevel(1e16, 1e17, Si, 1.0, 300)).toBe(1)
  })

  it('a narrower-gap material (Ge) lights up at a lower forward voltage', () => {
    expect(conductionLevel(1e16, 1e17, Ge, 0.4, 300)).toBeGreaterThan(conductionLevel(1e16, 1e17, Si, 0.4, 300))
  })
})

describe('lecture registration', () => {
  it('is an explainer, number 2.1, registered in the semiconductors course', () => {
    expect(idealDiodeLecture.explainer).toBe(true)
    expect(idealDiodeLecture.number).toBe(2.1)
    expect(idealDiodeLecture.algorithms).toHaveLength(0)
    expect(idealDiodeLecture.id).toBe('ideal-diode')
    expect(LECTURE_LIST.some((l) => l.id === 'ideal-diode')).toBe(true)
  })

  it('carries the full study aids (glossary, formulas, variables dictionary)', () => {
    expect(idealDiodeLecture.glossary?.length).toBeGreaterThan(0)
    expect(idealDiodeLecture.formulas?.length).toBeGreaterThan(0)
    expect(idealDiodeLecture.symbols?.length).toBeGreaterThan(0)
  })
})
