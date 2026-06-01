import type { LectureModule } from '@/engine/types'
import { factorialSpec } from './algorithms/factorial'
import { powerSpec } from './algorithms/power'
import { multSpec } from './algorithms/mult'
import { sumSpec } from './algorithms/sum'
import { countDownSpec } from './algorithms/countDown'
import { listLenSpec } from './algorithms/listLen'
import RecursionSummary from './content/summary'

/**
 * Lecture 2 — Recursion. Not array algorithms: each recursive function renders a
 * bespoke **call-stack** custom view (RecursionView), teaching base/general case
 * and the LIFO stack behind the scenes. number 2 → ordered first on Home.
 */
export const recursionLecture: LectureModule = {
  id: 'recursion',
  number: 2,
  titleHe: 'רקורסיה',
  subtitleEn: 'Recursion',
  views: ['custom'],
  algorithms: [factorialSpec, powerSpec, multSpec, sumSpec, countDownSpec, listLenSpec],
  summary: RecursionSummary,
}
