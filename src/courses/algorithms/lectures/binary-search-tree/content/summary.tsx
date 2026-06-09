import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import type { AlgorithmSpec } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import RoutineBadge from '@/core/components/RoutineBadge'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import ComplexityPill from '@/core/components/ComplexityPill'
import CollapsibleSection from '@/core/components/CollapsibleSection'
import { inorderWalkSpec } from '../algorithms/inorderWalk'
import { treeSearchSpec } from '../algorithms/treeSearch'
import { treeInsertSpec } from '../algorithms/treeInsert'
import { treeMinMaxSpec } from '../algorithms/treeMinMax'
import { treeSuccessorSpec } from '../algorithms/treeSuccessor'
import { treeDeleteSpec } from '../algorithms/treeDelete'
import { bstSortSpec } from '../algorithms/bstSort'

const ALGOS: AlgorithmSpec[] = [
  inorderWalkSpec,
  treeSearchSpec,
  treeInsertSpec,
  treeMinMaxSpec,
  treeSuccessorSpec,
  treeDeleteSpec,
  bstSortSpec,
]

const TABLE: { spec: AlgorithmSpec; descHe: string; noteHe: string }[] = [
  { spec: inorderWalkSpec, descHe: 'סריקה שמאל←צומת←ימין', noteHe: 'כל צומת פעם אחת' },
  { spec: treeSearchSpec, descHe: 'חיפוש מפתח', noteHe: 'מסלול יחיד כלפי מטה' },
  { spec: treeInsertSpec, descHe: 'הכנסת מפתח', noteHe: 'חיפוש מקום + חיבור' },
  { spec: treeMinMaxSpec, descHe: 'מינימום / מקסימום', noteHe: 'הכי שמאלי / הכי ימני' },
  { spec: treeSuccessorSpec, descHe: 'איבר עוקב', noteHe: 'או יורד או מטפס — לא שניהם' },
  { spec: treeDeleteSpec, descHe: 'מחיקת מפתח', noteHe: '3 מקרים' },
  { spec: bstSortSpec, descHe: 'מיון בעזרת עץ', noteHe: 'ממוצע O(n log n), גרוע O(n²)' },
]

const TERMS: { term: React.ReactNode; def: React.ReactNode }[] = [
  { term: 'צאצא / אב-קדמון', def: <>v הוא צאצא של u אם קיים מסלול מכוון מ-u אל v; אז u הוא אב-קדמון של v.</> },
  { term: 'תת-עץ', def: <>תת-העץ ששורשו v כולל את v וכל צאצאיו, יחד עם הקשתות שביניהם.</> },
  { term: 'דרגה', def: <>מספר הילדים של צומת.</> },
  { term: 'עלה', def: <>צומת ללא ילדים. צומת פנימי = צומת שאינו עלה.</> },
  { term: <>עומק של <Tex>v</Tex></>, def: <>מספר הקשתות מהשורש אל <Tex>v</Tex> (המרחק מהשורש).</> },
  { term: <>גובה של <Tex>v</Tex></>, def: <>מספר הקשתות מ-<Tex>v</Tex> אל העלה הרחוק ביותר. גובה העץ = גובה השורש (<Tex>h</Tex>).</> },
]

const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'תכונת ה-BST היא "הילד השמאלי קטן מההורה והימני גדול".',
    right: 'התכונה חזקה יותר: כל המפתחות בכל תת-העץ השמאלי ≤ key[x] ≤ כל המפתחות בכל תת-העץ הימני — לא רק הילדים הישירים.',
  },
  {
    wrong: 'כל הפעולות עולות O(log n).',
    right: 'הן עולות O(h). רק בעץ מאוזן h=Θ(log n); בעץ נטוי h=n-1 והפעולה עולה O(n). את O(log n) מובטח רק עצים אדומים-שחורים (שיעור 11).',
  },
  {
    wrong: 'העוקב של צומת הוא תמיד ההורה שלו.',
    right: 'אם יש תת-עץ ימני — העוקב הוא המינימום שבו (יורדים). אחרת מטפסים אל האב-קדמון הראשון שאליו הגענו משמאל.',
  },
  {
    wrong: 'מחיקת צומת עם שני ילדים דורשת לבנות מחדש את העץ.',
    right: 'מעתיקים פנימה את ערך העוקב (המינימום בתת-העץ הימני) ומוחקים את העוקב — שלו לכל היותר ילד ימני אחד, ולכן הוא מקרה פשוט.',
  },
  {
    wrong: 'BSTSort עדיף על Quicksort כי הוא משתמש במבנה נתונים.',
    right: 'להפך — שניהם מבצעים את אותן השוואות, אך Quicksort עדיף: קבועים קטנים יותר, ממיין במקום, ואינו דורש לבנות מבנה עזר.',
  },
  {
    wrong: 'סריקה תוך-סדרית עובדת רק על עצים מאוזנים.',
    right: 'היא מדפיסה בסדר עולה לכל עץ חיפוש — גם נטוי — תמיד ב-Θ(n).',
  },
]

function DeepLink({ tour, children }: { tour: string; children: React.ReactNode }) {
  return (
    <Link
      to={lecturePath('algorithms', 'binary-search-tree', { algo: tour })}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
    >
      🎬 {children}
    </Link>
  )
}

const SECTION_IDS = ['overview', 'defs', 'prop', 'walks', 'table', 'sort', 'insights', 'see', 'mistakes'] as const
type SectionId = (typeof SECTION_IDS)[number]

export default function BstSummary() {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(
    Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as Record<SectionId, boolean>,
  )
  const [exporting, setExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const allOpen = SECTION_IDS.every((id) => open[id])
  const toggle = (id: SectionId) => setOpen((s) => ({ ...s, [id]: !s[id] }))
  const setAll = (value: boolean) =>
    setOpen(Object.fromEntries(SECTION_IDS.map((id) => [id, value])) as Record<SectionId, boolean>)

  async function exportPdf() {
    setAll(true)
    setExporting(true)
    await new Promise((r) => window.setTimeout(r, 500))
    await document.fonts.ready
    const el = contentRef.current
    try {
      if (el) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const html2pdf = (await import('html2pdf.js')).default as any
        await html2pdf()
          .set({
            margin: 10,
            filename: 'binary-search-trees-summary.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff',
              ignoreElements: (node: Element) => node.classList?.contains('no-print'),
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] },
          })
          .from(el)
          .save()
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setAll(!allOpen)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
        >
          {allOpen ? 'כווץ הכל' : 'הרחב הכל'}
        </button>
        <button
          onClick={exportPdf}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:opacity-60"
        >
          <svg
            className={`h-4 w-4 ${exporting ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {exporting ? (
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            ) : (
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            )}
          </svg>
          {exporting ? 'מייצא…' : 'ייצא ל-PDF'}
        </button>
      </div>

      <div ref={contentRef} className="flex flex-col gap-4 bg-slate-50">
        {exporting && (
          <h1 className="px-1 pb-1 text-2xl font-extrabold text-slate-900">
            סיכום — עצי חיפוש בינאריים (Binary Search Trees)
          </h1>
        )}

        <CollapsibleSection title="סקירה כללית — מה כל פעולה עושה" open={open.overview} onToggle={() => toggle('overview')}>
          <p className="mb-3 leading-relaxed text-slate-600">
            עץ חיפוש בינארי הוא מבנה נתונים לקבוצות דינמיות התומך בכל פעולות המילון ועוד — מינימום, מקסימום,
            עוקב וקודם — כולן בזמן <Tex>{'O(h)'}</Tex>. זה משפר על טבלת גיבוב (שאינה תומכת ביעילות בסדר), אך
            הגובה <Tex>h</Tex> עלול להיות <Tex>n</Tex> בעץ נטוי — מוטיבציה לעצים אדומים-שחורים (שיעור 11).
          </p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-[auto_auto_1fr] sm:items-center">
            {ALGOS.map((a) => (
              <Fragment key={a.id}>
                <span dir="ltr" className="whitespace-nowrap font-mono text-sm font-semibold text-slate-800">
                  {a.titleEn}
                </span>
                <div className="justify-self-start">
                  <RoutineBadge kind={a.kind} size="sm" />
                </div>
                <p className="text-start leading-relaxed text-slate-600">{a.blurbHe}</p>
              </Fragment>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="הגדרות עץ" open={open.defs} onToggle={() => toggle('defs')}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-baseline">
            {TERMS.map((t, i) => (
              <Fragment key={i}>
                <dt className="font-bold text-slate-800">{t.term}</dt>
                <dd className="text-start leading-relaxed text-slate-600">{t.def}</dd>
              </Fragment>
            ))}
          </dl>
        </CollapsibleSection>

        <CollapsibleSection title="תכונת עץ החיפוש" open={open.prop} onToggle={() => toggle('prop')}>
          <p className="leading-relaxed text-slate-600">
            לכל צומת <Tex>x</Tex>, כל המפתחות בתת-העץ השמאלי קטנים-שווים מ-<Tex>{'key[x]'}</Tex>, וכל המפתחות
            בתת-העץ הימני גדולים-שווים ממנו:
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 p-4 text-center">
            <Tex block>{'\\text{key}[\\text{leftSubtree}(x)] \\le \\text{key}[x] \\le \\text{key}[\\text{rightSubtree}(x)]'}</Tex>
          </div>
          <p className="mt-3 leading-relaxed text-slate-600">
            התכונה חלה על <b>כל תת-העץ</b> — לא רק על הילדים הישירים. היא זו שמאפשרת חיפוש בינארי לאורך מסלול
            יחיד מהשורש כלפי מטה.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="סריקות עץ" open={open.walks} onToggle={() => toggle('walks')}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div dir="ltr" className="font-mono text-sm font-bold text-slate-800">Inorder</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">שמאל ← צומת ← ימין. מדפיס בסדר <b>עולה</b>.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div dir="ltr" className="font-mono text-sm font-bold text-slate-800">Preorder</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">צומת ← שמאל ← ימין. שימושי לשכפול העץ.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div dir="ltr" className="font-mono text-sm font-bold text-slate-800">Postorder</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">שמאל ← ימין ← צומת. שימושי לשחרור העץ.</p>
            </div>
          </div>
          <p className="mt-3 leading-relaxed text-slate-600">
            סריקה <b>לרוחב</b> (BFS) עוברת רמה-רמה; סריקה <b>לעומק</b> (DFS) צוללת לכל ענף עד הסוף. שלוש הסריקות
            הרקורסיביות (in/pre/post) הן מקרים פרטיים של DFS.
          </p>
          <div className="mt-3 rounded-xl bg-emerald-50 p-4 leading-relaxed text-slate-700">
            <b>למה Inorder מדפיס בסדר עולה?</b> באינדוקציה על מבנה העץ: לפי תכונת ה-BST, כל תת-העץ השמאלי
            מכיל ערכים קטנים מ-<Tex>{'key[x]'}</Tex> וכל הימני גדולים ממנו. הסריקה מדפיסה: ⟨שמאל ממוין⟩,
            ואז <Tex>{'key[x]'}</Tex>, ואז ⟨ימין ממוין⟩ — כלומר הכול ממוין.
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="טבלת סיבוכיות" open={open.table} onToggle={() => toggle('table')}>
          <p className="mb-3 text-sm text-slate-500">
            כל הפעולות (פרט לסריקה ולמיון) עולות <Tex>{'O(h)'}</Tex>. לחצו על "מדוע?" בכל שורה לראיית ההוכחה.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-center text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3 text-center font-semibold">פעולה</th>
                  <th className="py-2.5 px-3 text-center font-semibold">תיאור</th>
                  <th className="py-2.5 px-3 text-center font-semibold">סיבוכיות</th>
                  <th className="py-2.5 px-3 text-center font-semibold">הערה</th>
                  <th className="py-2.5 px-3 text-center font-semibold">הוכחה</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(({ spec, descHe, noteHe }) => (
                  <tr key={spec.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                    <td dir="ltr" className="py-3 px-3 text-center font-mono text-sm font-semibold text-slate-800">
                      {spec.titleEn}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{descHe}</td>
                    <td className="py-3 px-3">
                      <ComplexityPill tex={spec.complexity} />
                    </td>
                    <td className="py-3 px-3 text-sm text-slate-500">{noteHe}</td>
                    <td className="py-3 px-3">
                      <ComplexityProofButton algo={spec} variant="link" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="BSTSort מול Quicksort" open={open.sort} onToggle={() => toggle('sort')}>
          <p className="leading-relaxed text-slate-600">
            <b>BSTSort</b> מכניס את כל האיברים לעץ ואז סורק תוך-סדרית. בניית העץ מבצעת בדיוק את אותן ההשוואות
            כמו <b>Quicksort</b> — השורש הוא ה"ציר" (pivot) הראשון, וכל תת-עץ הוא תת-בעיה. לכן זמן הריצה זהה:
            בממוצע <Tex>{'\\Theta(n \\log n)'}</Tex>, ובמקרה הגרוע (קלט ממוין ← עץ נטוי) <Tex>{'\\Theta(n^2)'}</Tex>.
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            <b>אז מי עדיף?</b> דווקא Quicksort, ומשלוש סיבות: קבועים קטנים יותר, מיון <b>במקום</b> (ללא זיכרון
            עזר), ואין צורך לבנות מבנה נתונים. ה-BST מנצח כשצריך <b>גם</b> את פעולות הקבוצה הדינמית (חיפוש, עוקב…),
            לא רק מיון חד-פעמי.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="תובנות מפתח" open={open.insights} onToggle={() => toggle('insights')}>
          <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-600">
            <li><b>הכול תלוי בגובה <Tex>h</Tex>:</b> כל פעולת חיפוש/הכנסה/מחיקה היא מסלול יחיד מהשורש — לכן <Tex>{'O(h)'}</Tex>.</li>
            <li><b>הסכנה — עץ נטוי:</b> הכנסה בסדר ממוין יוצרת שרשרת שבה <Tex>{'h = n-1'}</Tex>, והכול מתדרדר ל-<Tex>{'O(n)'}</Tex>.</li>
            <li><b>העוקב לעולם בלי ילד שמאלי:</b> בזכות זה, מחיקת צומת עם שני ילדים מצטמצמת תמיד למקרה פשוט.</li>
            <li><b>Inorder = מיון:</b> סריקה תוך-סדרית של BST תמיד מחזירה את המפתחות בסדר עולה.</li>
          </ul>
        </CollapsibleSection>

        {!exporting && (
          <div className="no-print">
            <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
              <div className="flex flex-wrap gap-2">
                <DeepLink tour="inorderWalk">סריקה תוך-סדרית</DeepLink>
                <DeepLink tour="treeSearch">חיפוש</DeepLink>
                <DeepLink tour="treeInsert">הכנסה</DeepLink>
                <DeepLink tour="treeMinMax">מינימום/מקסימום</DeepLink>
                <DeepLink tour="treeSuccessor">איבר עוקב</DeepLink>
                <DeepLink tour="treeDelete">מחיקה</DeepLink>
                <DeepLink tour="bstSort">מיון בעזרת עץ</DeepLink>
              </div>
            </CollapsibleSection>
          </div>
        )}

        <CollapsibleSection title="טעויות נפוצות" open={open.mistakes} onToggle={() => toggle('mistakes')}>
          <ul className="flex flex-col gap-3">
            {MISTAKES.map((m) => (
              <li key={m.wrong} className="flex flex-col gap-1">
                <span className="flex items-baseline gap-2 font-medium text-slate-700">
                  <span className="text-rose-500" aria-hidden>✗</span>
                  <span className="line-through decoration-rose-300">{m.wrong}</span>
                </span>
                <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                  <span className="text-emerald-500" aria-hidden>✓</span>
                  {m.right}
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  )
}
