import type { FrameBuilder } from '@/core/engine/FrameBuilder'
import { buildRbScene, type NodeTone } from '../rbScene'
import type { RbStep, RbTree } from '../rbtree'

/**
 * Bridges the pure rbtree.ts tracer to the frame engine: maps each step's
 * role→node assignments to highlight tones + labelled pointers, builds the
 * RB scene, and emits one frozen frame. The guided generators just run an
 * op with `makeTracer(b, T)` — the same op the tests run untraced.
 */
const ROLE_TONE: Record<string, NodeTone> = {
  z: 'active',
  x: 'active',
  y: 'compare',
  w: 'sibling',
  uncle: 'uncle',
  gp: 'gp',
  p: 'compare',
}
const ROLE_PTR: Record<string, { label: string; tone: 'z' | 'x' | 'w' | 'uncle' }> = {
  z: { label: 'z', tone: 'z' },
  x: { label: 'x', tone: 'x' },
  w: { label: 'w (אח)', tone: 'w' },
  uncle: { label: 'דוד', tone: 'uncle' },
}

export function makeTracer(b: FrameBuilder, T: RbTree, opts: { zTone?: NodeTone; showSize?: boolean } = {}) {
  return (s: RbStep) => {
    const toneById = new Map<string, NodeTone>()
    const pointers: { label: string; node?: import('../rbtree').RbNode; tone: 'z' | 'x' | 'w' | 'uncle' }[] = []
    for (const [role, node] of Object.entries(s.roles ?? {})) {
      if (!node) continue
      let tone: NodeTone = ROLE_TONE[role] ?? 'idle'
      if (role === 'z' && opts.zTone) tone = opts.zTone
      // a node already toned keeps the stronger (z/x) assignment
      if (!toneById.has(node.id)) toneById.set(node.id, tone)
      const pr = ROLE_PTR[role]
      if (pr) pointers.push({ label: pr.label, node, tone: pr.tone })
    }
    b.setScene(
      buildRbScene({
        tree: T,
        tone: (n) => toneById.get(n.id),
        doubleBlackId: s.doubleBlack?.id,
        pointers,
        showNil: true,
        size: opts.showSize ? (n) => n.size : undefined,
      }),
    )
    b.emit({
      codeBlock: s.block,
      codeLine: s.code,
      narration: s.he,
      action: s.done ? { kind: 'done' } : undefined,
    })
  }
}

/** Emit a plain frame of the current tree (no highlight) — for intros/outros. */
export function emitTree(b: FrameBuilder, T: RbTree, codeBlock: string, narration: string, showSize = false): void {
  b.setScene(buildRbScene({ tree: T, showNil: true, size: showSize ? (n) => n.size : undefined }))
  b.emit({ codeBlock, codeLine: null, narration })
}
