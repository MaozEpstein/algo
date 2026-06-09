import { describe, it, expect } from 'vitest'
import { runKnapsack, knapsackValue } from './knapsack'
import { isKnapScene, type Item } from './knapsackScene'
import type { Frame } from '@/core/engine/types'

const finalScene = (frames: Frame[]) => {
  const s = frames[frames.length - 1].scene
  if (!isKnapScene(s)) throw new Error('no knap scene')
  return s
}

const CASES: { items: Item[]; W: number }[] = [
  { items: [{ w: 1, v: 8 }, { w: 3, v: 6 }, { w: 5, v: 5 }], W: 8 },
  { items: [{ w: 1, v: 8 }, { w: 3, v: 6 }, { w: 5, v: 5 }], W: 3 },
  { items: [{ w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 8 }], W: 10 },
  { items: [{ w: 2, v: 5 }, { w: 2, v: 3 }, { w: 2, v: 4 }], W: 6 },
  { items: [{ w: 4, v: 10 }, { w: 5, v: 9 }], W: 3 }, // nothing fits
]

describe('0-1 Knapsack dynamic programming', () => {
  it('recovers an optimal item set: fits W and sums to the reference value', () => {
    for (const { items, W } of CASES) {
      const s = finalScene(runKnapsack(items, W))
      const ref = knapsackValue(items, W)
      const chosen = s.taken ?? []
      const weight = chosen.reduce((a, i) => a + items[i - 1].w, 0)
      const value = chosen.reduce((a, i) => a + items[i - 1].v, 0)
      expect(weight, `weight ≤ W for W=${W}`).toBeLessThanOrEqual(W)
      expect(value, `value === optimal for W=${W}`).toBe(ref)
      expect(s.value).toBe(ref)
    }
  })

  it('the slide example {(1,8),(3,6),(5,5)}, W=8 → value 14, items {1,2}', () => {
    const s = finalScene(runKnapsack([{ w: 1, v: 8 }, { w: 3, v: 6 }, { w: 5, v: 5 }], 8))
    expect(s.value).toBe(14)
    expect(s.taken).toEqual([1, 2])
  })

  it('nothing fits → value 0, no items', () => {
    const s = finalScene(runKnapsack([{ w: 4, v: 10 }, { w: 5, v: 9 }], 3))
    expect(s.value).toBe(0)
    expect(s.taken).toEqual([])
  })

  it('is deterministic', () => {
    const a = runKnapsack(CASES[0].items, CASES[0].W)
    const b = runKnapsack(CASES[0].items, CASES[0].W)
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })

  it('frames are frozen snapshots with knap scenes + Hebrew narration; both phases present', () => {
    const frames = runKnapsack(CASES[0].items, CASES[0].W)
    for (const f of frames) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(isKnapScene(f.scene)).toBe(true)
      expect(f.narration.length).toBeGreaterThan(0)
    }
    expect(frames.some((f) => isKnapScene(f.scene) && f.scene.phase === 'fill')).toBe(true)
    expect(frames.some((f) => isKnapScene(f.scene) && f.scene.phase === 'back')).toBe(true)
  })
})
