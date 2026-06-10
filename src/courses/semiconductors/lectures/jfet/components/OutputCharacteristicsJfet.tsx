import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { jfetDrainCurrent, jfetVdsat, jfetRegion } from '../../../lib/junction'

/**
 * JFET output characteristics I_D(V_DS): one curve per V_GS. Each rises LINEARLY from the
 * origin (the ohmic / voltage-controlled-resistor region the class summary stresses), bends
 * at the knee V_DS=V_Dsat, and flattens to the saturation plateau I_DSS(1−V_GS/V_P)². A
 * V_GS slider highlights one curve, marks its knee and reads the region. Reuses
 * jfetDrainCurrent / jfetVdsat / jfetRegion. Schematic (V in V, I in mA).
 */
const W = 520
const H = 310
const mL = 54
const mR = 60
const mT = 18
const mB = 44
const PW = W - mL - mR
const PH = H - mT - mB
const VMAX = 6 // V_DS axis
const VP = 4 // |V_P|
const IDSS = 10 // mA
const FAMILY = [0, 1, 2, 3] // |V_GS| steps (V)
const FAMCOL = ['#bbf7d0', '#86efac', '#4ade80', '#22c55e']
const N = 80

const xOf = (v: number) => mL + (v / VMAX) * PW
const yScale = IDSS * 1.12
const yOf = (iMa: number) => mT + (1 - iMa / yScale) * PH

const curve = (vgs: number) => {
  const pts: string[] = []
  for (let i = 0; i <= N; i++) {
    const v = (VMAX * i) / N
    pts.push(`${xOf(v).toFixed(1)},${yOf(jfetDrainCurrent(vgs, v, VP, IDSS)).toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}

export default function OutputCharacteristicsJfet() {
  const [vgs, setVgs] = useState(0)
  const vdsat = jfetVdsat(vgs, VP)
  const isat = IDSS * (1 - Math.abs(vgs) / VP) ** 2
  const region = jfetRegion(vgs, VMAX, VP) // at full V_DS (this demo sweeps to VMAX)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>מתח שער · <Tex>{'V_{GS}'}</Tex></>} value={vgs} min={0} max={VP} step={0.05} onChange={setVgs} display={`−${vgs.toFixed(2)} V`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* saturation locus: I = IDSS(V_DS/|VP|)² boundary (knees of all curves) */}
            {(() => {
              const pts: string[] = []
              for (let i = 0; i <= N; i++) {
                const v = (VMAX * i) / N
                if (v > VP) break
                pts.push(`${xOf(v).toFixed(1)},${yOf(IDSS * (v / VP) ** 2).toFixed(1)}`)
              }
              return <path d={'M ' + pts.join(' L ')} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            })()}
            <text x={xOf(VP * 0.62)} y={yOf(IDSS * 0.62 ** 2) - 6} className="fill-slate-400" style={{ fontSize: 9, fontWeight: 700 }}>קו-הצביטה V_DS=V_Dsat</text>

            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>DS</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>D</tspan></text>
            <text x={mL - 8} y={mT + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8.5 }}>(mA)</text>

            {/* faint reference family */}
            {FAMILY.map((vg, i) => (
              <g key={vg}>
                <path d={curve(vg)} fill="none" stroke={FAMCOL[i]} strokeWidth={2} strokeLinejoin="round" opacity={0.85} />
                <text x={mL + PW + 4} y={yOf(IDSS * (1 - vg / VP) ** 2) + 4} textAnchor="start" style={{ fontSize: 8.5, fontWeight: 700, fill: FAMCOL[i] }}>{vg === 0 ? 'V_GS=0' : `−${vg}V`}</text>
              </g>
            ))}

            {/* highlighted (slider) curve + knee */}
            <path d={curve(vgs)} fill="none" stroke="#0f766e" strokeWidth={3} strokeLinejoin="round" />
            {vdsat > 0.01 && (
              <>
                <line x1={xOf(vdsat)} y1={mT + PH} x2={xOf(vdsat)} y2={yOf(isat)} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={xOf(vdsat)} cy={yOf(isat)} r={3.5} fill="#0f766e" />
                <text x={xOf(vdsat)} y={mT + PH + 16} textAnchor="middle" className="fill-teal-700" style={{ fontSize: 9, fontWeight: 700 }}>V_Dsat</text>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="$I_{DSS}$" value={`${IDSS} mA`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="$|V_P|$" value={`${VP} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="$V_{Dsat}=|V_P|-|V_{GS}|$" value={`${vdsat.toFixed(2)} V`} accent="border-teal-100 bg-teal-50" />
        <Readout label="$I_{D,sat}$" value={`${isat.toFixed(2)} mA`} accent="border-sky-100 bg-sky-50" />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        קרוב לראשית (<Tex>{'V_{DS}<V_{Dsat}'}</Tex>) העקומה כמעט <b>לינארית</b> — ההתקן הוא <b>נגד נשלט-מתח</b>
        (השיפוע נקבע ע״י <Tex>{'V_{GS}'}</Tex>). מעבר ל-<Tex>{'V_{Dsat}'}</Tex> הזרם <b>רווי</b> ב-<Tex>{'I_D=I_{DSS}(1-V_{GS}/V_P)^2'}</Tex>.
        העקומה המודגשת היא ה-<Tex>{'V_{GS}'}</Tex> שבחרתם {region === 'saturation' ? '(ברוויה בקצה הציר)' : ''}.
      </p>
    </div>
  )
}
