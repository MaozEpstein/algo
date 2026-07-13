import { describe, it, expect } from 'vitest'
import { countingStats, xorMarginal, maAutocorr, arAutocorr, iidBernoulli, arProcess } from '../../lib/processes'
import { randomProcessLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('processes — counting (Ex 33)', () => {
  it('mean np, variance np(1−p)', () => {
    expect(countingStats(10, 0.3).mean).toBeCloseTo(3, 12)
    expect(countingStats(10, 0.3).variance).toBeCloseTo(10 * 0.3 * 0.7, 12)
  })
  it('deterministic at p=0 or p=1 (zero variance)', () => {
    expect(countingStats(7, 0).variance).toBe(0)
    expect(countingStats(7, 1).variance).toBe(0)
  })
})

describe('processes — XOR marginal (Ex 34)', () => {
  it('p=½ ⇒ P(Xₙ=1)=½ for all n (SSS)', () => {
    expect(xorMarginal(1, 0.5).p1).toBeCloseTo(0.5, 12)
    expect(xorMarginal(9, 0.5).p1).toBeCloseTo(0.5, 12)
  })
  it('p≠½ ⇒ drifts to ½ as n grows (asymptotically stationary)', () => {
    expect(xorMarginal(1, 0.2).p1).toBeCloseTo(0.2, 12) // ½[1−0.6] = 0.2
    expect(xorMarginal(60, 0.2).p1).toBeCloseTo(0.5, 6)
    expect(xorMarginal(3, 0.2).p1).toBeCloseTo(0.5 * (1 - 0.6 ** 3), 12)
  })
  it('p0 + p1 = 1', () => {
    const m = xorMarginal(5, 0.35)
    expect(m.p0 + m.p1).toBeCloseTo(1, 12)
  })
})

describe('processes — autocorrelations', () => {
  it('MA(1): r(0)=2σ², r(±1)=σ², else 0', () => {
    expect(maAutocorr(0)).toBe(2)
    expect(maAutocorr(1)).toBe(1)
    expect(maAutocorr(-1)).toBe(1)
    expect(maAutocorr(2)).toBe(0)
  })
  it('AR(1): r(0)=σ²/(1−a²), geometric decay r(k)=r(0)a^|k|', () => {
    const a = 0.5
    expect(arAutocorr(0, a)).toBeCloseTo(1 / (1 - a * a), 12)
    expect(arAutocorr(2, a)).toBeCloseTo(arAutocorr(0, a) * a * a, 12)
    expect(arAutocorr(-3, a)).toBeCloseTo(arAutocorr(3, a), 12)
  })
})

describe('processes — seeded generators are deterministic', () => {
  it('same seed → identical realization of the right length', () => {
    const a = iidBernoulli(20, 0.5, 42)
    const b = iidBernoulli(20, 0.5, 42)
    expect(a).toEqual(b)
    expect(a).toHaveLength(20)
    expect(a.every((v) => v === 0 || v === 1)).toBe(true)
  })
  it('AR realization has the requested length', () => {
    expect(arProcess(15, 0.7, 7)).toHaveLength(15)
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 10, registered in the statistics course', () => {
    expect(randomProcessLecture.explainer).toBe(true)
    expect(randomProcessLecture.number).toBe(10)
    expect(randomProcessLecture.id).toBe('random-processes')
    expect(LECTURE_LIST.some((l) => l.id === 'random-processes')).toBe(true)
  })
})
