import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, Frame } from '@/core/engine/types'
import {
  CELL,
  PITCH,
  type ChipTone,
  type DsBox,
  type DsChip,
  type DsPointer,
  type DsScene,
} from '../scene'

const COL_X = 30
const TOP_Y = 40

interface Node {
  id: string
  label: string
}

/**
 * Stack (LIFO) — CLRS §10.1. Op-stream input: a positive value = PUSH it, 0 =
 * POP. The column grows upward from a fixed base; the `top` pointer tracks the
 * topmost element. Push/Pop are O(1) at the top.
 */
export function runStack(input: AlgorithmInput): Frame[] {
  const ops = input.array
  const b = new FrameBuilder([])
  b.setBlock('stack')

  // capacity = peak size over the run, for a stable column height
  let cap = 1
  let sz = 0
  for (const op of ops) {
    if (op > 0) sz += 1
    else if (sz > 0) sz -= 1
    cap = Math.max(cap, sz)
  }
  cap = Math.max(cap, 3)
  const yOf = (depth: number) => TOP_Y + (cap - 1 - depth) * PITCH
  const baseY = yOf(0)
  const width = COL_X + CELL + 90
  const height = baseY + CELL + 30
  const stageX = COL_X + CELL + 44

  const stack: Node[] = []
  let seq = 0

  const scene = (opts: { incoming?: Node; highlightId?: string; highlightTone?: ChipTone }): DsScene => {
    const boxes: DsBox[] = []
    for (let d = 0; d < cap; d++) {
      const occupied = d < stack.length
      boxes.push({
        x: COL_X,
        y: yOf(d),
        w: CELL,
        h: CELL,
        tone: occupied ? 'occupied' : 'empty',
        labelBottom: d === 0 ? 'בסיס' : undefined,
      })
    }
    const chips: DsChip[] = stack.map((node, d) => {
      const tone: ChipTone = opts.highlightId === node.id ? (opts.highlightTone ?? 'active') : 'idle'
      return { id: node.id, label: node.label, x: COL_X, y: yOf(d), tone }
    })
    if (opts.incoming) chips.push({ id: opts.incoming.id, label: opts.incoming.label, x: stageX, y: TOP_Y, tone: 'active' })
    const pointers: DsPointer[] = []
    if (stack.length > 0)
      pointers.push({ label: 'top', x: COL_X, y: yOf(stack.length - 1), tone: 'top', place: 'above' })
    return { kind: 'ds', width, height, boxes, chips, pointers }
  }

  b.setPhase('אתחול')
  b.emit({
    codeLine: null,
    narration: 'מחסנית ריקה (LIFO). Push מוסיף לראש, Pop מסיר מהראש — שניהם O(1).',
    scene: scene({}),
    vars: [vv('top', 0, 'bound')],
  })

  for (const op of ops) {
    if (op > 0) {
      b.setPhase('Push')
      const node: Node = { id: `s${seq++}`, label: String(op) }
      b.emit({
        codeLine: 1,
        narration: `Push(${op}): מגדילים top ל-${stack.length + 1} ומניחים את ${op} בראש.`,
        scene: scene({ incoming: node }),
        vars: [vv('x', op, 'pivot'), vv('top', stack.length + 1, 'bound')],
      })
      stack.push(node)
      b.emit({
        codeLine: 2,
        narration: `${op} נמצא כעת בראש המחסנית (top = ${stack.length}).`,
        scene: scene({ highlightId: node.id, highlightTone: 'inserted' }),
        vars: [vv('x', op, 'pivot'), vv('top', stack.length, 'bound')],
      })
    } else {
      b.setPhase('Pop')
      if (stack.length === 0) {
        b.emit({
          codeLine: 5,
          narration: 'Pop על מחסנית ריקה — underflow! אין מה להסיר.',
          scene: scene({}),
          vars: [vv('top', 0, 'bound')],
        })
        continue
      }
      const node = stack[stack.length - 1]
      b.emit({
        codeLine: 7,
        narration: `Pop(): מחזירים את ${node.label} מהראש (LIFO).`,
        scene: scene({ highlightId: node.id, highlightTone: 'found' }),
        vars: [vv('popped', Number(node.label), 'k'), vv('top', stack.length, 'bound')],
      })
      stack.pop()
      b.emit({
        codeLine: 6,
        narration: `הוסר ${node.label}; top ירד ל-${stack.length}.`,
        scene: scene({}),
        vars: [vv('popped', Number(node.label), 'k'), vv('top', stack.length, 'bound')],
      })
    }
  }

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — במחסנית ${stack.length} איברים. כל פעולה O(1).`,
    scene: scene({}),
    vars: [vv('top', stack.length, 'bound')],
  })

  return b.build()
}

/** Final stack contents bottom→top (values), from the last frame. For tests. */
export function stackResult(frames: Frame[]): number[] {
  const scene = frames[frames.length - 1].scene as DsScene
  return [...scene.chips].sort((a, z) => z.y - a.y).map((c) => Number(c.label))
}
