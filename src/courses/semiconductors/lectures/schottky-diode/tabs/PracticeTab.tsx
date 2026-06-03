import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import SchottkyIVCurve from '../components/SchottkyIVCurve'
import {
  MATERIALS,
  METALS,
  bulkOffset,
  schottkyBarrier,
  schottkyTurnOn,
  schottkyVbi,
  thermalVoltage,
  thermionicJst,
} from '../../../lib/junction'

function sciTex(n: number, digits = 1): string {
  if (n === 0) return '0'
  const exp = Math.floor(Math.log10(Math.abs(n)))
  const mant = n / 10 ** exp
  return `${mant.toFixed(digits)}\\times10^{${exp}}`
}

const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}
const HEB = ['א', 'ב', 'ג', 'ד']

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
 * Lecture 2ג — practice: compute the barrier and built-in potential, the turn-on
 * vs a PN diode, and reason about Mott-Schottky extraction and the device traits.
 */
export default function PracticeTab() {
  const Si = MATERIALS.Si
  const Au = METALS.Au
  const Ti = METALS.Ti
  const T = 300
  const Nd = 1e17
  const VT = thermalVoltage(T)
  const xi = bulkOffset(Si.nc, Nd, T)

  // problem 1 — Au/Si barrier & V_bi
  const phiB_Au = schottkyBarrier(Au.phiM, Si.chi)
  const Vbi_Au = schottkyVbi(Au.phiM, Si.chi, Si.nc, Nd, T)
  const p1: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את גובה המחסום $\\varphi_B$.',
      tex: '\\varphi_B=\\varphi_m-\\chi',
      sub: `=5.1-4.05`,
      res: <>{phiB_Au.toFixed(2)} eV</>,
      accent: ACCENT.violet,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את המתח הבנוי $V_{bi}$.',
      tex: 'V_{bi}=\\varphi_B-\\xi,\\;\\xi=V_T\\ln(N_c/N_D)',
      sub: `\\xi=${VT.toFixed(4)}\\ln(${sciTex(Si.nc)}/10^{17})=${xi.toFixed(3)}`,
      res: <>{Vbi_Au.toFixed(2)} V</>,
      accent: ACCENT.amber,
    },
    {
      kind: 'concept',
      prompt: 'האם המגע מיישר? נמקו.',
      answer: (
        <>
          כן — <Tex>{'V_{bi}>0'}</Tex> (שקול ל-<Tex>{'\\varphi_m>\\varphi_s=\\chi+\\xi'}</Tex>). לזהב <Tex>{'\\varphi_m=5.1'}</Tex>{' '}
          גבוה בהרבה מ-<Tex>{'\\varphi_s\\approx4.2'}</Tex>, אז נוצר מחסום מיישר.
        </>
      ),
    },
  ]

  // problem 2 — turn-on of a low-barrier metal vs PN
  const phiB_Ti = schottkyBarrier(Ti.phiM, Si.chi)
  const Jst_Ti = thermionicJst(Si.astar, phiB_Ti, T)
  const Von_Ti = schottkyTurnOn(Si.astar, phiB_Ti, 1, T)
  const p2: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את זרם הרוויה $J_{ST}$ של מגע Ti/Si.',
      tex: 'J_{ST}=A^{*}T^2e^{-\\varphi_B/V_T}',
      sub: `=110\\cdot300^2 e^{-${phiB_Ti.toFixed(2)}/${VT.toFixed(4)}}`,
      res: <>{sciTex(Jst_Ti)} A/cm²</>,
      accent: ACCENT.rose,
    },
    {
      kind: 'numeric',
      prompt: 'מהו מתח-ההצתה (ב-$1\\,\\mathrm{A/cm^2}$)? השוו לדיודת PN (~0.6V).',
      tex: 'V_{on}=V_T\\ln(J_{ref}/J_{ST}+1)',
      sub: `=${VT.toFixed(4)}\\ln(1/${sciTex(Jst_Ti)}+1)`,
      res: <>≈ {Von_Ti.toFixed(2)} V</>,
      accent: ACCENT.violet,
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את אופיין השוטקי מול ה-PN (חצי-לוג).',
      render: () => <SchottkyIVCurve metal={Ti} mat={Si} Va={0.2} mode="log" comparePN={{ Na: 1e16, Nd: 1e17 }} showTurnOn />,
    },
  ]

  // problem 3 — Mott-Schottky concept
  const p3: Part[] = [
    {
      kind: 'concept',
      prompt: 'איך מודדים את $N_D$ ואת $V_{bi}$ מקיבול הצומת?',
      answer: (
        <>
          מודדים <Tex>{'C(V_A)'}</Tex> ומשרטטים <Tex>{'1/C^2'}</Tex> מול <Tex>{'V_A'}</Tex>: מתקבל <b>קו ישר</b>,{' '}
          <Tex>{'1/C^2=\\tfrac{2(V_{bi}-V_A)}{q\\varepsilon_s N_D}'}</Tex>. ה<b>שיפוע</b> נותן את <Tex>{'N_D'}</Tex>,
          וה<b>חיתוך</b> עם הציר נותן את <Tex>{'V_{bi}'}</Tex>. זו מדידת Mott-Schottky הסטנדרטית.
        </>
      ),
    },
    {
      kind: 'concept',
      prompt: 'מדוע הזרם האחורי רווי, ולמה הדיודה מהירה?',
      answer: (
        <>
          <b>רווי</b>: בממתח אחורי המחסום מצד-המל"מ עולה, אבל המחסום מצד-המתכת <Tex>{'\\varphi_B'}</Tex> <b>קבוע</b>,
          ולכן הזרם נותר <Tex>{'-J_{ST}'}</Tex>. <b>מהירה</b>: הזרם נישא בנושאי <b>רוב</b> — אין אגירת מיעוט שצריך
          לפנות בכיבוי (אין reverse-recovery).
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל תרגיל בנוי מ<b>סעיפים</b>. נסו לפתור — כולל השרטוט — ורק אז «פתרון». המספרים מחושבים מהפיזיקה, אז
          אפשר לאמת אותם בלשונית <b>«ארגז חול»</b>.
        </p>
      </Panel>

      <Problem titleHe="תרגיל 1 — מחסום ומתח בנוי" parts={p1}>
        <p className="mt-2 leading-relaxed text-slate-700">
          מגע <b>זהב–סיליקון</b> (<span dir="ltr"><Tex>{'\\varphi_m=5.1'}</Tex></span>,{' '}
          <span dir="ltr"><Tex>{'\\chi=4.05\\,\\mathrm{eV}'}</Tex></span>), עם{' '}
          <span dir="ltr"><Tex>{'N_D=10^{17}\\,\\mathrm{cm^{-3}}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 2 — מתח-הצתה מול דיודת PN" parts={p2}>
        <p className="mt-2 leading-relaxed text-slate-700">
          מגע <b>טיטניום–סיליקון</b> (<span dir="ltr"><Tex>{'\\varphi_m=4.33\\,\\mathrm{eV}'}</Tex></span>), אותו סימום.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 3 — מדידה ותכונות" parts={p3}>
        <p className="mt-2 leading-relaxed text-slate-700">שאלות מושגיות על מדידת הצומת ועל התנהגות ההתקן.</p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה דיודת שוטקי נדלקת במתח נמוך מדיודת PN?">
            כי <Tex>{'J_{ST}=A^{*}T^2e^{-\\varphi_B/V_T}'}</Tex> גדול בהרבה מ-<Tex>{'J_S\\propto n_i^2'}</Tex> של דיודת PN
            (לעיתים פי <Tex>{'10^6'}</Tex>), ולכן הזרם מגיע לערכים מעשיים כבר במתח נמוך יותר.
          </QA>
          <QA q="2 · מדוע על סיליקון המחסום הנמדד כמעט אינו תלוי במתכת?">
            בגלל <b>קיבוע רמת-פרמי</b> (Bardeen): מצבי-שטח צפופים בממשק קולטים/תורמים מטען ו"מקבעים" את רמת פרמי,
            כך ש-<Tex>{'\\varphi_B'}</Tex> נקבע מהממשק ולא מ-<Tex>{'\\varphi_m-\\chi'}</Tex> האידיאלי.
          </QA>
          <QA q="3 · מתי מגע מתכת–מוליך-למחצה יהיה אוהמי במקום מיישר?">
            כש-<Tex>{'\\varphi_m<\\varphi_s'}</Tex> (אין מחסום לאלקטרונים), או כשהסימום <b>כבד מאוד</b> והמחסור צר כל-כך
            שאלקטרונים <b>מנהרים</b> דרכו — זהו המגע האוהמי, נושא החלק הבא (2ד).
          </QA>
        </div>
      </Panel>
    </div>
  )
}
