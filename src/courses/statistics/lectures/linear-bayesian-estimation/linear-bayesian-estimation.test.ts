import { describe, it, expect } from 'vitest'
import { lmmseScalar, lmmseAffine, twoSensor, cubicExample } from '../../lib/linbayes'
import { linBayesLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('linbayes — scalar LMMSE', () => {
  it('Cov=0 ⇒ estimate collapses to the prior mean, mse stays σ_x²', () => {
    const r = lmmseScalar({ muX: 5, varX: 4, muY: 2, varY: 3, covXY: 0 }, 100)
    expect(r.estimate).toBeCloseTo(5, 12)
    expect(r.mse).toBeCloseTo(4, 12)
  })
  it('matches μ_x + ρ(σ_x/σ_y)(y−μ_y) and mse=(1−ρ²)σ_x²', () => {
    const sx = 2, sy = 3, rho = 0.5
    const covXY = rho * sx * sy
    const r = lmmseScalar({ muX: 0, varX: sx * sx, muY: 0, varY: sy * sy, covXY }, 6)
    expect(r.estimate).toBeCloseTo(rho * (sx / sy) * 6, 12)
    expect(r.mse).toBeCloseTo((1 - rho * rho) * sx * sx, 12)
  })
})

describe('linbayes — two-sensor fusion (Ex 31)', () => {
  it('σ₁≪σ₂ → trust sensor 1', () => {
    expect(twoSensor(0, 1e6, 0.01, 5, 3, -2)).toBeCloseTo(3, 2)
  })
  it('both sensors useless → the prior mean', () => {
    expect(twoSensor(4, 1, 1e4, 1e4, 9, -1)).toBeCloseTo(4, 2)
  })
  it('equal sensors with a weak prior → simple average', () => {
    expect(twoSensor(0, 1e6, 1, 1, 2, 4)).toBeCloseTo(3, 2)
  })
})

describe('linbayes — cubic Y=X³ (recitation 10)', () => {
  it('BLE slopes 3σ² and 1/(5σ²); MSEs 6σ⁶ and 0.4σ² (σ=1)', () => {
    const c = cubicExample(1)
    expect(c.bleYslope).toBeCloseTo(3, 12)
    expect(c.bleXslope).toBeCloseTo(1 / 5, 12)
    expect(c.mseBLEy).toBeCloseTo(6, 12)
    expect(c.mseBLEx).toBeCloseTo(0.4, 12)
  })
  it('scales with σ (σ=2)', () => {
    const c = cubicExample(2)
    expect(c.bleYslope).toBeCloseTo(12, 12) // 3·4
    expect(c.mseBLEy).toBeCloseTo(6 * 64, 12) // 6σ⁶ = 6·64
  })
})

describe('linbayes — vector affine LMMSE', () => {
  it('reduces to the scalar case for 1×1 moments', () => {
    const r = lmmseAffine([0], [0], [[1.5]], [[3]], [[2]], [6])
    expect(r.estimate[0]).toBeCloseTo((1.5 / 3) * 6, 12)
    expect(r.errorCov[0][0]).toBeCloseTo(2 - (1.5 * 1.5) / 3, 12)
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 9, registered in the statistics course', () => {
    expect(linBayesLecture.explainer).toBe(true)
    expect(linBayesLecture.number).toBe(9)
    expect(linBayesLecture.id).toBe('linear-bayesian-estimation')
    expect(LECTURE_LIST.some((l) => l.id === 'linear-bayesian-estimation')).toBe(true)
  })
})
