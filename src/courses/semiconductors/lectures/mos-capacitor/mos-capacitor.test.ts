import { describe, it, expect } from 'vitest'
import {
  MATERIALS,
  fermiPotential,
  mosPhiMS,
  oxideCap,
  mosDepletionWidth,
  mosDepletionCharge,
  mosMaxDepletion,
  mosThreshold,
  mosSurfacePotential,
  mosRegime,
  mosSurfaceCharge,
} from '../../lib/junction'

const SI = MATERIALS.Si
const Na = 1e17
const EPS = SI.epsR

describe('MOS — Fermi potential & φ_MS', () => {
  it('φ_F = (kT/q)·ln(N_A/n_i) ≈ 0.41 V for N_A=1e17 (Si, 300K)', () => {
    expect(fermiPotential(Na, SI.ni)).toBeCloseTo(0.02585 * Math.log(Na / SI.ni), 3)
    expect(fermiPotential(Na, SI.ni)).toBeGreaterThan(0.39)
    expect(fermiPotential(Na, SI.ni)).toBeLessThan(0.43)
  })
  it('φ_MS = φ_M − (χ + E_g/2 + φ_F), negative for Al on p-Si', () => {
    const phiF = fermiPotential(Na, SI.ni)
    const phiMS = mosPhiMS(4.28, SI.chi, SI.eg, phiF)
    expect(phiMS).toBeCloseTo(4.28 - (SI.chi + SI.eg / 2 + phiF), 6)
    expect(phiMS).toBeLessThan(0)
  })
})

describe('MOS — oxide capacitance', () => {
  it('C_ox = ε_ox·ε0/t_ox (≈173 nF/cm² at 20 nm)', () => {
    const cox = oxideCap(20e-7)
    expect(cox).toBeCloseTo((3.9 * 8.854e-14) / 20e-7, 18)
    expect(cox * 1e9).toBeGreaterThan(150) // nF/cm²
    expect(cox * 1e9).toBeLessThan(190)
  })
})

describe('MOS — depletion width & charge', () => {
  it('W and Q grow with surface potential; 0 at ψ_s≤0', () => {
    expect(mosDepletionWidth(0, Na, EPS)).toBe(0)
    expect(mosDepletionWidth(0.4, Na, EPS)).toBeGreaterThan(0)
    expect(mosDepletionWidth(0.8, Na, EPS)).toBeGreaterThan(mosDepletionWidth(0.4, Na, EPS))
    expect(mosDepletionCharge(0.8, Na, EPS)).toBeGreaterThan(mosDepletionCharge(0.4, Na, EPS))
  })
  it('W_max ≈ 100 nm at ψ_s = 2φ_F (N_A=1e17)', () => {
    const phiF = fermiPotential(Na, SI.ni)
    const wmax = mosMaxDepletion(phiF, Na, EPS) * 1e7 // nm
    expect(wmax).toBeGreaterThan(90)
    expect(wmax).toBeLessThan(115)
  })
})

describe('MOS — surface potential & regime', () => {
  const phiF = fermiPotential(Na, SI.ni)
  const Cox = oxideCap(20e-7)
  const VFB = mosPhiMS(4.28, SI.chi, SI.eg, phiF)
  const QdMax = mosDepletionCharge(2 * phiF, Na, EPS)
  const VT = mosThreshold(VFB, phiF, QdMax, Cox)

  it('ψ_s = 0 below flat-band, rises in depletion, pins at 2φ_F by threshold', () => {
    expect(mosSurfacePotential(VFB - 1, VFB, Na, EPS, Cox, phiF)).toBe(0)
    const mid = mosSurfacePotential((VFB + VT) / 2, VFB, Na, EPS, Cox, phiF)
    expect(mid).toBeGreaterThan(0)
    expect(mid).toBeLessThan(2 * phiF)
    expect(mosSurfacePotential(VT, VFB, Na, EPS, Cox, phiF)).toBeCloseTo(2 * phiF, 2)
    expect(mosSurfacePotential(VT + 2, VFB, Na, EPS, Cox, phiF)).toBeCloseTo(2 * phiF, 6)
  })
  it('regime boundaries: accumulation / depletion / inversion', () => {
    expect(mosRegime(VFB - 1, VFB, VT)).toBe('accumulation')
    expect(mosRegime((VFB + VT) / 2, VFB, VT)).toBe('depletion')
    expect(mosRegime(VT + 1, VFB, VT)).toBe('inversion')
  })
})

describe('MOS — surface charge Q_s(ψ_s)', () => {
  const phiF = fermiPotential(Na, SI.ni)
  it('is 0 at ψ_s=0 and reduces to Q_dep in depletion', () => {
    expect(mosSurfaceCharge(0, Na, SI.ni, EPS)).toBeCloseTo(0, 12)
    // deep in depletion the exact charge ≈ the depletion-approx charge
    const exact = mosSurfaceCharge(0.4, Na, SI.ni, EPS)
    const approx = mosDepletionCharge(0.4, Na, EPS)
    expect(Math.abs(exact - approx) / approx).toBeLessThan(0.1)
  })
  it('rises as ψ_s goes negative (accumulation)', () => {
    expect(mosSurfaceCharge(-0.2, Na, SI.ni, EPS)).toBeGreaterThan(mosSurfaceCharge(-0.05, Na, SI.ni, EPS))
  })
  it('rises steeply beyond strong inversion (ψ_s > 2φ_F)', () => {
    expect(mosSurfaceCharge(2 * phiF + 0.15, Na, SI.ni, EPS)).toBeGreaterThan(mosSurfaceCharge(2 * phiF, Na, SI.ni, EPS))
  })
})
