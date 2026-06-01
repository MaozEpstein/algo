import { describe, it, expect } from 'vitest'
import { toPlain } from '@/engine/indexing'
import { runInsertionSort } from './algorithms/insertionSort'
import { GROWTH_FNS } from './growth'
import { foundationsLecture } from './index'

const sortedOf = (arr: number[]) => {
  const frames = runInsertionSort({ array: arr })
  return toPlain(frames[frames.length - 1].array)
}
const fnOf = (key: string) => GROWTH_FNS.find((f) => f.key === key)!.fn

describe('Insertion Sort', () => {
  it('sorts random, reverse, sorted, duplicates and tiny inputs', () => {
    expect(sortedOf([5, 3, 8, 4, 1, 7])).toEqual([1, 3, 4, 5, 7, 8])
    expect(sortedOf([6, 5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5, 6])
    expect(sortedOf([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    expect(sortedOf([4, 2, 4, 1, 2, 4])).toEqual([1, 2, 2, 4, 4, 4])
    expect(sortedOf([2, 1])).toEqual([1, 2])
  })

  it('is deterministic, frames frozen + narrated, with compare/swap actions', () => {
    const a = runInsertionSort({ array: [5, 3, 8, 4, 1, 7] })
    const b = runInsertionSort({ array: [5, 3, 8, 4, 1, 7] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
    expect(a.some((f) => f.action?.kind === 'compare')).toBe(true)
    expect(a.some((f) => f.action?.kind === 'swap')).toBe(true)
    for (const f of a) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(f.narration.length).toBeGreaterThan(0)
    }
  })

  it('best case (sorted) does no swaps; worst case (reverse) does many', () => {
    const best = runInsertionSort({ array: [1, 2, 3, 4, 5, 6] })
    const worst = runInsertionSort({ array: [6, 5, 4, 3, 2, 1] })
    const swaps = (fs: ReturnType<typeof runInsertionSort>) =>
      fs.filter((f) => f.action?.kind === 'swap').length
    expect(swaps(best)).toBe(0)
    expect(swaps(worst)).toBe(15) // n(n-1)/2 for n=6
  })
})

describe('growth functions', () => {
  it('have the expected values at n=8', () => {
    expect(fnOf('log')(8)).toBe(3)
    expect(fnOf('lin')(8)).toBe(8)
    expect(fnOf('nlogn')(8)).toBe(24)
    expect(fnOf('quad')(8)).toBe(64)
    expect(fnOf('exp')(8)).toBe(256)
  })

  it('are ordered slowest→fastest for large n', () => {
    const n = 20
    const vals = ['log', 'lin', 'nlogn', 'quad', 'exp'].map((k) => fnOf(k)(n))
    for (let i = 1; i < vals.length; i++) expect(vals[i]).toBeGreaterThan(vals[i - 1])
  })
})

describe('foundationsLecture registration', () => {
  it('is an explainer lecture, number 1', () => {
    expect(foundationsLecture.explainer).toBe(true)
    expect(foundationsLecture.number).toBe(1)
    expect(foundationsLecture.algorithms).toHaveLength(0)
    expect(foundationsLecture.id).toBe('foundations')
  })
})
