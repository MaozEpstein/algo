import { FrameBuilder, hl } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { buildMaxHeapBlock, heapSortBlock, maxHeapifyBlock } from '../pseudocode'
import { heapifyInto } from './maxHeapify'
import { buildInto } from './buildMaxHeap'

export function runHeapSort(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  b.emit({
    codeBlock: 'heapSort',
    codeLine: 1,
    phase: 'build',
    narration: 'HeapSort — קודם בונים ערימת-מקסימום, ואז שולפים את המקסימום שוב ושוב לסוף.',
  })
  b.emit({
    codeBlock: 'heapSort',
    codeLine: 2,
    phase: 'build',
    narration: 'שלב 1: Build-Max-Heap — מארגנים את המערך כערימה.',
  })

  // Phase 1 — build (embeds build + heapify frames).
  buildInto(b, 'build')

  // Phase 2 — repeatedly extract the max to the shrinking tail.
  for (let i = b.length; i >= 2; i--) {
    b.setBlock('heapSort').setPhase('sort')
    b.emit({
      codeLine: 3,
      narration: `i = ${i} — השורש הוא המקסימום של הערימה הנוכחית; נמקם אותו בסוף.`,
      highlights: [hl('current', 1)],
    })
    b.emit({
      codeLine: 4,
      action: { kind: 'swap', a: 1, b: i },
      narration: `מחליפים את השורש A[1] = ${b.value(1)} (המקסימום) עם A[${i}] = ${b.value(i)}.`,
      highlights: [hl('swapping', 1, i)],
    })
    b.swap(1, i)
    b.setHeapSize(i - 1)
    b.emit({
      codeLine: 5,
      action: { kind: 'shrinkHeap', newSize: i - 1 },
      narration: `הערך ${b.value(i)} נמצא במקומו הסופי. מכווצים את הערימה ל-${i - 1} ומוציאים אותו מהעץ.`,
      highlights: [hl('sorted', i)],
    })
    b.emit({
      codeLine: 6,
      narration: 'Max-Heapify על השורש — מתקנים את הערימה המכווצת.',
      highlights: [hl('current', 1)],
    })
    heapifyInto(b, 1, 0, 'sort')
  }

  b.setHeapSize(0)
  b.emit({
    codeBlock: 'heapSort',
    codeLine: null,
    phase: 'sort',
    action: { kind: 'done' },
    narration: 'סיום — המערך ממוין בסדר עולה! 🎉',
    highlights: [],
  })
  return b.build()
}

export const heapSortSpec: AlgorithmSpec = {
  id: 'heapSort',
  titleHe: 'HeapSort — מיון ערימה',
  titleEn: 'HeapSort',
  kind: 'main',
  blurbHe:
    'אלגוריתם מיון הבונה ערימה מהמערך, ושלב אחר שלב שולף את איבר המקסימום ומציב אותו בסוף המערך כדי לקבל רשימה ממוינת.',
  complexity: 'O(n \\log n)',
  usesHe: ['Build-Max-Heap', 'Max-Heapify'],
  proof: {
    result: 'O(n \\log n)',
    claimHe: 'HeapSort רץ ב-O(n log n) בכל המקרים — גם הגרוע ביותר.',
    steps: [
      { he: 'שלב הבנייה: קריאה אחת ל-Build-Max-Heap.', tex: 'O(n)' },
      {
        he: 'שלב המיון: n−1 איטרציות; בכל אחת החלפה בעלות קבועה ואז Max-Heapify על השורש בעלות O(log n):',
        tex: '(n-1)\\cdot O(\\log n)',
      },
      {
        he: 'סוכמים את שני השלבים — האיבר הדומיננטי קובע:',
        tex: 'O(n) + (n-1)\\,O(\\log n) = O(n \\log n)',
      },
    ],
    intuitionHe:
      'הבנייה זולה (לינארית), אבל כל שליפת מקסימום דורשת תיקון של הערימה בעומק לוגריתמי — ויש n שליפות.',
  },
  pseudocode: [heapSortBlock, buildMaxHeapBlock, maxHeapifyBlock],
  run: runHeapSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 31 }),
  defaultInput: { array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] },
  presets: [
    { labelHe: 'אקראי', input: { array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] } },
    { labelHe: 'ממוין יורד', input: { array: [8, 7, 6, 5, 4, 3, 2, 1] } },
    { labelHe: 'כפילויות', input: { array: [5, 2, 5, 1, 5, 2, 4] } },
    {
      labelHe: 'ממוין עולה (המקרה הגרוע ביותר)',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      worst: true,
      noteHe: 'מספר ההשוואות המרבי — אך HeapSort הוא O(n log n) בכל מקרה (גם בגרוע).',
    },
  ],
  sortProfile: {
    worst: 'O(n \\log n)',
    average: 'O(n \\log n)',
    stableHe: 'לא יציב',
    inPlaceHe: 'במקום',
    whenHe: 'כשרוצים חסם O(n log n) מובטח בכל מקרה, וגם מיון במקום.',
  },
}
