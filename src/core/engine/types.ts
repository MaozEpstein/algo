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
  tone: 'pivot' | 'i' | 'j' | 'bound' | 'k'
}

/** One tracked variable shown in the WatchPanel strip (e.g. `i = 5`, `x = 7`).
 *  Frames are self-contained: the panel renders ONLY from this, no engine state. */
export interface WatchVar {
  /** Display name, rendered verbatim LTR (e.g. 'i', 'j', 'pivot', 'x', 'largest'). */
  name: string
  /** For an 'index' var this is the 1-indexed SLOT; for a 'value' var the number. */
  value: number
  /** 'index' = a position into the array (panel may also show A[value]);
   *  'value' = a standalone number (no element lookup). Default 'value'. */
  kind?: 'index' | 'value'
  /** Color key — reuses the ArrayView/Marker TONE palette. When omitted, the
   *  panel infers from `name` (i→i, j→j, pivot→pivot, …) else a neutral tone. */
  tone?: Marker['tone']
  /** Name of another tracked variable this one was just assigned FROM, e.g.
   *  `largest ← l`. The WatchPanel draws an arrow from `from` to this variable
   *  on the frame where the relationship holds. */
  from?: string
}

/** An optional second array lane (e.g. the Merge-Sort output). Its `elementIds`
 *  are shared with the main array, so a value animates as it flies between lanes. */
export interface AuxLane {
  /** Values, 1-indexed (slot 0 sentinel), like the main array. */
  array: number[]
  elementIds: ElementId[]
  highlights?: Highlight[]
  markers?: Marker[]
  labelHe?: string
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
  /** Tracked scalar variables for the WatchPanel strip (i, j, pivot, x, …).
   *  When absent, the panel derives chips from `markers`. */
  vars?: WatchVar[]
  /** Optional second array lane (e.g. Merge-Sort output). */
  aux?: AuxLane
  /** Free-form per-frame data for bespoke custom views (e.g. Hanoi pegs,
   *  Merge-Sort recursion-tree state). Cast by the view that owns it. */
  scene?: unknown
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
  /** Override the 'main' routine badge label (default "אלגוריתם"). E.g. the
   *  recursion lecture uses "פונקציה רקורסיבית" — these are examples, not algorithms. */
  routineLabelHe?: string
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
  /** Per-algorithm view override (falls back to the lecture's `views`). Lets one
   *  lecture mix algorithms with different visualizations (e.g. array vs custom). */
  views?: ViewKind[]
  /** Per-algorithm bespoke renderer, used when `views` includes 'custom'. */
  customViz?: ComponentType<{ frame: Frame }>
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

/** One navigable high-level step chip derived from the frame stream (the
 *  StepTimeline). The derivation is course-specific and supplied per lecture. */
export interface Step {
  label: string
  index: number
  /** Render the label left-to-right (for bracketed ranges like [1..5]). */
  ltr?: boolean
  /** Recursion: a call (descending) vs a return (ascending) — drives the
   *  arrow/colour and the call→return divider in the timeline. */
  kind?: 'call' | 'return'
}

/** One entry in a lecture's glossary — a concept name + a short explanation. */
export interface GlossaryTerm {
  term: string
  def: string
  /** Optional LaTeX formula, rendered (KaTeX) below the explanation. */
  tex?: string
}

/** One entry in a lecture's "key formulas" sheet — a name + the LaTeX formula
 *  and an optional one-line note. */
export interface FormulaItem {
  name: string
  tex: string
  note?: string
  /** Render across the full grid width — for long formulas that would otherwise overflow. */
  wide?: boolean
}

/** One entry in a lecture's "new variables" dictionary — a symbol (LaTeX) + a
 *  one-line description (may use $…$ inline math) and an optional unit. Surfaced
 *  as a "משתנים" tab alongside the glossary concepts. */
export interface SymbolItem {
  sym: string
  he: string
  unit?: string
}

/** The single contract the shell knows about. Adding a lecture = implement this. */
export interface LectureModule {
  id: string
  number: number
  /** Display label for the lecture number, e.g. '3 · חלק ב׳'. Falls back to String(number). */
  numberLabelHe?: string
  /** Lesson-level name (shared by all parts of one lesson), e.g. 'קבל MOS' — used as the
   *  group header in the course-home list view. Set only on multi-part lessons; falls back
   *  to `titleHe` for single-part lessons. */
  lessonHe?: string
  titleHe: string
  subtitleEn: string
  /** Which visual representations to render in the DualView. */
  views: ViewKind[]
  /** Escape hatch for bespoke visualizations. */
  customViz?: ComponentType<{ frame: Frame }>
  algorithms: AlgorithmSpec[]
  /** Hebrew summary + complexity table component. For an `explainer` lecture this
   *  slot instead holds the whole 4-tab page (the shell renders it directly). */
  summary: ComponentType
  /** Marks a non-algorithm "explainer" lecture: the shell renders `summary` as the
   *  whole page (its own tabs) — no mode tabs, no guided player. `algorithms` is []. */
  explainer?: boolean
  /** Course-specific deriver of high-level step chips for the guided StepTimeline.
   *  Supplied by the course (keeps the core shell free of algorithm names). */
  deriveSteps?: (frames: Frame[]) => Step[]
  /** Foundational concepts taught in this lecture — surfaced via a "מושגי יסוד"
   *  button in the lecture header (term → short explanation). */
  glossary?: GlossaryTerm[]
  /** Key formulas of this lecture — surfaced via a "נוסחאות מרכזיות" button. */
  formulas?: FormulaItem[]
  /** New variables/symbols introduced in this lecture — a quick-reference
   *  dictionary shown as a "משתנים" tab inside the "מושגי יסוד" modal. */
  symbols?: SymbolItem[]
}

export type LearningMode = 'guided' | 'summary'
