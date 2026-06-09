import type { LectureModule } from '@/core/engine/types'
import LcsExplainer from './LcsExplainer'

/**
 * Lecture 13 — Dynamic Programming: Longest Common Subsequence (CLRS ch. 15).
 * An "explainer" lecture: the page hosts an interactive LCS demo (two string
 * inputs) that plays the DP-table fill and the traceback, wrapped in explanation
 * panels. Input is two strings, so it uses the explainer + LocalPlayer pattern
 * rather than the array-based guided sandbox.
 */
export const lcsLecture: LectureModule = {
  id: 'lcs',
  number: 13,
  titleHe: 'תכנון דינמי — תת-סדרה משותפת ארוכה ביותר',
  subtitleEn: 'Dynamic Programming — LCS',
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
  ],
  formulas: [
    { name: 'נוסחת הנסיגה — התאמה', tex: 'c[i,j] = c[i-1,j-1] + 1', note: 'כאשר X_i = Y_j.' },
    { name: 'נוסחת הנסיגה — אי-התאמה', tex: 'c[i,j] = \\max(c[i-1,j],\\, c[i,j-1])' },
    { name: 'תנאי הבסיס', tex: 'c[i,0] = c[0,j] = 0' },
    { name: 'סיבוכיות', tex: 'O(mn)', note: 'מול O(n·2^m) בכוח-גס.' },
  ],
}
