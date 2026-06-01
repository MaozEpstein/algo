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
}
