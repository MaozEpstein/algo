import { describe, it, expect } from 'vitest'
import { runInorderWalk } from './algorithms/inorderWalk'
import { runTreeSearch } from './algorithms/treeSearch'
import { runTreeInsert } from './algorithms/treeInsert'
import { runTreeMinMax } from './algorithms/treeMinMax'
import { runTreeSuccessor } from './algorithms/treeSuccessor'
import { runTreeDelete } from './algorithms/treeDelete'
import { runBstSort } from './algorithms/bstSort'
import { validateKeys } from './algorithms/_shared'
import { isBstScene, type BstScene } from './scene'
import { binarySearchTreeLecture } from './index'
import { deriveAlgorithmSteps } from '../../steps'
import type { Frame } from '@/core/engine/types'

const KEYS = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9]

const finalScene = (frames: Frame[]): BstScene => {
  const s = frames[frames.length - 1].scene
  if (!isBstScene(s)) throw new Error('final frame has no BST scene')
  return s
}
/** Nodes laid out left→right (by x) are in INORDER = sorted order for a valid BST. */
const keysByX = (s: BstScene): number[] =>
  [...s.nodes].sort((a, b) => a.x - b.x).map((n) => n.key)
const isSorted = (xs: number[]) => xs.every((v, i) => i === 0 || xs[i - 1] <= v)

const sharedInvariants = (name: string, frames: Frame[]) => {
  describe(name, () => {
    it('produces frames, each a frozen standalone snapshot with Hebrew narration', () => {
      expect(frames.length).toBeGreaterThan(0)
      for (const f of frames) {
        expect(Object.isFrozen(f)).toBe(true)
        expect(typeof f.narration).toBe('string')
        expect(f.narration.length).toBeGreaterThan(0)
      }
    })
    it('every frame carries a valid BST scene', () => {
      for (const f of frames) expect(isBstScene(f.scene)).toBe(true)
    })
    it('the final tree still satisfies the BST property (inorder = sorted)', () => {
      expect(isSorted(keysByX(finalScene(frames)))).toBe(true)
    })
  })
}

describe('Inorder-Tree-Walk', () => {
  const frames = runInorderWalk({ array: KEYS })
  sharedInvariants('invariants', frames)
  it('is deterministic', () => {
    expect(JSON.stringify(runInorderWalk({ array: KEYS }))).toEqual(JSON.stringify(frames))
  })
  it('the final narration prints the keys in sorted order', () => {
    const sorted = [...KEYS].sort((a, b) => a - b).join(', ')
    expect(frames[frames.length - 1].narration).toContain(sorted)
  })
})

describe('Tree-Search', () => {
  it('finds an existing key (ends with a "found" node)', () => {
    const frames = runTreeSearch({ array: KEYS, extra: { key: 13 } })
    const found = finalScene(frames).nodes.find((n) => n.tone === 'found')
    expect(found?.key).toBe(13)
  })
  it('reports a missing key (no "found" node, NIL shown)', () => {
    const frames = runTreeSearch({ array: KEYS, extra: { key: 10 } })
    const s = finalScene(frames)
    expect(s.nodes.some((n) => n.tone === 'found')).toBe(false)
    expect(s.nil).toBeDefined()
  })
  it('is deterministic', () => {
    const a = runTreeSearch({ array: KEYS, extra: { key: 13 } })
    const b = runTreeSearch({ array: KEYS, extra: { key: 13 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })
  sharedInvariants('invariants', runTreeSearch({ array: KEYS, extra: { key: 13 } }))
})

describe('Tree-Insert', () => {
  const frames = runTreeInsert({ array: KEYS, extra: { key: 8 } })
  sharedInvariants('invariants', frames)
  it('adds exactly the new key', () => {
    const s = finalScene(frames)
    expect(s.nodes).toHaveLength(KEYS.length + 1)
    expect(keysByX(s)).toContain(8)
  })
  it('inserting into an empty tree makes it the root', () => {
    const s = finalScene(runTreeInsert({ array: [], extra: { key: 42 } }))
    expect(keysByX(s)).toEqual([42])
  })
})

describe('Tree-Minimum / Maximum', () => {
  const frames = runTreeMinMax({ array: KEYS })
  sharedInvariants('invariants', frames)
  it('marks the true min and max', () => {
    const s = finalScene(frames)
    const min = s.nodes.find((n) => n.tone === 'min')
    const max = s.nodes.find((n) => n.tone === 'max')
    expect(min?.key).toBe(Math.min(...KEYS))
    expect(max?.key).toBe(Math.max(...KEYS))
  })
})

describe('Tree-Successor', () => {
  sharedInvariants('invariants', runTreeSuccessor({ array: KEYS, extra: { key: 15 } }))
  it('case 1 (right subtree): successor of 15 is 17', () => {
    const s = finalScene(runTreeSuccessor({ array: KEYS, extra: { key: 15 } }))
    expect(s.nodes.find((n) => n.tone === 'successor')?.key).toBe(17)
  })
  it('case 2 (climb up): successor of 13 is 15', () => {
    const s = finalScene(runTreeSuccessor({ array: KEYS, extra: { key: 13 } }))
    expect(s.nodes.find((n) => n.tone === 'successor')?.key).toBe(15)
  })
  it('the maximum (20) has no successor', () => {
    const s = finalScene(runTreeSuccessor({ array: KEYS, extra: { key: 20 } }))
    expect(s.nodes.some((n) => n.tone === 'successor')).toBe(false)
  })
})

describe('Tree-Delete', () => {
  const cases = [
    { key: 4, label: 'leaf' },
    { key: 18, label: 'one child' },
    { key: 6, label: 'two children' },
    { key: 15, label: 'root (two children)' },
  ]
  for (const c of cases) {
    it(`removes ${c.key} (${c.label}) keeping the BST valid`, () => {
      const s = finalScene(runTreeDelete({ array: KEYS, extra: { key: c.key } }))
      const keys = keysByX(s)
      expect(keys).toHaveLength(KEYS.length - 1)
      expect(keys).not.toContain(c.key)
      expect(isSorted(keys)).toBe(true)
    })
  }
  it('is deterministic', () => {
    const a = runTreeDelete({ array: KEYS, extra: { key: 6 } })
    const b = runTreeDelete({ array: KEYS, extra: { key: 6 } })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })
})

describe('BSTSort', () => {
  const input = [3, 1, 8, 2, 6, 7, 5]
  const frames = runBstSort({ array: input })
  sharedInvariants('invariants', frames)
  it('emits the sorted sequence in the final narration', () => {
    const sorted = [...input].sort((a, b) => a - b).join(', ')
    expect(frames[frames.length - 1].narration).toContain(sorted)
  })
  it('builds a tree with all n keys', () => {
    expect(finalScene(frames).nodes).toHaveLength(input.length)
  })
  it('handles the worst case (already-sorted → skewed chain)', () => {
    const s = finalScene(runBstSort({ array: [1, 2, 3, 4, 5] }))
    expect(keysByX(s)).toEqual([1, 2, 3, 4, 5])
  })
})

describe('guided-mode shortcuts (deep links + StepTimeline)', () => {
  // The "ראו בעיניים" deep links in content/summary.tsx use ?algo=<tour>.
  const TOURS = ['inorderWalk', 'treeSearch', 'treeInsert', 'treeMinMax', 'treeSuccessor', 'treeDelete', 'bstSort']

  it('every deep-link target resolves to a registered algorithm (so ?algo= works)', () => {
    for (const tour of TOURS) {
      expect(binarySearchTreeLecture.algorithms.some((a) => a.id === tour), tour).toBe(true)
    }
  })

  it('every algorithm wires the custom BST view (guided visualization)', () => {
    for (const a of binarySearchTreeLecture.algorithms) {
      expect(a.views).toEqual(['custom'])
      expect(a.customViz).toBeTruthy()
    }
  })

  it('each algorithm yields StepTimeline chips, all pointing at valid frames', () => {
    for (const a of binarySearchTreeLecture.algorithms) {
      const frames = a.run(a.defaultInput)
      const steps = deriveAlgorithmSteps(frames)
      expect(steps.length, `${a.id} step count`).toBeGreaterThan(0)
      for (const s of steps) {
        expect(s.index, `${a.id} step index`).toBeGreaterThanOrEqual(0)
        expect(s.index, `${a.id} step index`).toBeLessThan(frames.length)
        expect(typeof s.label).toBe('string')
        expect(s.label.length).toBeGreaterThan(0)
      }
    }
  })
})

describe('validateKeys', () => {
  it('accepts a list of distinct integers', () => {
    expect(validateKeys('15, 6, 18, 3').ok).toBe(true)
  })
  it('rejects duplicates (BST keys are distinct)', () => {
    const r = validateKeys('5, 3, 5')
    expect(r.ok).toBe(false)
  })
  it('rejects non-integers', () => {
    expect(validateKeys('5, x, 3').ok).toBe(false)
  })
})
