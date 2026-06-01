import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { rangeInclusive } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import { mulberry32, randInt } from '@/engine/seededRng'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight } from '@/engine/types'
import {
  hoarePartitionBlock,
  randomizedPartitionBlock,
  randomizedQuickSortBlock,
} from '../pseudocode'
import { hoarePartitionInto } from './hoarePartition'

/**
 * Randomized-Quicksort: identical to Quicksort, but each partition first picks a
 * RANDOM pivot in [p..r] and swaps it to A[p], then runs Hoare. A seeded RNG
 * (mulberry32) keeps it deterministic and replayable for a given seed.
 */
export function runRandomizedQuickSort(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const rng = mulberry32(input.extra?.seed ?? 20407)
  const sorted = new Set<number>()
  const n = b.length

  const baseHl = (p: number, r: number): Highlight[] => {
    const h: Highlight[] = []
    if (p <= r) h.push(hl('active', ...rangeInclusive(p, r)))
    if (sorted.size) h.push(hl('sorted', ...sorted))
    return h
  }

  function randomizedPartition(p: number, r: number, depth: number): number {
    b.setBlock('randomizedPartition')
    const k = randInt(rng, p, r)
    b.emit({
      codeBlock: 'randomizedPartition',
      codeLine: 2,
      callDepth: depth,
      phase: 'sort',
      narration: `בוחרים ציר אקראי: i = ${k} מתוך [${p}..${r}].`,
      highlights: [...baseHl(p, r), hl('pivot', k)],
      markers: [{ label: 'rand', index: k, tone: 'pivot' }],
    })
    b.emit({
      codeBlock: 'randomizedPartition',
      codeLine: 3,
      callDepth: depth,
      phase: 'sort',
      narration: `מחליפים את A[${p}] עם A[${k}] — כך הציר האקראי הופך לראשון, ו-Partition רגיל יעבוד.`,
      action: { kind: 'swap', a: p, b: k },
      highlights: [...baseHl(p, r), hl('swapping', p, k)],
    })
    b.swap(p, k)
    b.emit({
      codeBlock: 'randomizedPartition',
      codeLine: 4,
      callDepth: depth,
      phase: 'sort',
      narration: `קוראים ל-Partition (Hoare) על [${p}..${r}].`,
      highlights: baseHl(p, r),
    })
    return hoarePartitionInto(b, p, r, depth, { sorted, phase: 'sort' })
  }

  b.emit({
    codeBlock: 'randomizedQuickSort',
    codeLine: null,
    phase: 'sort',
    narration: 'מצב התחלתי. גרסה אקראית — בכל חלוקה הציר נבחר אקראית כדי להימנע מהמקרה הגרוע.',
    highlights: [hl('active', ...rangeInclusive(1, n))],
  })

  function rqs(p: number, r: number, depth: number): void {
    b.setBlock('randomizedQuickSort')
    b.emit({
      codeBlock: 'randomizedQuickSort',
      codeLine: 1,
      callDepth: depth,
      phase: 'sort',
      narration: `Randomized-Quicksort על [${p}..${r}].`,
      highlights: baseHl(p, r),
    })
    if (p < r) {
      b.emit({
        codeBlock: 'randomizedQuickSort',
        codeLine: 3,
        callDepth: depth,
        phase: 'sort',
        narration: `קוראים ל-Randomized-Partition על [${p}..${r}].`,
        highlights: baseHl(p, r),
      })
      const q = randomizedPartition(p, r, depth)
      b.setBlock('randomizedQuickSort')
      b.emit({
        codeBlock: 'randomizedQuickSort',
        codeLine: 4,
        callDepth: depth,
        phase: 'sort',
        narration: `ממיינים רקורסיבית את [${p}..${q}].`,
        highlights: baseHl(p, r),
      })
      rqs(p, q, depth + 1)
      b.setBlock('randomizedQuickSort')
      b.emit({
        codeBlock: 'randomizedQuickSort',
        codeLine: 5,
        callDepth: depth,
        phase: 'sort',
        narration: `ממיינים רקורסיבית את [${q + 1}..${r}].`,
        highlights: baseHl(q + 1, r),
      })
      rqs(q + 1, r, depth + 1)
    } else {
      if (p === r) sorted.add(p)
      b.emit({
        codeBlock: 'randomizedQuickSort',
        codeLine: 2,
        callDepth: depth,
        phase: 'sort',
        narration: p === r ? `תת-מערך בגודל 1 (${p}) — במקומו הסופי.` : `תת-מערך ריק.`,
        highlights: baseHl(p, r),
      })
    }
  }

  rqs(1, n, 0)
  for (let k = 1; k <= n; k++) sorted.add(k)
  b.emit({
    codeBlock: 'randomizedQuickSort',
    codeLine: null,
    phase: 'sort',
    action: { kind: 'done' },
    narration: 'סיום — המערך ממוין! בזכות הציר האקראי, התוחלת היא O(n log n) לכל קלט.',
    highlights: [hl('sorted', ...rangeInclusive(1, n))],
  })
  return b.build()
}

export const randomizedQuickSortSpec: AlgorithmSpec = {
  id: 'randomizedQuickSort',
  titleHe: 'Randomized-Quicksort — מיון מהיר אקראי',
  titleEn: 'Randomized-Quicksort',
  kind: 'main',
  blurbHe:
    'כמו Quicksort, אך בכל חלוקה הציר נבחר אקראית (ואז מוחלף לראשון). כך אין קלט "גרוע" קבוע, ותוחלת זמן הריצה היא O(n log n) לכל קלט.',
  complexity: '\\Theta(n \\log n) \\text{ (תוחלת)}',
  usesHe: ['Partition (Hoare)'],
  proof: {
    result: '\\Theta(n \\log n) \\text{ (תוחלת)}',
    claimHe: 'תוחלת זמן הריצה היא Θ(n log n) — ללא תלות בקלט.',
    steps: [
      {
        he: 'בחירת ציר אקראית הופכת כל חלוקה ל"מאוזנת בתוחלת", כך שאף קלט ספציפי אינו גורם בהכרח למקרה הגרוע.',
      },
      {
        he: 'ניתוח התוחלת (ספירת מספר ההשוואות הצפוי) נותן:',
        tex: 'E[T(n)] = O(n \\log n)',
      },
    ],
    intuitionHe:
      'במקום לקוות שהקלט "נחמד", הופכים את האלגוריתם לאקראי — וכך מפזרים את הסיכון: קלט גרוע נדיר, לא קבוע.',
  },
  pseudocode: [randomizedQuickSortBlock, randomizedPartitionBlock, hoarePartitionBlock],
  run: runRandomizedQuickSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 20 }),
  defaultInput: { array: [1, 2, 3, 4, 5, 6, 7], extra: { seed: 20407 } },
  presets: [
    {
      labelHe: 'ממוין (הרנדומיזציה מצילה)',
      input: { array: [1, 2, 3, 4, 5, 6, 7], extra: { seed: 20407 } },
      noteHe: 'אותו קלט שמפיל את Quicksort ל-O(n²) — כאן הציר האקראי שומר על איזון.',
    },
    { labelHe: 'אקראי', input: { array: [5, 3, 8, 4, 1, 7], extra: { seed: 20407 } } },
    {
      labelHe: 'זרע אחר',
      input: { array: [1, 2, 3, 4, 5, 6, 7], extra: { seed: 7 } },
      noteHe: 'אותו מערך, זרע אקראי אחר → רצף חלוקות שונה.',
    },
    {
      labelHe: 'זרע ביש-מזל (המקרה הגרוע ביותר)',
      input: { array: [6, 2, 8, 4, 9, 1, 7, 3, 5, 10], extra: { seed: 170 } },
      worst: true,
      noteHe: 'זרע שגורם לרצף חלוקות לא-מאוזנות ומונה השוואות מקסימלי — אך זהו אירוע נדיר; התוחלת נשארת O(n log n).',
    },
  ],
  sortProfile: {
    worst: 'O(n^2)',
    average: '\\Theta(n \\log n)',
    stableHe: 'לא יציב',
    inPlaceHe: 'במקום',
    whenHe: 'גרסת ברירת-המחדל המעשית — תוחלת O(n log n) לכל קלט, ללא "קלט גרוע" קבוע.',
  },
}
