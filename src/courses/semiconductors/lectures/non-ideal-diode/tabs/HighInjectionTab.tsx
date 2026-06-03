import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import { MATERIALS, thermalVoltage } from '../../../lib/junction'

const Si = MATERIALS.Si
const ND = 1e17
const N0 = (Si.ni * Si.ni) / ND // equilibrium minority (holes in the n-side)

/**
 * Δn vs applied voltage on a log axis. The injected excess Δn = n0·e^{V/V_T} rises
 * exponentially and eventually crosses the majority doping N_D — beyond that point
 * the low-injection assumption (Δn ≪ N) breaks and the diode enters high injection.
 */
function DeltaNvsN() {
  const W = 460
  const H = 250
  const mL = 46
  const mR = 16
  const mT = 18
  const mB = 38
  const PW = W - mL - mR
  const PH = H - mT - mB
  const yBot = mT + PH
  const VT = thermalVoltage(300)
  const vMax = 0.95
  const dn = (v: number) => N0 * Math.exp(v / VT)
  const yTop = Math.log10(dn(vMax)) + 0.5
  const yLo = Math.log10(N0) - 0.5
  const xOf = (v: number) => mL + (v / vMax) * PW
  const yOf = (val: number) => yBot - ((Math.log10(val) - yLo) / (yTop - yLo)) * PH
  // crossover Δn = N_D
  const vCross = VT * Math.log(ND / N0)
  const N = 80
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const v = (vMax * i) / N
    return `${xOf(v).toFixed(1)},${yOf(dn(v)).toFixed(1)}`
  })
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* high-injection region (Δn > N_D) */}
        <rect x={xOf(vCross)} y={mT} width={mL + PW - xOf(vCross)} height={PH} fill="#e0f2fe" opacity={0.7} />
        <text x={(xOf(vCross) + mL + PW) / 2} y={mT + 14} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 11, fontWeight: 700 }}>
          הזרקה חזקה
        </text>
        {/* axes */}
        <line x1={mL} y1={yBot} x2={W - mR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>log Δn</text>
        <text x={W - mR} y={yBot + 14} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11 }}>
          V<tspan dy={2} style={{ fontSize: 8 }}>A</tspan> (V)
        </text>
        {/* doping line N_D */}
        <line x1={mL} y1={yOf(ND)} x2={W - mR} y2={yOf(ND)} stroke="#f59e0b" strokeWidth={1.75} strokeDasharray="5 4" />
        <text x={mL + 6} y={yOf(ND) - 5} className="fill-amber-600" style={{ fontSize: 10, fontWeight: 700 }}>
          ריכוז הרוב N<tspan dy={2} style={{ fontSize: 7 }}>D</tspan>
        </text>
        {/* Δn curve */}
        <path d={'M ' + pts.join(' L ')} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />
        {/* crossover marker */}
        <circle cx={xOf(vCross)} cy={yOf(ND)} r={4} fill="#0ea5e9" />
        <text x={mL + 6} y={yBot - 6} className="fill-violet-600" style={{ fontSize: 10, fontWeight: 700 }}>
          Δn = n₀·e^(V/V_T)
        </text>
      </svg>
    </div>
  )
}

/**
 * Lecture 2ב — high-level injection (Webster effect). When the injected excess
 * minority density approaches the majority doping, the low-injection assumption
 * breaks, the field redistributes, and the forward slope returns to n≈2 at high
 * bias — the upper bend of the characteristic, bookending the n=1 diffusion region.
 */
export default function HighInjectionTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מתי «הזרקה חלשה» נשברת?">
        <p className="leading-relaxed text-slate-600">
          כל הגזירה האידיאלית הניחה <b>הזרקה חלשה</b>: העודף המוזרק <Tex>{'\\Delta n'}</Tex> קטן בהרבה מריכוז נושאי
          הרוב <Tex>{'N'}</Tex>. אבל <Tex>{'\\Delta n'}</Tex> גדל <b>מעריכית</b> עם המתח — ובקדמי גבוה הוא{' '}
          <b>מדביק</b> את <Tex>{'N'}</Tex>. מאותה נקודה ההנחה לא תקפה, ונכנסים ל<b>הזרקה חזקה</b>.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">העודף המוזרק חוצה את ריכוז הרוב — תחילת ההזרקה החזקה</p>
          <DeltaNvsN />
        </div>
      </Panel>

      <Panel title="למה השיפוע חוזר ל-n≈2">
        <p className="leading-relaxed text-slate-600">
          בהזרקה חזקה נושאי המיעוט העודפים כה רבים שהם <b>מושכים אחריהם</b> נושאי רוב (כדי לשמור על ניטרליות),
          וריכוז הנושאים האפקטיבי גדל כ-<Tex>{'\\sqrt{\\;}'}</Tex> של גורם בולצמן. התוצאה: הזרם גדל כ-<Tex>{'e^{V_A/2V_T}'}</Tex> —
          שוב <Tex>{'n\\approx2'}</Tex>, אך מסיבה <b>אחרת</b> לגמרי מהרקומבינציה.
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>קדמי גבוה → <b>הזרקה עצומה</b></>, body: <><Tex>{'\\Delta n'}</Tex> מתקרב ל-<Tex>{'N'}</Tex>.</> },
            { title: <>נושאי רוב <b>נמשכים</b> לאיזון מטען</>, body: <>מוליכות הבולק "מתאפננת".</> },
            { title: <>תלות המתח <b>נחלשת</b></>, body: <>הזרם <Tex>{'\\propto e^{V_A/2V_T}'}</Tex>.</> },
          ]}
          outcome={{ label: 'שיפוע n≈2 בקדמי גבוה', sub: <>הקצה העליון של אזור ה-<Tex>{'n=1'}</Tex></> }}
        />
        <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4 text-sm leading-relaxed text-slate-600">
          <b>שתי הקצוות של אזור ה-<Tex>{'n=1'}</Tex>:</b> רקומבינציה (<Tex>{'n=2'}</Tex>) חוסמת מ<b>למטה</b> (קדמי נמוך),
          הזרקה חזקה (<Tex>{'n=2'}</Tex>) חוסמת מ<b>למעלה</b> (קדמי גבוה) — והדיפוזיה הנקייה (<Tex>{'n=1'}</Tex>) שולטת רק
          ב<b>חלון</b> שביניהן.
        </div>
      </Panel>
    </div>
  )
}
