import { FrameBuilder, hl } from '@/core/engine/FrameBuilder'
import { rangeInclusive } from '@/core/engine/indexing'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { mergeBlock, mergeSortBlock } from '../pseudocode'
import { rangeKey, type MergeScene } from '../scene'
import MergeSortView from '../views/MergeSortView'
import { mergeInto } from './merge'

export function runMergeSort(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const n = b.length
  const done = new Set<string>()
  const split = (lo: number, hi: number): MergeScene => ({
    active: { lo, hi },
    phase: 'split',
    done: [...done],
  })

  b.setBlock('mergeSort')
  b.setScene(split(1, n))
  b.emit({
    codeBlock: 'mergeSort',
    codeLine: null,
    callDepth: 0,
    narration: 'מצב התחלתי. נמיין בשיטת "חלק וכבוש": לפצל לחצאים, למיין כל חצי, ולמזג.',
    highlights: [hl('active', ...rangeInclusive(1, n))],
  })

  function ms(p: number, r: number, depth: number): void {
    b.setBlock('mergeSort')
    b.setScene(split(p, r))
    b.emit({
      codeBlock: 'mergeSort',
      codeLine: 1,
      callDepth: depth,
      narration: `Merge-Sort על [${p}..${r}].`,
      highlights: [hl('active', ...rangeInclusive(p, r))],
    })

    if (p < r) {
      const mid = Math.floor((p + r) / 2)
      b.emit({
        codeBlock: 'mergeSort',
        codeLine: 3,
        callDepth: depth,
        narration: `מפצלים באמצע (mid=${mid}): [${p}..${mid}] ו-[${mid + 1}..${r}].`,
        highlights: [
          hl('less', ...rangeInclusive(p, mid)),
          hl('greater', ...rangeInclusive(mid + 1, r)),
        ],
      })
      b.emit({
        codeBlock: 'mergeSort',
        codeLine: 4,
        callDepth: depth,
        narration: `ממיינים רקורסיבית את החצי השמאלי [${p}..${mid}].`,
        highlights: [hl('active', ...rangeInclusive(p, mid))],
      })
      ms(p, mid, depth + 1)

      b.setBlock('mergeSort')
      b.setScene(split(p, r))
      b.emit({
        codeBlock: 'mergeSort',
        codeLine: 5,
        callDepth: depth,
        narration: `ממיינים רקורסיבית את החצי הימני [${mid + 1}..${r}].`,
        highlights: [hl('active', ...rangeInclusive(mid + 1, r))],
      })
      ms(mid + 1, r, depth + 1)

      b.setBlock('mergeSort')
      b.setScene(split(p, r))
      b.emit({
        codeBlock: 'mergeSort',
        codeLine: 6,
        callDepth: depth,
        narration: `שני החצאים ממוינים — קוראים ל-Merge על [${p}..${r}].`,
        highlights: [
          hl('less', ...rangeInclusive(p, mid)),
          hl('greater', ...rangeInclusive(mid + 1, r)),
        ],
      })
      mergeInto(b, p, mid, r, depth, { done })
      done.add(rangeKey(p, r))
    } else {
      done.add(rangeKey(p, r))
      b.setScene({ active: { lo: p, hi: r }, phase: 'merge', done: [...done] })
      b.emit({
        codeBlock: 'mergeSort',
        codeLine: 2,
        callDepth: depth,
        narration: `תת-מערך בגודל 1 (אינדקס ${p}) — ממוין בהגדרה.`,
        highlights: [hl('sorted', p)],
      })
    }
  }

  ms(1, n, 0)

  b.setScene({ active: { lo: 1, hi: n }, phase: 'merge', done: [...done] })
  b.emit({
    codeBlock: 'mergeSort',
    codeLine: null,
    action: { kind: 'done' },
    narration: 'המערך ממוין בסדר עולה! 🎉',
    highlights: [hl('sorted', ...rangeInclusive(1, n))],
  })
  return b.build()
}

export const mergeSortSpec: AlgorithmSpec = {
  id: 'mergeSort',
  titleHe: 'מיון מיזוג — Merge-Sort',
  titleEn: 'Merge-Sort',
  kind: 'main',
  blurbHe:
    'מיון בשיטת "חלק וכבוש": מפצלים את המערך לשני חצאים, ממיינים כל חצי רקורסיבית, וממזגים אותם למערך ממוין. תמיד O(n log n) — אך משתמש בזיכרון עזר.',
  complexity: 'O(n \\log n)',
  usesHe: ['מיזוג (Merge)'],
  proof: {
    result: '\\Theta(n \\log n)',
    claimHe:
      'בכל רמה מפצלים לשני חצאים והמיזוג עולה Θ(n); יש log n רמות — ולכן זמן הריצה הוא תמיד Θ(n log n).',
    steps: [
      {
        he: 'נוסחת הנסיגה: שתי קריאות על חצי הגודל ועבודת מיזוג לינארית:',
        tex: 'T(n) = 2T(n/2) + \\Theta(n)',
      },
      {
        he: 'בעץ הרקורסיה כל רמה מסכמת ל-Θ(n) עבודה, ויש log n רמות (שיטת האב, מקרה 2):',
        tex: 'T(n) = \\Theta(n \\log n)',
      },
    ],
    intuitionHe:
      'בניגוד למיון מהיר — אין כאן "מקרה גרוע": הפיצול תמיד מאוזן בדיוק, ולכן הזמן יציב ב-Θ(n log n). המחיר: זיכרון עזר בגודל Θ(n) למיזוג.',
  },
  pseudocode: [mergeSortBlock, mergeBlock],
  views: ['custom'],
  customViz: MergeSortView,
  run: runMergeSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 12 }),
  defaultInput: { array: [5, 2, 8, 4, 7, 1, 9, 3] },
  presets: [
    { labelHe: 'אקראי', input: { array: [5, 2, 8, 4, 7, 1, 9, 3] } },
    { labelHe: 'הפוך', input: { array: [8, 7, 6, 5, 4, 3, 2, 1] } },
    {
      labelHe: 'ממוין',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8] },
      noteHe: 'גם כאן O(n log n) — למיון מיזוג אין "מקרה גרוע".',
    },
    { labelHe: 'כפילויות', input: { array: [4, 2, 4, 1, 2, 4, 1, 3] } },
    {
      labelHe: 'המקרה הגרוע ביותר (מירב השוואות)',
      input: { array: [1, 3, 5, 7, 2, 4, 6, 8] },
      worst: true,
      noteHe: 'החצאים נשזרים לסירוגין → הכי הרבה השוואות במיזוג. ובכל זאת — עדיין Θ(n log n) (אין מקרה גרוע אסימפטוטי).',
    },
  ],
  // No sortProfile: the Overview table already lists Merge-Sort (curated row), and
  // the Algorithm Race renders sorts with the generic array view — which can't show
  // merge-sort's non-in-place custom visualization.
}
