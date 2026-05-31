import type { LectureModule } from '@/engine/types'
import { heapsortLecture } from '@/lectures/heapsort'
import { quickSortLecture } from '@/lectures/quicksort'

/** The single wiring point. Adding a lecture = import it and add it here. */
export const LECTURES: Record<string, LectureModule> = {
  [heapsortLecture.id]: heapsortLecture,
  [quickSortLecture.id]: quickSortLecture,
}

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
