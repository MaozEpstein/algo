import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import VaractorCV from '../components/VaractorCV'
import { MATERIALS, METALS, fermiPotential, mosPhiMS, oxideCap, type MosCvParams } from '../../../lib/junction'

const SI = MATERIALS.Si
const AL = METALS.Al
const Na = 1e17
const phiF = fermiPotential(Na, SI.ni)
const Cox = oxideCap(20e-7)
const VFB = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
const cvParams: MosCvParams = { Na, ni: SI.ni, epsR: SI.epsR, Cox, phiF, VFB }

/** Lesson 6ג — the junction-controlled (varactor) capacitor: body bias tunes the C-V curve. */
export default function VaractorTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="קבל מבוקר-צומת (Varactor)">
        <p className="leading-relaxed text-slate-700">
          מוסיפים <b>מתח אחורי</b> <Tex>{'V_R'}</Tex> בין המל"מ למגע-הגב (כמו ממתח-אחורי על צומת). הוא <b>מוסיף</b>
          {' '}לכיפוף-הפסים שהמשטח צריך לשאת, ולכן:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
          <li>מתח-הסף <Tex>{'V_T'}</Tex> עולה → כל עקומת ה-<Tex>{'C\\text{-}V'}</Tex> <b>נדחפת ימינה</b>.</li>
          <li>אזור-המחסור עמוק יותר (<Tex>{'W_{max}'}</Tex> גדל) → <b>רצפת הקיבול</b> <Tex>{'C_{min}'}</Tex> <b>יורדת</b>.</li>
        </ul>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <VaractorCV {...cvParams} vrs={[0, 1.5, 3]} />
        </div>
      </Panel>

      <Panel title="למה זה שימושי">
        <div className="rounded-2xl border-s-4 border-emerald-400 bg-emerald-50/60 p-4 leading-relaxed text-slate-700">
          מתקבל <b>קבל שערכו נשלט במתח</b> — varactor. משתמשים בו לכוונון תדר (מתנדים, מסנני RF, PLL): משנים
          {' '}<Tex>{'V_R'}</Tex>, הקיבול משתנה, ותדר-התהודה זז. זהו אותו קבל MOS — רק שמנצלים את התלות <Tex>{'C(V)'}</Tex>.
        </div>
      </Panel>
    </div>
  )
}
