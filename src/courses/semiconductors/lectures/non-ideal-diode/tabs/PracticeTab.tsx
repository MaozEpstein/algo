import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import NonIdealIVCurve from '../components/NonIdealIVCurve'
import {
  MATERIALS,
  fmtCurrentDensity,
  fmtVolt,
  nonIdealCurrents,
  terminalVoltage,
  thermalVoltage,
} from '../../../lib/junction'

/** A number as a KaTeX-ready "m×10ⁿ" string, for the substitution lines. */
function sciTex(n: number, digits = 1): string {
  if (n === 0) return '0'
  const exp = Math.floor(Math.log10(Math.abs(n)))
  const mant = n / 10 ** exp
  return `${mant.toFixed(digits)}\\times10^{${exp}}`
}

const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}
const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו']

type Part =
  | { kind: 'numeric'; prompt: string; tex: string; sub: string; res: ReactNode; accent: string }
  | { kind: 'concept'; prompt: string; answer: ReactNode }
  | { kind: 'sketch'; prompt: string; render: () => ReactNode }

function QuestionBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">שאלה</span>
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
        </div>
      )}
    </div>
  )
}

function Parts({ parts }: { parts: Part[] }) {
  const [open, setOpen] = useState<boolean[]>(() => parts.map(() => false))
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

function Problem({ titleHe, children, parts }: { titleHe: string; children: ReactNode; parts: Part[] }) {
  return (
    <Panel title={titleHe}>
      <QuestionBlock>{children}</QuestionBlock>
      <Parts parts={parts} />
    </Panel>
  )
}

function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(false)
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
 * Lecture 2ב — practice: extract the ideality factor from two points on a log
 * I–V, find the recombination/diffusion crossover, and estimate series
 * resistance from the high-current bend — all live from the physics helpers.
 */
export default function PracticeTab() {
  const Si = MATERIALS.Si
  const Na = 1e16
  const Nd = 1e17
  const T = 300
  const tau0 = 1e-7
  const VT = thermalVoltage(T)

  // problem 1 — extract n from two low-bias points
  const v1 = 0.25
  const v2 = 0.4
  const j1 = nonIdealCurrents(Na, Nd, Si, v1, tau0, T).Jtot
  const j2 = nonIdealCurrents(Na, Nd, Si, v2, tau0, T).Jtot
  const nExtract = (v2 - v1) / (VT * Math.log(j2 / j1))
  const p1: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חלצו את מקדם אי-האידיאליות $n$ משתי הנקודות.',
      tex: 'n=\\dfrac{V_2-V_1}{V_T\\,\\ln(J_2/J_1)}',
      sub: `=\\dfrac{${v2}-${v1}}{${VT.toFixed(4)}\\,\\ln(${sciTex(j2)}/${sciTex(j1)})}`,
      res: <>≈ {nExtract.toFixed(2)}</>,
      accent: ACCENT.sky,
    },
    {
      kind: 'concept',
      prompt: 'מה המשמעות של $n$ קרוב ל-2 בתחום הזה?',
      answer: (
        <>
          בקדמי נמוך <b>זרם הרקומבינציה</b> (<Tex>{'\\propto e^{V/2V_T}'}</Tex>) שולט על הדיפוזיה, ולכן השיפוע
          חצי — <Tex>{'n\\approx2'}</Tex>. ככל שעולים במתח הדיפוזיה משתלטת ו-<Tex>{'n'}</Tex> יורד ל-1.
        </>
      ),
    },
  ]

  // problem 2 — recombination current & crossover
  const vc = (() => {
    // scan for where Jdiff = Jrec
    let lo = 0.1
    let hi = 0.7
    for (let i = 0; i < 40; i++) {
      const m = (lo + hi) / 2
      const c = nonIdealCurrents(Na, Nd, Si, m, tau0, T)
      if (c.Jdiff > c.Jrec) hi = m
      else lo = m
    }
    return (lo + hi) / 2
  })()
  const cLow = nonIdealCurrents(Na, Nd, Si, 0.3, tau0, T)
  const p2: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את זרם הרקומבינציה $J_{rec}$ ב-$V_A=0.3\\,\\mathrm{V}$.',
      tex: 'J_{rec}=\\frac{qn_iW}{2\\tau_0}\\left(e^{V_A/2V_T}-1\\right)',
      sub: `\\tau_0=10^{-7}\\,\\mathrm{s},\\; W\\approx${sciTex(cLow.W)}\\,\\mathrm{cm}`,
      res: fmtCurrentDensity(cLow.Jrec),
      accent: ACCENT.emerald,
    },
    {
      kind: 'numeric',
      prompt: 'מצאו את מתח ה-crossover שבו דיפוזיה = רקומבינציה.',
      tex: 'J_{diff}(V_c)=J_{rec}(V_c)',
      sub: `J_{diff},J_{rec}\\to${sciTex(nonIdealCurrents(Na, Nd, Si, vc, tau0, T).Jdiff)}\\,\\mathrm{A/cm^2}`,
      res: <>{fmtVolt(vc)}</>,
      accent: ACCENT.violet,
    },
    {
      kind: 'concept',
      prompt: 'איך זמן-חיים קצר יותר ($\\tau_0\\downarrow$) מזיז את ה-crossover?',
      answer: (
        <>
          <Tex>{'\\tau_0'}</Tex> קטֵן מגדיל את <Tex>{'J_{rec}'}</Tex>, כך שהרקומבינציה שולטת עד מתח <b>גבוה יותר</b> —
          ה-crossover <b>נדחף ימינה</b> ואזור ה-<Tex>{'n=2'}</Tex> מתרחב.
        </>
      ),
    },
  ]

  // problem 3 — estimate Rs from the high-current bend
  const rs = 2
  const va = 0.6
  const vb = 0.64
  const ca = nonIdealCurrents(Na, Nd, Si, va, tau0, T)
  const cb = nonIdealCurrents(Na, Nd, Si, vb, tau0, T)
  const Va_term = terminalVoltage(va, ca.Jtot, rs)
  const Vb_term = terminalVoltage(vb, cb.Jtot, rs)
  const rsEst = (Vb_term - Va_term) / (cb.Jtot - ca.Jtot)
  const p3: Part[] = [
    {
      kind: 'numeric',
      prompt: 'אמדו את $R_S$ משתי נקודות בזרם גבוה (שיפוע הברך).',
      tex: 'R_S\\approx\\dfrac{\\Delta V_{term}}{\\Delta J}',
      sub: `=\\dfrac{${Vb_term.toFixed(3)}-${Va_term.toFixed(3)}}{${cb.Jtot.toFixed(1)}-${ca.Jtot.toFixed(1)}}`,
      res: <>≈ {rsEst.toFixed(1)} Ω·cm²</>,
      accent: ACCENT.amber,
    },
    {
      kind: 'concept',
      prompt: 'מדוע האומדן מעט *גבוה* מ-$R_S$ האמיתי (2 Ω·cm²)?',
      answer: (
        <>
          כי גם <b>מתח-הצומת</b> <Tex>{'V_j'}</Tex> עדיין עולה מעט בין שתי הנקודות, אז <Tex>{'\\Delta V_{term}'}</Tex>{' '}
          כולל תרומה קטנה מהצומת מעבר למפל על <Tex>{'R_S'}</Tex>. ככל שהזרם גבוה יותר, הצומת "נתקע" והאומדן מתכנס ל-<Tex>{'R_S'}</Tex>.
        </>
      ),
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את האופיין החצי-לוגריתמי עם הברך של $R_S$.',
      render: () => <NonIdealIVCurve Na={Na} Nd={Nd} mat={Si} Vj={0.6} tau0={tau0} rs={rs} mode="log" curves={['tot']} showIdeal regions />,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל תרגיל בנוי מ<b>סעיפים</b> (א, ב, ג…). נסו לפתור — כולל סעיפי ה<b>שרטוט</b> — ורק אז «פתרון». המספרים
          מחושבים מהפיזיקה, כך שתוכלו לאמת אותם בלשונית <b>«התמונה המלאה»</b>.
        </p>
      </Panel>

      <Problem titleHe="תרגיל 1 — חילוץ מקדם אי-אידיאליות n" parts={p1}>
        <p className="mt-2 leading-relaxed text-slate-700">
          על אופיין חצי-לוגריתמי של צומת סיליקון נמדדו שתי נקודות:{' '}
          <span dir="ltr"><Tex>{`(V_1,J_1)=(${v1},${sciTex(j1)})`}</Tex></span> ו-<span dir="ltr"><Tex>{`(V_2,J_2)=(${v2},${sciTex(j2)})`}</Tex></span>{' '}
          <span dir="ltr"><Tex>{'\\mathrm{A/cm^2}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 2 — זרם רקומבינציה וה-crossover" parts={p2}>
        <p className="mt-2 leading-relaxed text-slate-700">
          אותו צומת (<span dir="ltr"><Tex>{'N_A=10^{16}'}</Tex></span>,{' '}
          <span dir="ltr"><Tex>{'N_D=10^{17}'}</Tex></span>) עם זמן-חיים{' '}
          <span dir="ltr"><Tex>{'\\tau_0=10^{-7}\\,\\mathrm{s}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 3 — אמידת התנגדות טורית" parts={p3}>
        <p className="mt-2 leading-relaxed text-slate-700">
          לדיודה <span dir="ltr"><Tex>{'R_S=2\\,\\Omega\\cdot cm^2'}</Tex></span>. נמדדו שתי נקודות בזרם גבוה סביב{' '}
          <span dir="ltr"><Tex>{'V_j\\approx0.6\\!-\\!0.64\\,\\mathrm{V}'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה $1\le n\le2$ ולא מחוץ לטווח הזה?">
            שני המנגנונים הקיצוניים הם דיפוזיה טהורה (<Tex>{'n=1'}</Tex>) ורקומבינציה/הזרקה-חזקה (<Tex>{'n=2'}</Tex>).
            כל דיודה ממשית היא <b>תערובת</b> שלהם, ולכן ה-<Tex>{'n'}</Tex> הנמדד נופל בין הערכים.
          </QA>
          <QA q="2 · למה הזרם האחורי הממשי אינו רווי, בניגוד לאידיאלי?">
            כי לזרם הגנרציה <Tex>{'\\propto W'}</Tex>, ו-<Tex>{'W\\propto\\sqrt{V_{bi}+|V_A|}'}</Tex> גדל עם הממתח האחורי.
            הדיפוזיה לבדה הייתה רוויה ב-<Tex>{'-J_S'}</Tex>, אבל הגנרציה במלכודות מוסיפה זרם שגדל לאט.
          </QA>
          <QA q="3 · רקומבינציה והזרקה-חזקה שתיהן נותנות $n=2$ — איך מבדילים?">
            לפי <b>המתח</b>: רקומבינציה שולטת ב<b>קדמי נמוך</b> (תחתית האופיין), הזרקה-חזקה ב<b>קדמי גבוה</b> (קצה
            עליון, לפני ברך ה-<Tex>{'R_S'}</Tex>). ביניהן יש חלון של דיפוזיה נקייה (<Tex>{'n=1'}</Tex>).
          </QA>
        </div>
      </Panel>
    </div>
  )
}
