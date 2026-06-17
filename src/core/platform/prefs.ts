import { createPersistentStore } from './persistentStore'

export type TextScale = 'sm' | 'base' | 'lg' | 'xl'
export type Density = 'comfortable' | 'compact'
export type FontPref = 'default' | 'assistant' | 'rubik' | 'serif'
export type HomeView = 'cards' | 'list'
export type ContentWidth = 'comfortable' | 'wide' | 'full'

export interface Prefs {
  textScale: TextScale
  density: Density
  reduceMotion: boolean
  font: FontPref
  homeView: HomeView
  contentWidth: ContentWidth
}

const DEFAULT: Prefs = { textScale: 'base', density: 'comfortable', reduceMotion: false, font: 'default', homeView: 'cards', contentWidth: 'wide' }

/** Root font-size percentage per text-scale (rem-based → scales the whole UI). */
export const TEXT_SCALE_PCT: Record<TextScale, number> = { sm: 92, base: 100, lg: 112, xl: 125 }
export const TEXT_SCALE_HE: Record<TextScale, string> = { sm: 'קטן', base: 'רגיל', lg: 'גדול', xl: 'גדול מאוד' }
export const DENSITY_HE: Record<Density, string> = { comfortable: 'מרווח', compact: 'צפוף' }
export const FONT_HE: Record<FontPref, string> = { default: 'ברירת מחדל', assistant: 'אסיסטנט', rubik: 'רוביק', serif: 'סריף' }
export const HOME_VIEW_HE: Record<HomeView, string> = { cards: 'כרטיסים', list: 'רשימה' }
export const CONTENT_WIDTH_HE: Record<ContentWidth, string> = { comfortable: 'רגיל', wide: 'רחב', full: 'מלא' }
/** Container max-width per level (literal classes so Tailwind keeps them). */
export const CONTENT_WIDTH_CLASS: Record<ContentWidth, string> = { comfortable: 'max-w-6xl', wide: 'max-w-7xl', full: 'max-w-screen-2xl' }

export const prefsStore = createPersistentStore<Prefs>('hb:prefs:v1', DEFAULT)

export const usePrefs = () => prefsStore.useValue()
/** The container max-width class for the chosen content-width (guards old/partial stored prefs). */
export const useContentWidthClass = () => prefsStore.useValue((p) => CONTENT_WIDTH_CLASS[p.contentWidth ?? 'wide'])
export function setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
  prefsStore.set((p) => ({ ...DEFAULT, ...p, [k]: v }))
}
