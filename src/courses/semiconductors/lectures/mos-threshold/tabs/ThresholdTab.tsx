import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import ProofModal from '../components/ProofModal'
import { MATERIALS, METALS, fermiPotential, mosPhiMS, oxideCap, mosDepletionCharge, mosMaxDepletion, mosThreshold, fmtLength } from '../../../lib/junction'

const SI = MATERIALS.Si
const AL = METALS.Al

/** Lesson 6ב — the threshold voltage V_T: derivation and an interactive N_A / t_ox explorer. */
export default function ThresholdTab() {
  const [logNa, setLogNa] = useState(17) // log10(N_A)
  const [toxNm, setToxNm] = useState(20)
  const Na = 10 ** logNa
  const phiF = fermiPotential(Na, SI.ni)
  const Cox = oxideCap(toxNm * 1e-7)
  const VFB = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
  const Wmax = mosMaxDepletion(phiF, Na, SI.epsR)
  const QdMax = mosDepletionCharge(2 * phiF, Na, SI.epsR)
  const VT = mosThreshold(VFB, phiF, QdMax, Cox)

  return (
    <div className="flex flex-col gap-5">
      <Panel title={<>סף ההיפוך החזק — מתח-הסף <Tex>{'V_T'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          מתח-השער הדרוש כדי להגיע ל<b>היפוך חזק</b> (<Tex>{'\\psi_s=2\\phi_F'}</Tex>), שבו נוצר ערוץ-ההיפוך:
        </p>
        <div className="my-3 rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-4 text-center">
          <Tex block>{'V_T = V_{FB} + 2\\phi_F + \\dfrac{|Q_{D,\\max}|}{C_{ox}}'}</Tex>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          שלושת האיברים: <b><Tex>{'V_{FB}'}</Tex></b> (יישור הפסים) + <b><Tex>{'2\\phi_F'}</Tex></b> (כיפוף הדרוש להיפוך) +
          {' '}<b><Tex>{'|Q_{D,\\max}|/C_{ox}'}</Tex></b> (הנפילה על האוקסיד מול מטען-המחסור המרבי).
        </p>
        <div className="mt-3">
          <ProofModal title="גזירת מתח-הסף" label="הצג הוכחה">
            <p>מאיזון המתחים והמטענים, מתח-השער הכללי הוא:</p>
            <Tex block>{'V_G = V_{FB} - \\dfrac{Q_s}{C_{ox}} + \\psi_s'}</Tex>
            <p className="mt-2">בסף ההיפוך החזק <Tex>{'\\psi_s=2\\phi_F'}</Tex>, ומטען-המל"מ הוא מטען-המחסור המרבי:</p>
            <Tex block>{'Q_{D,\\max}=-\\,q N_A W_{\\max},\\quad W_{\\max}=\\sqrt{\\dfrac{2\\varepsilon_s\\,(2\\phi_F)}{qN_A}}'}</Tex>
            <p className="mt-2">הצבה (עם <Tex>{'Q_s=Q_{D,\\max}<0'}</Tex>) נותנת:</p>
            <Tex block>{'V_T = V_{FB} + 2\\phi_F + \\dfrac{|Q_{D,\\max}|}{C_{ox}}'}</Tex>
          </ProofModal>
        </div>
      </Panel>

      <Panel title="מה משפיע על מתח-הסף — נסו">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <Slider
            label={<>סימום המצע · <Tex>{'N_A'}</Tex></>}
            value={logNa}
            min={15}
            max={18}
            step={0.1}
            onChange={setLogNa}
            display={`10^${logNa.toFixed(1)} cm⁻³`}
          />
          <Slider
            label={<>עובי האוקסיד · <Tex>{'t_{ox}'}</Tex></>}
            value={toxNm}
            min={2}
            max={100}
            step={1}
            onChange={setToxNm}
            display={`${toxNm} nm`}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Readout label={'$\\phi_F$'} value={`${phiF.toFixed(3)} V`} accent="border-violet-100 bg-violet-50" />
          <Readout label={'$2\\phi_F$'} value={`${(2 * phiF).toFixed(3)} V`} accent="border-violet-100 bg-violet-50" />
          <Readout label={'$V_{FB}$'} value={`${VFB.toFixed(2)} V`} accent="border-rose-100 bg-rose-50" />
          <Readout label={'$W_{max}$'} value={fmtLength(Wmax)} accent="border-sky-100 bg-sky-50" />
          <Readout label={'$|Q_{D,max}|/C_{ox}$'} value={`${(QdMax / Cox).toFixed(2)} V`} accent="border-amber-100 bg-amber-50" />
          <Readout label={'$V_T$'} value={`${VT.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          סימום גבוה יותר → <Tex>{'2\\phi_F'}</Tex> ו-<Tex>{'|Q_{D,\\max}|'}</Tex> גדלים → <Tex>{'V_T'}</Tex> עולה. אוקסיד עבה
          יותר → <Tex>{'C_{ox}'}</Tex> קטן → האיבר <Tex>{'|Q_{D,\\max}|/C_{ox}'}</Tex> גדל → <Tex>{'V_T'}</Tex> עולה.
        </p>
      </Panel>

      <Panel title="הקשר ל-MOSFET">
        <div className="rounded-2xl border-s-4 border-sky-400 bg-sky-50/60 p-4 leading-relaxed text-slate-700">
          מעבר ל-<Tex>{'V_T'}</Tex> נוצר <b>ערוץ-ההיפוך</b> — בדיוק תעלת ה-MOSFET המוליכה בין המקור לניקוז. לכן
          {' '}<Tex>{'V_T'}</Tex> הוא הפרמטר המרכזי של הטרנזיסטור: מתחתיו ההתקן <b>כבוי</b>, ומעליו <b>פתוח</b>.
        </div>
      </Panel>
    </div>
  )
}
