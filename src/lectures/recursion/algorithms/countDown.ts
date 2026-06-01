import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/engine/types'
import { countDownBlock } from '../pseudocode'
import { Tracer } from '../tracer'
import RecursionView from '../views/RecursionView'

export function runCountDown(input: AlgorithmInput): Frame[] {
  const n0 = Math.max(0, Math.min(8, Math.round(input.array[0] ?? 3)))
  const t = new Tracer('countDown')
  t.emit(null, `נריץ את count_down(${n0}) — מדפיס מ-${n0} כלפי מטה. אין ערך מוחזר!`)

  function down(n: number): void {
    const f = t.push(`count_down(${n})`)
    t.emit(1, `נכנסים ל-count_down(${n}).`)
    t.printed.push(String(n))
    t.emit(2, `מדפיסים ${n}.`)
    t.emit(3, `תנאי: האם n > 0?`)
    if (n > 0) {
      f.status = 'waiting'
      f.detailHe = `קוראת ל-count_down(${n - 1})`
      t.emit(3, `count_down(${n}) קוראת ל-count_down(${n - 1}).`)
      down(n - 1)
    } else {
      f.detailHe = 'n=0 — התנאי לא מתקיים, אין קריאה נוספת'
      t.emit(3, `n=0 — מפסיקים לקרוא.`)
    }
    f.status = 'returned'
    f.returnTex = '—'
    f.detailHe = 'הקריאה הסתיימה (אין ערך מוחזר)'
    t.emit(3, `count_down(${n}) הסתיימה — נמחקת מהמחסנית.`)
    t.pop()
  }

  down(n0)
  t.emit(null, `סיום. הפלט שהודפס: ${t.printed.join(' ')}`, true)
  return t.build()
}

export const countDownSpec: AlgorithmSpec = {
  id: 'countDown',
  titleHe: 'ספירה לאחור — count_down',
  titleEn: 'count_down(n)',
  kind: 'main',
  routineLabelHe: 'פונקציה רקורסיבית',
  blurbHe:
    'מדפיס n, n-1, …, 0 — רקורסיה ללא ערך מוחזר! דוגמה ל"זרימת בקרה" טהורה: כל קריאה מדפיסה ואז קוראת לעצמה, עד שהתנאי n>0 נכשל. שימו לב שהמחסנית עדיין נבנית ומתרוקנת.',
  complexity: 'O(n)',
  proof: {
    result: 'O(n)',
    claimHe: 'יש n+1 קריאות (מ-n עד 0), כל אחת מדפיסה פעם אחת.',
    steps: [
      { he: 'נוסחת הנסיגה:', tex: 'T(n) = T(n-1) + O(1)' },
      { he: 'ומכאן:', tex: 'T(n) = O(n)' },
    ],
    intuitionHe:
      'אין כאן ערך שחוזר ומצטבר — הרקורסיה משמשת רק כדי לחזור על פעולה. בדרך חזרה הקריאות פשוט נמחקות מהמחסנית.',
  },
  pseudocode: [countDownBlock],
  views: ['custom'],
  customViz: RecursionView,
  run: runCountDown,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 1, minValue: 0, maxValue: 8 }),
  defaultInput: { array: [3] },
  presets: [
    { labelHe: 'מ-1', input: { array: [1] } },
    { labelHe: 'מ-3', input: { array: [3] } },
    { labelHe: 'מ-5', input: { array: [5] } },
    {
      labelHe: 'n=8 — המקרה הגרוע ביותר',
      input: { array: [8] },
      worst: true,
      noteHe: 'הרקורסיה העמוקה ביותר — מחסנית של 9 קריאות.',
    },
  ],
}
