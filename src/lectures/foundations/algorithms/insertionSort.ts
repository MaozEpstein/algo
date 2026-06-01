import { FrameBuilder, hl } from '@/engine/FrameBuilder'
import { rangeInclusive } from '@/engine/indexing'
import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight, Marker } from '@/engine/types'
import { insertionSortBlock } from '../pseudocode'

/**
 * Insertion Sort. The "key" element travels left via identity-preserving swaps
 * (so it animates sliding into place), comparing against its left neighbour each
 * step. Emits compare/swap actions for the cost readout. Worst case (reverse
 * input) → Θ(n²); best case (already sorted) → Θ(n).
 */
export function runInsertionSort(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const n = b.length

  const base = (sortedHi: number): Highlight[] =>
    sortedHi >= 1 ? [hl('sorted', ...rangeInclusive(1, sortedHi))] : []
  const keyMarker = (i: number): Marker[] => [{ label: 'key', index: i, tone: 'i' }]

  b.emit({
    codeBlock: 'insertionSort',
    codeLine: null,
    narration: 'מצב התחלתי. האיבר הראשון נחשב "ממוין" בפני עצמו; נכניס אליו איבר-איבר.',
    highlights: [hl('sorted', 1), hl('active', ...rangeInclusive(1, n))],
  })

  for (let j = 2; j <= n; j++) {
    b.emit({
      codeBlock: 'insertionSort',
      codeLine: 2,
      narration: `לוקחים את A[${j}] = ${b.value(j)} ומכניסים אותו לאזור הממוין משמאלו.`,
      highlights: [...base(j - 1), hl('current', j)],
      markers: keyMarker(j),
    })

    let i = j
    while (i > 1) {
      const cmp = b.value(i - 1) > b.value(i)
      b.emit({
        codeBlock: 'insertionSort',
        codeLine: 6,
        action: { kind: 'compare', a: b.value(i - 1), b: b.value(i) },
        narration: cmp
          ? `${b.value(i - 1)} > ${b.value(i)} — מזיזים שמאלה.`
          : `${b.value(i - 1)} ≤ ${b.value(i)} — המקום נמצא, עוצרים.`,
        highlights: [...base(j - 1), hl('comparing', i - 1, i)],
        markers: keyMarker(i),
      })
      if (!cmp) break
      b.swap(i - 1, i)
      i -= 1
      b.emit({
        codeBlock: 'insertionSort',
        codeLine: 7,
        action: { kind: 'swap', a: i, b: i + 1 },
        narration: `המפתח מחליק שמאלה למקום ${i}.`,
        highlights: [...base(j - 1), hl('swapping', i, i + 1)],
        markers: keyMarker(i),
      })
    }

    b.emit({
      codeBlock: 'insertionSort',
      codeLine: 9,
      narration: `A[1..${j}] ממוין כעת.`,
      highlights: [hl('sorted', ...rangeInclusive(1, j))],
      markers: keyMarker(i),
    })
  }

  b.emit({
    codeBlock: 'insertionSort',
    codeLine: null,
    action: { kind: 'done' },
    narration: 'סיום — המערך ממוין בסדר עולה! 🎉',
    highlights: [hl('sorted', ...rangeInclusive(1, n))],
  })
  return b.build()
}

/**
 * A lightweight spec — used only to feed the complexity-proof modal in the
 * insertion-sort tab. The lecture itself is an explainer (algorithms: []), so
 * this is NOT registered as a guided/sandbox algorithm.
 */
export const insertionSortSpec: AlgorithmSpec = {
  id: 'insertionSort',
  titleHe: 'מיון הכנסה',
  titleEn: 'InsertionSort',
  kind: 'main',
  blurbHe:
    'מיון במקום: בכל צעד מכניסים את האיבר הבא למקומו בתוך החלק הממוין שמשמאלו, תוך הזזת האיברים הגדולים ממנו ימינה.',
  complexity: 'O(n^2)',
  proof: {
    result: '\\Theta(n^2)',
    claimHe: 'במקרה הגרוע (קלט ממוין הפוך) מיון הכנסה רץ ב-Θ(n²); במקרה הטוב (קלט ממוין) ב-Θ(n).',
    steps: [
      {
        he: 'הלולאה החיצונית רצה על כל האיברים j = 2..n — סדר גודל של n איטרציות, כל אחת בוחרת מפתח key = A[j].',
        tex: 'j = 2,\\dots,n',
      },
      {
        he: 'באיטרציה j הלולאה הפנימית מזיזה את המפתח שמאלה כל עוד השכן גדול ממנו — לכל היותר j−1 השוואות והזזות.',
        tex: 't_j \\le j-1',
      },
      {
        he: 'המקרה הגרוע — קלט ממוין הפוך: כל מפתח חולף על פני כל קודמיו, כלומר t_j = j−1. סוכמים על כל האיטרציות:',
        tex: '\\sum_{j=2}^{n}(j-1) = \\frac{n(n-1)}{2} = \\Theta(n^2)',
      },
      {
        he: 'המקרה הטוב — קלט ממוין: ההשוואה הראשונה נכשלת מיד ואין הזזות, כלומר t_j = 1. סך הכל לינארי:',
        tex: '\\sum_{j=2}^{n} 1 = n-1 = \\Theta(n)',
      },
    ],
    intuitionHe:
      'כל איבר "מחליק" שמאלה עד מקומו. בקלט הפוך כל איבר עובר על פני כולם → ריבועי; בקלט ממוין אף איבר לא זז → לינארי.',
  },
  pseudocode: [insertionSortBlock],
  run: runInsertionSort,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 12 }),
  defaultInput: { array: [5, 3, 8, 4, 1, 7] },
}
