import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { treeSearchBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import type { BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, targetKey, validateKeys } from './_shared'

export function runTreeSearch(input: AlgorithmInput): Frame[] {
  const { b, root } = setup(input)
  const k = targetKey(input)
  b.setBlock('treeSearch').setPhase('search')

  const visited = new Set<string>()
  let current: string | null = null
  let foundId: string | null = null
  const kv = vv('k', k, 'pivot')

  const tone = (n: BstNode): NodeTone =>
    n.id === foundId ? 'found' : n.id === current ? 'active' : visited.has(n.id) ? 'compare' : 'idle'
  const emit = (
    codeLine: number | null,
    narration: string,
    extra?: { x: BstNode | null; nilOf?: { parent: BstNode; side: 'left' | 'right' }; action?: Frame['action'] },
  ) => {
    b.setScene(
      buildScene({
        root,
        tone,
        pointers: extra?.x ? [{ label: 'x', node: extra.x, tone: 'x' }] : [],
        nilOf: extra?.nilOf ?? null,
      }),
    )
    b.emit({ codeLine, narration, action: extra?.action, vars: [kv] })
  }

  emit(1, `מחפשים את המפתח k=${k}. נתחיל מהשורש ונרד בכל צעד שמאלה/ימינה.`, { x: root })

  let x: BstNode | null = root
  let parent: BstNode | null = null
  let side: 'left' | 'right' = 'left'

  while (x && x.key !== k) {
    current = x.id
    emit(2, `k=${k} שונה מ-${x.key}, והצומת אינו NIL — ממשיכים.`, { x })
    visited.add(x.id)
    if (k < x.key) {
      emit(4, `k=${k} < ${x.key} ← פונים שמאלה.`, { x })
      parent = x
      side = 'left'
      x = x.left
      emit(5, x ? `יורדים אל ${x.key}.` : `אין ילד שמאלי — נגיע ל-NIL.`, { x, nilOf: x ? undefined : { parent: parent!, side } })
    } else {
      emit(4, `k=${k} > ${x.key} ← פונים ימינה.`, { x })
      parent = x
      side = 'right'
      x = x.right
      emit(7, x ? `יורדים אל ${x.key}.` : `אין ילד ימני — נגיע ל-NIL.`, { x, nilOf: x ? undefined : { parent: parent!, side } })
    }
  }

  if (x) {
    current = null
    foundId = x.id
    emit(3, `נמצא! k=${k} יושב בצומת זה. החזרנו מצביע אליו. עלות: O(h).`, { x, action: { kind: 'done' } })
  } else {
    current = null
    emit(3, `הגענו ל-NIL — המפתח ${k} אינו בעץ, מחזירים NIL. עלות: O(h).`, {
      x: null,
      nilOf: parent ? { parent, side } : undefined,
      action: { kind: 'done' },
    })
  }
  return b.build()
}

export const treeSearchSpec: AlgorithmSpec = {
  id: 'treeSearch',
  titleHe: 'חיפוש — Tree-Search',
  titleEn: 'Tree-Search',
  kind: 'main',
  blurbHe:
    'מחפשת מפתח k בעץ. בכל צומת משווים: שווה ← נמצא; קטן ← שמאלה; גדול ← ימינה. המסלול יורד מהשורש לכל היותר עד עלה.',
  complexity: 'O(h)',
  proof: {
    result: 'O(h)',
    claimHe: 'החיפוש עולה O(h), כאשר h גובה העץ.',
    steps: [
      { he: 'בכל צעד יורדים רמה אחת מטה ומבצעים השוואה אחת — עבודה קבועה לרמה.', tex: '\\Theta(1)' },
      { he: 'מספר הרמות חסום בגובה העץ h, ולכן:', tex: 'O(h)' },
      { he: 'בעץ מאוזן h=Θ(log n), אך בעץ נטוי h עלול להגיע ל-n-1.', tex: 'O(\\log n) \\le O(h) \\le O(n)' },
    ],
    intuitionHe: 'חיפוש = מסלול יחיד מהשורש כלפי מטה. אורכו לכל היותר גובה העץ.',
  },
  pseudocode: [treeSearchBlock],
  run: runTreeSearch,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 13 } },
  presets: [
    { labelHe: 'מפתח קיים (13)', input: { array: DEFAULT_KEYS, extra: { key: 13 } } },
    { labelHe: 'מפתח חסר (10)', input: { array: DEFAULT_KEYS, extra: { key: 10 } }, noteHe: 'החיפוש "נופל" אל NIL.' },
    { labelHe: 'חיפוש בשורש (15)', input: { array: DEFAULT_KEYS, extra: { key: 15 } } },
    { labelHe: 'עץ נטוי — חיפוש עמוק (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS, extra: { key: 7 } }, worst: true, noteHe: 'בשרשרת ימנית, חיפוש האיבר האחרון יורד את כל הגובה h=n-1.' },
  ],
}
