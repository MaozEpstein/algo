import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, Frame } from '@/core/engine/types'
import {
  CELL,
  slotX,
  type ChipTone,
  type DsBox,
  type DsChip,
  type DsPointer,
  type DsScene,
} from '../scene'

const SLOT_Y = 64

interface Node {
  id: string
  label: string
}

/**
 * Queue (FIFO) on a CIRCULAR buffer — CLRS §10.1. Op-stream input: a positive
 * value = ENQUEUE it (written at `rear`, then rear advances mod m), 0 = DEQUEUE
 * (read from `front`, then front advances mod m). The `front`/`rear` pointers
 * wrap around the m slots.
 */
export function runQueue(input: AlgorithmInput): Frame[] {
  const ops = input.array
  const m = input.extra?.m ?? 6
  const b = new FrameBuilder([])
  b.setBlock('queue')

  const buf: (Node | null)[] = new Array(m).fill(null)
  let front = 0
  let rear = 0
  let size = 0
  let seq = 0
  const stageY = SLOT_Y + CELL + 34
  const width = slotX(m) + CELL + 20
  const height = SLOT_Y + CELL + 70

  const scene = (opts: { incoming?: Node; activeSlot?: number; highlightId?: string; highlightTone?: ChipTone }): DsScene => {
    const boxes: DsBox[] = []
    for (let j = 0; j < m; j++) {
      const tone = opts.activeSlot === j ? 'active' : buf[j] ? 'occupied' : 'empty'
      boxes.push({ x: slotX(j), y: SLOT_Y, w: CELL, h: CELL, tone, labelTop: String(j) })
    }
    const chips: DsChip[] = []
    for (let j = 0; j < m; j++) {
      const node = buf[j]
      if (node) {
        const tone: ChipTone = opts.highlightId === node.id ? (opts.highlightTone ?? 'active') : 'idle'
        chips.push({ id: node.id, label: node.label, x: slotX(j), y: SLOT_Y, tone })
      }
    }
    if (opts.incoming) chips.push({ id: opts.incoming.id, label: opts.incoming.label, x: slotX(rear), y: stageY, tone: 'active' })
    const pointers: DsPointer[] = [
      { label: 'front', x: slotX(front), y: SLOT_Y, tone: 'front', place: 'above' },
      { label: 'rear', x: slotX(rear), y: SLOT_Y, tone: 'rear', place: 'below' },
    ]
    return { kind: 'ds', width, height, boxes, chips, pointers }
  }

  b.setPhase('אתחול')
  b.emit({
    codeLine: null,
    narration: `תור מעגלי בגודל ${m} (FIFO). Enqueue כותב ב-rear, Dequeue קורא מ-front — שניהם O(1).`,
    scene: scene({}),
    vars: [vv('front', front, 'i'), vv('rear', rear, 'j')],
  })

  for (const op of ops) {
    if (op > 0) {
      b.setPhase('Enqueue')
      if (size >= m) {
        b.emit({
          codeLine: 1,
          narration: `התור מלא (${m} איברים) — לא ניתן להוסיף את ${op}.`,
          scene: scene({}),
          vars: [vv('front', front, 'i'), vv('rear', rear, 'j')],
        })
        continue
      }
      const node: Node = { id: `q${seq++}`, label: String(op) }
      const at = rear
      b.emit({
        codeLine: 2,
        narration: `Enqueue(${op}): כותבים את ${op} בתא rear = ${at}.`,
        scene: scene({ incoming: node, activeSlot: at }),
        vars: [vv('x', op, 'pivot'), vv('front', front, 'i'), vv('rear', rear, 'j')],
      })
      buf[at] = node
      rear = (rear + 1) % m
      size += 1
      b.emit({
        codeLine: 3,
        narration: `rear מתקדם (מעגלי) ל-${rear}. בתור ${size} איברים.`,
        scene: scene({ highlightId: node.id, highlightTone: 'inserted' }),
        vars: [vv('x', op, 'pivot'), vv('front', front, 'i'), vv('rear', rear, 'j')],
      })
    } else {
      b.setPhase('Dequeue')
      if (size === 0) {
        b.emit({
          codeLine: 4,
          narration: 'Dequeue על תור ריק — underflow!',
          scene: scene({}),
          vars: [vv('front', front, 'i'), vv('rear', rear, 'j')],
        })
        continue
      }
      const node = buf[front]!
      const at = front
      b.emit({
        codeLine: 5,
        narration: `Dequeue(): מחזירים את ${node.label} מתא front = ${at} (FIFO).`,
        scene: scene({ activeSlot: at, highlightId: node.id, highlightTone: 'found' }),
        vars: [vv('x', Number(node.label), 'pivot'), vv('front', front, 'i'), vv('rear', rear, 'j')],
      })
      buf[at] = null
      front = (front + 1) % m
      size -= 1
      b.emit({
        codeLine: 6,
        narration: `front מתקדם (מעגלי) ל-${front}. בתור ${size} איברים.`,
        scene: scene({}),
        vars: [vv('front', front, 'i'), vv('rear', rear, 'j')],
      })
    }
  }

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — בתור ${size} איברים. כל פעולה O(1).`,
    scene: scene({}),
    vars: [vv('front', front, 'i'), vv('rear', rear, 'j')],
  })

  return b.build()
}

/** Remaining queue contents (values, by slot order) from the last frame. For tests. */
export function queueResult(frames: Frame[]): number[] {
  const scene = frames[frames.length - 1].scene as DsScene
  return [...scene.chips].sort((a, z) => a.x - z.x).map((c) => Number(c.label))
}
