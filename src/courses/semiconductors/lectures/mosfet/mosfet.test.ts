import { describe, it, expect } from 'vitest'
import {
  mosfetK,
  mosfetVdsat,
  mosfetRegion,
  mosfetDrainCurrent,
  mosfetSatCurrent,
  mosfetGm,
  mosfetGds,
} from '../../lib/junction'

// A representative long-channel n-MOSFET operating point.
const VT = 1 // V
const k = 0.5e-3 // A/V²  (= (W/L)·μ*·C_ox)

describe('mosfetK', () => {
  it('is the product (W/L)·μ*·C_ox', () => {
    expect(mosfetK(10, 500, 1e-7)).toBeCloseTo(10 * 500 * 1e-7, 15)
  })
})

describe('mosfetVdsat', () => {
  it('equals the overdrive V_GS − V_T, clamped at 0 below threshold', () => {
    expect(mosfetVdsat(3, VT)).toBeCloseTo(2, 12)
    expect(mosfetVdsat(0.5, VT)).toBe(0)
  })
})

describe('mosfetRegion', () => {
  it('is cutoff below threshold', () => {
    expect(mosfetRegion(0.5, 2, VT)).toBe('cutoff')
    expect(mosfetRegion(VT, 2, VT)).toBe('cutoff') // V_GS = V_T is still off
  })
  it('is triode below the knee and saturation at/above it', () => {
    const vov = 2 // V_GS = 3
    expect(mosfetRegion(3, vov - 0.1, VT)).toBe('triode')
    expect(mosfetRegion(3, vov, VT)).toBe('saturation')
    expect(mosfetRegion(3, vov + 1, VT)).toBe('saturation')
  })
})

describe('mosfetDrainCurrent', () => {
  it('is zero in cutoff', () => {
    expect(mosfetDrainCurrent(0.5, 2, VT, k)).toBe(0)
  })

  it('is continuous at the knee (triode branch meets the saturation plateau)', () => {
    const VGS = 3
    const vov = VGS - VT // 2
    const triodeAtKnee = mosfetDrainCurrent(VGS, vov - 1e-6, VT, k)
    const satAtKnee = mosfetDrainCurrent(VGS, vov, VT, k)
    expect(triodeAtKnee).toBeCloseTo(satAtKnee, 6)
    // and both equal the square-law value (k/2)·V_ov²
    expect(satAtKnee).toBeCloseTo((k / 2) * vov * vov, 12)
  })

  it('saturation current is flat beyond the knee (ideal — no channel-length modulation)', () => {
    const VGS = 3
    const a = mosfetDrainCurrent(VGS, 3, VT, k)
    const b = mosfetDrainCurrent(VGS, 5, VT, k)
    expect(a).toBeCloseTo(b, 12)
  })

  it('obeys the square law in saturation via mosfetSatCurrent', () => {
    expect(mosfetSatCurrent(3, VT, k)).toBeCloseTo((k / 2) * 2 * 2, 12)
    expect(mosfetSatCurrent(0.5, VT, k)).toBe(0)
  })
})

describe('mosfetGm / mosfetGds', () => {
  it('g_m in saturation is k·(V_GS − V_T) and equals √(2 k I_D)', () => {
    const VGS = 3
    const gm = mosfetGm(VGS, 5, VT, k) // deep in saturation
    expect(gm).toBeCloseTo(k * (VGS - VT), 12)
    const id = mosfetSatCurrent(VGS, VT, k)
    expect(gm).toBeCloseTo(Math.sqrt(2 * k * id), 9)
  })

  it('g_m in triode is k·V_DS', () => {
    expect(mosfetGm(3, 0.5, VT, k)).toBeCloseTo(k * 0.5, 12)
  })

  it('g_ds is zero in ideal saturation and positive in triode', () => {
    expect(mosfetGds(3, 5, VT, k)).toBe(0)
    expect(mosfetGds(3, 0.5, VT, k)).toBeGreaterThan(0)
  })

  it('everything is zero in cutoff', () => {
    expect(mosfetGm(0.5, 2, VT, k)).toBe(0)
    expect(mosfetGds(0.5, 2, VT, k)).toBe(0)
  })
})
