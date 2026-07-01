import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { mosfetSatCurrent, mosfetGm } from '../../../lib/junction'

/**
 * n-MOSFET transfer characteristic in saturation I_DS(V_GS) = (k/2)(V_GS − V_T)² (square law):
 * zero until threshold, then a parabola. A V_GS operating point slides along the curve and the
 * TANGENT there is the transconductance g_m = ∂I_DS/∂V_GS = k(V_GS − V_T), drawn live. Marks V_T.
 * Schematic (V in V, I in mA, k in mA/V²).
 */
const W = 500
const H = 300
const mL = 56
const mR = 24
const mT = 20
const mB = 44
const PW = W - mL - mR
const PH = H - mT - mB
const VGMAX = 5
const VT = 1
const K = 0.5 // mA/V²
const N = 90
const yScale = mosfetSatCurrent(VGMAX, VT, K) * 1.12

const xOf = (vgs: number) => mL + (vgs / VGMAX) * PW
const yOf = (i: number) => mT + (1 - i / yScale) * PH

export default function TransferChart() {
  const [vgs, setVgs] = useState(3)
  const id = mosfetSatCurrent(vgs, VT, K)
  const gm = mosfetGm(vgs, 5, VT, K) // saturation g_m = k(V_GS−V_T)

  const path = (() => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const vg = (VGMAX * i) / N
      pts.push(`${xOf(vg).toFixed(1)},${yOf(mosfetSatCurrent(vg, VT, K)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  })()

  const d = 0.9
  const v1 = Math.max(VT, vgs - d)
  const v2 = Math.min(VGMAX, vgs + d)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>נקודת-עבודה · <Tex>{'V_{GS}'}</Tex></>} value={vgs} min={0} max={VGMAX} step={0.05} onChange={setVgs} display={`${vgs.toFixed(2)} V`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>GS</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>DS</tspan></text>
            <text x={mL - 8} y={mT + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8.5 }}>(mA)</text>

            {/* threshold marker */}
            <line x1={xOf(VT)} y1={mT + PH} x2={xOf(VT)} y2={mT} stroke="#fda4af" strokeWidth={1} strokeDasharray="3 3" />
            <text x={xOf(VT)} y={mT + PH + 16} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9, fontWeight: 700 }}>V_T={VT}</text>

            {/* transfer curve */}
            <path d={path} fill="none" stroke="#0284c7" strokeWidth={2.75} strokeLinejoin="round" />

            {/* tangent = g_m */}
            {vgs > VT && (
              <line x1={xOf(v1)} y1={yOf(id + gm * (v1 - vgs))} x2={xOf(v2)} y2={yOf(id + gm * (v2 - vgs))} stroke="#e11d48" strokeWidth={2} strokeDasharray="5 3" />
            )}
            {/* operating point */}
            <circle cx={xOf(vgs)} cy={yOf(id)} r={4.5} fill="#0284c7" stroke="#fff" strokeWidth={1.5} />
            {vgs > VT && <text x={xOf(vgs)} y={yOf(id) - 10} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 9.5, fontWeight: 800 }}>שיפוע = g_m</text>}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Readout label="זרם $I_{DS}$" value={`${id.toFixed(2)} mA`} accent="border-sky-100 bg-sky-50" />
        <Readout label="מוליכות-מעבר $g_m$" value={`${gm.toFixed(2)} mA/V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="$g_m=k(V_{GS}-V_T)$" value={vgs > VT ? '↑ עם V_GS' : '0 (כבוי)'} accent="border-emerald-100 bg-emerald-50" />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        אופיין-ההעברה ברוויה הוא <Tex>{'I_{DS}=\\tfrac{k}{2}(V_{GS}-V_T)^2'}</Tex>: אפס עד <Tex>{'V_T'}</Tex>, ואז פרבולה.
        ה<b>שיפוע</b> בנקודת-העבודה הוא <Tex>{'g_m=k(V_{GS}-V_T)'}</Tex> — גדל ליניארית עם עודף-המתח.
      </p>
    </div>
  )
}
