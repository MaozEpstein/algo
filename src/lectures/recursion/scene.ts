/** Per-frame data for the call-stack view (carried in Frame.scene). */

export interface CallFrame {
  /** Unique id per call instance (drives the push/pop animation). */
  id: string
  /** The call as code, e.g. 'factorial(3)' (rendered LTR/mono). */
  callTex: string
  /** Current state of this call. */
  status: 'active' | 'waiting' | 'base' | 'returned'
  /** One short Hebrew line describing what this frame is doing right now. */
  detailHe?: string
  /** The value this call returns, once known (e.g. '6'). */
  returnTex?: string
}

export interface RecursionScene {
  /** Outermost call first → deepest last (rendered as a nested stack). */
  stack: CallFrame[]
  /** Final returned value when the whole computation is done. */
  resultTex?: string
  /** Side-effect output (e.g. count_down prints). */
  printed?: string[]
}
