import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { bucketSortBlock } from '../pseudocode'
import { CELL, PITCH, type FlowBox, type FlowChip, type FlowScene } from '../scene'

const AY = 20 // input row
const HEAD_Y = AY + CELL + 46 // bucket label row
const BUCKET_Y = HEAD_Y + CELL + 6 // first chip slot inside a bucket
const STACK = CELL + 4
const xCol = (i: number) => i * PITCH // 0-based column
const xArr = (idx: number) => (idx - 1) * PITCH // 1-indexed

type Loc =
  | { lane: 'input'; idx: number }
  | { lane: 'bucket'; d: number; depth: number }
  | { lane: 'output'; idx: number }

interface El {
  value: number
  id: string
  loc: Loc
}

const fmt = (v: number) => '.' + String(Math.round(v * 100)).padStart(2, '0')

/** Parse a space/comma list of reals in [0,1). */
function parseReals(raw: string): { ok: true; array: number[] } | { ok: false; error: string } {
  const parts = raw.split(/[\s,]+/).filter(Boolean).map(Number)
  if (parts.length < 2 || parts.length > 8) return { ok: false, error: 'בין 2 ל-8 מספרים' }
  if (parts.some((x) => Number.isNaN(x) || x < 0 || x >= 1))
    return { ok: false, error: 'מספרים ממשיים בטווח [0, 1)' }
  return { ok: true, array: parts }
}

/**
 * Bucket Sort: n reals in [0,1) scattered into n buckets by ⌊n·x⌋, each bucket
 * insertion-sorted, then concatenated. Expected O(n) for a uniform distribution
 * (≈O(1) per bucket); worst case O(n²) if everything lands in one bucket.
 * Layout in `Frame.scene`.
 */
export function runBucketSort(input: AlgorithmInput): Frame[] {
  const vals = input.array
  const n = vals.length
  const b = new FrameBuilder(vals)
  const all: El[] = vals.map((v, i) => ({
    value: v,
    id: b.elementIdAt(i + 1),
    loc: { lane: 'input', idx: i + 1 },
  }))
  const bucketOf = (v: number) => Math.min(n - 1, Math.floor(n * v))

  // pre-pass: tallest bucket → diagram height
  const counts = new Array(n).fill(0)
  for (const v of vals) counts[bucketOf(v)] += 1
  const maxDepth = Math.max(1, ...counts)
  const OUT_Y = BUCKET_Y + maxDepth * STACK + 44
  const width = n * PITCH
  const height = OUT_Y + CELL + 18

  const scene = (activeBucket?: number, ptr?: { lane: 'input' | 'output'; idx: number }): FlowScene => {
    const boxes: FlowBox[] = []
    for (let i = 1; i <= n; i++)
      boxes.push({ x: xArr(i), y: AY, w: CELL, h: CELL, tone: 'lane', labelTop: i === 1 ? 'קלט' : undefined })
    for (let d = 0; d < n; d++)
      boxes.push({
        x: xCol(d),
        y: HEAD_Y,
        w: CELL,
        h: CELL,
        tone: activeBucket === d ? 'active' : 'bucket',
        value: `${d}`,
        labelTop: d === 0 ? 'דליים' : undefined,
      })
    for (let i = 1; i <= n; i++)
      boxes.push({ x: xArr(i), y: OUT_Y, w: CELL, h: CELL, tone: 'output', labelTop: i === 1 ? 'פלט' : undefined })

    const chips: FlowChip[] = all.map((e) => {
      let x: number
      let y: number
      if (e.loc.lane === 'input') {
        x = xArr(e.loc.idx)
        y = AY
      } else if (e.loc.lane === 'bucket') {
        x = xCol(e.loc.d)
        y = BUCKET_Y + e.loc.depth * STACK
      } else {
        x = xArr(e.loc.idx)
        y = OUT_Y
      }
      const tone: FlowChip['tone'] =
        e.loc.lane === 'output'
          ? 'done'
          : ptr && e.loc.lane === ptr.lane && (e.loc as { idx: number }).idx === ptr.idx
            ? 'active'
            : activeBucket != null && e.loc.lane === 'bucket' && e.loc.d === activeBucket
              ? 'compare'
              : 'idle'
      return { id: e.id, label: fmt(e.value), x, y, tone }
    })
    return { kind: 'flow', width, height, boxes, chips }
  }

  b.setBlock('bucketSort')
  const buckets: El[][] = Array.from({ length: n }, () => [])

  b.setPhase('הכנה')
  b.emit({
    codeLine: 1,
    narration: `${n} מספרים ממשיים ב-[0,1). פותחים ${n} דליים — דלי i מכסה את הקטע [i/n, (i+1)/n).`,
    scene: scene(),
    vars: [vv('n', n, 'bound')],
  })

  // 1) scatter
  b.setPhase('פיזור')
  for (const e of all) {
    const d = bucketOf(e.value)
    e.loc = { lane: 'bucket', d, depth: buckets[d].length }
    buckets[d].push(e)
    b.emit({
      codeLine: 3,
      narration: `${fmt(e.value)} → דלי ${d} (⌊${n}·${fmt(e.value)}⌋ = ${d}).`,
      scene: scene(d),
      vars: [vv('n', n, 'bound'), vv('x', e.value, 'pivot'), vv('d', d, 'j')],
    })
  }

  // 2) insertion-sort each non-trivial bucket
  b.setPhase('מיון דליים')
  for (let d = 0; d < n; d++) {
    if (buckets[d].length > 1) {
      buckets[d].sort((a, z) => a.value - z.value)
      buckets[d].forEach((e, t) => (e.loc = { lane: 'bucket', d, depth: t }))
      b.emit({
        codeLine: 5,
        narration: `ממיינים את דלי ${d} (מיון הכנסה) — מעט איברים, ולכן זול.`,
        scene: scene(d),
        vars: [vv('n', n, 'bound'), vv('d', d, 'j')],
      })
    }
  }

  // 3) concatenate buckets 0..n-1 into the output
  b.setPhase('שרשור')
  let out = 0
  for (let d = 0; d < n; d++) {
    for (const e of buckets[d]) {
      out += 1
      e.loc = { lane: 'output', idx: out }
      b.emit({
        codeLine: 6,
        narration: `משרשרים: דלי ${d} → פלט[${out}] = ${fmt(e.value)}.`,
        scene: scene(d, { lane: 'output', idx: out }),
        vars: [vv('n', n, 'bound'), vv('d', d, 'j'), vv('out', out, 'bound')],
      })
    }
  }

  b.setPhase('סיום')
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: 'סיום — הפלט ממוין! בהתפלגות אחידה: תוחלת O(n).',
    scene: scene(),
    vars: [vv('n', n, 'bound')],
  })
  return b.build()
}

/** Sorted output read from the final frame (output-row chips left→right). */
export function bucketResult(frames: Frame[]): number[] {
  const scene = frames[frames.length - 1].scene as FlowScene
  const outY = Math.max(...scene.chips.map((c) => c.y))
  return scene.chips
    .filter((c) => c.y === outY)
    .sort((a, z) => a.x - z.x)
    .map((c) => Number('0' + c.label))
}

export const bucketSortSpec: AlgorithmSpec = {
  id: 'bucketSort',
  titleHe: 'מיון דלי',
  titleEn: 'BucketSort',
  kind: 'main',
  blurbHe:
    'מפזר n מספרים ממשיים מ-[0,1) ל-n דליים לפי ⌊n·x⌋, ממיין כל דלי (מיון הכנסה) ומשרשר. בהתפלגות אחידה — תוחלת לינארית.',
  complexity: 'O(n)',
  proof: {
    result: 'O(n)\\ \\text{(expected)}',
    claimHe: 'בהתפלגות אחידה, מיון דלי רץ בתוחלת O(n); במקרה הגרוע (הכול בדלי אחד) O(n²).',
    steps: [
      { he: 'פיזור ל-n הדליים — מעבר אחד:', tex: 'O(n)' },
      {
        he: 'בהתפלגות אחידה, תוחלת מספר האיברים בדלי היא 1, ותוחלת עלות מיון ההכנסה בכל דלי קבועה:',
        tex: 'E\\!\\left[\\sum_i O(n_i^2)\\right] = O(n)',
      },
      { he: 'שרשור הדליים — מעבר אחד:', tex: 'O(n)' },
      { he: 'בסך הכול תוחלת לינארית:', tex: 'O(n)' },
    ],
    intuitionHe:
      'אם הקלט פרוש אחיד, כל דלי מקבל מעט מאוד איברים — אז מיון פנימי זול, והעבודה הכוללת לינארית. אם הכול נופל לדלי אחד, חוזרים לריבועי.',
  },
  pseudocode: [bucketSortBlock],
  run: runBucketSort,
  validateInput: (raw) => {
    const r = parseReals(raw)
    return r.ok ? { ok: true, value: { array: r.array } } : { ok: false, error: r.error }
  },
  defaultInput: { array: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94] },
}
