import { describe, it, expect } from 'vitest'
import { distMoments, mixtureMoments, conditionalStd } from '../../lib/moments'
import { momentsLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('distMoments — analytic mean/variance', () => {
  it('Gaussian → {m, σ²}', () => {
    const { mean, variance } = distMoments('gauss', { m: 5, sigma: 1.5 })
    expect(mean).toBeCloseTo(5, 12)
    expect(variance).toBeCloseTo(2.25, 12)
  })
  it('Poisson → {λ, λ}', () => {
    expect(distMoments('poisson', { lambda: 3 })).toEqual({ mean: 3, variance: 3 })
  })
  it('Uniform → {(a+b)/2, (b−a)²/12}', () => {
    const { mean, variance } = distMoments('uniform', { a: 2, b: 8 })
    expect(mean).toBeCloseTo(5, 12)
    expect(variance).toBeCloseTo(3, 12)
  })
  it('Exponential → {1/λ, 1/λ²}', () => {
    expect(distMoments('exp', { lambda: 2 })).toEqual({ mean: 0.5, variance: 0.25 })
  })
})

describe('mixtureMoments — law of total variance (תרגול 2 שאלה 4)', () => {
  it('reproduces E[X]=4.4, within=1.7, between=0.84, Var=2.15', () => {
    const r = mixtureMoments([
      { weight: 0.7, mean: 5, variance: 2 },
      { weight: 0.3, mean: 3, variance: 1 },
    ])
    expect(r.mean).toBeCloseTo(4.4, 10)
    expect(r.withinVar).toBeCloseTo(1.7, 10)
    expect(r.betweenVar).toBeCloseTo(0.84, 10)
    expect(r.variance).toBeCloseTo(2.54, 10) // 1.7 + 0.84 (source's "2.15" is an arithmetic typo)
  })
})

describe('conditionalStd — residual uncertainty √(1−ρ²)', () => {
  it('is full at ρ=0, zero at |ρ|=1, and decreasing in |ρ|', () => {
    expect(conditionalStd(0)).toBeCloseTo(1, 12)
    expect(conditionalStd(1)).toBeCloseTo(0, 12)
    expect(conditionalStd(-1)).toBeCloseTo(0, 12)
    expect(conditionalStd(0.6)).toBeCloseTo(0.8, 12)
    expect(conditionalStd(0.9)).toBeLessThan(conditionalStd(0.5))
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 2, registered in the statistics course', () => {
    expect(momentsLecture.explainer).toBe(true)
    expect(momentsLecture.number).toBe(2)
    expect(momentsLecture.id).toBe('moments')
    expect(LECTURE_LIST.some((l) => l.id === 'moments')).toBe(true)
  })
})
