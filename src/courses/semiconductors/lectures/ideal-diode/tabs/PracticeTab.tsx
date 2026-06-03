import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import IVCurve from '../components/IVCurve'
import MinorityInjectionProfile from '../../pn-junction-bias/components/MinorityInjectionProfile'
import {
  MATERIALS,
  diffusionCoeff,
  diffusionLength,
  diodeCurrents,
  fmtCurrentDensity,
  niAt,
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
 * Lecture 2א — practice: compute J_S and the forward current, reason about
 * reverse saturation, and find the electron/hole split — all numbers live from
 * diodeCurrents() so they stay consistent with the sandbox. Plus quick self-checks.
 */
export default function PracticeTab() {
  const Si = MATERIALS.Si
  const Na = 1e16
  const Nd = 1e17
  const T = 300
  const VT = thermalVoltage(T)
  const vtStr = VT.toFixed(4)
  const ni = niAt(Si, T)
  const Dn = diffusionCoeff(Si.mun, T)
  const Ln = diffusionLength(Dn, Si.taun)
  const c = diodeCurrents(Na, Nd, Si, 0.6, T)
  const Js = c.Js
  const Jf = c.J
  const cRev = diodeCurrents(Na, Nd, Si, -0.5, T)

  // problem 1 — J_S and forward current
  const p1: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את זרם הרוויה $J_S$.',
      tex: 'J_S=qn_i^2\\!\\left(\\tfrac{D_p}{L_pN_D}+\\tfrac{D_n}{L_nN_A}\\right)',
      sub: `n_i=${sciTex(ni)},\\; D_n\\approx${Dn.toFixed(0)},\\; L_n\\approx${sciTex(Ln)}\\,\\mathrm{cm}`,
      res: fmtCurrentDensity(Js),
      accent: ACCENT.rose,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את הזרם $J$ בממתח קדמי $V_A=+0.6\\,\\mathrm{V}$.',
      tex: 'J=J_S\\left(e^{V_A/V_T}-1\\right)',
      sub: `= ${sciTex(Js)}\\left(e^{0.6/${vtStr}}-1\\right)`,
      res: fmtCurrentDensity(Jf),
      accent: ACCENT.violet,
    },
    {
      kind: 'concept',
      prompt: 'איזו תרומת הזרקה שולטת — חורים או אלקטרונים? נמקו.',
      answer: (
        <>
          הזרקת ה<b>אלקטרונים</b> אל צד p, כי <Tex>{'N_A=10^{16}<N_D=10^{17}'}</Tex> — והתרומה{' '}
          <Tex>{'\\propto 1/N'}</Tex>, כך שהצד <b>המסומם-פחות</b> נותן את הזרם הגדול.
        </>
      ),
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את אופיין ה-I–V (לינארי) של הצומת.',
      render: () => <IVCurve Na={Na} Nd={Nd} mat={Si} Va={0.6} mode="linear" />,
    },
  ]

  // problem 2 — reverse saturation
  const p2: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את הזרם בממתח אחורי $V_A=-0.5\\,\\mathrm{V}$.',
      tex: 'J=J_S\\left(e^{V_A/V_T}-1\\right)',
      sub: `= ${sciTex(Js)}\\left(e^{-0.5/${vtStr}}-1\\right)`,
      res: fmtCurrentDensity(cRev.J),
      accent: ACCENT.sky,
    },
    {
      kind: 'concept',
      prompt: 'מדוע הזרם האחורי "רווי" — כמעט אינו תלוי במתח?',
      answer: (
        <>
          כבר ב-<Tex>{'|V_A|\\gtrsim 4V_T'}</Tex> מתקיים <Tex>{'e^{V_A/V_T}\\approx 0'}</Tex>, ולכן{' '}
          <Tex>{'J\\to -J_S'}</Tex> — קבוע. הזרם נקבע מקצב <b>ההזרקה ההפוכה</b> (גנרציה תרמית) ולא מהמתח.
        </>
      ),
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את פרופיל המיעוט בצד n תחת הממתח האחורי.',
      render: () => <MinorityInjectionProfile Va={-0.5} Na={Na} Nd={Nd} mat={Si} />,
    },
  ]

  // problem 3 — electron/hole split ratio
  const Dp = diffusionCoeff(Si.mup, T)
  const Lp = diffusionLength(Dp, Si.taup)
  const ratio = c.JsN / c.JsP
  const p3: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את היחס $J_{S,n}/J_{S,p}$.',
      tex: '\\dfrac{J_{S,n}}{J_{S,p}}=\\dfrac{D_n/(L_nN_A)}{D_p/(L_pN_D)}',
      sub: `= \\dfrac{${Dn.toFixed(0)}/(${sciTex(Ln)}\\cdot10^{16})}{${Dp.toFixed(0)}/(${sciTex(Lp)}\\cdot10^{17})}`,
      res: <>×{ratio < 100 ? ratio.toFixed(1) : ratio.toExponential(1)}</>,
      accent: ACCENT.amber,
    },
    {
      kind: 'concept',
      prompt: 'מה צריך לשנות כדי שהזרקת ה*חורים* תשלוט במקום זאת?',
      answer: (
        <>
          להפוך את יחס הסימום: לעשות את צד <b>n</b> מסומם-פחות (<Tex>{'N_D<N_A'}</Tex>). אז{' '}
          <Tex>{'J_{S,p}\\propto 1/N_D'}</Tex> גובר.
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל תרגיל בנוי מ<b>סעיפים</b> (א, ב, ג…). נסו לפתור כל סעיף בעצמכם — כולל את סעיפי ה<b>שרטוט</b> —
          ורק אז «פתרון» להשוואה. המספרים מחושבים מהפיזיקה, אז אפשר לאמת אותם בארגז החול.
        </p>
      </Panel>

      <Problem titleHe="תרגיל 1 — זרם הרוויה והזרם הקדמי" parts={p1}>
        <p className="mt-2 leading-relaxed text-slate-700">
          צומת <b>סיליקון</b> ב-<span dir="ltr"><Tex>{'300\\,\\mathrm{K}'}</Tex></span> עם{' '}
          <span dir="ltr"><Tex>{'N_A=10^{16}'}</Tex></span>,{' '}
          <span dir="ltr"><Tex>{'N_D=10^{17}\\,\\mathrm{cm^{-3}}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 2 — הזרם האחורי הרווי" parts={p2}>
        <p className="mt-2 leading-relaxed text-slate-700">
          אותו צומת, הפעם תחת ממתח אחורי <span dir="ltr"><Tex>{'V_A=-0.5\\,\\mathrm{V}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 3 — פיצול אלקטרונים/חורים" parts={p3}>
        <p className="mt-2 leading-relaxed text-slate-700">
          לאותו צומת — מהו היחס בין שתי תרומות ההזרקה לזרם הרוויה?
        </p>
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
