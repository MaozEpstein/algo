import type { Highlight, HighlightRole } from '@/engine/types'

/** When a slot carries several roles, the most salient one wins. */
const ROLE_PRIORITY: HighlightRole[] = [
  'swapping',
  'largest',
  'comparing',
  'inserted',
  'extracted',
  'current',
  'path',
  'sorted',
]

export interface RoleStyle {
  /** Outline / ring color. */
  ring: string
  /** Node fill. */
  fill: string
  /** Text color. */
  text: string
  /** Soft glow color (with alpha). */
  glow: string
  labelHe: string
}

const NEUTRAL: RoleStyle = {
  ring: '#cbd5e1',
  fill: '#f8fafc',
  text: '#0f172a',
  glow: 'rgba(0,0,0,0)',
  labelHe: '',
}

const STYLES: Record<HighlightRole, RoleStyle> = {
  comparing: { ring: '#f59e0b', fill: '#fffbeb', text: '#78350f', glow: 'rgba(245,158,11,0.45)', labelHe: 'משווים' },
  largest: { ring: '#a855f7', fill: '#faf5ff', text: '#581c87', glow: 'rgba(168,85,247,0.45)', labelHe: 'largest' },
  swapping: { ring: '#fb7185', fill: '#fff1f2', text: '#881337', glow: 'rgba(251,113,133,0.5)', labelHe: 'מחליפים' },
  current: { ring: '#38bdf8', fill: '#f0f9ff', text: '#0c4a6e', glow: 'rgba(56,189,248,0.45)', labelHe: 'הצומת הנוכחי' },
  sorted: { ring: '#34d399', fill: '#ecfdf5', text: '#065f46', glow: 'rgba(52,211,153,0.35)', labelHe: 'ממוין' },
  inserted: { ring: '#22d3ee', fill: '#ecfeff', text: '#155e75', glow: 'rgba(34,211,238,0.45)', labelHe: 'הוכנס' },
  extracted: { ring: '#fb7185', fill: '#fff1f2', text: '#881337', glow: 'rgba(251,113,133,0.5)', labelHe: 'נשלף' },
  path: { ring: '#818cf8', fill: '#eef2ff', text: '#3730a3', glow: 'rgba(129,140,248,0.35)', labelHe: 'מסלול' },
  heapBoundary: { ring: '#64748b', fill: '#f1f5f9', text: '#334155', glow: 'rgba(100,116,139,0.3)', labelHe: 'גבול הערימה' },
}

/** Highest-priority role present at a 1-indexed slot, or null. */
export function roleForIndex(
  highlights: readonly Highlight[],
  index: number,
): HighlightRole | null {
  let best: HighlightRole | null = null
  let bestRank = Infinity
  for (const h of highlights) {
    if (!h.indices.includes(index)) continue
    const rank = ROLE_PRIORITY.indexOf(h.role)
    if (rank !== -1 && rank < bestRank) {
      bestRank = rank
      best = h.role
    }
  }
  return best
}

export function styleForRole(role: HighlightRole | null): RoleStyle {
  return role ? STYLES[role] : NEUTRAL
}

export { STYLES as roleStyles }
