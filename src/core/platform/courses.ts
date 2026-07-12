import type { CourseManifest, CourseModule } from './types'

/**
 * The platform's course registry. `COURSES` is eager, lightweight metadata for
 * the picker menu. `COURSE_LOADERS` lazily imports each course's full module as
 * a separate chunk (so the bundle stays fast as courses are added). Adding a
 * course = add a manifest entry + a loader entry; never statically import a
 * course module here, or the code-split is defeated.
 */
export const COURSES: CourseManifest[] = [
  {
    id: 'algorithms',
    titleHe: 'מבני נתונים ומבוא לאלגוריתמים',
    subtitleEn: 'Data Structures & Algorithms',
    accent: 'sky',
  },
  {
    id: 'semiconductors',
    titleHe: 'התקנים של מוליכים למחצה',
    subtitleEn: 'Semiconductor Devices',
    accent: 'violet',
  },
  {
    id: 'statistics',
    titleHe: 'שיטות סטטיסטיות בהנדסה ומדעי המחשב',
    subtitleEn: 'Statistical Methods in Engineering and Computer Science',
    accent: 'emerald',
  },
]

export const COURSE_LOADERS: Record<string, () => Promise<{ default: CourseModule }>> = {
  algorithms: () => import('@/courses/algorithms'),
  semiconductors: () => import('@/courses/semiconductors'),
  statistics: () => import('@/courses/statistics'),
}

export const getManifest = (id: string): CourseManifest | undefined =>
  COURSES.find((c) => c.id === id)

export const hasCourse = (id: string): boolean => id in COURSE_LOADERS
