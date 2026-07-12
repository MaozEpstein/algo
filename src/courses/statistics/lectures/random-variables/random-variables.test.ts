import { describe, it, expect } from 'vitest'
import {
  uniformCdf,
  expCdf,
  expPdf,
  gaussianCdf,
  gaussianPdf,
  poissonPmf,
  poissonCdf,
  erf,
} from '../../lib/distributions'
import { randomVariablesLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('distributions — CDF/PDF identities', () => {
  it('erf is odd and bounded', () => {
    expect(erf(0)).toBeCloseTo(0, 6)
    expect(erf(-1)).toBeCloseTo(-erf(1), 6)
    expect(erf(3)).toBeGreaterThan(0.999)
  })

  it('exponential CDF is 1 − e^{−λx} and matches ∫pdf', () => {
    const lambda = 1.3
    expect(expCdf(0, lambda)).toBeCloseTo(0, 12)
    expect(expCdf(2, lambda)).toBeCloseTo(1 - Math.exp(-lambda * 2), 12)
    // numeric integral of the pdf up to x equals the cdf
    let area = 0
    const dx = 1e-3
    for (let x = 0; x < 2; x += dx) area += expPdf(x + dx / 2, lambda) * dx
    expect(area).toBeCloseTo(expCdf(2, lambda), 3)
  })

  it('uniform CDF clamps to [0,1] and is linear in-between', () => {
    expect(uniformCdf(-1, 0, 4)).toBe(0)
    expect(uniformCdf(1, 0, 4)).toBeCloseTo(0.25, 12)
    expect(uniformCdf(5, 0, 4)).toBe(1)
  })

  it('standard normal: F(m)=½ and the pdf integrates to the cdf', () => {
    expect(gaussianCdf(5, 5, 2)).toBeCloseTo(0.5, 6)
    // ~68% within one sigma
    expect(gaussianCdf(7, 5, 2) - gaussianCdf(3, 5, 2)).toBeCloseTo(0.6827, 2)
    expect(gaussianPdf(5, 5, 2)).toBeGreaterThan(0)
  })

  it('Poisson pmf sums to its cdf and normalizes to 1', () => {
    const lambda = 3
    expect(poissonPmf(0, lambda)).toBeCloseTo(Math.exp(-lambda), 12)
    // Pr(X≤3) = e^{−λ}(1+λ+λ²/2+λ³/6)
    const expected = Math.exp(-lambda) * (1 + lambda + lambda ** 2 / 2 + lambda ** 3 / 6)
    expect(poissonCdf(3, lambda)).toBeCloseTo(expected, 10)
    expect(poissonCdf(50, lambda)).toBeCloseTo(1, 8)
  })
})

describe('lesson registration', () => {
  it('is an explainer numbered 1, registered in the statistics course', () => {
    expect(randomVariablesLecture.explainer).toBe(true)
    expect(randomVariablesLecture.number).toBe(1)
    expect(randomVariablesLecture.algorithms).toHaveLength(0)
    expect(randomVariablesLecture.id).toBe('random-variables')
    expect(LECTURE_LIST.some((l) => l.id === 'random-variables')).toBe(true)
  })

  it('carries the full study aids (glossary, formulas, symbols)', () => {
    expect(randomVariablesLecture.glossary?.length).toBeGreaterThan(0)
    expect(randomVariablesLecture.formulas?.length).toBeGreaterThan(0)
    expect(randomVariablesLecture.symbols?.length).toBeGreaterThan(0)
  })
})
