/** The MOS-capacitor operating regimes (p-type substrate). */
export type Regime = 'flat' | 'accumulation' | 'depletion' | 'inversion'

export const REGIME_HE: Record<Regime, string> = {
  flat: 'פסים שטוחים',
  accumulation: 'הצטברות',
  depletion: 'דלדול',
  inversion: 'היפוך',
}

/** Accent palette per regime (Tailwind border/bg/text fragments). */
export const REGIME_ACCENT: Record<Regime, { border: string; bg: string; text: string }> = {
  flat: { border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-700' },
  accumulation: { border: 'border-rose-300', bg: 'bg-rose-50', text: 'text-rose-700' },
  depletion: { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-700' },
  inversion: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-700' },
}
