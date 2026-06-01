import { describe, it, expect } from 'vitest'
import { FrameBuilder } from '@/engine/FrameBuilder'
import { toPlain } from '@/engine/indexing'
import { runMergeSort } from './algorithms/mergeSort'
import { runMerge, mergeInto } from './algorithms/merge'
import { runHanoi } from './algorithms/hanoi'
import type { HanoiScene } from './scene'

describe('Merge-Sort', () => {
  const sortedOf = (arr: number[]) => {
    const frames = runMergeSort({ array: arr })
    return toPlain(frames[frames.length - 1].array)
  }

  it('sorts random, reverse, sorted, duplicates and tiny inputs', () => {
    expect(sortedOf([5, 2, 8, 4, 7, 1, 9, 3])).toEqual([1, 2, 3, 4, 5, 7, 8, 9])
    expect(sortedOf([8, 7, 6, 5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(sortedOf([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    expect(sortedOf([4, 2, 4, 1, 2, 4, 1, 3])).toEqual([1, 1, 2, 2, 3, 4, 4, 4])
    expect(sortedOf([2, 1])).toEqual([1, 2])
  })

  it('is deterministic and emits frozen, narrated frames', () => {
    const a = runMergeSort({ array: [5, 2, 8, 4, 1, 7] })
    const b = runMergeSort({ array: [5, 2, 8, 4, 1, 7] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
    for (const f of a) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(f.narration.length).toBeGreaterThan(0)
    }
  })

  it('ends with every element marked sorted', () => {
    const frames = runMergeSort({ array: [5, 2, 8, 4, 7, 1] })
    const last = frames[frames.length - 1]
    const sorted = last.highlights.find((h) => h.role === 'sorted')
    expect(sorted?.indices.length).toBe(6)
  })
})

describe('Merge (helper)', () => {
  it('mergeInto merges two sorted halves into a sorted run', () => {
    const b = new FrameBuilder([1, 3, 5, 2, 4, 6]) // left [1,3,5], right [2,4,6]
    mergeInto(b, 1, 3, 6, 0)
    const frames = b.build()
    expect(toPlain(frames[frames.length - 1].array)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('standalone runMerge sorts each half first, then merges', () => {
    const frames = runMerge({ array: [5, 2, 8, 1, 4, 9] })
    expect(toPlain(frames[frames.length - 1].array)).toEqual([1, 2, 4, 5, 8, 9])
    expect(frames.some((f) => f.aux !== undefined)).toBe(true) // the output lane appears
  })
})

describe('Towers of Hanoi', () => {
  const movesOf = (frames: ReturnType<typeof runHanoi>) =>
    frames
      .map((f) => (f.scene as HanoiScene | undefined)?.moving)
      .filter((m): m is NonNullable<typeof m> => !!m)

  it('makes exactly 2^n − 1 legal moves and ends with the tower on peg C', () => {
    for (const n of [1, 2, 3, 4, 5]) {
      const frames = runHanoi({ array: [n] })
      const moves = movesOf(frames)
      expect(moves.length).toBe(2 ** n - 1)

      // replay and check every move is legal (top disk, never bigger-on-smaller)
      const pegs: number[][] = [[], [], []]
      for (let d = n; d >= 1; d--) pegs[0].push(d)
      for (const mv of moves) {
        expect(pegs[mv.from][pegs[mv.from].length - 1]).toBe(mv.disk)
        pegs[mv.from].pop()
        const destTop = pegs[mv.to][pegs[mv.to].length - 1]
        if (destTop !== undefined) expect(mv.disk).toBeLessThan(destTop)
        pegs[mv.to].push(mv.disk)
      }
      const expected = Array.from({ length: n }, (_, i) => n - i)
      expect(pegs[2]).toEqual(expected)
    }
  })

  it('records the move count and emits frozen frames', () => {
    const frames = runHanoi({ array: [4] })
    const last = frames[frames.length - 1]
    expect((last.scene as HanoiScene).moves).toBe(15)
    for (const f of frames) expect(Object.isFrozen(f)).toBe(true)
  })
})
