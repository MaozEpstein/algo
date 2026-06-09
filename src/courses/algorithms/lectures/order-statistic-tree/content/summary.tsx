import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import type { AlgorithmSpec } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import ComplexityPill from '@/core/components/ComplexityPill'
import CollapsibleSection from '@/core/components/CollapsibleSection'
import { osSelectSpec } from '../algorithms/osSelect'
import { osRankSpec } from '../algorithms/osRank'
import { osInsertSpec } from '../algorithms/osInsert'

const TABLE: { spec: AlgorithmSpec; descHe: string; noteHe: string }[] = [
  { spec: osSelectSpec, descHe: 'האיבר ה-i בגודלו', noteHe: 'ירידה מהשורש' },
  { spec: osRankSpec, descHe: 'דירוג מפתח', noteHe: 'טיפוס לשורש' },
  { spec: osInsertSpec, descHe: 'הכנסה + תחזוקת size', noteHe: 'ללא עלות נוספת' },
]

const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'דרגת צומת = size של תת-העץ שלו.',
    right: 'דרגתו בתת-העץ שלו היא size[left]+1. הדרגה הגלובלית מתקבלת בטיפוס לשורש (OS-Rank), בתוספת תת-העצים השמאליים שדילגנו עליהם.',
  },
  {
    wrong: 'שדה ה-size מאלץ לחשב מחדש את כל העץ בכל הכנסה.',
    right: 'לא. size[x]=size[left]+size[right]+1 תלוי רק בילדים — לכן מתחזקים אותו "בדרך" (הגדלה לאורך המסלול + עדכון 2 שדות בכל סיבוב), ב-O(log n).',
  },
  {
    wrong: 'אפשר להרחיב עץ RB בכל שדה שרוצים בחינם.',
    right: 'רק שדה שערכו בצומת ניתן לחישוב מצומת + ילדיו (משפט 14.1). אחרת תחזוקתו בסיבוב עלולה להתפשט ולפגוע בסיבוכיות.',
  },
  {
    wrong: 'OS-Select צריך לסרוק את העץ כדי לספור.',
    right: 'לא — שדה ה-size נותן את הספירה מיידית. בכל צומת משווים i ל-r=size[left]+1 ויורדים לכיוון אחד בלבד. O(log n).',
  },
  {
    wrong: 'עלי NIL נספרים ב-size.',
    right: 'לא; size של NIL הוא 0. נספרים רק צמתים פנימיים (אמיתיים).',
  },
]

function DeepLink({ tour, children }: { tour: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('algorithms', 'order-statistic-tree', { algo: tour })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      🎬 {children}
    </Link>
  )
}

const SECTION_IDS = ['motivation', 'def', 'select', 'rank', 'maintain', 'theorem', 'table', 'mistakes', 'see'] as const
type SectionId = (typeof SECTION_IDS)[number]

export default function OrderStatisticSummary() {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(
    Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as Record<SectionId, boolean>,
  )
  const [exporting, setExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const allOpen = SECTION_IDS.every((id) => open[id])
  const toggle = (id: SectionId) => setOpen((s) => ({ ...s, [id]: !s[id] }))
  const setAll = (v: boolean) => setOpen(Object.fromEntries(SECTION_IDS.map((id) => [id, v])) as Record<SectionId, boolean>)

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
        await html2pdf().set({
          margin: 10, filename: 'order-statistic-trees-summary.pdf', image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', ignoreElements: (n: Element) => n.classList?.contains('no-print') },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css', 'legacy'] },
        }).from(el).save()
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => setAll(!allOpen)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100">{allOpen ? 'כווץ הכל' : 'הרחב הכל'}</button>
        <button onClick={exportPdf} disabled={exporting} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:opacity-60">
          <svg className={`h-4 w-4 ${exporting ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {exporting ? <path d="M21 12a9 9 0 1 1-6.219-8.56" /> : <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />}
          </svg>
          {exporting ? 'מייצא…' : 'ייצא ל-PDF'}
        </button>
      </div>

      <div ref={contentRef} className="flex flex-col gap-4 bg-slate-50">
        {exporting && <h1 className="px-1 pb-1 text-2xl font-extrabold text-slate-900">סיכום — הרחבת מבני נתונים: עצי ערכי-מיקום</h1>}

        <CollapsibleSection title="מוטיבציה — למה להרחיב עץ?" open={open.motivation} onToggle={() => toggle('motivation')}>
          <p className="leading-relaxed text-slate-600">
            עץ אדום-שחור נותן חיפוש/הכנסה/מחיקה ב-<Tex>{'O(\\log n)'}</Tex>, אך אינו עונה ישירות על שאלות
            <b> ערכי-מיקום</b>: "מי האיבר ה-<Tex>i</Tex> בגודלו?" ו"מה הדרגה של מפתח נתון?". על-ידי <b>הרחבת</b> העץ
            בשדה אחד נוסף — <Tex>size</Tex> — נענה גם עליהן ב-<Tex>{'O(\\log n)'}</Tex>, בלי לפגוע בשאר הפעולות.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="עץ ערכי-מיקום — שדה ה-size" open={open.def} onToggle={() => toggle('def')}>
          <p className="leading-relaxed text-slate-600">לכל צומת <Tex>x</Tex> שומרים את גודל תת-העץ ששורשו בו:</p>
          <div className="my-3 rounded-xl bg-slate-50 p-4 text-center"><Tex block>{'size[x] = size[\\text{left}[x]] + size[\\text{right}[x]] + 1'}</Tex></div>
          <p className="leading-relaxed text-slate-600">כאשר <Tex>{'size[\\text{NIL}] = 0'}</Tex>. בויזואליזציה זה התג הצהוב שעל כל צומת.</p>
        </CollapsibleSection>

        <CollapsibleSection title="OS-Select — האיבר ה-i בגודלו" open={open.select} onToggle={() => toggle('select')}>
          <p className="leading-relaxed text-slate-600">
            בכל צומת <Tex>x</Tex> מחשבים את דרגתו בתת-העץ: <Tex>{'r = size[\\text{left}[x]] + 1'}</Tex>. אם <Tex>{'i=r'}</Tex>
            — מצאנו; אם <Tex>{'i<r'}</Tex> — האיבר בתת-העץ השמאלי; אחרת פונים ימינה ומקטינים <Tex>{'i \\leftarrow i-r'}</Tex>.
            מסלול יחיד מהשורש → <Tex>{'O(\\log n)'}</Tex>.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="OS-Rank — דירוג מפתח" open={open.rank} onToggle={() => toggle('rank')}>
          <p className="leading-relaxed text-slate-600">
            מתחילים מ-<Tex>{'r = size[\\text{left}[x]] + 1'}</Tex> ומטפסים אל השורש: בכל פעם שעולים מ<b>ילד ימני</b>,
            כל תת-העץ השמאלי של ההורה קודם ל-<Tex>x</Tex>, ולכן מוסיפים <Tex>{'size[\\text{left}[p]] + 1'}</Tex>. בסיום
            <Tex>r</Tex> הוא הדרגה. גם כאן <Tex>{'O(\\log n)'}</Tex>.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="תחזוקת ה-size בהכנסה/מחיקה" open={open.maintain} onToggle={() => toggle('maintain')}>
          <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
            <li><b>הכנסה:</b> כל צומת על מסלול הירידה אל מקום ההכנסה גָדֵל ב-1 (עבר בו איבר חדש).</li>
            <li><b>סיבוב:</b> משנה רק 2 שדות — מעדכנים <Tex>{'size[y] = size[x]'}</Tex> ואז <Tex>{'size[x] = size[\\text{left}]+size[\\text{right}]+1'}</Tex>.</li>
            <li><b>מחיקה:</b> סימטרי — הצמתים שמעל הצומת שהוסר קטֵנים ב-1, והסיבובים מתקנים מקומית.</li>
          </ul>
          <p className="mt-2 leading-relaxed text-slate-600">כל אלו עבודה קבועה לרמה → התחזוקה אינה משנה את <Tex>{'O(\\log n)'}</Tex>.</p>
        </CollapsibleSection>

        <CollapsibleSection title="משפט ההרחבה 14.1" open={open.theorem} onToggle={() => toggle('theorem')}>
          <p className="leading-relaxed text-slate-600">
            ניתן לתחזק שדה מרחיב <Tex>f</Tex> על עץ אדום-שחור בזמן <Tex>{'O(\\log n)'}</Tex> לפעולה, <b>אם</b> ערכו של <Tex>f</Tex>
            בכל צומת <Tex>x</Tex> ניתן לחישוב מהמידע שב-<Tex>x</Tex> ובילדיו בלבד. אז כל סיבוב מעדכן מספר קבוע של צמתים,
            וההפצה מעלה אינה גולשת. שדה ה-<Tex>size</Tex> הוא דוגמה מובהקת (תלוי רק בילדים).
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="טבלת סיבוכיות" open={open.table} onToggle={() => toggle('table')}>
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
                <span className="flex items-baseline gap-2 font-medium text-slate-700"><span className="text-rose-500" aria-hidden>✗</span><span className="line-through decoration-rose-300">{m.wrong}</span></span>
                <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600"><span className="text-emerald-500" aria-hidden>✓</span>{m.right}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {!exporting && (
          <div className="no-print">
            <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
              <div className="flex flex-wrap gap-2">
                <DeepLink tour="osSelect">OS-Select</DeepLink>
                <DeepLink tour="osRank">OS-Rank</DeepLink>
                <DeepLink tour="osInsert">הכנסה + תחזוקת size</DeepLink>
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </div>
  )
}
