import { FrameBuilder, vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { bstSortBlock, inorderWalkBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import { insert, newNode, resetIds, type BstNode } from '../bst'
import { SKEWED_KEYS, validateKeys } from './_shared'

export function runBstSort(input: AlgorithmInput): Frame[] {
  resetIds()
  const keys = input.array
  const b = new FrameBuilder(keys.length ? keys : [0])
  b.setBlock('bstSort')

  let root: BstNode | null = null
  let lastId: string | null = null
  const printed: string[] = []
  let current: string | null = null

  const buildTone = (n: BstNode): NodeTone => (n.id === lastId ? 'inserted' : 'idle')
  const walkTone = (n: BstNode): NodeTone =>
    n.id === current ? 'active' : printed.includes(n.id) ? 'sorted' : 'idle'

  // ---- phase 1: build the tree by repeated insertion ----
  b.setPhase('build')
  b.setScene(buildScene({ root, tone: buildTone }))
  b.emit({ codeLine: 2, narration: 'מתחילים מעץ ריק. נכניס את איברי המערך אחד-אחד.', vars: [vv('n', keys.length, 'bound')] })

  keys.forEach((key, i) => {
    const z = newNode(key)
    root = insert(root, z)
    lastId = z.id
    b.setScene(buildScene({ root, tone: buildTone, staging: undefined }))
    b.emit({
      codeLine: 4,
      narration: `TreeInsert(A[${i + 1}]=${key}). הוא "מתגלגל" למטה לפי השוואות — בדיוק כמו חלוקה ב-Quicksort סביב ${key}.`,
      vars: [vv('i', i + 1, 'i'), vv('key', key, 'pivot')],
    })
  })

  lastId = null
  b.setScene(buildScene({ root, tone: () => 'idle' }))
  b.emit({ codeLine: 4, narration: 'כל האיברים בעץ. שימו לב: השורש הוא ה"ציר" הראשון — ממש כמו ה-pivot הראשון ב-Quicksort.' })

  // ---- phase 2: inorder walk emits the sorted order ----
  b.setBlock('inorderWalk').setPhase('walk')
  const printedKeys = () => printed.map((id) => findKey(root, id)).filter((v): v is number => v != null)
  const walk = (x: BstNode | null) => {
    if (!x) return
    walk(x.left)
    current = x.id
    printed.push(x.id)
    b.setScene(buildScene({ root, tone: walkTone }))
    b.emit({ codeLine: 4, narration: `Inorder מדפיס ${x.key}. עד כה: ${printedKeys().join(', ')}.` })
    current = null
    walk(x.right)
  }
  b.setScene(buildScene({ root, tone: walkTone }))
  b.emit({ codeLine: 5, narration: 'מריצים סריקה תוך-סדרית — היא מדפיסה את המפתחות בסדר עולה.' })
  walk(root)

  b.setScene(buildScene({ root, tone: () => 'sorted' }))
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `הפלט הממוין: ${printedKeys().join(', ')}. אותן השוואות כמו Quicksort — ולכן בממוצע O(n log n), ובמקרה הגרוע (עץ נטוי) O(n²).`,
  })
  return b.build()
}

function findKey(root: BstNode | null, id: string): number | null {
  if (!root) return null
  if (root.id === id) return root.key
  return findKey(root.left, id) ?? findKey(root.right, id)
}

export const bstSortSpec: AlgorithmSpec = {
  id: 'bstSort',
  titleHe: 'מיון בעזרת עץ — BSTSort',
  titleEn: 'BSTSort',
  kind: 'main',
  blurbHe:
    'ממיין מערך על-ידי הכנסת כל איבריו לעץ חיפוש ואז סריקה תוך-סדרית. מבצע בדיוק את אותן השוואות כמו Quicksort — אך בסדר שונה.',
  complexity: 'O(n \\log n)',
  usesHe: ['Tree-Insert', 'Inorder-Tree-Walk'],
  proof: {
    result: 'O(n \\log n)',
    claimHe: 'בממוצע O(n log n); במקרה הגרוע O(n²).',
    steps: [
      { he: 'בונים את העץ ב-n הכנסות; עלות כל הכנסה היא גובה העץ באותו רגע.', tex: '\\sum_i O(h_i)' },
      { he: 'הבנייה מבצעת בדיוק את אותן השוואות כמו Quicksort (השורש = ה-pivot הראשון), ולכן בתוחלת:', tex: '\\Theta(n \\log n)' },
      { he: 'במקרה הגרוע (קלט ממוין ← עץ נטוי) הגובה הוא n-1 והבנייה עולה:', tex: '\\Theta(n^2)' },
      { he: 'הסריקה התוך-סדרית מוסיפה Θ(n) בלבד.', tex: '\\Theta(n)' },
    ],
    intuitionHe: 'בניית BST = Quicksort בתחפושת: כל הכנסה משווה לאותם "צירים". לכן אותו זמן ריצה — אך Quicksort עדיף (קבועים קטנים, במקום, ללא מבנה עזר).',
  },
  pseudocode: [bstSortBlock, inorderWalkBlock],
  run: runBstSort,
  validateInput: validateKeys,
  defaultInput: { array: [3, 1, 8, 2, 6, 7, 5] },
  presets: [
    { labelHe: 'דוגמת השיעור', input: { array: [3, 1, 8, 2, 6, 7, 5] } },
    { labelHe: 'אקראי', input: { array: [9, 4, 12, 2, 6, 11, 15, 7] } },
    { labelHe: 'הפוך', input: { array: [7, 6, 5, 4, 3, 2, 1] }, noteHe: 'קלט יורד יוצר שרשרת שמאלית — גם הוא Θ(n²).' },
    { labelHe: 'ממוין ← עץ נטוי (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS }, worst: true, noteHe: 'קלט ממוין יוצר שרשרת — הבנייה עולה Θ(n²), בדיוק כמו Quicksort על קלט ממוין.' },
  ],
}
