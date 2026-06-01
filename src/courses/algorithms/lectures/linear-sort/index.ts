import type { LectureModule } from '@/core/engine/types'
import LinearSortExplainer from './LinearSortExplainer'

/**
 * Lecture 8 — Linear-Time Sorting. (There is no Lecture 6 in the course; the
 * numbering jumps 5 → 7 → 8.) An "explainer" lecture with five tabs: the
 * Ω(n log n) lower bound for comparison sorts (decision tree), then three
 * non-comparison sorts — Counting, Radix, Bucket — each an embedded guided
 * visualization, plus a comparison summary.
 */
export const linearSortLecture: LectureModule = {
  id: 'linear-sort',
  number: 8,
  titleHe: 'מיון בזמן לינארי',
  subtitleEn: 'Linear-Time Sorting',
  views: [],
  algorithms: [],
  summary: LinearSortExplainer,
  explainer: true,
}
