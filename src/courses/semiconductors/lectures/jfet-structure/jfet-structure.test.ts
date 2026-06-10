import { describe, it, expect } from 'vitest'
import { jfetPinchoff, jfetChannelOpening, jfetVdsat, jfetRegion } from '../../lib/junction'

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
  it('cutoff when |V_GS| ≥ |V_P|', () => {
    expect(jfetRegion(4, 2, 4)).toBe('cutoff')
    expect(jfetRegion(5, 10, 4)).toBe('cutoff')
  })
  it('ohmic below V_Dsat, saturation at/above it', () => {
    expect(jfetRegion(1, 2, 4)).toBe('ohmic') // Vdsat = 3
    expect(jfetRegion(1, 3, 4)).toBe('saturation')
    expect(jfetRegion(0, 5, 4)).toBe('saturation')
  })
})
