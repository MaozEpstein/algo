import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import SourceSketch from '../../bjt-structure/components/SourceSketch'
import Readout from '../components/Readout'
import ProofModal from '../components/ProofModal'
import OxideChargesDiagram from '../components/OxideChargesDiagram'
import { MATERIALS, METALS, fermiPotential, mosPhiMS, oxideCap, mosDepletionCharge, mosThreshold, mosFlatBandShift } from '../../../lib/junction'

const SI = MATERIALS.Si
const AL = METALS.Al
const Na = 1e17
const Cox = oxideCap(20e-7) // t_ox = 20 nm
const phiF = fermiPotential(Na, SI.ni)
const VFBideal = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
const QdMax = mosDepletionCharge(2 * phiF, Na, SI.epsR)

const CHARGES: { sub: string; tone: string; name: string; where: string; origin: string }[] = [
  { sub: 'it', tone: 'border-rose-300 bg-rose-50/60', name: 'מטען לכוד בממשק', where: 'ממשק Si/SiO₂', origin: 'קשרים תלויים (dangling bonds); תלוי-מתח' },
  { sub: 'f', tone: 'border-emerald-300 bg-emerald-50/60', name: 'מטען קבוע', where: 'שכבת SiOₓ הדקה ליד הממשק', origin: 'שאריות תהליך החִמצון; חיובי וקבוע' },
  { sub: 'ox', tone: 'border-slate-300 bg-slate-50', name: 'מטען לכוד בתחמוצת', where: 'בנפח ה-SiO₂', origin: 'לכידה (קרינה / הזרקת נשאים)' },
  { sub: 'm', tone: 'border-amber-300 bg-amber-50/60', name: 'יונים ניידים', where: 'בתוך ה-SiO₂', origin: 'Na⁺, K⁺ — נעים עם מתח/חום (בעיית יציבות)' },
]

/** Lesson 6 — oxide & interface charges, and the real (non-ideal) flat-band voltage. */
export default function OxideChargesTab() {
  const [nss, setNss] = useState(1e11) // effective interface-referred sheet charge (cm⁻²)
  const dVfb = mosFlatBandShift(nss, Cox)
  const VFB = VFBideal + dVfb
  const VT = mosThreshold(VFB, phiF, QdMax, Cox)
  const VTideal = mosThreshold(VFBideal, phiF, QdMax, Cox)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="עד כאן — קבל אידיאלי. עכשיו המציאות.">
        <div className="rounded-2xl border-s-4 border-amber-400 bg-amber-50/60 p-4 leading-relaxed text-slate-700">
          עד עכשיו הנחנו <b>אוקסיד אידיאלי</b> — נקי ממטען, כך ש-<Tex>{'V_{FB}=\\phi_{MS}'}</Tex>. במציאות, ב-SiO₂
          ובממשק Si/SiO₂ <b>תמיד יש מטענים</b> (שאריות תהליך, יונים, מלכודות). הם <b>מזיזים את <Tex>{'V_{FB}'}</Tex>
          {' '}ואת <Tex>{'V_T'}</Tex></b> ומסיטים את כל האופיין — זו <b>אי-האידיאליות</b> המרכזית של הקבל.
        </div>
      </Panel>

      <Panel title="ארבעת סוגי-המטען">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="flex-1 leading-relaxed text-slate-700">
            ארבעה מטענים, לפי <b>היכן</b> הם יושבים במבנה — מהשער כלפי המצע:
          </p>
          <SourceSketch src="docs/mos-oxide-charges-source.png" title="מטעני-תחמוצת — שרטוט המרצה" label="לראות קובץ מקור" download="MOS oxide charges (source).png" />
        </div>
        <div className="mt-3 grid items-center gap-4 lg:grid-cols-2">
          <OxideChargesDiagram />
          <div className="flex flex-col gap-2">
            {CHARGES.map((c) => (
              <div key={c.sub} className={`rounded-xl border-s-4 ${c.tone} px-4 py-2.5`}>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-slate-800"><Tex>{`Q_{${c.sub}}`}</Tex></span>
                  <span className="font-bold text-slate-700">{c.name}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600"><b>היכן:</b> {c.where} · <b>מקור:</b> {c.origin}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title={<>המטען האפקטיבי <Tex>{'Q_{ss}'}</Tex> ותיקון <Tex>{'V_{FB}'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          את כל המטענים מסכמים ל<b>מטען אפקטיבי אחד</b> <Tex>{'Q_{ss}'}</Tex>, הממופה לממשק (מטען קרוב לשער משפיע
          פחות — שקלול לפי המרחק). הוא מזיז את מתח ה-flat-band:
        </p>
        <div className="my-3 rounded-xl border-2 border-violet-300 bg-violet-50/60 p-4 text-center">
          <Tex block>{'V_{FB} = \\phi_{MS} - \\dfrac{Q_{ss}}{C_{ox}}'}</Tex>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-slate-600">
          ומכיוון ש-<Tex>{'V_T = V_{FB} + 2\\phi_F + |Q_{D,\\max}|/C_{ox}'}</Tex>, גם <Tex>{'V_T'}</Tex> זז באותו
          <Tex>{'\\;\\Delta V_{FB}'}</Tex> — כל האופיין נדחף ימינה/שמאלה.
        </p>
        <ProofModal title="המטען האפקטיבי — שקלול לפי המרחק" label="הצג הוכחה">
          <p>מטען בנקודה <Tex>{'x'}</Tex> בתוך האוקסיד (השער ב-<Tex>{'x=0'}</Tex>, הממשק ב-<Tex>{'x=t_{ox}'}</Tex>)
          תורם ל-<Tex>{'V_{FB}'}</Tex> לפי מרחקו מהשער — מטען צמוד לשער כמעט לא משפיע, ומטען בממשק משפיע במלואו:</p>
          <Tex block>{'Q_{ss} = \\int_0^{t_{ox}} \\dfrac{x}{t_{ox}}\\,\\rho_{ox}(x)\\,dx'}</Tex>
          <p className="mt-2">זהו "המטען השקול בממשק". עבורו הנפילה על האוקסיד היא <Tex>{'Q_{ss}/C_{ox}'}</Tex>, ומכאן
          <Tex>{'\\;V_{FB}=\\phi_{MS}-Q_{ss}/C_{ox}'}</Tex>.</p>
        </ProofModal>
      </Panel>

      <Panel title="מה זה עושה — נסו">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Slider
            label={<>מטען אפקטיבי · <Tex>{'N_{ss}'}</Tex></>}
            value={nss}
            min={-3e11}
            max={3e11}
            step={1e10}
            onChange={setNss}
            display={`${(nss / 1e11).toFixed(1)}×10¹¹ cm⁻²`}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Readout label={'הזזה $\\Delta V_{FB}$'} value={`${dVfb >= 0 ? '+' : ''}${dVfb.toFixed(2)} V`} accent="border-amber-100 bg-amber-50" />
          <Readout label={'$V_{FB}$ אידיאלי'} value={`${VFBideal.toFixed(2)} V`} accent="border-slate-100 bg-slate-50" />
          <Readout label={'$V_{FB}$ ריאלי'} value={`${VFB.toFixed(2)} V`} accent="border-violet-100 bg-violet-50" />
          <Readout label={'$V_T$ ריאלי'} value={`${VT.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          מטען חיובי באוקסיד (<Tex>{'N_{ss}>0'}</Tex>) מזיז את <Tex>{'V_{FB}'}</Tex> ואת <Tex>{'V_T'}</Tex> <b>שלילה</b>
          {' '}(ביחס לאידיאלי <Tex>{`V_T=${VTideal.toFixed(2)}\\,V`}</Tex>) — לכן בקרת-מטען בתהליך הייצור היא קריטית.
        </p>
      </Panel>
    </div>
  )
}
