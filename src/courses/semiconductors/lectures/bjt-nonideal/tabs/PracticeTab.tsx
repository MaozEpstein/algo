import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Drill, { type DrillVariant } from '../components/Drill'

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

/** Lecture 3ג — practice on the non-ideal effects and models. */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
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

      <Panel title="שאלות">
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
