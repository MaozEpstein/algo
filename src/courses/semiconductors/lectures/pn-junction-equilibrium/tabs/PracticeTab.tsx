import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import {
  MATERIALS,
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

/**
 * A fully-solved example laid out like an exam answer: a "שאלה" block stating
 * the givens, then a numbered "פתרון" where each step shows the symbolic
 * formula → the numbers substituted in (הצבה) → the highlighted result. Every
 * number comes straight from junctionState(), so the worked answer is always
 * self-consistent.
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

  // accent classes for the result chip, per quantity
  const sky = 'bg-sky-50 text-sky-700 ring-sky-100'
  const slate = 'bg-slate-50 text-slate-700 ring-slate-200'
  const amber = 'bg-amber-50 text-amber-700 ring-amber-100'

  const steps: { he: string; tex: string; sub: string; res: ReactNode; accent: string }[] = [
    {
      he: 'מתח בנוי',
      tex: 'V_{bi} = \\frac{kT}{q}\\,\\ln\\!\\left(\\frac{N_A N_D}{n_i^{2}}\\right)',
      sub: `= ${vt}\\cdot\\ln\\!\\left(\\dfrac{${PROD}}{(${ni})^{2}}\\right)`,
      res: fmtVolt(st.Vbi),
      accent: sky,
    },
    {
      he: 'רוחב אזור המחסור',
      tex: 'd = \\sqrt{\\dfrac{2\\varepsilon_s V_{bi}}{q}\\cdot\\dfrac{N_A+N_D}{N_A N_D}}',
      sub: `= \\sqrt{\\dfrac{2(${mat.epsR})(8.85\\times10^{-14})(${vbi})}{1.6\\times10^{-19}}\\cdot\\dfrac{${SUM}}{${PROD}}}`,
      res: fmtLength(st.d),
      accent: slate,
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
      accent: slate,
    },
    {
      he: 'שדה מרבי (בצומת)',
      tex: 'E_{max} = \\dfrac{2V_{bi}}{d}',
      sub: `= \\dfrac{2(${vbi})}{${dCm}\\,\\mathrm{cm}}`,
      res: fmtField(st.Emax),
      accent: amber,
    },
  ]

  const chip = 'rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700'

  return (
    <Panel title={titleHe}>
      {/* question block — the givens + what to find, styled like an exam prompt */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">
          שאלה
        </span>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתון צומת <b>{mat.he}</b> בשיווי משקל (טמפרטורת החדר), עם הסימומים:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={chip} dir="ltr"><Tex>{`N_A = 10^{${expNa}}\\,\\mathrm{cm^{-3}}`}</Tex></span>
          <span className={chip} dir="ltr"><Tex>{`N_D = 10^{${expNd}}\\,\\mathrm{cm^{-3}}`}</Tex></span>
          <span className={chip} dir="ltr"><Tex>{'T = 300\\,\\mathrm{K}'}</Tex></span>
        </div>
        <p className="mt-3 text-slate-700">
          <b>דרוש:</b> חשבו את <Tex>{'V_{bi},\\; d,\\; d_n,\\; d_p,\\; E_{max}'}</Tex>.
        </p>
      </div>

      {/* solution — numbered steps, each: formula → substitution → result */}
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          פתרון
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-slate-700">{s.he}</span>
            </div>
            {/* each line: a fixed-width label tag (right, RTL) + its LTR math —
                so the formula and its substitution sit on the SAME side, lined up */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-400">נוסחה</span>
                <span className="ltr text-slate-600" dir="ltr"><Tex>{s.tex}</Tex></span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500">הצבה</span>
                <span className="ltr text-slate-700" dir="ltr"><Tex>{s.sub}</Tex></span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500">תוצאה</span>
                <span className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ring-1 ${s.accent}`} dir="ltr">
                  {s.res}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">
        💡 {heavier
          ? <>הצד המסומם פחות (צד {wider}) "סופג" את רוב אזור המחסור — <Tex>{`d_${wider}`}</Tex> הוא הגדול מבין השניים, בדיוק כצפוי בצומת חד-צדדי.</>
          : <>הצומת סימטרי, ולכן <Tex>{'d_n = d_p'}</Tex> ואזור המחסור מתחלק שווה בין הצדדים.</>}
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
        <p className="font-semibold text-slate-800">{q}</p>
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
      <WorkedExample titleHe="דוגמה פתורה 2 — צומת חד-צדדי (p⁺n)" mat={MATERIALS.Si} expNa={18} expNd={15} />

      <Panel title="שאלות לבדיקה עצמית">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה רמת פרמי E_F אחידה לכל רוחב ההתקן בשיווי משקל?">
            כי בשיווי משקל אין זרם נטו. שיפוע ב-<Tex>{'E_F'}</Tex> היה גורר זרם (דיפוזיה+סחיפה שאינם מתאזנים),
            ולכן <Tex>{'E_F'}</Tex> חייבת להיות שטוחה — זו ממש החתימה של שיווי המשקל.
          </QA>
          <QA q="2 · באיזה צד אזור המחסור רחב יותר, ולמה?">
            בצד המסומם <b>פחות</b>. מנייטרליות המטען <Tex>{'N_A d_p = N_D d_n'}</Tex> — הצד עם פחות יונים קבועים
            צריך רוחב גדול יותר כדי "לחשוף" מטען שווה לצד השני.
          </QA>
          <QA q="3 · מה קורה ל-V_bi אם מכפילים את שני הסימומים פי 10?">
            המכפלה <Tex>{'N_A N_D'}</Tex> גדלה פי 100, ולכן <Tex>{'V_{bi}'}</Tex> עולה ב-
            <Tex>{'\\tfrac{kT}{q}\\ln(100) \\approx 120\\,mV'}</Tex> בלבד — עלייה קטנה, בגלל התלות הלוגריתמית.
          </QA>
          <QA q="4 · למה אי-אפשר למדוד את V_bi עם מודד-מתח?">
            המתח הבנוי מתקזז על-ידי <b>מתחי-המגע</b> במגעים בקצות ההתקן. סכום המתחים בלולאה סגורה הוא אפס,
            ולכן אין מתח חיצוני מדיד ואי-אפשר להפיק מ-<Tex>{'V_{bi}'}</Tex> הספק.
          </QA>
          <QA q="5 · מה זה n_i ולמה הוא מכריע?">
            ריכוז הנושאים בחומר אינטרינסי (<Tex>{'n = p = n_i'}</Tex>). דרך <Tex>{'n\\cdot p = n_i^2'}</Tex> הוא
            קובע את ריכוזי המיעוט, ודרך <Tex>{'V_{bi}=\\tfrac{kT}{q}\\ln(N_AN_D/n_i^2)'}</Tex> את המתח הבנוי.
            הוא תלוי מעריכית בפער האנרגיה ובטמפרטורה.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
