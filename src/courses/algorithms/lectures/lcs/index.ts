import type { LectureModule } from '@/core/engine/types'
import LcsExplainer from './LcsExplainer'

/**
 * Lecture 13 — Dynamic Programming (CLRS ch. 15). An "explainer" lecture with
 * two interactive DP demos: the Longest Common Subsequence (two-string DP table
 * + traceback) and the 0-1 Knapsack (items × capacity table + traceback), plus a
 * conceptual contrast with the fractional/greedy variant. Uses the explainer +
 * LocalPlayer pattern (string/item inputs) rather than the array-based sandbox.
 */
export const lcsLecture: LectureModule = {
  id: 'lcs',
  number: 13,
  titleHe: 'תכנון דינמי — LCS ובעיית התרמיל',
  subtitleEn: 'Dynamic Programming — LCS & Knapsack',
  views: [],
  algorithms: [],
  summary: LcsExplainer,
  explainer: true,
  glossary: [
    { term: 'תכנון דינמי', def: 'פתרון בעיה ע״י פתרון תת-בעיות חופפות פעם אחת ושמירתן בטבלה.' },
    { term: 'מבנה אופטימלי', def: 'פתרון אופטימלי לבעיה בנוי מפתרונות אופטימליים לתת-בעיות.' },
    { term: 'תת-בעיות חופפות', def: 'אותן תת-בעיות חוזרות שוב ושוב — לכן משתלם לשמור תוצאות.' },
    { term: 'תת-סדרה (subsequence)', def: 'סדרה שמתקבלת ע״י מחיקת אותיות (תוך שמירת הסדר) — אינה חייבת להיות רציפה.' },
    { term: 'LCS', def: 'תת-סדרה משותפת לשתי מחרוזות שאורכה מרבי.' },
    { term: 'טבלת c', def: 'c[i,j] = אורך ה-LCS של הקידומות באורך i ו-j.', tex: 'c[i,j]' },
    { term: 'בעיית התרמיל (0-1)', def: 'בחירת תת-קבוצת פריטים (כל פריט בשלמותו) שממקסמת ערך תחת קיבולת W.' },
    { term: 'תרמיל שברי', def: 'מותר לקחת חלקי פריט — נפתר בחמדנות לפי יחס ערך/משקל (לא בתכנון דינמי).' },
  ],
  formulas: [
    { name: 'LCS — התאמה', tex: 'c[i,j] = c[i-1,j-1] + 1', note: 'כאשר X_i = Y_j.' },
    { name: 'LCS — אי-התאמה', tex: 'c[i,j] = \\max(c[i-1,j],\\, c[i,j-1])' },
    { name: 'LCS — סיבוכיות', tex: 'O(mn)', note: 'מול O(n·2^m) בכוח-גס.' },
    { name: 'תרמיל 0-1 — נסיגה', tex: 'K[i,w] = \\max(K[i-1,w],\\, v_i + K[i-1,\\,w-w_i])', note: 'אם w_i ≤ w; אחרת K[i-1,w].' },
    { name: 'תרמיל 0-1 — סיבוכיות', tex: 'O(kW)', note: 'תרמיל שברי (חמדן): O(k\\log k).' },
  ],
}
