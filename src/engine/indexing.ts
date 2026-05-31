/** 1-indexed complete-binary-tree index arithmetic (CLRS convention). */

export const parent = (i: number): number => Math.floor(i / 2)
export const left = (i: number): number => 2 * i
export const right = (i: number): number => 2 * i + 1

/** Height of an n-element heap = floor(log2(n)). */
export const heapHeight = (n: number): number =>
  n <= 0 ? 0 : Math.floor(Math.log2(n))

/** Depth (level) of 1-indexed node i: root is depth 0. */
export const depthOf = (i: number): number => Math.floor(Math.log2(i))

/**
 * Convert a plain 0-indexed array of values into a 1-indexed array whose slot 0
 * is an unused sentinel (NaN), so algorithms can use natural 1-indexing.
 */
export function toOneIndexed(values: number[]): number[] {
  return [NaN, ...values]
}

/** Strip the slot-0 sentinel back to a plain array (for display/tests). */
export function toPlain(oneIndexed: number[]): number[] {
  return oneIndexed.slice(1)
}
