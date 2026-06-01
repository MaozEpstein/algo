import type { LectureModule } from '@/core/engine/types'
import { pnJunctionEqLecture } from '@/courses/semiconductors/lectures/pn-junction-equilibrium'

/** The single wiring point for the semiconductors course. Adding a lecture =
 *  import it and add it here. */
export const LECTURES: Record<string, LectureModule> = {
  [pnJunctionEqLecture.id]: pnJunctionEqLecture,
}

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
