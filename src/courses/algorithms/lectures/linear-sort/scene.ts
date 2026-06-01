/**
 * Per-frame bespoke data for the linear-time sorts. All three algorithms
 * (counting / radix / bucket) emit the SAME generic `FlowScene`: a set of value
 * chips with explicit pixel positions plus static "zone" boxes. One dumb view
 * (`FlowView`) animates the chips by id to their target (x, y) — so a value
 * flying from the input row into a bucket / the output is a single layout
 * transition. Computing the layout in the pure generator keeps it unit-testable.
 */

export type ChipTone = 'idle' | 'active' | 'compare' | 'done' | 'count'
export type BoxTone = 'lane' | 'bucket' | 'count' | 'active' | 'output'

/** A value chip. Identity (`id`) is stable across frames so it animates. */
export interface FlowChip {
  id: string
  label: string
  /** Top-left target position in px (inside the scene's coordinate box). */
  x: number
  y: number
  tone?: ChipTone
  /** Optional 0-based index of a character in `label` to emphasize (radix digit). */
  emphAt?: number
}

/** A static rectangle: an array lane slot, a bucket, or a count bin. */
export interface FlowBox {
  x: number
  y: number
  w: number
  h: number
  tone?: BoxTone
  /** Text drawn inside (e.g. a count value), centered. */
  value?: string
  /** Small label drawn just above the box. */
  labelTop?: string
  /** Small label drawn just below the box. */
  labelBottom?: string
}

export interface FlowScene {
  kind: 'flow'
  width: number
  height: number
  boxes: FlowBox[]
  chips: FlowChip[]
}

/** Layout constants shared by all three generators + the view. */
export const CELL = 44
export const PITCH = 52

export const isFlowScene = (s: unknown): s is FlowScene =>
  !!s && typeof s === 'object' && (s as FlowScene).kind === 'flow'
