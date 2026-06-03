import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import CVPlot from '../components/CVPlot'
import Readout from '../components/Readout'
import { MATERIALS, capPerArea, fmtCapPerArea, fmtLength, fmtVolt, junctionState } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si

/**
 * Lecture 1ב — depletion width & junction capacitance vs bias. d(V_A) and
 * E_max scale with √(V_bi−V_A); the depletion region behaves as a parallel-plate
 * capacitor C_j/A = ε_s/d, so 1/C_j² is LINEAR in V_A — the basis of the
 * doping/V_bi extraction. A slider drives a live C–V plot + readouts.
 */
export default function WidthCapTab() {
  const [Va, setVa] = useState(-1)
  const state = useMemo(() => junctionState(NA, ND, mat, Va), [Va])
  const capA = capPerArea(mat.epsR, state.d)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="רוחב המחסור והשדה תחת ממתח">
        <p className="leading-relaxed text-slate-600">
          כל הנוסחאות מחלק א' נשארות — רק מחליפים <Tex>{'V_{bi}'}</Tex> ב-<Tex>{'(V_{bi}-V_A)'}</Tex>:
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <Tex block>{'d(V_A)=\\sqrt{\\dfrac{2\\varepsilon_s}{q}\\,(V_{bi}-V_A)\\,\\dfrac{N_A+N_D}{N_A N_D}}'}</Tex>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <Tex block>{'E_{max}=\\dfrac{2(V_{bi}-V_A)}{d}'}</Tex>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          ממתח קדמי (<Tex>{'V_A>0'}</Tex>) → <Tex>{'d'}</Tex> קטֵן; ממתח אחורי (<Tex>{'V_A<0'}</Tex>) → <Tex>{'d'}</Tex>{' '}
          גדל. התלות היא <Tex>{'d\\propto\\sqrt{V_{bi}-V_A}'}</Tex>.
        </p>
      </Panel>

      <Panel title="קיבול הצומת וחילוץ הסימום">
        <p className="leading-relaxed text-slate-600">
          אזור המחסור הוא קבל לוחות עם מרווח <Tex>{'d'}</Tex>, ולכן הקיבול ליחידת שטח:
        </p>
        <div className="mt-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'\\frac{C_j}{A}=\\frac{\\varepsilon_s}{d}\\;\\propto\\;(V_{bi}-V_A)^{-1/2}'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          מהעלאת המשוואה בריבוע מקבלים ש-<Tex>{'1/C_j^2'}</Tex> הוא <b>קו ישר</b> ב-<Tex>{'V_A'}</Tex>:
          ה<b>שיפוע</b> נותן את הסימום, ו<b>חיתוך הציר</b> (היכן ש-<Tex>{'1/C_j^2=0'}</Tex>) נותן את{' '}
          <Tex>{'V_{bi}'}</Tex>. זו שיטת מדידה סטנדרטית של סימום הצומת.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>מתח חיצוני · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={-5}
                max={0.6}
                step={0.05}
                onChange={setVa}
                display={fmtVolt(Va)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="רוחב $d$" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
              <Readout label="קיבול $C_j/A$" value={fmtCapPerArea(capA)} accent="border-violet-100 bg-violet-50" />
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              שימו לב ל-<b>קשר ההפוך</b>: בממתח קדמי <Tex>{'d'}</Tex> קטֵן והקיבול <b>גדל</b>; בממתח אחורי
              להפך. בקו ה-<Tex>{'1/C_j^2'}</Tex> המסומן רואים שהוא ישר וחותך את הציר ב-<Tex>{'V_{bi}'}</Tex>.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">קיבול הצומת מול המתח</p>
            <CVPlot Na={NA} Nd={ND} mat={mat} Va={Va} />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <p className="text-sm font-semibold text-amber-700">⚡ שני קיבולים בצומת</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            <b>קיבול המחסור</b> <Tex>{'C_j'}</Tex> (שדנו בו) שולט ב<b>ממתח אחורי</b> ובשיווי-משקל. אבל
            ב<b>ממתח קדמי</b> נאגר <b>מטען מיעוט עודף</b> ליד הצומת, והשינוי שלו עם המתח נותן <b>קיבול
            דיפוזיה</b> <Tex>{'C_d'}</Tex> — שגדל מעריכית עם <Tex>{'V_A'}</Tex> ו<b>שולט</b> בקדמי. הגזירה
            המלאה של <Tex>{'C_d'}</Tex> (תלוי בזרם ובזמן-החיים <Tex>{'\\tau'}</Tex>) — בחלק הבא.
          </p>
        </div>
      </Panel>
    </div>
  )
}
