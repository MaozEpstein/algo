import type { ComponentType } from 'react'

/**
 * The engine is built around ONE idea: every algorithm is a pure, deterministic
 * generator that turns an input into an ordered list of immutable `Frame`s.
 * The learning modes (guided / summary) are just different *consumers* of that
 * same frame list.
 *
 * Indexing convention: 1-indexed to match the CLRS pseudocode in the course
 * (root at index 1; parent=i/2, left=2i, right=2i+1). Slot 0 in `array` /
 * `elementIds` is an unused sentinel.
 */

/** A stable identity that travels WITH a value as it moves between slots.
 *  This is what lets a swap animate (the cell/node follows its value). */
export type ElementId = string

export type HighlightRole =
  | 'comparing' // two cells being compared
  | 'largest' // the running "largest" candidate in Heapify
  | 'swapping' // the two cells about to swap / swapping
  | 'current' // the node the algorithm is focused on
  | 'sorted' // finalized / in its sorted place
  | 'heapBoundary' // marks the current heap-size boundary
  | 'inserted' // freshly inserted element
  | 'extracted' // element being removed (e.g. ExtractMax)
  | 'path' // a path being traced (bubble up/down)
  | 'pivot' // Quicksort: the chosen pivot element
  | 'less' // Quicksort: region known to be ≤ pivot
  | 'greater' // Quicksort: region known to be ≥ pivot
  | 'active' // Quicksort: the subarray currently being partitioned
  | 'median' // Selection: the median of a group of 5

export interface Highlight {
  role: HighlightRole
  /** 1-indexed positions this highlight applies to. */
  indices: number[]
}

/** A pointer/label drawn above a specific array cell (e.g. Quicksort i / j / pivot). */
export interface Marker {
  label: string
  /** 1-indexed slot the marker points at. */
  index: number
  tone: 'pivot' | 'i' | 'j' | 'bound'
}

/** A structured description of what happens AT this frame.
 *  Practice questions are derived automatically from this stream. */
export type FrameAction =
  | { kind: 'compare'; a: number; b: number }
  | { kind: 'setLargest'; index: number; from: number }
  | { kind: 'swap'; a: number; b: number }
  | { kind: 'recurse'; into: number }
  | { kind: 'noSwap'; at: number }
  | { kind: 'shrinkHeap'; newSize: number }
  | { kind: 'placeSorted'; index: number }
  | { kind: 'bubbleUp'; from: number; to: number }
  | { kind: 'insert'; value: number; at: number }
  | { kind: 'extract'; value: number }
  | { kind: 'done' }

/** A complete, standalone snapshot of the data structure at one step.
 *  Every frame is self-contained so the player can scrub backward instantly. */
export interface Frame {
  /** Sequential id, 0-based, equal to the index in the frame array. */
  id: number
  /** Values, 1-indexed (slot 0 is an unused sentinel). */
  array: number[]
  /** Parallel to `array`: the identity of the value sitting in each slot. */
  elementIds: ElementId[]
  /** How many leading slots are part of the heap (rest = sorted tail / outside). */
  heapSize: number
  /** Logical element count for this run. */
  n: number
  highlights: Highlight[]
  /** 1-based line number within the active pseudocode block, or null. */
  codeLine: number | null
  /** Which pseudocode block is executing (matches PseudocodeBlock.id). */
  codeBlock: string
  /** ONE short Hebrew sentence describing this step. */
  narration: string
  action?: FrameAction
  /** Coarse phase label, e.g. 'build' | 'sort' | 'insert'. */
  phase?: string
  /** Recursion depth — drives the call-stack breadcrumb. */
  callDepth?: number
  /** Pointer markers above cells (e.g. Quicksort i / j / pivot / p / r). */
  markers?: Marker[]
}

export type PseudocodeLang = 'pseudo' | 'python'

/** Is a code routine a top-level algorithm or a helper subroutine? */
export type RoutineKind = 'main' | 'helper'

export interface PseudocodeBlock {
  id: string
  titleEn: string
  titleHe: string
  /** Whether this routine is a main algorithm or a helper. */
  kind: RoutineKind
  /** English, line-numbered (verbatim from the slides). */
  lines: string[]
  /** Optional parallel Python rendering for the language toggle. */
  pythonLines?: string[]
}

/** One line of a complexity proof: a Hebrew explanation + optional LaTeX. */
export interface ProofStep {
  he: string
  tex?: string
}

/** A structured, displayable complexity proof. */
export interface ComplexityProof {
  /** The final result in LaTeX, e.g. 'O(n \\log n)'. */
  result: string
  claimHe: string
  steps: ProofStep[]
  /** The "see it" intuition, one or two sentences. */
  intuitionHe?: string
}

export interface AlgorithmInput {
  /** 1-indexed array (slot 0 sentinel) OR a plain 0-indexed array that the
   *  algorithm normalizes — see normalizeInput(). */
  array: number[]
  /** Extra scalar params (e.g. insert value, seed). */
  extra?: Record<string, number>
}

export type ValidateResult =
  | { ok: true; value: AlgorithmInput }
  | { ok: false; error: string }

/** A one-click example input that demonstrates a notable/edge case. */
export interface Preset {
  labelHe: string
  input: AlgorithmInput
  /** Optional tooltip explaining what this input demonstrates. */
  noteHe?: string
  /** The worst case — shows maximum complexity. Rendered with a distinct style. */
  worst?: boolean
}

export interface AlgorithmSpec {
  id: string
  titleHe: string
  titleEn: string
  /** Whether this is a standalone algorithm or a helper subroutine. */
  kind: RoutineKind
  /** Mark as optional ("רשות") course material — shown with a badge. */
  optional?: boolean
  /** Canonical Hebrew description of the routine — shown in the guided
   *  instruction card, the summary overview, and operation tooltips. */
  blurbHe: string
  /** Worst-case time complexity in LaTeX, e.g. 'O(\\log n)'. Single source of truth. */
  complexity: string
  /** For helpers: Hebrew names of the algorithms that call it. */
  helperOfHe?: string[]
  /** Hebrew names of the helper routines this algorithm calls. */
  usesHe?: string[]
  /** Optional displayable complexity proof. */
  proof?: ComplexityProof
  pseudocode: PseudocodeBlock[]
  /** Pure, deterministic, total. Same input → same frames. */
  run: (input: AlgorithmInput) => Frame[]
  /** Parse a raw user string from the sandbox into an input. */
  validateInput: (raw: string) => ValidateResult
  defaultInput: AlgorithmInput
  /** One-click instructive example inputs (edge cases, worst cases, …). */
  presets?: Preset[]
  /** Present iff this is a full array sort — drives the Overview hub (table + race). */
  sortProfile?: SortProfile
}

/** Comparison attributes for a full sorting algorithm (Overview hub). */
export interface SortProfile {
  /** Worst-case time in LaTeX, e.g. 'O(n^2)'. */
  worst: string
  /** Average/expected time in LaTeX. */
  average: string
  stableHe: 'יציב' | 'לא יציב'
  inPlaceHe: 'במקום' | 'לא במקום'
  whenHe: string
}

export type ViewKind = 'array' | 'tree' | 'recursionTree' | 'custom'

/** The single contract the shell knows about. Adding a lecture = implement this. */
export interface LectureModule {
  id: string
  number: number
  titleHe: string
  subtitleEn: string
  /** Which visual representations to render in the DualView. */
  views: ViewKind[]
  /** Escape hatch for bespoke visualizations. */
  customViz?: ComponentType<{ frame: Frame }>
  algorithms: AlgorithmSpec[]
  /** Hebrew summary + complexity table component. */
  summary: ComponentType
}

export type LearningMode = 'guided' | 'summary'
