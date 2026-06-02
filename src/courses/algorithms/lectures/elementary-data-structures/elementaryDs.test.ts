import { describe, it, expect } from 'vitest'
import type { Frame } from '@/core/engine/types'
import { isDsScene } from './scene'
import { runChaining, chainingResult } from './algorithms/chaining'
import { runOpenAddressing, openResult } from './algorithms/openAddressing'
import { runHashDistribution, distributionResult } from './algorithms/hashFunctions'
import { runDirectAddress, directResult } from './algorithms/directAddress'
import { runStack, stackResult } from './algorithms/stack'
import { runQueue, queueResult } from './algorithms/queue'
import { elementaryDataStructuresLecture } from './index'

/** Generic frame invariants every generator must satisfy. */
function assertInvariants(frames: Frame[]) {
  expect(frames.length).toBeGreaterThan(0)
  for (const f of frames) {
    expect(Object.isFrozen(f)).toBe(true)
    expect(f.narration.length).toBeGreaterThan(0)
    expect(isDsScene(f.scene)).toBe(true)
    if (isDsScene(f.scene)) {
      const ids = f.scene.chips.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length) // unique chip ids per frame
    }
  }
}
const varNames = (f: Frame) => (f.vars ?? []).map((v) => v.name)

describe('Chaining', () => {
  it('places each key under slot k mod m, head-insertion order', () => {
    const frames = runChaining({ array: [12, 7, 25, 18, 3, 10], extra: { m: 5 } })
    // 12,7→slot2 ; 25,10→slot0 ; 18,3→slot3. Head-insert ⇒ newest first.
    expect(chainingResult(frames)).toEqual([[10, 25], [], [7, 12], [3, 18], []])
  })

  it('keeps every inserted key (no loss)', () => {
    const keys = [3, 8, 13, 18, 1, 6, 11]
    const frames = runChaining({ array: keys, extra: { m: 5 } })
    const flat = chainingResult(frames).flat().sort((a, b) => a - b)
    expect(flat).toEqual([...keys].sort((a, b) => a - b))
  })

  it('insert (hash) frames carry k and h(k); the α frame carries n and m', () => {
    const frames = runChaining({ array: [12, 7], extra: { m: 5 } })
    const hashFrame = frames.find((f) => f.codeLine === 1)!
    expect(varNames(hashFrame)).toEqual(expect.arrayContaining(['k', 'h(k)']))
    const alphaFrame = frames.find((f) => f.phase === 'גורם העומס α')!
    expect(varNames(alphaFrame)).toEqual(expect.arrayContaining(['n', 'm']))
  })

  it('searches a present key (reports נמצא)', () => {
    const frames = runChaining({ array: [12, 7, 25, 18, 3], extra: { m: 5, search: 7 } })
    expect(frames.some((f) => f.narration.includes('נמצא!'))).toBe(true)
  })

  it('is deterministic with valid invariants', () => {
    const a = runChaining({ array: [12, 7, 25, 18, 3, 10], extra: { m: 5 } })
    const b = runChaining({ array: [12, 7, 25, 18, 3, 10], extra: { m: 5 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
    assertInvariants(a)
  })
})

describe('Open addressing (linear probing)', () => {
  it('places every key in a distinct slot', () => {
    const keys = [12, 7, 25, 18, 3]
    const slots = openResult(runOpenAddressing({ array: keys, extra: { m: 7 } }))
    expect(slots).toHaveLength(7)
    const present = slots.filter((s): s is number => s !== null).sort((a, b) => a - b)
    expect(present).toEqual([...keys].sort((a, b) => a - b))
  })

  it('resolves a cluster of collisions without overwriting', () => {
    const keys = [7, 14, 21, 8, 15] // 7,14,21 ≡ 0 (mod 7) — collide and probe
    const slots = openResult(runOpenAddressing({ array: keys, extra: { m: 7 } }))
    const present = slots.filter((s): s is number => s !== null)
    expect(present.sort((a, b) => a - b)).toEqual([...keys].sort((a, b) => a - b))
  })

  it('probe frames carry i and slot', () => {
    const frames = runOpenAddressing({ array: [7, 14], extra: { m: 7 } })
    const probe = frames.find((f) => f.codeLine === 3)!
    expect(varNames(probe)).toEqual(expect.arrayContaining(['i', 'slot']))
  })

  it('is deterministic', () => {
    const a = runOpenAddressing({ array: [12, 7, 25, 18, 3], extra: { m: 7 } })
    const b = runOpenAddressing({ array: [12, 7, 25, 18, 3], extra: { m: 7 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
    assertInvariants(a)
  })
})

describe('Hash-function distribution', () => {
  it('bin counts sum to n (division)', () => {
    const keys = [12, 7, 25, 18, 3, 10, 22]
    const counts = distributionResult(runHashDistribution({ array: keys, extra: { m: 7, method: 0 } }))
    expect(counts.reduce((a, b) => a + b, 0)).toBe(keys.length)
  })

  it('puts each key in bin k mod m (division)', () => {
    const counts = distributionResult(runHashDistribution({ array: [7, 14, 21], extra: { m: 7, method: 0 } }))
    expect(counts[0]).toBe(3) // all ≡ 0 (mod 7)
  })

  it('multiplication method also spreads all keys', () => {
    const keys = [12, 7, 25, 18, 3, 10, 22]
    const counts = distributionResult(runHashDistribution({ array: keys, extra: { m: 7, method: 1 } }))
    expect(counts.reduce((a, b) => a + b, 0)).toBe(keys.length)
  })
})

describe('Direct addressing', () => {
  it('stores key k in slot k', () => {
    const slots = directResult(runDirectAddress({ array: [2, 5, 8, 3], extra: { U: 10 } }))
    expect(slots[2]).toBe(2)
    expect(slots[5]).toBe(5)
    expect(slots[8]).toBe(8)
    expect(slots[3]).toBe(3)
    expect(slots[0]).toBeNull()
  })
})

describe('Stack (LIFO)', () => {
  it('push only', () => {
    expect(stackResult(runStack({ array: [5, 8, 3, 9] }))).toEqual([5, 8, 3, 9])
  })
  it('push and pop respects LIFO', () => {
    expect(stackResult(runStack({ array: [5, 8, 0, 3, 0, 0] }))).toEqual([])
    expect(stackResult(runStack({ array: [5, 8, 3, 0] }))).toEqual([5, 8])
  })
})

describe('Queue (FIFO)', () => {
  it('keeps the right multiset after enqueue/dequeue', () => {
    const frames = runQueue({ array: [5, 8, 0, 3, 0, 9], extra: { m: 6 } })
    // enqueue 5,8 → dequeue(5) → enqueue 3 → dequeue(8) → enqueue 9 ⇒ {3,9}
    expect(queueResult(frames).sort((a, b) => a - b)).toEqual([3, 9])
  })
})

describe('elementaryDataStructuresLecture registration', () => {
  it('is an explainer lecture, number 9, with glossary & formulas', () => {
    expect(elementaryDataStructuresLecture.explainer).toBe(true)
    expect(elementaryDataStructuresLecture.number).toBe(9)
    expect(elementaryDataStructuresLecture.algorithms).toHaveLength(0)
    expect(elementaryDataStructuresLecture.id).toBe('elementary-data-structures')
    expect(elementaryDataStructuresLecture.glossary?.length).toBeGreaterThan(0)
    expect(elementaryDataStructuresLecture.formulas?.length).toBeGreaterThan(0)
  })
})
