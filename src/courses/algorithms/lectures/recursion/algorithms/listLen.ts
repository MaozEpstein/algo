import { parseIntArray } from '@/core/engine/parseInput'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { listLenBlock } from '../pseudocode'
import { Tracer } from '../tracer'
import RecursionView from '../views/RecursionView'

export function runListLen(input: AlgorithmInput): Frame[] {
  const list = input.array.slice(0, 6)
  const t = new Tracer('listLen')
  t.emit(null, `נחשב את אורך הרשימה [${list.join(', ')}] — באופן רקורסיבי.`)

  function len(lst: number[]): number {
    const f = t.push(`listLen([${lst.join(', ')}])`)
    t.emit(1, `נכנסים ל-listLen על רשימה באורך ${lst.length}.`)
    t.emit(2, `תנאי בסיס: האם הרשימה ריקה?`)
    if (lst.length === 0) {
      f.status = 'base'
      f.returnTex = '0'
      f.detailHe = 'רשימה ריקה — מחזירה 0'
      t.emit(2, `מקרה בסיס: listLen([]) = 0.`)
      t.pop()
      return 0
    }
    f.status = 'waiting'
    f.detailHe = `ממתינה ל-listLen של השארית (בלי ${lst[0]})`
    t.emit(3, `מורידים את האיבר הראשון (${lst[0]}) וקוראים על השאר.`)
    const sub = len(lst.slice(1))
    const r = 1 + sub
    f.status = 'returned'
    f.returnTex = String(r)
    f.detailHe = `מחזירה 1 + ${sub} = ${r}`
    t.emit(3, `listLen = 1 + ${sub} = ${r}.`)
    t.pop()
    return r
  }

  const result = len(list)
  t.setResult(String(result))
  t.emit(null, `סיום: אורך הרשימה = ${result}. 🎉`, true)
  return t.build()
}

export const listLenSpec: AlgorithmSpec = {
  id: 'listLen',
  titleHe: 'אורך רשימה — listLen',
  titleEn: 'listLen(lst)',
  kind: 'main',
  routineLabelHe: 'פונקציה רקורסיבית',
  blurbHe:
    'מחשב את אורך הרשימה רקורסיבית. מקרה בסיס: אורך הרשימה הריקה הוא 0; מקרה כללי: 1 + אורך השארית (הרשימה בלי האיבר הראשון). דוגמה לרקורסיה על מבנה נתונים ולא על מספר.',
  complexity: 'O(n)',
  proof: {
    result: 'O(n)',
    claimHe: 'יש קריאה אחת לכל איבר ברשימה (n איברים) ועוד קריאת בסיס.',
    steps: [
      { he: 'בכל צעד מסירים איבר אחד וקוראים על השאר:', tex: 'T(n) = T(n-1) + O(1)' },
      { he: 'ומכאן:', tex: 'T(n) = O(n)' },
    ],
    intuitionHe:
      'הרקורסיה "מקלפת" איבר בכל קריאה עד הרשימה הריקה, ואז סופרת 1 לכל איבר בדרך חזרה.',
  },
  pseudocode: [listLenBlock],
  views: ['custom'],
  customViz: RecursionView,
  run: runListLen,
  validateInput: (raw) => parseIntArray(raw, { min: 1, max: 6 }),
  defaultInput: { array: [3, 1, 4, 1, 5] },
  presets: [
    { labelHe: 'רשימה קצרה', input: { array: [10, 20] } },
    { labelHe: 'איבר אחד', input: { array: [7] } },
    { labelHe: 'רשימה', input: { array: [3, 1, 4, 1, 5] } },
    {
      labelHe: '6 איברים — המקרה הגרוע ביותר',
      input: { array: [2, 4, 6, 8, 10, 12] },
      worst: true,
      noteHe: 'הרשימה הארוכה ביותר — מחסנית של 7 קריאות.',
    },
  ],
}
