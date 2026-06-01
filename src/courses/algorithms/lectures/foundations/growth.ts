/** Pure growth-rate functions for the asymptotic-notation chart. No React. */

export interface GrowthFn {
  key: string
  /** LaTeX-free label for the legend/chips. */
  label: string
  color: string
  fn: (n: number) => number
}

const log2 = (n: number) => Math.log2(Math.max(n, 1))

/** The classic complexity classes, slowest-growing first. */
export const GROWTH_FNS: GrowthFn[] = [
  { key: 'const', label: '1', color: '#94a3b8', fn: () => 1 },
  { key: 'log', label: 'log n', color: '#34d399', fn: (n) => log2(n) },
  { key: 'lin', label: 'n', color: '#38bdf8', fn: (n) => n },
  { key: 'nlogn', label: 'n log n', color: '#a855f7', fn: (n) => n * log2(n) },
  { key: 'quad', label: 'n²', color: '#f59e0b', fn: (n) => n * n },
  { key: 'exp', label: '2ⁿ', color: '#fb7185', fn: (n) => 2 ** n },
]

/** Sample a function over n = 1..nMax (integer steps). */
export function sample(fn: (n: number) => number, nMax: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  for (let n = 1; n <= nMax; n++) pts.push({ x: n, y: fn(n) })
  return pts
}

/** Format a (possibly huge) value compactly for the n-cursor readout. */
export function fmtValue(v: number): string {
  if (v < 1000) return Number.isInteger(v) ? String(v) : v.toFixed(1)
  if (v < 1e6) return `${(v / 1000).toFixed(v < 1e4 ? 1 : 0)}k`
  if (v < 1e9) return `${(v / 1e6).toFixed(1)}M`
  return v.toExponential(1)
}
