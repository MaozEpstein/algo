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

const SLOT_Y = 60

interface Node {
  id: string
  label: string
  value: number
}

/**
 * Direct-address table (CLRS §11.1): a slot for EVERY possible key. Key k lives
 * in T[k], so insert/search/delete are O(1) — but the table needs Θ(|U|) space,
 * which is infeasible once the key universe is large. That trade-off is the
 * motivation for hashing.
 */
export function runDirectAddress(input: AlgorithmInput): Frame[] {
  const keys = input.array
  const U = input.extra?.U ?? 10
  const searchKey = input.extra?.search
  const b = new FrameBuilder([])
  b.setBlock('directAddress')

  const table: (Node | null)[] = new Array(U).fill(null)
  let seq = 0
  const stageX = slotX(U) + 24
  const width = slotX(U) + CELL + 70
  const height = SLOT_Y + CELL + 40

  const scene = (opts: { incoming?: Node; activeSlot?: number; highlightId?: string; highlightTone?: ChipTone }): DsScene => {
    const boxes: DsBox[] = []
    for (let i = 0; i < U; i++) {
      const tone = opts.activeSlot === i ? 'active' : table[i] ? 'occupied' : 'empty'
      boxes.push({ x: slotX(i), y: SLOT_Y, w: CELL, h: CELL, tone, labelTop: String(i) })
    }
    const chips: DsChip[] = []
    for (let i = 0; i < U; i++) {
      const node = table[i]
      if (node) {
        const tone: ChipTone = opts.highlightId === node.id ? (opts.highlightTone ?? 'active') : 'idle'
        chips.push({ id: node.id, label: node.label, x: slotX(i), y: SLOT_Y, tone })
      }
    }
    if (opts.incoming) chips.push({ id: opts.incoming.id, label: opts.incoming.label, x: stageX, y: SLOT_Y, tone: 'active' })
    const pointers: DsPointer[] = []
    if (opts.activeSlot != null)
      pointers.push({ label: `k=${opts.activeSlot}`, x: slotX(opts.activeSlot), y: SLOT_Y, tone: 'hash', place: 'below' })
    return { kind: 'ds', width, height, boxes, chips, pointers }
  }

  b.setPhase('הטבלה T[0..U-1]')
  b.emit({
    codeLine: null,
    narration: `טבלת מיעון ישיר T בגודל |U| = ${U}: תא נפרד לכל מפתח אפשרי. מפתח k שמור בתא k.`,
    scene: scene({}),
    vars: [vv('|U|', U, 'bound')],
  })

  b.setPhase('הכנסה')
  for (const k of keys) {
    if (k < 0 || k >= U) continue
    const node: Node = { id: `d${seq++}`, label: String(k), value: k }
    b.emit({
      codeLine: 1,
      narration: `Insert(${k}): מציבים ישירות בתא T[${k}] — ללא חישוב, ללא השוואה.`,
      scene: scene({ incoming: node, activeSlot: k }),
      vars: [vv('k', k, 'pivot'), vv('|U|', U, 'bound')],
    })
    table[k] = node
    b.emit({
      codeLine: 2,
      narration: `${k} נמצא בתא ${k}. הכנסה ב-O(1).`,
      scene: scene({ activeSlot: k, highlightId: node.id, highlightTone: 'inserted' }),
      vars: [vv('k', k, 'pivot'), vv('|U|', U, 'bound')],
    })
  }

  if (searchKey != null && searchKey >= 0 && searchKey < U) {
    b.setPhase('חיפוש')
    const hit = table[searchKey] != null
    b.emit({
      codeLine: 4,
      narration: hit
        ? `Search(${searchKey}): ניגשים ישירות ל-T[${searchKey}] ומוצאים — O(1).`
        : `Search(${searchKey}): T[${searchKey}] ריק — לא קיים. עדיין O(1).`,
      scene: scene({
        activeSlot: searchKey,
        highlightId: table[searchKey]?.id,
        highlightTone: hit ? 'found' : undefined,
      }),
      vars: [vv('k', searchKey, 'pivot'), vv('|U|', U, 'bound')],
    })
  }

  b.setPhase('הבעיה: טווח ענק')
  b.emit({
    codeLine: null,
    narration: `החיסרון: דרושה טבלה בגודל |U|. למפתחות בני 32 ביט |U| = 2³² ≈ 4.3 מיליארד תאים — בלתי-אפשרי. הפתרון: גיבוב לטווח קטן 0..m-1.`,
    scene: scene({}),
    vars: [vv('|U|', U, 'bound')],
  })

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: 'מיעון ישיר: O(1) לכל פעולה, אך Θ(|U|) זיכרון — מתאים רק לטווח מפתחות קטן.',
    scene: scene({}),
    vars: [vv('|U|', U, 'bound')],
  })

  return b.build()
}

/** Final slot→key array (null = empty), from the last frame. For tests. */
export function directResult(frames: Frame[]): (number | null)[] {
  const scene = frames[frames.length - 1].scene as DsScene
  const slots: (number | null)[] = scene.boxes.map(() => null)
  for (const c of scene.chips) {
    const i = Math.round(c.x / slotX(1))
    if (i >= 0 && i < slots.length) slots[i] = Number(c.label)
  }
  return slots
}
