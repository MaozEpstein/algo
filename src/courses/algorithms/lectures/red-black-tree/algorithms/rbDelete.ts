import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { rbDeleteBlock, rbDeleteFixupBlock, leftRotateBlock, rightRotateBlock } from '../pseudocode'
import RbTreeView from '../views/RbTreeView'
import { find, isNil, rbDelete } from '../rbtree'
import { emitTree, makeTracer } from './_trace'
import { DEFAULT_KEYS, setup, targetKey, validateKeys } from './_shared'

export function runRbDelete(input: AlgorithmInput): Frame[] {
  const { b, T } = setup(input)
  const key = targetKey(input, 1)
  b.setBlock('rbDelete').setPhase('delete')
  emitTree(b, T, 'rbDelete', `עץ אדום-שחור תקין. נמחק את המפתח ${key}.`)
  const z = find(T, key)
  if (isNil(T, z)) {
    emitTree(b, T, 'rbDelete', `המפתח ${key} אינו בעץ — אין מה למחוק.`)
    return b.build()
  }
  rbDelete(T, z, makeTracer(b, T, { zTone: 'deleted' }))
  return b.build()
}

export const rbDeleteSpec: AlgorithmSpec = {
  id: 'rbDelete',
  titleHe: 'מחיקה — RB-Delete',
  titleEn: 'RB-Delete',
  kind: 'main',
  blurbHe:
    'מוחקת כמו ב-BST; אם הצומת שהוסר בפועל היה שחור, נוצר "שחור כפול" ש-Delete-Fixup פותר ב-4 מקרים (אח אדום / אח שחור עם ילדים שחורים / סיבוב פנימי / סיבוב חיצוני). סה״כ O(log n).',
  complexity: 'O(\\log n)',
  usesHe: ['Left-Rotate', 'Right-Rotate', 'RB-Delete-Fixup', 'Tree-Minimum'],
  proof: {
    result: 'O(\\log n)',
    claimHe: 'המחיקה עולה O(log n).',
    steps: [
      { he: 'איתור הצומת והעוקב — מסלול יחיד בעץ שגובהו O(log n).', tex: 'O(\\log n)' },
      { he: 'Delete-Fixup מבצע לכל היותר 3 סיבובים; מקרה 2 מטפס מעלה O(log n) רמות.', tex: 'O(\\log n)' },
    ],
    intuitionHe: 'כמו בהכנסה — כל התיקון מתרחש לאורך מסלול יחיד מהצומת לשורש, והגובה הוא O(log n).',
  },
  pseudocode: [rbDeleteBlock, rbDeleteFixupBlock, leftRotateBlock, rightRotateBlock],
  views: ['custom'],
  customViz: RbTreeView,
  run: runRbDelete,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS, extra: { key: 1 } },
  presets: [
    { labelHe: 'מחיקת עלה אדום (מחיקת 5)', input: { array: DEFAULT_KEYS, extra: { key: 5 } }, noteHe: 'הצומת שהוסר אדום — אין תיקון כלל.' },
    { labelHe: 'מחיקה עם שחור כפול (מחיקת 1)', input: { array: DEFAULT_KEYS, extra: { key: 1 } }, noteHe: 'הוסר צומת שחור → Delete-Fixup.' },
    { labelHe: 'מחיקת צומת עם שני ילדים (מחיקת 11)', input: { array: DEFAULT_KEYS, extra: { key: 11 } }, noteHe: 'מוחלף בעוקב, ואז תיקון לפי הצבע שהוסר.' },
    { labelHe: 'מחיקת השורש (מחיקת 11 מהשורש)', input: { array: [10, 5, 15, 3, 7, 13, 17], extra: { key: 10 } }, noteHe: 'מחיקת השורש — מוחלף בעוקב.' },
    { labelHe: 'שרשרת תיקון מלאה (המקרה הגרוע ביותר)', input: { array: [10, 5, 15, 3, 7, 13, 17, 1], extra: { key: 17 } }, worst: true, noteHe: 'מחיקה שמייצרת שחור-כפול שמטפס מעלה דרך כמה מקרים — מירב עבודת התיקון.' },
  ],
}
