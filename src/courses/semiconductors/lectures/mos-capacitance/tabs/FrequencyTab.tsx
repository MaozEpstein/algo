import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import CVFrequencyChart from '../components/CVFrequencyChart'
import { MATERIALS, METALS, fermiPotential, mosPhiMS, oxideCap, type MosCvParams } from '../../../lib/junction'

const SI = MATERIALS.Si
const AL = METALS.Al
const Na = 1e17
const phiF = fermiPotential(Na, SI.ni)
const Cox = oxideCap(20e-7)
const VFB = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
const cvParams: MosCvParams = { Na, ni: SI.ni, epsR: SI.epsR, Cox, phiF, VFB }

const REGS: { mode: string; color: string; what: string }[] = [
  { mode: 'תדר נמוך (LF)', color: 'text-emerald-700', what: 'נושאי-המיעוט (ערוץ-ההיפוך) מספיקים להיווצר ולהיעלם בקצב האות → בהיפוך הקיבול $חוזר$ ל-$C_{ox}$ (עקומה "U").' },
  { mode: 'תדר גבוה (HF)', color: 'text-sky-700', what: 'נושאי-המיעוט $לא$ מספיקים להגיב; רק קצה-המחסור (נושאי-רוב) נע → מעל הסף הקיבול $ננעל$ על $C_{min}=C_{ox}\\,\\|\\,C_{dep,max}$.' },
  { mode: 'דלדול-עמוק (DD)', color: 'text-rose-700', what: 'סריקת-מתח $מהירה$ — אין זמן ליצירת ערוץ-ההיפוך, $\\psi_s$ חורג מ-$2\\phi_F$, $W>W_{max}$ והקיבול ממשיך $לרדת$ מתחת ל-$C_{min}$.' },
]

/** Lesson 6ג — the frequency response of the C-V curve: LF / HF / Deep-Depletion. */
export default function FrequencyTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title={<>אותו קבל — שלוש עקומות <Tex>{'C\\text{-}V'}</Tex></>}>
        <p className="leading-relaxed text-slate-700">
          ההתנהגות ב<b>הצטברות ובמחסור</b> זהה בכל התדרים. ההבדל כולו ב<b>היפוך</b>, ותלוי בשאלה אחת: האם
          {' '}<b>נושאי-המיעוט</b> (אלקטרוני-הערוץ) מספיקים להגיב לקצב האות?
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <CVFrequencyChart {...cvParams} show={['LF', 'HF', 'DD']} />
        </div>
      </Panel>

      <Panel title="הפיזיקה מאחורי כל עקומה">
        <div className="flex flex-col gap-2">
          {REGS.map((r) => (
            <div key={r.mode} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <b className={r.color}>{r.mode}</b>
              <RichMath text={r.what} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="המסקנה">
        <div className="rounded-2xl border-s-4 border-sky-400 bg-sky-50/60 p-4 leading-relaxed text-slate-700">
          הקיבול הוא <b>חלון אל הדינמיקה</b>: אותו מבנה DC נותן עקומות <Tex>{'C\\text{-}V'}</Tex> שונות לפי מהירות
          האות, כי תגובת נושאי-המיעוט <b>איטית</b>. מדידת LF מול HF היא כלי-אבחון מרכזי ל-MOS אמיתי.
        </div>
      </Panel>
    </div>
  )
}

function RichMath({ text }: { text: string }) {
  const parts = text.split('$')
  return (
    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
      {parts.map((seg, i) => (i % 2 === 1 ? <Tex key={i}>{seg}</Tex> : <span key={i}>{seg}</span>))}
    </p>
  )
}
