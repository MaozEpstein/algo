import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import NonIdealIVCurve from '../components/NonIdealIVCurve'
import { MATERIALS, fmtCurrentDensity, fmtVolt, nonIdealCurrents, terminalVoltage } from '../../../lib/junction'

const Si = MATERIALS.Si
const NA = 1e16
const ND = 1e17
const TAU0 = 1e-7

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
    </div>
  )
}
