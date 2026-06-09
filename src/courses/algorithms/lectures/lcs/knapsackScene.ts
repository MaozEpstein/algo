/**
 * Per-frame data for the 0-1 Knapsack dynamic-programming table. K[i][w] is the
 * best value using the first i items within capacity w. Reuses the LCS grid
 * geometry. Mirrors LcsScene but with item/capacity headers and a "taken" set.
 */
export interface Item {
  w: number
  v: number
}
export interface KnapCell {
  i: number
  j: number
}

export interface KnapScene {
  kind: 'knap'
  items: Item[]
  /** Capacity (columns 0..W). */
  W: number
  k: number
  /** (k+1) x (W+1); null = not yet computed. */
  K: (number | null)[][]
  phase: 'fill' | 'back'
  cur?: KnapCell
  /** Dependency cells: the "skip" (up) cell and, when the item fits, the "take" cell. */
  deps?: KnapCell[]
  /** Whether the current item fits (wᵢ ≤ w) — drives dep tinting. */
  fits?: boolean
  /** Traceback cells visited so far. */
  path?: KnapCell[]
  arrow?: { from: KnapCell; to: KnapCell }
  /** 1-based indices of items chosen so far (output order). */
  taken?: number[]
  /** Total value of the chosen items. */
  value?: number
}

export const isKnapScene = (s: unknown): s is KnapScene =>
  !!s && typeof s === 'object' && (s as KnapScene).kind === 'knap'
