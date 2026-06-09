import { describe, it, expect } from 'vitest'
import {
  buildRbTree,
  find,
  inorderKeys,
  makeTree,
  rbInsert,
  resetIds,
  validateRb,
  validateSize,
} from '../red-black-tree/rbtree'
import { osRank, osSelect } from './ostree'
import { runOsSelect, osSelectSpec } from './algorithms/osSelect'
import { runOsRank } from './algorithms/osRank'
import { runOsInsert } from './algorithms/osInsert'
import { orderStatisticTreeLecture } from './index'
import { deriveAlgorithmSteps } from '../../steps'
import { isRbScene } from '../red-black-tree/rbScene'
import type { Frame } from '@/core/engine/types'

const KEYS = [11, 2, 14, 1, 7, 15, 5, 8]

describe('order-statistic queries — correctness', () => {
  it('size invariant holds after build and after each insert', () => {
    resetIds()
    const T = makeTree()
    for (const k of [10, 5, 15, 3, 7, 13, 17, 1, 9, 12, 20]) {
      rbInsert(T, k)
      expect(validateSize(T).ok, `size valid after inserting ${k} (${validateSize(T).reason})`).toBe(true)
      expect(validateRb(T).ok).toBe(true) // size maintenance must not break RB validity
    }
  })

  it('OS-Select(i) returns the i-th smallest key for every i', () => {
    resetIds()
    const T = buildRbTree(KEYS)
    const sorted = inorderKeys(T)
    for (let i = 1; i <= sorted.length; i++) {
      expect(osSelect(T, i).key, `OS-Select(${i})`).toBe(sorted[i - 1])
    }
  })

  it('OS-Rank(key) returns its 1-indexed position', () => {
    resetIds()
    const T = buildRbTree(KEYS)
    const sorted = inorderKeys(T)
    for (const key of KEYS) {
      expect(osRank(T, find(T, key)), `OS-Rank(${key})`).toBe(sorted.indexOf(key) + 1)
    }
  })

  it('OS-Select and OS-Rank are inverse', () => {
    resetIds()
    const T = buildRbTree(KEYS)
    for (let i = 1; i <= KEYS.length; i++) {
      expect(osRank(T, osSelect(T, i))).toBe(i)
    }
  })
})

const sceneOk = (frames: Frame[], expectSize = true) => {
  expect(frames.length).toBeGreaterThan(0)
  for (const f of frames) {
    expect(Object.isFrozen(f)).toBe(true)
    expect(f.narration.length).toBeGreaterThan(0)
    expect(isRbScene(f.scene)).toBe(true)
  }
  if (expectSize) {
    const last = frames[frames.length - 1].scene
    expect(isRbScene(last) && last.nodes.every((n) => typeof n.size === 'number')).toBe(true)
  }
}

describe('generators', () => {
  it('OS-Select produces size-badged frames, deterministically', () => {
    const f = runOsSelect({ array: KEYS, extra: { i: 4 } })
    sceneOk(f)
    expect(JSON.stringify(runOsSelect({ array: KEYS, extra: { i: 4 } }))).toEqual(JSON.stringify(f))
  })
  it('OS-Rank produces size-badged frames', () => sceneOk(runOsRank({ array: KEYS, extra: { key: 7 } })))
  it('Insert (size maintenance) produces size-badged frames', () => sceneOk(runOsInsert({ array: KEYS, extra: { key: 4 } })))
})

describe('guided-mode shortcuts', () => {
  const TOURS = ['osSelect', 'osRank', 'osInsert']
  it('every deep-link target resolves to a registered algorithm', () => {
    for (const t of TOURS) expect(orderStatisticTreeLecture.algorithms.some((a) => a.id === t), t).toBe(true)
  })
  it('every algorithm wires the custom view', () => {
    for (const a of orderStatisticTreeLecture.algorithms) {
      expect(a.views).toEqual(['custom'])
      expect(a.customViz).toBeTruthy()
    }
  })
  it('each algorithm yields StepTimeline chips at valid frame indices', () => {
    for (const a of orderStatisticTreeLecture.algorithms) {
      const frames = a.run(a.defaultInput)
      const steps = deriveAlgorithmSteps(frames)
      expect(steps.length, `${a.id} step count`).toBeGreaterThan(0)
      for (const s of steps) {
        expect(s.index).toBeGreaterThanOrEqual(0)
        expect(s.index).toBeLessThan(frames.length)
      }
    }
  })
  it('OS-Select default input is valid', () => {
    expect(osSelectSpec.validateInput(KEYS.join(', ')).ok).toBe(true)
  })
})
