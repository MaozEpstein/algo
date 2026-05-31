import type { LectureModule } from '@/engine/types'
import { maxHeapifySpec } from './algorithms/maxHeapify'
import { buildMaxHeapSpec } from './algorithms/buildMaxHeap'
import { heapSortSpec } from './algorithms/heapSort'
import {
  heapExtractMaxSpec,
  heapInsertSpec,
  heapMaximumSpec,
} from './algorithms/priorityQueue'
import HeapsortSummary from './content/summary'

/**
 * Lecture 4 — Heapsort. Priority-queue ops are added in their milestone
 * (same module shape).
 */
export const heapsortLecture: LectureModule = {
  id: 'heapsort',
  number: 4,
  titleHe: 'מיון ערימה',
  subtitleEn: 'Heapsort',
  views: ['tree', 'array'],
  algorithms: [
    maxHeapifySpec,
    buildMaxHeapSpec,
    heapSortSpec,
    heapInsertSpec,
    heapMaximumSpec,
    heapExtractMaxSpec,
  ],
  summary: HeapsortSummary,
}
