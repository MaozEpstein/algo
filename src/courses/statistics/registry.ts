import type { LectureModule } from '@/core/engine/types'
import { overviewLecture } from './lectures/overview'
import { randomVariablesLecture } from './lectures/random-variables'

/** The single wiring point for the statistics course. Adding a lecture =
 *  import it and add it here (one line per lesson), exactly as the
 *  semiconductors course does. */
export const LECTURES: Record<string, LectureModule> = {
  [overviewLecture.id]: overviewLecture,
  [randomVariablesLecture.id]: randomVariablesLecture,
}

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
