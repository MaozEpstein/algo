import { describe, it, expect } from 'vitest'
import { runMaxHeapify } from './algorithms/maxHeapify'
import { runBuildMaxHeap } from './algorithms/buildMaxHeap'
import { runHeapSort } from './algorithms/heapSort'
import { runHeapExtractMax, runHeapInsert } from './algorithms/priorityQueue'
import { left, right, toPlain } from '@/core/engine/indexing'

describe('Max-Heapify (CLRS Figure 6.2)', () => {
  // A = ⟨16,4,10,14,7,9,3,2,8,1⟩, call Max-Heapify(A, 2).
  const frames = runMaxHeapify({
    array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1],
    extra: { startIndex: 2 },
  })

  it('is deterministic (same input → identical frames)', () => {
    const again = runMaxHeapify({
      array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1],
      extra: { startIndex: 2 },
    })
    expect(JSON.stringify(again)).toEqual(JSON.stringify(frames))
  })

  it('ends with the CLRS result ⟨16,14,10,8,7,9,3,2,4,1⟩', () => {
    const final = frames[frames.length - 1]
    expect(toPlain(final.array)).toEqual([16, 14, 10, 8, 7, 9, 3, 2, 4, 1])
  })

  it('the value 4 sinks via two swaps (4↔14, then 4↔8)', () => {
    const swaps = frames.filter((f) => f.action?.kind === 'swap')
    expect(swaps).toHaveLength(2)
    expect(swaps[0].action).toEqual({ kind: 'swap', a: 2, b: 4 })
    expect(swaps[1].action).toEqual({ kind: 'swap', a: 4, b: 9 })
  })

  it('every frame is a standalone, frozen snapshot', () => {
    for (const f of frames) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(Object.isFrozen(f.array)).toBe(true)
      expect(f.array.length).toBe(11) // 10 values + slot-0 sentinel
    }
  })

  it('every frame carries a Hebrew narration string', () => {
    for (const f of frames) {
      expect(typeof f.narration).toBe('string')
      expect(f.narration.length).toBeGreaterThan(0)
    }
  })
})

/** Verify the max-heap property on the live heap region of a frame. */
function isMaxHeap(arr1: number[], heapSize: number): boolean {
  for (let i = 1; i <= heapSize; i++) {
    const l = left(i)
    const r = right(i)
    if (l <= heapSize && arr1[l] > arr1[i]) return false
    if (r <= heapSize && arr1[r] > arr1[i]) return false
  }
  return true
}

describe('Build-Max-Heap (CLRS Figure 6.3)', () => {
  const frames = runBuildMaxHeap({ array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] })

  it('produces a valid max-heap at the end', () => {
    const final = frames[frames.length - 1]
    expect(isMaxHeap(final.array, final.heapSize)).toBe(true)
    expect(final.array[1]).toBe(16) // root is the maximum
  })

  it('contains the same multiset of values', () => {
    const final = frames[frames.length - 1]
    expect(toPlain(final.array).sort((a, b) => a - b)).toEqual(
      [1, 2, 3, 4, 7, 8, 9, 10, 14, 16],
    )
  })
})

describe('HeapSort', () => {
  const input = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7]
  const frames = runHeapSort({ array: input })

  it('ends fully sorted ascending', () => {
    const final = frames[frames.length - 1]
    expect(toPlain(final.array)).toEqual([...input].sort((a, b) => a - b))
  })

  it('the heap region stays a valid max-heap throughout the sort phase', () => {
    for (const f of frames) {
      if (f.phase === 'sort' && f.codeBlock === 'heapSort' && f.codeLine === 3) {
        // at the top of each sort iteration the heap must be valid
        expect(isMaxHeap(f.array, f.heapSize)).toBe(true)
      }
    }
  })

  it('is deterministic', () => {
    const again = runHeapSort({ array: input })
    expect(JSON.stringify(again)).toEqual(JSON.stringify(frames))
  })

  it('sorts a reverse-sorted and a random input', () => {
    const rev = runHeapSort({ array: [9, 8, 7, 6, 5, 4, 3, 2, 1] })
    expect(toPlain(rev[rev.length - 1].array)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const rnd = runHeapSort({ array: [5, 3, 8, 1, 9, 2, 7] })
    expect(toPlain(rnd[rnd.length - 1].array)).toEqual([1, 2, 3, 5, 7, 8, 9])
  })
})

describe('Priority Queue', () => {
  const HEAP = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]

  it('Insert keeps a valid max-heap and places the key correctly', () => {
    const frames = runHeapInsert({ array: HEAP, extra: { key: 15 } })
    const final = frames[frames.length - 1]
    expect(final.heapSize).toBe(11)
    expect(isMaxHeap(final.array, final.heapSize)).toBe(true)
    expect(final.array[1]).toBe(16) // 15 climbs but stays under 16
    expect(toPlain(final.array)).toContain(15)
  })

  it('Extract-Max returns the root and leaves a valid heap', () => {
    const frames = runHeapExtractMax({ array: HEAP })
    const final = frames[frames.length - 1]
    expect(final.heapSize).toBe(9)
    expect(isMaxHeap(final.array, final.heapSize)).toBe(true)
    expect(final.array[10]).toBe(16) // extracted max parked just outside the heap
  })
})
