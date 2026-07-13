import type { LectureModule } from '@/core/engine/types'
import { overviewLecture } from './lectures/overview'
import { randomVariablesLecture } from './lectures/random-variables'
import { momentsLecture } from './lectures/moments'
import { functionsLecture } from './lectures/functions-of-rvs'
import { mvnLecture } from './lectures/multivariate-normal'
import { hypothesisLecture } from './lectures/hypothesis-testing'
import { mleLecture } from './lectures/maximum-likelihood'
import { lsLecture } from './lectures/least-squares'
import { bayesLecture } from './lectures/bayesian-statistics'
import { linBayesLecture } from './lectures/linear-bayesian-estimation'
import { randomProcessLecture } from './lectures/random-processes'

/** The single wiring point for the statistics course. Adding a lecture =
 *  import it and add it here (one line per lesson), exactly as the
 *  semiconductors course does. */
export const LECTURES: Record<string, LectureModule> = {
  [overviewLecture.id]: overviewLecture,
  [randomVariablesLecture.id]: randomVariablesLecture,
  [momentsLecture.id]: momentsLecture,
  [functionsLecture.id]: functionsLecture,
  [mvnLecture.id]: mvnLecture,
  [hypothesisLecture.id]: hypothesisLecture,
  [mleLecture.id]: mleLecture,
  [lsLecture.id]: lsLecture,
  [bayesLecture.id]: bayesLecture,
  [linBayesLecture.id]: linBayesLecture,
  [randomProcessLecture.id]: randomProcessLecture,
}

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
