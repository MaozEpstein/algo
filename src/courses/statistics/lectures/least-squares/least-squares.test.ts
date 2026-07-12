import { describe, it, expect } from 'vitest'
import { lineFit, median, solveLinear, polyFit, ssr } from '../../lib/leastsquares'
import { lsLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('least squares — line fit', () => {
  it('reproduces תרגול 8 שאלה 3: θ̂ ≈ [0.05, 1.99]', () => {
    // Hᵀy = [30.1, 110.2] (Σxy=110.2); [[5,15],[15,55]]⁻¹[30.1;110.2] = [0.05, 1.99]
    const xs = [1, 2, 3, 4, 5]
    const ys = [2.1, 3.9, 6.2, 7.8, 10.1]
    const { a, b } = lineFit(xs, ys)
    expect(a).toBeCloseTo(0.05, 2)
    expect(b).toBeCloseTo(1.99, 2)
  })
  it('polyFit degree 1 matches lineFit', () => {
    const xs = [0, 1, 2, 3]
    const ys = [1, 3, 5, 7] // exact line 1+2x
    const c = polyFit(xs, ys, 1, 0)
    const { a, b } = lineFit(xs, ys)
    expect(c[0]).toBeCloseTo(a, 8)
    expect(c[1]).toBeCloseTo(b, 8)
  })
  it('ssr is zero on a perfect fit', () => {
    expect(ssr([0, 1, 2], [1, 3, 5], 1, 2)).toBeCloseTo(0, 12)
  })
})

describe('least squares — solver, median, ridge', () => {
  it('solveLinear solves a 2×2 system', () => {
    // [[2,1],[1,3]] x = [3,5] → x=[0.8,1.4]
    const x = solveLinear([[2, 1], [1, 3]], [3, 5])
    expect(x[0]).toBeCloseTo(0.8, 8)
    expect(x[1]).toBeCloseTo(1.4, 8)
  })
  it('median handles odd and even counts', () => {
    expect(median([3, 1, 2])).toBe(2)
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })
  it('ridge shrinks the slope toward 0 as λ grows', () => {
    const xs = [0, 1, 2, 3, 4]
    const ys = [0, 2, 4, 6, 8] // slope 2
    const slope0 = polyFit(xs, ys, 1, 0)[1]
    const slopeBig = polyFit(xs, ys, 1, 50)[1]
    expect(Math.abs(slopeBig)).toBeLessThan(Math.abs(slope0))
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 7, registered in the statistics course', () => {
    expect(lsLecture.explainer).toBe(true)
    expect(lsLecture.number).toBe(7)
    expect(lsLecture.id).toBe('least-squares')
    expect(LECTURE_LIST.some((l) => l.id === 'least-squares')).toBe(true)
  })
})
