/**
 * Per-frame bespoke layout for the lecture-9 demos (stacks, queues, direct
 * addressing, hash functions, chaining, open addressing). All six generators
 * emit the SAME generic `DsScene`: value chips with explicit pixel positions,
 * static "slot" boxes, plus two extras that the linear-sort FlowScene lacks —
 * `arrows` (chain links / probe hops) and `pointers` (top / front / rear / h(k)
 * labels). One dumb view (`DsView`) animates the chips by id and draws the rest.
 * Computing the layout in the pure generator keeps it unit-testable.
 */

/** Layout constants (mirror linear-sort's scene). */
export const CELL = 44
export const PITCH = 52
/** Vertical pitch between consecutive chain nodes (cell + gap). */
export const CHAIN_DROP = 60
/** Gap between a slot and its first chain node. */
export const CHAIN_HEAD_GAP = 16

export type SlotTone = 'empty' | 'occupied' | 'probed' | 'collision' | 'active' | 'deleted'
export type ChipTone = 'idle' | 'active' | 'inserted' | 'found' | 'collision' | 'ghost'
export type PointerTone = 'top' | 'front' | 'rear' | 'hash' | 'probe'
export type ArrowTone = 'chain' | 'probe'

/** A static rectangle: a hash slot, a stack cell, a count bin, etc. */
export interface DsBox {
  x: number
  y: number
  w: number
  h: number
  tone?: SlotTone
  /** Text centered inside (e.g. a count, or a slot's index). */
  value?: string
  /** Small label drawn just above the box (e.g. slot index 0..m-1). */
  labelTop?: string
  /** Small label drawn just below the box. */
  labelBottom?: string
}

/** A value chip. Identity (`id`) is stable across frames so it animates. */
export interface DsChip {
  id: string
  label: string
  /** Top-left target position in px (inside the scene's coordinate box). */
  x: number
  y: number
  tone?: ChipTone
}

/** A chain link (slot → node, node → node) or a probe hop (slot → next slot). */
export interface DsArrow {
  from: { x: number; y: number }
  to: { x: number; y: number }
  tone?: ArrowTone
  dashed?: boolean
}

/** A labelled marker above/below a cell (top / front / rear / h(k) / probe i). */
export interface DsPointer {
  label: string
  /** Anchor: top-left of the cell it points at. */
  x: number
  y: number
  tone: PointerTone
  place?: 'above' | 'below'
}

export interface DsScene {
  kind: 'ds'
  width: number
  height: number
  boxes: DsBox[]
  chips: DsChip[]
  arrows?: DsArrow[]
  pointers?: DsPointer[]
}

export const isDsScene = (s: unknown): s is DsScene =>
  !!s && typeof s === 'object' && (s as DsScene).kind === 'ds'

// ---- shared layout helpers (used by every generator so layout stays consistent)

/** 0-indexed slot column for a horizontal row of cells. */
export const slotX = (i: number): number => i * PITCH
/** y (top) of the d-th chain node hanging under a slot whose top is at `slotY`. */
export const chainNodeY = (slotY: number, depth: number): number =>
  slotY + CELL + CHAIN_HEAD_GAP + CHAIN_DROP * depth
/** Center point of a CELL-sized box (for arrow endpoints). */
export const centerOf = (b: { x: number; y: number }): { x: number; y: number } => ({
  x: b.x + CELL / 2,
  y: b.y + CELL / 2,
})
