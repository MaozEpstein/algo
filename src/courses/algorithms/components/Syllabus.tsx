import SyllabusButton, { type SyllabusLesson } from '@/core/components/SyllabusButton'

/**
 * Algorithms & Data-Structures course roadmap. Update LESSONS as lectures are
 * added. (Lesson 3 has two parts; the rest are single-topic.)
 */
const LESSONS: SyllabusLesson[] = [
  { n: 'שיעור 1', title: 'מבוא ויסודות', done: true, desc: 'סימון אסימפטוטי ($O,\\Theta,\\Omega$), ניתוח זמן-ריצה, ויסודות הקורס.' },
  { n: 'שיעור 2', title: 'רקורסיה', done: true, desc: 'כתיבה וניתוח של פונקציות רקורסיביות, ועץ הרקורסיה.' },
  {
    n: 'שיעור 3',
    title: 'אלגוריתמים רקורסיביים ונוסחאות נסיגה',
    done: true,
    parts: [
      { label: 'חלק א׳ · אלגוריתמים רקורסיביים', desc: 'הפרד-ומשול: מיון-מיזוג (Merge-Sort) ומגדלי האנוי.', done: true },
      { label: 'חלק ב׳ · נוסחאות נסיגה', desc: 'פתרון נוסחאות נסיגה — עץ רקורסיה, הצבה, ומשפט המאסטר.', done: true },
    ],
  },
  { n: 'שיעור 4', title: 'מיון ערימה', done: true, desc: 'ערימה בינארית, Heapify, Build-Heap, ו-Heapsort — מיון במקום ב-$O(n\\log n)$.' },
  { n: 'שיעור 5', title: 'מיון מהיר', done: true, desc: 'Partition ו-Quicksort, וניתוח המקרה הממוצע מול הגרוע.' },
  { n: 'שיעור 7', title: 'ערכי מיקום', done: true, desc: 'מציאת האיבר ה-$k$ בגודלו (Select), וחציון-של-חציונים ב-$O(n)$.' },
  { n: 'שיעור 8', title: 'מיון בזמן לינארי', done: true, desc: 'Counting/Radix/Bucket sort, והחסם התחתון למיון מבוסס-השוואות.' },
  { n: 'שיעור 9', title: 'מבני נתונים בסיסיים וטבלאות גיבוב', done: true, desc: 'מחסנית, תור, רשימה מקושרת, וטבלאות גיבוב (Hash Tables).' },
  { n: 'שיעור 10', title: 'עצי חיפוש בינאריים', done: true, desc: 'תכונת ה-BST, סריקה תוך-סדרית, חיפוש/הכנסה/מחיקה/עוקב ו-BSTSort — כולן ב-$O(h)$.' },
  { n: 'שיעור 11', title: 'עצים אדומים-שחורים', done: true, desc: 'איזון עצמי בעזרת צבע וסיבובים: RB-Insert ו-RB-Delete מבטיחים גובה $O(\\log n)$ במקרה הגרוע.' },
  { n: 'שיעור 12', title: 'הרחבת מבני נתונים — עצי ערכי-מיקום', done: true, desc: 'הרחבת עץ אדום-שחור בשדה $size$: OS-Select, OS-Rank ותחזוקת השדה — כולן ב-$O(\\log n)$.' },
  { n: 'שיעור 13', title: 'תכנון דינמי — LCS ובעיית התרמיל', done: true, desc: 'תכנון דינמי (תת-בעיות חופפות, מבנה אופטימלי): טבלת LCS ב-$O(mn)$ ותרמיל 0-1 ב-$O(kW)$ — מול הגרסה השברית החמדנית.' },
]

export default function Syllabus() {
  return <SyllabusButton lessons={LESSONS} />
}
