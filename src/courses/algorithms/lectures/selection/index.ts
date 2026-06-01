import type { LectureModule } from '@/core/engine/types'
import { minMaxSpec } from './algorithms/minMax'
import { randomizedSelectSpec } from './algorithms/randomizedSelect'
import { selectSpec } from './algorithms/select'
import SelectionSummary from './content/summary'

/** Lecture 7 — Order Statistics / Selection. Array-only view. */
export const selectionLecture: LectureModule = {
  id: 'selection',
  number: 7,
  titleHe: 'ערכי מיקום',
  subtitleEn: 'Selection',
  views: ['array'],
  algorithms: [minMaxSpec, randomizedSelectSpec, selectSpec],
  summary: SelectionSummary,
}
