import type { AlgorithmSpec } from '@/core/engine/types'
import { parseIntArray } from '@/core/engine/parseInput'
import { chainingBlock, directAddressBlock, openAddressingBlock, queueBlock, stackBlock } from './pseudocode'
import { runChaining } from './algorithms/chaining'
import { runOpenAddressing } from './algorithms/openAddressing'
import { runDirectAddress } from './algorithms/directAddress'
import { runStack } from './algorithms/stack'
import { runQueue } from './algorithms/queue'

/**
 * Minimal AlgorithmSpec objects — they power the ComplexityProofButton (the
 * "מדוע?" proof modal) and the summary table. They are NOT registered in the
 * lecture module (`algorithms: []`); `run`/`validateInput`/`defaultInput` are
 * required by the type but never invoked as a standalone guided algorithm.
 */

const intInput = (raw: string) => parseIntArray(raw, { min: 1, max: 12, minValue: 0, maxValue: 99 })

export const chainingSpec: AlgorithmSpec = {
  id: 'chaining',
  titleHe: 'גיבוב בשרשור',
  titleEn: 'Chaining',
  kind: 'main',
  blurbHe: 'כל תא בטבלה מצביע לרשימה מקושרת של כל המפתחות שמופו אליו; התנגשויות נפתרות בהוספה לרשימה.',
  complexity: 'O(1 + \\alpha)',
  proof: {
    result: '\\Theta(1 + \\alpha)',
    claimHe: 'בגיבוב אחיד פשוט, תוחלת זמן החיפוש בשרשור היא Θ(1+α).',
    steps: [
      { he: 'מגדירים את גורם העומס — מספר המפתחות חלקי מספר התאים:', tex: '\\alpha = n/m' },
      { he: 'חישוב h(k) וגישה לתא הם בעלות קבועה:', tex: 'O(1)' },
      { he: 'בגיבוב אחיד פשוט, תוחלת אורך השרשרת בתא היא α; חיפוש סורק אותה:', tex: 'E[\\text{אורך}] = \\alpha' },
      { he: 'חיפוש לא-מוצלח סורק את כל השרשרת; מוצלח כמחציתה בתוחלת:', tex: '\\Theta(1+\\alpha)' },
      { he: 'כאשר m = Θ(n) מתקיים α = O(1), ולכן החיפוש בזמן קבוע בתוחלת:', tex: '\\alpha = O(1) \\Rightarrow O(1)' },
    ],
    intuitionHe: 'אם הפיזור אחיד, כל שרשרת קצרה (≈α איברים) — לכן החיפוש מהיר. הכנסה בראש היא תמיד O(1).',
  },
  pseudocode: [chainingBlock],
  run: runChaining,
  validateInput: intInput,
  defaultInput: { array: [12, 7, 25, 18, 3, 10], extra: { m: 5 } },
}

export const openAddressingSpec: AlgorithmSpec = {
  id: 'openAddressing',
  titleHe: 'מיעון פתוח',
  titleEn: 'Open Addressing',
  kind: 'main',
  blurbHe: 'אין רשימות: כל המפתחות יושבים בטבלה עצמה, ובהתנגשות מגששים לתא הפנוי הבא לפי סדרת גישושים.',
  complexity: 'O\\!\\left(\\frac{1}{1-\\alpha}\\right)',
  proof: {
    result: '\\le \\dfrac{1}{1-\\alpha}',
    claimHe: 'בגיבוב אחיד, תוחלת מספר הגישושים בחיפוש לא-מוצלח חסומה ב-1/(1−α).',
    steps: [
      { he: 'כאן α = n/m < 1 (הטבלה אינה יכולה להתמלא מעבר ל-m).', tex: '\\alpha < 1' },
      { he: 'ההסתברות שתא מגושש תפוס היא ≈ α, ולכן תוחלת מספר הגישושים:', tex: '\\sum_{i\\ge0}\\alpha^{i} = \\dfrac{1}{1-\\alpha}' },
      { he: 'ככל ש-α מתקרב ל-1, מספר הגישושים מתפוצץ — לכן שומרים α נמוך.', tex: '\\alpha\\to1 \\Rightarrow \\infty' },
    ],
    intuitionHe: 'ככל שהטבלה מתמלאת, רצפי תאים תפוסים (clustering) מתארכים והגישוש יקר יותר. מחיקה דורשת "מצבה" (tombstone).',
  },
  pseudocode: [openAddressingBlock],
  run: runOpenAddressing,
  validateInput: intInput,
  defaultInput: { array: [12, 7, 25, 18, 3], extra: { m: 7 } },
}

export const directAddressSpec: AlgorithmSpec = {
  id: 'directAddress',
  titleHe: 'מיעון ישיר',
  titleEn: 'Direct Addressing',
  kind: 'main',
  blurbHe: 'טבלה עם תא לכל מפתח אפשרי; מפתח k שמור בתא k. מהיר אך בזבזני בזיכרון.',
  complexity: 'O(1)',
  proof: {
    result: 'O(1)\\ \\text{זמן},\\ \\Theta(|U|)\\ \\text{זיכרון}',
    claimHe: 'כל פעולה (הכנסה/חיפוש/מחיקה) היא O(1), אך נדרש זיכרון Θ(|U|).',
    steps: [
      { he: 'הכנסה/חיפוש/מחיקה הן גישה ישירה לאינדקס במערך:', tex: 'O(1)' },
      { he: 'אך הטבלה חייבת תא לכל מפתח אפשרי ביקום U:', tex: '\\Theta(|U|)' },
      { he: 'למפתחות בני 32 ביט: |U| = 2^{32} ≈ 4.3\\cdot10^{9} — לא ריאלי.', tex: '|U| = 2^{32}' },
    ],
    intuitionHe: 'אין התנגשויות ואין חישוב — אבל משלמים בזיכרון. גיבוב פותר זאת ע"י מיפוי לטווח קטן 0..m-1.',
  },
  pseudocode: [directAddressBlock],
  run: runDirectAddress,
  validateInput: intInput,
  defaultInput: { array: [2, 5, 8, 3], extra: { U: 10 } },
}

export const stackSpec: AlgorithmSpec = {
  id: 'stack',
  titleHe: 'מחסנית',
  titleEn: 'Stack',
  kind: 'main',
  blurbHe: 'מבנה LIFO: האחרון שנכנס ראשון יוצא. Push ו-Pop בראש המחסנית.',
  complexity: 'O(1)',
  proof: {
    result: 'O(1)',
    claimHe: 'Push ו-Pop עולים O(1) — עבודה קבועה, ללא לולאה.',
    steps: [{ he: 'Push/Pop מעדכנים מצביע top יחיד וכותבים/קוראים תא אחד:', tex: 'O(1)' }],
    intuitionHe: 'כל הפעולות מתרחשות בראש בלבד — אין צורך להזיז איברים.',
  },
  pseudocode: [stackBlock],
  run: runStack,
  validateInput: intInput,
  defaultInput: { array: [5, 8, 3, 0, 0] },
}

export const queueSpec: AlgorithmSpec = {
  id: 'queue',
  titleHe: 'תור',
  titleEn: 'Queue',
  kind: 'main',
  blurbHe: 'מבנה FIFO: הראשון שנכנס ראשון יוצא. Enqueue ב-rear, Dequeue ב-front (חיץ מעגלי).',
  complexity: 'O(1)',
  proof: {
    result: 'O(1)',
    claimHe: 'Enqueue ו-Dequeue עולים O(1) בעזרת חיץ מעגלי.',
    steps: [{ he: 'כל פעולה כותבת/קוראת תא אחד ומקדמת מצביע (מודולו m):', tex: 'O(1)' }],
    intuitionHe: 'front ו-rear מתקדמים מעגלית — אין צורך להזיז את שאר האיברים.',
  },
  pseudocode: [queueBlock],
  run: runQueue,
  validateInput: intInput,
  defaultInput: { array: [5, 8, 3, 0, 7], extra: { m: 6 } },
}
