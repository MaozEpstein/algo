import type { LectureModule, ViewKind } from '@/core/engine/types'
import { inorderWalkSpec } from './algorithms/inorderWalk'
import { traversalsSpec } from './algorithms/traversals'
import { treeSearchSpec } from './algorithms/treeSearch'
import { treeInsertSpec } from './algorithms/treeInsert'
import { treeMinMaxSpec } from './algorithms/treeMinMax'
import { treeSuccessorSpec } from './algorithms/treeSuccessor'
import { treePredecessorSpec } from './algorithms/treePredecessor'
import { treeDeleteSpec } from './algorithms/treeDelete'
import { bstSortSpec } from './algorithms/bstSort'
import BstView from './views/BstView'
import BstSummary from './content/summary'

/**
 * Lecture 10 — Binary Search Trees (CLRS ch. 12). A guided lecture: every
 * dynamic-set operation is a step-by-step visualization over a pointer-based
 * tree (the shared BstView). Each algorithm overrides the view to 'custom'.
 */
const CUSTOM: ViewKind[] = ['custom']
const ALGORITHMS = [
  inorderWalkSpec,
  traversalsSpec,
  treeSearchSpec,
  treeInsertSpec,
  treeMinMaxSpec,
  treeSuccessorSpec,
  treePredecessorSpec,
  treeDeleteSpec,
  bstSortSpec,
].map((spec) => ({ ...spec, views: CUSTOM, customViz: BstView }))

export const binarySearchTreeLecture: LectureModule = {
  id: 'binary-search-tree',
  number: 10,
  titleHe: 'עצי חיפוש בינאריים',
  subtitleEn: 'Binary Search Trees',
  views: ['custom'],
  customViz: BstView,
  algorithms: ALGORITHMS,
  summary: BstSummary,
  glossary: [
    { term: 'עץ חיפוש בינארי (BST)', def: 'עץ בינארי שבו לכל צומת: כל המפתחות משמאלו ≤ key[x] ≤ כל המפתחות מימינו.' },
    { term: 'תכונת ה-BST', def: 'התכונה חלה על כל תת-עץ — לא רק על הילדים הישירים.', tex: 'key[\\text{left}(x)] \\le key[x] \\le key[\\text{right}(x)]' },
    { term: 'גובה העץ (h)', def: 'מספר הקשתות במסלול הארוך ביותר מהשורש לעלה. קובע את עלות כל הפעולות.' },
    { term: 'עומק של צומת', def: 'מספר הקשתות מהשורש אל הצומת (המרחק מהשורש).' },
    { term: 'עלה / צומת פנימי', def: 'עלה — צומת ללא ילדים; צומת פנימי — צומת שאינו עלה.' },
    { term: 'סריקה תוך-סדרית', def: 'שמאל ← צומת ← ימין; מדפיסה את מפתחות ה-BST בסדר עולה.' },
    { term: 'איבר עוקב', def: 'האיבר הבא בסדר עולה. אם יש תת-עץ ימני — המינימום שבו; אחרת אב-קדמון.' },
    { term: 'דרגת צומת', def: 'מספר הילדים של הצומת (0, 1 או 2 בעץ בינארי).' },
  ],
  formulas: [
    { name: 'תכונת עץ החיפוש', tex: 'key[\\text{leftSubtree}(x)] \\le key[x] \\le key[\\text{rightSubtree}(x)]' },
    { name: 'עלות פעולות המילון', tex: 'O(h)', note: 'חיפוש, הכנסה, מחיקה, מינ׳/מקס׳, עוקב/קודם.' },
    { name: 'גובה — מאוזן מול נטוי', tex: 'O(\\log n) \\le h \\le n-1' },
    { name: 'סריקה תוך-סדרית', tex: '\\Theta(n)', note: 'כל צומת נסרק פעם אחת.' },
    { name: 'BSTSort', tex: '\\Theta(n \\log n)\\text{ avg},\\ \\Theta(n^2)\\text{ worst}', note: 'אותן השוואות כמו Quicksort.' },
  ],
  symbols: [
    { sym: 'h', he: 'גובה העץ — המסלול הארוך ביותר מהשורש לעלה' },
    { sym: 'key[x]', he: 'המפתח של הצומת $x$' },
    { sym: 'left[x],\\ right[x]', he: 'מצביעים לילד השמאלי/הימני של $x$' },
    { sym: 'p[x]', he: 'מצביע להורה של $x$ ($NIL$ עבור השורש)' },
    { sym: 'NIL', he: 'מצביע ריק — ילד או הורה שאינו קיים' },
  ],
}
