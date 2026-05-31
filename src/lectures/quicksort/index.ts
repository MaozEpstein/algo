import type { LectureModule } from '@/engine/types'
import { hoarePartitionSpec } from './algorithms/hoarePartition'
import { quickSortSpec } from './algorithms/quickSort'
import { lomutoPartitionSpec } from './algorithms/lomutoPartition'
import { randomizedQuickSortSpec } from './algorithms/randomizedQuickSort'
import QuicksortSummary from './content/summary'

/** Lecture 5 — Quicksort. Array-only view (no tree); pointer markers show i/j/pivot. */
export const quickSortLecture: LectureModule = {
  id: 'quicksort',
  number: 5,
  titleHe: 'מיון מהיר',
  subtitleEn: 'Quicksort',
  views: ['array'],
  algorithms: [
    hoarePartitionSpec,
    quickSortSpec,
    lomutoPartitionSpec,
    randomizedQuickSortSpec,
  ],
  summary: QuicksortSummary,
}
