import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { parent } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/engine/types'
import {
  heapExtractMaxBlock,
  heapInsertBlock,
  heapMaximumBlock,
  maxHeapifyBlock,
} from '../pseudocode'
import { heapifyInto } from './maxHeapify'

/** A valid max-heap used as the starting point for the priority-queue demos. */
const HEAP: number[] = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]

// ---- Insert --------------------------------------------------------------
export function runHeapInsert(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const key = input.extra?.key ?? 15
  b.setBlock('heapInsert').setPhase('insert')
  b.emit({ codeLine: 1, narration: `מכניסים מפתח חדש: ${key}.` })
  const idx = b.push(key)
  b.emit({
    codeLine: 2,
    narration: `מגדילים את הערימה ב-1 (heap-size = ${b.size}).`,
    highlights: [hl('inserted', idx)],
  })
  b.emit({
    codeLine: 3,
    action: { kind: 'insert', value: key, at: idx },
    narration: `מניחים את ${key} בעלה החדש, אינדקס ${idx}.`,
    highlights: [hl('inserted', idx)],
  })
  let i = idx
  b.emit({
    codeLine: 4,
    narration: `i = ${i}. כעת נטפס מעלה כל עוד ההורה קטן מהמפתח.`,
    highlights: [hl('current', i)],
  })
  while (i > 1) {
    const p = parent(i)
    b.emit({
      codeLine: 5,
      action: { kind: 'compare', a: p, b: i },
      narration: `בדיקה: האם A[${p}] = ${b.value(p)} קטן מ-A[${i}] = ${b.value(i)}?`,
      highlights: [hl('comparing', p, i)],
    })
    if (b.value(p) >= b.value(i)) {
      b.emit({
        codeLine: 5,
        action: { kind: 'noSwap', at: i },
        narration: `לא — ההורה גדול-שווה. המפתח הגיע למקומו.`,
        highlights: [hl('current', i)],
      })
      break
    }
    b.emit({
      codeLine: 6,
      action: { kind: 'swap', a: i, b: p },
      narration: `כן — מחליפים את ${b.value(i)} עם ההורה ${b.value(p)} (טיפוס מעלה).`,
      highlights: [hl('swapping', i, p)],
    })
    b.swap(i, p)
    i = p
    b.emit({
      codeLine: 7,
      action: { kind: 'bubbleUp', from: idx, to: i },
      narration: `i = ${i} — ממשיכים לטפס.`,
      highlights: [hl('current', i)],
    })
  }
  if (i === 1) {
    b.emit({
      codeLine: 4,
      narration: `הגענו לשורש — המפתח ${key} הוא המקסימום החדש.`,
      highlights: [hl('current', 1)],
    })
  }
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום — ${key} שולב בערימה תוך שמירה על התכונה. עלות: O(log n).`,
    highlights: [],
  })
  return b.build()
}

// ---- Maximum -------------------------------------------------------------
export function runHeapMaximum(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  b.setBlock('heapMaximum').setPhase('extract')
  b.emit({ codeLine: 1, narration: 'מהו האיבר המקסימלי בערימה?' })
  b.emit({
    codeLine: 2,
    narration: `הוא תמיד בשורש: A[1] = ${b.value(1)}. עלות: O(1).`,
    action: { kind: 'done' },
    highlights: [hl('largest', 1)],
  })
  return b.build()
}

// ---- Extract-Max ---------------------------------------------------------
export function runHeapExtractMax(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  b.setBlock('heapExtractMax').setPhase('extract')
  const maxVal = b.value(1)
  const last = b.size
  b.emit({ codeLine: 1, narration: 'שולפים את המקסימום מהערימה.' })
  b.emit({ codeLine: 2, narration: 'הערימה אינה ריקה — ממשיכים.', highlights: [hl('current', 1)] })
  b.emit({
    codeLine: 4,
    narration: `שומרים את המקסימום: max = A[1] = ${maxVal}.`,
    highlights: [hl('extracted', 1)],
  })
  b.emit({
    codeLine: 5,
    action: { kind: 'swap', a: 1, b: last },
    narration: `מעבירים את האיבר האחרון A[${last}] = ${b.value(last)} אל השורש.`,
    highlights: [hl('swapping', 1, last)],
  })
  b.swap(1, last)
  b.setHeapSize(last - 1)
  b.emit({
    codeLine: 6,
    action: { kind: 'shrinkHeap', newSize: last - 1 },
    narration: `מכווצים את הערימה ל-${last - 1} — האיבר ${maxVal} יוצא מהערימה.`,
    highlights: [hl('extracted', last)],
  })
  b.emit({
    codeLine: 7,
    narration: 'Max-Heapify על השורש כדי לשקם את תכונת הערימה.',
    highlights: [hl('current', 1)],
  })
  heapifyInto(b, 1, 0, 'extract')
  b.emit({
    codeLine: 8,
    action: { kind: 'done' },
    narration: `סיום — הוחזר המקסימום ${maxVal}, והערימה תקינה שוב. עלות: O(log n).`,
    highlights: [],
  })
  return b.build()
}

const heapValidate = (raw: string) => parseIntArray(raw, { min: 1, max: 31 })

export const heapInsertSpec: AlgorithmSpec = {
  id: 'heapInsert',
  titleHe: 'Max-Heap-Insert — הכנסה',
  titleEn: 'Max-Heap-Insert',
  kind: 'main',
  blurbHe:
    'פונקציה שמחדירה איבר חדש לערימה (בסופה) ומחלחלת אותו למעלה (bubble-up) כדי לשמור על תכונת הערימה.',
  complexity: 'O(\\log n)',
  proof: {
    result: 'O(\\log n)',
    claimHe: 'הכנסת מפתח חדש עולה O(log n).',
    steps: [
      { he: 'מניחים את המפתח בעלה חדש בסוף המערך — עבודה קבועה.', tex: '\\Theta(1)' },
      {
        he: 'מטפסים מעלה לאורך מסלול מהעלה אל השורש, בכל צעד החלפה אחת. אורך המסלול חסום בגובה העץ:',
        tex: 'O(\\log n)',
      },
    ],
    intuitionHe: 'המפתח מטפס לאורך מסלול יחיד כלפי השורש — לכל היותר ⌊log₂n⌋ צעדים.',
  },
  pseudocode: [heapInsertBlock],
  run: runHeapInsert,
  validateInput: heapValidate,
  defaultInput: { array: HEAP, extra: { key: 15 } },
}

export const heapMaximumSpec: AlgorithmSpec = {
  id: 'heapMaximum',
  titleHe: 'Heap-Maximum — מקסימום',
  titleEn: 'Heap-Maximum',
  kind: 'main',
  blurbHe:
    'פונקציה המחזירה את האיבר המקסימלי בערימה (הנמצא תמיד בשורש) מבלי להסיר אותו.',
  complexity: 'O(1)',
  proof: {
    result: 'O(1)',
    claimHe: 'מציאת המקסימום עולה O(1).',
    steps: [
      {
        he: 'תכונת ערימת-המקסימום מבטיחה שהאיבר הגדול ביותר נמצא תמיד בשורש, A[1]. מחזירים אותו ישירות.',
        tex: '\\Theta(1)',
      },
    ],
    intuitionHe: 'אין צורך לחפש — המקסימום "יושב" בשורש בכל רגע נתון.',
  },
  pseudocode: [heapMaximumBlock],
  run: runHeapMaximum,
  validateInput: heapValidate,
  defaultInput: { array: HEAP },
}

export const heapExtractMaxSpec: AlgorithmSpec = {
  id: 'heapExtractMax',
  titleHe: 'Heap-Extract-Max — שליפת מקסימום',
  titleEn: 'Heap-Extract-Max',
  kind: 'main',
  blurbHe:
    'פונקציה השולפת ומחזירה את איבר המקסימום מהשורש, מחליפה אותו באיבר האחרון בערימה, ומפעילה Max-Heapify כדי לתקן את המבנה.',
  complexity: 'O(\\log n)',
  usesHe: ['Max-Heapify'],
  proof: {
    result: 'O(\\log n)',
    claimHe: 'שליפת המקסימום עולה O(log n).',
    steps: [
      { he: 'קוראים את השורש ומעבירים את האיבר האחרון לראש — עבודה קבועה.', tex: '\\Theta(1)' },
      { he: 'הצעד היקר היחיד הוא Max-Heapify על השורש כדי לתקן את הערימה:', tex: 'O(\\log n)' },
    ],
    intuitionHe: 'כל העלות מרוכזת ב-Max-Heapify אחד מהשורש — בעומק לוגריתמי.',
  },
  pseudocode: [heapExtractMaxBlock, maxHeapifyBlock],
  run: runHeapExtractMax,
  validateInput: heapValidate,
  defaultInput: { array: HEAP },
}
