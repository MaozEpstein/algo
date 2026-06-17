import type { LectureModule } from '@/core/engine/types'
import { mergeSortSpec } from './algorithms/mergeSort'
import { mergeSpec } from './algorithms/merge'
import { hanoiSpec } from './algorithms/hanoi'
import DivideConquerSummary from './content/summary'

/**
 * Lecture 3 · Part A — recursive algorithms (Merge-Sort & Towers of Hanoi).
 * A frame-engine lecture, but each algorithm carries its own `views`/`customViz`:
 * Merge-Sort and Hanoi both render bespoke custom views (recursion tree + merge
 * lanes; 3 pegs). `number: 3.1` orders it before 3ב (3.2).
 */
export const divideAndConquerLecture: LectureModule = {
  id: 'divide-and-conquer',
  number: 3.1,
  numberLabelHe: '3 · חלק א׳',
  lessonHe: 'אלגוריתמים רקורסיביים ונוסחאות נסיגה',
  titleHe: 'אלגוריתמים רקורסיביים',
  subtitleEn: 'Merge-Sort & Hanoi',
  views: ['array'],
  algorithms: [mergeSortSpec, mergeSpec, hanoiSpec],
  summary: DivideConquerSummary,
}
