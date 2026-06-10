import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { jfetTransfer, jfetGm } from '../../../lib/junction'

/**
 * JFET transfer characteristic I_D(V_GS) = I_DSS(1−V_GS/V_P)² (square law). A V_GS operating
 * point slides along the curve; the TANGENT at that point is the transconductance
 * g_m = ∂I_D/∂V_GS, drawn live. Marks I_DSS (at V_GS=0) and V_P (at I_D=0). Schematic.
 */
const W = 500
const H = 300
const mL = 56
const mR = 24
const mT = 20
const mB = 44
const PW = W - mL - mR
const PH = H - mT - mB
const VP = 4 // |V_P|
const IDSS = 10 // mA
const N = 80
const yScale = IDSS * 1.12

const xOf = (vgs: number) => mL + ((vgs + VP) / VP) * PW // vgs ∈ [−VP, 0]
const yOf = (i: number) => mT + (1 - i / yScale) * PH

export default function TransferCurve() {
  const [vmag, setVmag] = useState(1) // |V_GS|
  const vgs = -vmag
  const id = jfetTransfer(vgs, VP, IDSS)
  const gm = jfetGm(vgs, VP, IDSS) // mA/V

  const path = (() => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const vg = -VP + (VP * i) / N
      pts.push(`${xOf(vg).toFixed(1)},${yOf(jfetTransfer(vg, VP, IDSS)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  })()

  // tangent (slope g_m) over ±d around the operating point
  const d = 0.9
  const v1 = Math.max(-VP, vgs - d)
  const v2 = Math.min(0, vgs + d)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>נקודת-עבודה · <Tex>{'V_{GS}'}</Tex></>} value={vmag} min={0} max={VP} step={0.05} onChange={setVmag} display={`−${vmag.toFixed(2)} V`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>GS</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>D</tspan></text>
            <text x={mL - 8} y={mT + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8.5 }}>(mA)</text>
            {/* tick labels for V_P and 0 */}
            <text x={mL} y={mT + PH + 16} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9, fontWeight: 700 }}>V_P=−{VP}</text>
            <text x={mL + PW} y={mT + PH + 28} textAnchor="end" className="fill-slate-400" style={{ fontSize: 9 }}>0</text>

            {/* I_DSS marker (V_GS=0) */}
            <line x1={mL} y1={yOf(IDSS)} x2={mL + PW} y2={yOf(IDSS)} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" />
            <text x={mL + 4} y={yOf(IDSS) - 4} className="fill-emerald-600" style={{ fontSize: 9, fontWeight: 700 }}>I_DSS={IDSS}mA</text>

            {/* transfer curve */}
            <path d={path} fill="none" stroke="#0284c7" strokeWidth={2.75} strokeLinejoin="round" />

            {/* tangent = g_m */}
            <line x1={xOf(v1)} y1={yOf(id + gm * (v1 - vgs))} x2={xOf(v2)} y2={yOf(id + gm * (v2 - vgs))} stroke="#e11d48" strokeWidth={2} strokeDasharray="5 3" />
            {/* operating point */}
            <circle cx={xOf(vgs)} cy={yOf(id)} r={4.5} fill="#0284c7" stroke="#fff" strokeWidth={1.5} />
            <text x={xOf(vgs)} y={yOf(id) - 10} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 9.5, fontWeight: 800 }}>שיפוע = g_m</text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Readout label="זרם $I_D$" value={`${id.toFixed(2)} mA`} accent="border-sky-100 bg-sky-50" />
        <Readout label="מוליכות-מעבר $g_m$" value={`${gm.toFixed(2)} mA/V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="$g_{m0}=2I_{DSS}/|V_P|$" value={`${((2 * IDSS) / VP).toFixed(1)} mA/V`} accent="border-emerald-100 bg-emerald-50" />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        העקומה היא <Tex>{'I_D=I_{DSS}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)^2'}</Tex>: מ-0 ב-<Tex>{'V_{GS}=V_P'}</Tex> עד
        <Tex>{'\\,I_{DSS}'}</Tex> ב-<Tex>{'V_{GS}=0'}</Tex>. ה<b>שיפוע</b> בנקודת-העבודה הוא <Tex>{'g_m'}</Tex> — הוא גדל
        ככל שמתקרבים ל-<Tex>{'V_{GS}=0'}</Tex> ומתאפס בצביטה.
      </p>
    </div>
  )
}
