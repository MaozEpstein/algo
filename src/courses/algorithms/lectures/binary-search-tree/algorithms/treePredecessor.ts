import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { treePredecessorBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import { treeMax, type BstNode } from '../bst'
import { DEFAULT_KEYS, setup, targetKey, validateKeys } from './_shared'

function findNode(root: BstNode | null, k: number): BstNode | null {
  let x = root
  while (x && x.key !== k) x = k < x.key ? x.left : x.right
  return x
}

export function runTreePredecessor(input: AlgorithmInput): Frame[] {
  const { b, root } = setup(input)
  const k = targetKey(input)
  b.setBlock('treePredecessor').setPhase('predecessor')

  const path = new Set<string>()
  let current: string | null = null
  let startId: string | null = null
  let predId: string | null = null

  const tone = (n: BstNode): NodeTone =>
    n.id === predId ? 'successor' : n.id === current ? 'active' : n.id === startId ? 'found' : path.has(n.id) ? 'compare' : 'idle'
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
    emit(null, `המפתח ${k} אינו בעץ — אין למצוא קודם.`, [], { kind: 'done' })
    return b.build()
  }
  startId = z.id
  let x: BstNode = z
  emit(1, `מחפשים את הקודם (האיבר הקודם בסדר עולה) של ${k} — סימטרי לעוקב.`, [{ label: 'x', node: x, tone: 'x' }])

  if (z.left) {
    // ---- case 1: maximum of the left subtree ----
    emit(2, `ל-${k} יש תת-עץ שמאלי — הקודם הוא האיבר הגדול ביותר בו.`, [{ label: 'x', node: z, tone: 'x' }])
    let m: BstNode = z.left
    current = m.id
    path.add(z.id)
    emit(3, `נכנסים לתת-העץ השמאלי (שורשו ${m.key}) ויורדים ימינה עד הסוף.`, [{ label: 'x', node: m, tone: 'x' }])
    while (m.right) {
      path.add(m.id)
      m = m.right
      current = m.id
      emit(3, `יורדים ימינה אל ${m.key}.`, [{ label: 'x', node: m, tone: 'x' }])
    }
    const maxNode = treeMax(z.left)
    current = null
    predId = maxNode.id
    emit(3, `הקודם של ${k} הוא ${maxNode.key} (המקסימום בתת-העץ השמאלי). עלות: O(h).`, [{ label: 'pred', node: maxNode, tone: 'succ' }], { kind: 'done' })
    return b.build()
  }

  // ---- case 2: climb up to the first "right-turn" ancestor ----
  emit(2, `ל-${k} אין תת-עץ שמאלי — נטפס מעלה אל ההורים.`, [{ label: 'x', node: z, tone: 'x' }])
  let y: BstNode | null = x.p
  emit(4, `y = ההורה של ${x.key}${y ? ` (${y.key})` : ' = NIL'}.`, [
    { label: 'x', node: x, tone: 'x' },
    { label: 'y', node: y, tone: 'succ' },
  ])
  while (y && x === y.left) {
    path.add(x.id)
    emit(5, `${x.key} הוא ילד שמאלי של ${y.key} — לכן y עדיין לא הקודם; ממשיכים לטפס.`, [
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
  predId = y?.id ?? null
  if (y) {
    emit(8, `${x.key} הוא ילד ימני של ${y.key} — לכן ${y.key} הוא הקודם. עלות: O(h).`, [{ label: 'pred', node: y, tone: 'succ' }], { kind: 'done' })
  } else {
    emit(8, `הגענו לשורש בלי "פנייה ימינה" — ל-${k} אין קודם (הוא המינימום). עלות: O(h).`, [], { kind: 'done' })
  }
  return b.build()
}

export const treePredecessorSpec: AlgorithmSpec = {
  id: 'treePredecessor',
  titleHe: 'איבר קודם — Tree-Predecessor',
  titleEn: 'Tree-Predecessor',
  kind: 'main',
  blurbHe:
    'סימטרי לעוקב: מוצאת את האיבר הקודם בסדר עולה. אם יש תת-עץ שמאלי — הקודם הוא המקסימום שבו; אחרת מטפסים מעלה עד ההורה הראשון שאליו הגענו "מימין".',
  complexity: 'O(h)',
  proof: {
    result: 'O(h)',
    claimHe: 'מציאת הקודם עולה O(h).',
    steps: [
      { he: 'מקרה 1: ירידה למקסימום של תת-העץ השמאלי — מסלול יחיד כלפי מטה.', tex: 'O(h)' },
      { he: 'מקרה 2: טיפוס יחיד כלפי מעלה לאורך מסלול אל השורש.', tex: 'O(h)' },
      { he: 'בכל מקרה עוברים מסלול אחד שאורכו חסום בגובה העץ.', tex: 'O(h)' },
    ],
    intuitionHe: 'תמונת-מראה של העוקב: ימין↔שמאל, מינימום↔מקסימום.',
  },
  pseudocode: [treePredecessorBlock],
  run: runTreePredecessor,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 6 } },
  presets: [
    { labelHe: 'מקרה 1: יש תת-עץ שמאלי (6)', input: { array: DEFAULT_KEYS, extra: { key: 6 } }, noteHe: 'הקודם = מקסימום תת-העץ השמאלי.' },
    { labelHe: 'מקרה 2: טיפוס מעלה (13)', input: { array: DEFAULT_KEYS, extra: { key: 13 } }, noteHe: 'אין תת-עץ שמאלי — מטפסים אל אב-קדמון.' },
    { labelHe: 'קודם של עלה (9)', input: { array: DEFAULT_KEYS, extra: { key: 9 } } },
    { labelHe: 'למינימום אין קודם (2)', input: { array: DEFAULT_KEYS, extra: { key: 2 } }, noteHe: 'האיבר הקטן ביותר — הטיפוס מגיע עד NIL.' },
    { labelHe: 'עץ נטוי — טיפוס מלא (המקרה הגרוע ביותר)', input: { array: [7, 6, 5, 4, 3, 2, 1], extra: { key: 1 } }, worst: true, noteHe: 'בשרשרת שמאלית, לעלה האחרון אין תת-עץ שמאלי — הטיפוס עובר את כל הגובה h=n-1.' },
  ],
}
