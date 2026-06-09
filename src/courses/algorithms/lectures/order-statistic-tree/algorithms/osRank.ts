import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import RbTreeView from '../../red-black-tree/views/RbTreeView'
import { emitTree, makeTracer } from '../../red-black-tree/algorithms/_trace'
import { DEFAULT_KEYS, setup, targetKey, validateKeys } from '../../red-black-tree/algorithms/_shared'
import { find, isNil } from '../../red-black-tree/rbtree'
import { osRank } from '../ostree'
import { osRankBlock } from '../pseudocode'

export function runOsRank(input: AlgorithmInput): Frame[] {
  const { b, T } = setup(input)
  const key = targetKey(input, 7)
  b.setBlock('osRank').setPhase('rank')
  emitTree(b, T, 'osRank', `נחשב את הדרגה (המיקום בסדר עולה) של המפתח ${key}.`, true)
  const x = find(T, key)
  if (isNil(T, x)) {
    emitTree(b, T, 'osRank', `המפתח ${key} אינו בעץ — אין לו דרגה.`, true)
    return b.build()
  }
  osRank(T, x, makeTracer(b, T, { showSize: true }))
  return b.build()
}

export const osRankSpec: AlgorithmSpec = {
  id: 'osRank',
  titleHe: 'דירוג מפתח — OS-Rank',
  titleEn: 'OS-Rank',
  kind: 'main',
  blurbHe:
    'מחזירה את הדרגה של מפתח (מיקומו בסדר עולה): מתחילים מ-r=size[left]+1, ומטפסים אל השורש — בכל פעם שעולים מילד ימני מוסיפים size[left]+1 של ההורה. O(log n).',
  complexity: 'O(\\log n)',
  proof: {
    result: 'O(\\log n)',
    claimHe: 'הדירוג עולה O(log n).',
    steps: [
      { he: 'מטפסים מהצומת אל השורש, ובכל רמה מבצעים עבודה קבועה (אולי חיבור).', tex: '\\Theta(1)' },
      { he: 'אורך המסלול חסום בגובה העץ.', tex: 'O(\\log n)' },
    ],
    intuitionHe: 'כל "פנייה ימינה" שעברנו בדרך מלמעלה מוסיפה את כל תת-העץ השמאלי שדילגנו עליו.',
  },
  pseudocode: [osRankBlock],
  views: ['custom'],
  customViz: RbTreeView,
  run: runOsRank,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 7 } },
  presets: [
    { labelHe: 'דירוג מפתח אמצעי (7)', input: { array: DEFAULT_KEYS, extra: { key: 7 } } },
    { labelHe: 'דירוג המינימום (1)', input: { array: DEFAULT_KEYS, extra: { key: 1 } }, noteHe: 'הדרגה צריכה לצאת 1.' },
    { labelHe: 'דירוג המקסימום (15)', input: { array: DEFAULT_KEYS, extra: { key: 15 } }, noteHe: 'הדרגה = מספר הצמתים.' },
    { labelHe: 'דירוג בעץ גדול — טיפוס מלא (המקרה הגרוע ביותר)', input: { array: [10, 5, 15, 3, 7, 13, 17, 1, 9, 12, 20], extra: { key: 20 } }, worst: true, noteHe: 'טיפוס מהעלה העמוק ביותר עד השורש — O(log n).' },
  ],
}
