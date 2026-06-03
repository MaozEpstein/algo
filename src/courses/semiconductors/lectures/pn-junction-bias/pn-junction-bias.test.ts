import { describe, it, expect } from 'vitest'
import { MATERIALS, capPerArea, junctionState, minorityAtEdge, thermalVoltage } from '../../lib/junction'
import { pnJunctionBiasLecture } from './index'
import { LECTURE_LIST } from '../../registry'

const Si = MATERIALS.Si
const capAt = (Va: number) => capPerArea(Si.epsR, junctionState(1e16, 1e17, Si, Va).d)

describe('PN junction under bias — physics', () => {
  it('law of the junction: minority edge concentration scales with e^{V_A/V_T}', () => {
    const n0 = 2.25e4
    expect(minorityAtEdge(n0, 0)).toBeCloseTo(n0, 6)
    expect(minorityAtEdge(n0, 0.5)).toBeGreaterThan(n0) // forward injects
    expect(minorityAtEdge(n0, -0.5)).toBeLessThan(n0) // reverse extracts
    expect(minorityAtEdge(n0, 0.5)).toBeCloseTo(n0 * Math.exp(0.5 / thermalVoltage(300)), 0)
  })

  it('reverse bias widens the depletion region and raises the peak field', () => {
    const eq = junctionState(1e16, 1e17, Si, 0)
    const rev = junctionState(1e16, 1e17, Si, -3)
    expect(rev.d).toBeGreaterThan(eq.d)
    expect(rev.Emax).toBeGreaterThan(eq.Emax)
  })

  it('forward bias narrows the depletion region', () => {
    const eq = junctionState(1e16, 1e17, Si, 0)
    const fwd = junctionState(1e16, 1e17, Si, 0.5)
    expect(fwd.d).toBeLessThan(eq.d)
  })

  it('junction capacitance rises under forward bias and falls under reverse', () => {
    expect(capAt(0.5)).toBeGreaterThan(capAt(0))
    expect(capAt(-3)).toBeLessThan(capAt(0))
  })

  it('1/C_j^2 is linear (affine) in V_A — the basis of the doping extraction', () => {
    const inv = (Va: number) => 1 / capAt(Va) ** 2
    const a = inv(-4)
    const b = inv(-2)
    const c = inv(0)
    // collinear: the midpoint value equals the average of the endpoints
    expect(b).toBeCloseTo((a + c) / 2, 6)
  })
})

describe('lecture registration', () => {
  it('is an explainer, number 1.2, registered in the semiconductors course', () => {
    expect(pnJunctionBiasLecture.explainer).toBe(true)
    expect(pnJunctionBiasLecture.number).toBe(1.2)
    expect(pnJunctionBiasLecture.algorithms).toHaveLength(0)
    expect(pnJunctionBiasLecture.id).toBe('pn-junction-bias')
    expect(LECTURE_LIST.some((l) => l.id === 'pn-junction-bias')).toBe(true)
  })

  it('carries the full study aids (glossary, formulas, variables dictionary)', () => {
    expect(pnJunctionBiasLecture.glossary?.length).toBeGreaterThan(0)
    expect(pnJunctionBiasLecture.formulas?.length).toBeGreaterThan(0)
    expect(pnJunctionBiasLecture.symbols?.length).toBeGreaterThan(0)
  })
})
