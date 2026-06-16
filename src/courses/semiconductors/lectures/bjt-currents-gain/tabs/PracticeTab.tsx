import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import NpnSymbol from '../components/NpnSymbol'
import EbersMollDiagram from '../components/EbersMollDiagram'
import BaseMinorityProfile from '../../bjt-structure/components/BaseMinorityProfile'

const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}
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

/** One column of the npn parameter table (E / B / C), faithful to the PDF givens. */
function ParamCol({ title, rows }: { title: string; rows: string[] }) {
  return (
    <td className="border-2 border-slate-700 px-3 py-2 align-top">
      <div className="mb-1 text-center text-sm font-bold text-slate-800">{title}</div>
      <div className="flex flex-col gap-1 text-center" dir="ltr">
        {rows.map((r, i) => (
          <span key={i} className="text-[13px] text-slate-700"><Tex>{r}</Tex></span>
        ))}
      </div>
    </td>
  )
}

/**
 * Lecture 3ב — practice. Real recitation (תרגול 5): a full npn worked problem —
 * mode, concentration profile, emitter current, γ, b, α, β, I_C, I_B and the
 * Ebers-Moll model. Numbers faithful to the PDF. Plus the knowledge self-checks.
 */
export default function PracticeTab() {
  const t5Formulas: TFormula[] = [
    { name: 'אורך דיפוזיה', tex: 'L=\\sqrt{D\\tau}' },
    { name: 'הזרקת אלקטרונים (בסיס קצר)', tex: 'I_{eE}=qA\\dfrac{D_B}{W_B}\\dfrac{n_i^2}{N_B}e^{V_{BE}/V_T}' },
    { name: 'הזרקת חורים (פולט ארוך)', tex: 'I_{hE}=qA\\dfrac{D_E}{L_E}\\dfrac{n_i^2}{N_E}e^{V_{BE}/V_T}' },
    { name: 'נצילות הזרקה', tex: '\\gamma=I_{eE}/I_E' },
    { name: 'מקדם מעבר הבסיס', tex: 'b=1/\\cosh(W_B/L_B)' },
    { name: 'הגבר בסיס/פולט משותף', tex: '\\alpha=\\gamma b\\,,\\;\\; \\beta=\\alpha/(1-\\alpha)' },
    { name: 'זרמי קולט ובסיס', tex: 'I_C=\\alpha I_E\\,,\\;\\; I_B=I_C/\\beta' },
  ]

  const t5: Part[] = [
    {
      kind: 'concept',
      prompt: 'באיזה מצב נמצא הטרנזיסטור? שרטטו את סימנו.',
      answer: (
        <>
          <Tex>{'V_{BE}=0.5>0'}</Tex> (צומת BE קדמי) ו-<Tex>{'V_{BC}=-3<0'}</Tex> (צומת BC אחורי) ⇒ <b>מצב פעיל-קדמי</b> —
          הפולט מזריק, הקולט אוסף. הסמל הוא npn (חץ הפולט <b>יוצא</b>).
        </>
      ),
      sketch: () => <NpnSymbol />,
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו פרופיל ריכוזים (n-p-n) עבור הטרנזיסטור.',
      render: () => <BaseMinorityProfile wbMicron={0.7} lMicron={8.7} />,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את זרם האמיטר $I_E$.',
      tex: 'I_{eE}=qA\\tfrac{D_B}{W_B}\\tfrac{n_i^2}{N_B}e^{V_{BE}/V_T}\\,,\\;\\; I_{hE}=qA\\tfrac{D_E}{L_E}\\tfrac{n_i^2}{N_E}e^{V_{BE}/V_T}',
      sub: 'L_E=\\sqrt{8\\cdot10^{-8}}=2.82\\mu m\\;(<W_E)\\,,\\;\\; L_B=\\sqrt{15\\cdot5\\times10^{-8}}=8.7\\mu m\\;(>W_B)',
      res: (
        <>
          I<sub>eE</sub>=3.854&nbsp;µA · I<sub>hE</sub>=0.013&nbsp;µA · I<sub>E</sub>=3.867&nbsp;µA
        </>
      ),
      accent: ACCENT.sky,
      note: (
        <>
          קודם אורכי הדיפוזיה: <Tex>{'L_E<W_E'}</Tex> ⇒ <b>פולט ארוך</b> (משתמשים ב-<Tex>{'D_E/L_E'}</Tex>), בעוד{' '}
          <Tex>{'L_B>W_B'}</Tex> ⇒ <b>בסיס קצר</b> (משתמשים ב-<Tex>{'D_B/W_B'}</Tex>). הזרם המועיל <Tex>{'I_{eE}'}</Tex> (אלקטרונים
          לבסיס) שולט לחלוטין על ההזרקה-הנגדית <Tex>{'I_{hE}'}</Tex>, כי הפולט מסומם הרבה יותר.
        </>
      ),
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את נצילות ההזרקה $\\gamma$.',
      tex: '\\gamma=\\dfrac{I_{eE}}{I_E}',
      sub: '=\\dfrac{3.854}{3.867}',
      res: <>≈ 0.997</>,
      accent: ACCENT.amber,
      note: <>קרוב מאוד ל-1 — כמעט כל זרם הפולט הוא הזרקת האלקטרונים המועילה, הודות ל-<Tex>{'N_E\\gg N_B'}</Tex>.</>,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את גורם ההגבר בבסיס $b$.',
      tex: 'b=\\dfrac{1}{\\cosh(W_B/L_B)}\\approx1-\\dfrac{W_B^2}{2L_B^2}',
      sub: '=1-\\dfrac{(0.7)^2}{2\\cdot(8.7)^2}',
      res: <>≈ 0.997</>,
      accent: ACCENT.violet,
      note: <>הבסיס <b>דק בהרבה</b> מאורך הדיפוזיה (<Tex>{'W_B\\ll L_B'}</Tex>), ולכן כמעט כל האלקטרונים חוצים אותו בלי רקומבינציה.</>,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את הזרם בקולט $I_C$.',
      tex: 'I_C=\\alpha I_E+I_{BCO}\\approx\\gamma b\\,I_E',
      sub: '=0.997\\cdot0.997\\cdot3.867',
      res: <>≈ 3.844&nbsp;µA</>,
      accent: ACCENT.emerald,
      note: <>זרם הזליגה <Tex>{'I_{BCO}'}</Tex> זניח (צומת BC אחורי), אז <Tex>{'I_C\\approx\\alpha I_E'}</Tex> עם <Tex>{'\\alpha=\\gamma b\\approx0.994'}</Tex>.</>,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את הגבר הזרם $\\beta$.',
      tex: '\\beta=\\dfrac{\\alpha}{1-\\alpha}',
      sub: '=\\dfrac{0.997^2}{1-0.997^2}',
      res: <>≈ 166</>,
      accent: ACCENT.rose,
      note: <>הגבר גדול נובע מ-<Tex>{'\\alpha'}</Tex> קרוב מאוד ל-1: <Tex>{'\\beta'}</Tex> רגיש מאוד כי <Tex>{'1-\\alpha'}</Tex> זעיר.</>,
    },
    {
      kind: 'numeric',
      prompt: 'מהו הזרם בבסיס $I_B$?',
      tex: 'I_B=\\dfrac{I_C}{\\beta}',
      sub: '=\\dfrac{3.844\\,\\mu A}{166}',
      res: <>≈ 23.2&nbsp;nA</>,
      accent: ACCENT.slate,
      note: <>זרם הבסיס זעיר — רק החלק הקטן של זרם הפולט שאינו מגיע לקולט (הזרקה-נגדית + רקומבינציה בבסיס).</>,
    },
    {
      kind: 'sketch',
      prompt: 'שרטטו דיאגרמת Ebers-Moll עבור הטרנזיסטור.',
      render: () => <EbersMollDiagram />,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          להלן <b>תרגול 5 — BJT</b>: שאלה נומרית מלאה על טרנזיסטור npn. נסו לפתור סעיף-סעיף — כולל השרטוטים — ורק אז
          «פתרון». כפתור <b>«נוסחאות מהתרגול»</b> מרכז את ארגז הכלים. למטה — שאלות מהירות לבדיקה עצמית.
        </p>
      </Panel>

      <Problem titleHe="טרנזיסטור npn — זרמים והגבר" source="מתוך תרגול 5 · שאלה" parts={t5} formulas={t5Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">נתון טרנזיסטור ביפולרי <b>npn</b> עם הפרמטרים:</p>
        <table className="mx-auto mt-3 border-collapse">
          <tbody>
            <tr>
              <ParamCol title="E (פולט)" rows={['N_E=8\\times10^{17}', 'W_E=4\\,\\mu m', 'D_E=8', '\\tau_{E0}=10^{-8}']} />
              <ParamCol title="B (בסיס)" rows={['N_B=2\\times10^{16}', 'W_B=0.7\\,\\mu m', 'D_B=15', '\\tau_{B0}=5\\times10^{-8}']} />
              <ParamCol title="C (קולט)" rows={['N_C=10^{15}', 'W_C=10\\,\\mu m', 'D_C=12', '\\tau_{C0}=10^{-7}']} />
            </tr>
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {['n_i^2=10^{20}\\,\\mathrm{cm^{-6}}', 'A=10^{-4}\\,\\mathrm{cm^2}', 'V_{BE}=0.5\\,\\mathrm{V}', 'V_{BC}=-3\\,\\mathrm{V}'].map((t, i) => (
            <span key={i} className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700" dir="ltr"><Tex>{t}</Tex></span>
          ))}
        </div>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · נתון $\alpha=0.98$. מהו $\beta$?">
            <Tex>{'\\beta=\\dfrac{\\alpha}{1-\\alpha}=\\dfrac{0.98}{0.02}=49'}</Tex>.
          </QA>
          <QA q="2 · נתונים $\gamma=0.990$ ו-$b=0.995$. חשבו $\alpha$ ו-$\beta$.">
            <Tex>{'\\alpha=\\gamma b=0.990\\times0.995=0.985'}</Tex>; ‏<Tex>{'\\beta=0.985/0.015\\approx66'}</Tex>.
          </QA>
          <QA q="3 · מדוע רוצים שהפולט יהיה מסומם הרבה יותר מהבסיס?">
            כדי שזרם-הפולט יהיה כמעט-כולו <b>הזרקת אלקטרונים מועילה</b> (<Tex>{'I_{nE}'}</Tex>) ולא הזרקה-נגדית של חורים — כלומר נצילות-הזרקה{' '}
            <Tex>{'\\gamma\\to1'}</Tex>. הנוסחה: <Tex>{'\\gamma=1/(1+\\frac{N_B D_E W_B}{N_E D_B W_E})'}</Tex>, ו-<Tex>{'N_E\\gg N_B'}</Tex> מקטין את האיבר.
          </QA>
          <QA q="4 · מדוע $\beta$ רגיש כל-כך לערך של $\alpha$?">
            כי <Tex>{'I_B=(1-\\alpha)I_E'}</Tex> הוא <b>הפרש קטן</b> בין שני זרמים גדולים כמעט-שווים (<Tex>{'I_E,I_C'}</Tex>). שינוי זעיר ב-<Tex>{'\\alpha'}</Tex> משנה את ההפרש באחוזים רבים, ולכן את <Tex>{'\\beta=I_C/I_B'}</Tex> דרמטית.
          </QA>
          <QA q="5 · באופייני המוצא — כיצד מזהים את $\beta$, וכיצד מזהים רוויה?">
            <b><Tex>{'\\beta'}</Tex></b>: המרווח בין עקומות עוקבות (לקפיצות <Tex>{'I_B'}</Tex> שוות) — מרווח גדול = <Tex>{'\\beta'}</Tex> גדול. <b>רוויה</b>: התחום שבו <Tex>{'V_{CE}'}</Tex> קטן (<Tex>{'\\lesssim0.2\\,V'}</Tex>) והעקומות צונחות לאפס.
          </QA>
          <QA q="6 · מהי תכונת ההדדיות של מודל Ebers-Moll?">
            <Tex>{'\\alpha_F I_{ES}=\\alpha_R I_{CS}'}</Tex> — ולכן די בשלושה פרמטרים (<Tex>{'\\alpha_F,\\alpha_R,I_{ES}'}</Tex>) לתיאור מלא של ההתקן.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
