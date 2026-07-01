import { describe, it, expect } from 'vitest'
import {
  mosfetSatCurrent,
  mosfetDrainCurrentCLM,
  mosfetOutputResistance,
  mosfetBodyFactor,
  mosfetThresholdBody,
  mosfetSubthresholdSwing,
  mosfetMobilityDegraded,
  mosfetVsatCurrent,
  fermiPotential,
  MATERIALS,
} from '../../lib/junction'

const VT = 1
const k = 0.5e-3
const SI = MATERIALS.Si

describe('channel-length modulation', () => {
  it('reduces to the ideal square law when λ = 0', () => {
    expect(mosfetDrainCurrentCLM(3, 4, VT, k, 0)).toBeCloseTo(mosfetSatCurrent(3, VT, k), 12)
  })

  it('tilts the saturation plateau up with V_DS (finite output slope)', () => {
    const lambda = 0.05
    const a = mosfetDrainCurrentCLM(3, 2, VT, k, lambda) // at the knee
    const b = mosfetDrainCurrentCLM(3, 6, VT, k, lambda) // deeper in saturation
    expect(b).toBeGreaterThan(a)
  })

  it('leaves the triode branch unchanged', () => {
    expect(mosfetDrainCurrentCLM(3, 0.5, VT, k, 0.1)).toBeCloseTo(k * (2 * 0.5 - 0.5 * 0.5 / 2), 12)
  })

  it('output resistance is finite for λ>0 and infinite for λ=0', () => {
    const id = mosfetSatCurrent(3, VT, k)
    expect(mosfetOutputResistance(id, 0.05)).toBeCloseTo(1 / (0.05 * id), 6)
    expect(mosfetOutputResistance(id, 0)).toBe(Infinity)
  })
})

describe('body effect', () => {
  const phiF = fermiPotential(1e17, SI.ni)
  const Cox = 3.9 * 8.854e-14 / 20e-7
  const gamma = mosfetBodyFactor(1e17, SI.epsR, Cox)

  it('body factor γ is positive', () => {
    expect(gamma).toBeGreaterThan(0)
  })

  it('reduces to V_T0 at V_SB = 0 and rises with V_SB', () => {
    expect(mosfetThresholdBody(0.7, gamma, phiF, 0)).toBeCloseTo(0.7, 12)
    const vt1 = mosfetThresholdBody(0.7, gamma, phiF, 1)
    const vt2 = mosfetThresholdBody(0.7, gamma, phiF, 3)
    expect(vt1).toBeGreaterThan(0.7)
    expect(vt2).toBeGreaterThan(vt1) // monotonic in V_SB
  })
})

describe('subthreshold swing', () => {
  it('is ~60 mV/decade at the ideal limit m = 1, T = 300 K', () => {
    expect(mosfetSubthresholdSwing(1, 300) * 1000).toBeCloseTo(59.6, 0) // mV/dec
  })
  it('scales linearly with the ideality factor m', () => {
    expect(mosfetSubthresholdSwing(1.5, 300)).toBeCloseTo(1.5 * mosfetSubthresholdSwing(1, 300), 12)
  })
})

describe('mobility degradation', () => {
  it('equals μ0 at/below threshold and decreases monotonically above it', () => {
    expect(mosfetMobilityDegraded(500, 0.5, 0.5, VT)).toBe(500)
    const m1 = mosfetMobilityDegraded(500, 0.5, 2, VT)
    const m2 = mosfetMobilityDegraded(500, 0.5, 4, VT)
    expect(m1).toBeLessThan(500)
    expect(m2).toBeLessThan(m1)
  })
})

describe('velocity saturation', () => {
  it('is linear in the overdrive (not square law)', () => {
    const i1 = mosfetVsatCurrent(1e-4, 3.45e-7, 2, 1, 1e7) // V_ov = 1
    const i2 = mosfetVsatCurrent(1e-4, 3.45e-7, 3, 1, 1e7) // V_ov = 2
    expect(i2 / i1).toBeCloseTo(2, 6) // doubling overdrive doubles current
  })

  it('the two textbook conventions differ by exactly a factor of two', () => {
    const full = mosfetVsatCurrent(1e-4, 3.45e-7, 3, 1, 1e7, false)
    const half = mosfetVsatCurrent(1e-4, 3.45e-7, 3, 1, 1e7, true)
    expect(full / half).toBeCloseTo(2, 12)
  })

  it('is zero below threshold', () => {
    expect(mosfetVsatCurrent(1e-4, 3.45e-7, 0.5, 1, 1e7)).toBe(0)
  })
})
