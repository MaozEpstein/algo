import type { AlgorithmSpec, LectureModule } from '@/core/engine/types'
import { LECTURE_LIST } from '../registry'

export interface SortAlgo {
  spec: AlgorithmSpec
  lecture: LectureModule
}

/**
 * Every full sorting algorithm across all lectures (those with a `sortProfile`).
 * Auto-updates when a new sorting lecture is registered — drives both the
 * comparison table and the algorithm race in the Overview hub.
 */
export function sortingAlgorithms(): SortAlgo[] {
  const out: SortAlgo[] = []
  for (const lecture of LECTURE_LIST) {
    for (const spec of lecture.algorithms) {
      if (spec.sortProfile) out.push({ spec, lecture })
    }
  }
  return out
}
