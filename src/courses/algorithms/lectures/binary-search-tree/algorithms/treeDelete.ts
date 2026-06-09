import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { treeDeleteBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import { treeMin, type BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, targetKey, validateKeys } from './_shared'

export function runTreeDelete(input: AlgorithmInput): Frame[] {
  const s = setup(input)
  const b = s.b
  let root = s.root
  const k = targetKey(input)
  b.setBlock('treeDelete').setPhase('delete')

  let current: string | null = null
  let zId: string | null = null
  let succId: string | null = null
  const visited = new Set<string>()

  const tone = (n: BstNode): NodeTone =>
    n.id === succId ? 'successor' : n.id === zId ? 'deleted' : n.id === current ? 'active' : visited.has(n.id) ? 'compare' : 'idle'
  const emit = (codeLine: number | null, narration: string, pts: { label: string; node: BstNode | null; tone: 'x' | 'succ' }[] = [], action?: Frame['action']) => {
    b.setScene(buildScene({ root, tone, pointers: pts.filter((p) => p.node) }))
    b.emit({ codeLine, narration, action, vars: [vv('z.key', k, 'pivot')] })
  }

  // ---- locate z ----
  let z: BstNode | null = root
  while (z && z.key !== k) {
    current = z.id
    visited.add(z.id)
    z = k < z.key ? z.left : z.right
  }
  if (!z) {
    current = null
    emit(null, `המפתח ${k} אינו בעץ — אין מה למחוק.`, [], { kind: 'done' })
    return b.build()
  }
  current = null
  zId = z.id
  visited.clear()
  emit(1, `מוחקים את הצומת z=${k}. נבדוק כמה ילדים יש לו.`, [{ label: 'x', node: z, tone: 'x' }])

  // splice helper: replace n (≤1 child) by its child, fixing root/parent links.
  const splice = (n: BstNode) => {
    const child = n.left ?? n.right
    if (child) child.p = n.p
    if (!n.p) root = child
    else if (n.p.left === n) n.p.left = child
    else n.p.right = child
  }

  const hasLeft = !!z.left
  const hasRight = !!z.right

  if (!hasLeft && !hasRight) {
    // ---- case 0: leaf ----
    emit(2, `ל-${k} אין ילדים כלל — זהו עלה.`, [{ label: 'x', node: z, tone: 'x' }])
    splice(z)
    zId = null
    emit(3, `מסירים את ${k} מההורה שלו. זהו. עלות: O(h).`, [], { kind: 'done' })
    return b.build()
  }

  if (!hasLeft || !hasRight) {
    // ---- case 1: exactly one child ----
    const child = (z.left ?? z.right)!
    emit(4, `ל-${k} יש ילד יחיד (${child.key}) — "עוקפים" אותו: הילד תופס את מקומו.`, [{ label: 'x', node: z, tone: 'x' }])
    splice(z)
    zId = null
    current = child.id
    emit(5, `${child.key} (ותת-העץ שלו) חובר ישירות אל ההורה של ${k}. עלות: O(h).`, [], { kind: 'done' })
    return b.build()
  }

  // ---- case 2: two children ----
  emit(6, `ל-${k} יש שני ילדים — מוצאים את העוקב: המינימום בתת-העץ הימני.`, [{ label: 'x', node: z, tone: 'x' }])
  let m: BstNode = z.right!
  current = m.id
  emit(6, `נכנסים לתת-העץ הימני (${m.key}) ויורדים שמאלה.`, [{ label: 'x', node: m, tone: 'x' }])
  while (m.left) {
    visited.add(m.id)
    m = m.left
    current = m.id
    emit(6, `יורדים שמאלה אל ${m.key}.`, [{ label: 'x', node: m, tone: 'x' }])
  }
  const y = treeMin(z.right!)
  current = null
  succId = y.id
  emit(6, `העוקב הוא ${y.key} — ולעוקב אף פעם אין ילד שמאלי.`, [{ label: 'succ', node: y, tone: 'succ' }])
  const succKey = y.key
  z.key = succKey // copy successor's key up into z (z keeps its identity)
  emit(7, `מעתיקים את ערך העוקב (${succKey}) אל הצומת שנמחק. כעת נותר להסיר את ${succKey} ממקומו הישן.`, [])
  succId = y.id
  zId = y.id // the old successor node is now the one to splice out
  emit(8, `מסירים את הצומת הישן ${succKey} (לכל היותר ילד ימני אחד) — מקרה 0/1 פשוט.`, [{ label: 'succ', node: y, tone: 'succ' }])
  splice(y)
  zId = null
  succId = null
  emit(null, `המחיקה הושלמה תוך שמירה על תכונת ה-BST. עלות: O(h).`, [], { kind: 'done' })
  return b.build()
}

export const treeDeleteSpec: AlgorithmSpec = {
  id: 'treeDelete',
  titleHe: 'מחיקה — Tree-Delete',
  titleEn: 'Tree-Delete',
  kind: 'main',
  blurbHe:
    'מוחקת צומת ב-3 מקרים: עלה (מסירים), ילד יחיד (עוקפים), או שני ילדים (מעתיקים את ערך העוקב פנימה ומוחקים את העוקב, שלעולם אין לו ילד שמאלי).',
  complexity: 'O(h)',
  proof: {
    result: 'O(h)',
    claimHe: 'המחיקה עולה O(h).',
    steps: [
      { he: 'מקרים 0 ו-1: עדכון מצביעים בעבודה קבועה.', tex: '\\Theta(1)' },
      { he: 'מקרה 2: מציאת העוקב = מסלול יחיד כלפי מטה, ולאחריו הסרה בעבודה קבועה.', tex: 'O(h)' },
    ],
    intuitionHe: 'הצעד היקר היחיד הוא מציאת העוקב (מקרה 2) — מסלול אחד כלפי מטה באורך הגובה.',
  },
  pseudocode: [treeDeleteBlock],
  run: runTreeDelete,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 6 } },
  presets: [
    { labelHe: 'מקרה 0: מחיקת עלה (4)', input: { array: DEFAULT_KEYS, extra: { key: 4 } } },
    { labelHe: 'מקרה 1: ילד יחיד (18)', input: { array: DEFAULT_KEYS, extra: { key: 18 } }, noteHe: 'ל-18 יש רק תת-עץ — הוא עוקף אותו.' },
    { labelHe: 'מקרה 2: שני ילדים (6)', input: { array: DEFAULT_KEYS, extra: { key: 6 } }, noteHe: 'מוחלף בעוקב (7).' },
    { labelHe: 'מחיקת השורש (15)', input: { array: DEFAULT_KEYS, extra: { key: 15 } }, noteHe: 'שני ילדים — השורש מוחלף בעוקב שלו (17).' },
    { labelHe: 'עץ נטוי — מחיקה עמוקה (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS, extra: { key: 7 } }, worst: true, noteHe: 'בשרשרת ימנית, איתור הצומת העמוק ביותר עובר את כל הגובה h=n-1.' },
  ],
}
