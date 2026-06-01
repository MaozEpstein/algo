import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AlgorithmSpec } from '@/engine/types'
import Tex from '@/components/Tex'
import RoutineBadge from '@/components/RoutineBadge'
import ComplexityProofButton from '@/components/ComplexityProofButton'
import ComplexityPill from '@/components/ComplexityPill'
import CollapsibleSection from '@/components/CollapsibleSection'
import { maxHeapifySpec } from '../algorithms/maxHeapify'
import { buildMaxHeapSpec } from '../algorithms/buildMaxHeap'
import { heapSortSpec } from '../algorithms/heapSort'
import {
  heapExtractMaxSpec,
  heapInsertSpec,
  heapMaximumSpec,
} from '../algorithms/priorityQueue'

const ALGOS: AlgorithmSpec[] = [
  maxHeapifySpec,
  buildMaxHeapSpec,
  heapSortSpec,
  heapInsertSpec,
  heapMaximumSpec,
  heapExtractMaxSpec,
]

// The classic complexity table (transcribed from הסברים על אלגוריתמים.xlsx),
// each row linked to its spec for the "מדוע?" proof button.
const TABLE: { spec: AlgorithmSpec; descHe: string; noteHe: string }[] = [
  { spec: maxHeapifySpec, descHe: 'הצפה מטה', noteHe: 'כגובה העץ' },
  { spec: buildMaxHeapSpec, descHe: 'בניית ערימה', noteHe: 'חסם הדוק (לא n log n!)' },
  { spec: heapSortSpec, descHe: 'מיון ערימה', noteHe: 'בכל המקרים' },
  { spec: heapInsertSpec, descHe: 'הכנסה', noteHe: 'טיפוס מעלה' },
  { spec: heapMaximumSpec, descHe: 'מקסימום', noteHe: 'תמיד בשורש' },
  { spec: heapExtractMaxSpec, descHe: 'שליפת מקסימום', noteHe: 'שורש + Max-Heapify' },
]

const SECTION_IDS = ['overview', 'def', 'table', 'calls', 'insights', 'see', 'mistakes'] as const
type SectionId = (typeof SECTION_IDS)[number]

// Common exam-prep misconceptions, each paired with the correction.
const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'ערימה היא מבנה ממוין.',
    right: 'רק היחס הורה–ילד מובטח (הורה ≥ ילדיו). סריקת המערך משמאל לימין אינה נותנת סדר ממוין.',
  },
  {
    wrong: 'Build-Max-Heap עולה O(n log n).',
    right: 'הוא O(n). החסם הנאיבי (n/2 קריאות כפול O(log n)) נכון אך אינו הדוק.',
  },
  {
    wrong: 'האינדקסים מתחילים מ-0.',
    right: 'כאן המוסכמה היא 1-מבוססת: parent=⌊i/2⌋, left=2i, right=2i+1. במימוש 0-מבוסס הנוסחאות שונות.',
  },
  {
    wrong: 'HeapSort הוא מיון יציב (stable).',
    right: 'לא — הסדר היחסי של איברים בעלי מפתח שווה עלול להשתנות במהלך המיון.',
  },
  {
    wrong: 'max-heap ו-min-heap זה אותו דבר.',
    right: 'במקסימום השורש הוא האיבר הגדול ביותר; במינימום הקטן ביותר — וכל ההשוואות הפוכות.',
  },
  {
    wrong: 'HeapMaximum מסיר את המקסימום.',
    right: 'הוא רק "מציץ" ומחזיר אותו ב-O(1). ההסרה בפועל היא HeapExtractMax ב-O(log n).',
  },
]

function DeepLink({ tour, children }: { tour: string; children: React.ReactNode }) {
  return (
    <Link
      to={`/lecture/heapsort/guided?algo=${tour}`}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
    >
      🎬 {children}
    </Link>
  )
}

export default function HeapsortSummary() {
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
    setAll(true) // expand everything so nothing is missing from the PDF
    setExporting(true) // render the printed title inside the captured area
    // let React render the expanded sections + wait for fonts (KaTeX/Heebo)
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
            filename: 'heapsort-summary.pdf',
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
      {/* controls — hidden in the printed PDF */}
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

      {/* everything below is the exportable area */}
      <div ref={contentRef} className="flex flex-col gap-4 bg-slate-50">
        {exporting && (
          <h1 className="px-1 pb-1 text-2xl font-extrabold text-slate-900">
            סיכום — מיון ערימה (Heapsort)
          </h1>
        )}

      <CollapsibleSection
        title="סקירה כללית — מה כל אלגוריתם עושה"
        open={open.overview}
        onToggle={() => toggle('overview')}
      >
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

      <CollapsibleSection title="מהי ערימה (Heap)?" open={open.def} onToggle={() => toggle('def')}>
        <p className="leading-relaxed text-slate-600">
          ערימת-מקסימום היא <b>עץ בינארי כמעט-שלם</b> שבו לכל צומת מתקיים שהערך שלו{' '}
          <b>גדול-שווה לערכי ילדיו</b>. כך המקסימום תמיד יושב בשורש. שומרים אותה כמערך — והקסם
          הוא שמעבר בין מערך לעץ הוא רק חשבון אינדקסים:
        </p>
        <div className="mt-3 flex flex-wrap gap-4 rounded-xl bg-slate-50 p-4 text-slate-700">
          <span>
            הורה: <Tex>{'\\text{parent}(i)=\\lfloor i/2 \\rfloor'}</Tex>
          </span>
          <span>
            ילד שמאלי: <Tex>{'\\text{left}(i)=2i'}</Tex>
          </span>
          <span>
            ילד ימני: <Tex>{'\\text{right}(i)=2i+1'}</Tex>
          </span>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          הגובה של ערימה בת <Tex>n</Tex> איברים הוא <Tex>{'\\lfloor \\log_2 n \\rfloor'}</Tex> —
          ומכאן נובעות כל הסיבוכיות בטבלה.
        </p>
      </CollapsibleSection>

      <CollapsibleSection title="טבלת סיבוכיות" open={open.table} onToggle={() => toggle('table')}>
        <p className="mb-3 text-sm text-slate-500">
          לחצו על "מדוע?" בכל שורה כדי לראות את הוכחת הסיבוכיות, צעד-אחר-צעד.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="py-2.5 px-3 text-center font-semibold">פעולה</th>
                <th className="py-2.5 px-3 text-center font-semibold">סוג</th>
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
                  <td className="py-3 px-3">
                    <RoutineBadge kind={spec.kind} size="sm" />
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

      <CollapsibleSection
        title="מבנה הקריאות — מי קורא למי"
        open={open.calls}
        onToggle={() => toggle('calls')}
      >
        <p className="mb-3 leading-relaxed text-slate-600">
          <RoutineBadge kind="helper" size="sm" /> <b className="mx-1">Max-Heapify</b> היא
          פונקציית העזר המרכזית של השיעור. היא נקראת מתוך Build-Max-Heap, HeapSort ו-Heap-Extract-Max
          — ולכן מספיק להבין אותה היטב כדי להבין את כל השאר.
        </p>
        <div className="flex flex-col gap-2">
          {ALGOS.filter((a) => a.usesHe?.length).map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm"
            >
              <span dir="ltr" className="font-mono font-semibold text-slate-700">{a.titleEn}</span>
              <span className="text-slate-400">קורא ל־</span>
              {a.usesHe!.map((u) => (
                <span
                  key={u}
                  dir="ltr"
                  className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 font-mono text-xs text-violet-700"
                >
                  🔧 {u}
                </span>
              ))}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="תובנות מפתח" open={open.insights} onToggle={() => toggle('insights')}>
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-600">
          <li>
            <b>למה Build-Max-Heap הוא <Tex>{'O(n)'}</Tex> ולא <Tex>{'O(n\\log n)'}</Tex>?</b>{' '}
            רוב הצמתים נמוכים בעץ, וההצפה שלהם קצרה. הסכום המשוקלל מתכנס ל-<Tex>{'O(n)'}</Tex>.
          </li>
          <li>
            <b>HeapSort ממיין במקום (in place)</b> — אין צורך בזיכרון עזר, בניגוד למיון מיזוג.
          </li>
          <li>
            <b>המקסימום תמיד בשורש</b> — לכן Maximum הוא <Tex>{'O(1)'}</Tex>, וזה מה שהופך ערימה
            למימוש מצוין של תור-קדימויות.
          </li>
        </ul>
      </CollapsibleSection>

      {/* navigation links — useful on screen, excluded from the exported PDF */}
      {!exporting && (
        <div className="no-print">
          <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
            <div className="flex flex-wrap gap-2">
              <DeepLink tour="maxHeapify">Max-Heapify</DeepLink>
              <DeepLink tour="buildMaxHeap">בניית ערימה</DeepLink>
              <DeepLink tour="heapSort">מיון מלא</DeepLink>
              <DeepLink tour="heapInsert">הכנסה</DeepLink>
              <DeepLink tour="heapExtractMax">שליפת מקסימום</DeepLink>
            </div>
          </CollapsibleSection>
        </div>
      )}

      <CollapsibleSection
        title="טעויות נפוצות"
        open={open.mistakes}
        onToggle={() => toggle('mistakes')}
      >
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m) => (
            <li key={m.wrong} className="flex flex-col gap-1">
              <span className="flex items-baseline gap-2 font-medium text-slate-700">
                <span className="text-rose-500" aria-hidden>
                  ✗
                </span>
                <span className="line-through decoration-rose-300">{m.wrong}</span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>
                  ✓
                </span>
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
