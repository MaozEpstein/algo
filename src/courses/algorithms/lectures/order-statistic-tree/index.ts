import type { LectureModule, ViewKind } from '@/core/engine/types'
import RbTreeView from '../red-black-tree/views/RbTreeView'
import { osSelectSpec } from './algorithms/osSelect'
import { osRankSpec } from './algorithms/osRank'
import { osInsertSpec } from './algorithms/osInsert'
import OrderStatisticSummary from './content/summary'

/**
 * Lecture 12 — Augmenting Data Structures (CLRS ch. 14). Extends the lesson-11
 * red-black tree with a per-node `size` field to make an order-statistic tree:
 * OS-Select (i-th smallest), OS-Rank, and size maintenance on insertion. Reuses
 * the shared RbTreeView (now size-aware).
 */
const CUSTOM: ViewKind[] = ['custom']
const ALGORITHMS = [osSelectSpec, osRankSpec, osInsertSpec].map((spec) => ({
  ...spec,
  views: CUSTOM,
  customViz: RbTreeView,
}))

export const orderStatisticTreeLecture: LectureModule = {
  id: 'order-statistic-tree',
  number: 12,
  titleHe: 'הרחבת מבני נתונים — עצי ערכי-מיקום',
  subtitleEn: 'Augmenting Data Structures',
  views: ['custom'],
  customViz: RbTreeView,
  algorithms: ALGORITHMS,
  summary: OrderStatisticSummary,
  glossary: [
    { term: 'הרחבת מבנה נתונים', def: 'הוספת שדה/מידע לכל צומת של מבנה קיים, כדי לתמוך בפעולות נוספות.' },
    { term: 'עץ ערכי-מיקום', def: 'עץ אדום-שחור שכל צומת בו שומר את size — גודל תת-העץ שלו.' },
    { term: 'שדה size', def: 'מספר הצמתים בתת-העץ.', tex: 'size[x] = size[\\text{left}]+size[\\text{right}]+1' },
    { term: 'דרגה (rank)', def: 'מיקומו של מפתח בסדר עולה (האיבר הקטן ביותר = דרגה 1).' },
    { term: 'OS-Select', def: 'מציאת האיבר ה-i בגודלו ב-O(log n) בעזרת שדה ה-size.' },
    { term: 'OS-Rank', def: 'מציאת הדרגה של מפתח נתון ב-O(log n).' },
    { term: 'משפט ההרחבה (14.1)', def: 'שדה מרחיב התלוי רק בצומת ובילדיו ניתן לתחזוקה ב-O(log n) לפעולה.' },
  ],
  formulas: [
    { name: 'שדה ה-size', tex: 'size[x] = size[\\text{left}[x]] + size[\\text{right}[x]] + 1' },
    { name: 'דרגה בתת-העץ', tex: 'r = size[\\text{left}[x]] + 1' },
    { name: 'עלות הפעולות', tex: 'O(\\log n)', note: 'OS-Select, OS-Rank, ותחזוקת size בהכנסה/מחיקה.' },
  ],
  symbols: [
    { sym: 'size[x]', he: 'גודל תת-העץ ששורשו $x$' },
    { sym: 'i', he: 'האינדקס המבוקש ב-OS-Select (האיבר ה-$i$ בגודלו)' },
    { sym: 'r', he: 'דרגה — $size[\\text{left}]+1$' },
  ],
}
