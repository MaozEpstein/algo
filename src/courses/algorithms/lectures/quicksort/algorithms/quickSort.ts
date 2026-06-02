import { FrameBuilder, hl, vi, vv } from '@/core/engine/FrameBuilder'
import { rangeInclusive } from '@/core/engine/indexing'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight, WatchVar } from '@/core/engine/types'
import { hoarePartitionBlock, quickSortBlock } from '../pseudocode'
import { hoarePartitionInto } from './hoarePartition'

export function runQuickSort(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const sorted = new Set<number>()
  const n = b.length

  const baseHl = (p: number, r: number): Highlight[] => {
    const h: Highlight[] = []
    if (p <= r) h.push(hl('active', ...rangeInclusive(p, r)))
    if (sorted.size) h.push(hl('sorted', ...sorted))
    return h
  }
  const qsVars = (p: number, r: number, depth: number): WatchVar[] => [
    vi('p', p, 'bound'),
    vi('r', r, 'bound'),
    vv('depth', depth, 'k'),
  ]

  b.emit({
    codeBlock: 'quickSort',
    codeLine: null,
    phase: 'sort',
    narration: 'מצב התחלתי — מערך לא ממוין. נמיין אותו בשיטת "חלק וכבוש".',
    highlights: [hl('active', ...rangeInclusive(1, n))],
    vars: qsVars(1, n, 0),
  })

  function qs(p: number, r: number, depth: number): void {
    b.setBlock('quickSort')
    b.emit({
      codeBlock: 'quickSort',
      codeLine: 1,
      callDepth: depth,
      phase: 'sort',
      narration: `Quicksort על תת-המערך [${p}..${r}].`,
      highlights: baseHl(p, r),
      vars: qsVars(p, r, depth),
    })

    if (p < r) {
      b.emit({
        codeBlock: 'quickSort',
        codeLine: 2,
        callDepth: depth,
        phase: 'sort',
        narration: `p < r — יש לפחות שני איברים, ממשיכים לחלק.`,
        highlights: baseHl(p, r),
        vars: qsVars(p, r, depth),
      })
      b.emit({
        codeBlock: 'quickSort',
        codeLine: 3,
        callDepth: depth,
        phase: 'sort',
        narration: `קוראים ל-Partition על [${p}..${r}].`,
        highlights: baseHl(p, r),
        vars: qsVars(p, r, depth),
      })

      const q = hoarePartitionInto(b, p, r, depth, { sorted, phase: 'sort' })

      b.setBlock('quickSort')
      b.emit({
        codeBlock: 'quickSort',
        codeLine: 4,
        callDepth: depth,
        phase: 'sort',
        narration: `ממיינים רקורסיבית את החצי השמאלי [${p}..${q}].`,
        highlights: baseHl(p, r),
        vars: [...qsVars(p, r, depth), vi('q', q, 'bound')],
      })
      qs(p, q, depth + 1)

      b.setBlock('quickSort')
      b.emit({
        codeBlock: 'quickSort',
        codeLine: 5,
        callDepth: depth,
        phase: 'sort',
        narration: `ממיינים רקורסיבית את החצי הימני [${q + 1}..${r}].`,
        highlights: baseHl(q + 1, r),
        vars: [...qsVars(p, r, depth), vi('q', q, 'bound')],
      })
      qs(q + 1, r, depth + 1)
    } else {
      if (p === r) sorted.add(p)
      b.emit({
        codeBlock: 'quickSort',
        codeLine: 2,
        callDepth: depth,
        phase: 'sort',
        narration:
          p === r
            ? `תת-מערך בגודל 1 (אינדקס ${p}) — האיבר במקומו הסופי.`
            : `תת-מערך ריק — אין מה למיין.`,
        highlights: baseHl(p, r),
        vars: qsVars(p, r, depth),
      })
    }
  }

  qs(1, n, 0)

  for (let k = 1; k <= n; k++) sorted.add(k)
  b.emit({
    codeBlock: 'quickSort',
    codeLine: null,
    phase: 'sort',
    action: { kind: 'done' },
    narration: 'סיום — המערך ממוין בסדר עולה! 🎉',
    highlights: [hl('sorted', ...rangeInclusive(1, n))],
  })
  return b.build()
}

export const quickSortSpec: AlgorithmSpec = {
  id: 'quickSort',
  titleHe: 'Quicksort — מיון מהיר',
  titleEn: 'Quicksort',
  kind: 'main',
  blurbHe:
    'אלגוריתם מיון בשיטת "חלק וכבוש": בוחר ציר, מחלק את המערך לקטנים-ממנו וגדולים-ממנו (Partition), וממיין כל חצי רקורסיבית — במקום (in-place).',
  complexity: 'O(n \\log n)',
  usesHe: ['Partition (Hoare)'],
  proof: {
    result: 'O(n \\log n) \\text{ ממוצע},\\ O(n^2) \\text{ גרוע}',
    claimHe: 'זמן הריצה תלוי באיכות החלוקה: מאוזנת → O(n log n); לא מאוזנת → O(n²).',
    steps: [
      {
        he: 'מקרה טוב/ממוצע — החלוקה מאזנת את שני החצאים, ולכן עומק הרקורסיה לוגריתמי וכל רמה עולה Θ(n):',
        tex: 'T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\log n)',
      },
      {
        he: 'מקרה גרוע — חלוקה לא מאוזנת בעקביות (למשל קלט כבר ממוין), כל חלוקה מקלפת איבר אחד:',
        tex: 'T(n) = T(n-1) + \\Theta(n) = \\Theta(n^2)',
      },
    ],
    intuitionHe:
      'החלוקה זולה (לינארית), אבל אם הציר תמיד קיצוני העץ הרקורסיבי נעשה "צר וארוך" (n רמות) במקום נמוך ורחב (log n רמות).',
  },
  pseudocode: [quickSortBlock, hoarePartitionBlock],
  run: runQuickSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 20 }),
  defaultInput: { array: [5, 3, 8, 4, 1, 7] },
  presets: [
    { labelHe: 'אקראי', input: { array: [5, 3, 8, 4, 1, 7] } },
    {
      labelHe: 'הפוך',
      input: { array: [7, 6, 5, 4, 3, 2, 1] },
      noteHe: 'גם כאן הציר קיצוני בכל שלב — רקורסיה צרה, O(n²).',
    },
    { labelHe: 'כפילויות', input: { array: [3, 1, 3, 2, 3, 1] } },
    {
      labelHe: 'ממוין (המקרה הגרוע ביותר)',
      input: { array: [1, 2, 3, 4, 5, 6, 7] },
      worst: true,
      noteHe: 'הציר תמיד קיצוני → רקורסיה צרה וארוכה, O(n²). שימו לב למונה ההשוואות המקסימלי.',
    },
  ],
  sortProfile: {
    worst: 'O(n^2)',
    average: 'O(n \\log n)',
    stableHe: 'לא יציב',
    inPlaceHe: 'במקום',
    whenHe: 'מהיר מאוד בפועל; אך נזהרים מקלט ממוין (המקרה הגרוע).',
  },
}
