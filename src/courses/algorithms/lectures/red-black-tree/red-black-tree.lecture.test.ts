import { describe, it, expect } from 'vitest'
import {
  buildRbTree,
  find,
  inorderKeys,
  isNil,
  leftRotate,
  makeTree,
  rbDelete,
  rbInsert,
  realNodes,
  resetIds,
  rightRotate,
  treeHeight,
  validateRb,
} from './rbtree'
import { runRotations } from './algorithms/rotations'
import { runRbInsert, rbInsertSpec } from './algorithms/rbInsert'
import { runRbDelete } from './algorithms/rbDelete'
import { redBlackTreeLecture } from './index'
import { deriveAlgorithmSteps } from '../../steps'
import { isRbScene } from './rbScene'
import type { Frame } from '@/core/engine/types'

const isSorted = (xs: number[]) => xs.every((v, i) => i === 0 || xs[i - 1] < v)
const heightBound = (n: number) => 2 * Math.log2(n + 1)

const KEYS = [11, 2, 14, 1, 7, 15, 5, 8]

describe('rbtree core — validity invariants', () => {
  it('buildRbTree yields a valid RB tree (sorted, height-bounded) for many inputs', () => {
    const inputs = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // ascending — would skew a plain BST
      [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      KEYS,
      [5, 3, 8, 1, 4, 7, 9, 2, 6],
      [50, 25, 75, 12, 37, 62, 87, 6, 18],
    ]
    for (const arr of inputs) {
      resetIds()
      const T = buildRbTree(arr)
      const v = validateRb(T)
      expect(v.ok, `RB valid for ${arr} (${v.reason})`).toBe(true)
      expect(isSorted(inorderKeys(T))).toBe(true)
      expect(treeHeight(T)).toBeLessThanOrEqual(heightBound(arr.length))
    }
  })

  it('RB-Insert keeps the tree valid and adds the key', () => {
    resetIds()
    const T = buildRbTree(KEYS)
    rbInsert(T, 4)
    expect(validateRb(T).ok).toBe(true)
    expect(inorderKeys(T)).toContain(4)
    expect(isSorted(inorderKeys(T))).toBe(true)
    expect(T.root.color).toBe('black')
  })

  it('RB-Delete keeps the tree valid and removes the key', () => {
    for (const key of [1, 5, 11, 14, 7]) {
      resetIds()
      const T = buildRbTree(KEYS)
      rbDelete(T, find(T, key))
      const v = validateRb(T)
      expect(v.ok, `valid after deleting ${key} (${v.reason})`).toBe(true)
      expect(inorderKeys(T)).not.toContain(key)
      expect(inorderKeys(T)).toHaveLength(KEYS.length - 1)
    }
  })

  it('Left-Rotate then its inverse Right-Rotate restores the tree', () => {
    resetIds()
    const T = buildRbTree(KEYS)
    const before = inorderKeys(T)
    const x = realNodes(T).find((n) => !isNil(T, n.right))!
    leftRotate(T, x)
    expect(inorderKeys(T)).toEqual(before) // rotation preserves inorder
    rightRotate(T, x.p) // invert
    expect(inorderKeys(T)).toEqual(before)
    expect(validateRb(T).ok).toBe(true)
  })

  it('insertions stay height-bounded under stress', () => {
    resetIds()
    const T = makeTree()
    for (let k = 1; k <= 31; k++) {
      rbInsert(T, k) // worst case for a plain BST (a chain)
      expect(validateRb(T).ok).toBe(true)
      expect(treeHeight(T)).toBeLessThanOrEqual(heightBound(k))
    }
  })
})

// ---- frame generators ------------------------------------------------------
const sceneOk = (frames: Frame[]) => {
  expect(frames.length).toBeGreaterThan(0)
  for (const f of frames) {
    expect(Object.isFrozen(f)).toBe(true)
    expect(typeof f.narration).toBe('string')
    expect(f.narration.length).toBeGreaterThan(0)
    expect(isRbScene(f.scene)).toBe(true)
  }
}

describe('RB-Insert generator', () => {
  const frames = runRbInsert({ array: KEYS, extra: { key: 4 } })
  it('produces valid RB frames', () => sceneOk(frames))
  it('is deterministic', () => {
    expect(JSON.stringify(runRbInsert({ array: KEYS, extra: { key: 4 } }))).toEqual(JSON.stringify(frames))
  })
  it('every insert fixup case (1, 2, 3) is exercised by some preset', () => {
    const lines = new Set<number>()
    for (const p of rbInsertSpec.presets ?? []) {
      for (const f of runRbInsert(p.input)) if (f.codeBlock === 'rbInsertFixup') lines.add(f.codeLine ?? -1)
    }
    expect(lines.has(5), 'case 1').toBe(true)
    expect(lines.has(8), 'case 2').toBe(true)
    expect(lines.has(10), 'case 3').toBe(true)
  })
  it('inserting into an empty tree makes a single black root', () => {
    const f = runRbInsert({ array: [], extra: { key: 50 } })
    const scene = f[f.length - 1].scene
    expect(isRbScene(scene) && scene.nodes).toHaveLength(1)
    expect(isRbScene(scene) && scene.nodes[0].color).toBe('black')
  })
})

describe('RB-Delete generator', () => {
  const frames = runRbDelete({ array: KEYS, extra: { key: 1 } })
  it('produces valid RB frames', () => sceneOk(frames))
  it('is deterministic', () => {
    expect(JSON.stringify(runRbDelete({ array: KEYS, extra: { key: 1 } }))).toEqual(JSON.stringify(frames))
  })
  it('a black deletion triggers Delete-Fixup', () => {
    const fired = runRbDelete({ array: KEYS, extra: { key: 1 } }).some((f) => f.codeBlock === 'rbDeleteFixup')
    expect(fired).toBe(true)
  })
})

describe('Rotations generator', () => {
  const frames = runRotations({ array: KEYS })
  it('produces valid RB frames', () => sceneOk(frames))
  it('is deterministic', () => {
    expect(JSON.stringify(runRotations({ array: KEYS }))).toEqual(JSON.stringify(frames))
  })
})

describe('guided-mode shortcuts (deep links + StepTimeline)', () => {
  const TOURS = ['rotations', 'rbInsert', 'rbDelete']
  it('every deep-link target resolves to a registered algorithm', () => {
    for (const t of TOURS) expect(redBlackTreeLecture.algorithms.some((a) => a.id === t), t).toBe(true)
  })
  it('every algorithm wires the custom RB view', () => {
    for (const a of redBlackTreeLecture.algorithms) {
      expect(a.views).toEqual(['custom'])
      expect(a.customViz).toBeTruthy()
    }
  })
  it('each algorithm yields StepTimeline chips at valid frame indices', () => {
    for (const a of redBlackTreeLecture.algorithms) {
      const frames = a.run(a.defaultInput)
      const steps = deriveAlgorithmSteps(frames)
      expect(steps.length, `${a.id} step count`).toBeGreaterThan(0)
      for (const s of steps) {
        expect(s.index).toBeGreaterThanOrEqual(0)
        expect(s.index).toBeLessThan(frames.length)
        expect(s.label.length).toBeGreaterThan(0)
      }
    }
  })
})
