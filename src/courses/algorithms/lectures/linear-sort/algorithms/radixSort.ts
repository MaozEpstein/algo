import { FrameBuilder } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { radixSortBlock } from '../pseudocode'
import { CELL, PITCH, type FlowBox, type FlowChip, type FlowScene } from '../scene'

const AY = 20 // array row
const HEAD_Y = AY + CELL + 52 // bucket label row
const BUCKET_Y = HEAD_Y + CELL + 6 // first chip slot inside a bucket
const STACK = CELL + 4
const xArr = (idx: number) => (idx - 1) * PITCH // 1-indexed
const xBucket = (d: number) => d * PITCH

type Loc = { lane: 'array'; idx: number } | { lane: 'bucket'; d: number; depth: number }

interface El {
  value: number
  id: string
  loc: Loc
}

const digitsOf = (v: number) => (v === 0 ? 1 : Math.floor(Math.log10(v)) + 1)
const pad = (v: number, width: number) => String(v).padStart(width, '0')

/**
 * Radix Sort (LSD-first, base 10). Each pass distributes the n keys into 10
 * digit-buckets (a stable bucket pass), then collects them back left→right.
 * Because the sub-sort is stable and we go least-significant digit first, after
 * d passes the array is sorted. O(d·(n+k)) with k=10. Layout in `Frame.scene`.
 */
export function runRadixSort(input: AlgorithmInput): Frame[] {
  const vals = input.array
  const n = vals.length
  const d = Math.max(...vals.map(digitsOf))
  const b = new FrameBuilder(vals)
  const order: El[] = vals.map((v, i) => ({
    value: v,
    id: b.elementIdAt(i + 1),
    loc: { lane: 'array', idx: i + 1 },
  }))
  const all = order.slice() // stable id list for the scene
  const width = Math.max(n * PITCH, 10 * PITCH)
  const height = BUCKET_Y + n * STACK + 16

  const scene = (pass: number, activeBucket?: number): FlowScene => {
    const emphAt = d - pass // 0-based index of the digit being sorted this pass
    const boxes: FlowBox[] = []
    for (let i = 1; i <= n; i++)
      boxes.push({ x: xArr(i), y: AY, w: CELL, h: CELL, tone: 'lane', labelTop: i === 1 ? 'A' : undefined })
    for (let dg = 0; dg <= 9; dg++)
      boxes.push({
        x: xBucket(dg),
        y: HEAD_Y,
        w: CELL,
        h: CELL,
        tone: activeBucket === dg ? 'active' : 'count',
        value: String(dg),
      })
    const chips: FlowChip[] = all.map((e) => {
      const x = e.loc.lane === 'array' ? xArr(e.loc.idx) : xBucket(e.loc.d)
      const y = e.loc.lane === 'array' ? AY : BUCKET_Y + e.loc.depth * STACK
      const tone: FlowChip['tone'] =
        activeBucket != null && e.loc.lane === 'bucket' && e.loc.d === activeBucket ? 'active' : 'idle'
      return { id: e.id, label: pad(e.value, d), x, y, tone, emphAt }
    })
    return { kind: 'flow', width, height, boxes, chips }
  }

  b.setBlock('radixSort')
  const ordinal = ['', 'הראשונה (אחדות)', 'השנייה (עשרות)', 'השלישית (מאות)', 'הרביעית (אלפים)']

  for (let pass = 1; pass <= d; pass++) {
    const place = 10 ** (pass - 1)
    b.setPhase(`מעבר ${pass}/${d}`)
    b.emit({
      codeLine: 2,
      narration: `מעבר ${pass} מתוך ${d}: ממיינים יציב לפי הספרה ${ordinal[pass] ?? pass} (הספרה המודגשת).`,
      scene: scene(pass),
    })

    // distribute (stable: scan current order left→right)
    const buckets: El[][] = Array.from({ length: 10 }, () => [])
    for (const e of order) {
      const dg = Math.floor(e.value / place) % 10
      e.loc = { lane: 'bucket', d: dg, depth: buckets[dg].length }
      buckets[dg].push(e)
      b.emit({
        codeLine: 3,
        narration: `${pad(e.value, d)} → דלי ${dg} (ספרה = ${dg}).`,
        scene: scene(pass, dg),
      })
    }

    // collect back into the array, buckets 0→9, preserving within-bucket order
    const next: El[] = []
    for (let dg = 0; dg <= 9; dg++) {
      for (const e of buckets[dg]) {
        e.loc = { lane: 'array', idx: next.length + 1 }
        next.push(e)
        b.emit({
          codeLine: 3,
          narration: `אוספים מדלי ${dg}: ${pad(e.value, d)} → A[${next.length}]. הסדר היחסי נשמר.`,
          scene: scene(pass, dg),
        })
      }
    }
    order.length = 0
    order.push(...next)
  }

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: 'סיום — אחרי מעבר על כל הספרות המערך ממוין! O(d·(n+k)).',
    scene: scene(d),
  })
  return b.build()
}

/** Sorted output read from the final frame (array-row chips left→right). */
export function radixResult(frames: Frame[]): number[] {
  const scene = frames[frames.length - 1].scene as FlowScene
  return scene.chips
    .filter((c) => c.y === AY)
    .sort((a, z) => a.x - z.x)
    .map((c) => Number(c.label))
}

export const radixSortSpec: AlgorithmSpec = {
  id: 'radixSort',
  titleHe: 'מיון בסיס',
  titleEn: 'RadixSort',
  kind: 'main',
  blurbHe:
    'ממיין מספרים רב-ספרתיים ספרה-אחר-ספרה, מהפחות-משמעותית, באמצעות מיון יציב (מנייה) בכל מעבר. אחרי d מעברים — ממוין.',
  complexity: 'O(d(n + k))',
  proof: {
    result: 'O(d(n + k))',
    claimHe: 'מיון בסיס רץ ב-O(d·(n+k)); עבור d קבוע ו-k=O(n) זה O(n).',
    steps: [
      { he: 'כל מעבר הוא מיון יציב (מנייה) על ספרה אחת בטווח k ערכים:', tex: 'O(n + k)' },
      { he: 'מבצעים d מעברים, אחד לכל ספרה:', tex: 'd \\cdot O(n + k) = O(d(n+k))' },
      {
        he: 'נכונות (אינדוקציה על המעברים): אם הספרות הנמוכות כבר ממוינות, מיון יציב על הספרה הבאה שומר את סדרן — כי בערכים שווים בספרה הנוכחית, הסדר היחסי (לפי הספרות הנמוכות) נשמר.',
      },
    ],
    intuitionHe:
      'דווקא מהספרה הפחות-משמעותית: היציבות "זוכרת" את המיון של הספרות הקודמות, כך שכל מעבר רק משכלל את הסדר הקיים.',
  },
  pseudocode: [radixSortBlock],
  run: runRadixSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 8, minValue: 0, maxValue: 99 }),
  defaultInput: { array: [29, 13, 48, 5, 31, 27] },
}
