import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import ContactResistanceCurve from '../components/ContactResistanceCurve'
import {
  MATERIALS,
  METALS,
  e00,
  fmtLength,
  isAccumulation,
  schottkyBarrier,
  schottkyWidth,
  schottkyVbi,
  specificContactResistance,
  tunnelRegime,
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
 * Lecture 2ד — practice: compute E_00 + regime for a given N_D, the specific contact
 * resistance ρ_c at n⁺ vs light doping (the exponential collapse), the rectifying-vs-
 * ohmic criterion, and concept questions on heavy doping / Fermi pinning.
 */
export default function PracticeTab() {
  const Si = MATERIALS.Si
  const W = METALS.W
  const T = 300

  // problem 1 — E00 and regime at n⁺
  const NdHi = 1e20
  const E00hi = e00(Si, NdHi)
  const regHi = tunnelRegime(Si, NdHi, T)
  const Vbi_W = schottkyVbi(W.phiM, Si.chi, Si.nc, NdHi, T)
  const Whi = schottkyWidth(Si, NdHi, 0, Vbi_W)
  const p1: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את אנרגיית המנהור $E_{00}$ עבור $N_D=10^{20}$.',
      tex: 'E_{00}=1.857\\times10^{-11}\\sqrt{N_D/(\\varepsilon_r m_r)}',
      sub: `=1.857\\times10^{-11}\\sqrt{10^{20}/(11.7\\cdot0.26)}`,
      res: <>{(E00hi * 1000).toFixed(1)} meV</>,
      accent: ACCENT.sky,
    },
    {
      kind: 'concept',
      prompt: 'באיזה משטר הולכה נמצאים? (TE / TFE / FE)',
      answer: (
        <>
          מול <Tex>{'kT\\approx25.9\\,\\mathrm{meV}'}</Tex>: כאן <Tex>{`E_{00}\\approx${(E00hi * 1000).toFixed(0)}\\,\\mathrm{meV}>5kT`}</Tex>, ולכן{' '}
          <b>{regHi}</b> — <b>מנהור טהור (Field Emission)</b>: המגע אוהמי.
        </>
      ),
    },
    {
      kind: 'numeric',
      prompt: 'מהו רוחב המחסום $W$? (מנהור דורש מחסום דק)',
      tex: 'W=\\sqrt{2\\varepsilon_s V_{bi}/(qN_D)}',
      sub: `V_{bi}\\approx${Vbi_W.toFixed(2)}\\,\\mathrm{V},\\;N_D=10^{20}`,
      res: <>{fmtLength(Whi)}</>,
      accent: ACCENT.violet,
    },
  ]

  // problem 2 — ρ_c at n⁺ vs light doping
  const NdLo = 1e17
  const rhoHi = specificContactResistance(W, Si, NdHi, T)
  const rhoLo = specificContactResistance(W, Si, NdLo, T)
  const p2: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את $\\rho_c$ בסימום כבד ($N_D=10^{20}$).',
      tex: '\\rho_c=\\rho_0\\,e^{\\varphi_B/E_0},\\;E_0=E_{00}\\coth(E_{00}/kT)',
      sub: `\\varphi_B=${schottkyBarrier(W.phiM, Si.chi).toFixed(2)}\\,\\mathrm{eV}`,
      res: <>{sciTex(rhoHi)} Ω·cm²</>,
      accent: ACCENT.emerald,
    },
    {
      kind: 'numeric',
      prompt: 'ועכשיו בסימום קל ($N_D=10^{17}$). השוו.',
      tex: '\\rho_c(\\text{light})/\\rho_c(\\text{n}^+)',
      sub: `${sciTex(rhoLo)}/${sciTex(rhoHi)}`,
      res: <>≈ {sciTex(rhoLo / rhoHi, 0)} ×</>,
      accent: ACCENT.rose,
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את $\\rho_c$ מול $N_D$ (לוג–לוג) וסמנו את נקודת-העבודה.',
      render: () => <ContactResistanceCurve metal={W} mat={Si} Nd={NdHi} />,
    },
  ]

  // problem 3 — rectifying vs ohmic criterion
  const p3: Part[] = [
    {
      kind: 'concept',
      prompt: 'מתכת עם $\\varphi_m=4.1\\,\\mathrm{eV}$ על Si-n קל ($N_D=10^{17}$) — מיישר או אוהמי?',
      answer: (
        <>
          {isAccumulation({ key: 'X', he: 'נמוך', phiM: 4.1 }, Si, NdLo, T) ? (
            <><b>אוהמי (צבירה)</b>: <Tex>{'\\varphi_m=4.1<\\varphi_s=\\chi+\\xi'}</Tex>, אז אין מחסום — הפסים מתכופפים מטה. (בפועל קיבוע-פרמי מקשה על זה ב-Si.)</>
          ) : (
            <><b>מיישר</b>: <Tex>{'\\varphi_m>\\varphi_s'}</Tex>.</>
          )}
        </>
      ),
    },
    {
      kind: 'concept',
      prompt: 'ולמתכת זהב ($\\varphi_m=5.1$) על אותו מצע?',
      answer: (
        <>
          <b>מיישר</b>: <Tex>{'\\varphi_m=5.1\\gg\\varphi_s\\approx4.2'}</Tex>, נוצר מחסום שוטקי ניכר — בדיוק מקרה 2ג. כדי
          להפוך אותו לאוהמי לא נחליף מתכת אלא <b>נסמם n⁺</b> מתחתיה.
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל תרגיל בנוי מ<b>סעיפים</b>. נסו לפתור — כולל השרטוט — ורק אז «פתרון». המספרים מחושבים מהפיזיקה, אז
          אפשר לאמת אותם בלשונית <b>«מנהור והתנגדות מגע»</b>.
        </p>
      </Panel>

      <Problem titleHe="תרגיל 1 — אנרגיית מנהור ומשטר" parts={p1}>
        <p className="mt-2 leading-relaxed text-slate-700">
          מגע <b>טונגסטן–סיליקון</b> מסומם <b>n⁺</b> (<span dir="ltr"><Tex>{'N_D=10^{20}\\,\\mathrm{cm^{-3}}'}</Tex></span>),{' '}
          <span dir="ltr"><Tex>{'\\varepsilon_r=11.7,\\;m_r=0.26'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 2 — התנגדות מגע סגולית" parts={p2}>
        <p className="mt-2 leading-relaxed text-slate-700">
          אותו מגע W/Si. השוו את <Tex>{'\\rho_c'}</Tex> בין <b>n⁺</b> (<Tex>{'10^{20}'}</Tex>) לסימום <b>קל</b> (<Tex>{'10^{17}'}</Tex>).
        </p>
      </Problem>

      <Problem titleHe="תרגיל 3 — מיישר או אוהמי?" parts={p3}>
        <p className="mt-2 leading-relaxed text-slate-700">קביעת אופי המגע לפי <Tex>{'\\varphi_m'}</Tex> מול <Tex>{'\\varphi_s'}</Tex>.</p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה מסממים n⁺ כדי לקבל מגע אוהמי?">
            הסימום מצמצם את רוחב המחסום <Tex>{'W\\propto1/\\sqrt{N_D}'}</Tex> עד כדי ננומטרים — דק מספיק שאלקטרונים
            <b> ינהרו</b> דרכו במקום לטפס מעליו. כך ההתנגדות צונחת ללא תלות בגובה המחסום.
          </QA>
          <QA q="2 · למה ρ_c צונחת מעריכית עם הסימום?">
            כי <Tex>{'\\rho_c\\propto e^{\\varphi_B/E_0}'}</Tex> ו-<Tex>{'E_0\\to E_{00}\\propto\\sqrt{N_D}'}</Tex> במשטר המנהור —
            המעריך קטֵן כ-<Tex>{'1/\\sqrt{N_D}'}</Tex>, ולכן <Tex>{'\\rho_c'}</Tex> נופלת בסדרי-גודל.
          </QA>
          <QA q="3 · למה מסלול הצבירה נדיר על סיליקון?">
            בגלל <b>קיבוע רמת-פרמי</b> (Bardeen, מ-2ג): מצבי-שטח מקבעים את <Tex>{'\\varphi_B'}</Tex> כמעט בלי-תלות
            במתכת, כך שקשה למצוא מתכת שתבטל את המחסום. לכן בפועל מסתמכים על <b>מנהור (n⁺)</b>.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
