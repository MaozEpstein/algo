/** A subtle per-lesson colour palette. Each lesson (the integer part of its `number`, so all
 *  parts of one lesson share a hue) maps to one entry; the list cycles for courses with many
 *  lessons. Tints are intentionally faint — just enough to tell lessons apart at a glance.
 *  Class strings are literal so Tailwind keeps them. Shared by CourseHome (cards) + the list view. */
export const PALETTE = [
  { card: 'border-sky-200 bg-gradient-to-br from-sky-50/60 to-white hover:border-sky-300', circle: 'bg-sky-100', label: 'text-sky-500', cta: 'text-sky-600', row: 'hover:bg-sky-50/70', border: 'border-sky-200', hoverBorder: 'hover:border-sky-300', grad: 'from-sky-50/50', bar: 'bg-sky-300', ring: 'ring-sky-200' },
  { card: 'border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white hover:border-emerald-300', circle: 'bg-emerald-100', label: 'text-emerald-500', cta: 'text-emerald-600', row: 'hover:bg-emerald-50/70', border: 'border-emerald-200', hoverBorder: 'hover:border-emerald-300', grad: 'from-emerald-50/50', bar: 'bg-emerald-300', ring: 'ring-emerald-200' },
  { card: 'border-amber-200 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-300', circle: 'bg-amber-100', label: 'text-amber-500', cta: 'text-amber-600', row: 'hover:bg-amber-50/70', border: 'border-amber-200', hoverBorder: 'hover:border-amber-300', grad: 'from-amber-50/50', bar: 'bg-amber-300', ring: 'ring-amber-200' },
  { card: 'border-rose-200 bg-gradient-to-br from-rose-50/60 to-white hover:border-rose-300', circle: 'bg-rose-100', label: 'text-rose-500', cta: 'text-rose-600', row: 'hover:bg-rose-50/70', border: 'border-rose-200', hoverBorder: 'hover:border-rose-300', grad: 'from-rose-50/50', bar: 'bg-rose-300', ring: 'ring-rose-200' },
  { card: 'border-teal-200 bg-gradient-to-br from-teal-50/60 to-white hover:border-teal-300', circle: 'bg-teal-100', label: 'text-teal-500', cta: 'text-teal-600', row: 'hover:bg-teal-50/70', border: 'border-teal-200', hoverBorder: 'hover:border-teal-300', grad: 'from-teal-50/50', bar: 'bg-teal-300', ring: 'ring-teal-200' },
  { card: 'border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-white hover:border-indigo-300', circle: 'bg-indigo-100', label: 'text-indigo-500', cta: 'text-indigo-600', row: 'hover:bg-indigo-50/70', border: 'border-indigo-200', hoverBorder: 'hover:border-indigo-300', grad: 'from-indigo-50/50', bar: 'bg-indigo-300', ring: 'ring-indigo-200' },
  { card: 'border-fuchsia-200 bg-gradient-to-br from-fuchsia-50/60 to-white hover:border-fuchsia-300', circle: 'bg-fuchsia-100', label: 'text-fuchsia-500', cta: 'text-fuchsia-600', row: 'hover:bg-fuchsia-50/70', border: 'border-fuchsia-200', hoverBorder: 'hover:border-fuchsia-300', grad: 'from-fuchsia-50/50', bar: 'bg-fuchsia-300', ring: 'ring-fuchsia-200' },
  { card: 'border-cyan-200 bg-gradient-to-br from-cyan-50/60 to-white hover:border-cyan-300', circle: 'bg-cyan-100', label: 'text-cyan-500', cta: 'text-cyan-600', row: 'hover:bg-cyan-50/70', border: 'border-cyan-200', hoverBorder: 'hover:border-cyan-300', grad: 'from-cyan-50/50', bar: 'bg-cyan-300', ring: 'ring-cyan-200' },
] as const

export type Palette = (typeof PALETTE)[number]

export const paletteFor = (n: number): Palette => PALETTE[(Math.max(1, Math.floor(n)) - 1) % PALETTE.length]
