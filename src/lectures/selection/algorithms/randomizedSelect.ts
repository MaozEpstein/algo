import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { rangeInclusive } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import { mulberry32, randInt } from '@/engine/seededRng'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight } from '@/engine/types'
import { lomutoPartitionInto } from '@/lectures/quicksort/algorithms/lomutoPartition'
import { lomutoPartitionBlock } from '@/lectures/quicksort/pseudocode'
import { randomizedPartitionBlock, randomizedSelectBlock } from '../pseudocode'

/**
 * RandomizedSelect (Lomuto version, verbatim from the slide). Finds the i-th
 * smallest element by partitioning and recursing into ONE side — the discarded
 * side stays dimmed (outside the active range). O(n) expected.
 */
export function runRandomizedSelect(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const rng = mulberry32(input.extra?.seed ?? 20407)
  const n = b.length
  const target = input.extra?.i ?? Math.ceil(n / 2) // global rank we seek (1-indexed)
  let answer = -1

  const A = (k: number) => b.value(k)
  const base = (p: number, r: number): Highlight[] =>
    p <= r ? [hl('active', ...rangeInclusive(p, r))] : []

  b.emit({
    codeBlock: 'randomizedSelect',
    codeLine: null,
    phase: 'select',
    narration: `מחפשים את האיבר ה-${target} הקטן ביותר במערך (לדוגמה, החציון).`,
    highlights: [hl('active', ...rangeInclusive(1, n))],
  })

  function rs(p: number, r: number, i: number, depth: number): number {
    b.setBlock('randomizedSelect')
    const emit = (codeLine: number, narration: string, extra: Highlight[] = []) =>
      b.emit({
        codeBlock: 'randomizedSelect',
        codeLine,
        phase: 'select',
        callDepth: depth,
        narration,
        highlights: [...base(p, r), ...extra],
      })

    emit(1, `RandomizedSelect על [${p}..${r}] — מחפשים את האיבר ה-${i} הקטן בתת-מערך זה.`)
    if (p === r) {
      emit(3, `תת-מערך בגודל 1 — האיבר A[${p}] = ${A(p)} הוא התשובה.`, [hl('sorted', p)])
      answer = p
      return A(p)
    }

    // Randomized-Partition (Lomuto): random pivot → swap to r → Partition
    b.setBlock('randomizedPartition')
    const kRand = randInt(rng, p, r)
    b.emit({
      codeBlock: 'randomizedPartition',
      codeLine: 2,
      phase: 'select',
      callDepth: depth,
      narration: `בוחרים ציר אקראי: A[${kRand}] = ${A(kRand)}.`,
      highlights: [...base(p, r), hl('pivot', kRand)],
      markers: [{ label: 'rand', index: kRand, tone: 'pivot' }],
    })
    b.emit({
      codeBlock: 'randomizedPartition',
      codeLine: 3,
      phase: 'select',
      callDepth: depth,
      narration: `מחליפים אותו לסוף (A[${r}]) כדי שחלוקת Lomuto תעבוד עליו.`,
      action: { kind: 'swap', a: kRand, b: r },
      highlights: [...base(p, r), hl('swapping', kRand, r)],
    })
    b.swap(kRand, r)

    const q = lomutoPartitionInto(b, p, r, depth, { phase: 'select' })

    b.setBlock('randomizedSelect')
    const k = q - p + 1
    emit(5, `k = q − p + 1 = ${k} — דרגת הציר A[${q}] = ${A(q)} בתת-המערך.`, [hl('pivot', q)])

    if (i === k) {
      emit(7, `i = k — מצאנו! התשובה היא A[${q}] = ${A(q)}.`, [hl('sorted', q)])
      answer = q
      return A(q)
    }
    if (i < k) {
      emit(8, `i (${i}) < k (${k}) — התשובה בחצי השמאלי. זורקים את הימני.`, [hl('pivot', q)])
      return rs(p, q - 1, i, depth + 1)
    }
    emit(9, `i (${i}) > k (${k}) — התשובה בחצי הימני. זורקים את השמאלי, ומחפשים את ה-${i - k}.`, [
      hl('pivot', q),
    ])
    return rs(q + 1, r, i - k, depth + 1)
  }

  const value = rs(1, n, target, 0)
  b.emit({
    codeBlock: 'randomizedSelect',
    codeLine: null,
    phase: 'select',
    action: { kind: 'done' },
    narration: `סיום — האיבר ה-${target} הקטן ביותר הוא ${value} (אינדקס ${answer}).`,
    highlights: [hl('sorted', answer)],
  })
  return b.build()
}

export const randomizedSelectSpec: AlgorithmSpec = {
  id: 'randomizedSelect',
  titleHe: 'RandomizedSelect — בחירה אקראית',
  titleEn: 'RandomizedSelect',
  kind: 'main',
  blurbHe:
    'מוצא את האיבר ה-i הקטן ביותר בלי למיין: מחלק סביב ציר אקראי (כמו Quicksort), אבל ממשיך רק לצד שבו נמצאת התשובה — וזה מה שמוזיל ל-O(n).',
  complexity: 'O(n) \\text{ (תוחלת)}',
  usesHe: ['Partition (Lomuto)'],
  proof: {
    result: 'O(n) \\text{ תוחלת},\\ O(n^2) \\text{ גרוע}',
    claimHe: 'בניגוד ל-Quicksort, ממשיכים רק לצד אחד — ולכן התוחלת לינארית.',
    steps: [
      {
        he: 'בתוחלת החלוקה מאזנת, וכל קריאה רקורסיבית עובדת על כחצי מהאיברים (צד אחד בלבד):',
        tex: 'T(n) = T(n/2) + O(n) = O(n)',
      },
      {
        he: 'במקרה הגרוע (חלוקות לא מאוזנות בעקביות) — כמו ב-Quicksort:',
        tex: 'T(n) = T(n-1) + O(n) = O(n^2)',
      },
    ],
    intuitionHe:
      'אחרי החלוקה אנחנו יודעים באיזה חצי נמצאת התשובה — אז זורקים את החצי השני לגמרי, במקום למיין אותו.',
  },
  pseudocode: [randomizedSelectBlock, randomizedPartitionBlock, lomutoPartitionBlock],
  run: runRandomizedSelect,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 20 }),
  defaultInput: { array: [7, 2, 9, 4, 1, 8, 5, 3, 6], extra: { i: 5, seed: 20407 } },
  presets: [
    {
      labelHe: 'חציון (i=5)',
      input: { array: [7, 2, 9, 4, 1, 8, 5, 3, 6], extra: { i: 5, seed: 20407 } },
    },
    {
      labelHe: 'מינימום (i=1)',
      input: { array: [7, 2, 9, 4, 1, 8, 5, 3, 6], extra: { i: 1, seed: 20407 } },
      noteHe: 'בחירה היא הכללה של מינימום/מקסימום.',
    },
    {
      labelHe: 'מקסימום (i=9)',
      input: { array: [7, 2, 9, 4, 1, 8, 5, 3, 6], extra: { i: 9, seed: 20407 } },
    },
    {
      labelHe: 'קלט ממוין',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8, 9], extra: { i: 5, seed: 20407 } },
      noteHe: 'גם על קלט ממוין — בתוחלת O(n) (ציר אקראי).',
    },
    {
      labelHe: 'זרע ביש-מזל (המקרה הגרוע ביותר)',
      input: { array: [7, 2, 9, 4, 1, 8, 5, 3, 6], extra: { i: 5, seed: 208 } },
      worst: true,
      noteHe: 'זרע שגורם לחלוקות לא-מאוזנות בעקביות — לכיוון O(n²). אירוע נדיר; התוחלת נשארת O(n).',
    },
  ],
}
