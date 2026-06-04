import { describe, it, expect } from 'vitest'
import {
  MATERIALS,
  METALS,
  METAL_LIST,
  bulkOffset,
  diodeCurrents,
  fermiAboveNeutral,
  isRectifying,
  neutralLevel,
  pinnedBarrier,
  pinningFactor,
  schottkyBarrier,
  schottkyCurrent,
  schottkyState,
  schottkyTurnOn,
  schottkyVbi,
  schottkyWidth,
  surfaceBarrier,
  thermalVoltage,
  thermionicJst,
} from '../../lib/junction'
import { schottkyDiodeLecture } from './index'
import { LECTURE_LIST } from '../../registry'

const Si = MATERIALS.Si
const GaAs = MATERIALS.GaAs
const Au = METALS.Au // φ_m = 5.1
const W = METALS.W // φ_m = 4.55 → φ_B = 0.5 (moderate barrier)
const VT = thermalVoltage(300)
const ND = 1e17

describe('Schottky — barrier, built-in potential, rectifying criterion', () => {
  it('barrier height φ_B = φ_m − χ', () => {
    expect(schottkyBarrier(Au.phiM, Si.chi)).toBeCloseTo(1.05, 6) // Au on Si
    expect(schottkyBarrier(W.phiM, Si.chi)).toBeCloseTo(0.5, 6)
  })

  it('built-in potential is the barrier minus the bulk offset (V_bi = φ_B − ξ)', () => {
    const Vbi = schottkyVbi(Au.phiM, Si.chi, Si.nc, ND, 300)
    expect(Vbi).toBeCloseTo(schottkyBarrier(Au.phiM, Si.chi) - bulkOffset(Si.nc, ND, 300), 10)
    expect(Vbi).toBeGreaterThan(0)
  })

  it('bulk offset ξ > 0 for non-degenerate doping, and degenerate is flagged when N_D ≥ N_c', () => {
    expect(bulkOffset(Si.nc, ND, 300)).toBeGreaterThan(0) // N_D ≪ N_c
    expect(schottkyState(Au, Si, 1e17, 0).degenerate).toBe(false)
    expect(schottkyState(Au, Si, 1e20, 0).degenerate).toBe(true) // N_D > N_c
  })

  it('rectifies for a high-work-function metal, ohmic for φ_m < χ + ξ', () => {
    expect(isRectifying(Au.phiM, Si.chi, Si.nc, ND)).toBe(true)
    // a synthetic low work function below χ+ξ ⇒ V_bi < 0 ⇒ ohmic
    expect(isRectifying(4.1, Si.chi, Si.nc, ND)).toBe(false)
  })
})

describe('Schottky — thermionic emission current', () => {
  const phiB = schottkyBarrier(W.phiM, Si.chi) // 0.5

  it('zero at equilibrium', () => {
    expect(schottkyCurrent(Si.astar, phiB, 0)).toBeCloseTo(0, 12)
  })

  it('reverse current SATURATES at −J_ST (unlike the non-ideal PN diode, which grows)', () => {
    const Jst = thermionicJst(Si.astar, phiB)
    const j1 = schottkyCurrent(Si.astar, phiB, -1)
    const j5 = schottkyCurrent(Si.astar, phiB, -5)
    expect(j5).toBeLessThan(0)
    expect(Math.abs(j5 - j1)).toBeLessThan(Jst * 1e-3) // flat — no √(V) growth
    expect(j5).toBeCloseTo(-Jst, 6)
  })

  it('forward current rises ~e^{V/V_T} with ideality ≈ 1', () => {
    const ratio = schottkyCurrent(Si.astar, phiB, 0.3) / schottkyCurrent(Si.astar, phiB, 0.2)
    expect(ratio).toBeCloseTo(Math.exp(0.1 / VT), 0)
  })

  it('higher barrier ⇒ smaller J_ST, lower current, higher turn-on', () => {
    expect(thermionicJst(Si.astar, 1.0)).toBeLessThan(thermionicJst(Si.astar, 0.5))
    expect(schottkyCurrent(Si.astar, 1.0, 0.3)).toBeLessThan(schottkyCurrent(Si.astar, 0.5, 0.3))
    expect(schottkyTurnOn(Si.astar, 1.0)).toBeGreaterThan(schottkyTurnOn(Si.astar, 0.5))
  })
})

describe('Schottky vs PN — the headline contrasts', () => {
  const phiB = schottkyBarrier(W.phiM, Si.chi) // 0.5, moderate

  it('J_ST ≫ the PN saturation current ⇒ lower turn-on', () => {
    const Jst = thermionicJst(Si.astar, phiB)
    const Js = diodeCurrents(1e16, ND, Si, 0).Js
    expect(Jst / Js).toBeGreaterThan(1e4)
    expect(schottkyTurnOn(Si.astar, phiB)).toBeLessThan(0.6) // below a Si PN knee
  })

  it('A* is per-material: Si vs GaAs differ by ~13× at the same barrier', () => {
    const r = thermionicJst(Si.astar, 0.5) / thermionicJst(GaAs.astar, 0.5)
    expect(r).toBeGreaterThan(11)
    expect(r).toBeLessThan(15) // 110/8.2 ≈ 13.4
  })
})

describe('Schottky — one-sided depletion width', () => {
  it('shrinks under forward bias and grows under reverse', () => {
    const Vbi = schottkyVbi(Au.phiM, Si.chi, Si.nc, ND)
    const w0 = schottkyWidth(Si, ND, 0, Vbi)
    expect(schottkyWidth(Si, ND, 0.3, Vbi)).toBeLessThan(w0)
    expect(schottkyWidth(Si, ND, -2, Vbi)).toBeGreaterThan(w0)
  })
})

describe('Schottky — surface states / Fermi-level pinning', () => {
  const eg = Si.eg // 1.12
  const chi = Si.chi // 4.05
  const Dcrit = 1e13

  it('neutral level is E_g/3 above E_v; pinned barrier is ⅔E_g', () => {
    expect(neutralLevel(eg)).toBeCloseTo(eg / 3, 10)
    expect(pinnedBarrier(eg)).toBeCloseTo((2 / 3) * eg, 10) // ≈0.747 for Si
  })

  it('pinning factor: S(0)=1, S(Dcrit)=0.5, S→0 as D_it→∞, monotone decreasing', () => {
    expect(pinningFactor(0)).toBe(1)
    expect(pinningFactor(Dcrit)).toBeCloseTo(0.5, 10)
    expect(pinningFactor(1e18)).toBeLessThan(1e-3)
    expect(pinningFactor(1e12)).toBeGreaterThan(pinningFactor(1e13))
  })

  it('passivated surface (~1e11) near-ideal; real Si (~1e14) strongly pinned', () => {
    expect(pinningFactor(1e11)).toBeGreaterThan(0.9)
    expect(pinningFactor(1e14)).toBeLessThan(0.1)
  })

  it('surfaceBarrier → φ_m−χ at small D_it, → ⅔E_g at large D_it', () => {
    expect(surfaceBarrier(Au.phiM, chi, eg, 1e10)).toBeCloseTo(schottkyBarrier(Au.phiM, chi), 2)
    expect(surfaceBarrier(Au.phiM, chi, eg, 1e16)).toBeCloseTo(pinnedBarrier(eg), 2)
  })

  it('pinning collapses the metal spread (metal-independent at high D_it)', () => {
    const hi = METAL_LIST.map((m) => surfaceBarrier(m.phiM, chi, eg, 1e15))
    expect(Math.max(...hi) - Math.min(...hi)).toBeLessThan(0.05)
    const lo = METAL_LIST.map((m) => surfaceBarrier(m.phiM, chi, eg, 1e10))
    expect(Math.max(...lo) - Math.min(...lo)).toBeGreaterThan(0.8) // wide spread (clamped at E_g)
  })

  it('barrier clamped to [0, E_g]; E_F−E_0 collapses to 0 under strong pinning', () => {
    expect(surfaceBarrier(10, chi, eg, 0)).toBeLessThanOrEqual(eg)
    expect(fermiAboveNeutral(Au.phiM, chi, eg, 1e16)).toBeCloseTo(0, 2)
  })
})

describe('lecture registration', () => {
  it('is an explainer, number 2.3, registered in the semiconductors course', () => {
    expect(schottkyDiodeLecture.explainer).toBe(true)
    expect(schottkyDiodeLecture.number).toBe(2.3)
    expect(schottkyDiodeLecture.algorithms).toHaveLength(0)
    expect(schottkyDiodeLecture.id).toBe('schottky-diode')
    expect(LECTURE_LIST.some((l) => l.id === 'schottky-diode')).toBe(true)
  })

  it('carries the full study aids (glossary, formulas, symbols)', () => {
    expect(schottkyDiodeLecture.glossary?.length).toBeGreaterThan(0)
    expect(schottkyDiodeLecture.formulas?.length).toBeGreaterThan(0)
    expect(schottkyDiodeLecture.symbols?.length).toBeGreaterThan(0)
  })
})
