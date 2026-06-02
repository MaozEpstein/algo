import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, Frame } from '@/core/engine/types'
import {
  CELL,
  chainNodeY,
  slotX,
  type ChipTone,
  type DsArrow,
  type DsBox,
  type DsChip,
  type DsPointer,
  type DsScene,
} from '../scene'

const SLOT_Y = 84

interface Node {
  id: string
  label: string
  value: number
}

/**
 * Hashing with CHAINING (CLRS §11.2). m slots in a row; each slot heads a
 * linked list of every key that hashed to it (head-insertion ⇒ O(1) insert).
 * Collisions append to the chain. We narrate h(k)=k mod m, surface the load
 * factor α=n/m, and (optionally) search a key by scanning its chain. The scene
 * animates each key flying into its slot and dropping down the chain.
 */
export function runChaining(input: AlgorithmInput): Frame[] {
  const keys = input.array
  const m = input.extra?.m ?? 5
  const searchKey = input.extra?.search
  const b = new FrameBuilder([])
  b.setBlock('chaining')

  const chains: Node[][] = Array.from({ length: m }, () => [])
  let seq = 0
  let n = 0
  const h = (k: number) => ((k % m) + m) % m

  // Stable height: tallest chain over the whole run.
  const counts = new Array(m).fill(0)
  for (const k of keys) counts[h(k)] += 1
  const maxDepth = Math.max(1, ...counts)
  const width = slotX(m) + CELL + 70
  const height = chainNodeY(SLOT_Y, maxDepth) + 24
  const stageX = slotX(m) + 24

  const scene = (opts: {
    incoming?: Node
    activeSlot?: number
    collisionSlot?: number
    hashSlot?: number
    highlightId?: string
    highlightTone?: ChipTone
  }): DsScene => {
    const boxes: DsBox[] = []
    for (let i = 0; i < m; i++) {
      const tone =
        opts.collisionSlot === i
          ? 'collision'
          : opts.activeSlot === i
            ? 'active'
            : chains[i].length
              ? 'occupied'
              : 'empty'
      boxes.push({ x: slotX(i), y: SLOT_Y, w: CELL, h: CELL, tone, labelTop: String(i) })
    }
    const chips: DsChip[] = []
    const arrows: DsArrow[] = []
    for (let i = 0; i < m; i++) {
      let prevBottom = { x: slotX(i) + CELL / 2, y: SLOT_Y + CELL }
      chains[i].forEach((node, d) => {
        const x = slotX(i)
        const y = chainNodeY(SLOT_Y, d)
        const tone: ChipTone = opts.highlightId === node.id ? (opts.highlightTone ?? 'active') : 'idle'
        chips.push({ id: node.id, label: node.label, x, y, tone })
        arrows.push({ from: prevBottom, to: { x: x + CELL / 2, y }, tone: 'chain' })
        prevBottom = { x: x + CELL / 2, y: y + CELL }
      })
    }
    if (opts.incoming) {
      chips.push({ id: opts.incoming.id, label: opts.incoming.label, x: stageX, y: SLOT_Y, tone: 'active' })
    }
    const pointers: DsPointer[] = []
    if (opts.hashSlot != null)
      pointers.push({ label: `h=${opts.hashSlot}`, x: slotX(opts.hashSlot), y: SLOT_Y, tone: 'hash', place: 'above' })
    return { kind: 'ds', width, height, boxes, chips, arrows, pointers }
  }

  b.setPhase('טבלת גיבוב עם שרשור')
  b.emit({
    codeLine: null,
    narration: `טבלת גיבוב עם ${m} תאים ושרשור. פונקציית הגיבוב: h(k) = k mod ${m}. כל תא מצביע לרשימה מקושרת.`,
    scene: scene({}),
    vars: [vv('m', m, 'bound'), vv('n', 0, 'i')],
  })

  b.setPhase('הכנסה')
  for (const k of keys) {
    const s = h(k)
    const len = chains[s].length
    const node: Node = { id: `c${seq++}`, label: String(k), value: k }
    b.emit({
      codeLine: 1,
      narration:
        len > 0
          ? `h(${k}) = ${k} mod ${m} = ${s}. תא ${s} כבר מאוכלס (אורך ${len}) — התנגשות!`
          : `h(${k}) = ${k} mod ${m} = ${s}. תא ${s} פנוי.`,
      scene: scene({
        incoming: node,
        activeSlot: len === 0 ? s : undefined,
        collisionSlot: len > 0 ? s : undefined,
        hashSlot: s,
      }),
      vars: [vv('k', k, 'pivot'), vv('h(k)', s, 'k'), vv('chainLen', len, 'j'), vv('n', n, 'i'), vv('m', m, 'bound')],
    })
    chains[s].unshift(node)
    n += 1
    b.emit({
      codeLine: 2,
      narration: `מכניסים את ${k} בראש שרשרת תא ${s} (הכנסה ב-O(1)). אורך השרשרת כעת ${len + 1}.`,
      scene: scene({ activeSlot: s, hashSlot: s, highlightId: node.id, highlightTone: 'inserted' }),
      vars: [vv('k', k, 'pivot'), vv('h(k)', s, 'k'), vv('chainLen', len + 1, 'j'), vv('n', n, 'i'), vv('m', m, 'bound')],
    })
  }

  if (searchKey != null) {
    b.setPhase('חיפוש')
    const s = h(searchKey)
    b.emit({
      codeLine: 3,
      narration: `חיפוש ${searchKey}: מחשבים h(${searchKey}) = ${s}, וסורקים את שרשרת תא ${s}.`,
      scene: scene({ activeSlot: s, hashSlot: s }),
      vars: [vv('k', searchKey, 'pivot'), vv('h(k)', s, 'k'), vv('chainLen', chains[s].length, 'j')],
    })
    let found = false
    for (let d = 0; d < chains[s].length; d++) {
      const node = chains[s][d]
      const hit = node.value === searchKey
      b.emit({
        codeLine: 4,
        narration: hit
          ? `נמצא! ${searchKey} נמצא בשרשרת תא ${s} אחרי ${d + 1} השוואות.`
          : `${node.label} ≠ ${searchKey} — ממשיכים לאיבר הבא בשרשרת.`,
        scene: scene({ activeSlot: s, hashSlot: s, highlightId: node.id, highlightTone: hit ? 'found' : 'collision' }),
        vars: [vv('k', searchKey, 'pivot'), vv('h(k)', s, 'k'), vv('cmp', d + 1, 'j')],
      })
      if (hit) {
        found = true
        break
      }
    }
    if (!found) {
      b.emit({
        codeLine: 4,
        narration: `${searchKey} לא נמצא — סרקנו את כל שרשרת תא ${s}.`,
        scene: scene({ activeSlot: s, hashSlot: s }),
        vars: [vv('k', searchKey, 'pivot'), vv('h(k)', s, 'k')],
      })
    }
  }

  b.setPhase('גורם העומס α')
  b.emit({
    codeLine: null,
    narration: `גורם העומס α = n/m = ${n}/${m} ≈ ${(n / m).toFixed(2)}. בגיבוב אחיד פשוט, חיפוש עולה בתוחלת Θ(1+α).`,
    scene: scene({}),
    vars: [vv('n', n, 'i'), vv('m', m, 'bound')],
  })

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — ${n} מפתחות בטבלה. הכנסה O(1); חיפוש בתוחלת Θ(1+α).`,
    scene: scene({}),
    vars: [vv('n', n, 'i'), vv('m', m, 'bound')],
  })

  return b.build()
}

/** Final per-slot chains (head→tail), read from the last frame's scene. For tests. */
export function chainingResult(frames: Frame[]): number[][] {
  const scene = frames[frames.length - 1].scene as DsScene
  const bySlot = new Map<number, { y: number; v: number }[]>()
  for (const c of scene.chips) {
    const slot = Math.round(c.x / slotX(1))
    const arr = bySlot.get(slot) ?? []
    arr.push({ y: c.y, v: Number(c.label) })
    bySlot.set(slot, arr)
  }
  const out: number[][] = []
  for (let i = 0; i < scene.boxes.length; i++) {
    const arr = (bySlot.get(i) ?? []).sort((a, z) => a.y - z.y).map((e) => e.v)
    out.push(arr)
  }
  return out
}
