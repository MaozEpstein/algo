import { parseIntArray } from '@/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/engine/types'
import { multBlock } from '../pseudocode'
import { Tracer } from '../tracer'
import RecursionView from '../views/RecursionView'

export function runMult(input: AlgorithmInput): Frame[] {
  const a = Math.max(0, Math.min(20, Math.round(input.array[0] ?? 3)))
  const b0 = Math.max(0, Math.min(8, Math.round(input.array[1] ?? 4)))
  const t = new Tracer('mult')
  t.emit(null, `נחשב את mult(${a}, ${b0}) = ${a} × ${b0} — כפל בעזרת חיבור חוזר.`)

  function mul(b: number): number {
    const f = t.push(`mult(${a}, ${b})`)
    t.emit(1, `נכנסים ל-mult(${a}, ${b}).`)
    t.emit(2, `תנאי בסיס: האם b == 0?`)
    if (b === 0) {
      f.status = 'base'
      f.returnTex = '0'
      f.detailHe = 'מקרה בסיס — מחזירה 0'
      t.emit(2, `מקרה בסיס: mult(${a}, 0) = 0.`)
      t.pop()
      return 0
    }
    f.status = 'waiting'
    f.detailHe = `ממתינה ל-mult(${a}, ${b - 1})`
    t.emit(3, `mult(${a}, ${b}) קוראת ל-mult(${a}, ${b - 1}).`)
    const sub = mul(b - 1)
    const r = a + sub
    f.status = 'returned'
    f.returnTex = String(r)
    f.detailHe = `מחזירה ${a} + ${sub} = ${r}`
    t.emit(3, `mult(${a}, ${b}) = ${a} + ${sub} = ${r}.`)
    t.pop()
    return r
  }

  const result = mul(b0)
  t.setResult(String(result))
  t.emit(null, `סיום: ${a} × ${b0} = ${result}. 🎉`, true)
  return t.build()
}

export const multSpec: AlgorithmSpec = {
  id: 'mult',
  titleHe: 'כפל — mult',
  titleEn: 'mult(a, b)',
  kind: 'main',
  routineLabelHe: 'פונקציה רקורסיבית',
  blurbHe:
    'מחשב a·b בעזרת חיבור חוזר בלבד. מקרה בסיס: a·0=0; מקרה כללי: a·b = a + a·(b-1). זו הדוגמה שבה הקורס מבקש "לצייר את עץ הקריאות עבור 2×3".',
  complexity: 'O(b)',
  proof: {
    result: 'O(b)',
    claimHe: 'מספר הקריאות שווה ל-b (הפרמטר השני) — כל אחת מוסיפה a פעם אחת.',
    steps: [
      { he: 'נוסחת הנסיגה לפי b:', tex: 'T(b) = T(b-1) + O(1)' },
      { he: 'ומכאן:', tex: 'T(b) = O(b)' },
    ],
    intuitionHe: 'a·b = a חיבורים של a. הרקורסיה "מפרקת" את b עד 0 ואז מחברת a בדרך חזרה.',
  },
  pseudocode: [multBlock],
  views: ['custom'],
  customViz: RecursionView,
  run: runMult,
  validateInput: (raw) => parseIntArray(raw, { min: 2, max: 2, minValue: 0, maxValue: 20 }),
  defaultInput: { array: [3, 4] },
  presets: [
    { labelHe: 'מקרה בסיס', input: { array: [3, 0] }, noteHe: 'b=0 → 0.' },
    { labelHe: '2 × 3', input: { array: [2, 3] }, noteHe: 'הדוגמה מהשיעור.' },
    { labelHe: '5 × 4', input: { array: [5, 4] } },
    {
      labelHe: 'b=8 — המקרה הגרוע ביותר',
      input: { array: [3, 8] },
      worst: true,
      noteHe: 'b הגדול ביותר — מחסנית של 8 קריאות.',
    },
  ],
}
