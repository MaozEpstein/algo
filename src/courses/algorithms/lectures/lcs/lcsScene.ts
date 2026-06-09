/**
 * Per-frame data for the LCS dynamic-programming table view. The scene is a full
 * snapshot of the `c` table filled so far, plus the current cell, its dependency
 * cells, the traceback path, and the running LCS string.
 */
export interface Cell {
  i: number
  j: number
}

export interface LcsScene {
  kind: 'lcs'
  X: string
  Y: string
  m: number
  n: number
  /** (m+1) x (n+1); null = not yet computed. */
  c: (number | null)[][]
  phase: 'fill' | 'back'
  /** The cell being computed / visited. */
  cur?: Cell
  /** Dependency cells feeding `cur` (diagonal for a match; up+left otherwise). */
  deps?: Cell[]
  /** Whether X[i-1] === Y[j-1] at the current cell. */
  match?: boolean
  /** Traceback cells visited so far (highlighted). */
  path?: Cell[]
  /** The move taken at the current traceback step. */
  arrow?: { from: Cell; to: Cell }
  /** LCS letters collected so far (already in output order). */
  lcs?: string
}

export const isLcsScene = (s: unknown): s is LcsScene =>
  !!s && typeof s === 'object' && (s as LcsScene).kind === 'lcs'

export const CELL = 44
export const GAP = 6
export const PAD = 40 // room for the header row/column of characters

export const cellLeft = (j: number) => PAD + j * (CELL + GAP)
export const cellTop = (i: number) => PAD + i * (CELL + GAP)
