import { describe, it, expect } from 'vitest'
import { runMinMax } from './algorithms/minMax'
import { runRandomizedSelect } from './algorithms/randomizedSelect'
import { runSelect } from './algorithms/select'

function markerIndex(frame: { markers?: { label: string; index: number }[] }, label: string) {
  return frame.markers?.find((m) => m.label === label)?.index
}
function answerValue(frames: { array: number[]; highlights: { role: string; indices: number[] }[] }[]) {
  const last = frames[frames.length - 1]
  const sorted = last.highlights.find((h) => h.role === 'sorted')
  return last.array[sorted!.indices[0]]
}

describe('Min-Max', () => {
  const check = (arr: number[]) => {
    const frames = runMinMax({ array: arr })
    const last = frames[frames.length - 1]
    return {
      min: last.array[markerIndex(last, 'min')!],
      max: last.array[markerIndex(last, 'max')!],
    }
  }
  it('finds min and max for even, odd, reverse and duplicate inputs', () => {
    expect(check([3, 7, 2, 8, 1, 9, 4, 6])).toEqual({ min: 1, max: 9 })
    expect(check([5, 3, 8, 1, 9])).toEqual({ min: 1, max: 9 }) // odd n
    expect(check([9, 7, 5, 3, 1])).toEqual({ min: 1, max: 9 })
    expect(check([4, 4, 4, 4])).toEqual({ min: 4, max: 4 })
  })
})

describe('RandomizedSelect', () => {
  const arr = [7, 2, 9, 4, 1, 8, 5, 3, 6]
  const sorted = [...arr].sort((a, b) => a - b)

  it('returns the i-th smallest for every i (1..n)', () => {
    for (let i = 1; i <= arr.length; i++) {
      const frames = runRandomizedSelect({ array: arr, extra: { i, seed: 5 } })
      expect(answerValue(frames)).toBe(sorted[i - 1])
    }
  })

  it('works on duplicates and a singleton', () => {
    expect(answerValue(runRandomizedSelect({ array: [4, 1, 4, 2, 4], extra: { i: 3, seed: 9 } }))).toBe(4)
    expect(answerValue(runRandomizedSelect({ array: [42], extra: { i: 1, seed: 1 } }))).toBe(42)
  })

  it('is deterministic for a given seed', () => {
    const a = runRandomizedSelect({ array: arr, extra: { i: 5, seed: 3 } })
    const b = runRandomizedSelect({ array: arr, extra: { i: 5, seed: 3 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })
})

describe('Select (median of medians)', () => {
  const arr = [12, 3, 7, 9, 1, 15, 6, 11, 2, 8, 14, 4, 10, 13, 5]
  const sorted = [...arr].sort((a, b) => a - b)

  it('returns the i-th smallest for every i (1..n) — worst-case deterministic', () => {
    for (let i = 1; i <= arr.length; i++) {
      expect(answerValue(runSelect({ array: arr, extra: { i } }))).toBe(sorted[i - 1])
    }
  })

  it('handles duplicates and small inputs', () => {
    expect(answerValue(runSelect({ array: [5, 5, 5, 2, 9, 9, 1], extra: { i: 4 } }))).toBe(5)
    expect(answerValue(runSelect({ array: [3, 1], extra: { i: 1 } }))).toBe(1)
    expect(answerValue(runSelect({ array: [8], extra: { i: 1 } }))).toBe(8)
  })

  it('is deterministic (no randomness)', () => {
    const a = runSelect({ array: arr, extra: { i: 8 } })
    const b = runSelect({ array: arr, extra: { i: 8 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })
})
