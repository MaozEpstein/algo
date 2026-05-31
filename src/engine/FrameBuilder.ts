import type { ElementId, Frame, FrameAction, Highlight } from './types'

interface EmitInput {
  narration: string
  codeLine?: number | null
  codeBlock?: string
  highlights?: Highlight[]
  action?: FrameAction
  phase?: string
  callDepth?: number
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
