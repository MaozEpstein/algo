import { FrameBuilder, hl, vv } from '@/core/engine/FrameBuilder'
import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame, Highlight, Marker } from '@/core/engine/types'
import { minMaxBlock } from '../pseudocode'

/** Min & Max together, pairwise — ~3 comparisons per 2 elements (3n/2). */
export function runMinMax(input: AlgorithmInput): Frame[] {
  const b = new FrameBuilder(input.array)
  const n = b.length
  const A = (k: number) => b.value(k)
  let mn = 1
  let mx = 1

  const emit = (
    codeLine: number | null,
    narration: string,
    opts: { compare?: [number, number]; action?: Parameters<FrameBuilder['emit']>[0]['action'] } = {},
  ) => {
    const highlights: Highlight[] = [hl('less', mn), hl('greater', mx)]
    if (opts.compare) highlights.push(hl('comparing', ...opts.compare))
    const markers: Marker[] = [
      { label: 'min', index: mn, tone: 'i' },
      { label: 'max', index: mx, tone: 'j' },
    ]
    const vars = [vv('min', A(mn), 'i'), vv('max', A(mx), 'j')]
    b.emit({ codeBlock: 'minMax', codeLine, narration, action: opts.action, highlights, markers, vars })
  }

  emit(2, `מאתחלים: min = max = A[1] = ${A(1)}.`)

  let i = 2
  while (i <= n) {
    if (i + 1 <= n) {
      emit(4, `זוג חדש: משווים A[${i}] = ${A(i)} מול A[${i + 1}] = ${A(i + 1)}.`, {
        compare: [i, i + 1],
        action: { kind: 'compare', a: i, b: i + 1 },
      })
      const small = A(i) <= A(i + 1) ? i : i + 1
      const large = A(i) <= A(i + 1) ? i + 1 : i
      emit(5, `הקטן בזוג: A[${small}] = ${A(small)}; הגדול: A[${large}] = ${A(large)}.`, {
        compare: [small, large],
      })
      emit(8, `משווים את הקטן ${A(small)} מול min = ${A(mn)}.`, {
        compare: [small, mn],
        action: { kind: 'compare', a: small, b: mn },
      })
      if (A(small) < A(mn)) {
        mn = small
        emit(8, `${A(mn)} קטן יותר — min מתעדכן.`)
      }
      emit(9, `משווים את הגדול ${A(large)} מול max = ${A(mx)}.`, {
        compare: [large, mx],
        action: { kind: 'compare', a: large, b: mx },
      })
      if (A(large) > A(mx)) {
        mx = large
        emit(9, `${A(mx)} גדול יותר — max מתעדכן.`)
      }
      i += 2
    } else {
      // odd leftover element
      emit(8, `איבר בודד שנותר: A[${i}] = ${A(i)} — משווים ל-min ול-max.`, {
        compare: [i, mn],
        action: { kind: 'compare', a: i, b: mn },
      })
      if (A(i) < A(mn)) mn = i
      if (A(i) > A(mx)) mx = i
      i += 1
    }
  }

  emit(10, `סיום — מינימום = ${A(mn)} (אינדקס ${mn}), מקסימום = ${A(mx)} (אינדקס ${mx}).`, {
    action: { kind: 'done' },
  })
  return b.build()
}

export const minMaxSpec: AlgorithmSpec = {
  id: 'minMax',
  titleHe: 'Min-Max — מינימום ומקסימום',
  titleEn: 'Min-Max',
  kind: 'main',
  blurbHe:
    'מוצאים את האיבר הקטן ביותר ואת הגדול ביותר במעבר אחד, בזוגות: 3 השוואות לכל 2 איברים (במקום 2 השוואות לכל איבר).',
  complexity: '\\Theta(n)',
  proof: {
    result: '\\lceil 3n/2 \\rceil \\text{ השוואות}',
    claimHe: 'במקום ~2n השוואות (מינימום ומקסימום בנפרד), עיבוד בזוגות עולה רק כ-3n/2.',
    steps: [
      {
        he: 'לכל זוג: השוואה אחת בין בני-הזוג, ואז הקטן מול min והגדול מול max — סך 3 השוואות לכל 2 איברים.',
        tex: '3 \\cdot \\tfrac{n}{2} = \\lceil 3n/2 \\rceil',
      },
    ],
    intuitionHe: 'משווים קודם את בני-הזוג זה לזה, וכך כל איבר נבחן רק מול אחד מהקצוות (min או max), לא שניהם.',
  },
  pseudocode: [minMaxBlock],
  run: runMinMax,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 20 }),
  defaultInput: { array: [3, 7, 2, 8, 1, 9, 4, 6] },
  presets: [
    { labelHe: 'אקראי', input: { array: [3, 7, 2, 8, 1, 9, 4, 6] } },
    { labelHe: 'ממוין', input: { array: [1, 2, 3, 4, 5, 6, 7, 8] } },
    { labelHe: 'כל האיברים שווים', input: { array: [5, 5, 5, 5, 5, 5] } },
    {
      labelHe: 'רשימה ארוכה (המקרה הגרוע ביותר)',
      input: { array: [3, 7, 2, 8, 1, 9, 4, 6, 11, 5, 14, 10, 13, 12, 15, 16, 18, 17, 20, 19] },
      worst: true,
      noteHe: 'רשימה גדולה — מספר ההשוואות המרבי. (Min-Max עולה תמיד ⌈3n/2⌉, ללא תלות בסדר.)',
    },
  ],
}
