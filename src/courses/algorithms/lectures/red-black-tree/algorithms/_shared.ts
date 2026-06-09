import { FrameBuilder } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, ValidateResult } from '@/core/engine/types'
import { buildRbTree, resetIds, type RbTree } from '../rbtree'

/** A medium tree that already exercises several colors/levels. */
export const DEFAULT_KEYS = [11, 2, 14, 1, 7, 15, 5, 8]

/** Reset ids, build a VALID red-black tree from the keys, make a FrameBuilder
 *  (its array is scaffolding only — RbTreeView renders purely from `scene`). */
export function setup(input: AlgorithmInput): { b: FrameBuilder; T: RbTree } {
  resetIds()
  const T = buildRbTree(input.array)
  const b = new FrameBuilder(input.array.length ? input.array : [0])
  return { b, T }
}

/** Distinct integers (RB keys are distinct, like any BST). */
export function validateKeys(raw: string): ValidateResult {
  const res = parseIntArray(raw, { min: 1, max: 15, minValue: 0, maxValue: 99 })
  if (!res.ok) return res
  const seen = new Set<number>()
  for (const v of res.value.array) {
    if (seen.has(v)) return { ok: false, error: `המפתח ${v} מופיע פעמיים — בעץ חיפוש המפתחות נבדלים.` }
    seen.add(v)
  }
  return res
}

/** Target key for insert/delete from `extra.key`, with a sensible fallback. */
export function targetKey(input: AlgorithmInput, fallback: number): number {
  return input.extra?.key ?? fallback
}
