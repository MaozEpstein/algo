import { createPersistentStore } from './persistentStore'

/** A saved "to-learn" item — a structured reference (concept/formula/symbol) or a prose bullet (note). */
export type SavedKind = 'concept' | 'formula' | 'symbol' | 'note'

export interface SavedItem {
  id: string
  courseId: string
  lectureId: string
  kind: SavedKind
  /** Stable per-kind ref: term / formula name / symbol / hashed note text. */
  refId: string
  label: string
  tex?: string
  note?: string
  /** For notes: the lesson tab to deep-link back to. */
  tab?: string
  addedAt: number
}

export const makeId = (courseId: string, lectureId: string, kind: SavedKind, refId: string) => `${courseId}:${lectureId}:${kind}:${refId}`

/** Short, stable hash of a string (for note refIds). Deterministic — no Date/random. */
export function hashText(s: string): string {
  let h = 5381
  const t = s.trim().replace(/\s+/g, ' ')
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export const savedStore = createPersistentStore<Record<string, SavedItem>>('hb:saved:v1', {})

/** React hook: the saved-items map + mutators + queries. */
export function useSavedItems() {
  const items = savedStore.useValue()
  return {
    items,
    isSaved(id: string): boolean {
      return id in items
    },
    add(item: SavedItem) {
      savedStore.set((all) => (all[item.id] ? all : { ...all, [item.id]: item }))
    },
    remove(id: string) {
      savedStore.set((all) => {
        if (!all[id]) return all
        const next = { ...all }
        delete next[id]
        return next
      })
    },
    /** Add if absent, remove if present. Returns the new saved-state. */
    toggle(item: SavedItem): boolean {
      const exists = item.id in savedStore.get()
      savedStore.set((all) => {
        if (all[item.id]) {
          const next = { ...all }
          delete next[item.id]
          return next
        }
        return { ...all, [item.id]: item }
      })
      return !exists
    },
    listByCourse(courseId: string): SavedItem[] {
      return Object.values(items)
        .filter((it) => it.courseId === courseId)
        .sort((a, b) => b.addedAt - a.addedAt)
    },
  }
}
