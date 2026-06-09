import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import type { AlgorithmSpec } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import ComplexityPill from '@/core/components/ComplexityPill'
import CollapsibleSection from '@/core/components/CollapsibleSection'
import { rotationsSpec } from '../algorithms/rotations'
import { rbInsertSpec } from '../algorithms/rbInsert'
import { rbDeleteSpec } from '../algorithms/rbDelete'

const TABLE: { spec: AlgorithmSpec; descHe: string; noteHe: string }[] = [
  { spec: rotationsSpec, descHe: 'שינוי מבנה מקומי', noteHe: 'מספר קבוע של מצביעים' },
  { spec: rbInsertSpec, descHe: 'הכנסה + תיקון', noteHe: '≤2 סיבובים' },
  { spec: rbDeleteSpec, descHe: 'מחיקה + תיקון', noteHe: '≤3 סיבובים' },
]

const PROPS: React.ReactNode[] = [
  <>כל צומת הוא <b>אדום</b> או <b>שחור</b>.</>,
  <>כל עלה (<Tex>NIL</Tex>) הוא <b>שחור</b>.</>,
  <>אם צומת אדום — <b>שני ילדיו שחורים</b> (אין שני אדומים רצופים במסלול).</>,
  <>כל מסלול מצומת לעלה-צאצא מכיל את <b>אותו מספר צמתים שחורים</b> (גובה-שחור).</>,
  <>השורש <b>תמיד שחור</b>.</>,
]

const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'איזון = שני תת-העצים באותו גובה בדיוק.',
    right: 'עץ RB אינו מאוזן בקפדנות. הוא מבטיח רק שאף מסלול אינו ארוך מפי 2 מהקצר ביותר — וזה מספיק ל-h = O(log n).',
  },
  {
    wrong: 'צומת חדש מוכנס בצבע שחור.',
    right: 'תמיד אדום. אדום עלול להפר רק את תכונה 3 (שני אדומים רצופים) — הפרה "מקומית" שקל לתקן; שחור היה מפר מיד את תכונה 4 בכל מסלול.',
  },
  {
    wrong: 'גובה-שחור סופר את כל הצמתים במסלול.',
    right: 'רק את השחורים (לא כולל הצומת עצמו, כולל את עלה ה-NIL). תכונה 4 דורשת שגובה-השחור יהיה זהה בכל המסלולים.',
  },
  {
    wrong: 'סיבוב משנה את סדר המפתחות בעץ.',
    right: 'סיבוב שומר את הסדר התוך-סדרי (תכונת ה-BST) — הוא רק "מגלגל" תת-עץ. לכן מותר להשתמש בו לאיזון.',
  },
  {
    wrong: 'מחיקה תמיד דורשת תיקון.',
    right: 'רק אם הצומת שהוסר בפועל היה שחור (אז נוצר "שחור כפול"). מחיקת צומת אדום אינה מפרה דבר.',
  },
  {
    wrong: 'התיקון עלול לעלות O(n).',
    right: 'התיקון מבצע מספר קבוע של סיבובים + טיפוס לאורך מסלול יחיד שאורכו O(log n). לכן הכנסה ומחיקה הן O(log n).',
  },
]

function DeepLink({ tour, children }: { tour: string; children: React.ReactNode }) {
  return (
    <Link
      to={lecturePath('algorithms', 'red-black-tree', { algo: tour })}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
    >
      🎬 {children}
    </Link>
  )
}

const SECTION_IDS = ['motivation', 'props', 'bh', 'height', 'rotations', 'insert', 'delete', 'table', 'mistakes', 'see'] as const
type SectionId = (typeof SECTION_IDS)[number]

export default function RedBlackSummary() {
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
            filename: 'red-black-trees-summary.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', ignoreElements: (n: Element) => n.classList?.contains('no-print') },
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
        <button onClick={() => setAll(!allOpen)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100">
          {allOpen ? 'כווץ הכל' : 'הרחב הכל'}
        </button>
        <button onClick={exportPdf} disabled={exporting} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:opacity-60">
          <svg className={`h-4 w-4 ${exporting ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {exporting ? <path d="M21 12a9 9 0 1 1-6.219-8.56" /> : <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />}
          </svg>
          {exporting ? 'מייצא…' : 'ייצא ל-PDF'}
        </button>
      </div>

      <div ref={contentRef} className="flex flex-col gap-4 bg-slate-50">
        {exporting && <h1 className="px-1 pb-1 text-2xl font-extrabold text-slate-900">סיכום — עצים אדומים-שחורים (Red-Black Trees)</h1>}

        <CollapsibleSection title="מוטיבציה" open={open.motivation} onToggle={() => toggle('motivation')}>
          <p className="leading-relaxed text-slate-600">
            בעץ חיפוש רגיל כל הפעולות עולות <Tex>{'O(h)'}</Tex>, אך הגובה <Tex>h</Tex> עלול להגיע ל-<Tex>n</Tex> בעץ נטוי.
            עץ אדום-שחור מוסיף לכל צומת <b>צבע</b> וחמישה כללים מבניים שמבטיחים <Tex>{'h = O(\\log n)'}</Tex> —
            וכך <b>כל</b> פעולות הקבוצה הדינמית רצות ב-<Tex>{'O(\\log n)'}</Tex> במקרה הגרוע.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="חמש תכונות העץ האדום-שחור" open={open.props} onToggle={() => toggle('props')}>
          <ol className="flex flex-col gap-2">
            {PROPS.map((p, i) => (
              <li key={i} className="flex items-baseline gap-2 leading-relaxed text-slate-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </CollapsibleSection>

        <CollapsibleSection title="גובה-שחור (black-height)" open={open.bh} onToggle={() => toggle('bh')}>
          <p className="leading-relaxed text-slate-600">
            גובה-השחור <Tex>{'bh(x)'}</Tex> של צומת <Tex>x</Tex> הוא מספר הצמתים השחורים במסלול מ-<Tex>x</Tex> (לא כולל
            אותו) אל עלה-צאצא כלשהו. תכונה 4 מבטיחה שהמספר זהה בכל המסלולים — ולכן <Tex>{'bh(x)'}</Tex> מוגדר היטב.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="חסם הגובה: h ≤ 2·lg(n+1)" open={open.height} onToggle={() => toggle('height')}>
          <p className="leading-relaxed text-slate-600">למה: עץ אדום-שחור עם <Tex>n</Tex> צמתים פנימיים מקיים</p>
          <div className="my-3 rounded-xl bg-slate-50 p-4 text-center"><Tex block>{'h \\le 2\\lg(n+1)'}</Tex></div>
          <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
            <li>טענת עזר: תת-עץ ששורשו <Tex>x</Tex> מכיל לפחות <Tex>{'2^{bh(x)} - 1'}</Tex> צמתים פנימיים (אינדוקציה על הגובה).</li>
            <li>מתכונה 3, לפחות חצי מהצמתים בכל מסלול שחורים, ולכן <Tex>{'bh(\\text{root}) \\ge h/2'}</Tex>.</li>
            <li>מכאן <Tex>{'n \\ge 2^{h/2} - 1'}</Tex>, וברישום הופכי: <Tex>{'h \\le 2\\lg(n+1) = O(\\log n)'}</Tex>.</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="סיבובים — שומרי הסדר" open={open.rotations} onToggle={() => toggle('rotations')}>
          <p className="leading-relaxed text-slate-600">
            הכלי לשינוי מבנה: <b>Left-Rotate</b> מעלה את הילד הימני, <b>Right-Rotate</b> את השמאלי. שניהם מעדכנים מספר
            קבוע של מצביעים (<Tex>{'O(1)'}</Tex>) ו<b>שומרים את הסדר התוך-סדרי</b> — לכן מותר לאזן בעזרתם בלי לפגוע בתכונת ה-BST.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="הכנסה — שלושת המקרים" open={open.insert} onToggle={() => toggle('insert')}>
          <p className="mb-2 leading-relaxed text-slate-600">מכניסים עלה <b>אדום</b>; אם ההורה אדום (הפרת תכונה 3), מתקנים לפי הדוד (אח ההורה):</p>
          <ul className="flex flex-col gap-2 leading-relaxed text-slate-600">
            <li><b>מקרה 1 — הדוד אדום:</b> צובעים הורה+דוד שחור, סבא אדום, וממשיכים לתקן מהסבא (העלאת ההפרה מעלה).</li>
            <li><b>מקרה 2 — הדוד שחור, z "משולש":</b> סיבוב על ההורה כדי להפוך למקרה 3.</li>
            <li><b>מקרה 3 — הדוד שחור, z "קו ישר":</b> צביעה מחדש + סיבוב על הסבא — וההפרה נפתרת.</li>
          </ul>
          <p className="mt-2 text-sm text-slate-500">(אם ההורה ימני — מקרים 1–3 סימטריים, החלפת שמאל↔ימין.)</p>
        </CollapsibleSection>

        <CollapsibleSection title="מחיקה — ארבעת המקרים (שחור כפול)" open={open.delete} onToggle={() => toggle('delete')}>
          <p className="mb-2 leading-relaxed text-slate-600">
            מוחקים כמו ב-BST. אם הצומת שהוסר בפועל היה <b>שחור</b>, נוצר "<b>שחור כפול</b>" ב-<Tex>x</Tex> שמופץ מעלה עד שנפתר, לפי האח <Tex>w</Tex>:
          </p>
          <ul className="flex flex-col gap-2 leading-relaxed text-slate-600">
            <li><b>מקרה 1 — האח אדום:</b> צביעה + סיבוב על ההורה, להפיכת האח לשחור (מעבר למקרים 2–4).</li>
            <li><b>מקרה 2 — האח שחור, שני ילדיו שחורים:</b> צובעים את האח אדום ומעלים את השחור-הכפול להורה.</li>
            <li><b>מקרה 3 — האח שחור, הילד הרחוק שחור:</b> צביעה + סיבוב על האח (מעבר למקרה 4).</li>
            <li><b>מקרה 4 — האח שחור, הילד הרחוק אדום:</b> צביעה + סיבוב על ההורה — השחור הכפול נפתר וסיימנו.</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="טבלת סיבוכיות" open={open.table} onToggle={() => toggle('table')}>
          <p className="mb-3 text-sm text-slate-500">כל פעולות הקבוצה הדינמית (חיפוש, מינ׳/מקס׳, עוקב/קודם) עולות <Tex>{'O(\\log n)'}</Tex> במקרה הגרוע — בזכות חסם הגובה.</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-center text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">פעולה</th>
                  <th className="py-2.5 px-3 font-semibold">תיאור</th>
                  <th className="py-2.5 px-3 font-semibold">סיבוכיות</th>
                  <th className="py-2.5 px-3 font-semibold">הערה</th>
                  <th className="py-2.5 px-3 font-semibold">הוכחה</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(({ spec, descHe, noteHe }) => (
                  <tr key={spec.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                    <td dir="ltr" className="py-3 px-3 text-center font-mono text-sm font-semibold text-slate-800">{spec.titleEn}</td>
                    <td className="py-3 px-3 text-slate-600">{descHe}</td>
                    <td className="py-3 px-3"><ComplexityPill tex={spec.complexity} /></td>
                    <td className="py-3 px-3 text-sm text-slate-500">{noteHe}</td>
                    <td className="py-3 px-3"><ComplexityProofButton algo={spec} variant="link" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

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

        {!exporting && (
          <div className="no-print">
            <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
              <div className="flex flex-wrap gap-2">
                <DeepLink tour="rotations">סיבובים</DeepLink>
                <DeepLink tour="rbInsert">הכנסה + תיקון</DeepLink>
                <DeepLink tour="rbDelete">מחיקה + תיקון</DeepLink>
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </div>
  )
}
