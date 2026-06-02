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

const BIN_Y = 44
const STACK_GAP = 8
const BIN_STEP = CELL + STACK_GAP

const A = (Math.sqrt(5) - 1) / 2 // Knuth's multiplicative constant ≈ 0.618

/**
 * Hash-function distribution (CLRS §11.3). Maps each key into one of m bins and
 * stacks it there, building a live histogram — so the learner sees how evenly a
 * method spreads the keys. We compute BOTH the division method h(k)=k mod m and
 * the multiplication method h(k)=⌊m·(kA mod 1)⌋ and narrate both; `extra.method`
 * (0=division, 1=multiplication) selects which one actually places the key.
 */
export function runHashDistribution(input: AlgorithmInput): Frame[] {
  const keys = input.array
  const m = input.extra?.m ?? 7
  const method = input.extra?.method ?? 0 // 0 = division, 1 = multiplication
  const b = new FrameBuilder([])
  b.setBlock('hashFunctions')

  const hDiv = (k: number) => ((k % m) + m) % m
  const hMul = (k: number) => Math.floor(m * ((k * A) % 1))
  const h = (k: number) => (method === 1 ? hMul(k) : hDiv(k))
  const methodHe = method === 1 ? 'כפל' : 'חילוק'

  // stable height: tallest bin
  const counts0 = new Array(m).fill(0)
  for (const k of keys) counts0[h(k)] += 1
  const maxCount = Math.max(1, ...counts0)
  const width = slotX(m) + CELL + 24
  const height = BIN_Y + CELL + STACK_GAP + maxCount * BIN_STEP + 16
  const stageX = slotX(m) + 24
  const binChipY = (depth: number) => BIN_Y + CELL + STACK_GAP + depth * BIN_STEP

  const bins: { id: string; label: string }[][] = Array.from({ length: m }, () => [])
  let seq = 0

  const scene = (opts: { incoming?: { id: string; label: string }; activeBin?: number; binCounts: number[] }): DsScene => {
    const boxes: DsBox[] = []
    for (let j = 0; j < m; j++) {
      boxes.push({
        x: slotX(j),
        y: BIN_Y,
        w: CELL,
        h: CELL,
        tone: opts.activeBin === j ? 'active' : 'occupied',
        value: String(opts.binCounts[j]),
        labelTop: String(j),
      })
    }
    const chips: DsChip[] = []
    for (let j = 0; j < m; j++) {
      bins[j].forEach((node, d) => {
        const tone: ChipTone = opts.activeBin === j && d === bins[j].length - 1 ? 'inserted' : 'idle'
        chips.push({ id: node.id, label: node.label, x: slotX(j), y: binChipY(d), tone })
      })
    }
    if (opts.incoming) chips.push({ id: opts.incoming.id, label: opts.incoming.label, x: stageX, y: BIN_Y, tone: 'active' })
    const pointers: DsPointer[] = []
    if (opts.activeBin != null)
      pointers.push({ label: `h=${opts.activeBin}`, x: slotX(opts.activeBin), y: BIN_Y, tone: 'hash', place: 'above' })
    return { kind: 'ds', width, height, boxes, chips, pointers }
  }

  const liveCounts = () => bins.map((arr) => arr.length)

  b.setPhase('פונקציית גיבוב')
  b.emit({
    codeLine: method === 1 ? 4 : 2,
    narration: `שיטת ה${methodHe}: ממפים כל מפתח ל-${m} תאים. נראה כמה אחיד הפיזור.`,
    scene: scene({ binCounts: liveCounts() }),
    vars: [vv('m', m, 'bound')],
  })

  b.setPhase('מיפוי מפתחות')
  for (const k of keys) {
    const slot = h(k)
    const node = { id: `h${seq++}`, label: String(k) }
    b.emit({
      codeLine: method === 1 ? 4 : 2,
      narration: `h(${k}) = ${k} mod ${m} = ${hDiv(k)}   (בכפל: ${hMul(k)}). ${methodHe} → תא ${slot}.`,
      scene: scene({ incoming: node, activeBin: slot, binCounts: liveCounts() }),
      vars: [vv('k', k, 'pivot'), vv('m', m, 'bound'), vv('h(k)', slot, 'k')],
    })
    bins[slot].push(node)
    b.emit({
      codeLine: method === 1 ? 4 : 2,
      narration: `${k} נכנס לתא ${slot}. גובה התא כעת ${bins[slot].length}.`,
      scene: scene({ activeBin: slot, binCounts: liveCounts() }),
      vars: [vv('k', k, 'pivot'), vv('m', m, 'bound'), vv('h(k)', slot, 'k')],
    })
  }

  b.setPhase('התפלגות')
  const counts = liveCounts()
  const maxC = Math.max(...counts)
  const minC = Math.min(...counts)
  b.emit({
    codeLine: null,
    narration: `ההתפלגות: תא מלא ביותר ${maxC}, ריק ביותר ${minC}. ככל שהפיזור אחיד יותר — השרשראות קצרות יותר והחיפוש מהיר יותר.`,
    scene: scene({ binCounts: counts }),
    vars: [vv('m', m, 'bound')],
  })

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — מיפינו ${keys.length} מפתחות ל-${m} תאים בשיטת ה${methodHe}.`,
    scene: scene({ binCounts: counts }),
    vars: [vv('m', m, 'bound')],
  })

  return b.build()
}

/** Final per-bin counts, from the last frame's box values. For tests. */
export function distributionResult(frames: Frame[]): number[] {
  const scene = frames[frames.length - 1].scene as DsScene
  return scene.boxes.map((box) => Number(box.value ?? '0'))
}
