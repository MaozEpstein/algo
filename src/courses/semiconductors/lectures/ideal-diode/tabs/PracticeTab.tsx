import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}
const chipCls = 'rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700'
const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו']

type Part =
  | { kind: 'numeric'; prompt: string; tex: string; sub: string; res: ReactNode; accent: string; note?: ReactNode; sketch?: () => ReactNode }
  | { kind: 'concept'; prompt: string; answer: ReactNode; sketch?: () => ReactNode }
  | { kind: 'sketch'; prompt: string; render: () => ReactNode }

/** The "שאלה" prompt box (exam-style). `source` tags where the question came from. */
function QuestionBlock({ source, children }: { source?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">שאלה</span>
        {source && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
            {source}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

const labelCls = 'w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500'

function PartCard({ part, index, open, onToggle }: { part: Part; index: number; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-2 px-4 py-3 text-start transition hover:bg-slate-50">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-bold text-white">{HEB[index]}</span>
        <span className="text-sm font-medium text-slate-700"><RichText>{part.prompt}</RichText></span>
        <svg className={`ms-auto h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {part.kind === 'numeric' && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className={`${labelCls} text-slate-400`}>נוסחה</span>
                <span className="ltr text-slate-600" dir="ltr"><Tex>{part.tex}</Tex></span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className={labelCls}>הצבה</span>
                <span className="ltr text-slate-700" dir="ltr"><Tex>{part.sub}</Tex></span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={labelCls}>תוצאה</span>
                <span className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ring-1 ${part.accent}`} dir="ltr">{part.res}</span>
              </div>
              {part.note && (
                <p className="rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">💡 {part.note}</p>
              )}
            </div>
          )}
          {part.kind === 'concept' && (
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className={labelCls}>תשובה</span>
              <span className="text-sm leading-relaxed text-slate-600">{part.answer}</span>
            </div>
          )}
          {part.kind === 'sketch' && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">כך זה צריך להיראות ✏️</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2">{part.render()}</div>
            </div>
          )}
          {part.kind !== 'sketch' && part.sketch && (
            <div className="mt-3 space-y-1.5">
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">כך זה צריך להיראות ✏️</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2">{part.sketch()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Parts({ parts }: { parts: Part[] }) {
  const printing = usePrintMode()
  const [open, setOpen] = useState<boolean[]>(() => parts.map(() => printing))
  const allOpen = open.every(Boolean)
  const toggleAll = () => setOpen(parts.map(() => !allOpen))
  const toggleOne = (i: number) => setOpen((prev) => prev.map((v, k) => (k === i ? !v : v)))
  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={toggleAll} aria-expanded={allOpen} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-700">
          פתרון
          <svg className={`h-3.5 w-3.5 transition-transform ${allOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <span className="shrink-0 text-xs text-slate-400">נסו לבד — ואז «פתרון» פותח/סוגר את כל הסעיפים</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {parts.map((p, i) => (
          <PartCard key={i} part={p} index={i} open={open[i]} onToggle={() => toggleOne(i)} />
        ))}
      </div>
    </>
  )
}

type TFormula = { name: string; tex: string }

/** Collapsible "📐 נוסחאות מהתרגול" — the toolbox of formulas this question uses,
 *  each shown with its Hebrew name. Closed by default; auto-open when printing. */
function FormulaList({ formulas }: { formulas: TFormula[] }) {
  const [open, setOpen] = useState(usePrintMode())
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
      >
        <span aria-hidden>📐</span>
        נוסחאות מהתרגול
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/40">
          {formulas.map((f, i) => (
            <div key={i} className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 ${i ? 'border-t border-indigo-100' : ''}`}>
              <span className="text-sm font-semibold text-slate-700">{f.name}</span>
              <span className="ltr text-slate-800" dir="ltr"><Tex>{f.tex}</Tex></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Problem({ titleHe, source, children, parts, formulas }: { titleHe: string; source?: string; children: ReactNode; parts: Part[]; formulas?: TFormula[] }) {
  return (
    <Panel title={titleHe}>
      <QuestionBlock source={source}>{children}</QuestionBlock>
      {formulas && <FormulaList formulas={formulas} />}
      <Parts parts={parts} />
    </Panel>
  )
}

function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(usePrintMode())
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{q}</RichText></p>
        <button onClick={() => setShow((s) => !s)} aria-expanded={show} className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
          {show ? 'הסתר תשובה' : 'הצג תשובה'}
        </button>
      </div>
      {show && <p className="mt-2 leading-relaxed text-slate-600">{children}</p>}
    </div>
  )
}

/**
 * Lecture 2א — practice. The worked example is the real recitation problem
 * (תרגול 1, שאלה 2 — which wasn't solved in the session): numbers reproduced
 * faithfully from the course PDF. Plus quick knowledge self-checks.
 */
export default function PracticeTab() {
  // נוסחאות מהתרגול — ארגז הכלים של שאלה 2
  const q2Formulas: TFormula[] = [
    { name: 'חוק המסות (מיעוט בש"מ)', tex: 'n_{p0} = n_i^2/N_a' },
    { name: 'יחס איינשטיין', tex: 'D = (kT/q)\\,\\mu' },
    { name: 'אורך דיפוזיה', tex: 'L_n = \\sqrt{D_n\\,\\tau_{n0}}' },
    { name: 'זרם אלקטרונים (דיודה ארוכה)', tex: 'J_n(-x_p) = \\dfrac{eD_n n_{p0}}{L_n}\\left(e^{eV_a/kT}-1\\right)' },
    { name: 'חילוץ האילוח', tex: 'N_a \\approx \\dfrac{eD_n n_i^2}{J_n L_n}\\,e^{eV_a/kT}' },
  ]

  // תרגול 1 · שאלה 2 — סעיפים א–ב (מספרים נאמנים ל-PDF המקורי)
  const q2: Part[] = [
    {
      kind: 'concept',
      prompt: 'ציינו את ההנחות עבור קשר זרם-מתח אידיאלי.',
      answer: (
        <>
          <ul className="list-disc space-y-1 ps-5">
            <li>קירוב בולצמן (מל"מ <b>לא מנוון</b>).</li>
            <li>המל"מ <b>ניטרלי</b> מחוץ לשכבת המחסור.</li>
            <li><b>אילוח אחיד</b> לאורך כל אחד מצדדי הצומת.</li>
            <li><b>הזרקה חלשה</b> ויינון מלא (ריכוז נושאי הרוב כמעט אינו משתנה).</li>
            <li>זרם האלקטרונים והחורים בנפרד <b>רציף וקבוע</b> בתוך שכבת המחסור.</li>
            <li>הזרם הכולל בצומת <b>קבוע</b>.</li>
          </ul>
        </>
      ),
    },
    {
      kind: 'numeric',
      prompt: 'מה צריך להיות האילוח בכל צד כדי לקבל $J_n=20\\,A/cm^2$ ו-$J_p=5\\,A/cm^2$?',
      tex: 'N_a\\approx\\dfrac{eD_n n_i^{2}}{J_n L_n}\\,e^{eV_a/kT}\\;,\\quad L_n=\\sqrt{D_n\\tau}',
      sub: '=\\dfrac{1.6\\times10^{-19}\\cdot25\\cdot(1.5\\times10^{10})^{2}}{20\\cdot\\sqrt{25\\cdot5\\times10^{-7}}}\\,e^{0.65/0.026}',
      res: (
        <>
          N<sub>a</sub>≈8×10¹⁴ · N<sub>d</sub>≈2×10¹⁵&nbsp;cm⁻³
        </>
      ),
      accent: ACCENT.amber,
      note: (
        <>
          מתחילים מחוק המסות <Tex>{'n_{p0}=n_i^2/N_a'}</Tex> ומזרם הדיודה הארוכה{' '}
          <Tex>{'J_n=\\tfrac{eD_n n_{p0}}{L_n}(e^{eV_a/kT}-1)'}</Tex>, ומחלצים את <Tex>{'N_a'}</Tex>; באותו אופן{' '}
          <Tex>{'N_d'}</Tex> מזרם החורים. הצד שאמור לתת זרם <b>גדול יותר</b> (אלקטרונים) צריך אילוח <b>נמוך יותר</b>.
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          להלן <b>השאלה מתוך תרגול 1</b> של הקורס (שאלה 2 — שלא נפתרה בתרגול עצמו), סעיף-סעיף. נסו לפתור
          כל סעיף בעצמכם ורק אז «פתרון» להשוואה. אחר-כך ענו על השאלות המהירות <b>לפני</b> חשיפת התשובה.
        </p>
      </Panel>

      <Problem titleHe="תרגיל — אילוח מצפיפויות זרם" source="מתוך תרגול 1 · שאלה 2 (לא נפתרה בתרגול)" parts={q2} formulas={q2Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה דיודת <b>PN מסיליקון</b> בטמפרטורת החדר, במתח קדמי <span dir="ltr"><Tex>{'V_a=0.65\\,\\mathrm{V}'}</Tex></span>:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={chipCls} dir="ltr"><Tex>{'D_n = 25\\,\\mathrm{cm^2/s}'}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'D_p = 10\\,\\mathrm{cm^2/s}'}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'\\tau_{n0}=\\tau_{p0}=5\\times10^{-7}\\,\\mathrm{s}'}</Tex></span>
        </div>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה הזרם תלוי ב-$n_i^2$ ולכן רגיש כל-כך לטמפרטורה ולפער האסור?">
            <Tex>{'J_S\\propto n_i^2'}</Tex>, ו-<Tex>{'n_i^2\\propto e^{-E_g/kT}'}</Tex> — תלות מעריכית בטמפרטורה
            ובפער. לכן חומר עם פער קטן (Ge) נותן <Tex>{'J_S'}</Tex> גדול בהרבה, וחימום מכפיל את הזרם האחורי.
          </QA>
          <QA q="2 · למה הברך של דיודת Si נמצאת סביב 0.6–0.7V?">
            כי <Tex>{'J_S'}</Tex> זעיר, צריך גורם <Tex>{'e^{V_A/V_T}'}</Tex> עצום (~<Tex>{'10^{10}'}</Tex>) כדי
            שהזרם יגיע לערכים מעשיים — וזה קורה רק סביב <Tex>{'V_A\\approx 0.6\\!-\\!0.7\\,\\mathrm{V}'}</Tex>.
          </QA>
          <QA q="3 · מה ההבדל בין אורך הדיפוזיה $L$ לרוחב אזור המחסור $d$?">
            <Tex>{'d'}</Tex> הוא רוחב אזור המטען החשוף (פיזיקה אלקטרוסטטית, ~<Tex>{'\\mu m'}</Tex>);{' '}
            <Tex>{'L=\\sqrt{D\\tau}'}</Tex> הוא המרחק שנושא מיעוט עודף מתפזר באזור הניטרלי לפני שהוא נעלם ברקומבינציה — וקובע את
            שיפוע ההזרקה ולכן את הזרם.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
