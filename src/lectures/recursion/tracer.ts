import type { Frame } from '@/engine/types'
import type { CallFrame, RecursionScene } from './scene'

/**
 * A tiny helper for the recursion lecture: holds the live call stack and turns
 * each step into a frozen Frame carrying a RecursionScene. Recursion isn't an
 * array algorithm, so (like Hanoi) frames are built directly — `array` is an
 * empty stub and everything lives in `scene` + narration + codeLine + callDepth.
 */
export class Tracer {
  readonly frames: Frame[] = []
  /** Live call stack: outermost first, deepest last. */
  readonly stack: CallFrame[] = []
  readonly printed: string[] = []
  private result: string | undefined
  private seq = 0
  private readonly codeBlock: string

  constructor(codeBlock: string) {
    this.codeBlock = codeBlock
  }

  /** Push a new call onto the stack and return its CallFrame (mutate it freely).
   *  The id is unique per call instance and stable across emits → smooth animation. */
  push(callTex: string): CallFrame {
    const f: CallFrame = { id: `c${this.seq++}`, callTex, status: 'active' }
    this.stack.push(f)
    return f
  }

  pop(): void {
    this.stack.pop()
  }

  setResult(resultTex: string): void {
    this.result = resultTex
  }

  /** Snapshot the current state as an immutable Frame. */
  emit(codeLine: number | null, narration: string, done = false): void {
    const scene: RecursionScene = {
      stack: this.stack.map((f) => ({ ...f })),
      resultTex: this.result,
      printed: this.printed.length ? [...this.printed] : undefined,
    }
    const frame: Frame = {
      id: this.frames.length,
      array: [],
      elementIds: [],
      heapSize: 0,
      n: 0,
      highlights: [],
      codeLine,
      codeBlock: this.codeBlock,
      narration,
      action: done ? { kind: 'done' } : undefined,
      callDepth: Math.max(0, this.stack.length - 1),
      scene,
    }
    Object.freeze(scene.stack)
    Object.freeze(scene)
    Object.freeze(frame)
    this.frames.push(frame)
  }

  build(): Frame[] {
    return this.frames
  }
}
