import { describe, it, expect } from 'vitest'
import { bernoulliPmf, binomialPmf, choose } from '../../lib/distributions'
import { overviewLecture } from './index'
import { NODES as COURSE_MAP_NODES } from './components/CourseMap'
import { LECTURE_LIST } from '../../registry'

describe('discrete distributions — Bernoulli & Binomial', () => {
  it('choose is symmetric and correct', () => {
    expect(choose(8, 0)).toBe(1)
    expect(choose(8, 8)).toBe(1)
    expect(choose(8, 3)).toBe(56)
    expect(choose(8, 3)).toBe(choose(8, 5))
  })

  it('Bernoulli pmf sums to 1 and has mean θ', () => {
    const theta = 0.6
    expect(bernoulliPmf(0, theta) + bernoulliPmf(1, theta)).toBeCloseTo(1, 12)
    const mean = 0 * bernoulliPmf(0, theta) + 1 * bernoulliPmf(1, theta)
    expect(mean).toBeCloseTo(theta, 12)
  })

  it('Binomial pmf normalizes and has mean np, var np(1−p)', () => {
    const n = 8
    const p = 0.4
    let sum = 0
    let mean = 0
    let m2 = 0
    for (let k = 0; k <= n; k++) {
      const pk = binomialPmf(k, n, p)
      sum += pk
      mean += k * pk
      m2 += k * k * pk
    }
    expect(sum).toBeCloseTo(1, 12)
    expect(mean).toBeCloseTo(n * p, 12)
    expect(m2 - mean * mean).toBeCloseTo(n * p * (1 - p), 12)
  })

  it('Binomial(1,p) reduces to Bernoulli(p)', () => {
    expect(binomialPmf(1, 1, 0.3)).toBeCloseTo(bernoulliPmf(1, 0.3), 12)
    expect(binomialPmf(0, 1, 0.3)).toBeCloseTo(bernoulliPmf(0, 0.3), 12)
  })
})

describe('overview lecture registration', () => {
  it('is an explainer numbered 0, first in the statistics course', () => {
    expect(overviewLecture.explainer).toBe(true)
    expect(overviewLecture.number).toBe(0)
    expect(overviewLecture.id).toBe('overview')
    expect(LECTURE_LIST[0].id).toBe('overview')
  })
})

describe('course map', () => {
  it('has 12 nodes with unique lecture ids, and the built node resolves to a real lecture', () => {
    const ids = COURSE_MAP_NODES.map((n) => n.lectureId)
    expect(ids).toHaveLength(12)
    expect(new Set(ids).size).toBe(12) // unique
    // the one built node ('random-variables') is actually registered
    const built = new Set(LECTURE_LIST.map((l) => l.id))
    expect(built.has('random-variables')).toBe(true)
    expect(ids).toContain('random-variables')
  })
})
