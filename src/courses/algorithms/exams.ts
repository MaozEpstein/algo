import type { ExamEntry } from '@/core/platform/types'

/**
 * Past-exam bank for the algorithms course. Source PDFs live in
 * `public/docs/exams/algorithms/` with ASCII slugs; each exam has a separate
 * exam and solution file. Newest first. (The 2020 מועד א׳ is the Python 76689
 * final that was filed under this course's exam folder.)
 */
export const algorithmsExams: ExamEntry[] = [
  { id: '2025-moed-a', year: 2025, moed: 'a', titleHe: 'מבחן סוף · 2025 · מועד א׳', examFile: '2025-moed-a.pdf', solutionFile: '2025-moed-a-sol.pdf' },
  { id: '2021-moed-a', year: 2021, moed: 'a', titleHe: 'מבחן סוף · 2021 · מועד א׳', examFile: '2021-moed-a.pdf', solutionFile: '2021-moed-a-sol.pdf' },
  { id: '2020-moed-a', year: 2020, moed: 'a', titleHe: 'מבחן סוף · 2020 · מועד א׳ (Python)', examFile: '2020-moed-a.pdf', solutionFile: '2020-moed-a-sol.pdf' },
]
