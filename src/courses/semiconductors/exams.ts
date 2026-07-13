import type { ExamEntry } from '@/core/platform/types'

/**
 * Past-exam bank for the semiconductor-devices course. Source PDFs live in
 * `public/docs/exams/semiconductors/` with ASCII slugs. Newest first. Only the
 * 2025 exams ship with a solution PDF; the earlier ones are exam-only.
 */
export const semiconductorsExams: ExamEntry[] = [
  { id: '2025-moed-a', year: 2025, moed: 'a', titleHe: 'מבחן סוף · 2025 · מועד א׳', examFile: '2025-moed-a.pdf', solutionFile: '2025-moed-a-sol.pdf' },
  { id: '2025-moed-b', year: 2025, moed: 'b', titleHe: 'מבחן סוף · 2025 · מועד ב׳', examFile: '2025-moed-b.pdf', solutionFile: '2025-moed-b-sol.pdf' },
  { id: '2024-moed-a', year: 2024, moed: 'a', titleHe: 'מבחן סוף · 2024 · מועד א׳', examFile: '2024-moed-a.pdf' },
  { id: '2024-moed-b', year: 2024, moed: 'b', titleHe: 'מבחן סוף · 2024 · מועד ב׳', examFile: '2024-moed-b.pdf' },
  { id: '2023-moed-a', year: 2023, moed: 'a', titleHe: 'מבחן סוף · 2023 · מועד א׳', examFile: '2023-moed-a.pdf' },
  { id: '2023-moed-b', year: 2023, moed: 'b', titleHe: 'מבחן סוף · 2023 · מועד ב׳', examFile: '2023-moed-b.pdf' },
  { id: '2018-moed-b', year: 2018, moed: 'b', titleHe: 'מבחן סוף · 2018 · מועד ב׳', examFile: '2018-moed-b.pdf' },
  { id: '2017-moed-b', year: 2017, moed: 'b', titleHe: 'מבחן סוף · 2017 · מועד ב׳', examFile: '2017-moed-b.pdf' },
]
