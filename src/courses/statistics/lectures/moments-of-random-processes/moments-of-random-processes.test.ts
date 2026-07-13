import { describe, it, expect } from 'vitest'
import { cosineAutocorr, randomWalkAutocorr, ltiOutputMean, ltiOutputAutocorr, maAutocorr, arAutocorr } from '../../lib/processes'
import { momentsRPLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('processes — moment helpers (Ch. 11)', () => {
  it('cosineAutocorr: R(0)=½, symmetric, periodic', () => {
    expect(cosineAutocorr(0, 0.1)).toBeCloseTo(0.5, 12)
    expect(cosineAutocorr(-3, 0.1)).toBeCloseTo(cosineAutocorr(3, 0.1), 12) // symmetry
    expect(cosineAutocorr(10, 0.1)).toBeCloseTo(cosineAutocorr(0, 0.1), 12) // period 1/f = 10
  })
  it('randomWalkAutocorr = σ²·min(n,m)', () => {
    expect(randomWalkAutocorr(3, 7)).toBe(3)
    expect(randomWalkAutocorr(7, 3, 2)).toBe(6)
  })
})

describe('processes — LTI output moments (Ex 45)', () => {
  it('output mean is (Σh)·μ_X', () => {
    expect(ltiOutputMean([1, 1], 4)).toBe(8)
    expect(ltiOutputMean([0.5, 0.5], 4)).toBe(4)
  })
  it('white input through h=[1,1] reproduces MA(1) autocorrelation 2/1/0', () => {
    const white = (k: number) => (k === 0 ? 1 : 0)
    expect(ltiOutputAutocorr([1, 1], white, 0)).toBe(2)
    expect(ltiOutputAutocorr([1, 1], white, 1)).toBe(1)
    expect(ltiOutputAutocorr([1, 1], white, -1)).toBe(1)
    expect(ltiOutputAutocorr([1, 1], white, 2)).toBe(0)
    // matches the closed-form maAutocorr
    for (const k of [-2, -1, 0, 1, 2]) expect(ltiOutputAutocorr([1, 1], white, k)).toBe(maAutocorr(k))
  })
  it('the ½/½ averager gives R_Y = ½r(τ)+¼r(τ−1)+¼r(τ+1)', () => {
    const rX = (k: number) => arAutocorr(k, 0.5) // any WSS autocorrelation
    const expected = (t: number) => 0.5 * rX(t) + 0.25 * rX(t - 1) + 0.25 * rX(t + 1)
    for (const k of [-2, -1, 0, 1, 2]) expect(ltiOutputAutocorr([0.5, 0.5], rX, k)).toBeCloseTo(expected(k), 12)
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 11, registered in the statistics course', () => {
    expect(momentsRPLecture.explainer).toBe(true)
    expect(momentsRPLecture.number).toBe(11)
    expect(momentsRPLecture.id).toBe('moments-of-random-processes')
    expect(LECTURE_LIST.some((l) => l.id === 'moments-of-random-processes')).toBe(true)
  })
})
