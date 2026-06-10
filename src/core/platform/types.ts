import type { ComponentType } from 'react'
import type { LectureModule } from '@/core/engine/types'

/**
 * Lightweight, eagerly-loaded metadata for a course — drives the course picker
 * menu without pulling in the course's (heavy) lectures. Keep this free of any
 * React/lecture imports so it stays cheap.
 */
export interface CourseManifest {
  id: string
  titleHe: string
  subtitleEn: string
  /** Tailwind colour family for the course's accent (e.g. 'sky', 'violet'). */
  accent: string
}

/**
 * The full course payload, loaded lazily (one chunk per course). Resolved by the
 * CourseProvider and consumed by CourseHome / LectureShell / the overview page.
 */
export interface CourseModule {
  manifest: CourseManifest
  LECTURES: Record<string, LectureModule>
  LECTURE_LIST: LectureModule[]
  /** Optional cross-lecture overview page (e.g. the sorting comparison + race). */
  Overview?: ComponentType
  /** Optional course-wide reference (e.g. the formula sheet) — a self-contained
   *  modal mounted once per course (by CourseProvider) so it can be opened from
   *  anywhere via the keyboard shortcut or the OPEN_FORMULA_SHEET window event. */
  formulaSheet?: ComponentType
  /** Optional course roadmap (syllabus) — a self-contained button+modal shown on
   *  the course home next to the formula-sheet button. */
  syllabus?: ComponentType
}

/**
 * Window event that opens the course formula-sheet modal. The (course-provided)
 * formulaSheet component listens for it; CourseHome's button dispatches it. Using
 * an event keeps CourseHome (core) decoupled from the course-specific modal while
 * still letting both the button and the global keyboard shortcut open the same one.
 */
export const OPEN_FORMULA_SHEET = 'app:open-formula-sheet'

/** Window event: open the course-wide quick-search modal (Ctrl+Shift+F or the header button). */
export const OPEN_COURSE_SEARCH = 'app:open-course-search'
