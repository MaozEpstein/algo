import type { LectureModule, ViewKind } from '@/core/engine/types'
import { rotationsSpec } from './algorithms/rotations'
import { rbInsertSpec } from './algorithms/rbInsert'
import { rbDeleteSpec } from './algorithms/rbDelete'
import RbTreeView from './views/RbTreeView'
import RedBlackSummary from './content/summary'

/**
 * Lecture 11 — Red-Black Trees (CLRS ch. 13). A guided lecture extending the
 * BST lesson with a node-color dimension + black NIL sentinels: rotations,
 * RB-Insert (+fixup, 3 cases) and RB-Delete (+fixup, 4 cases), all over the
 * shared RbTreeView. Every operation is O(log n) worst-case.
 */
const CUSTOM: ViewKind[] = ['custom']
const ALGORITHMS = [rotationsSpec, rbInsertSpec, rbDeleteSpec].map((spec) => ({
  ...spec,
  views: CUSTOM,
  customViz: RbTreeView,
}))

export const redBlackTreeLecture: LectureModule = {
  id: 'red-black-tree',
  number: 11,
  titleHe: 'עצים אדומים-שחורים',
  subtitleEn: 'Red-Black Trees',
  views: ['custom'],
  customViz: RbTreeView,
  algorithms: ALGORITHMS,
  summary: RedBlackSummary,
  glossary: [
    { term: 'עץ אדום-שחור', def: 'עץ חיפוש בינארי שכל צומת בו צבוע אדום/שחור, עם כללים שמבטיחים גובה O(log n).' },
    { term: 'תכונה 3', def: 'אם צומת אדום — שני ילדיו שחורים. אין שני אדומים רצופים במסלול.' },
    { term: 'תכונה 4', def: 'כל מסלול מצומת לעלה-צאצא מכיל אותו מספר צמתים שחורים.' },
    { term: 'גובה-שחור bh(x)', def: 'מספר הצמתים השחורים במסלול מ-x (לא כולל אותו) אל עלה-צאצא.', tex: 'bh(x)' },
    { term: 'עלה NIL', def: 'עלה-קצה שחור (sentinel). כל "צומת אמיתי" הוא פנימי ובעל שני ילדים (אולי NIL).' },
    { term: 'שחור כפול', def: 'במחיקת צומת שחור x "סופג" שחור נוסף; Delete-Fixup מפיץ אותו עד שנפתר.' },
    { term: 'סיבוב', def: 'פעולת O(1) לשינוי מבנה ששומרת על הסדר התוך-סדרי (תכונת ה-BST).' },
  ],
  formulas: [
    { name: 'חסם הגובה', tex: 'h \\le 2\\lg(n+1)', note: 'h = O(log n) — לכן כל הפעולות O(log n).' },
    { name: 'טענת עזר (גודל תת-עץ)', tex: '\\text{size}(x) \\ge 2^{bh(x)} - 1' },
    { name: 'גובה-שחור מינימלי', tex: 'bh(\\text{root}) \\ge h/2', note: 'לפחות חצי מהמסלול שחור (תכונה 3).' },
    { name: 'עלות פעולות', tex: 'O(\\log n)', note: 'חיפוש, הכנסה, מחיקה, מינ׳/מקס׳, עוקב/קודם — במקרה הגרוע.' },
  ],
  symbols: [
    { sym: 'h', he: 'גובה העץ' },
    { sym: 'bh(x)', he: 'גובה-השחור של הצומת $x$' },
    { sym: 'color[x]', he: 'צבע הצומת — $RED$ או $BLACK$' },
    { sym: 'NIL', he: 'עלה-הקצה השחור המשותף (sentinel)' },
    { sym: 'w', he: 'האח (sibling) של $x$ בתיקון המחיקה' },
  ],
}
