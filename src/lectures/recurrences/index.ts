import type { LectureModule } from '@/engine/types'
import RecurrencesExplainer from './RecurrencesExplainer'

/**
 * Lecture 3 · Part B — Recurrence Relations (נוסחאות נסיגה).
 *
 * This is an "explainer" lecture, not a runnable algorithm: it has no frame
 * engine and no guided player. The shell renders `summary` as the whole page
 * (its own four tabs). See LectureModule.explainer in engine/types.ts.
 *
 * `number: 3.2` orders it before Heapsort (4) on the home grid; `numberLabelHe`
 * is what users actually see ("3 · חלק ב׳").
 */
export const recurrencesLecture: LectureModule = {
  id: 'recurrences',
  number: 3.2,
  numberLabelHe: '3 · חלק ב׳',
  titleHe: 'נוסחאות נסיגה',
  subtitleEn: 'Recurrence Relations',
  views: [],
  algorithms: [],
  summary: RecurrencesExplainer,
  explainer: true,
}
