import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { rbInsertBlock, rbInsertFixupBlock, leftRotateBlock, rightRotateBlock } from '../pseudocode'
import RbTreeView from '../views/RbTreeView'
import { rbInsert } from '../rbtree'
import { emitTree, makeTracer } from './_trace'
import { DEFAULT_KEYS, setup, targetKey, validateKeys } from './_shared'

export function runRbInsert(input: AlgorithmInput): Frame[] {
  const { b, T } = setup(input)
  const key = targetKey(input, 4)
  b.setBlock('rbInsert').setPhase('insert')
  emitTree(b, T, 'rbInsert', `עץ אדום-שחור תקין. נכניס את המפתח ${key} (תמיד כעלה אדום) ואז נתקן.`)
  rbInsert(T, key, makeTracer(b, T, { zTone: 'inserted' }))
  return b.build()
}

export const rbInsertSpec: AlgorithmSpec = {
  id: 'rbInsert',
  titleHe: 'הכנסה — RB-Insert',
  titleEn: 'RB-Insert',
  kind: 'main',
  blurbHe:
    'מכניסה מפתח כמו ב-BST וצובעת אותו אדום, ואז Insert-Fixup מתקן את הפרת התכונה "אין שני אדומים רצופים" — באמצעות צביעה מחדש וסיבובים — תוך שמירה על גובה-השחור. סה״כ O(log n).',
  complexity: 'O(\\log n)',
  usesHe: ['Left-Rotate', 'Right-Rotate', 'RB-Insert-Fixup'],
  proof: {
    result: 'O(\\log n)',
    claimHe: 'ההכנסה עולה O(log n).',
    steps: [
      { he: 'החיפוש אחר מקום ההכנסה יורד מסלול יחיד בעץ שגובהו O(log n).', tex: 'O(\\log n)' },
      { he: 'התיקון מבצע לכל היותר 2 סיבובים, ומקרה 1 מטפס מעלה O(log n) רמות בלבד.', tex: 'O(\\log n)' },
    ],
    intuitionHe: 'גובה העץ חסום ב-2lg(n+1); כל פעולות התיקון הן לאורך מסלול יחיד מהעלה לשורש.',
  },
  pseudocode: [rbInsertBlock, rbInsertFixupBlock, leftRotateBlock, rightRotateBlock],
  views: ['custom'],
  customViz: RbTreeView,
  run: runRbInsert,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 4 } },
  presets: [
    { labelHe: 'מקרה 3 — דוד שחור (הכנסת 4)', input: { array: DEFAULT_KEYS, extra: { key: 4 } }, noteHe: 'מפעיל סיבוב + צביעה (מקרים 2→3).' },
    { labelHe: 'מקרה 1 — דוד אדום (הכנסת 10)', input: { array: [7, 3, 18, 10, 22, 8, 11, 26], extra: { key: 15 } }, noteHe: 'הדוד אדום → צביעה מחדש בלבד, ההפרה מטפסת מעלה.' },
    { labelHe: 'הכנסה לשורש שחור (הכנסת 25)', input: { array: DEFAULT_KEYS, extra: { key: 25 } }, noteHe: 'הורה שחור → אין צורך בתיקון כלל.' },
    { labelHe: 'עץ זעיר (הכנסת 5)', input: { array: [10, 15], extra: { key: 5 } }, noteHe: 'הכנסה פשוטה תחת הורה שחור — בלי תיקון.' },
    { labelHe: 'צביעה מטפסת עד השורש (המקרה הגרוע ביותר)', input: { array: [10, 5, 15, 3, 7, 13, 17, 1], extra: { key: 2 } }, worst: true, noteHe: 'שרשרת מקרי-1 שמטפסת את כל הגובה — מירב עבודת התיקון O(log n).' },
  ],
}
