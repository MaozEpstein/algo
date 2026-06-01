import { FrameBuilder, hl } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { buildMaxHeapBlock, maxHeapifyBlock } from '../pseudocode'
import { heapifyInto } from './maxHeapify'

/** Build a max-heap in place, embedding the Max-Heapify frames. Reused by HeapSort. */
export function buildInto(b: FrameBuilder, phase = 'build'): void {
  b.setBlock('buildMaxHeap').setPhase(phase)
  b.emit({ codeLine: 1, narration: 'Build-Max-Heap — נהפוך מערך שרירותי לערימת-מקסימום.' })
  b.emit({ codeLine: 2, narration: `קובעים heap-size = length = ${b.length}.` })
  const start = Math.floor(b.length / 2)
  for (let i = start; i >= 1; i--) {
    b.setBlock('buildMaxHeap')
    b.emit({
      codeLine: 3,
      narration:
        i === start
          ? `מתחילים מ-i = ⌊n/2⌋ = ${start}. כל האיברים מ-${start + 1} והלאה הם עלים — כבר ערימות תקינות.`
          : `i = ${i} — מטפלים בתת-העץ הבא, מלמטה למעלה.`,
      highlights: [hl('current', i)],
    })
    b.emit({
      codeLine: 4,
      narration: `קוראים ל-Max-Heapify על צומת ${i} (הערך ${b.value(i)}).`,
      highlights: [hl('current', i)],
    })
    heapifyInto(b, i, 0, phase)
  }
}

export function runBuildMaxHeap(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  b.emit({
    codeBlock: 'buildMaxHeap',
    codeLine: null,
    phase: 'build',
    narration: 'מצב התחלתי: מערך שרירותי, עדיין לא ערימה.',
  })
  buildInto(b)
  b.emit({
    codeBlock: 'buildMaxHeap',
    codeLine: null,
    phase: 'build',
    action: { kind: 'done' },
    narration: 'סיום — כל המערך הוא כעת ערימת-מקסימום. השורש (אינדקס 1) הוא האיבר הגדול ביותר.',
    highlights: [hl('largest', 1)],
  })
  return b.build()
}

export const buildMaxHeapSpec: AlgorithmSpec = {
  id: 'buildMaxHeap',
  titleHe: 'Build-Max-Heap — בניית ערימה',
  titleEn: 'Build-Max-Heap',
  kind: 'helper',
  blurbHe:
    'פונקציה שמקבלת מערך לא ממוין ובונה ממנו ערימת מקסימום תקינה "מלמטה למעלה" (bottom-up).',
  complexity: 'O(n)',
  helperOfHe: ['HeapSort'],
  usesHe: ['Max-Heapify'],
  proof: {
    result: 'O(n)',
    claimHe:
      'אף שמפעילים את Max-Heapify כ-n/2 פעמים, וכל קריאה עולה O(log n), החסם ההדוק הוא O(n) — לא O(n log n).',
    steps: [
      {
        he: 'חסם נאיבי: n/2 קריאות, כל אחת O(log n). זה נכון אבל לא הדוק:',
        tex: '\\tfrac{n}{2}\\cdot O(\\log n) = O(n \\log n)',
      },
      {
        he: 'התובנה: רוב הצמתים נמוכים. בגובה h יש לכל היותר ⌈n/2^{h+1}⌉ צמתים, וקריאת Max-Heapify עליהם עולה O(h). סוכמים על כל הגבהים:',
        tex: '\\sum_{h=0}^{\\lfloor \\log n \\rfloor} \\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil O(h)',
      },
      {
        he: 'מוציאים את n ומרחיבים את הסכום עד אינסוף (חסם מלעיל):',
        tex: '= O\\!\\left( n \\sum_{h=0}^{\\infty} \\frac{h}{2^{h}} \\right)',
      },
      {
        he: 'הטור מתכנס לקבוע (2), ולכן כל הביטוי לינארי:',
        tex: '\\sum_{h=0}^{\\infty} \\frac{h}{2^{h}} = 2 \\;\\Rightarrow\\; O(n)',
      },
    ],
    intuitionHe:
      'חצי מהצמתים הם עלים (עבודה אפס), רבע בגובה 1, שמינית בגובה 2… העבודה היקרה נעשית על מעט צמתים גבוהים, והעבודה הזולה על ההמון הרדוד — והסכום יוצא לינארי.',
  },
  pseudocode: [buildMaxHeapBlock, maxHeapifyBlock],
  run: runBuildMaxHeap,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 31 }),
  defaultInput: { array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] },
  presets: [
    { labelHe: 'אקראי', input: { array: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7] } },
    {
      labelHe: 'כבר ערימה (ממוין יורד)',
      input: { array: [8, 7, 6, 5, 4, 3, 2, 1] },
      noteHe: 'מערך ממוין-יורד הוא כבר ערימת-מקסימום — כמעט אפס עבודה.',
    },
    { labelHe: 'כל האיברים שווים', input: { array: [5, 5, 5, 5, 5, 5, 5] }, noteHe: '0 החלפות.' },
    {
      labelHe: 'ממוין עולה (המקרה הגרוע ביותר)',
      input: { array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
      worst: true,
      noteHe: 'הכי רחוק מערימה — מקסימום הצפות. (החסם נשאר O(n) הדוק בכל מקרה.)',
    },
  ],
}
