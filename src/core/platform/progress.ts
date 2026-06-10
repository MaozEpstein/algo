import { createPersistentStore } from './persistentStore'

/** Per-lecture learning status (absent = not started). */
export type Status = 'learning' | 'done' | 'review'

export type ProgressMap = Record<string, Record<string, Status>> // courseId → lectureId → status

/** Cycle order on a card-badge click: not-started → learning → done → review → not-started. */
const CYCLE: (Status | undefined)[] = [undefined, 'learning', 'done', 'review']
export function cycleStatus(s: Status | undefined): Status | undefined {
  const i = CYCLE.indexOf(s ?? undefined)
  return CYCLE[(i + 1) % CYCLE.length]
}

/** Count how many of the given lectures are marked 'done'. Pure — tested. */
export function summarize(map: Record<string, Status> | undefined, lectureIds: string[]): { done: number; total: number } {
  const m = map ?? {}
  return { done: lectureIds.filter((id) => m[id] === 'done').length, total: lectureIds.length }
}

export const STATUS_META: Record<Status, { he: string; icon: string; ring: string; chip: string }> = {
  learning: { he: 'בלמידה', icon: '◐', ring: 'ring-amber-300', chip: 'bg-amber-100 text-amber-700' },
  done: { he: 'נלמד', icon: '✓', ring: 'ring-emerald-300', chip: 'bg-emerald-100 text-emerald-700' },
  review: { he: 'לחזרה', icon: '↻', ring: 'ring-sky-300', chip: 'bg-sky-100 text-sky-700' },
}

export const progressStore = createPersistentStore<ProgressMap>('hb:progress:v1', {})

/** React hook: the status map for one course + a setter. */
export function useProgress(courseId: string) {
  const map = progressStore.useValue((m) => m[courseId])
  return {
    map: map ?? {},
    get(lectureId: string): Status | undefined {
      return map?.[lectureId]
    },
    set(lectureId: string, status: Status | undefined) {
      progressStore.set((all) => {
        const course = { ...(all[courseId] ?? {}) }
        if (status) course[lectureId] = status
        else delete course[lectureId]
        return { ...all, [courseId]: course }
      })
    },
  }
}
