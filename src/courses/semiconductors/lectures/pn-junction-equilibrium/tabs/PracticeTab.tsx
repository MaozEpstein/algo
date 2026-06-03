import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import {
  MATERIALS,
  dopingFromVbi,
  dopingFromWidth,
  fmtField,
  fmtLength,
  fmtVolt,
  junctionState,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

/** A number as a KaTeX-ready "m×10ⁿ" string, for the data-substitution lines. */
function sciTex(n: number, digits = 1): string {
  const exp = Math.floor(Math.log10(n))
  const mant = n / 10 ** exp
  return `${mant.toFixed(digits)}\\times10^{${exp}}`
}

/** Like sciTex but rounds + re-normalizes the mantissa (9.97×10¹⁷ → 1.0×10¹⁸). */
function sciTexNorm(n: number, digits = 1): string {
  let exp = Math.floor(Math.log10(n))
  let mant = Number((n / 10 ** exp).toFixed(digits))
  if (mant >= 10) {
    mant /= 10
    exp += 1
  }
  return `${mant.toFixed(digits)}\\times10^{${exp}}`
}

type Step = { he: string; tex: string; sub: string; res: ReactNode; accent: string }

// result-chip accents, by quantity
const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}
const chipCls = 'rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700'

/** The "שאלה" prompt box (exam-style); caller supplies the givens + what to find. */
function QuestionBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">
        שאלה
      </span>
      {children}
    </div>
  )
}

/**
 * One collapsible step: the header (number + name) is always visible so the
 * learner can decide what to reveal; the formula → substitution → result body
 * is hidden until clicked. Controlled by the parent so the "פתרון" header can
 * open/close all the steps at once.
 */
function StepCard({ step, index, open, onToggle }: { step: Step; index: number; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-start transition hover:bg-slate-50"
      >
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-slate-700"><RichText>{step.he}</RichText></span>
        <svg
          className={`ms-auto h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        // each line: a fixed-width label tag (right, RTL) + its LTR math, so the
        // formula and its substitution sit on the SAME side, lined up
        <div className="space-y-2 px-4 pb-4">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-400">נוסחה</span>
            <span className="ltr text-slate-600" dir="ltr"><Tex>{step.tex}</Tex></span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500">הצבה</span>
            <span className="ltr text-slate-700" dir="ltr"><Tex>{step.sub}</Tex></span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500">תוצאה</span>
            <span className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ring-1 ${step.accent}`} dir="ltr">
              {step.res}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * The "פתרון" block: collapsible step cards (closed by default). Clicking a step
 * opens just it; clicking the "פתרון" header opens — or closes — them all.
 */
function SolutionSteps({ steps }: { steps: Step[] }) {
  const [open, setOpen] = useState<boolean[]>(() => steps.map(() => false))
  const allOpen = open.every(Boolean)
  const toggleAll = () => setOpen(steps.map(() => !allOpen))
  const toggleOne = (i: number) => setOpen((prev) => prev.map((v, k) => (k === i ? !v : v)))

  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={toggleAll}
          aria-expanded={allOpen}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          פתרון
          <svg
            className={`h-3.5 w-3.5 transition-transform ${allOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <span className="shrink-0 text-xs text-slate-400">לחצו «פתרון» לפתיחת/סגירת הכל, או על שלב לחוד</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {steps.map((s, i) => (
          <StepCard key={i} step={s} index={i} open={open[i]} onToggle={() => toggleOne(i)} />
        ))}
      </div>
    </>
  )
}

/**
 * A forward worked example laid out like an exam answer: givens → numbered
 * solution (formula → substitution → result). Numbers come from junctionState(),
 * so the answer is always self-consistent.
 */
function WorkedExample({ titleHe, mat, expNa, expNd }: { titleHe: string; mat: Material; expNa: number; expNd: number }) {
  const Na = 10 ** expNa
  const Nd = 10 ** expNd
  const st = junctionState(Na, Nd, mat)
  const wider = st.dn > st.dp ? 'n' : 'p'
  const heavier = Na > Nd ? 'p' : Nd > Na ? 'n' : null

  // values reused across the substitution lines
  const vt = thermalVoltage(300).toFixed(4) // kT/q ≈ 0.0259 V
  const vbi = st.Vbi.toFixed(3) // carried forward into d and E_max
  const ni = sciTex(mat.ni)
  const dCm = sciTex(st.d) // d in cm, for the E_max substitution
  const NA = `10^{${expNa}}`
  const ND = `10^{${expNd}}`
  const SUM = `10^{${expNa}}+10^{${expNd}}` // N_A + N_D
  const PROD = `10^{${expNa}}\\cdot 10^{${expNd}}` // N_A · N_D

  const steps: Step[] = [
    {
      he: 'מתח בנוי',
      tex: 'V_{bi} = \\frac{kT}{q}\\,\\ln\\!\\left(\\frac{N_A N_D}{n_i^{2}}\\right)',
      sub: `= ${vt}\\cdot\\ln\\!\\left(\\dfrac{${PROD}}{(${ni})^{2}}\\right)`,
      res: fmtVolt(st.Vbi),
      accent: ACCENT.sky,
    },
    {
      he: 'רוחב אזור המחסור',
      tex: 'd = \\sqrt{\\dfrac{2\\varepsilon_s V_{bi}}{q}\\cdot\\dfrac{N_A+N_D}{N_A N_D}}',
      sub: `= \\sqrt{\\dfrac{2(${mat.epsR})(8.85\\times10^{-14})(${vbi})}{1.6\\times10^{-19}}\\cdot\\dfrac{${SUM}}{${PROD}}}`,
      res: fmtLength(st.d),
      accent: ACCENT.slate,
    },
    {
      he: 'חלוקה בין הצדדים (נייטרליות מטען)',
      tex: 'N_A\\,d_p = N_D\\,d_n \\;\\Rightarrow\\; d_n = d\\,\\dfrac{N_A}{N_A+N_D}',
      sub: `d_n = d\\cdot\\dfrac{${NA}}{${SUM}},\\quad d_p = d\\cdot\\dfrac{${ND}}{${SUM}}`,
      res: (
        <>
          d<sub>n</sub> = {fmtLength(st.dn)} · d<sub>p</sub> = {fmtLength(st.dp)}
        </>
      ),
      accent: ACCENT.slate,
    },
    {
      he: 'שדה מרבי (בצומת)',
      tex: 'E_{max} = \\dfrac{2V_{bi}}{d}',
      sub: `= \\dfrac{2(${vbi})}{${dCm}\\,\\mathrm{cm}}`,
      res: fmtField(st.Emax),
      accent: ACCENT.amber,
    },
  ]

  return (
    <Panel title={titleHe}>
      <QuestionBlock>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתון צומת <b>{mat.he}</b> בשיווי משקל (טמפרטורת החדר), עם הסימומים:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={chipCls} dir="ltr"><Tex>{`N_A = 10^{${expNa}}\\,\\mathrm{cm^{-3}}`}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{`N_D = 10^{${expNd}}\\,\\mathrm{cm^{-3}}`}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'T = 300\\,\\mathrm{K}'}</Tex></span>
        </div>
        <p className="mt-3 text-slate-700">
          <b>דרוש:</b> חשבו את <Tex>{'V_{bi},\\; d,\\; d_n,\\; d_p,\\; E_{max}'}</Tex>.
        </p>
      </QuestionBlock>

      <SolutionSteps steps={steps} />

      <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">
        💡 {heavier
          ? <>הצד המסומם פחות (צד {wider}) "סופג" את רוב אזור המחסור — <Tex>{`d_${wider}`}</Tex> הוא הגדול מבין השניים, בדיוק כצפוי בצומת חד-צדדי.</>
          : <>הצומת סימטרי, ולכן <Tex>{'d_n = d_p'}</Tex> ואזור המחסור מתחלק שווה בין הצדדים.</>}
      </p>
    </Panel>
  )
}

/**
 * A *reverse* worked example: instead of computing the parameters from the
 * doping, we're given a measured V_bi and depletion width and recover the
 * doping. Uses the one-sided approximation (N_A ≫ N_D) to get N_D from the
 * width, then V_bi to get N_A. Givens come from junctionState(), so the
 * recovered numbers land on the true doping.
 */
function ReverseExample({ titleHe, mat, expNa, expNd }: { titleHe: string; mat: Material; expNa: number; expNd: number }) {
  const st = junctionState(10 ** expNa, 10 ** expNd, mat)
  const ndRec = dopingFromWidth(mat.epsR, st.Vbi, st.d) // light side, from the width
  const naRec = dopingFromVbi(st.Vbi, ndRec, mat.ni) // heavy side, from V_bi
  const ratioExp = Math.round(Math.log10(naRec / ndRec))

  const vbi = st.Vbi.toFixed(3)
  const vt = thermalVoltage(300).toFixed(4)
  const ni = sciTex(mat.ni)
  const dCm = sciTex(st.d)

  const steps: Step[] = [
    {
      he: 'חילוץ $N_D$ מרוחב המחסור (קירוב חד-צדדי)',
      tex: 'd \\approx \\sqrt{\\dfrac{2\\varepsilon_s V_{bi}}{q\\,N_D}} \\;\\Rightarrow\\; N_D \\approx \\dfrac{2\\varepsilon_s V_{bi}}{q\\,d^{2}}',
      sub: `\\approx \\dfrac{2(${mat.epsR})(8.85\\times10^{-14})(${vbi})}{(1.6\\times10^{-19})(${dCm})^{2}}`,
      res: <Tex>{`\\approx ${sciTexNorm(ndRec)}\\,\\mathrm{cm^{-3}}`}</Tex>,
      accent: ACCENT.sky,
    },
    {
      he: 'חילוץ $N_A$ מהמתח הבנוי',
      tex: 'V_{bi} = \\dfrac{kT}{q}\\ln\\!\\dfrac{N_A N_D}{n_i^{2}} \\;\\Rightarrow\\; N_A = \\dfrac{n_i^{2}}{N_D}\\,e^{qV_{bi}/kT}',
      sub: `= \\dfrac{(${ni})^{2}}{${sciTexNorm(ndRec)}}\\;e^{${vbi}/${vt}}`,
      res: <Tex>{`\\approx ${sciTexNorm(naRec)}\\,\\mathrm{cm^{-3}}`}</Tex>,
      accent: ACCENT.amber,
    },
  ]

  return (
    <Panel title={titleHe}>
      <QuestionBlock>
        <p className="mt-2 leading-relaxed text-slate-700">
          על צומת <b>{mat.he}</b> חד-צדדי (<Tex>{'p^{+}n'}</Tex>, כלומר <Tex>{'N_A \\gg N_D'}</Tex>) נמדדו בשיווי
          משקל הגדלים הבאים:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={chipCls} dir="ltr"><Tex>{`V_{bi} = ${vbi}\\,\\mathrm{V}`}</Tex></span>
          <span className={chipCls} dir="ltr"><Tex>{'d'}</Tex>{` = ${fmtLength(st.d)}`}</span>
        </div>
        <p className="mt-3 text-slate-700">
          <b>דרוש:</b> חלצו את הסימום בשני הצדדים — <Tex>{'N_D'}</Tex> ו-<Tex>{'N_A'}</Tex>.
        </p>
      </QuestionBlock>

      <SolutionSteps steps={steps} />

      <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">
        💡 הסדר חשוב: קודם <Tex>{'N_D'}</Tex> (מהרוחב, בקירוב חד-צדדי), ואז <Tex>{'N_A'}</Tex> (מהמתח הבנוי).
        בדיקה: <Tex>{`N_A/N_D \\approx 10^{${ratioExp}} \\gg 1`}</Tex> — מאשר את ההנחה, ושגיאת הקירוב היא רק
        מסדר <Tex>{'N_D/N_A'}</Tex>.
      </p>
    </Panel>
  )
}

/** A self-check question with a toggle to reveal/hide the answer. */
function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(false)
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

/**
 * Lecture 1א — practice: a couple of worked examples (numbers computed live from
 * the physics, so they stay correct) and a set of click-to-reveal self-check
 * questions consolidating the equilibrium concepts.
 */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          קראו את הדוגמאות הפתורות, ואז נסו לענות על שאלות הבדיקה-העצמית <b>לפני</b> שאתם חושפים את
          התשובה. כדאי לחזור לארגז החול ולאמת את המספרים בעצמכם.
        </p>
      </Panel>

      <WorkedExample titleHe="דוגמה פתורה 1 — צומת סימטרי" mat={MATERIALS.Si} expNa={16} expNd={16} />
      <ReverseExample titleHe="דוגמה פתורה 2 — שאלה הפוכה: חילוץ הסימום" mat={MATERIALS.Si} expNa={18} expNd={15} />

      <Panel title="שאלות לבדיקה עצמית">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה רמת פרמי $E_F$ אחידה לכל רוחב ההתקן בשיווי משקל?">
            כי בשיווי משקל אין זרם נטו. שיפוע ב-<Tex>{'E_F'}</Tex> היה גורר זרם (דיפוזיה+סחיפה שאינם מתאזנים),
            ולכן <Tex>{'E_F'}</Tex> חייבת להיות שטוחה — זו ממש החתימה של שיווי המשקל.
          </QA>
          <QA q="2 · באיזה צד אזור המחסור רחב יותר, ולמה?">
            בצד המסומם <b>פחות</b>. מנייטרליות המטען <Tex>{'N_A d_p = N_D d_n'}</Tex> — הצד עם פחות יונים קבועים
            צריך רוחב גדול יותר כדי "לחשוף" מטען שווה לצד השני.
          </QA>
          <QA q="3 · מה קורה ל-$V_{bi}$ אם מכפילים את שני הסימומים פי 10?">
            המכפלה <Tex>{'N_A N_D'}</Tex> גדלה פי 100, ולכן <Tex>{'V_{bi}'}</Tex> עולה ב-
            <Tex>{'\\tfrac{kT}{q}\\ln(100) \\approx 120\\,mV'}</Tex> בלבד — עלייה קטנה, בגלל התלות הלוגריתמית.
          </QA>
          <QA q="4 · למה אי-אפשר למדוד את $V_{bi}$ עם מודד-מתח?">
            המתח הבנוי מתקזז על-ידי <b>מתחי-המגע</b> במגעים בקצות ההתקן. סכום המתחים בלולאה סגורה הוא אפס,
            ולכן אין מתח חיצוני מדיד ואי-אפשר להפיק מ-<Tex>{'V_{bi}'}</Tex> הספק.
          </QA>
          <QA q="5 · מה זה $n_i$ ולמה הוא מכריע?">
            ריכוז הנושאים בחומר אינטרינסי (<Tex>{'n = p = n_i'}</Tex>). דרך <Tex>{'n\\cdot p = n_i^2'}</Tex> הוא
            קובע את ריכוזי המיעוט, ודרך <Tex>{'V_{bi}=\\tfrac{kT}{q}\\ln(N_AN_D/n_i^2)'}</Tex> את המתח הבנוי.
            הוא תלוי מעריכית בפער האנרגיה ובטמפרטורה.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
