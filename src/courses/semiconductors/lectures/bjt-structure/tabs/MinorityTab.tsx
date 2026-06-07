import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import BaseMinorityProfile from '../components/BaseMinorityProfile'
import { MATERIALS, baseTransportFactor, diffusionCoeff, diffusionLength } from '../../../lib/junction'

const Si = MATERIALS.Si
// npn → base is p-type → minority = electrons
const Dn = diffusionCoeff(Si.mun)
const Ln = diffusionLength(Dn, Si.taun) // cm
const LnMicron = Ln * 1e4

/** Lecture 3א — minority-carrier profile along E-B-C; the base slope is the current. */
export default function MinorityTab() {
  const [wb, setWb] = useState(1) // µm

  const wbCm = wb * 1e-4
  const b = baseTransportFactor(wbCm, Ln)
  const loss = (1 - b) * 100
  const iRel = 1 / wb // relative to W_B = 1 µm (I_C ∝ 1/W_B)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="הפרופיל בבסיס הוא-הוא הזרם">
        <p className="leading-relaxed text-slate-700">
          בפעיל-קדמי הפולט מזריק מיעוט לבסיס בריכוז <Tex>{'\\Delta n(0)'}</Tex>, ובקצה הקולט הוא כמעט אפס (השדה האחורי
          שואב אותו). בין שתי הקצוות הריכוז יורד <b>כמעט לינארית</b>. זרם-הקולט הוא זרם-<b>דיפוזיה</b>, ולכן{' '}
          <b>פרופורציוני לשיפוע</b>: <Tex>{'I_C\\propto \\dfrac{\\Delta n(0)}{W_B}'}</Tex>. גררו את רוחב-הבסיס:
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>רוחב הבסיס · <Tex>{'W_B'}</Tex></>}
                value={wb}
                min={0.2}
                max={8}
                step={0.1}
                onChange={setWb}
                display={`${wb.toFixed(1)} µm`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="אורך דיפוזיה $L_B$" value={`${LnMicron.toFixed(0)} µm`} accent="border-sky-100 bg-sky-50" />
              <Readout label="מקדם מעבר $b=1/\cosh(W_B/L_B)$" value={b.toFixed(4)} accent="border-emerald-100 bg-emerald-50" />
              <Readout label="אובדן בבסיס $1-b$" value={`${loss.toFixed(2)}%`} accent="border-rose-100 bg-rose-50" />
              <Readout label="זרם יחסי $\propto 1/W_B$" value={`×${iRel.toFixed(1)}`} accent="border-violet-100 bg-violet-50" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">
              <span className="text-slate-500">עודף-מיעוט לאורך E-B-C</span> — השיפוע בבסיס = הזרם
            </p>
            <BaseMinorityProfile wbMicron={wb} lMicron={LnMicron} />
          </div>
        </div>
      </Panel>

      <Panel title="למה דווקא בסיס דק">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">בסיס דק</b> → שיפוע <b>תלול</b> → <b>זרם-קולט גדול</b>, ו-<Tex>{'b\\to1'}</Tex>{' '}
            (כמעט אין רקומבינציה בדרך). זה לב-ליבו של ההגבר.
          </div>
          <div className="rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-rose-700">בסיס עבה</b> → שיפוע מתון → זרם קטן, ויותר מהמטען <b>נעלם ברקומבינציה</b> בבסיס{' '}
            (<Tex>{'b'}</Tex> יורד) — בדיוק "שתי הדיודות" שאינן מגבירות.
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          שימו לב: גם בבסיס דק <Tex>{'b'}</Tex> נשאר קרוב מאוד ל-1 — מה שמשתנה דרמטית הוא ה<b>שיפוע</b> (הזרם),
          שגדל כ-<Tex>{'1/W_B'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
