import type { ElementId, Frame, FrameAction, Highlight, Marker, WatchVar } from './types'

interface EmitInput {
  narration: string
  codeLine?: number | null
  codeBlock?: string
  highlights?: Highlight[]
  action?: FrameAction
  phase?: string
  callDepth?: number
  markers?: Marker[]
  /** Tracked scalar variables for the WatchPanel. */
  vars?: WatchVar[]
  /** Highlights/markers for the auxiliary lane (Merge-Sort output). */
  auxHighlights?: Highlight[]
  auxMarkers?: Marker[]
  /** Bespoke per-frame data for a custom view. */
  scene?: unknown
}

/**
 * Mutable scratchpad that algorithm generators drive. It tracks the live
 * 1-indexed array, the per-value identities, and the heap size, and turns each
 * `emit()` into a frozen, standalone `Frame` snapshot (so scrubbing backward is
 * a pure read). `swap()` moves value AND identity together — the single
 * invariant that makes the swap animation work.
 */
export class FrameBuilder {
  /** 1-indexed; slot 0 is an unused sentinel (NaN). */
  private array: number[]
  private elementIds: ElementId[]
  private heapSize: number
  private n: number
  private frames: Frame[] = []
  private idSeq = 0
  private currentBlock = ''
  private currentPhase: string | undefined
  private currentScene: unknown
  /** Open auxiliary lane (1-indexed, slot 0 sentinel) or null when closed. */
  private aux: { array: number[]; elementIds: ElementId[]; labelHe?: string } | null = null

  /** @param values plain 0-indexed values. */
  constructor(values: number[]) {
    this.n = values.length
    this.heapSize = values.length
    this.array = [NaN, ...values]
    this.elementIds = ['', ...values.map(() => this.nextId())]
  }

  private nextId(): ElementId {
    return `e${this.idSeq++}`
  }

  // ---- accessors -----------------------------------------------------------
  value(i: number): number {
    return this.array[i]
  }
  /** The identity currently sitting at slot i (1-indexed). */
  elementIdAt(i: number): ElementId {
    return this.elementIds[i]
  }
  /** Current 1-indexed slot of a given identity (follows it through swaps). */
  indexOfElement(id: ElementId): number {
    return this.elementIds.indexOf(id)
  }
  get size(): number {
    return this.heapSize
  }
  get length(): number {
    return this.n
  }

  // ---- mutations -----------------------------------------------------------
  setBlock(id: string): this {
    this.currentBlock = id
    return this
  }
  setPhase(phase: string | undefined): this {
    this.currentPhase = phase
    return this
  }
  setHeapSize(s: number): this {
    this.heapSize = s
    return this
  }
  /** Set bespoke per-frame data carried to the next emit()s (until changed). */
  setScene(scene: unknown): this {
    this.currentScene = scene
    return this
  }

  // ---- auxiliary lane (e.g. Merge-Sort output) -----------------------------
  /** Start an empty output lane. */
  openAux(labelHe?: string): void {
    this.aux = { array: [NaN], elementIds: [''], labelHe }
  }
  /** Discard the output lane without writing it back. */
  closeAux(): void {
    this.aux = null
  }
  /** Current number of elements placed in the aux lane. */
  get auxLength(): number {
    return this.aux ? this.aux.array.length - 1 : 0
  }
  /** Move the value+identity at main slot `src` into the next aux slot. The main
   *  slot is blanked (consumed) so the element visually flies into the output. */
  moveToAux(src: number): void {
    if (!this.aux) return
    this.aux.array.push(this.array[src])
    this.aux.elementIds.push(this.elementIds[src])
    this.array[src] = NaN
    this.elementIds[src] = ''
  }
  /** Write the aux lane back into the main array starting at slot `p`, then close it. */
  copyAuxBack(p: number): void {
    if (!this.aux) return
    for (let t = 1; t < this.aux.array.length; t++) {
      this.array[p + t - 1] = this.aux.array[t]
      this.elementIds[p + t - 1] = this.aux.elementIds[t]
    }
    this.aux = null
  }

  /** Swap value AND identity at two 1-indexed slots. */
  swap(i: number, j: number): void {
    ;[this.array[i], this.array[j]] = [this.array[j], this.array[i]]
    ;[this.elementIds[i], this.elementIds[j]] = [
      this.elementIds[j],
      this.elementIds[i],
    ]
  }

  /** Append a fresh value with a new identity (e.g. Priority-Queue insert). */
  push(value: number): number {
    this.array.push(value)
    this.elementIds.push(this.nextId())
    this.n += 1
    this.heapSize += 1
    return this.array.length - 1
  }

  /** Overwrite the value at a slot, keeping its identity. */
  setValue(i: number, value: number): void {
    this.array[i] = value
  }

  // ---- emit ----------------------------------------------------------------
  emit(input: EmitInput): void {
    const frame: Frame = {
      id: this.frames.length,
      array: this.array.slice(),
      elementIds: this.elementIds.slice(),
      heapSize: this.heapSize,
      n: this.n,
      highlights: (input.highlights ?? []).map((h) => ({
        role: h.role,
        indices: h.indices.slice(),
      })),
      codeLine: input.codeLine ?? null,
      codeBlock: input.codeBlock ?? this.currentBlock,
      narration: input.narration,
      action: input.action,
      phase: input.phase ?? this.currentPhase,
      callDepth: input.callDepth,
      markers: input.markers?.map((m) => ({ ...m })),
      vars: input.vars?.map((v) => ({ ...v })),
      aux: this.aux
        ? {
            array: this.aux.array.slice(),
            elementIds: this.aux.elementIds.slice(),
            labelHe: this.aux.labelHe,
            highlights: (input.auxHighlights ?? []).map((h) => ({
              role: h.role,
              indices: h.indices.slice(),
            })),
            markers: input.auxMarkers?.map((m) => ({ ...m })),
          }
        : undefined,
      scene: input.scene ?? this.currentScene,
    }
    deepFreeze(frame)
    this.frames.push(frame)
  }

  build(): Frame[] {
    return this.frames
  }
}

function deepFreeze(frame: Frame): void {
  Object.freeze(frame.array)
  Object.freeze(frame.elementIds)
  frame.highlights.forEach((h) => {
    Object.freeze(h.indices)
    Object.freeze(h)
  })
  Object.freeze(frame.highlights)
  if (frame.action) Object.freeze(frame.action)
  if (frame.markers) {
    frame.markers.forEach((m) => Object.freeze(m))
    Object.freeze(frame.markers)
  }
  if (frame.vars) {
    frame.vars.forEach((v) => Object.freeze(v))
    Object.freeze(frame.vars)
  }
  if (frame.aux) {
    Object.freeze(frame.aux.array)
    Object.freeze(frame.aux.elementIds)
    frame.aux.highlights?.forEach((h) => {
      Object.freeze(h.indices)
      Object.freeze(h)
    })
    if (frame.aux.highlights) Object.freeze(frame.aux.highlights)
    frame.aux.markers?.forEach((m) => Object.freeze(m))
    if (frame.aux.markers) Object.freeze(frame.aux.markers)
    Object.freeze(frame.aux)
  }
  if (frame.scene) Object.freeze(frame.scene)
  Object.freeze(frame)
}

/** Convenience for building a single-highlight array. */
export function hl(
  role: Highlight['role'],
  ...indices: number[]
): Highlight {
  return { role, indices }
}

/** Build a `FrameAction` of kind 'done'. */
export const DONE: FrameAction = { kind: 'done' }

/** Compact WatchVar constructors. `vi` = index var (a slot position, so the
 *  panel can also show A[slot]); `vv` = value var (a standalone number).
 *  `from` optionally names a variable this one was just assigned from (draws an arrow). */
export const vi = (
  name: string,
  slot: number,
  tone?: WatchVar['tone'],
  from?: string,
): WatchVar => ({ name, value: slot, kind: 'index', tone, from })
export const vv = (
  name: string,
  value: number,
  tone?: WatchVar['tone'],
  from?: string,
): WatchVar => ({ name, value, kind: 'value', tone, from })
