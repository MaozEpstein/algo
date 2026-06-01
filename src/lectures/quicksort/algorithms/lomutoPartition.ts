import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { rangeInclusive } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight, Marker } from '@/engine/types'
import { lomutoPartitionBlock } from '../pseudocode'

/** Shared context so embedded partitions can keep extra cells highlighted. */
export interface PartitionCtx {
  /** Indices to always mark 'sorted' (e.g. an answer already located). */
  sorted?: number[]
  phase?: string
}

/**
 * Lomuto partition (CLRS), reusable. The pivot is the element CURRENTLY at A[r]
 * (callers that want a specific pivot must swap it to r first). It ends up at
 * its rank position q = i+1 within [p..r]. Returns q. Does NOT mark the result
 * 'sorted' (the caller decides), so it works both as a sort step and as a
 * Selection subroutine.
 */
export function lomutoPartitionInto(
  b: FrameBuilder,
  p: number,
  r: number,
  depth: number,
  ctx?: PartitionCtx,
): number {
  b.setBlock('lomutoPartition')
  const A = (k: number) => b.value(k)
  const x = b.value(r)
  const pivotId = b.elementIdAt(r)
  let i = p - 1

  const emit = (
    codeLine: number | null,
    narration: string,
    opts: { highlights?: Highlight[]; markers?: Marker[]; action?: Parameters<FrameBuilder['emit']>[0]['action'] } = {},
  ) => {
    const pivotIdx = b.indexOfElement(pivotId)
    const highlights: Highlight[] = [hl('active', ...rangeInclusive(p, r))]
    if (ctx?.sorted?.length) highlights.push(hl('sorted', ...ctx.sorted))
    highlights.push(hl('pivot', pivotIdx))
    if (opts.highlights) highlights.push(...opts.highlights)
    const markers: Marker[] = [{ label: 'pivot', index: pivotIdx, tone: 'pivot' }]
    if (i >= p && i <= r) markers.push({ label: 'i', index: i, tone: 'i' })
    if (opts.markers) markers.push(...opts.markers)
    b.emit({
      codeBlock: 'lomutoPartition',
      codeLine,
      narration,
      callDepth: depth,
      phase: ctx?.phase,
      action: opts.action,
      highlights,
      markers,
    })
  }

  emit(2, `הציר: x = A[${r}] = ${x}.`)
  emit(3, `i = ${p} − 1 = ${i} (גבול אזור הקטנים-שווים).`)

  for (let j = p; j <= r - 1; j++) {
    emit(4, `j = ${j} — בודקים את האיבר הבא.`, { markers: [{ label: 'j', index: j, tone: 'j' }] })
    emit(5, `בדיקה: האם A[${j}] = ${A(j)} ≤ x = ${x}?`, {
      action: { kind: 'compare', a: j, b: b.indexOfElement(pivotId) },
      highlights: [hl('comparing', j)],
      markers: [{ label: 'j', index: j, tone: 'j' }],
    })
    if (A(j) <= x) {
      i += 1
      emit(6, `כן — מגדילים את i ל-${i}.`, { markers: [{ label: 'j', index: j, tone: 'j' }] })
      emit(7, `מחליפים את A[${i}] = ${A(i)} עם A[${j}] = ${A(j)}.`, {
        action: { kind: 'swap', a: i, b: j },
        highlights: [hl('swapping', i, j)],
        markers: [{ label: 'j', index: j, tone: 'j' }],
      })
      b.swap(i, j)
    }
  }

  emit(8, `מציבים את הציר במקומו: מחליפים A[${i + 1}] עם A[${r}].`, {
    action: { kind: 'swap', a: i + 1, b: r },
    highlights: [hl('swapping', i + 1, r)],
  })
  b.swap(i + 1, r)
  const q = i + 1
  emit(9, `מחזירים q = ${q}. כל הקטנים-שווים משמאל, הגדולים מימין.`, {
    highlights: [
      ...(q - 1 >= p ? [hl('less', ...rangeInclusive(p, q - 1))] : []),
      ...(q + 1 <= r ? [hl('greater', ...rangeInclusive(q + 1, r))] : []),
    ],
  })
  return q
}

/** Standalone Lomuto demo (pivots on the last element). */
export function runLomutoPartition(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  b.emit({
    codeBlock: 'lomutoPartition',
    codeLine: null,
    narration: 'מצב התחלתי. ב-Lomuto הציר הוא האיבר האחרון A[r].',
    highlights: [hl('active', ...rangeInclusive(1, b.length))],
  })
  const q = lomutoPartitionInto(b, 1, b.length, 0)
  b.emit({
    codeBlock: 'lomutoPartition',
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — הציר במקום ${q}, וזהו בדיוק המקום שלו במערך הממוין.`,
    highlights: [hl('sorted', q)],
  })
  return b.build()
}

export const lomutoPartitionSpec: AlgorithmSpec = {
  id: 'lomutoPartition',
  titleHe: 'Partition (Lomuto) — חלוקה חלופית',
  titleEn: 'Partition (Lomuto)',
  kind: 'helper',
  blurbHe:
    'גרסת חלוקה חלופית: הציר הוא האיבר האחרון, ובסוף הוא "נוחת" בדיוק במקומו הסופי במערך הממוין — קטנים ממנו משמאל, גדולים מימין.',
  complexity: '\\Theta(n)',
  proof: {
    result: '\\Theta(n)',
    claimHe: 'מעבר יחיד של j מ-p עד r−1, ועוד החלפה אחת לסיום.',
    steps: [{ he: 'הלולאה עוברת על כל איברי תת-המערך פעם אחת, כל צעד O(1):', tex: '\\Theta(n)' }],
    intuitionHe: 'מצביע j סורק את כל תת-המערך פעם אחת, ו-i גורר אחריו את גבול הקטנים-שווים.',
  },
  pseudocode: [lomutoPartitionBlock],
  run: runLomutoPartition,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 20 }),
  defaultInput: { array: [2, 8, 7, 1, 3, 5, 6, 4] },
  presets: [
    { labelHe: 'אקראי', input: { array: [2, 8, 7, 1, 3, 5, 6, 4] } },
    {
      labelHe: 'הפוך',
      input: { array: [8, 7, 6, 5, 4, 3, 2, 1] },
      noteHe: 'הציר A[r]=1 הוא הקטן — אין החלפות, הציר עובר לקדמה.',
    },
    { labelHe: 'כל האיברים שווים', input: { array: [4, 4, 4, 4, 4] } },
    {
      labelHe: 'ממוין (המקרה הגרוע ביותר)',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8] },
      worst: true,
      noteHe: 'כל האיברים ≤ הציר A[r] — i מתקדם בכל צעד, מקסימום החלפות. (Θ(n) תמיד.)',
    },
  ],
}
