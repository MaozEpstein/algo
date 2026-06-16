import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import MsmStructure from '../components/MsmStructure'
import MsmBandDiagram from '../components/MsmBandDiagram'
import MsmIVCurve from '../components/MsmIVCurve'

const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}
const chipCls = 'rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700'
const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']

type Part =
  | { kind: 'numeric'; prompt: string; tex: string; sub: string; res: ReactNode; accent: string; note?: ReactNode; sketch?: () => ReactNode; given?: () => ReactNode }
  | { kind: 'concept'; prompt: string; answer: ReactNode; sketch?: () => ReactNode; given?: () => ReactNode }
  | { kind: 'sketch'; prompt: string; render: () => ReactNode; given?: () => ReactNode }

function QuestionBlock({ source, children }: { source?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">שאלה</span>
        {source && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">{source}</span>
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
      {part.given && (
        <div className="px-4 pb-3">
          <span className="mb-1.5 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">נתון בשאלה</span>
          <div className="rounded-xl border border-slate-200 bg-white p-2">{part.given()}</div>
        </div>
      )}
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
              {part.note && <p className="rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">💡 {part.note}</p>}
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
        <span className="shrink-0 text-xs text-slate-400">נסו לבד — ואז «פתרון» פותח/סוגר הכול</span>
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

function FormulaList({ formulas }: { formulas: TFormula[] }) {
  const [open, setOpen] = useState(usePrintMode())
  return (
    <div className="mt-4">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100">
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
 * Lecture 2ג — practice. Real recitation (תרגול 4): a back-to-back metal-Si-metal
 * (M-S-M) structure — equilibrium band diagram & capacitance, biased band diagram
 * & voltage division, and the doubly-saturating I–V. Numbers faithful to the PDF.
 */
export default function PracticeTab() {
  const t4Formulas: TFormula[] = [
    { name: "פוט' bulk", tex: '\\Delta\\phi=kT\\ln(N_C/N_D)' },
    { name: 'כיפוף פסים', tex: '\\phi_{MS}=\\phi_B-\\Delta\\phi' },
    { name: 'רוחב מחסור (חד-צדדי)', tex: 'W=\\sqrt{2\\varepsilon\\varepsilon_0\\,\\varphi_{MS}/(qN_D)}' },
    { name: 'קיבול מחסור', tex: 'C_{dep}=A\\varepsilon\\varepsilon_0/W' },
    { name: 'שני קבלים בטור', tex: 'C_{tot}=C_{dep}/2' },
    { name: 'חלוקת מתח (גב-אל-גב)', tex: 'e^{V_1/V_T}\\!\\left(1+e^{-V_A/V_T}\\right)=2' },
    { name: 'זרם תרמיוני', tex: 'J_{RD}=A^{*}T^2e^{-\\phi_B/kT}' },
  ]

  const t4: Part[] = [
    {
      kind: 'numeric',
      prompt: 'שרטטו דיאגרמת פסי אנרגיה של המבנה בשיווי משקל. ציינו ערכים למרחקים ולכיפוף.',
      tex: '\\Delta\\phi=kT\\ln\\dfrac{N_C}{N_D}\\;,\\;\\; \\varphi_{MS}=\\dfrac{\\phi_B-\\Delta\\phi}{q}\\;,\\;\\; W=\\sqrt{\\dfrac{2\\varepsilon\\varepsilon_0\\varphi_{MS}}{qN_D}}',
      sub: '\\Delta\\phi=0.026\\ln\\dfrac{3\\times10^{19}}{3\\times10^{14}}\\approx0.3\\,,\\;\\; \\varphi_{MS}=0.5-0.3=0.2',
      res: (
        <>
          Δφ≈0.3&nbsp;eV · φ<sub>MS</sub>≈0.2&nbsp;eV · W≈0.93&nbsp;µm
        </>
      ),
      accent: ACCENT.sky,
      note: (
        <>
          בש"מ רמת פרמי <b>אחידה</b>. בתוך ה-bulk <Tex>{'E_c-E_F=\\Delta\\phi'}</Tex> (מבולצמן{' '}
          <Tex>{'N_D=N_Ce^{-\\Delta\\phi/kT}'}</Tex>). כיפוף הפסים בכל מגע הוא <Tex>{'\\varphi_{MS}=\\phi_B-\\Delta\\phi'}</Tex>,
          ורוחב המחסור מחושב כמו צומת חד-צדדי <Tex>{'p^{++}n'}</Tex>.
        </>
      ),
      given: () => <MsmStructure />,
      sketch: () => <MsmBandDiagram mode="eq" />,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את הקיבול לאות-קטן במבנה בשיווי משקל.',
      tex: 'C_{dep}=\\dfrac{A\\varepsilon\\varepsilon_0}{W}\\;,\\;\\; C_{tot}=\\dfrac{C_{dep}}{2}',
      sub: '=\\dfrac{10^{-6}\\cdot11.7\\cdot8.85\\times10^{-14}}{0.93\\times10^{-4}}',
      res: (
        <>
          C<sub>dep</sub>≈11&nbsp;fF · C<sub>tot</sub>≈5.5&nbsp;fF
        </>
      ),
      accent: ACCENT.amber,
      note: <>שני המגעים = <b>שני קבלי מחסור בטור</b>, ולכן הקיבול הכולל הוא חצי מקיבול מגע יחיד.</>,
    },
    {
      kind: 'numeric',
      prompt: 'מחברים ממתח $V_A=1\\,\\mathrm{V}$. מהו מצב כל צומת, ומה המתח על כל אחד?',
      tex: 'J_1=J_2\\;\\Rightarrow\\; e^{V_1/V_T}\\!\\left(1+e^{-V_A/V_T}\\right)=2',
      sub: 'V_1=V_T\\ln2\\,,\\;\\; V_2=V_A-V_1',
      res: (
        <>
          V<sub>1</sub>≈0.018&nbsp;V (קדמי) · V<sub>2</sub>≈0.982&nbsp;V (אחורי) · W<sub>1</sub>≈0.89&nbsp;µm · W<sub>2</sub>≈2.26&nbsp;µm
        </>
      ),
      accent: ACCENT.violet,
      note: (
        <>
          הזרם <b>אחיד</b> בהתקן, אז משווים את זרם הצומת הקדמי (1) לזרם הצומת האחורי (2). מתקבל ש<b>רוב המתח</b>{' '}
          נופל על הצומת ה<b>אחורי</b> (2) — בדיוק כמו דיודה אחת אחורית. <Tex>{'W_1<W_2'}</Tex> כי כיפוף הפסים בצומת 2
          גדל ב-<Tex>{'V_2'}</Tex>.
        </>
      ),
      given: () => <MsmStructure biased />,
      sketch: () => <MsmBandDiagram mode="bias" />,
    },
    {
      kind: 'concept',
      prompt: 'שרטטו אופיין זרם-מתח של ההתקן.',
      answer: (
        <>
          תמיד <b>אחד</b> משני הצמתים נמצא בממתח אחורי, ולכן הזרם נשלט ע"י זרם הרוויה התרמיוני שלו ומסתפק ב-
          <Tex>{'I\\approx AJ_{RD}'}</Tex> עם <Tex>{'J_{RD}=A^{*}T^2e^{-\\phi_B/kT}'}</Tex> <b>קבוע</b>. התוצאה: ההתקן{' '}
          <b>רווי בשני כיווני המתח</b> (ב-<Tex>{'+J_{RD}'}</Tex> ל-<Tex>{'V>0'}</Tex> וב-<Tex>{'-J_{RD}'}</Tex> ל-
          <Tex>{'V<0'}</Tex>) — לא מיישר.
        </>
      ),
      sketch: () => <MsmIVCurve />,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          להלן <b>תרגול 4 — דיודת שוטקי</b> (מבנה מתכת–מל"מ–מתכת). נסו לפתור כל סעיף — כולל השרטוטים — ורק אז
          «פתרון». כפתור <b>«נוסחאות מהתרגול»</b> מרכז את ארגז הכלים.
        </p>
      </Panel>

      <Problem titleHe="מבנה מתכת–מל&quot;מ–מתכת (M-S-M)" source="מתוך תרגול 4 · שאלה" parts={t4} formulas={t4Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          פיסת <b>Si</b> מסוממת נמוך עם מגעי מתכת משני צדדיה (גובה מחסום <span dir="ltr"><Tex>{'\\phi_B=0.5\\,\\mathrm{eV}'}</Tex></span>):
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={chipCls} dir="ltr"><Tex>{'N_D=3\\times10^{14}\\,\\mathrm{cm^{-3}}'}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'N_C=3\\times10^{19}\\,\\mathrm{cm^{-3}}'}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'\\varepsilon=11.7'}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'A=10\\times10\\,\\mu m^2'}</Tex></span>
        </div>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה מבנה M-S-M סימטרי *לא מיישר*, בניגוד לדיודת שוטקי בודדת?">
            כי בכל כיוון מתח, אחד משני הצמתים נמצא תמיד ב<b>ממתח אחורי</b> ומגביל את הזרם לזרם הרוויה שלו. לכן
            הזרם רווי בשני הכיוונים — אין הולכה חופשית באף כיוון.
          </QA>
          <QA q="2 · למה דיודת שוטקי *בודדת* נדלקת במתח נמוך מדיודת PN?">
            כי <Tex>{'J_{RD}=A^{*}T^2e^{-\\phi_B/kT}'}</Tex> גדול בהרבה מזרם הרוויה <Tex>{'J_S\\propto n_i^2'}</Tex> של
            דיודת PN, ולכן הזרם מגיע לערכים מעשיים כבר במתח קדמי נמוך יותר.
          </QA>
          <QA q="3 · מדוע דיודת שוטקי *מהירה* (אין reverse-recovery)?">
            הזרם נישא ב<b>נושאי-רוב</b> בלבד — אין מטען-מיעוט אגור שצריך לפנות בכיבוי, ולכן אין שלב אגירה והמיתוג
            מהיר מאוד.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
