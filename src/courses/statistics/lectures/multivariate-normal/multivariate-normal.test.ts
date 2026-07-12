import { describe, it, expect } from 'vitest'
import { covEigen, conditionalNormal } from '../../lib/gaussian2d'
import { mvnLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('gaussian2d — covariance eigen-geometry', () => {
  it('ρ=0 → axis-aligned ellipse (angle 0, axes = σ)', () => {
    const e = covEigen(1.5, 0.8, 0)
    expect(e.angleRad).toBeCloseTo(0, 12)
    expect(e.major).toBeCloseTo(1.5, 12)
    expect(e.minor).toBeCloseTo(0.8, 12)
  })
  it('equal variances with ρ>0 → 45° tilt', () => {
    const e = covEigen(1, 1, 0.6)
    expect(Math.abs(e.angleRad)).toBeCloseTo(Math.PI / 4, 12)
    // eigenvalues 1±ρ → axes √(1.6), √(0.4)
    expect(e.major).toBeCloseTo(Math.sqrt(1.6), 12)
    expect(e.minor).toBeCloseTo(Math.sqrt(0.4), 12)
  })
})

describe('gaussian2d — bivariate conditional (Thm 4.6)', () => {
  it('ρ=0 → mean 0, variance σx² (independent)', () => {
    expect(conditionalNormal(1.3, 0.9, 0, 2)).toEqual({ mean: 0, variance: 1.3 ** 2 })
  })
  it('|ρ|=1 → variance 0 (X determined by Y)', () => {
    expect(conditionalNormal(1, 1, 1, 3).variance).toBeCloseTo(0, 12)
  })
  it('mean is ρ(σx/σy)y', () => {
    expect(conditionalNormal(2, 4, 0.5, 8).mean).toBeCloseTo(0.5 * (2 / 4) * 8, 12) // = 2
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 4, registered in the statistics course', () => {
    expect(mvnLecture.explainer).toBe(true)
    expect(mvnLecture.number).toBe(4)
    expect(mvnLecture.id).toBe('multivariate-normal')
    expect(LECTURE_LIST.some((l) => l.id === 'multivariate-normal')).toBe(true)
  })
})
