/** Per-frame bespoke data carried in `Frame.scene` for this lecture's custom views. */

/** Merge-Sort: drives the recursion-tree view. */
export interface MergeScene {
  /** The subarray node currently being processed, 1-indexed inclusive. */
  active?: { lo: number; hi: number }
  /** Whether we're descending (splitting) or ascending (merging). */
  phase: 'split' | 'merge'
  /** "lo-hi" keys of nodes whose merge is already complete (shown as sorted). */
  done: string[]
}

/** Towers of Hanoi: drives the peg view. */
export interface HanoiScene {
  /** pegs[0..2] — each a bottom→top list of disk sizes. */
  pegs: number[][]
  /** The disk just moved (for a lift/drop animation), if any. */
  moving?: { disk: number; from: number; to: number }
  /** Move counter so far. */
  moves: number
}

export const rangeKey = (lo: number, hi: number): string => `${lo}-${hi}`
