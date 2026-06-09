import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { treeMaximumBlock, treeMinimumBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import type { BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, validateKeys } from './_shared'

export function runTreeMinMax(input: AlgorithmInput): Frame[] {
  const { b, root } = setup(input)

  const path = new Set<string>()
  let current: string | null = null
  let minId: string | null = null
  let maxId: string | null = null

  const tone = (n: BstNode): NodeTone =>
    n.id === minId ? 'min' : n.id === maxId ? 'max' : n.id === current ? 'active' : path.has(n.id) ? 'compare' : 'idle'
  const emit = (block: string, codeLine: number | null, narration: string, x: BstNode | null, action?: Frame['action']) => {
    b.setScene(buildScene({ root, tone, pointers: x ? [{ label: 'x', node: x, tone: 'x' }] : [] }))
    b.emit({ codeBlock: block, codeLine, narration, action })
  }

  if (!root) {
    emit('treeMinimum', 1, 'העץ ריק.', null)
    return b.build()
  }

  // ---- Minimum: keep going left ----
  b.setBlock('treeMinimum').setPhase('minimum')
  let x: BstNode = root
  current = x.id
  emit('treeMinimum', 1, 'מינימום: מתחילים בשורש ויורדים שמאלה כל עוד אפשר (ערכים קטֵנים).', x)
  while (x.left) {
    path.add(x.id)
    emit('treeMinimum', 2, `ל-${x.key} יש ילד שמאלי — ממשיכים שמאלה.`, x)
    x = x.left
    current = x.id
    emit('treeMinimum', 3, `x = ${x.key}.`, x)
  }
  emit('treeMinimum', 2, `ל-${x.key} אין ילד שמאלי — זהו האיבר הקטן ביותר.`, x)
  minId = x.id
  current = null
  path.clear()
  emit('treeMinimum', 4, `המינימום הוא ${x.key} (הצומת השמאלי ביותר). עלות: O(h).`, null)

  // ---- Maximum: keep going right ----
  b.setBlock('treeMaximum').setPhase('maximum')
  x = root
  current = x.id
  emit('treeMaximum', 1, 'מקסימום: סימטרי — מתחילים בשורש ויורדים ימינה כל עוד אפשר.', x)
  while (x.right) {
    path.add(x.id)
    emit('treeMaximum', 2, `ל-${x.key} יש ילד ימני — ממשיכים ימינה.`, x)
    x = x.right
    current = x.id
    emit('treeMaximum', 3, `x = ${x.key}.`, x)
  }
  emit('treeMaximum', 2, `ל-${x.key} אין ילד ימני — זהו האיבר הגדול ביותר.`, x)
  maxId = x.id
  current = null
  path.clear()
  emit('treeMaximum', 4, `המקסימום הוא ${x.key} (הצומת הימני ביותר). עלות: O(h).`, null, { kind: 'done' })

  return b.build()
}

export const treeMinMaxSpec: AlgorithmSpec = {
  id: 'treeMinMax',
  titleHe: 'מינימום ומקסימום — Minimum / Maximum',
  titleEn: 'Tree-Minimum / Maximum',
  kind: 'main',
  blurbHe:
    'המינימום הוא הצומת השמאלי ביותר (יורדים שמאלה עד הסוף); המקסימום הוא הימני ביותר. שני מסלולים פשוטים מהשורש כלפי מטה.',
  complexity: 'O(h)',
  proof: {
    result: 'O(h)',
    claimHe: 'מציאת מינימום/מקסימום עולה O(h).',
    steps: [
      { he: 'עוקבים אחר מצביעי שמאל (או ימין) בלבד — מסלול יחיד מהשורש לעלה.', tex: 'O(h)' },
    ],
    intuitionHe: 'כל המפתחות הקטנים נמצאים משמאל — לכן "הכי שמאלי" הוא המינימום, ומסלולו באורך הגובה.',
  },
  pseudocode: [treeMinimumBlock, treeMaximumBlock],
  run: runTreeMinMax,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS },
  presets: [
    { labelHe: 'עץ מאוזן (CLRS)', input: { array: DEFAULT_KEYS } },
    { labelHe: 'דוגמה קטנה', input: { array: [8, 3, 10, 1, 6, 14] } },
    { labelHe: 'מינימום בשורש', input: { array: [5, 8, 12, 9, 20] }, noteHe: 'הכנסה בסדר עולה — השורש הוא המינימום.' },
    { labelHe: 'עץ נטוי — מקסימום עמוק (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS }, worst: true, noteHe: 'בשרשרת ימנית: המינימום בשורש (צעד 0), אך המקסימום בעומק h=n-1.' },
  ],
}
