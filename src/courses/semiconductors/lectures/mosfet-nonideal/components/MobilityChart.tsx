import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from '../../mosfet/components/Readout'
import { mosfetMobilityDegraded } from '../../../lib/junction'

/**
 * Mobility degradation in the linear region: a larger gate voltage presses the inversion carriers
 * harder against the oxide interface → more surface scattering → lower effective mobility
 * μ_eff = μ0 / (1 + θ(V_GS − V_T)). A θ slider tilts the roll-off; the curve is normalised to μ0.
 */
const OVMAX = 4
const W = 480
const H = 240
const mL = 50
const mR = 20
const mT = 18
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const N = 80
const xOf = (ov: number) => mL + (ov / OVMAX) * PW
const yOf = (r: number) => mT + (1 - r) * PH // r = μ_eff/μ0 ∈ [0,1]

export default function MobilityChart() {
  const [theta, setTheta] = useState(0.3)
  const at = (ov: number) => mosfetMobilityDegraded(1, theta, ov, 0) // μ0=1, V_T=0 → overdrive = ov
  const path = (() => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const ov = (OVMAX * i) / N
      pts.push(`${xOf(ov).toFixed(1)},${yOf(at(ov)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  })()
  const sample = at(2)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>מקדם-הדרדרות · <Tex>{'\\theta'}</Tex></>} value={theta} min={0} max={1} step={0.02} onChange={setTheta} display={`${theta.toFixed(2)} V⁻¹`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            <line x1={mL} y1={mT} x2={mL + PW} y2={mT} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
            <text x={mL + 4} y={mT + 12} className="fill-slate-400" style={{ fontSize: 8.5, fontWeight: 700 }}>μ0</text>
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>GS</tspan>−V<tspan dy={2} style={{ fontSize: 8 }}>T</tspan><tspan dy={-2}> →</tspan></text>
            <text x={mL - 6} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>μ_eff/μ0</text>
            <path d={path} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Readout label="$\\mu_{eff}/\\mu_0$ ב-$V_{ov}=2$V" value={sample.toFixed(2)} accent="border-violet-100 bg-violet-50" />
        <Readout label="השפעה" value="ניידות יורדת ↓" accent="border-amber-100 bg-amber-50" />
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        ככל שמתח-השער גדל, השדה האנכי דוחף את נושאי-הערוץ חזק יותר אל שפת-האוקסיד, מגביר <b>פיזור-שטח</b> ומוריד את
        הניידות: <Tex>{'\\mu_{eff}=\\mu_0/(1+\\theta(V_{GS}-V_T))'}</Tex>. התוצאה — הזרם בתחום הלינארי <b>נמוך מהצפוי</b>
        וגדל לאט יותר מ-<Tex>{'V_{GS}'}</Tex>.
      </p>
    </div>
  )
}
