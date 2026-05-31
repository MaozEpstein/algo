import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { rangeInclusive } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight, Marker } from '@/engine/types'
import { hoarePartitionBlock } from '../pseudocode'

/** Shared recursion context so embedded partitions can show the sorted region. */
export interface PartitionCtx {
  sorted?: Set<number>
  phase?: string
}

interface EmitOpts {
  highlights?: Highlight[]
  markers?: Marker[]
  action?: Parameters<FrameBuilder['emit']>[0]['action']
}

/**
 * Hoare partition (verbatim from the slide). Exported for reuse by Quicksort and
 * Randomized-Quicksort. Tracks the pivot ELEMENT (by identity) so its highlight
 * follows it through swaps; drives the i/j pointer markers and the active range.
 * Returns q (= j), the split point: every A[p..q] ≤ every A[q+1..r].
 */
export function hoarePartitionInto(
  b: FrameBuilder,
  p: number,
  r: number,
  depth: number,
  ctx?: PartitionCtx,
): number {
  b.setBlock('hoarePartition')
  const A = (k: number) => b.value(k)
  const x = b.value(p) // pivot value
  const pivotId = b.elementIdAt(p) // pivot identity — follow it through swaps
  let i = p - 1
  let j = r + 1

  const emit = (codeLine: number, narration: string, opts: EmitOpts = {}) => {
    const pivotIdx = b.indexOfElement(pivotId)
    const highlights: Highlight[] = [hl('active', ...rangeInclusive(p, r))]
    if (ctx?.sorted && ctx.sorted.size) highlights.push(hl('sorted', ...ctx.sorted))
    highlights.push(hl('pivot', pivotIdx))
    if (opts.highlights) highlights.push(...opts.highlights)

    const markers: Marker[] = [{ label: 'pivot', index: pivotIdx, tone: 'pivot' }]
    if (i >= p && i <= r) markers.push({ label: 'i', index: i, tone: 'i' })
    if (j >= p && j <= r) markers.push({ label: 'j', index: j, tone: 'j' })
    if (opts.markers) markers.push(...opts.markers)

    b.emit({
      codeBlock: 'hoarePartition',
      codeLine,
      narration,
      callDepth: depth,
      phase: ctx?.phase,
      action: opts.action,
      highlights,
      markers,
    })
  }

  emit(2, `בוחרים ציר (pivot): x = A[${p}] = ${x}.`)
  emit(3, `i = ${p} − 1 = ${i} (משמאל לתת-המערך).`)
  emit(4, `j = ${r} + 1 = ${j} (מימין לתת-המערך).`)

  while (true) {
    // repeat j-- until A[j] <= x
    while (true) {
      j -= 1
      emit(7, `מקטינים את j ל-${j}.`)
      emit(8, `בדיקה: האם A[${j}] = ${A(j)} ≤ x = ${x}?`, {
        action: { kind: 'compare', a: j, b: b.indexOfElement(pivotId) },
        highlights: [hl('comparing', j)],
      })
      if (A(j) <= x) break
    }
    // repeat i++ until A[i] >= x
    while (true) {
      i += 1
      emit(10, `מגדילים את i ל-${i}.`)
      emit(11, `בדיקה: האם A[${i}] = ${A(i)} ≥ x = ${x}?`, {
        action: { kind: 'compare', a: i, b: b.indexOfElement(pivotId) },
        highlights: [hl('comparing', i)],
      })
      if (A(i) >= x) break
    }
    // if i < j swap, else return j
    if (i < j) {
      emit(12, `i (${i}) < j (${j}) — צריך להחליף.`, {
        highlights: [hl('swapping', i, j)],
      })
      emit(13, `מחליפים את A[${i}] = ${A(i)} עם A[${j}] = ${A(j)}.`, {
        action: { kind: 'swap', a: i, b: j },
        highlights: [hl('swapping', i, j)],
      })
      b.swap(i, j)
    } else {
      emit(12, `i (${i}) ≥ j (${j}) — מסיימים את החלוקה.`)
      emit(15, `מחזירים q = j = ${j}. כל [${p}..${j}] ≤ כל [${j + 1}..${r}].`, {
        highlights: [
          ...(j >= p ? [hl('less', ...rangeInclusive(p, j))] : []),
          ...(j + 1 <= r ? [hl('greater', ...rangeInclusive(j + 1, r))] : []),
        ],
      })
      return j
    }
  }
}

export function runHoarePartition(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  b.emit({
    codeBlock: 'hoarePartition',
    codeLine: null,
    narration: 'מצב התחלתי. נחלק את כל המערך סביב הציר A[1].',
    highlights: [hl('active', ...rangeInclusive(1, b.length))],
  })
  hoarePartitionInto(b, 1, b.length, 0)
  b.emit({
    codeBlock: 'hoarePartition',
    codeLine: null,
    action: { kind: 'done' },
    narration: 'סיום — המערך מחולק לשני אזורים: הקטנים-שווים משמאל והגדולים-שווים מימין.',
    highlights: [],
  })
  return b.build()
}

export const hoarePartitionSpec: AlgorithmSpec = {
  id: 'hoarePartition',
  titleHe: 'Partition (Hoare) — חלוקה',
  titleEn: 'Partition (Hoare)',
  kind: 'helper',
  blurbHe:
    'פונקציה שמסדרת תת-מערך סביב ערך "ציר" (pivot): מצביעים i ו-j נעים זה לקראת זה ומחליפים ערכים, עד שכל הקטנים מהציר נמצאים משמאל וכל הגדולים מימין.',
  complexity: '\\Theta(n)',
  helperOfHe: ['Quicksort', 'Randomized-Quicksort'],
  proof: {
    result: '\\Theta(n)',
    claimHe: 'חלוקה אחת על תת-מערך באורך n עולה Θ(n).',
    steps: [
      {
        he: 'המצביעים i ו-j מתחילים בקצוות ונעים זה לעבר זה, ולעולם לא חוזרים אחורה.',
      },
      {
        he: 'יחד הם עוברים על כל איבר בתת-המערך פעם אחת, וכל צעד עולה עבודה קבועה:',
        tex: '\\Theta(n)',
      },
    ],
    intuitionHe: 'מעבר יחיד מהקצוות פנימה — כל איבר נבדק בערך פעם אחת.',
  },
  pseudocode: [hoarePartitionBlock],
  run: runHoarePartition,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 20 }),
  defaultInput: { array: [5, 3, 2, 6, 4, 1, 3, 7] },
}
