import { describe, it, expect } from 'vitest'
import { mse, shrinkageMSE, logLikGaussianMean, sampleMean, sampleVarBiased, sampleVarUnbiased } from '../../lib/estimation'
import { mleLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('estimation — bias-variance & shrinkage', () => {
  it('MSE = bias² + variance', () => {
    expect(mse(2, 3)).toBe(7)
    expect(mse(0, 5)).toBe(5)
  })
  it('shrinkage MSE: α=1 recovers σ²/N, and reproduces תרגול 7 numbers', () => {
    expect(shrinkageMSE(1, 3, 4, 10)).toBeCloseTo(4 / 10, 12) // σ²/N
    expect(shrinkageMSE(0.5, 1, 1, 10)).toBeCloseTo(11 / 40, 12) // ¼·1/10 + ¼·1
  })
  it('shrinkage beats ML at μ=0', () => {
    expect(shrinkageMSE(0.5, 0, 1, 10)).toBeLessThan(shrinkageMSE(1, 0, 1, 10))
  })
})

describe('estimation — sample statistics & likelihood', () => {
  it('biased vs unbiased sample variance (÷N vs ÷N−1)', () => {
    const data = [2, 4, 6] // mean 4, Σ(x−m)²=8
    expect(sampleMean(data)).toBe(4)
    expect(sampleVarBiased(data)).toBeCloseTo(8 / 3, 12)
    expect(sampleVarUnbiased(data)).toBeCloseTo(8 / 2, 12)
  })
  it('Gaussian log-likelihood peaks at the sample mean', () => {
    const data = [1, 3, 5, 7] // mean 4
    const atMean = logLikGaussianMean(data, 4, 1.5)
    expect(atMean).toBeGreaterThan(logLikGaussianMean(data, 3.5, 1.5))
    expect(atMean).toBeGreaterThan(logLikGaussianMean(data, 4.5, 1.5))
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 6, registered in the statistics course', () => {
    expect(mleLecture.explainer).toBe(true)
    expect(mleLecture.number).toBe(6)
    expect(mleLecture.id).toBe('maximum-likelihood')
    expect(LECTURE_LIST.some((l) => l.id === 'maximum-likelihood')).toBe(true)
  })
})
