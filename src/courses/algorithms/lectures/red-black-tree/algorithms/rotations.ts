import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { leftRotateBlock, rightRotateBlock } from '../pseudocode'
import RbTreeView from '../views/RbTreeView'
import { buildRbScene } from '../rbScene'
import { isNil, leftRotate, realNodes, rightRotate } from '../rbtree'
import { emitTree, makeTracer } from './_trace'
import { DEFAULT_KEYS, setup, validateKeys } from './_shared'

export function runRotations(input: AlgorithmInput): Frame[] {
  const { b, T } = setup(input)
  b.setBlock('leftRotate').setPhase('rotate')
  emitTree(b, T, 'leftRotate', 'סיבוב הוא הפעולה הבסיסית לשינוי מבנה העץ — והוא שומר על תכונת ה-BST (הסדר התוך-סדרי).')

  // pick a node that can be left-rotated (has a real right child)
  const x = realNodes(T).find((n) => !isNil(T, n.right))
  const tr = makeTracer(b, T)
  if (!x) {
    b.setScene(buildRbScene({ tree: T, showNil: true }))
    b.emit({ codeBlock: 'leftRotate', codeLine: null, narration: 'אין צומת עם ילד ימני לסיבוב.', action: { kind: 'done' } })
    return b.build()
  }

  leftRotate(T, x, tr) // x sinks left, its right child y rises
  const y = x.p // after the rotation, y is x's parent
  b.setScene(buildRbScene({ tree: T, tone: (n) => (n.id === x.id || n.id === y.id ? 'compare' : 'idle'), showNil: true }))
  b.emit({ codeBlock: 'leftRotate', codeLine: null, narration: `הסדר התוך-סדרי לא השתנה. כעת נדגים שהסיבוב הימני ההפוך משחזר את העץ במדויק.` })

  rightRotate(T, y, tr) // inverse: restores the original tree exactly
  b.setScene(buildRbScene({ tree: T, showNil: true }))
  b.emit({ codeBlock: 'rightRotate', codeLine: null, narration: 'העץ חזר למצבו המקורי — סיבוב ימני ושמאלי הם פעולות הפוכות. עלות כל סיבוב: O(1).', action: { kind: 'done' } })
  return b.build()
}

export const rotationsSpec: AlgorithmSpec = {
  id: 'rotations',
  titleHe: 'סיבובים — Left/Right-Rotate',
  titleEn: 'Rotations',
  kind: 'main',
  blurbHe:
    'פעולת העזר לשינוי מבנה העץ. Left-Rotate מעלה את הילד הימני ומוריד את ההורה שמאלה; Right-Rotate הוא ההפוך. בשני המקרים הסדר התוך-סדרי (תכונת ה-BST) נשמר, בעלות O(1).',
  complexity: 'O(1)',
  proof: {
    result: 'O(1)',
    claimHe: 'סיבוב עולה O(1).',
    steps: [
      { he: 'הסיבוב מעדכן מספר קבוע של מצביעים (ילד, הורה, תת-עץ פנימי) — ללא תלות בגודל העץ.', tex: '\\Theta(1)' },
    ],
    intuitionHe: 'רק כמה מצביעים מתחלפים; אף תת-עץ אינו נסרק — ולכן O(1). הסדר התוך-סדרי נשמר.',
  },
  pseudocode: [leftRotateBlock, rightRotateBlock],
  views: ['custom'],
  customViz: RbTreeView,
  run: runRotations,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS },
  presets: [
    { labelHe: 'עץ לדוגמה', input: { array: DEFAULT_KEYS } },
    { labelHe: 'דוגמה קטנה', input: { array: [5, 3, 9, 7, 12] } },
    { labelHe: 'עץ סימטרי', input: { array: [8, 4, 12, 2, 6, 10, 14] } },
    { labelHe: 'עץ גדול (המקרה הגרוע ביותר)', input: { array: [10, 5, 15, 3, 7, 13, 17, 1, 9, 12] }, worst: true, noteHe: 'גם בעץ גדול — הסיבוב נוגע במספר קבוע של מצביעים, תמיד O(1).' },
  ],
}
