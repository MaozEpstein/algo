import { createPersistentStore } from './persistentStore'

export type TextScale = 'sm' | 'base' | 'lg' | 'xl'
export type Density = 'comfortable' | 'compact'
export type FontPref = 'default' | 'assistant' | 'rubik' | 'serif'

export interface Prefs {
  textScale: TextScale
  density: Density
  reduceMotion: boolean
  font: FontPref
}

const DEFAULT: Prefs = { textScale: 'base', density: 'comfortable', reduceMotion: false, font: 'default' }

/** Root font-size percentage per text-scale (rem-based → scales the whole UI). */
export const TEXT_SCALE_PCT: Record<TextScale, number> = { sm: 92, base: 100, lg: 112, xl: 125 }
export const TEXT_SCALE_HE: Record<TextScale, string> = { sm: 'קטן', base: 'רגיל', lg: 'גדול', xl: 'גדול מאוד' }
export const DENSITY_HE: Record<Density, string> = { comfortable: 'מרווח', compact: 'צפוף' }
export const FONT_HE: Record<FontPref, string> = { default: 'ברירת מחדל', assistant: 'אסיסטנט', rubik: 'רוביק', serif: 'סריף' }

export const prefsStore = createPersistentStore<Prefs>('hb:prefs:v1', DEFAULT)

export const usePrefs = () => prefsStore.useValue()
export function setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
  prefsStore.set((p) => ({ ...DEFAULT, ...p, [k]: v }))
}
