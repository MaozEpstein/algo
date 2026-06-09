import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import RbTreeView from '../../red-black-tree/views/RbTreeView'
import { emitTree, makeTracer } from '../../red-black-tree/algorithms/_trace'
import { DEFAULT_KEYS, setup, validateKeys } from '../../red-black-tree/algorithms/_shared'
import { osSelect } from '../ostree'
import { osSelectBlock } from '../pseudocode'

export function runOsSelect(input: AlgorithmInput): Frame[] {
  const { b, T } = setup(input)
  const n = T.root.size
  const i = input.extra?.i ?? Math.max(1, Math.ceil(n / 2))
  b.setBlock('osSelect').setPhase('select')
  emitTree(b, T, 'osSelect', `נמצא את האיבר ה-${i} בגודלו. שימו לב ל-size (הגודל הצהוב) בכל צומת.`, true)
  osSelect(T, i, makeTracer(b, T, { showSize: true }))
  return b.build()
}

export const osSelectSpec: AlgorithmSpec = {
  id: 'osSelect',
  titleHe: 'בחירת האיבר ה-i — OS-Select',
  titleEn: 'OS-Select',
  kind: 'main',
  blurbHe:
    'מוצאת את האיבר ה-$i$ בגודלו בעזרת שדה ה-size: בכל צומת מחשבים את דרגתו r=size[left]+1, ויורדים שמאלה/ימינה בהתאם ל-i. ללא סריקה — O(log n).',
  complexity: 'O(\\log n)',
  proof: {
    result: 'O(\\log n)',
    claimHe: 'הבחירה עולה O(log n).',
    steps: [
      { he: 'בכל צומת מבצעים עבודה קבועה (חישוב r והשוואה) ויורדים רמה אחת.', tex: '\\Theta(1)' },
      { he: 'מספר הרמות חסום בגובה העץ האדום-שחור.', tex: 'O(\\log n)' },
    ],
    intuitionHe: 'שדה ה-size הופך "כמה איברים קטנים ממני" לחישוב מיידי — לכן מסלול יחיד מהשורש מספיק.',
  },
  pseudocode: [osSelectBlock],
  views: ['custom'],
  customViz: RbTreeView,
  run: runOsSelect,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { i: 4 } },
  presets: [
    { labelHe: 'המינימום (i=1)', input: { array: DEFAULT_KEYS, extra: { i: 1 } }, noteHe: 'יורד עד הצומת השמאלי ביותר.' },
    { labelHe: 'אמצע (i=4)', input: { array: DEFAULT_KEYS, extra: { i: 4 } } },
    { labelHe: 'המקסימום (i=8)', input: { array: DEFAULT_KEYS, extra: { i: 8 } }, noteHe: 'i גדול מ-r שוב ושוב — פונים ימינה.' },
    { labelHe: 'עץ גדול, איבר עמוק (המקרה הגרוע ביותר)', input: { array: [10, 5, 15, 3, 7, 13, 17, 1, 9, 12, 20], extra: { i: 9 } }, worst: true, noteHe: 'מסלול חיפוש בגובה המלא של עץ ה-RB — עדיין O(log n).' },
  ],
}
