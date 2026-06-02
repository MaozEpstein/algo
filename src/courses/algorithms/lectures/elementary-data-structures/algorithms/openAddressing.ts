import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, Frame } from '@/core/engine/types'
import {
  CELL,
  centerOf,
  slotX,
  type ChipTone,
  type DsArrow,
  type DsBox,
  type DsChip,
  type DsPointer,
  type DsScene,
} from '../scene'

const SLOT_Y = 70

interface Node {
  id: string
  label: string
  value: number
}

/**
 * Open addressing with LINEAR PROBING (CLRS §11.4). One table, no chains:
 * h(k, i) = (k mod m + i) mod m. On a collision we probe the next slot
 * (i = 0, 1, 2, …) until an empty slot is found. The scene shows the probe
 * pointer hopping along the table and the key dropping into the landing slot.
 */
export function runOpenAddressing(input: AlgorithmInput): Frame[] {
  const keys = input.array
  const m = input.extra?.m ?? 7
  const searchKey = input.extra?.search
  const b = new FrameBuilder([])
  b.setBlock('openAddressing')

  const table: (Node | null)[] = new Array(m).fill(null)
  let seq = 0
  let n = 0
  const stageX = slotX(m) + 24
  const width = slotX(m) + CELL + 70
  const height = SLOT_Y + CELL + 48
  const probe = (k: number, i: number) => ((k % m) + i) % m

  const scene = (opts: {
    incoming?: Node
    probeSlot?: number
    landSlot?: number
    probeIndex?: number
    hops?: { from: number; to: number }[]
    highlightId?: string
    highlightTone?: ChipTone
  }): DsScene => {
    const boxes: DsBox[] = []
    for (let j = 0; j < m; j++) {
      const tone =
        opts.landSlot === j ? 'active' : opts.probeSlot === j ? 'probed' : table[j] ? 'occupied' : 'empty'
      boxes.push({ x: slotX(j), y: SLOT_Y, w: CELL, h: CELL, tone, labelTop: String(j) })
    }
    const chips: DsChip[] = []
    for (let j = 0; j < m; j++) {
      const node = table[j]
      if (node) {
        const tone: ChipTone = opts.highlightId === node.id ? (opts.highlightTone ?? 'active') : 'idle'
        chips.push({ id: node.id, label: node.label, x: slotX(j), y: SLOT_Y, tone })
      }
    }
    if (opts.incoming) chips.push({ id: opts.incoming.id, label: opts.incoming.label, x: stageX, y: SLOT_Y, tone: 'active' })
    const arrows: DsArrow[] = (opts.hops ?? []).map((hop) => ({
      from: centerOf({ x: slotX(hop.from), y: SLOT_Y }),
      to: centerOf({ x: slotX(hop.to), y: SLOT_Y }),
      tone: 'probe',
      dashed: true,
    }))
    const pointers: DsPointer[] = []
    if (opts.probeSlot != null)
      pointers.push({ label: `i=${opts.probeIndex}`, x: slotX(opts.probeSlot), y: SLOT_Y, tone: 'probe', place: 'below' })
    return { kind: 'ds', width, height, boxes, chips, arrows, pointers }
  }

  b.setPhase('מיעון פתוח (probing לינארי)')
  b.emit({
    codeLine: null,
    narration: `טבלה אחת בגודל ${m}, ללא רשימות. בהתנגשות מגששים: h(k, i) = (k mod ${m} + i) mod ${m}.`,
    scene: scene({}),
    vars: [vv('m', m, 'bound'), vv('n', 0, 'i')],
  })

  b.setPhase('הכנסה')
  for (const k of keys) {
    if (n >= m) break // table full
    const node: Node = { id: `o${seq++}`, label: String(k), value: k }
    const hops: { from: number; to: number }[] = []
    let i = 0
    while (i < m) {
      const j = probe(k, i)
      if (table[j] === null) {
        b.emit({
          codeLine: 4,
          narration: `h(${k}, ${i}) = ${j}. תא ${j} פנוי — מציבים כאן. מספר גישושים = ${i + 1}.`,
          scene: scene({ incoming: node, landSlot: j, probeIndex: i, hops }),
          vars: [vv('k', k, 'pivot'), vv('i', i, 'i'), vv('slot', j, 'k'), vv('probes', i + 1, 'j'), vv('m', m, 'bound')],
        })
        table[j] = node
        n += 1
        b.emit({
          codeLine: 5,
          narration: `${k} הוצב בתא ${j}.`,
          scene: scene({ highlightId: node.id, highlightTone: 'inserted', hops }),
          vars: [vv('k', k, 'pivot'), vv('slot', j, 'k'), vv('probes', i + 1, 'j'), vv('n', n, 'i'), vv('m', m, 'bound')],
        })
        break
      }
      const next = probe(k, i + 1)
      b.emit({
        codeLine: 3,
        narration: `h(${k}, ${i}) = (${k} mod ${m} + ${i}) mod ${m} = ${j}. תא ${j} תפוס → גישוש הבא (i = ${i + 1}).`,
        scene: scene({ incoming: node, probeSlot: j, probeIndex: i, hops }),
        vars: [vv('k', k, 'pivot'), vv('i', i, 'i'), vv('slot', j, 'k'), vv('probes', i + 1, 'j'), vv('m', m, 'bound')],
      })
      hops.push({ from: j, to: next })
      i += 1
    }
  }

  if (searchKey != null) {
    b.setPhase('חיפוש')
    const hops: { from: number; to: number }[] = []
    for (let i = 0; i < m; i++) {
      const j = probe(searchKey, i)
      const node = table[j]
      if (node && node.value === searchKey) {
        b.emit({
          codeLine: 10,
          narration: `h(${searchKey}, ${i}) = ${j}. נמצא! אחרי ${i + 1} גישושים.`,
          scene: scene({ probeSlot: j, probeIndex: i, hops, highlightId: node.id, highlightTone: 'found' }),
          vars: [vv('k', searchKey, 'pivot'), vv('i', i, 'i'), vv('slot', j, 'k'), vv('probes', i + 1, 'j')],
        })
        break
      }
      if (node === null) {
        b.emit({
          codeLine: 11,
          narration: `h(${searchKey}, ${i}) = ${j}. תא ${j} ריק → המפתח אינו בטבלה.`,
          scene: scene({ probeSlot: j, probeIndex: i, hops }),
          vars: [vv('k', searchKey, 'pivot'), vv('i', i, 'i'), vv('slot', j, 'k')],
        })
        break
      }
      b.emit({
        codeLine: 9,
        narration: `h(${searchKey}, ${i}) = ${j}. תא ${j} מכיל ${node.label} ≠ ${searchKey} → גישוש הבא.`,
        scene: scene({ probeSlot: j, probeIndex: i, hops }),
        vars: [vv('k', searchKey, 'pivot'), vv('i', i, 'i'), vv('slot', j, 'k'), vv('probes', i + 1, 'j')],
      })
      hops.push({ from: j, to: probe(searchKey, i + 1) })
    }
  }

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — ${n} מפתחות בטבלה (α = ${n}/${m} ≈ ${(n / m).toFixed(2)}). גישוש לא-מוצלח בתוחלת ≤ 1/(1−α); דורש α<1.`,
    scene: scene({}),
    vars: [vv('n', n, 'i'), vv('m', m, 'bound')],
  })

  return b.build()
}

/** Final slot→key array (null = empty), read from the last frame's scene. For tests. */
export function openResult(frames: Frame[]): (number | null)[] {
  const scene = frames[frames.length - 1].scene as DsScene
  const slots: (number | null)[] = scene.boxes.map(() => null)
  for (const c of scene.chips) {
    const j = Math.round(c.x / slotX(1))
    if (j >= 0 && j < slots.length) slots[j] = Number(c.label)
  }
  return slots
}
