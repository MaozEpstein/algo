import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/engine/types'
import { powerBlock } from '../pseudocode'
import { Tracer } from '../tracer'
import RecursionView from '../views/RecursionView'

export function runPower(input: AlgorithmInput): Frame[] {
  const b = Math.max(0, Math.min(9, Math.round(input.array[0] ?? 2)))
  const n0 = Math.max(0, Math.min(8, Math.round(input.array[1] ?? 5)))
  const t = new Tracer('power')
  t.emit(null, `נחשב את power(${b}, ${n0}) — ${b} בחזקת ${n0}.`)

  function pow(n: number): number {
    const f = t.push(`power(${b}, ${n})`)
    t.emit(1, `נכנסים ל-power(${b}, ${n}).`)
    t.emit(2, `תנאי בסיס: האם n == 0?`)
    if (n === 0) {
      f.status = 'base'
      f.returnTex = '1'
      f.detailHe = 'מקרה בסיס — מחזירה 1'
      t.emit(2, `מקרה בסיס: power(${b}, 0) = 1.`)
      t.pop()
      return 1
    }
    f.status = 'waiting'
    f.detailHe = `ממתינה ל-power(${b}, ${n - 1})`
    t.emit(3, `power(${b}, ${n}) קוראת ל-power(${b}, ${n - 1}).`)
    const sub = pow(n - 1)
    const r = b * sub
    f.status = 'returned'
    f.returnTex = String(r)
    f.detailHe = `מחזירה ${b} × ${sub} = ${r}`
    t.emit(3, `power(${b}, ${n}) = ${b} × ${sub} = ${r}.`)
    t.pop()
    return r
  }

  const result = pow(n0)
  t.setResult(String(result))
  t.emit(null, `סיום: ${b}^${n0} = ${result}. 🎉`, true)
  return t.build()
}

export const powerSpec: AlgorithmSpec = {
  id: 'power',
  titleHe: 'חזקה — power',
  titleEn: 'power(b, n)',
  kind: 'main',
  routineLabelHe: 'פונקציה רקורסיבית',
  blurbHe:
    'מחשב bⁿ. מקרה בסיס: b⁰=1; מקרה כללי: bⁿ = b·bⁿ⁻¹. הקלט הוא שני מספרים: הבסיס b והמעריך n (החזקה יורדת ב-1 בכל קריאה).',
  complexity: 'O(n)',
  proof: {
    result: 'O(n)',
    claimHe: 'מספר הקריאות שווה למעריך n — כל אחת בעבודה קבועה.',
    steps: [
      { he: 'נוסחת הנסיגה לפי המעריך:', tex: 'T(n) = T(n-1) + O(1)' },
      { he: 'ומכאן:', tex: 'T(n) = O(n)' },
    ],
    intuitionHe: 'יש דרכים מהירות יותר (חזקה בריבועים, O(log n)) — כאן מציגים את הגרסה הרקורסיבית הפשוטה.',
  },
  pseudocode: [powerBlock],
  views: ['custom'],
  customViz: RecursionView,
  run: runPower,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 2, minValue: 0, maxValue: 9 }),
  defaultInput: { array: [2, 5] },
  presets: [
    { labelHe: 'מקרה בסיס', input: { array: [2, 0] }, noteHe: 'n=0 → 1, בלי רקורסיה.' },
    { labelHe: '2⁵', input: { array: [2, 5] } },
    { labelHe: '3⁴', input: { array: [3, 4] } },
    {
      labelHe: 'n=8 — המקרה הגרוע ביותר',
      input: { array: [2, 8] },
      worst: true,
      noteHe: 'המעריך הגדול ביותר — מחסנית של 8 קריאות.',
    },
  ],
}
