import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/engine/types'
import { factorialBlock } from '../pseudocode'
import { Tracer } from '../tracer'
import RecursionView from '../views/RecursionView'

export function runFactorial(input: AlgorithmInput): Frame[] {
  const n0 = Math.max(0, Math.min(8, Math.round(input.array[0] ?? 5)))
  const t = new Tracer('factorial')
  t.emit(null, `נחשב את factorial(${n0}) — עצרת.`)

  function fact(n: number): number {
    const f = t.push(`factorial(${n})`)
    t.emit(1, `נכנסים ל-factorial(${n}).`)
    t.emit(2, `תנאי בסיס: האם n ≤ 1?`)
    if (n <= 1) {
      f.status = 'base'
      f.returnTex = '1'
      f.detailHe = 'מקרה בסיס — מחזירה 1'
      t.emit(2, `מקרה בסיס: factorial(${n}) = 1.`)
      t.pop()
      return 1
    }
    f.status = 'waiting'
    f.detailHe = `ממתינה לתוצאה של factorial(${n - 1})`
    t.emit(3, `factorial(${n}) קוראת ל-factorial(${n - 1}).`)
    const sub = fact(n - 1)
    const r = n * sub
    f.status = 'returned'
    f.returnTex = String(r)
    f.detailHe = `מחזירה ${n} × ${sub} = ${r}`
    t.emit(3, `factorial(${n}) = ${n} × ${sub} = ${r}.`)
    t.pop()
    return r
  }

  const result = fact(n0)
  t.setResult(String(result))
  t.emit(null, `סיום: factorial(${n0}) = ${result}. 🎉`, true)
  return t.build()
}

export const factorialSpec: AlgorithmSpec = {
  id: 'factorial',
  titleHe: 'עצרת — factorial',
  titleEn: 'factorial(n)',
  kind: 'main',
  routineLabelHe: 'פונקציה רקורסיבית',
  blurbHe:
    'מחשב n! = 1·2·…·n. מקרה בסיס: factorial(1)=1; מקרה כללי: factorial(n)=n·factorial(n-1). שימו לב למחסנית הקריאות שגדלה עד הבסיס ואז מתרוקנת — כשכל קריאה מכפילה את הערך שחזר אליה.',
  complexity: 'O(n)',
  proof: {
    result: 'O(n)',
    claimHe: 'יש n קריאות רקורסיביות, כל אחת בעבודה קבועה — ולכן זמן הריצה (ועומק המחסנית) הם O(n).',
    steps: [
      { he: 'כל קריאה מבצעת עבודה קבועה וקוראת לעצמה עם n קטן ב-1:', tex: 'T(n) = T(n-1) + O(1)' },
      { he: 'פיתוח עד הבסיס נותן n צעדים:', tex: 'T(n) = O(n)' },
    ],
    intuitionHe: 'הרקורסיה לינארית: שרשרת של n קריאות. גם הזיכרון (גובה המחסנית) הוא O(n).',
  },
  pseudocode: [factorialBlock],
  views: ['custom'],
  customViz: RecursionView,
  run: runFactorial,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 1, minValue: 0, maxValue: 8 }),
  defaultInput: { array: [5] },
  presets: [
    { labelHe: 'מקרה בסיס', input: { array: [1] }, noteHe: 'factorial(1)=1 — בלי רקורסיה.' },
    { labelHe: 'קטן', input: { array: [3] } },
    { labelHe: 'בינוני', input: { array: [5] } },
    {
      labelHe: 'n=8 — המקרה הגרוע ביותר',
      input: { array: [8] },
      worst: true,
      noteHe: 'הרקורסיה העמוקה ביותר — מחסנית של 8 קריאות.',
    },
  ],
}
