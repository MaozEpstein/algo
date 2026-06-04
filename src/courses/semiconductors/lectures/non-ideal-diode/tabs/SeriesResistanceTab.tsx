import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import NonIdealIVCurve from '../components/NonIdealIVCurve'
import { MATERIALS, diodeDynamicResistance, fmtCurrentDensity, fmtVolt, nonIdealCurrents, terminalVoltage, thermalVoltage } from '../../../lib/junction'

const Si = MATERIALS.Si
const NA = 1e16
const ND = 1e17
const TAU0 = 1e-7

/** Local ideality factor n = (1/V_T)·dV/d(ln J_tot) at the operating point. */
function localN(Vj: number): number {
  const VT = thermalVoltage(300)
  const h = 0.01
  const j1 = nonIdealCurrents(NA, ND, Si, Vj - h, TAU0).Jtot
  const j2 = nonIdealCurrents(NA, ND, Si, Vj + h, TAU0).Jtot
  return (2 * h) / (VT * Math.log(j2 / j1))
}

/**
 * Lecture 2ב — series resistance. The bulk and contacts carry the diode current
 * too; at high current the I·R_s drop steals a growing share of the applied
 * voltage, so the terminal characteristic bends over and straightens (resistor-
 * like). Driven parametrically (V_term = V_j + J·R_s), shown on log and linear axes.
 */
export default function SeriesResistanceTab() {
  const [rs, setRs] = useState(1)
  const [Vj, setVj] = useState(0.6)
  const c = useMemo(() => nonIdealCurrents(NA, ND, Si, Vj, TAU0), [Vj])
  const drop = c.Jtot * rs
  const vTerm = terminalVoltage(Vj, c.Jtot, rs)
  const nLoc = useMemo(() => localN(Vj), [Vj])
  const rd = diodeDynamicResistance(nLoc, c.Jtot) // dynamic (small-signal) resistance, Ω·cm²

  return (
    <div className="flex flex-col gap-5">
      <Panel title="לא כל המתח מגיע לצומת">
        <p className="leading-relaxed text-slate-600">
          ההנחה האידיאלית: כל המתח החיצוני נופל על אזור המחסור. אבל הזרם חייב לעבור גם דרך ה<b>בולק</b> הניטרלי
          וה<b>מגעים</b> — ולהם <b>התנגדות טורית</b> <Tex>{'R_S'}</Tex>. מה שמגיע לצומת הוא רק:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'V_j = V_{term} - J\\,R_S \\quad\\Longleftrightarrow\\quad V_{term}=V_j+J\\,R_S'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          בזרם נמוך <Tex>{'J R_S'}</Tex> זניח והעקומה אידיאלית; בזרם <b>גבוה</b> המפל גדל, וכל תוספת מתח חיצוני
          "מתבזבזת" על <Tex>{'R_S'}</Tex> — האופיין מתיישר לישר רזיסטיבי.
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>זרם <b>גבוה</b> בקדמי</>, body: <>מעבר לברך המעריכית.</> },
            { title: <>מפל <Tex>{'J R_S'}</Tex> <b>גדל</b></>, body: <>חלק גדל מהמתח נופל על הבולק.</> },
            { title: <>פחות מתח <b>מגיע לצומת</b></>, body: <><Tex>{'V_j'}</Tex> כמעט "נתקע".</> },
          ]}
          outcome={{ label: 'האופיין מתכופף ומתיישר', sub: <>שיפוע רזיסטיבי במקום מעריכי</> }}
        />
      </Panel>

      <Panel title="הזיזו את ההתנגדות הטורית">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>התנגדות טורית · <Tex>{'R_S'}</Tex></>}
                value={rs}
                min={0}
                max={5}
                step={0.1}
                onChange={setRs}
                display={`${rs.toFixed(1)} Ω·cm²`}
              />
              <div className="mt-3">
                <Slider label={<>מתח-צומת · <Tex>{'V_j'}</Tex></>} value={Vj} min={0.3} max={0.7} step={0.01} onChange={setVj} display={`${Vj.toFixed(2)} V`} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                ככל ש-<Tex>{'R_S'}</Tex> גדל, הברך העליונה מתכופפת ימינה: אותו זרם דורש מתח-הדק גבוה יותר, כי
                ההפרש נבלע ב-<Tex>{'R_S'}</Tex>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="$J$ בנקודת העבודה" value={fmtCurrentDensity(c.Jtot)} accent="border-violet-100 bg-violet-50" />
              <Readout label="מפל על $R_S$ · $JR_S$" value={fmtVolt(drop)} accent="border-rose-100 bg-rose-50" />
              <Readout label="מתח-צומת $V_j$" value={fmtVolt(Vj)} accent="border-slate-100 bg-white" />
              <Readout label="מתח-הדק $V_{term}$" value={fmtVolt(vTerm)} accent="border-amber-100 bg-amber-50" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">חצי-לוג — הברך בזרם גבוה</p>
              <NonIdealIVCurve Na={NA} Nd={ND} mat={Si} Vj={Vj} tau0={TAU0} rs={rs} mode="log" curves={['tot']} showIdeal regions />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">לינארי — ההתיישרות הרזיסטיבית</p>
              <NonIdealIVCurve Na={NA} Nd={ND} mat={Si} Vj={Vj} tau0={TAU0} rs={rs} mode="linear" curves={['tot']} showIdeal />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="שתי התנגדויות — דינמית מול טורית">
        <p className="leading-relaxed text-slate-600">
          חשוב לא לבלבל בין שתי "התנגדויות" של הדיודה. ל-<Tex>{'R_S'}</Tex> ה<b>טורית</b> מצטרפת ה<b>התנגדות
          הדינמית</b> (אות-קטן) של הצומת עצמו — <b>שיפוע</b> האופיין בנקודת העבודה:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'r_d=\\frac{dV}{dI}=\\frac{n\\,V_T}{I}'}</Tex>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
            <p className="font-bold text-slate-800">התנגדות דינמית <Tex>{'r_d'}</Tex></p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              של ה<b>צומת</b>, <b>תלוית-מתח</b>: יורדת כ-<Tex>{'1/I'}</Tex> ככל שמגבירים את הזרם. זהו השיפוע שמשמש
              ב<b>מודל אות-קטן</b> של הדיודה.
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
            <p className="font-bold text-slate-800">התנגדות טורית <Tex>{'R_S'}</Tex></p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              של ה<b>בולק והמגעים</b>, <b>קבועה</b> (אוהמית) ובלתי-תלויה במתח. שולטת רק בזרם <b>גבוה</b>, כשהיא
              עולה על <Tex>{'r_d'}</Tex>.
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Readout label="התנגדות דינמית $r_d=nV_T/I$" value={`${rd < 1e4 ? rd.toFixed(2) : rd.toExponential(1)} Ω·cm²`} accent="border-violet-100 bg-violet-50" />
          <Readout label="התנגדות טורית $R_S$" value={`${rs.toFixed(1)} Ω·cm²`} accent="border-rose-100 bg-rose-50" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          ההתנגדות הכוללת שהמקור "רואה" היא בקירוב <Tex>{'r_d+R_S'}</Tex>: בזרם נמוך <Tex>{'r_d\\gg R_S'}</Tex>{' '}
          (הצומת שולט), ובזרם גבוה <Tex>{'r_d'}</Tex> צונח עד ש-<Tex>{'R_S'}</Tex> משתלט — וזו הברך הרזיסטיבית.
        </p>
      </Panel>
    </div>
  )
}
