import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { treeSuccessorBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import { treeMin, type BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, targetKey, validateKeys } from './_shared'

function findNode(root: BstNode | null, k: number): BstNode | null {
  let x = root
  while (x && x.key !== k) x = k < x.key ? x.left : x.right
  return x
}

export function runTreeSuccessor(input: AlgorithmInput): Frame[] {
  const { b, root } = setup(input)
  const k = targetKey(input)
  b.setBlock('treeSuccessor').setPhase('successor')

  const path = new Set<string>()
  let current: string | null = null
  let startId: string | null = null
  let succId: string | null = null

  const tone = (n: BstNode): NodeTone =>
    n.id === succId ? 'successor' : n.id === current ? 'active' : n.id === startId ? 'found' : path.has(n.id) ? 'compare' : 'idle'
  const emit = (
    codeLine: number | null,
    narration: string,
    pts: { label: string; node: BstNode | null; tone: 'x' | 'succ' }[],
    action?: Frame['action'],
  ) => {
    b.setScene(buildScene({ root, tone, pointers: pts.filter((p) => p.node) }))
    b.emit({ codeLine, narration, action, vars: [vv('start', k, 'pivot')] })
  }

  const z = findNode(root, k)
  if (!z) {
    emit(null, `המפתח ${k} אינו בעץ — אין למצוא עוקב.`, [], { kind: 'done' })
    return b.build()
  }
  startId = z.id
  let x: BstNode = z
  emit(1, `מחפשים את העוקב (האיבר הבא בסדר עולה) של ${k}.`, [{ label: 'x', node: x, tone: 'x' }])

  if (z.right) {
    // ---- case 1: minimum of the right subtree ----
    emit(2, `ל-${k} יש תת-עץ ימני — העוקב הוא האיבר הקטן ביותר בו.`, [{ label: 'x', node: z, tone: 'x' }])
    let m: BstNode = z.right
    current = m.id
    path.add(z.id)
    emit(3, `נכנסים לתת-העץ הימני (שורשו ${m.key}) ויורדים שמאלה עד הסוף.`, [{ label: 'x', node: m, tone: 'x' }])
    while (m.left) {
      path.add(m.id)
      m = m.left
      current = m.id
      emit(3, `יורדים שמאלה אל ${m.key}.`, [{ label: 'x', node: m, tone: 'x' }])
    }
    const minNode = treeMin(z.right)
    current = null
    succId = minNode.id
    emit(3, `העוקב של ${k} הוא ${minNode.key} (המינימום בתת-העץ הימני). עלות: O(h).`, [{ label: 'succ', node: minNode, tone: 'succ' }], { kind: 'done' })
    return b.build()
  }

  // ---- case 2: climb up to the first "left-turn" ancestor ----
  emit(2, `ל-${k} אין תת-עץ ימני — נטפס מעלה אל ההורים.`, [{ label: 'x', node: z, tone: 'x' }])
  let y: BstNode | null = x.p
  emit(4, `y = ההורה של ${x.key}${y ? ` (${y.key})` : ' = NIL'}.`, [
    { label: 'x', node: x, tone: 'x' },
    { label: 'y', node: y, tone: 'succ' },
  ])
  while (y && x === y.right) {
    path.add(x.id)
    emit(5, `${x.key} הוא ילד ימני של ${y.key} — לכן y עדיין לא העוקב; ממשיכים לטפס.`, [
      { label: 'x', node: x, tone: 'x' },
      { label: 'y', node: y, tone: 'succ' },
    ])
    x = y
    current = x.id
    y = y.p
    emit(7, `x = ${x.key}, y = ${y ? y.key : 'NIL'}.`, [
      { label: 'x', node: x, tone: 'x' },
      { label: 'y', node: y, tone: 'succ' },
    ])
  }
  current = null
  succId = y?.id ?? null
  if (y) {
    emit(8, `${x.key} הוא ילד שמאלי של ${y.key} — לכן ${y.key} הוא העוקב. עלות: O(h).`, [{ label: 'succ', node: y, tone: 'succ' }], { kind: 'done' })
  } else {
    emit(8, `הגענו לשורש בלי "פנייה שמאלה" — ל-${k} אין עוקב (הוא המקסימום). עלות: O(h).`, [], { kind: 'done' })
  }
  return b.build()
}

export const treeSuccessorSpec: AlgorithmSpec = {
  id: 'treeSuccessor',
  titleHe: 'איבר עוקב — Tree-Successor',
  titleEn: 'Tree-Successor',
  kind: 'main',
  blurbHe:
    'מוצאת את האיבר הבא בסדר עולה. אם יש תת-עץ ימני — העוקב הוא המינימום שבו; אחרת מטפסים מעלה עד ההורה הראשון שאליו הגענו "משמאל".',
  complexity: 'O(h)',
  proof: {
    result: 'O(h)',
    claimHe: 'מציאת העוקב עולה O(h).',
    steps: [
      { he: 'מקרה 1: ירידה למינימום של תת-העץ הימני — מסלול יחיד כלפי מטה.', tex: 'O(h)' },
      { he: 'מקרה 2: טיפוס יחיד כלפי מעלה לאורך מסלול אל השורש.', tex: 'O(h)' },
      { he: 'בכל מקרה עוברים מסלול אחד שאורכו חסום בגובה העץ.', tex: 'O(h)' },
    ],
    intuitionHe: 'או יורדים פעם אחת ימינה-ואז-שמאלה-עד-הסוף, או מטפסים פעם אחת מעלה — אף פעם לא שניהם.',
  },
  pseudocode: [treeSuccessorBlock],
  run: runTreeSuccessor,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 15 } },
  presets: [
    { labelHe: 'מקרה 1: יש תת-עץ ימני (15)', input: { array: DEFAULT_KEYS, extra: { key: 15 } }, noteHe: 'העוקב = מינימום תת-העץ הימני.' },
    { labelHe: 'מקרה 2: טיפוס מעלה (13)', input: { array: DEFAULT_KEYS, extra: { key: 13 } }, noteHe: 'אין תת-עץ ימני — מטפסים אל אב-קדמון.' },
    { labelHe: 'עוקב של עלה (4)', input: { array: DEFAULT_KEYS, extra: { key: 4 } } },
    { labelHe: 'למקסימום אין עוקב (20)', input: { array: DEFAULT_KEYS, extra: { key: 20 } }, noteHe: 'האיבר הגדול ביותר — הטיפוס מגיע עד NIL.' },
    { labelHe: 'עץ נטוי — טיפוס מלא (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS, extra: { key: 7 } }, worst: true, noteHe: 'בשרשרת ימנית, לעלה האחרון אין תת-עץ ימני — הטיפוס מעלה עובר את כל הגובה h=n-1.' },
  ],
}
