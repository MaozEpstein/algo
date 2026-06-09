import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { treeInsertBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import { newNode, type BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, targetKey, validateKeys } from './_shared'

export function runTreeInsert(input: AlgorithmInput): Frame[] {
  const s = setup(input)
  const b = s.b
  let root = s.root
  const k = targetKey(input)
  const z = newNode(k) // continues the id sequence after buildBst — stable & unique
  b.setBlock('treeInsert').setPhase('insert')

  const visited = new Set<string>()
  let attached = false
  let xId: string | null = null
  let yNode: BstNode | null = null

  const tone = (n: BstNode): NodeTone =>
    n.id === z.id ? 'inserted' : n.id === xId ? 'active' : visited.has(n.id) ? 'compare' : 'idle'
  const kv = vv('z.key', k, 'pivot')
  const emit = (
    codeLine: number | null,
    narration: string,
    opts?: { nilOf?: { parent: BstNode; side: 'left' | 'right' }; action?: Frame['action'] },
  ) => {
    b.setScene(
      buildScene({
        root,
        tone,
        staging: attached ? undefined : { id: z.id, key: z.key, tone: 'inserted' },
        pointers: [
          ...(yNode ? [{ label: 'y', node: yNode, tone: 'y' as const, place: 'below' as const }] : []),
        ],
        nilOf: opts?.nilOf ?? null,
      }),
    )
    b.emit({ codeLine, narration, action: opts?.action, vars: [kv] })
  }

  emit(1, `מכניסים מפתח חדש z=${k}. נחפש את מקומו כמו בחיפוש, עם מצביע-נגרר y שזוכר מאיפה באנו.`)
  emit(2, 'y = NIL (המצביע הנגרר, יצביע על ההורה העתידי).')

  let x: BstNode | null = root
  xId = x?.id ?? null
  emit(3, x ? `x = שורש (${x.key}).` : 'x = שורש = NIL — העץ ריק.')

  let side: 'left' | 'right' = 'left'
  while (x) {
    xId = x.id
    emit(4, `x=${x.key} אינו NIL — ממשיכים לרדת.`)
    yNode = x
    emit(5, `y = x = ${x.key} (זוכרים את ההורה האפשרי).`)
    visited.add(x.id)
    if (k < x.key) {
      emit(6, `z=${k} < ${x.key} ← פונים שמאלה.`)
      side = 'left'
      x = x.left
      xId = x?.id ?? null
      emit(7, x ? `x = ${x.key}.` : `x = left[y] = NIL — מצאנו מקום פנוי משמאל ל-${yNode.key}.`, {
        nilOf: x ? undefined : { parent: yNode, side },
      })
    } else {
      emit(8, `z=${k} ≥ ${x.key} ← פונים ימינה.`)
      side = 'right'
      x = x.right
      xId = x?.id ?? null
      emit(9, x ? `x = ${x.key}.` : `x = right[y] = NIL — מצאנו מקום פנוי מימין ל-${yNode.key}.`, {
        nilOf: x ? undefined : { parent: yNode, side },
      })
    }
  }

  z.p = yNode
  emit(10, `p[z] = y — ההורה של ${k} הוא ${yNode ? yNode.key : 'NIL'}.`, {
    nilOf: yNode ? { parent: yNode, side } : undefined,
  })

  if (!yNode) {
    root = z
    attached = true
    emit(12, `העץ היה ריק — ${k} הופך לשורש.`, { action: { kind: 'done' } })
  } else if (k < yNode.key) {
    yNode.left = z
    attached = true
    emit(14, `${k} < ${yNode.key} ← מחברים את z כילד שמאלי של ${yNode.key}.`, { action: { kind: 'done' } })
  } else {
    yNode.right = z
    attached = true
    emit(16, `${k} ≥ ${yNode.key} ← מחברים את z כילד ימני של ${yNode.key}.`, { action: { kind: 'done' } })
  }

  xId = null
  yNode = null
  emit(null, `המפתח ${k} שולב בעץ תוך שמירה על תכונת ה-BST. עלות: O(h).`)
  return b.build()
}

export const treeInsertSpec: AlgorithmSpec = {
  id: 'treeInsert',
  titleHe: 'הכנסה — Tree-Insert',
  titleEn: 'Tree-Insert',
  kind: 'main',
  blurbHe:
    'מכניסה מפתח חדש: יורדת מהשורש כמו בחיפוש (עם מצביע-נגרר y שזוכר את ההורה), ומחברת את העלה החדש במקום ה-NIL שאליו הגיעה.',
  complexity: 'O(h)',
  proof: {
    result: 'O(h)',
    claimHe: 'ההכנסה עולה O(h).',
    steps: [
      { he: 'ההכנסה היא בעצם חיפוש של מקום ריק: יורדים מסלול יחיד מהשורש למטה.', tex: 'O(h)' },
      { he: 'בקצה מבצעים חיבור מצביעים בעבודה קבועה.', tex: '\\Theta(1)' },
    ],
    intuitionHe: 'אותו מסלול כמו חיפוש — ועוד חיבור אחד בקצה. לכן O(h).',
  },
  pseudocode: [treeInsertBlock],
  run: runTreeInsert,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 8 } },
  presets: [
    { labelHe: 'הכנסת 8 (תת-עץ של 7)', input: { array: DEFAULT_KEYS, extra: { key: 8 } } },
    { labelHe: 'הכנסת מינימום חדש (1)', input: { array: DEFAULT_KEYS, extra: { key: 1 } }, noteHe: 'יורד עד שמאל — נעשה למינימום החדש.' },
    { labelHe: 'הכנסת מקסימום חדש (25)', input: { array: DEFAULT_KEYS, extra: { key: 25 } } },
    { labelHe: 'הכנסה לעץ נטוי (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS, extra: { key: 8 } }, worst: true, noteHe: 'בשרשרת ימנית ההכנסה יורדת את כל הגובה h=n-1.' },
  ],
}
