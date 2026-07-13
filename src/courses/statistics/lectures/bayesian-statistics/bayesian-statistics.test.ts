import { describe, it, expect } from 'vitest'
import { gaussianPosterior, betaMean, betaMode, softDecision, mapThreshold } from '../../lib/bayes'
import { bayesLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('bayes — conjugate Gaussian posterior', () => {
  it('weighted average: no noise → data, huge noise → prior', () => {
    expect(gaussianPosterior(0, 1, 3, 1e-6).mean).toBeCloseTo(3, 3) // trust the data
    expect(gaussianPosterior(5, 1, 3, 1e6).mean).toBeCloseTo(5, 3) // fall back to prior
  })
  it('posterior variance = σ_y²σ_w²/(σ_y²+σ_w²)', () => {
    expect(gaussianPosterior(0, 2, 1, 3).variance).toBeCloseTo((2 * 3) / (2 + 3), 12)
  })
})

describe('bayes — Beta posterior estimators differ when skewed', () => {
  it('mean = a/(a+b); mode < mean for a right-skewed posterior', () => {
    expect(betaMean(3, 9)).toBeCloseTo(0.25, 12)
    expect(betaMode(3, 9)).toBeLessThan(betaMean(3, 9)) // (2/10)=0.2 < 0.25
  })
})

describe('bayes — soft/hard decision (Ex 28)', () => {
  it('soft decision is a sigmoid: →0, →1, monotone; ½ at symmetric point when p=½', () => {
    expect(softDecision(-5, 0.5, 0.6)).toBeLessThan(0.01)
    expect(softDecision(5, 0.5, 0.6)).toBeGreaterThan(0.99)
    expect(softDecision(0.5, 0.5, 0.6)).toBeCloseTo(0.5, 6) // symmetric point
    expect(softDecision(1, 0.5, 0.6)).toBeGreaterThan(softDecision(0, 0.5, 0.6))
  })
  it('MAP threshold is ½ when the prior is uniform', () => {
    expect(mapThreshold(0.5, 0.8)).toBeCloseTo(0.5, 12)
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 8, registered in the statistics course', () => {
    expect(bayesLecture.explainer).toBe(true)
    expect(bayesLecture.number).toBe(8)
    expect(bayesLecture.id).toBe('bayesian-statistics')
    expect(LECTURE_LIST.some((l) => l.id === 'bayesian-statistics')).toBe(true)
  })
})
