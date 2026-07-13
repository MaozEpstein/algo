import type { RevisionDoc } from '@/core/platform/types'

/**
 * Lecturer revision / practice questions (שאלות חזרה) for the algorithms course.
 * Converted from the source Word files (in the exams folder) to PDF and served
 * from `public/docs/revision/algorithms/`. Shown as a section inside the exam bank.
 */
export const algorithmsRevision: RevisionDoc[] = [
  { id: 'revision-1', titleHe: 'שאלות חזרה לבחינה — חלק 1', file: 'revision-1.pdf' },
  { id: 'revision-2', titleHe: 'שאלות חזרה — חלק 2 (עם פתרונות)', file: 'revision-2.pdf' },
]
