import { describe, it, expect } from 'vitest'
import type { Frame } from '@/engine/types'
import type { FlowScene } from './scene'
import { runCountingSort, countingResult } from './algorithms/countingSort'
import { runRadixSort, radixResult } from './algorithms/radixSort'
import { runBucketSort, bucketResult } from './algorithms/bucketSort'
import { linearSortLecture } from './index'

const sortedAsc = (a: number[]) => [...a].sort((x, y) => x - y)

/** Final-frame chips on the lowest row (the output), left→right, with ids. */
function outputChips(frames: Frame[]): { value: number; id: string }[] {
  const scene = frames[frames.length - 1].scene as FlowScene
  const maxY = Math.max(...scene.chips.map((c) => c.y))
  return scene.chips
    .filter((c) => c.y === maxY)
    .sort((a, z) => a.x - z.x)
    .map((c) => ({ value: Number(c.label.startsWith('.') ? '0' + c.label : c.label), id: c.id }))
}

const idNum = (id: string) => Number(id.replace('e', ''))

describe('Counting Sort', () => {
  it('sorts integers in 1..k including duplicates', () => {
    expect(countingResult(runCountingSort({ array: [3, 1, 2, 3, 1, 2] }))).toEqual([1, 1, 2, 2, 3, 3])
    expect(countingResult(runCountingSort({ array: [4, 2, 5, 1, 3, 2] }))).toEqual([1, 2, 2, 3, 4, 5])
    expect(countingResult(runCountingSort({ array: [1, 1] }))).toEqual([1, 1])
    expect(countingResult(runCountingSort({ array: [5, 4, 3, 2, 1] }))).toEqual([1, 2, 3, 4, 5])
  })

  it('is stable — equal keys keep their input order', () => {
    // 1's are at input positions 4 and 6 → ids e3, e5; they must stay e3 before e5.
    const out = outputChips(runCountingSort({ array: [2, 2, 2, 1, 3, 1] }))
    const ones = out.filter((c) => c.value === 1).map((c) => idNum(c.id))
    expect(ones).toEqual([3, 5])
    const twos = out.filter((c) => c.value === 2).map((c) => idNum(c.id))
    expect(twos).toEqual([0, 1, 2])
  })

  it('is deterministic with frozen, narrated frames', () => {
    const a = runCountingSort({ array: [3, 1, 2, 3, 1, 2] })
    const b = runCountingSort({ array: [3, 1, 2, 3, 1, 2] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
    for (const f of a) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(f.narration.length).toBeGreaterThan(0)
    }
  })
})

describe('Radix Sort', () => {
  it('sorts multi-digit numbers', () => {
    expect(radixResult(runRadixSort({ array: [29, 13, 48, 5, 31, 27] }))).toEqual([5, 13, 27, 29, 31, 48])
    expect(radixResult(runRadixSort({ array: [170, 45, 75, 90, 2, 802, 24, 66] }))).toEqual(
      [2, 24, 45, 66, 75, 90, 170, 802],
    )
  })

  it('does exactly d passes (one digit per pass)', () => {
    const frames = runRadixSort({ array: [29, 13, 48, 5, 31, 27] }) // max 2 digits → d = 2
    const passIntros = frames.filter((f) => f.codeLine === 2).length
    expect(passIntros).toBe(2)
  })

  it('is deterministic', () => {
    const a = runRadixSort({ array: [29, 13, 48, 5, 31, 27] })
    const b = runRadixSort({ array: [29, 13, 48, 5, 31, 27] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })
})

describe('Bucket Sort', () => {
  it('sorts reals in [0,1)', () => {
    const inA = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94]
    expect(bucketResult(runBucketSort({ array: inA }))).toEqual(sortedAsc(inA))
    const inB = [0.42, 0.05, 0.88, 0.51, 0.23, 0.67]
    expect(bucketResult(runBucketSort({ array: inB }))).toEqual(sortedAsc(inB))
  })

  it('handles a clustered (worst-case) input correctly', () => {
    const c = [0.71, 0.78, 0.72, 0.75, 0.12, 0.77]
    expect(bucketResult(runBucketSort({ array: c }))).toEqual(sortedAsc(c))
  })

  it('is deterministic with frozen frames', () => {
    const a = runBucketSort({ array: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94] })
    const b = runBucketSort({ array: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
    for (const f of a) expect(Object.isFrozen(f)).toBe(true)
  })
})

describe('linearSortLecture registration', () => {
  it('is an explainer lecture, number 8, no auto-registered algorithms', () => {
    expect(linearSortLecture.explainer).toBe(true)
    expect(linearSortLecture.number).toBe(8)
    expect(linearSortLecture.algorithms).toHaveLength(0)
    expect(linearSortLecture.id).toBe('linear-sort')
  })
})
