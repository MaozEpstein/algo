import type { LearningMode } from '@/core/engine/types'

/**
 * The single source of truth for in-app URLs. Use these everywhere instead of
 * hardcoding paths, so the route scheme (`/c/<course>/lecture/<id>/...`) can
 * evolve in one place.
 */
export const pickerPath = () => '/'
export const coursePath = (courseId: string) => `/c/${courseId}`
export const overviewPath = (courseId: string) => `/c/${courseId}/overview`

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
