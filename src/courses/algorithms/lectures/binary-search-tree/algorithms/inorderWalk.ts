import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { inorderWalkBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import type { BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, validateKeys } from './_shared'

export function runInorderWalk(input: AlgorithmInput): Frame[] {
  const { b, root } = setup(input)
  b.setBlock('inorderWalk').setPhase('walk')
  const printed: string[] = [] // ids, in print order
  let current: string | null = null

  const tone = (n: BstNode): NodeTone =>
    n.id === current ? 'active' : printed.includes(n.id) ? 'sorted' : 'idle'
  const printedKeys = () =>
    printed.map((id) => find(root, id)?.key).filter((v): v is number => v != null)
  const emit = (codeLine: number | null, narration: string, action?: Frame['action']) => {
    b.setScene(buildScene({ root, tone }))
    b.emit({
      codeLine,
      narration,
      action,
      vars: [vv('הודפסו', printed.length, 'bound')],
    })
  }

  if (!root) {
    emit(2, 'העץ ריק — אין מה לסרוק.')
    return b.build()
  }

  emit(1, 'סריקה תוך-סדרית (Inorder): שמאל ← צומת ← ימין. נראה שהיא מדפיסה את המפתחות בסדר עולה.')

  const walk = (x: BstNode | null) => {
    if (!x) return
    current = x.id
    emit(2, `נכנסים לצומת ${x.key}. תחילה נסרוק את כל תת-העץ השמאלי שלו.`)
    if (x.left) {
      emit(3, `יורדים שמאלה אל ${x.left.key} (ערכים קטנים מ-${x.key}).`)
      walk(x.left)
      current = x.id
    } else {
      emit(3, `אין ילד שמאלי ל-${x.key} — חוזרים להדפיס אותו.`)
    }
    printed.push(x.id)
    emit(4, `מדפיסים ${x.key}. עד כה: ${printedKeys().join(', ')}.`)
    if (x.right) {
      emit(5, `יורדים ימינה אל ${x.right.key} (ערכים גדולים מ-${x.key}).`)
      walk(x.right)
      current = x.id
    } else {
      emit(5, `אין ילד ימני ל-${x.key} — חוזרים מעלה.`)
    }
  }

  walk(root)
  current = null
  b.setScene(buildScene({ root, tone: () => 'sorted' }))
  b.emit({
    codeLine: null,
    action: { kind: 'done' },
    narration: `סיום! הפלט: ${printedKeys().join(', ')} — מיון עולה. עלות: O(n) (כל צומת נסרק פעם אחת).`,
    vars: [vv('הודפסו', printed.length, 'bound')],
  })
  return b.build()
}

function find(root: BstNode | null, id: string): BstNode | null {
  if (!root) return null
  if (root.id === id) return root
  return find(root.left, id) ?? find(root.right, id)
}

export const inorderWalkSpec: AlgorithmSpec = {
  id: 'inorderWalk',
  titleHe: 'סריקה תוך-סדרית — Inorder Walk',
  titleEn: 'Inorder-Tree-Walk',
  kind: 'main',
  blurbHe:
    'סורקת את העץ בסדר שמאל ← צומת ← ימין, ומדפיסה את המפתחות בסדר עולה. זו ההוכחה החזותית לתכונת עץ החיפוש.',
  complexity: 'O(n)',
  proof: {
    result: '\\Theta(n)',
    claimHe: 'הסריקה עולה Θ(n).',
    steps: [
      { he: 'כל צומת נסרק בדיוק פעם אחת, ומבצעים בו עבודה קבועה (הדפסה + שתי קריאות).', tex: 'T(n) = T(k) + T(n-k-1) + \\Theta(1)' },
      { he: 'הפתרון של נוסחת הנסיגה הזו, לכל פיצול, הוא לינארי:', tex: '\\Theta(n)' },
    ],
    intuitionHe: 'n צמתים × עבודה קבועה לכל אחד = Θ(n) — ללא תלות בצורת העץ.',
  },
  pseudocode: [inorderWalkBlock],
  run: runInorderWalk,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS },
  presets: [
    { labelHe: 'עץ מאוזן (CLRS)', input: { array: DEFAULT_KEYS } },
    { labelHe: 'דוגמה קטנה', input: { array: [8, 3, 10, 1, 6, 14] } },
    { labelHe: 'הוכנס הפוך', input: { array: [9, 11, 7, 13, 5] } },
    { labelHe: 'עץ נטוי — סריקה מלאה (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS }, noteHe: 'הכנסה בסדר עולה יוצרת שרשרת ימנית — אך הסריקה עדיין מחזירה סדר עולה, תמיד ב-Θ(n).', worst: true },
  ],
}
