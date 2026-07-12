import { describe, it, expect } from 'vitest'
import { qFunc, qInv, rocPd, bayesThreshold, probError } from '../../lib/detection'
import { hypothesisLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('detection — Q-function and ROC', () => {
  it('Q(0)=½ and qInv inverts qFunc', () => {
    expect(qFunc(0)).toBeCloseTo(0.5, 6)
    for (const p of [0.01, 0.1, 0.5, 0.9, 0.99]) {
      expect(qFunc(qInv(p))).toBeCloseTo(p, 6)
    }
  })
  it('ROC: diagonal at d=0, and increases with separation & P_FA', () => {
    expect(rocPd(0.3, 0)).toBeCloseTo(0.3, 6) // d=0 → random guess
    expect(rocPd(0.3, 2)).toBeGreaterThan(0.3) // separation helps
    expect(rocPd(0.5, 2)).toBeGreaterThan(rocPd(0.2, 2)) // monotone in P_FA
    expect(rocPd(0.3, 3)).toBeGreaterThan(rocPd(0.3, 1)) // monotone in d
  })
})

describe('detection — Bayesian threshold & error', () => {
  it('equal priors → threshold at the midpoint', () => {
    expect(bayesThreshold(0, 4, 1, 0.5)).toBeCloseTo(2, 12)
  })
  it('P(error) decreases as the hypotheses separate', () => {
    const near = probError(0, 1, 1, 0.5, bayesThreshold(0, 1, 1, 0.5))
    const far = probError(0, 3, 1, 0.5, bayesThreshold(0, 3, 1, 0.5))
    expect(far).toBeLessThan(near)
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 5, registered in the statistics course', () => {
    expect(hypothesisLecture.explainer).toBe(true)
    expect(hypothesisLecture.number).toBe(5)
    expect(hypothesisLecture.id).toBe('hypothesis-testing')
    expect(LECTURE_LIST.some((l) => l.id === 'hypothesis-testing')).toBe(true)
  })
})
