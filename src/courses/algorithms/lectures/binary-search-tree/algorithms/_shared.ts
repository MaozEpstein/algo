import { FrameBuilder } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, ValidateResult } from '@/core/engine/types'
import { buildBst, resetIds, type BstNode } from '../bst'

/** The classic CLRS sample tree (Figure 12.x) — balanced, good for every demo. */
export const DEFAULT_KEYS = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9]

/** A right-leaning chain — the worst case where h = n-1 (every op is O(n)). */
export const SKEWED_KEYS = [1, 2, 3, 4, 5, 6, 7]

/** Reset ids, build the starting tree, and create a FrameBuilder. The builder's
 *  array is only scaffolding (BstView renders purely from `scene`); we use it for
 *  frozen self-contained frames, narration, codeLine and watched variables. */
export function setup(input: AlgorithmInput): { b: FrameBuilder; root: BstNode | null } {
  resetIds()
  const root = buildBst(input.array)
  const b = new FrameBuilder(input.array.length ? input.array : [0])
  return { b, root }
}

/** Validate sandbox input as a set of distinct keys (BSTs assume no duplicates). */
export function validateKeys(raw: string): ValidateResult {
  const res = parseIntArray(raw, { min: 1, max: 15, minValue: 0, maxValue: 99 })
  if (!res.ok) return res
  const seen = new Set<number>()
  for (const v of res.value.array) {
    if (seen.has(v)) return { ok: false, error: `המפתח ${v} מופיע פעמיים — בעץ חיפוש המפתחות נבדלים זה מזה.` }
    seen.add(v)
  }
  return res
}

/** Pick the operation target key from `extra`, falling back to a key that exists
 *  in the tree (the median key) so an edited array still demos sensibly. */
export function targetKey(input: AlgorithmInput): number {
  if (input.extra?.key != null) return input.extra.key
  const sorted = [...input.array].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)] ?? 0
}
