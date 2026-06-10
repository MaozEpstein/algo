import { describe, it, expect } from 'vitest'
import { CALCULATORS } from './calculators'

const byId = (id: string) => CALCULATORS.find((c) => c.id === id)!
const num = (s: string) => parseFloat(s.replace(/[^\d.+-]/g, ''))

describe('calculators', () => {
  it('every calculator has ≥2 presets and computes a result', () => {
    for (const c of CALCULATORS) {
      expect(c.presets.length, c.id).toBeGreaterThanOrEqual(2)
      const vals = Object.fromEntries(c.inputs.map((i) => [i.key, i.default]))
      expect(c.compute(vals).length, c.id).toBeGreaterThan(0)
    }
  })
  it('thermal voltage ≈ 25.85 mV at 300K', () => {
    expect(num(byId('vt').compute({ T: 300 })[0].value)).toBeCloseTo(25.85, 1)
  })
  it('oxide cap ≈ 173 nF/cm² at t_ox=20nm', () => {
    expect(num(byId('cox').compute({ tox: 20 })[0].value)).toBeCloseTo(173, 0)
  })
  it('Fermi potential ≈ 0.41 V at N_A=1e17', () => {
    expect(num(byId('phif').compute({ logNa: 17 })[0].value)).toBeCloseTo(0.41, 1)
  })
  it('has 10 calculators including the 5 new ones', () => {
    expect(CALCULATORS).toHaveLength(10)
    for (const id of ['vth', 'qdep', 'einstein', 'beta', 'gm']) expect(byId(id), id).toBeTruthy()
  })
  it('β = α/(1-α): α=0.98 → 49', () => {
    expect(num(byId('beta').compute({ alpha: 0.98 })[0].value)).toBeCloseTo(49, 0)
  })
  it('Einstein D = μ·V_T: μ=1350,300K → ≈34.9 cm²/s', () => {
    expect(num(byId('einstein').compute({ mu: 1350, T: 300 })[0].value)).toBeCloseTo(34.9, 0)
  })
  it('MOS V_T at default is a sensible ~1 V', () => {
    const vt = num(byId('vth').compute({ logNa: 17, tox: 20 })[0].value)
    expect(vt).toBeGreaterThan(0.3)
    expect(vt).toBeLessThan(2)
  })
  it('presets feed compute (built-in voltage symmetric vs asymmetric)', () => {
    const sym = num(byId('vbi').compute(byId('vbi').presets[0].vals)[0].value)
    const asym = num(byId('vbi').compute(byId('vbi').presets[1].vals)[0].value)
    expect(sym).toBeGreaterThan(0)
    expect(asym).toBeGreaterThan(0)
  })
})
