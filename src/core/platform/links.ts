import type { LearningMode } from '@/core/engine/types'

/**
 * The single source of truth for in-app URLs. Use these everywhere instead of
 * hardcoding paths, so the route scheme (`/c/<course>/lecture/<id>/...`) can
 * evolve in one place.
 */
export const pickerPath = () => '/'
export const coursePath = (courseId: string) => `/c/${courseId}`
export const overviewPath = (courseId: string) => `/c/${courseId}/overview`
export const savedListPath = (courseId: string) => `/c/${courseId}/saved`
/** Print/PDF view: whole course, or one lesson via `?lecture=`. */
export const printPath = (courseId: string, lectureId?: string) => `/c/${courseId}/print${lectureId ? `?lecture=${lectureId}` : ''}`
/** Exam bank gallery, and the full-screen viewer for one exam. */
export const examsPath = (courseId: string) => `/c/${courseId}/exams`
export const examViewPath = (courseId: string, examId: string) => `/c/${courseId}/exams/${examId}`
/** Full-screen viewer for a lecturer revision-question doc (lives on the exam-bank page). */
export const revisionViewPath = (courseId: string, docId: string) => `/c/${courseId}/revision/${docId}`
/**
 * Resolve a static PDF under public/docs/<kind>/<courseId>/ to a URL that works
 * under any deploy base (Vercel root or GitHub Pages subpath) via Vite's BASE_URL.
 */
export const docAssetUrl = (kind: 'exams' | 'revision', courseId: string, file: string) =>
  `${import.meta.env.BASE_URL}docs/${kind}/${courseId}/${file}`.replace(/([^:])\/\//g, '$1/')
export const examAssetUrl = (courseId: string, file: string) => docAssetUrl('exams', courseId, file)
export const revisionAssetUrl = (courseId: string, file: string) => docAssetUrl('revision', courseId, file)

export function lecturePath(
  courseId: string,
  lectureId: string,
  opt?: { mode?: LearningMode; tab?: string; algo?: string },
): string {
  let path = `/c/${courseId}/lecture/${lectureId}`
  if (opt?.mode) path += `/${opt.mode}`
  if (opt?.tab) return `${path}?tab=${opt.tab}`
  if (opt?.algo) return `${path}?algo=${opt.algo}`
  return path
}
