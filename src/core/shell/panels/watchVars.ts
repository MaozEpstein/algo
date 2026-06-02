import type { Marker, WatchVar } from '@/core/engine/types'

/** Same palette as ArrayView's marker tones — keep in sync. */
export const TONE: Record<Marker['tone'], string> = {
  pivot: '#a855f7',
  i: '#0284c7',
  j: '#f59e0b',
  bound: '#64748b',
  k: '#10b981',
}

/** Fallback tone when a WatchVar has no explicit `tone`, inferred from its name. */
const NAME_TONE: Record<string, Marker['tone']> = {
  i: 'i',
  j: 'j',
  l: 'bound',
  r: 'bound',
  p: 'bound',
  q: 'bound',
  k: 'k',
  pivot: 'pivot',
  x: 'pivot',
  key: 'pivot',
  largest: 'k',
  min: 'i',
  max: 'j',
  parent: 'bound',
  rand: 'pivot',
  depth: 'k',
  heapSize: 'bound',
  last: 'bound',
}

export const toneKey = (v: WatchVar): Marker['tone'] =>
  v.tone ?? NAME_TONE[v.name] ?? 'bound'

/** Hex (#rrggbb) → rgba string. */
export function rgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/** Derive baseline variable chips from pointer markers when no explicit `vars`. */
export function deriveFromMarkers(markers?: Marker[]): WatchVar[] {
  if (!markers) return []
  return markers.map((m) => ({
    name: m.label,
    value: m.index,
    kind: 'index' as const,
    tone: m.tone,
  }))
}

/** The variables to show for a frame: explicit `vars` win, else derive from markers. */
export function varsForFrame(frame: {
  vars?: WatchVar[]
  markers?: Marker[]
}): WatchVar[] {
  return frame.vars ?? deriveFromMarkers(frame.markers)
}
