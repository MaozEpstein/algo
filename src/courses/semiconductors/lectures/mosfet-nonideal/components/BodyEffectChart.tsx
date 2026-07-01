import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from '../../mosfet/components/Readout'
import { mosfetThresholdBody } from '../../../lib/junction'

/**
 * Body effect: a source-to-body reverse bias V_SB widens the depletion charge under the gate,
 * so more gate voltage is needed to invert → the threshold RISES:
 *   V_T = V_T0 + γ(√(2φ_F + V_SB) − √(2φ_F)).
 * A V_SB slider walks the operating point along the V_T(V_SB) curve. Demo: V_T0=0.7 V, γ=0.5 √V,
 * 2φ_F=0.7 V.
 */
const VT0 = 0.7
const GAMMA = 0.5
const PHIF = 0.35 // 2φ_F = 0.7
const VSBMAX = 4

const W = 500
const H = 260
const mL = 52
const mR = 24
const mT = 20
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const N = 80
const vtAt = (vsb: number) => mosfetThresholdBody(VT0, GAMMA, PHIF, vsb)
const yScale = vtAt(VSBMAX) * 1.15
const xOf = (vsb: number) => mL + (vsb / VSBMAX) * PW
const yOf = (vt: number) => mT + (1 - vt / yScale) * PH

export default function BodyEffectChart() {
  const [vsb, setVsb] = useState(1)
  const vt = vtAt(vsb)
  const dvt = vt - VT0

  const path = (() => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const v = (VSBMAX * i) / N
      pts.push(`${xOf(v).toFixed(1)},${yOf(vtAt(v)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  })()

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>מתח מקור-מצע · <Tex>{'V_{SB}'}</Tex></>} value={vsb} min={0} max={VSBMAX} step={0.05} onChange={setVsb} display={`${vsb.toFixed(2)} V`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>SB</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>T</tspan><tspan dy={-2}> (V)</tspan></text>
            {/* V_T0 reference */}
            <line x1={mL} y1={yOf(VT0)} x2={mL + PW} y2={yOf(VT0)} stroke="#fda4af" strokeWidth={1} strokeDasharray="3 3" />
            <text x={mL + 4} y={yOf(VT0) - 4} className="fill-rose-500" style={{ fontSize: 9, fontWeight: 700 }}>V_T0={VT0}</text>
            {/* curve */}
            <path d={path} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />
            {/* operating point + ΔV_T bracket */}
            <line x1={xOf(vsb)} y1={yOf(VT0)} x2={xOf(vsb)} y2={yOf(vt)} stroke="#7c3aed" strokeWidth={1.5} />
            <circle cx={xOf(vsb)} cy={yOf(vt)} r={4.5} fill="#7c3aed" stroke="#fff" strokeWidth={1.5} />
            <text x={xOf(vsb) + 6} y={(yOf(VT0) + yOf(vt)) / 2} className="fill-violet-700" style={{ fontSize: 9.5, fontWeight: 800 }}>ΔV_T</text>
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Readout label="$V_{T0}$ (ב-$V_{SB}=0$)" value={`${VT0.toFixed(2)} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="$V_T$" value={`${vt.toFixed(2)} V`} accent="border-violet-100 bg-violet-50" />
        <Readout label="$\\Delta V_T$" value={`+${dvt.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        הטיה אחורית של המצע (<Tex>{'V_{SB}>0'}</Tex>) <b>מרחיבה את מטען-המחסור</b> מתחת לשער, ולכן דרוש יותר מתח-שער
        כדי להפוך — <Tex>{'V_T'}</Tex> <b>עולה</b>. הקצב נקבע ע״י מקדם-המצע <Tex>{'\\gamma=\\sqrt{2q\\varepsilon_sN_A}/C_{ox}'}</Tex>.
      </p>
    </div>
  )
}
