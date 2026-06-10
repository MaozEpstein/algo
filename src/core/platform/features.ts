import { createPersistentStore } from './persistentStore'

/** A user-toggleable feature. `default` applies until the user overrides it in Settings. */
export interface FeatureDef {
  id: FeatureId
  titleHe: string
  descHe: string
  default: boolean
}

export type FeatureId = 'progress' | 'savedList' | 'hoverDict'

export const FEATURES: FeatureDef[] = [
  { id: 'progress', titleHe: 'מעקב התקדמות', descHe: 'סימון שיעורים כ"בלמידה / נלמד / לחזרה", פס-התקדמות בדף הקורס, וכפתור-סיום בתחתית כל שיעור.', default: true },
  { id: 'savedList', titleHe: 'רשימת הלמידה שלי', descHe: 'כפתור ＋ ליד מושגים/נוסחאות/משתנים ובולטים — לשמירה לעיון מאוחר ב"רשימת הלמידה שלי".', default: true },
  { id: 'hoverDict', titleHe: 'מילון-על-ריחוף', descHe: 'השהיית העכבר (או לחיצה ארוכה בנייד) על מונח-יסוד פותחת חלון קטן עם ההסבר שלו.', default: false },
]

const DEFAULTS: Record<FeatureId, boolean> = Object.fromEntries(FEATURES.map((f) => [f.id, f.default])) as Record<FeatureId, boolean>

/** Effective value of a feature given the stored overrides (pure — tested). */
export function isFeatureEnabled(overrides: Partial<Record<FeatureId, boolean>>, id: FeatureId): boolean {
  return overrides[id] ?? DEFAULTS[id]
}

export const settingsStore = createPersistentStore<Partial<Record<FeatureId, boolean>>>('hb:settings:v1', {})

/** React hook: is a feature currently enabled? */
export function useFeature(id: FeatureId): boolean {
  return settingsStore.useValue((o) => isFeatureEnabled(o, id))
}

/** Toggle a feature on/off in the settings store. */
export function setFeature(id: FeatureId, on: boolean): void {
  settingsStore.set((o) => ({ ...o, [id]: on }))
}
