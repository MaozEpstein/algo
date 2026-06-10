import { describe, it, expect } from 'vitest'
import {
  jfetPinchoff,
  jfetChannelOpening,
  jfetVdsat,
  jfetRegion,
  jfetTransfer,
  jfetDrainCurrent,
  jfetGm,
} from '../../lib/junction'

describe('JFET — pinch-off voltage', () => {
  it('matches |V_P| = q·N_D·a²/(2ε_s)', () => {
    const Q = 1.602e-19
    const EPS0 = 8.854e-14
    const Nd = 1e16
    const a = 0.5e-4 // cm
    const epsR = 11.8
    const expected = (Q * Nd * a * a) / (2 * epsR * EPS0)
    expect(jfetPinchoff(Nd, a, epsR)).toBeCloseTo(expected, 12)
  })
  it('grows with doping and with channel width', () => {
    expect(jfetPinchoff(2e16, 0.5e-4, 11.8)).toBeGreaterThan(jfetPinchoff(1e16, 0.5e-4, 11.8))
    expect(jfetPinchoff(1e16, 0.7e-4, 11.8)).toBeGreaterThan(jfetPinchoff(1e16, 0.5e-4, 11.8))
  })
})

describe('JFET — channel opening', () => {
  it('is full (=a) at zero reverse bias and closed (0) at pinch-off', () => {
    expect(jfetChannelOpening(40, 0, 4)).toBeCloseTo(40, 6)
    expect(jfetChannelOpening(40, 4, 4)).toBeCloseTo(0, 6)
  })
  it('shrinks monotonically with reverse bias and clamps at 0 beyond pinch-off', () => {
    expect(jfetChannelOpening(40, 1, 4)).toBeGreaterThan(jfetChannelOpening(40, 2, 4))
    expect(jfetChannelOpening(40, 9, 4)).toBe(0)
  })
})

describe('JFET — operating region', () => {
  it('V_Dsat = |V_P| − |V_GS|', () => {
    expect(jfetVdsat(1, 4)).toBeCloseTo(3, 6)
    expect(jfetVdsat(4, 4)).toBeCloseTo(0, 6)
  })
  it('cutoff / ohmic / saturation boundaries', () => {
    expect(jfetRegion(4, 2, 4)).toBe('cutoff')
    expect(jfetRegion(1, 2, 4)).toBe('ohmic') // Vdsat = 3
    expect(jfetRegion(1, 3, 4)).toBe('saturation')
    expect(jfetRegion(0, 5, 4)).toBe('saturation')
  })
})

const VP = 4
const IDSS = 10

describe('JFET — transfer (square law)', () => {
  it('= I_DSS at V_GS=0 and 0 at V_GS=V_P', () => {
    expect(jfetTransfer(0, VP, IDSS)).toBeCloseTo(IDSS, 6)
    expect(jfetTransfer(-VP, VP, IDSS)).toBeCloseTo(0, 6)
  })
  it('follows the square law (V_GS=-2 → I_DSS/4)', () => {
    expect(jfetTransfer(-2, VP, IDSS)).toBeCloseTo(2.5, 6)
  })
  it('is 0 in cutoff (|V_GS|>|V_P|)', () => {
    expect(jfetTransfer(-5, VP, IDSS)).toBe(0)
  })
})

describe('JFET — drain current (piecewise)', () => {
  it('is continuous at the knee V_DS=V_Dsat (ohmic == saturation)', () => {
    const vgs = -1
    const vdsat = jfetVdsat(vgs, VP)
    expect(jfetDrainCurrent(vgs, vdsat, VP, IDSS)).toBeCloseTo(jfetTransfer(vgs, VP, IDSS), 6)
  })
  it('saturates flat beyond the knee', () => {
    const vgs = -1
    expect(jfetDrainCurrent(vgs, 4, VP, IDSS)).toBeCloseTo(jfetDrainCurrent(vgs, 6, VP, IDSS), 6)
    expect(jfetDrainCurrent(vgs, 6, VP, IDSS)).toBeCloseTo(jfetTransfer(vgs, VP, IDSS), 6)
  })
  it('rises ~linearly from the origin in the ohmic region', () => {
    const i1 = jfetDrainCurrent(0, 0.2, VP, IDSS)
    const i2 = jfetDrainCurrent(0, 0.4, VP, IDSS)
    expect(i2 / i1).toBeGreaterThan(1.7)
    expect(i2 / i1).toBeLessThan(2)
  })
  it('is 0 in cutoff', () => {
    expect(jfetDrainCurrent(-5, 3, VP, IDSS)).toBe(0)
  })
})

describe('JFET — transconductance', () => {
  it('= 2·I_DSS/|V_P| at V_GS=0 and 0 at pinch-off', () => {
    expect(jfetGm(0, VP, IDSS)).toBeCloseTo((2 * IDSS) / VP, 6)
    expect(jfetGm(-VP, VP, IDSS)).toBeCloseTo(0, 6)
  })
  it('equals 2√(I_DSS·I_D)/|V_P|', () => {
    const vgs = -2
    const id = jfetTransfer(vgs, VP, IDSS)
    expect(jfetGm(vgs, VP, IDSS)).toBeCloseTo((2 * Math.sqrt(IDSS * id)) / VP, 6)
  })
})
