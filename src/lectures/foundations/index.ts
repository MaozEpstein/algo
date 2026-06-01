import type { LectureModule } from '@/engine/types'
import FoundationsExplainer from './FoundationsExplainer'

/**
 * Lecture 1 — Introduction & Foundations. Concept-heavy, so it's an "explainer"
 * lecture (4 tabs): intro, pseudocode, complexity & asymptotic notation (the
 * heart — with an interactive growth-rate chart), and Insertion Sort (an
 * embedded guided visualization). number 1 → first on Home.
 */
export const foundationsLecture: LectureModule = {
  id: 'foundations',
  number: 1,
  titleHe: 'מבוא ויסודות',
  subtitleEn: 'Introduction',
  views: [],
  algorithms: [],
  summary: FoundationsExplainer,
  explainer: true,
}
