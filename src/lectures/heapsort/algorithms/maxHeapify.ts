import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { left, right } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/engine/types'
import { maxHeapifyBlock } from '../pseudocode'

/**
 * The recursive Max-Heapify step, driving a FrameBuilder. Exported so that
 * Build-Max-Heap, HeapSort and Extract-Max can embed its frames verbatim.
 *
 * @param phase optional phase label to tag the embedded frames.
 */
export function heapifyInto(
  b: FrameBuilder,
  i: number,
  depth: number,
  phase?: string,
): void {
  b.setBlock('maxHeapify')
  const A = (k: number) => b.value(k)
  const emit = (
    codeLine: number,
    narration: string,
    extra: Partial<Parameters<FrameBuilder['emit']>[0]> = {},
  ) => b.emit({ codeLine, narration, callDepth: depth, phase, ...extra })

  emit(1, `קוראים ל-Max-Heapify על צומת ${i} (הערך ${A(i)})`, {
    highlights: [hl('current', i)],
  })

  const l = left(i)
  const r = right(i)
  emit(
    2,
    l <= b.size ? `הילד השמאלי באינדקס l = ${l}` : `אין ילד שמאלי (l = ${l} מחוץ לערימה)`,
    { highlights: l <= b.size ? [hl('current', i), hl('path', l)] : [hl('current', i)] },
  )
  emit(
    3,
    r <= b.size ? `הילד הימני באינדקס r = ${r}` : `אין ילד ימני (r = ${r} מחוץ לערימה)`,
    { highlights: r <= b.size ? [hl('current', i), hl('path', r)] : [hl('current', i)] },
  )

  let largest = i

  if (l <= b.size) {
    emit(4, `משווים: האם A[${l}] = ${A(l)} גדול מ-A[${i}] = ${A(i)}?`, {
      action: { kind: 'compare', a: l, b: i },
      highlights: [hl('comparing', l, i)],
    })
    if (A(l) > A(i)) {
      largest = l
      emit(5, `כן — הילד השמאלי גדול יותר, נסמן largest = ${l}`, {
        action: { kind: 'setLargest', index: l, from: i },
        highlights: [hl('current', i), hl('largest', largest)],
      })
    } else {
      emit(6, `לא — נשאר largest = i = ${i}`, {
        highlights: [hl('current', i), hl('largest', largest)],
      })
    }
  } else {
    emit(6, `אין ילד שמאלי — largest = i = ${i}`, {
      highlights: [hl('current', i), hl('largest', largest)],
    })
  }

  if (r <= b.size) {
    emit(7, `משווים: האם A[${r}] = ${A(r)} גדול מ-A[largest] = A[${largest}] = ${A(largest)}?`, {
      action: { kind: 'compare', a: r, b: largest },
      highlights: [hl('comparing', r, largest), hl('current', i)],
    })
    if (A(r) > A(largest)) {
      const from = largest
      largest = r
      emit(8, `כן — הילד הימני גדול יותר, נסמן largest = ${r}`, {
        action: { kind: 'setLargest', index: r, from },
        highlights: [hl('current', i), hl('largest', largest)],
      })
    }
  }

  if (largest !== i) {
    emit(9, `largest ≠ i — הילד גדול מההורה, צריך להחליף`, {
      highlights: [hl('current', i), hl('largest', largest)],
    })
    emit(10, `מחליפים את A[${i}] = ${A(i)} עם A[${largest}] = ${A(largest)}`, {
      action: { kind: 'swap', a: i, b: largest },
      highlights: [hl('swapping', i, largest)],
    })
    b.swap(i, largest)
    emit(11, `הערך ירד מקום אחד — ממשיכים את ההצפה מטה על צומת ${largest}`, {
      action: { kind: 'recurse', into: largest },
      highlights: [hl('current', largest)],
    })
    heapifyInto(b, largest, depth + 1, phase)
  } else {
    emit(9, `largest = i — הצומת גדול משני ילדיו, תכונת הערימה מתקיימת`, {
      action: { kind: 'noSwap', at: i },
      highlights: [hl('current', i)],
    })
  }
}

export function runMaxHeapify(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const startIndex = input.extra?.startIndex ?? 1
  b.emit({
    codeBlock: 'maxHeapify',
    codeLine: null,
    narration: `מצב התחלתי. נריץ Max-Heapify מצומת ${startIndex} בהנחה ששני תת-העצים שמתחתיו כבר ערימות.`,
    highlights: [hl('current', startIndex)],
  })
  heapifyInto(b, startIndex, 0)
  b.emit({
    codeBlock: 'maxHeapify',
    codeLine: null,
    narration: `סיום — תת-העץ שמשורשו ${startIndex} הוא כעת ערימת-מקסימום תקינה.`,
    action: { kind: 'done' },
    highlights: [],
  })
  return b.build()
}

export const maxHeapifySpec: AlgorithmSpec = {
  id: 'maxHeapify',
  titleHe: 'Max-Heapify — הצפה מטה',
  titleEn: 'Max-Heapify',
  kind: 'helper',
  blurbHe:
    'פונקציה שמקבלת צומת שהעץ מתחתיו אינו תקין, ומחלחלת אותו למטה כדי לתקן ולשמר את תכונת הערימה.',
  complexity: 'O(\\log n)',
  helperOfHe: ['Build-Max-Heap', 'HeapSort', 'Heap-Extract-Max'],
  proof: {
    result: 'O(\\log n)',
    claimHe: 'זמן הריצה של Max-Heapify על צומת בגובה h הוא O(h), ובמקרה הגרוע h = log₂n.',
    steps: [
      {
        he: 'בכל קריאה מבצעים עבודה קבועה: השוואה עם שני הילדים ולכל היותר החלפה אחת.',
        tex: '\\Theta(1)',
      },
      {
        he: 'אחרי ההחלפה ממשיכים רקורסיבית על תת-עץ של ילד. במקרה הגרוע (שורה אחרונה מלאה עד חציה) תת-העץ מכיל לכל היותר 2/3 מהצמתים, ומכאן נוסחת הנסיגה:',
        tex: 'T(n) \\le T(2n/3) + \\Theta(1)',
      },
      {
        he: 'לפי משפט האב (מקרה 2), הפתרון הוא לוגריתמי:',
        tex: 'T(n) = O(\\log n)',
      },
    ],
    intuitionHe:
      'הערך "שוקע" לאורך מסלול יחיד מהשורש כלפי עלה — ואורך המסלול הוא בדיוק גובה העץ, ⌊log₂n⌋.',
  },
  pseudocode: [maxHeapifyBlock],
  run: runMaxHeapify,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 31 }),
  defaultInput: { array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1], extra: { startIndex: 2 } },
}
