import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import BiasedBandDiagram from '../components/BiasedBandDiagram'
import Readout from '../components/Readout'
import { MATERIALS, fmtField, fmtLength, fmtVolt, junctionState } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si
// fixed x-frame (widest case = equilibrium here) so the band visibly NARROWS as V_A grows
const REF = junctionState(NA, ND, mat, 0)
const X_REF = Math.max(REF.dn, REF.dp) * 2.2

/**
 * Lecture 1ב — Forward bias: barrier lowers to q(V_bi−V_A), depletion narrows,
 * the built-in field weakens, diffusion regains the upper hand and majority
 * carriers pour across. A small slider drives the band diagram + ρ→E→V live.
 */
export default function ForwardTab() {
  const [Va, setVa] = useState(0.4)
  const state = useMemo(() => junctionState(NA, ND, mat, Va), [Va])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ממתח קדמי — מה קורה?">
        <p className="leading-relaxed text-slate-600">
          בממתח קדמי (<Tex>{'V_A>0'}</Tex>) המתח החיצוני <b>מתנגד</b> לשדה הבנוי. התוצאה משרשרת:
        </p>
        <ol className="mt-3 list-decimal space-y-2 ps-6 leading-relaxed text-slate-600 marker:font-bold marker:text-amber-500">
          <li>מחסום הפוטנציאל <b>יורד</b> מ-<Tex>{'qV_{bi}'}</Tex> ל-<Tex>{'q(V_{bi}-V_A)'}</Tex>.</li>
          <li>אזור המחסור <b>מצטמצם</b> (פחות מטען חשוף נדרש), והשדה הבנוי <b>נחלש</b>.</li>
          <li>האיזון נשבר: <b>הדיפוזיה גוברת</b> על הסחיפה, ונושאי רוב חוצים את הצומת בכמות גדולה.</li>
          <li>נושאים אלה הופכים לנושאי <b>מיעוט מוזרקים</b> בצד השני — וזה זרם הדיודה (בהמשך).</li>
        </ol>
      </Panel>

      <Panel title="הזיזו את הממתח הקדמי">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>ממתח קדמי · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={0}
                max={0.6}
                step={0.02}
                onChange={setVa}
                display={fmtVolt(Va)}
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                שימו לב: ככל ש-<Tex>{'V_A'}</Tex> עולה, רצועת המחסור מצטמצמת ופסי האנרגיה משתטחים — והפער
                בין רמות הקוואזי-פרמי גדל ל-<Tex>{'qV_A'}</Tex>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="מחסום $q(V_{bi}-V_A)$" value={fmtVolt(state.Vbi - Va)} accent="border-amber-100 bg-amber-50" />
              <Readout label="רוחב $d$" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
              <Readout label="שדה שיא $E_{max}$" value={fmtField(state.Emax)} accent="border-slate-100 bg-white" />
              <Readout label="פיצול $E_{Fn}-E_{Fp}$" value={fmtVolt(Va)} accent="border-emerald-100 bg-emerald-50" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">דיאגרמת הפסים תחת ממתח</p>
              <BiasedBandDiagram state={state} Va={Va} Na={NA} Nd={ND} mat={mat} xMaxRef={X_REF} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V · המפל יורד ל-<Tex>{'V_{bi}-V_A'}</Tex></p>
              <JunctionElectrostatics dn={state.dn} dp={state.dp} Emax={state.Emax} Vbi={state.Vbi - Va} Na={NA} Nd={ND} xMaxRef={X_REF} />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
