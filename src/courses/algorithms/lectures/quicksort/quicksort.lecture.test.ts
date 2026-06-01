import { describe, it, expect } from 'vitest'
import { runHoarePartition, hoarePartitionInto } from './algorithms/hoarePartition'
import { runQuickSort } from './algorithms/quickSort'
import { runLomutoPartition } from './algorithms/lomutoPartition'
import { runRandomizedQuickSort } from './algorithms/randomizedQuickSort'
import { toPlain } from '@/core/engine/indexing'
import { FrameBuilder } from '@/core/engine/FrameBuilder'

describe('Hoare partition', () => {
  it('produces a valid split: every A[p..q] ≤ every A[q+1..r]', () => {
    // run the partition directly to capture q
    const b = new FrameBuilder([5, 3, 2, 6, 4, 1, 3, 7])
    const q = hoarePartitionInto(b, 1, 8, 0)
    const frames = b.build()
    const arr = toPlain(frames[frames.length - 1].array)
    const left = arr.slice(0, q) // 0-indexed [0..q-1] == 1-indexed [1..q]
    const right = arr.slice(q)
    expect(Math.max(...left)).toBeLessThanOrEqual(Math.min(...right))
    expect([...arr].sort((a, c) => a - c)).toEqual([1, 2, 3, 3, 4, 5, 6, 7])
  })

  it('emits compare and swap actions (for the cost meter) + is frozen', () => {
    const frames = runHoarePartition({ array: [5, 3, 2, 6, 4, 1, 3, 7] })
    expect(frames.some((f) => f.action?.kind === 'compare')).toBe(true)
    expect(frames.some((f) => f.action?.kind === 'swap')).toBe(true)
    for (const f of frames) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(f.narration.length).toBeGreaterThan(0)
    }
  })
})

describe('Quicksort', () => {
  const sortedOf = (arr: number[]) => {
    const frames = runQuickSort({ array: arr })
    return toPlain(frames[frames.length - 1].array)
  }

  it('sorts random, reverse, sorted, duplicates and tiny inputs', () => {
    expect(sortedOf([5, 3, 8, 4, 1, 7])).toEqual([1, 3, 4, 5, 7, 8])
    expect(sortedOf([9, 8, 7, 6, 5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(sortedOf([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    expect(sortedOf([4, 4, 2, 4, 1, 2])).toEqual([1, 2, 2, 4, 4, 4])
    expect(sortedOf([2, 1])).toEqual([1, 2])
  })

  it('is deterministic', () => {
    const a = runQuickSort({ array: [5, 3, 8, 4, 1, 7] })
    const b = runQuickSort({ array: [5, 3, 8, 4, 1, 7] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })

  it('ends with every element marked sorted', () => {
    const frames = runQuickSort({ array: [5, 3, 8, 4, 1, 7] })
    const last = frames[frames.length - 1]
    const sorted = last.highlights.find((h) => h.role === 'sorted')
    expect(sorted?.indices.length).toBe(6)
  })
})

describe('Lomuto partition', () => {
  it('places the pivot in its final position (CLRS example)', () => {
    const frames = runLomutoPartition({ array: [2, 8, 7, 1, 3, 5, 6, 4] })
    const last = frames[frames.length - 1]
    expect(toPlain(last.array)).toEqual([2, 1, 3, 4, 7, 5, 6, 8])
    // pivot value 4 lands at 1-indexed position 4 and is marked sorted
    expect(last.highlights.find((h) => h.role === 'sorted')?.indices).toContain(4)
  })
})

describe('Randomized-Quicksort', () => {
  const sortedOf = (arr: number[]) => {
    const frames = runRandomizedQuickSort({ array: arr })
    return toPlain(frames[frames.length - 1].array)
  }

  it('sorts correctly — including the worst-case-for-naive sorted input', () => {
    expect(sortedOf([1, 2, 3, 4, 5, 6, 7])).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(sortedOf([5, 3, 8, 4, 1, 7])).toEqual([1, 3, 4, 5, 7, 8])
    expect(sortedOf([9, 8, 7, 6, 5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('is deterministic for a given seed', () => {
    const a = runRandomizedQuickSort({ array: [5, 3, 8, 4, 1, 7], extra: { seed: 7 } })
    const b = runRandomizedQuickSort({ array: [5, 3, 8, 4, 1, 7], extra: { seed: 7 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })
})
