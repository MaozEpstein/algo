import type { LectureModule } from '@/engine/types'
import { heapsortLecture } from '@/lectures/heapsort'
import { quickSortLecture } from '@/lectures/quicksort'
import { selectionLecture } from '@/lectures/selection'

/** The single wiring point. Adding a lecture = import it and add it here. */
export const LECTURES: Record<string, LectureModule> = {
  [heapsortLecture.id]: heapsortLecture,
  [quickSortLecture.id]: quickSortLecture,
  [selectionLecture.id]: selectionLecture,
}

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
