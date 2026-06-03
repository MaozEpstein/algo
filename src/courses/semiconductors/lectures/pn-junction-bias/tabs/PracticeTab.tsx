import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import BiasedBandDiagram from '../components/BiasedBandDiagram'
import MinorityInjectionProfile from '../components/MinorityInjectionProfile'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import {
  MATERIALS,
  capPerArea,
  fmtCapPerArea,
  fmtLength,
  fmtVolt,
  junctionState,
  minorityAtEdge,
  niAt,
  thermalVoltage,
} from '../../../lib/junction'

/** A number as a KaTeX-ready "m×10ⁿ" string, for the substitution lines. */
function sciTex(n: number, digits = 1): string {
  const exp = Math.floor(Math.log10(n))
  const mant = n / 10 ** exp
  return `${mant.toFixed(digits)}\\times10^{${exp}}`
}

const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
}
const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו']

/** A problem part: a numeric step (formula→substitution→result), a short
 *  concept answer, or a sketch (reveal the correct diagram, like homework). */
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

/** Collapsible parts with a "פתרון" header that opens/closes them all. */
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
 * Lecture 1ב — practice: multi-part exercises (סעיפים) that stay mostly numeric
 * (formula → substitution → result, computed live so they're always consistent)
 * but mix in short conceptual parts and "sketch it" parts (reveal the correct
 * diagram, like homework). Plus a few quick self-check questions.
 */
export default function PracticeTab() {
  const Si = MATERIALS.Si
  const Na = 1e16
  const Nd = 1e17
  const VT = thermalVoltage(300)
  const vtStr = VT.toFixed(4)
  const EPS = '(11.8)(8.85\\times10^{-14})'

  // problem 1 — forward bias V_A = +0.5
  const f = junctionState(Na, Nd, Si, 0.5)
  const fwd: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את גובה המחסום $q(V_{bi}-V_A)$.',
      tex: 'q(V_{bi}-V_A)',
      sub: `= ${f.Vbi.toFixed(3)} - 0.50`,
      res: fmtVolt(f.Vbi - 0.5),
      accent: ACCENT.amber,
    },
    {
      kind: 'concept',
      prompt: 'האם אזור המחסור גדל או קטֵן ביחס לשיווי-משקל? נמקו במשפט.',
      answer: (
        <>
          <b>קטֵן.</b> המחסום ירד, ולכן דרוש פחות מטען חשוף — ומכיוון ש-<Tex>{'d\\propto\\sqrt{V_{bi}-V_A}'}</Tex>, גם <Tex>{'d'}</Tex> קטן.
        </>
      ),
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את דיאגרמת הפסים במצב זה — סמנו את פיצול רמות הקוואזי-פרמי $E_{Fn}/E_{Fp}$.',
      render: () => <BiasedBandDiagram state={f} Va={0.5} Na={Na} Nd={Nd} mat={Si} />,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את קיבול הצומת $C_j/A$.',
      tex: 'C_j/A=\\varepsilon_s/d',
      sub: `= \\dfrac{${EPS}}{${sciTex(f.d)}}`,
      res: fmtCapPerArea(capPerArea(Si.epsR, f.d)),
      accent: ACCENT.violet,
    },
  ]

  // problem 2 — reverse bias V_A = −3
  const r = junctionState(Na, Nd, Si, -3)
  const eq = junctionState(Na, Nd, Si, 0)
  const rev: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את גובה המחסום $q(V_{bi}-V_A)$.',
      tex: 'q(V_{bi}-V_A)',
      sub: `= ${r.Vbi.toFixed(3)} - (-3.00)`,
      res: fmtVolt(r.Vbi + 3),
      accent: ACCENT.sky,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את $d$, ופי כמה הוא גדול מ-$d$ שבשיווי-משקל?',
      tex: '\\dfrac{d(V_A)}{d(0)}=\\sqrt{\\dfrac{V_{bi}-V_A}{V_{bi}}}',
      sub: `= \\sqrt{\\dfrac{${(r.Vbi + 3).toFixed(2)}}{${r.Vbi.toFixed(2)}}}`,
      res: (
        <>
          {fmtLength(r.d)} · פי {(r.d / eq.d).toFixed(2)}
        </>
      ),
      accent: ACCENT.slate,
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את מפל $ρ→E→V$ במצב זה.',
      render: () => <JunctionElectrostatics dn={r.dn} dp={r.dp} Emax={r.Emax} Vbi={r.Vbi + 3} Na={Na} Nd={Nd} />,
    },
    {
      kind: 'concept',
      prompt: 'מדוע הזרם במצב זה זעיר ו"רווי" (כמעט אינו תלוי במתח)?',
      answer: (
        <>
          הדיפוזיה חסומה; נשאר רק זרם <b>מיעוט</b> שנסחף, שגודלו נקבע בגנרציה ולא במתח — ולכן הוא מגיע לרוויה (<Tex>{'\\sim -I_S'}</Tex>).
        </>
      ),
    },
  ]

  // problem 3 — injection / law of the junction, V_A = +0.4
  const ni = niAt(Si, 300)
  const np0 = (ni * ni) / Na
  const factor = Math.exp(0.4 / VT)
  const edge = minorityAtEdge(np0, 0.4)
  const inj: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את גורם בולצמן $e^{V_A/V_T}$.',
      tex: 'e^{V_A/V_T}',
      sub: `= e^{0.40/${vtStr}}`,
      res: <Tex>{`\\approx ${sciTex(factor)}`}</Tex>,
      accent: ACCENT.amber,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את ריכוז המיעוט בקצה $n_p(0)$.',
      tex: 'n_p(0)=n_{p0}\\,e^{V_A/V_T},\\;\\; n_{p0}=n_i^2/N_A',
      sub: `= \\dfrac{(${sciTex(ni)})^2}{10^{16}}\\,e^{0.40/${vtStr}}`,
      res: <Tex>{`\\approx ${sciTex(edge)}\\,\\mathrm{cm^{-3}}`}</Tex>,
      accent: ACCENT.sky,
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו את פרופיל ריכוז המיעוט ליד הצומת (ציר לוגריתמי).',
      render: () => <MinorityInjectionProfile Va={0.4} Na={Na} Nd={Nd} mat={Si} />,
    },
    {
      kind: 'concept',
      prompt: 'לאן ישתנה הפרופיל אילו הופעל ממתח אחורי?',
      answer: (
        <>
          ריכוז המיעוט בקצה <b>יֵרד</b> אל ~0 (שאיבה), שכן <Tex>{'e^{V_A/V_T}<1'}</Tex> — והעקומה תצנח מתחת לקו שיווי-המשקל.
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל תרגיל בנוי מ<b>סעיפים</b> (א, ב, ג…). נסו לפתור כל סעיף בעצמכם — כולל את סעיפי ה<b>שרטוט</b>,
          שאותם מציירים על דף — ורק אז לחצו «פתרון» כדי להשוות. המספרים מחושבים מהפיזיקה, אז אפשר לאמת אותם
          בארגז החול.
        </p>
      </Panel>

      <Problem titleHe="תרגיל 1 — ממתח קדמי" parts={fwd}>
        <p className="mt-2 leading-relaxed text-slate-700">
          צומת <b>סיליקון</b> עם <span dir="ltr"><Tex>{'N_A=10^{16}'}</Tex></span>,{' '}
          <span dir="ltr"><Tex>{'N_D=10^{17}\\,\\mathrm{cm^{-3}}'}</Tex></span>, תחת ממתח קדמי{' '}
          <span dir="ltr"><Tex>{'V_A=+0.5\\,\\mathrm{V}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 2 — ממתח אחורי" parts={rev}>
        <p className="mt-2 leading-relaxed text-slate-700">
          אותו צומת (<span dir="ltr"><Tex>{'N_A=10^{16},\\,N_D=10^{17}'}</Tex></span>), הפעם תחת ממתח אחורי{' '}
          <span dir="ltr"><Tex>{'V_A=-3\\,\\mathrm{V}'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל 3 — הזרקה וחוק הצומת" parts={inj}>
        <p className="mt-2 leading-relaxed text-slate-700">
          על אותו צומת מופעל ממתח קדמי <span dir="ltr"><Tex>{'V_A=+0.4\\,\\mathrm{V}'}</Tex></span>. נתון{' '}
          <span dir="ltr"><Tex>{'n_i=1.5\\times10^{10}\\,\\mathrm{cm^{-3}}'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה כמעט כל המתח החיצוני $V_A$ נופל על אזור המחסור ולא על הבולק?">
            כי אזור המחסור רוקן מנושאים — התנגדותו גבוהה — בעוד הבולק הניטרלי מלא נושאים ומתנהג כמעט כמוליך.
            מפל מתח על נגד נמוך זניח, ולכן <Tex>{'V_A'}</Tex> "יושב" כולו על אזור המחסור.
          </QA>
          <QA q="2 · למה הגרף של $1/C_j^2$ מול $V_A$ הוא קו ישר, ומה מחלצים ממנו?">
            כי <Tex>{'C_j/A=\\varepsilon_s/d'}</Tex> ו-<Tex>{'d\\propto\\sqrt{V_{bi}-V_A}'}</Tex>, ולכן{' '}
            <Tex>{'1/C_j^2\\propto (V_{bi}-V_A)'}</Tex> — ליניארי. השיפוע נותן את הסימום וחיתוך-הציר את <Tex>{'V_{bi}'}</Tex>.
          </QA>
          <QA q="3 · מה המשמעות של $E_{Fn}-E_{Fp}=qV_A$?">
            מחוץ לשיווי משקל רמת פרמי מתפצלת לשתי רמות קוואזי-פרמי; ההפרש ביניהן על הצומת שווה לעבודה החשמלית
            לכל נושא, <Tex>{'qV_A'}</Tex> — וזה ה"מנוע" שמזריק את נושאי המיעוט.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
