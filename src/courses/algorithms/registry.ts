import type { LectureModule } from '@/core/engine/types'
import { deriveAlgorithmSteps } from './steps'
import { heapsortLecture } from '@/courses/algorithms/lectures/heapsort'
import { quickSortLecture } from '@/courses/algorithms/lectures/quicksort'
import { selectionLecture } from '@/courses/algorithms/lectures/selection'
import { recurrencesLecture } from '@/courses/algorithms/lectures/recurrences'
import { divideAndConquerLecture } from '@/courses/algorithms/lectures/divide-and-conquer'
import { recursionLecture } from '@/courses/algorithms/lectures/recursion'
import { foundationsLecture } from '@/courses/algorithms/lectures/foundations'
import { linearSortLecture } from '@/courses/algorithms/lectures/linear-sort'
import { elementaryDataStructuresLecture } from '@/courses/algorithms/lectures/elementary-data-structures'
import { binarySearchTreeLecture } from '@/courses/algorithms/lectures/binary-search-tree'
import { redBlackTreeLecture } from '@/courses/algorithms/lectures/red-black-tree'
import { orderStatisticTreeLecture } from '@/courses/algorithms/lectures/order-statistic-tree'
import { lcsLecture } from '@/courses/algorithms/lectures/lcs'

/** The single wiring point. Adding a lecture = import it and add it here. */
export const LECTURES: Record<string, LectureModule> = {
  [foundationsLecture.id]: foundationsLecture,
  [recursionLecture.id]: recursionLecture,
  [divideAndConquerLecture.id]: divideAndConquerLecture,
  [recurrencesLecture.id]: recurrencesLecture,
  [heapsortLecture.id]: heapsortLecture,
  [quickSortLecture.id]: quickSortLecture,
  [selectionLecture.id]: selectionLecture,
  [linearSortLecture.id]: linearSortLecture,
  [elementaryDataStructuresLecture.id]: elementaryDataStructuresLecture,
  [binarySearchTreeLecture.id]: binarySearchTreeLecture,
  [redBlackTreeLecture.id]: redBlackTreeLecture,
  [orderStatisticTreeLecture.id]: orderStatisticTreeLecture,
  [lcsLecture.id]: lcsLecture,
}

// The guided StepTimeline derivation is course-wide (keys off algorithm
// codeBlock names) — attach it to every lecture here, the single wiring point.
// Harmless on explainer lectures (no guided player consumes it).
for (const lecture of Object.values(LECTURES)) lecture.deriveSteps = deriveAlgorithmSteps

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
