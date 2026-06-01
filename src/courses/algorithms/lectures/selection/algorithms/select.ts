import { FrameBuilder, hl } from '@/core/engine/FrameBuilder'
import { rangeInclusive } from '@/core/engine/indexing'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight } from '@/core/engine/types'
import { lomutoPartitionInto } from '@/courses/algorithms/lectures/quicksort/algorithms/lomutoPartition'
import { lomutoPartitionBlock } from '@/courses/algorithms/lectures/quicksort/pseudocode'
import { selectBlock } from '../pseudocode'

/**
 * Deterministic Select — median of medians (OPTIONAL course material, O(n)
 * worst case). The narrowing recursion (to the i-th element) is animated via
 * partition + recurse on one side; the pivot is chosen by showing groups of 5
 * and their medians (teal), then the median-of-those as the pivot (violet).
 */
export function runSelect(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const n = b.length
  const target = input.extra?.i ?? Math.ceil(n / 2)
  let answer = -1
  const A = (k: number) => b.value(k)
  const base = (p: number, r: number): Highlight[] =>
    p <= r ? [hl('active', ...rangeInclusive(p, r))] : []

  /** Index of the median element within a small group [gp..ge] (≤5). */
  function medianIndexOf(gp: number, ge: number): number {
    const idx = rangeInclusive(gp, ge).sort((a, c) => A(a) - A(c))
    return idx[Math.ceil(idx.length / 2) - 1]
  }

  b.emit({
    codeBlock: 'select',
    codeLine: null,
    phase: 'select',
    narration: `מחפשים את האיבר ה-${target} הקטן ביותר — בשיטה דטרמיניסטית (חציון של חציונים).`,
    highlights: [hl('active', ...rangeInclusive(1, n))],
  })

  function sel(p: number, r: number, i: number, depth: number): number {
    b.setBlock('select')
    const emit = (codeLine: number, narration: string, extra: Highlight[] = []) =>
      b.emit({
        codeBlock: 'select',
        codeLine,
        phase: 'select',
        callDepth: depth,
        narration,
        highlights: [...base(p, r), ...extra],
      })

    emit(1, `Select על [${p}..${r}] — מחפשים את האיבר ה-${i} הקטן.`)
    if (p === r) {
      emit(1, `תת-מערך בגודל 1 — A[${p}] = ${A(p)} הוא התשובה.`, [hl('sorted', p)])
      answer = p
      return p
    }

    const size = r - p + 1
    const groups = Math.ceil(size / 5)
    emit(2, `מחלקים את ${size} האיברים ל-${groups} קבוצות של 5.`)

    // Step 1: median of each group (teal), accumulating.
    const medianIdx: number[] = []
    for (let gj = 0; gj < groups; gj++) {
      const gp = p + 5 * gj
      const ge = Math.min(gp + 4, r)
      const m = medianIndexOf(gp, ge)
      emit(3, `קבוצה [${gp}..${ge}]: החציון הוא A[${m}] = ${A(m)}.`, [
        hl('comparing', ...rangeInclusive(gp, ge)),
        ...medianIdx.map((x) => hl('median', x)),
        hl('median', m),
      ])
      medianIdx.push(m)
    }

    // Step 2: x = median of the medians (computed directly; shown as pivot).
    const sortedMed = [...medianIdx].sort((a, c) => A(a) - A(c))
    const xIndex = sortedMed[Math.ceil(sortedMed.length / 2) - 1]
    emit(4, `חציון החציונים: x = A[${xIndex}] = ${A(xIndex)} — זה הציר.`, [
      ...medianIdx.map((x) => hl('median', x)),
      hl('pivot', xIndex),
    ])

    // Step 3: partition [p..r] around x (move it to the end for Lomuto).
    emit(5, `מחלקים את [${p}..${r}] סביב הציר x = ${A(xIndex)}.`, [hl('pivot', xIndex)])
    b.swap(xIndex, r)
    const q = lomutoPartitionInto(b, p, r, depth, { phase: 'select' })
    b.setBlock('select')
    const k = q - p + 1
    emit(5, `דרגת הציר: k = q − p + 1 = ${k}.`, [hl('pivot', q)])

    // Step 4: compare and recurse on one side.
    if (i === k) {
      emit(6, `i = k — מצאנו! התשובה היא A[${q}] = ${A(q)}.`, [hl('sorted', q)])
      answer = q
      return q
    }
    if (i < k) {
      emit(7, `i (${i}) < k (${k}) — ממשיכים בחצי השמאלי בלבד.`, [hl('pivot', q)])
      return sel(p, q - 1, i, depth + 1)
    }
    emit(8, `i (${i}) > k (${k}) — ממשיכים בחצי הימני, ומחפשים את ה-${i - k}.`, [hl('pivot', q)])
    return sel(q + 1, r, i - k, depth + 1)
  }

  sel(1, n, target, 0)
  b.emit({
    codeBlock: 'select',
    codeLine: null,
    phase: 'select',
    action: { kind: 'done' },
    narration: `סיום — האיבר ה-${target} הקטן ביותר הוא ${A(answer)} (אינדקס ${answer}).`,
    highlights: [hl('sorted', answer)],
  })
  return b.build()
}

export const selectSpec: AlgorithmSpec = {
  id: 'select',
  titleHe: 'Select — חציון של חציונים (רשות)',
  titleEn: 'Select (median of medians)',
  kind: 'main',
  optional: true,
  blurbHe:
    'גרסה דטרמיניסטית של בחירה, O(n) גם במקרה הגרוע: בוחרת ציר "טוב" מובטח — חציון של חציוני קבוצות-5 — שמבטיח חלוקה מאוזנת. (חומר רשות.)',
  complexity: 'O(n) \\text{ (גרוע)}',
  usesHe: ['Partition (Lomuto)'],
  proof: {
    result: 'O(n) \\text{ במקרה הגרוע}',
    claimHe: 'בחירת חציון-החציונים כציר מבטיחה שכל צד מכיל לכל היותר ~7n/10 איברים.',
    steps: [
      { he: 'לפחות חצי מהחציונים ≥ x, וכל אחד מהם הוא חציון של 5 → לפחות 3 בכל קבוצה כזו ≥ x. לכן לפחות ~n/4 מהאיברים ≥ x (וסימטרית ≤ x).' },
      { he: 'מכאן הצד שממשיכים אליו ≤ 7n/10, ומציאת הציר עולה T(⌈n/5⌉):', tex: 'T(n) \\le T(\\lceil n/5 \\rceil) + T(7n/10) + O(n)' },
      { he: 'כיוון ש-1/5 + 7/10 < 1, הפתרון לינארי:', tex: 'T(n) = O(n)' },
    ],
    intuitionHe:
      'הקבוע גדול, ולכן מעשית RandomizedSelect מהיר יותר — אבל זו הוכחה יפה לכך שאפשר O(n) במקרה הגרוע. לכן זה חומר רשות.',
  },
  pseudocode: [selectBlock, lomutoPartitionBlock],
  run: runSelect,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 20 }),
  defaultInput: { array: [12, 3, 7, 9, 1, 15, 6, 11, 2, 8, 14, 4, 10, 13, 5], extra: { i: 8 } },
  presets: [
    {
      labelHe: 'חציון (i=8)',
      input: { array: [12, 3, 7, 9, 1, 15, 6, 11, 2, 8, 14, 4, 10, 13, 5], extra: { i: 8 } },
      noteHe: '15 איברים = 3 קבוצות של 5 — רואים היטב את חציוני הקבוצות.',
    },
    {
      labelHe: 'מינימום (i=1)',
      input: { array: [12, 3, 7, 9, 1, 15, 6, 11, 2, 8, 14, 4, 10, 13, 5], extra: { i: 1 } },
    },
    {
      labelHe: 'מקסימום (i=15)',
      input: { array: [12, 3, 7, 9, 1, 15, 6, 11, 2, 8, 14, 4, 10, 13, 5], extra: { i: 15 } },
    },
    {
      labelHe: 'קלט ממוין (המקרה הגרוע ביותר)',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], extra: { i: 8 } },
      worst: true,
      noteHe: 'גם על קלט ממוין נשארים עם עומס מרבי — אך הציר "חציון-החציונים" מבטיח O(n) גם במקרה הגרוע.',
    },
  ],
}
