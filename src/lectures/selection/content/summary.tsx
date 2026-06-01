import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AlgorithmSpec } from '@/engine/types'
import Tex from '@/components/Tex'
import RoutineBadge from '@/components/RoutineBadge'
import ComplexityProofButton from '@/components/ComplexityProofButton'
import CollapsibleSection from '@/components/CollapsibleSection'
import { minMaxSpec } from '../algorithms/minMax'
import { randomizedSelectSpec } from '../algorithms/randomizedSelect'
import { selectSpec } from '../algorithms/select'

const ALGOS: AlgorithmSpec[] = [minMaxSpec, randomizedSelectSpec, selectSpec]

const TABLE: { spec: AlgorithmSpec; descHe: string; noteHe: string }[] = [
  { spec: minMaxSpec, descHe: 'מינימום ומקסימום', noteHe: '~3n/2 השוואות' },
  { spec: randomizedSelectSpec, descHe: 'בחירה אקראית', noteHe: 'תוחלת; גרוע O(n²)' },
  { spec: selectSpec, descHe: 'בחירה דטרמיניסטית', noteHe: 'רשות; קבוע גדול' },
]

const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'כדי למצוא את האיבר ה-i צריך למיין קודם את כל המערך.',
    right: 'לא — Select מוצא אותו ב-O(n) בעזרת חלוקות בלבד, בלי מיון מלא (O(n log n)).',
  },
  {
    wrong: '"האיבר ה-i הקטן ביותר" הוא הערך i.',
    right: 'זהו האיבר שיופיע במקום ה-i אילו המערך היה ממוין — לא בהכרח הערך i.',
  },
  {
    wrong: 'רנדומיזציה ב-RandomizedSelect משנה את הזמן הגרוע ל-O(n).',
    right: 'הגרוע נשאר O(n²); רק התוחלת היא O(n). חציון-של-חציונים נותן O(n) מובטח גם בגרוע.',
  },
  {
    wrong: 'חציון-של-חציונים הוא הבחירה המעשית הטובה ביותר.',
    right: 'הקבוע שלו גדול — יעיל מעשית רק עבור n גדול (כ-n>140 לפי הקורס), ובפועל RandomizedSelect מהיר יותר. זו הוכחה תיאורטית, חומר רשות.',
  },
]

const SECTION_IDS = ['overview', 'def', 'table', 'calls', 'see', 'mistakes'] as const
type SectionId = (typeof SECTION_IDS)[number]

function OptionalPill() {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
      רשות
    </span>
  )
}

function DeepLink({ algo, children }: { algo: string; children: React.ReactNode }) {
  return (
    <Link
      to={`/lecture/selection/guided?algo=${algo}`}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
    >
      🎬 {children}
    </Link>
  )
}

export default function SelectionSummary() {
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
            filename: 'selection-summary.pdf',
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
          <svg className={`h-4 w-4 ${exporting ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {exporting ? <path d="M21 12a9 9 0 1 1-6.219-8.56" /> : <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />}
          </svg>
          {exporting ? 'מייצא…' : 'ייצא ל-PDF'}
        </button>
      </div>

      <div ref={contentRef} className="flex flex-col gap-4 bg-slate-50">
        {exporting && (
          <h1 className="px-1 pb-1 text-2xl font-extrabold text-slate-900">סיכום — ערכי מיקום (Selection)</h1>
        )}

        <CollapsibleSection title="סקירה כללית — מה כל אלגוריתם עושה" open={open.overview} onToggle={() => toggle('overview')}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-[auto_auto_1fr] sm:items-center">
            {ALGOS.map((a) => (
              <Fragment key={a.id}>
                <span dir="ltr" className="whitespace-nowrap font-mono text-sm font-semibold text-slate-800">
                  {a.titleEn}
                </span>
                <div className="flex items-center gap-1.5 justify-self-start">
                  <RoutineBadge kind={a.kind} size="sm" />
                  {a.optional && <OptionalPill />}
                </div>
                <p className="text-start leading-relaxed text-slate-600">{a.blurbHe}</p>
              </Fragment>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="מהי בעיית הבחירה?" open={open.def} onToggle={() => toggle('def')}>
          <p className="leading-relaxed text-slate-600">
            בעיית הבחירה: בהינתן מערך ומספר <Tex>i</Tex>, למצוא את <b>האיבר ה-<Tex>i</Tex> הקטן ביותר</b> —
            כלומר האיבר שהיה מופיע במקום ה-<Tex>i</Tex> אילו מיינו את המערך. מקרים מיוחדים:{' '}
            <b>מינימום</b> (<Tex>i=1</Tex>), <b>מקסימום</b> (<Tex>i=n</Tex>) ו<b>חציון</b> (<Tex>{'i=\\lceil n/2 \\rceil'}</Tex>).
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            התובנה המרכזית: אפשר לפתור זאת ב-<Tex>{'O(n)'}</Tex> <b>בלי למיין</b> — חלוקה (Partition) כמו ב-Quicksort,
            אבל ממשיכים רק לצד שבו נמצאת התשובה.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="טבלת סיבוכיות" open={open.table} onToggle={() => toggle('table')}>
          <p className="mb-3 text-sm text-slate-500">לחצו על "מדוע?" בכל שורה כדי לראות את הוכחת הסיבוכיות.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="py-2 pe-3 text-start font-semibold">פעולה</th>
                  <th className="py-2 pe-3 text-start font-semibold">סוג</th>
                  <th className="py-2 pe-3 text-start font-semibold">תיאור</th>
                  <th className="py-2 pe-3 text-start font-semibold">סיבוכיות</th>
                  <th className="py-2 pe-3 text-start font-semibold">הערה</th>
                  <th className="py-2 text-start font-semibold">הוכחה</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(({ spec, descHe, noteHe }) => (
                  <tr key={spec.id} className="border-b border-slate-100">
                    <td dir="ltr" className="py-2.5 pe-3 text-start font-mono text-sm font-semibold text-slate-800">
                      {spec.titleEn}
                    </td>
                    <td className="py-2.5 pe-3">
                      <span className="flex items-center gap-1.5">
                        <RoutineBadge kind={spec.kind} size="sm" />
                        {spec.optional && <OptionalPill />}
                      </span>
                    </td>
                    <td className="py-2.5 pe-3 text-slate-600">{descHe}</td>
                    <td className="py-2.5 pe-3">
                      <Tex>{spec.complexity}</Tex>
                    </td>
                    <td className="py-2.5 pe-3 text-sm text-slate-500">{noteHe}</td>
                    <td className="py-2.5">
                      <ComplexityProofButton algo={spec} variant="link" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="מבנה הקריאות — מי קורא למי" open={open.calls} onToggle={() => toggle('calls')}>
          <p className="mb-3 leading-relaxed text-slate-600">
            <b>לשיעור זה אין פונקציות עזר חדשות משלו.</b> שני האלגוריתמים נשענים על{' '}
            <RoutineBadge kind="helper" size="sm" /> <b className="mx-1">Partition (Lomuto)</b> ש
            <b>נלמד כבר בשיעור 5 (Quicksort)</b> — מחלקים סביב ציר, וכאן ממשיכים רק לצד אחד (זה ההבדל מ-Quicksort).
          </p>
          <div className="flex flex-col gap-2">
            {ALGOS.filter((a) => a.usesHe?.length).map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span dir="ltr" className="font-mono font-semibold text-slate-700">{a.titleEn}</span>
                <span className="text-slate-400">קורא ל־</span>
                {a.usesHe!.map((u) => (
                  <Link
                    key={u}
                    to="/lecture/quicksort/guided?algo=lomutoPartition"
                    dir="ltr"
                    className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 font-mono text-xs text-violet-700 transition hover:bg-violet-200"
                    title="נלמד בשיעור 5 — לחצו לצפייה"
                  >
                    🔧 {u} · שיעור 5
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {!exporting && (
          <div className="no-print">
            <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
              <div className="flex flex-wrap gap-2">
                <DeepLink algo="minMax">מינימום ומקסימום</DeepLink>
                <DeepLink algo="randomizedSelect">בחירה אקראית</DeepLink>
                <DeepLink algo="select">חציון של חציונים (רשות)</DeepLink>
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
