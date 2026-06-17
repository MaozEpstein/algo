import { createPersistentStore } from './persistentStore'

/**
 * Per-course expanded-lesson state for the course-home list view. Maps courseId → the lesson
 * numbers (the integer `Math.floor(number)`) the user has opened. Empty = everything collapsed
 * (the default). Persisted across reloads and synced across tabs.
 */
type ExpandMap = Record<string, number[]>

const EMPTY: number[] = []
const store = createPersistentStore<ExpandMap>('hb:lessonExpand:v1', {})

/** The expanded (open) lesson numbers for a course (stable reference; re-renders on change). */
export function useExpandedLessons(courseId: string): number[] {
  return store.useValue((m) => m[courseId] ?? EMPTY)
}

/** Toggle a lesson's open/closed state for a course. */
export function toggleLessonExpand(courseId: string, n: number): void {
  store.set((m) => {
    const cur = m[courseId] ?? []
    const next = cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]
    return { ...m, [courseId]: next }
  })
}
