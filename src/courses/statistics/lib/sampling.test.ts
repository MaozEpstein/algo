import { describe, it, expect } from 'vitest'
import { sampleMeans, cltTarget, empiricalStats, BASE_PARAMS } from './sampling'

describe('sampling — CLT target', () => {
  it('mean is unchanged, variance is σ²/n', () => {
    expect(cltTarget('uniform', 4)).toEqual({ mean: 0.5, variance: (1 / 12) / 4 })
    expect(cltTarget('exp', 10).variance).toBeCloseTo(1 / 10, 12)
    expect(cltTarget('bernoulli', 25).variance).toBeCloseTo(0.25 / 25, 12)
  })
})

describe('sampling — seeded sample means', () => {
  it('deterministic per seed and right length', () => {
    const a = sampleMeans('exp', 5, 100, 7)
    const b = sampleMeans('exp', 5, 100, 7)
    expect(a).toEqual(b)
    expect(a).toHaveLength(100)
  })

  it('empirical mean/variance of the sample means approach the CLT target', () => {
    for (const base of ['uniform', 'exp', 'bernoulli'] as const) {
      const n = 8
      const xs = sampleMeans(base, n, 6000, 12345)
      const emp = empiricalStats(xs)
      const tgt = cltTarget(base, n)
      expect(emp.mean).toBeCloseTo(tgt.mean, 1) // ≈ μ
      expect(emp.variance).toBeCloseTo(tgt.variance, 2) // ≈ σ²/n
    }
  })

  it('larger n shrinks the spread of the sample means', () => {
    const small = empiricalStats(sampleMeans('uniform', 2, 4000, 99)).variance
    const large = empiricalStats(sampleMeans('uniform', 20, 4000, 99)).variance
    expect(large).toBeLessThan(small)
    expect(large).toBeCloseTo(BASE_PARAMS.uniform.variance / 20, 2)
  })
})
