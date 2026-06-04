import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import SurfaceStatesDiagram from '../components/SurfaceStatesDiagram'
import BarrierPinningChart from '../components/BarrierPinningChart'
import {
  MATERIALS,
  METALS,
  METAL_LIST,
  fermiAboveNeutral,
  fmtDoping,
  pinningFactor,
  schottkyBarrier,
  surfaceBarrier,
} from '../../../lib/junction'

const Si = MATERIALS.Si
const ND = 1e17

const QUICK = [
  { he: 'משטח מצוין', exp: 11 },
  { he: 'סף קיבוע', exp: 13 },
  { he: 'Si ממשי', exp: 14 },
]

/**
 * Lecture 2ג — surface states & Fermi-level pinning. Dangling bonds make a band of
 * states in the gap (density D_it); the D_it slider drives the barrier from the ideal
 * φ_m−χ toward the pinned ⅔E_g, and the metal pills show that under strong pinning the
 * barrier barely moves with the metal.
 */
export default function SurfaceStatesTab() {
  const [metalKey, setMetalKey] = useState('Au')
  const [expDit, setExpDit] = useState(13)
  const metal = METALS[metalKey]
  const Dit = 10 ** expDit
  const st = useMemo(() => {
    const S = pinningFactor(Dit)
    return {
      S,
      phiB: surfaceBarrier(metal.phiM, Si.chi, Si.eg, Dit),
      phiIdeal: schottkyBarrier(metal.phiM, Si.chi),
      dEf: fermiAboveNeutral(metal.phiM, Si.chi, Si.eg, Dit),
      regime: S > 0.7 ? 'כמעט-אידיאלי' : S < 0.3 ? 'מקובע' : 'מעבר',
    }
  }, [metal, Dit])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מצבי שטח — מהם?">
        <p className="leading-relaxed text-slate-700">
          על פני-השטח של הגביש נקטעת המחזוריות ונותרים <b>קשרים תלויים</b> (dangling bonds). הם יוצרים <b>רצף של
          מצבים מותרים בתוך הפער האסור</b>, בצפיפות <Tex>{'D_{it}'}</Tex> (יחידות <Tex>{'\\mathrm{cm^{-2}eV^{-1}}'}</Tex>).
          קיימת <b>רמת-נייטרליות</b> <Tex>{'E_0'}</Tex> (כ-<Tex>{'\\tfrac13E_g'}</Tex> מעל <Tex>{'E_v'}</Tex>): מצבים
          <b> מתחתיה</b> מאוכלסים, <b>מעליה</b> ריקים.
        </p>
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          המודל האידיאלי (Schottky-Mott) אומר <Tex>{'\\varphi_B=\\varphi_m-\\chi'}</Tex>. מצבי-השטח משנים זאת —
          ראו בפאנל הבא איך, וכמה.
        </p>
      </Panel>

      <Panel title="מ-אידיאלי ל-מקובע — גררו את צפיפות המצבים">
        <p className="leading-relaxed text-slate-600">
          ככל ש-<Tex>{'D_{it}'}</Tex> גדל, רמת-פרמי בממשק <b>נקשרת</b> ל-<Tex>{'E_0'}</Tex> והמחסום עובר מהאידיאלי
          אל ה<b>מקובע</b> (Bardeen):
        </p>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'\\varphi_{Bn}=S\\,(\\varphi_m-\\chi)+(1-S)\\cdot\\tfrac23E_g,\\qquad S=\\frac{1}{1+D_{it}/D_{crit}}'}</Tex>
        </div>

        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">מתכת:</span>
                {METAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMetalKey(m.key)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      m.key === metalKey ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.key} <span className="text-xs opacity-70">{m.phiM}</span>
                  </button>
                ))}
              </div>
              <Slider label={<>צפיפות מצבי-שטח · <Tex>{'D_{it}'}</Tex></>} value={expDit} min={11} max={14} step={0.1} onChange={setExpDit} display={<Tex>{`${fmtDoping(Dit)}\\,\\mathrm{cm^{-2}eV^{-1}}`}</Tex>} />
              <div className="flex flex-wrap items-center gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q.he}
                    onClick={() => setExpDit(q.exp)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      Math.abs(expDit - q.exp) < 0.05 ? 'border-violet-400 bg-violet-100 text-violet-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {q.he}
                  </button>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                הביטו: ב-<Tex>{'D_{it}'}</Tex> נמוך החלפת-מתכת מזיזה את <Tex>{'\\varphi_B'}</Tex> הרבה; בגבוה — כמעט לא.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Readout label="גורם קיבוע $S$" value={st.S.toFixed(2)} accent="border-violet-100 bg-violet-50" />
              <Readout label="מחסום $\varphi_B$" value={`${st.phiB.toFixed(2)} eV`} accent="border-emerald-100 bg-emerald-50" />
              <Readout label="$E_F-E_0$" value={`${st.dEf.toFixed(2)} eV`} accent="border-sky-100 bg-sky-50" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st.S < 0.3 ? 'bg-emerald-100 text-emerald-700' : st.S > 0.7 ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                {st.regime}
              </span>
              <span className="text-xs text-slate-500">אידיאלי: <Tex>{`\\varphi_m-\\chi=${st.phiIdeal.toFixed(2)}`}</Tex> eV</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">
              <span className="text-slate-500">דיאגרמת פסים · מצבי-שטח בפער</span> — צפיפות וכהות לפי <Tex>{'D_{it}'}</Tex>
            </p>
            <SurfaceStatesDiagram metal={metal} mat={Si} Nd={ND} Dit={Dit} />
          </div>
        </div>

        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          <b>למה זה קורה — איזון מטען:</b> מטען המחסור <Tex>{'Q_{dep}=qN_DW'}</Tex> מאוזן ע"י מטען מצבי-השטח
          <Tex>{'\\;Q_{ss}=qD_{it}(E_F-E_0)'}</Tex>. כש-<Tex>{'D_{it}\\to\\infty'}</Tex>, איזון מטען-קבוע מחייב
          <Tex>{'\\;E_F\\to E_0'}</Tex> — ולכן <Tex>{'\\varphi_B'}</Tex> <b>מתנתק מ-</b><Tex>{'\\varphi_m'}</Tex>.
        </p>
      </Panel>

      <Panel title="אידיאלי מול ממשי — קיבוע רמת-פרמי">
        <p className="leading-relaxed text-slate-600">
          התוצאה במבט-על: באידיאלי <Tex>{'\\varphi_B=\\varphi_m-\\chi'}</Tex> (תלוי חזק במתכת), אבל בקיבוע
          <Tex>{'\\varphi_B'}</Tex> <b>כמעט בלתי-תלוי במתכת</b> ונע סביב <Tex>{'\\tfrac23E_g\\approx0.75\\,\\mathrm{eV}'}</Tex>.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">גובה מחסום מול פונקציית-עבודה</span> — אידיאלי (פזור) מול מקובע (מצטופף)
          </p>
          <BarrierPinningChart />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          זהו אחד מ<b>שני</b> האפקטים הלא-אידיאליים של המחסום; השני הוא <b>אפקט שוטקי</b> (הנמכת-מחסום בכוח-דמות
          <Tex>{'\\;\\Delta\\varphi_B'}</Tex>) שראינו בלשונית «פליטה תרמיונית».
        </p>
        <p className="mt-2 rounded-lg bg-emerald-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
          <b>וזו הסיבה ל-2ד:</b> בגלל הקיבוע קשה ליצור על Si מגע אוהמי בעל-מחסום-נמוך (צבירה) — ולכן הדרך המעשית
          למגע אוהמי היא <b>סימום כבד + מנהור</b>.
        </p>
      </Panel>
    </div>
  )
}
