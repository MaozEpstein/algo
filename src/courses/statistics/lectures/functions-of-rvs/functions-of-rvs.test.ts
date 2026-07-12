import { describe, it, expect } from 'vitest'
import { gaussianPdf, expCdf } from '../../lib/distributions'
import { affinePdf, squarePdf, expInvCdf, sigmoid, sigmoidInv } from '../../lib/transforms'
import { functionsLecture } from './index'
import { LECTURE_LIST } from '../../registry'

const stdNormal = (x: number) => gaussianPdf(x, 0, 1)

describe('transforms — change of variables', () => {
  it('squarePdf of a standard normal is the χ²₍₁₎ pdf (1/√(2πy))e^{−y/2}', () => {
    for (const y of [0.3, 1, 2.5, 4]) {
      const expected = (1 / Math.sqrt(2 * Math.PI * y)) * Math.exp(-y / 2)
      expect(squarePdf(stdNormal, y)).toBeCloseTo(expected, 10)
    }
    expect(squarePdf(stdNormal, -1)).toBe(0) // no support for y<0
  })

  it('affinePdf matches (1/|a|)f_X((y−b)/a)', () => {
    const a = -2, b = 1
    for (const y of [-1, 0, 3]) {
      expect(affinePdf(stdNormal, a, b, y)).toBeCloseTo((1 / Math.abs(a)) * stdNormal((y - b) / a), 12)
    }
  })

  it('sigmoidInv inverts sigmoid', () => {
    for (const x of [-2, -0.5, 0, 1, 3]) {
      expect(sigmoidInv(sigmoid(x))).toBeCloseTo(x, 10)
    }
  })

  it('expInvCdf inverts the exponential CDF', () => {
    const lambda = 1.5
    for (const u of [0.1, 0.5, 0.9]) {
      expect(expCdf(expInvCdf(u, lambda), lambda)).toBeCloseTo(u, 10)
    }
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 3, registered in the statistics course', () => {
    expect(functionsLecture.explainer).toBe(true)
    expect(functionsLecture.number).toBe(3)
    expect(functionsLecture.id).toBe('functions-of-rvs')
    expect(LECTURE_LIST.some((l) => l.id === 'functions-of-rvs')).toBe(true)
  })
})
