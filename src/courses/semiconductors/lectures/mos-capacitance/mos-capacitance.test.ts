import { describe, it, expect } from 'vitest'
import {
  MATERIALS,
  METALS,
  fermiPotential,
  mosPhiMS,
  oxideCap,
  mosThreshold,
  mosDepletionCharge,
  mosDepletionCapacitance,
  mosSemiconductorCap,
  mosCapLF,
  mosCapHF,
  mosCapDeepDepletion,
  mosCVCurve,
  capPerArea,
  mosDepletionWidth,
  type MosCvParams,
} from '../../lib/junction'

const SI = MATERIALS.Si
const AL = METALS.Al
const Na = 1e17
const phiF = fermiPotential(Na, SI.ni)
const Cox = oxideCap(20e-7)
const VFB = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
const VT = mosThreshold(VFB, phiF, mosDepletionCharge(2 * phiF, Na, SI.epsR), Cox)
const P: MosCvParams = { Na, ni: SI.ni, epsR: SI.epsR, Cox, phiF, VFB }
const Cmin = (Cox * capPerArea(SI.epsR, mosDepletionWidth(2 * phiF, Na, SI.epsR))) /
  (Cox + capPerArea(SI.epsR, mosDepletionWidth(2 * phiF, Na, SI.epsR)))

describe('mosDepletionCapacitance', () => {
  it('is infinite at ψ_s→0 and finite/decreasing as ψ_s grows', () => {
    expect(mosDepletionCapacitance(0, Na, SI.epsR)).toBe(Infinity)
    const c1 = mosDepletionCapacitance(0.2, Na, SI.epsR)
    const c2 = mosDepletionCapacitance(0.6, Na, SI.epsR)
    expect(c1).toBeGreaterThan(c2) // wider W → smaller C_dep
    expect(c2).toBeGreaterThan(0)
  })
})

describe('mosSemiconductorCap', () => {
  it('is large in accumulation and small in mid-depletion', () => {
    const cAcc = mosSemiconductorCap(-0.1, Na, SI.ni, SI.epsR)
    const cDep = mosSemiconductorCap(0.3, Na, SI.ni, SI.epsR)
    expect(cAcc).toBeGreaterThan(cDep)
  })
})

describe('C-V curves', () => {
  it('equal C_ox deep in accumulation (all modes)', () => {
    const vg = VFB - 2
    expect(mosCapLF(vg, P)).toBeCloseTo(Cox, 12)
    expect(mosCapHF(vg, P)).toBeCloseTo(Cox, 12)
    expect(mosCapDeepDepletion(vg, P)).toBeCloseTo(Cox, 12)
  })

  it('falls monotonically through depletion', () => {
    const a = mosCapLF(VFB + 0.2, P)
    const b = mosCapLF((VFB + VT) / 2, P)
    expect(a).toBeLessThanOrEqual(Cox)
    expect(b).toBeLessThan(a)
  })

  it('LF recovers toward C_ox in strong inversion; HF locks at C_min', () => {
    const vg = VT + 2
    expect(mosCapLF(vg, P)).toBeGreaterThan(0.99 * Cox) // smoothly recovered to ~C_ox
    expect(mosCapLF(vg, P)).toBeLessThanOrEqual(Cox)
    expect(mosCapLF(VT, P)).toBeCloseTo(Cmin, 10) // continuous with depletion branch at V_T
    expect(mosCapHF(vg, P)).toBeCloseTo(Cmin, 10)
    expect(Cmin).toBeLessThan(Cox)
  })

  it('deep depletion drops below C_min above threshold', () => {
    const vg = VT + 2
    expect(mosCapDeepDepletion(vg, P)).toBeLessThan(mosCapHF(vg, P) + 1e-12)
    expect(mosCapDeepDepletion(vg, P)).toBeLessThan(Cmin)
  })

  it('mosCVCurve returns one C per V_G point', () => {
    const vgs = [VFB - 1, (VFB + VT) / 2, VT + 1]
    const curve = mosCVCurve(vgs, P, 'HF')
    expect(curve).toHaveLength(3)
    expect(curve[0].c).toBeCloseTo(Cox, 12)
    expect(curve.every((p) => p.c > 0 && p.c <= Cox + 1e-12)).toBe(true)
  })
})
