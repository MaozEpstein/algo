import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import ReverseRecoveryWaveform from '../components/ReverseRecoveryWaveform'
import MinorityStorageProfile from '../components/MinorityStorageProfile'
import {
  MATERIALS,
  capPerArea,
  diffusionCapacitancePerArea,
  diffusionCoeff,
  diodeDynamicResistance,
  fmtCapPerArea,
  junctionState,
  nonIdealCurrents,
  storageTime,
  storedCharge,
  transitTime,
} from '../../../lib/junction'

const Si = MATERIALS.Si
const NA = 1e17
const ND = 1e16 // p⁺n → minority = holes in the n-side
const TAU0 = 1e-7
const TAU = Si.taup // minority (hole) lifetime ≈ 1e-6 s
const Dh = diffusionCoeff(Si.mup)
const WB_SHORT = 0.5e-4 // short-base width 0.5 µm (cm)
const IF = 1 // forward current density (A/cm²) for the transient

const fmtTime = (s: number) =>
  s < 1e-9 ? `${(s * 1e12).toFixed(0)} ps` : s < 1e-6 ? `${(s * 1e9).toFixed(s < 1e-7 ? 1 : 0)} ns` : `${(s * 1e6).toFixed(2)} µs`

export default function SwitchingTab() {
  const [Vj, setVj] = useState(0.6)
  const [ratio, setRatio] = useState(4)
  const [expTau, setExpTau] = useState(-7)
  const [shortBase, setShortBase] = useState(false)

  const cap = useMemo(() => {
    const J = nonIdealCurrents(NA, ND, Si, Vj, TAU0).Jtot
    const tauF = transitTime(Dh, TAU)
    return {
      J,
      tauF,
      rd: diodeDynamicResistance(1, J),
      cDiff: diffusionCapacitancePerArea(tauF, 1, J),
      cDep: capPerArea(Si.epsR, junctionState(NA, ND, Si, Vj).d),
    }
  }, [Vj])

  const tau = 10 ** expTau
  const tauEff = shortBase ? transitTime(Dh, tau, WB_SHORT) : tau
  const Ir = IF / ratio
  const tS = storageTime(tauEff, IF, Ir)
  const tRR = tS + 0.6 * tauEff

  return (
    <div className="flex flex-col gap-5">
      <Panel title="אגירת מטען — למה הכיבוי איטי">
        <p className="leading-relaxed text-slate-700">
          בהולכה קדמית מוזרקים נושאי-מיעוט ונאגרים באזור הניטרלי — מטען <Tex>{'Q=I_F\\tau'}</Tex>. <b>הדלקה</b> מהירה,
          אבל <b>כיבוי איטי</b>: כדי שהדיודה תחסום צריך קודם <b>לשטוף את המטען האגור</b>. זהו מקור ההשהיה במיתוג.
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">
              <span className="text-slate-500">פרופיל המיעוט העודף</span> — השטח = המטען האגור
            </p>
            <MinorityStorageProfile />
          </div>
          <StepFlow
            tone="reverse"
            steps={[
              { title: <>דיודה ב<b>הולכה</b> קדמית</>, body: <>מטען-מיעוט אגור <Tex>{'Q=I_F\\tau'}</Tex>.</> },
              { title: <>מיתוג <b>פתאומי</b> לאחורי</>, body: <>זרם מוגבל ע"י נגד-טור ל-<Tex>{'-I_R'}</Tex>.</> },
              { title: <>המטען חייב <b>להישטף</b> תחילה</>, body: <>הצומת נשאר <b>קדמי</b> כל עוד יש מטען.</> },
            ]}
            outcome={{ label: 'שלב האגירה — הזרם נשאר −I_R', sub: <>למשך <Tex>{'t_s=\\tau\\ln(1+I_F/I_R)'}</Tex></> }}
          />
        </div>
      </Panel>

      <Panel title="קיבול דיפוזיה מול קיבול מחסור">
        <p className="leading-relaxed text-slate-600">
          המטען האגור גורם ל<b>קיבול דיפוזיה</b> <Tex>{'C_{diff}=\\tau_F/r_d=\\tau_F|J|/(nV_T)'}</Tex> — <b>גדל עם הזרם
          הקדמי</b> ושולט שם. בממתח אחורי הוא נעלם, ו<b>קיבול המחסור</b> <Tex>{'C_{dep}=\\varepsilon_s/d'}</Tex> שולט.
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider label={<>מתח הצומת · <Tex>{'V_j'}</Tex></>} value={Vj} min={0.3} max={0.72} step={0.01} onChange={setVj} display={`${Vj.toFixed(2)} V`} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="זמן מעבר $\tau_F$" value={fmtTime(cap.tauF)} accent="border-violet-100 bg-violet-50" />
              <Readout label="התנגדות דינמית $r_d$" value={`${cap.rd < 1e3 ? cap.rd.toFixed(2) : cap.rd.toExponential(1)} Ω·cm²`} accent="border-sky-100 bg-sky-50" />
              <Readout label="קיבול דיפוזיה $C_{diff}$" value={fmtCapPerArea(cap.cDiff)} accent="border-rose-100 bg-rose-50" />
              <Readout label="קיבול מחסור $C_{dep}$" value={fmtCapPerArea(cap.cDep)} accent="border-amber-100 bg-amber-50" />
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-1">
            <div className="rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700">
              <b className="text-rose-700">קדמי:</b> <Tex>{'C_{diff}\\propto J'}</Tex> גדל מעריכית — שולט. אגירת-המטען היא ש"מאיטה" את המעבר.
            </div>
            <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-700">
              <b className="text-amber-700">אחורי:</b> אין מטען אגור, <Tex>{'C_{diff}\\to0'}</Tex>; <Tex>{'C_{dep}\\propto1/\\sqrt{V}'}</Tex> שולט.
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="מעבר הכיבוי — Reverse Recovery">
        <p className="leading-relaxed text-slate-600">
          הגל המתקבל: זרם קדמי <Tex>{'+I_F'}</Tex>, ואז מיתוג — הזרם נשאר <Tex>{'-I_R'}</Tex> בזמן-האגירה
          <Tex>{'\\;t_s'}</Tex>, ואז <b>מתאושש</b> ל-0. גררו את היחס והזמן-חיים, ונסו <b>בסיס קצר</b>:
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider label={<>יחס <Tex>{'I_F/I_R'}</Tex></>} value={ratio} min={0.5} max={8} step={0.1} onChange={setRatio} display={ratio.toFixed(1)} />
              <Slider label={<>זמן-חיים · <Tex>{'\\tau'}</Tex></>} value={expTau} min={-9} max={-5} step={0.1} onChange={setExpTau} display={fmtTime(tau)} />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">בסיס:</span>
                {([
                  { sb: false, he: 'ארוך (אגירה ∝ τ)' },
                  { sb: true, he: 'קצר (אגירה זעירה)' },
                ] as const).map((b) => (
                  <button
                    key={String(b.sb)}
                    onClick={() => setShortBase(b.sb)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      shortBase === b.sb ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {b.he}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="זמן אגירה $t_s$" value={fmtTime(tS)} accent="border-rose-100 bg-rose-50" />
              <Readout label="זמן התאוששות $t_r$" value={fmtTime(0.6 * tauEff)} accent="border-amber-100 bg-amber-50" />
              <Readout label="זמן התאוששות כולל $t_{rr}$" value={fmtTime(tRR)} accent="border-violet-100 bg-violet-50" />
              <Readout label="מטען אגור $Q=I_F\tau$" value={`${storedCharge(IF, tau).toExponential(1)} C/cm²`} accent="border-sky-100 bg-sky-50" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">
              <span className="text-slate-500">זרם–זמן I(t)</span> — אגירה ואז התאוששות
            </p>
            <ReverseRecoveryWaveform If={IF} ratio={ratio} tauEff={tauEff} tauRef={tau} />
          </div>
        </div>
      </Panel>

      <Panel title="המשך — שוטקי ו-BJT">
        <p className="leading-relaxed text-slate-600">
          ב<b>דיודת PN</b> ה-reverse-recovery נובע מהצורך <b>לשטוף את מטען-המיעוט האגור</b> לפני שהדיודה חוסמת —
          וזה מה שמאט את הכיבוי.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          <b>דיודת שוטקי</b> נושאת זרם ב<b>נושאי-רוב</b> בלבד, ולכן <b>אין מטען-מיעוט אגור</b>: זמן-האגירה
          <Tex>{'\\;t_s\\approx0'}</Tex>, אין reverse-recovery, והמיתוג <b>מהיר מאוד</b> (השוו בלשונית 2ג «שוטקי מול PN»).
        </p>
        <p className="mt-2 rounded-lg bg-emerald-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
          אותו רעיון של <b>אגירת-מטען וזמן-מעבר</b> חוזר בשיעור 3 (<b>BJT</b>): המטען האגור בבסיס קובע את
          מהירות-המיתוג ואת תדר-החיתוך <Tex>{'f_T'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
