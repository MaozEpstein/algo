import { useSyncExternalStore } from 'react'

/**
 * A tiny localStorage-backed external store with a React hook. Survives reloads, syncs across tabs
 * (via the `storage` event), and degrades gracefully where `localStorage` is unavailable (SSR/tests).
 * Used for user settings (feature flags) and learning progress — no backend.
 */
export interface PersistentStore<T> {
  get(): T
  set(next: T | ((prev: T) => T)): void
  subscribe(cb: () => void): () => void
  /** React hook: re-renders on change. Optional selector for a derived slice. */
  useValue<S = T>(selector?: (v: T) => S): S
}

const hasLS = typeof localStorage !== 'undefined'

export function createPersistentStore<T>(key: string, initial: T): PersistentStore<T> {
  let value: T = read()
  const listeners = new Set<() => void>()

  function read(): T {
    if (!hasLS) return initial
    try {
      const raw = localStorage.getItem(key)
      return raw == null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  }

  function emit() {
    for (const cb of listeners) cb()
  }

  if (hasLS) {
    window.addEventListener('storage', (e) => {
      if (e.key === key) {
        value = read()
        emit()
      }
    })
  }

  return {
    get: () => value,
    set(next) {
      value = typeof next === 'function' ? (next as (p: T) => T)(value) : next
      if (hasLS) {
        try {
          localStorage.setItem(key, JSON.stringify(value))
        } catch {
          /* ignore quota/serialization errors */
        }
      }
      emit()
    },
    subscribe(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    useValue<S = T>(selector?: (v: T) => S): S {
      const sel = selector ?? ((v: T) => v as unknown as S)
      return useSyncExternalStore(
        (cb) => this.subscribe(cb),
        () => sel(value),
        () => sel(initial),
      )
    },
  }
}
