import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Drill, { type DrillVariant } from '../components/Drill'
import BjtBiasCircuit from '../components/BjtBiasCircuit'
import BjtOutputBreakdown from '../components/BjtOutputBreakdown'
import BjtLoadLinePoint from '../components/BjtLoadLinePoint'

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

function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(usePrintMode())
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{q}</RichText></p>
        <button
          onClick={() => setShow((s) => !s)}
          aria-expanded={show}
          className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          {show ? 'הסתר תשובה' : 'הצג תשובה'}
        </button>
      </div>
      {show && <p className="mt-2 leading-relaxed text-slate-600">{children}</p>}
    </div>
  )
}

// ── self-checking numeric drills (each cycles through three value-sets) ──
const RO_DRILLS: DrillVariant[] = [
  { given: 'נתון $V_A=80\\,$V ו-$I_C=2\\,$mA. חשבו $r_o$ (ב-kΩ).', answer: 40, unit: 'kΩ', solution: <Tex>{'r_o=V_A/I_C=80/0.002=40\\,\\mathrm{k\\Omega}'}</Tex> },
  { given: 'נתון $V_A=100\\,$V ו-$I_C=0.5\\,$mA. חשבו $r_o$ (ב-kΩ).', answer: 200, unit: 'kΩ', solution: <Tex>{'r_o=100/0.0005=200\\,\\mathrm{k\\Omega}'}</Tex> },
  { given: 'נתון $V_A=60\\,$V ו-$I_C=3\\,$mA. חשבו $r_o$ (ב-kΩ).', answer: 20, unit: 'kΩ', solution: <Tex>{'r_o=60/0.003=20\\,\\mathrm{k\\Omega}'}</Tex> },
]

const GM_DRILLS: DrillVariant[] = [
  { given: 'נתון $I_C=1\\,$mA (ב-300K, $V_T\\approx25.9\\,$mV). חשבו $g_m$ (ב-mS).', answer: 38.6, unit: 'mS', tol: 0.05, solution: <Tex>{'g_m=I_C/V_T=0.001/0.0259\\approx38.6\\,\\mathrm{mS}'}</Tex> },
  { given: 'נתון $I_C=2\\,$mA (ב-300K). חשבו $g_m$ (ב-mS).', answer: 77.3, unit: 'mS', tol: 0.05, solution: <Tex>{'g_m=0.002/0.0259\\approx77.3\\,\\mathrm{mS}'}</Tex> },
  { given: 'נתון $I_C=0.5\\,$mA (ב-300K). חשבו $g_m$ (ב-mS).', answer: 19.3, unit: 'mS', tol: 0.05, solution: <Tex>{'g_m=0.0005/0.0259\\approx19.3\\,\\mathrm{mS}'}</Tex> },
]

const BV_DRILLS: DrillVariant[] = [
  { given: 'נתון $BV_{CBO}=80\\,$V, $\\beta=256$, $n=4$. חשבו $BV_{CEO}$ (ב-V).', answer: 20, unit: 'V', tol: 0.05, solution: <Tex>{'BV_{CEO}=BV_{CBO}/\\beta^{1/n}=80/256^{1/4}=80/4=20\\,\\mathrm{V}'}</Tex> },
  { given: 'נתון $BV_{CBO}=50\\,$V, $\\beta=81$, $n=4$. חשבו $BV_{CEO}$ (ב-V).', answer: 16.7, unit: 'V', tol: 0.05, solution: <Tex>{'BV_{CEO}=50/81^{1/4}=50/3\\approx16.7\\,\\mathrm{V}'}</Tex> },
  { given: 'נתון $BV_{CBO}=60\\,$V, $\\beta=100$, $n=4$. חשבו $BV_{CEO}$ (ב-V).', answer: 19, unit: 'V', tol: 0.06, solution: <Tex>{'BV_{CEO}=60/100^{1/4}=60/3.16\\approx19\\,\\mathrm{V}'}</Tex> },
]

const FB_DRILLS: DrillVariant[] = [
  { given: 'נתון $f_T=300\\,$MHz ו-$\\beta_0=150$. חשבו $f_\\beta$ (ב-MHz).', answer: 2, unit: 'MHz', solution: <Tex>{'f_\\beta=f_T/\\beta_0=300/150=2\\,\\mathrm{MHz}'}</Tex> },
  { given: 'נתון $f_T=1\\,$GHz ו-$\\beta_0=200$. חשבו $f_\\beta$ (ב-MHz).', answer: 5, unit: 'MHz', solution: <Tex>{'f_\\beta=1000/200=5\\,\\mathrm{MHz}'}</Tex> },
  { given: 'נתון $f_T=600\\,$MHz ו-$\\beta_0=100$. חשבו $f_\\beta$ (ב-MHz).', answer: 6, unit: 'MHz', solution: <Tex>{'f_\\beta=600/100=6\\,\\mathrm{MHz}'}</Tex> },
]

const AV_DRILLS: DrillVariant[] = [
  { given: 'מגבר פולט-משותף, $I_C=1\\,$mA, $R_C=4\\,$kΩ (בקירוב $R_C\\ll r_o$). חשבו $|A_v|$.', answer: 155, unit: '×', tol: 0.06, solution: <Tex>{'|A_v|\\approx g_m R_C=0.0386\\cdot4000\\approx155'}</Tex> },
  { given: 'מגבר פולט-משותף, $I_C=0.5\\,$mA, $R_C=10\\,$kΩ (בקירוב $R_C\\ll r_o$). חשבו $|A_v|$.', answer: 193, unit: '×', tol: 0.06, solution: <Tex>{'|A_v|\\approx g_m R_C=0.0193\\cdot10000\\approx193'}</Tex> },
  { given: 'מגבר פולט-משותף, $I_C=2\\,$mA, $R_C=2\\,$kΩ (בקירוב $R_C\\ll r_o$). חשבו $|A_v|$.', answer: 155, unit: '×', tol: 0.06, solution: <Tex>{'|A_v|\\approx g_m R_C=0.0773\\cdot2000\\approx155'}</Tex> },
]

/**
 * Lecture 3ג — practice. Real recitation (תרגול 6 — BJT part 2): effective base
 * width from depletion encroachment, the Early/base-width-modulation output
 * characteristics with avalanche breakdown, the bias-circuit operating point and
 * output resistance. Numbers faithful to the PDF. Kept: the self-check drills and
 * the knowledge Q&A.
 */
export default function PracticeTab() {
  const t6Formulas: TFormula[] = [
    { name: 'מתח בנוי', tex: 'V_{bi}=\\tfrac{kT}{q}\\ln(N_aN_d/n_i^2)' },
    { name: 'גלישת מחסור לבסיס', tex: 'X_p=\\sqrt{\\tfrac{2\\varepsilon\\varepsilon_0}{q}(V_{bi}\\mp V)\\tfrac{N_{\\text{other}}}{N_B(N_C+N_B)}}' },
    { name: 'רוחב בסיס אפקטיבי', tex: 'W_{B,\\text{eff}}=W_B-(X_{p,BC}+X_{p,BE})' },
    { name: 'מעגל כניסה', tex: 'I_B=\\dfrac{V_{BB}-V_{BE}}{R_B+(1+\\beta)R_E}' },
    { name: 'זרם קולט', tex: 'I_C=\\beta I_B' },
    { name: 'מעגל מוצא', tex: 'V_{CE}=V_{CC}-I_CR_C-(1+\\beta)I_BR_E' },
    { name: 'התנגדות מוצא', tex: 'r_o=V_A/I_C' },
  ]

  const t6: Part[] = [
    {
      kind: 'concept',
      prompt: 'באיזה מצב פעולה נמצא הטרנזיסטור?',
      answer: (
        <>
          צומת <b>בסיס–פולט</b> בממתח <b>קדמי</b> (<span dir="ltr"><Tex>{'V_{BE}>0'}</Tex></span>) וצומת{' '}
          <b>בסיס–קולט</b> בממתח <b>אחורי</b> (<span dir="ltr"><Tex>{'V_{BC}=-3\\,\\mathrm{V}<0'}</Tex></span>) — ולכן
          הטרנזיסטור נמצא במצב <b>פעיל-קדמי</b>: הפולט מזריק אלקטרונים לבסיס, הם חוצים אותו, והקולט אוסף אותם.
        </>
      ),
    },
    {
      kind: 'numeric',
      prompt: 'מהו הרוחב האלקטרוני (האפקטיבי) של הבסיס?',
      tex: 'V_{bi}=\\tfrac{kT}{q}\\ln\\tfrac{N_aN_d}{n_i^2}\\,,\\;\\; X_p=\\sqrt{\\tfrac{2\\varepsilon\\varepsilon_0}{q}(V_{bi}\\mp V)\\tfrac{N_{\\text{other}}}{N_B(N_C+N_B)}}',
      sub: 'V_{bi}(BC)\\approx0.63\\,,\\; X_p(BC)\\approx0.22\\;;\\;\\; V_{bi}(BE)\\approx0.75\\,,\\; X_p(BE)\\approx0.11',
      res: (
        <>
          W<sub>B,eff</sub> = 10 − (0.22+0.11) ≈ 9.67&nbsp;µm
        </>
      ),
      accent: ACCENT.sky,
      note: (
        <>
          שכבות המחסור של <b>שני</b> הצמתים גולשות לתוך הבסיס ומקצרות אותו. הצומת ה<b>אחורי</b> (BC) גולש{' '}
          <b>יותר</b> (<Tex>{'V_{bi}+V_{BC}'}</Tex> גדול), ולכן <Tex>{'X_p(BC)>X_p(BE)'}</Tex>. הרוחב האפקטיבי הוא
          הרוחב המטלורגי פחות שתי הגלישות.
        </>
      ),
    },
    {
      kind: 'concept',
      prompt: 'שרטטו את אופיין המוצא (3 זרמי כניסה) + פריצת אוולנש ב-$12\\,\\mathrm{V}$. איך משפיע אפקט התקצרות הבסיס?',
      answer: (
        <>
          מאחר ש-<Tex>{'V_{CE}=V_{BE}-V_{BC}'}</Tex>, עלייה ב-<Tex>{'V_{CE}'}</Tex> פירושה <Tex>{'V_{BC}'}</Tex> שלילי
          יותר ⇒ שכבת המחסור של BC גולשת יותר ⇒ הבסיס האפקטיבי <b>מתקצר</b> ⇒ זרם המוצא <b>גדל</b> (שיפוע חיובי
          באזור הפעיל = <b>אפקט Early</b>). ב-<Tex>{'BV_{CEO}=12\\,\\mathrm{V}'}</Tex> מתחילה <b>פריצת אוולנש</b> והזרם
          מזנק.
        </>
      ),
      sketch: () => <BjtOutputBreakdown />,
    },
    {
      kind: 'numeric',
      prompt: 'מצאו את נקודת העבודה של הטרנזיסטור במעגל.',
      tex: 'I_B=\\dfrac{V_{BB}-V_{BE}}{R_B+(1+\\beta)R_E}\\,,\\;\\; I_C=\\beta I_B\\,,\\;\\; V_{CE}=V_{CC}-I_CR_C-(1+\\beta)I_BR_E',
      sub: 'I_B=\\dfrac{5-0.6}{400k+41\\cdot7k}\\,,\\;\\; V_{CE}=10-0.26m\\cdot5k-41\\cdot6.4\\mu\\cdot7k',
      res: (
        <>
          I<sub>B</sub>≈6.4&nbsp;µA · I<sub>C</sub>≈0.26&nbsp;mA · V<sub>CE</sub>≈6.9&nbsp;V
        </>
      ),
      accent: ACCENT.violet,
      note: (
        <>
          במעגל הכניסה הזרם דרך <Tex>{'R_E'}</Tex> הוא <Tex>{'I_E=(1+\\beta)I_B'}</Tex>, ולכן <Tex>{'R_E'}</Tex> "נראה"
          מהבסיס מוכפל ב-<Tex>{'(1+\\beta)'}</Tex>. נקודת-העבודה <Tex>{'(V_{CE},I_C)=(6.9V,0.26mA)'}</Tex> יושבת על
          קו-העומס במרכז האזור הפעיל — מרחק בטוח מהרוויה ומהפריצה.
        </>
      ),
      given: () => <BjtBiasCircuit />,
      sketch: () => <BjtLoadLinePoint />,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את התנגדות המוצא $r_o$.',
      tex: 'r_o=\\dfrac{V_A}{I_C}',
      sub: '=\\dfrac{100}{0.26\\,\\mathrm{mA}}',
      res: <>≈ 385&nbsp;kΩ</>,
      accent: ACCENT.amber,
      note: <><Tex>{'r_o'}</Tex> = היפוך השיפוע באזור הפעיל; ככל ש-<Tex>{'V_A'}</Tex> גדול (אפקט Early חלש) — <Tex>{'r_o'}</Tex> גבוה והמקור "אידיאלי" יותר.</>,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Problem titleHe="BJT — רוחב בסיס אפקטיבי, Early ונקודת-עבודה" source="מתוך תרגול 6 · שאלה" parts={t6} formulas={t6Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">נתון טרנזיסטור <b>npn</b> עם סימום אחיד בבסיס:</p>
        <table className="mx-auto mt-3 border-collapse">
          <tbody>
            <tr>
              <ParamCol title="E (פולט) · n" rows={['N_E=10^{17}\\,\\mathrm{cm^{-3}}']} />
              <ParamCol title="B (בסיס) · p" rows={['N_B=10^{16}\\,\\mathrm{cm^{-3}}', 'W_B=10\\,\\mu m']} />
              <ParamCol title="C (קולט) · n" rows={['N_C=10^{15}\\,\\mathrm{cm^{-3}}']} />
            </tr>
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {['\\varepsilon_r=11.7', 'n_i^2=3\\times10^{20}\\,\\mathrm{cm^{-6}}', 'V_{BE}=0.6\\,\\mathrm{V}', 'V_{BC}=-3\\,\\mathrm{V}'].map((t, i) => (
            <span key={i} className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700" dir="ltr"><Tex>{t}</Tex></span>
          ))}
        </div>
        <p className="mt-3 leading-relaxed text-slate-700">
          ולמעגל ההטיה (סעיף ד):{' '}
          <span dir="ltr"><Tex>{'V_{BB}=5,\\;V_{CC}=10,\\;V_A=100\\,\\mathrm{V},\\;\\beta=40,\\;R_B=400k,\\;R_C=5k,\\;R_E=7k\\Omega'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="חישובים — תרגול עם בדיקה">
        <p className="mb-3 text-sm leading-relaxed text-slate-500">
          הקלידו תשובה ולחצו <b>בדוק</b>. «תרגיל חדש» מחליף את הנתונים, «פתרון» מציג את הדרך.
        </p>
        <div className="flex flex-col gap-3">
          <Drill title="① התנגדות-מוצא $r_o$" variants={RO_DRILLS} />
          <Drill title="② מוליכות-מעבר $g_m$" variants={GM_DRILLS} />
          <Drill title="③ מתח-פריצה $BV_{CEO}$" variants={BV_DRILLS} />
          <Drill title="④ תדר נפילה $f_\beta$" variants={FB_DRILLS} />
          <Drill title="⑤ הגבר-מתח $|A_v|$" variants={AV_DRILLS} />
        </div>
      </Panel>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · נתונים $V_A=80\,$V ו-$I_C=2\,$mA. מהי התנגדות-המוצא $r_o$?">
            <Tex>{'r_o=V_A/I_C=80/0.002=40\\,\\mathrm{k\\Omega}'}</Tex>.
          </QA>
          <QA q="2 · מדוע $BV_{CEO}$ קטן מ-$BV_{CBO}$?">
            כי בפולט-משותף נושאי-המפולת שנוצרים בצומת C-B <b>מוזרקים חזרה</b> ומוגברים פי-<Tex>{'\\beta'}</Tex>, כך שמספיק מתח נמוך יותר לפריצה:
            <Tex>{'\\;BV_{CEO}=BV_{CBO}/\\beta^{1/n}'}</Tex>.
          </QA>
          <QA q="3 · בעקומת Gummel — כיצד קוראים את $\beta_F$?">
            <Tex>{'\\beta_F=I_C/I_B'}</Tex>, ולכן ב-<Tex>{'\\log'}</Tex> זהו ה<b>מרווח האנכי</b> בין הישר של <Tex>{'I_C'}</Tex> לישר של <Tex>{'I_B'}</Tex> (באותו <Tex>{'V_{BE}'}</Tex>).
          </QA>
          <QA q="4 · נתון $I_C=1\,$mA, $\beta=100$. חשבו $g_m$ ו-$r_\pi$ (ב-300K).">
            <Tex>{'g_m=I_C/V_T=0.001/0.0259\\approx38.6\\,\\mathrm{mS}'}</Tex>; ‏<Tex>{'r_\\pi=\\beta/g_m\\approx2.6\\,\\mathrm{k\\Omega}'}</Tex>.
          </QA>
          <QA q="5 · מדוע $\beta$ נופל גם בזרם נמוך וגם בזרם גבוה?">
            <b>נמוך</b>: רקומבינציה באזור-המחסור של B-E (רכיב <Tex>{'n=2'}</Tex>) שמגדילה את <Tex>{'I_B'}</Tex>. <b>גבוה</b>: הזרקה-חזקה בבסיס שמקטינה את נצילות-ההזרקה <Tex>{'\\gamma'}</Tex>.
          </QA>
          <QA q="6 · $f_T=300\,$MHz ו-$\beta_0=150$. מהו $f_\beta$?">
            <Tex>{'f_\\beta=f_T/\\beta_0=300/150=2\\,\\mathrm{MHz}'}</Tex>.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
