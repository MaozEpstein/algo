import type { ExamEntry } from '@/core/platform/types'

/**
 * Past-exam bank for the statistics course (67653). The source PDFs live in
 * `public/docs/exams/statistics/` with ASCII slugs; each exam has a separate
 * exam and solution file. Newest first. Single source of truth for the gallery
 * (ExamsBank) and the full-screen viewer (ExamViewer).
 */
const exam = (year: number, moed: ExamEntry['moed'], moedHe: string): ExamEntry => ({
  id: `${year}-moed-${moed}`,
  year,
  moed,
  titleHe: `מבחן סוף · ${year} · מועד ${moedHe}`,
  examFile: `${year}-moed-${moed}.pdf`,
  solutionFile: `${year}-moed-${moed}-sol.pdf`,
})

export const statisticsExams: ExamEntry[] = [
  exam(2025, 'a', 'א׳'),
  exam(2025, 'b', 'ב׳'),
  exam(2024, 'a', 'א׳'),
  exam(2024, 'b', 'ב׳'),
  exam(2023, 'a', 'א׳'),
  exam(2023, 'b', 'ב׳'),
  exam(2022, 'a', 'א׳'),
  exam(2022, 'b', 'ב׳'),
  exam(2022, 'c', 'ג׳'),
  exam(2021, 'a', 'א׳'),
  exam(2021, 'b', 'ב׳'),
  exam(2021, 's', 'מיוחד'),
  exam(2020, 'a', 'א׳'),
  exam(2020, 'b', 'ב׳'),
]
