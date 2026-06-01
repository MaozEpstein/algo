import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { sumBlock } from '../pseudocode'
import { Tracer } from '../tracer'
import RecursionView from '../views/RecursionView'

export function runSum(input: AlgorithmInput): Frame[] {
  const n0 = Math.max(0, Math.min(8, Math.round(input.array[0] ?? 5)))
  const t = new Tracer('sum')
  t.emit(null, `נחשב את sum(${n0}) — סכום המספרים מ-1 עד ${n0}.`)

  function sum(n: number): number {
    const f = t.push(`sum(${n})`)
    t.emit(1, `נכנסים ל-sum(${n}).`)
    t.emit(2, `תנאי בסיס: האם n == 0?`)
    if (n === 0) {
      f.status = 'base'
      f.returnTex = '0'
      f.detailHe = 'מקרה בסיס — מחזירה 0'
      t.emit(2, `מקרה בסיס: sum(0) = 0.`)
      t.pop()
      return 0
    }
    f.status = 'waiting'
    f.detailHe = `ממתינה ל-sum(${n - 1})`
    t.emit(3, `sum(${n}) קוראת ל-sum(${n - 1}).`)
    const sub = sum(n - 1)
    const r = n + sub
    f.status = 'returned'
    f.returnTex = String(r)
    f.detailHe = `מחזירה ${n} + ${sub} = ${r}`
    t.emit(3, `sum(${n}) = ${n} + ${sub} = ${r}.`)
    t.pop()
    return r
  }

  const result = sum(n0)
  t.setResult(String(result))
  t.emit(null, `סיום: sum(${n0}) = ${result}. 🎉`, true)
  return t.build()
}

export const sumSpec: AlgorithmSpec = {
  id: 'sum',
  titleHe: 'סכום — sum',
  titleEn: 'sum(n)',
  kind: 'main',
  routineLabelHe: 'פונקציה רקורסיבית',
  blurbHe:
    'מחשב את הסכום 1+2+…+n. מקרה בסיס: sum(0)=0; מקרה כללי: sum(n)=n+sum(n-1). שימו לב שהחיבור בפועל קורה בדרך "חזרה" מהמחסנית.',
  complexity: 'O(n)',
  proof: {
    result: 'O(n)',
    claimHe: 'יש n קריאות, כל אחת מוסיפה איבר אחד.',
    steps: [
      { he: 'נוסחת הנסיגה:', tex: 'T(n) = T(n-1) + O(1)' },
      { he: 'ומכאן:', tex: 'T(n) = O(n)' },
    ],
    intuitionHe: 'הסכום הסגור הוא n(n+1)/2, אבל הרקורסיה מחשבת אותו צעד-צעד בדרך חזרה מהבסיס.',
  },
  pseudocode: [sumBlock],
  views: ['custom'],
  customViz: RecursionView,
  run: runSum,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 1, minValue: 0, maxValue: 8 }),
  defaultInput: { array: [5] },
  presets: [
    { labelHe: 'מקרה בסיס', input: { array: [0] }, noteHe: 'sum(0)=0.' },
    { labelHe: 'סכום עד 4', input: { array: [4] } },
    { labelHe: 'סכום עד 6', input: { array: [6] } },
    {
      labelHe: 'n=8 — המקרה הגרוע ביותר',
      input: { array: [8] },
      worst: true,
      noteHe: 'הרקורסיה העמוקה ביותר — מחסנית של 8 קריאות.',
    },
  ],
}
