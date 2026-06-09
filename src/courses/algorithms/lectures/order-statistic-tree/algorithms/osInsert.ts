import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import RbTreeView from '../../red-black-tree/views/RbTreeView'
import { emitTree, makeTracer } from '../../red-black-tree/algorithms/_trace'
import { DEFAULT_KEYS, setup, targetKey, validateKeys } from '../../red-black-tree/algorithms/_shared'
import { rbInsert } from '../../red-black-tree/rbtree'
import { rbInsertBlock, rbInsertFixupBlock, leftRotateBlock, rightRotateBlock } from '../../red-black-tree/pseudocode'

export function runOsInsert(input: AlgorithmInput): Frame[] {
  const { b, T } = setup(input)
  const key = targetKey(input, 4)
  b.setBlock('rbInsert').setPhase('insert')
  emitTree(b, T, 'rbInsert', `נכניס את ${key}. עקבו אחר שדה ה-size (הצהוב): הוא גָדֵל ב-1 בכל צומת לאורך מסלול ההכנסה, ומתעדכן גם בכל סיבוב.`, true)
  rbInsert(T, key, makeTracer(b, T, { zTone: 'inserted', showSize: true }))
  return b.build()
}

export const osInsertSpec: AlgorithmSpec = {
  id: 'osInsert',
  titleHe: 'הכנסה ותחזוקת size — OS-Insert',
  titleEn: 'Insert (size maintenance)',
  kind: 'main',
  blurbHe:
    'הכנסה רגילה לעץ אדום-שחור, אך תוך תחזוקת שדה ה-size: כל צומת על מסלול ההכנסה גָדֵל ב-1, וכל סיבוב מעדכן את שני הצמתים המעורבים. כך השדה נשאר תקין ב-O(log n) ללא עלות נוספת.',
  complexity: 'O(\\log n)',
  usesHe: ['RB-Insert', 'Left-Rotate', 'Right-Rotate'],
  proof: {
    result: 'O(\\log n)',
    claimHe: 'תחזוקת ה-size אינה משנה את סדר הגודל.',
    steps: [
      { he: 'ההכנסה כבר עוברת מסלול יחיד באורך O(log n); מגדילים size בכל צומת בדרך — עבודה קבועה לרמה.', tex: 'O(\\log n)' },
      { he: 'כל סיבוב מתקן 2 שדות size בלבד, ויש O(1) סיבובים. זהו משפט ההרחבה 14.1 בפעולה.', tex: '\\Theta(1)' },
    ],
    intuitionHe: 'שדה מרחיב שניתן לחשב מילדים בלבד — נתחזק "בדרך" בלי לשנות את סיבוכיות הפעולה.',
  },
  pseudocode: [rbInsertBlock, rbInsertFixupBlock, leftRotateBlock, rightRotateBlock],
  views: ['custom'],
  customViz: RbTreeView,
  run: runOsInsert,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 4 } },
  presets: [
    { labelHe: 'הכנסה עם סיבוב (4)', input: { array: DEFAULT_KEYS, extra: { key: 4 } }, noteHe: 'ראו את ה-size מתעדכן גם בסיבוב.' },
    { labelHe: 'הכנסת מינימום (0)', input: { array: DEFAULT_KEYS, extra: { key: 0 } }, noteHe: 'כל צמתי המסלול השמאלי גדלים ב-1.' },
    { labelHe: 'הכנסת מקסימום (25)', input: { array: DEFAULT_KEYS, extra: { key: 25 } } },
    { labelHe: 'הכנסה לעץ גדול (המקרה הגרוע ביותר)', input: { array: [10, 5, 15, 3, 7, 13, 17, 1, 9, 12], extra: { key: 2 } }, worst: true, noteHe: 'מסלול הכנסה מלא — מירב עדכוני ה-size, עדיין O(log n).' },
  ],
}
