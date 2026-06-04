import { describe, it, expect } from 'vitest'
import {
  MATERIALS,
  METALS,
  contactBarrier,
  contactKind,
  e00,
  isAccumulation,
  ohmicState,
  specificContactResistance,
  tunnelRegime,
  type Metal,
} from '../../lib/junction'
import { ohmicContactLecture } from './index'
import { LECTURE_LIST } from '../../registry'

const Si = MATERIALS.Si
const GaAs = MATERIALS.GaAs
const W = METALS.W // φ_B on Si = 0.50
const Pt = METALS.Pt // φ_B on Si = 1.60 (higher barrier)
const LOW_WF: Metal = { key: 'X', he: 'נמוך', phiM: 4.1 } // φ_m < φ_s ⇒ accumulation

describe('ohmic contact — tunneling characteristic energy E₀₀', () => {
  it('rises with √N_D (×4 doping ⇒ ×2 E₀₀)', () => {
    expect(e00(Si, 4e19) / e00(Si, 1e19)).toBeCloseTo(2, 1)
  })

  it('is larger for a lighter tunneling mass (GaAs < Si)', () => {
    expect(e00(GaAs, 1e19)).toBeGreaterThan(e00(Si, 1e19)) // smaller m* → larger E₀₀
  })

  it('is ~33 meV for Si at N_D=1e19', () => {
    expect(e00(Si, 1e19) * 1000).toBeGreaterThan(25)
    expect(e00(Si, 1e19) * 1000).toBeLessThan(45)
  })
})

describe('ohmic contact — transport regime', () => {
  it('thermionic at low doping, field emission (tunneling) when heavily doped', () => {
    expect(tunnelRegime(Si, 1e17)).toBe('TE')
    expect(tunnelRegime(Si, 2e20)).toBe('FE')
  })
})

describe('ohmic contact — specific contact resistance ρ_c', () => {
  it('is FINITE at low doping (the crossover-energy guard, no overflow)', () => {
    expect(Number.isFinite(specificContactResistance(W, Si, 1e17))).toBe(true)
    expect(specificContactResistance(W, Si, 1e17)).toBeGreaterThan(0)
  })

  it('collapses by orders of magnitude as N_D rises', () => {
    expect(specificContactResistance(W, Si, 1e20)).toBeLessThan(specificContactResistance(W, Si, 1e18))
    expect(specificContactResistance(W, Si, 1e20) * 1e3).toBeLessThan(specificContactResistance(W, Si, 1e18))
  })

  it('rises with the barrier height (Pt > W)', () => {
    expect(specificContactResistance(Pt, Si, 1e20)).toBeGreaterThan(specificContactResistance(W, Si, 1e20))
  })

  it('lands in a realistic range for an n⁺ contact', () => {
    const r = specificContactResistance(W, Si, 1e20)
    expect(r).toBeGreaterThan(1e-8)
    expect(r).toBeLessThan(1e-3)
  })
})

describe('ohmic contact — accumulation route & width', () => {
  it('accumulation when φ_m < φ_s, not when the metal rectifies', () => {
    expect(isAccumulation(LOW_WF, Si, 1e17)).toBe(true)
    expect(isAccumulation(METALS.Au, Si, 1e17)).toBe(false)
  })

  it('the depletion width thins with heavier doping', () => {
    expect(ohmicState(W, Si, 1e20).W).toBeLessThan(ohmicState(W, Si, 1e18).W)
  })
})

describe('four fundamental metal–SC cases (n/p × rectifying/ohmic)', () => {
  const chi = Si.chi
  const eg = Si.eg
  it('n-type rectifies when φ_m > φ_s, is ohmic when φ_m < φ_s', () => {
    expect(contactKind('n', 5.1, 4.25)).toBe('rectifying')
    expect(contactKind('n', 4.1, 4.25)).toBe('ohmic')
  })
  it('p-type rectifies when φ_m < φ_s, is ohmic when φ_m > φ_s (flipped from n)', () => {
    expect(contactKind('p', 4.1, 4.95)).toBe('rectifying')
    expect(contactKind('p', 5.4, 4.95)).toBe('ohmic')
  })
  it('barrier heights: n electron-barrier φ_m−χ, p hole-barrier, summing to E_g', () => {
    expect(contactBarrier('n', 5.1, chi, eg)).toBeCloseTo(5.1 - chi, 6)
    expect(contactBarrier('n', 5.1, chi, eg) + contactBarrier('p', 5.1, chi, eg)).toBeCloseTo(eg, 6)
  })
})

describe('lecture registration', () => {
  it('is an explainer, number 2.4, registered in the semiconductors course', () => {
    expect(ohmicContactLecture.explainer).toBe(true)
    expect(ohmicContactLecture.number).toBe(2.4)
    expect(ohmicContactLecture.algorithms).toHaveLength(0)
    expect(ohmicContactLecture.id).toBe('ohmic-contact')
    expect(LECTURE_LIST.some((l) => l.id === 'ohmic-contact')).toBe(true)
  })

  it('carries the full study aids (glossary, formulas, symbols)', () => {
    expect(ohmicContactLecture.glossary?.length).toBeGreaterThan(0)
    expect(ohmicContactLecture.formulas?.length).toBeGreaterThan(0)
    expect(ohmicContactLecture.symbols?.length).toBeGreaterThan(0)
  })
})
