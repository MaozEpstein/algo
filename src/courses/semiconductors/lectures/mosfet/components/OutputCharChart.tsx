import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { mosfetDrainCurrent, mosfetDrainCurrentCLM, mosfetVdsat, mosfetRegion, mosfetOutputResistance } from '../../../lib/junction'

/**
 * n-MOSFET output characteristics I_DS(V_DS): one curve per V_GS. Each rises from the origin
 * (triode / "linear"), bends at the knee V_DS,sat = V_GS − V_T, and flattens to the square-law
 * plateau (k/2)(V_GS − V_T)². A V_GS slider highlights one curve and marks its knee. With a
 * non-zero `lambda` (channel-length modulation) the plateau tilts up and the output resistance
 * becomes finite — reused by the modern-MOSFET lecture. Schematic (V in V, I in mA, k in mA/V²).
 */
const W = 520
const H = 310
const mL = 54
const mR = 62
const mT = 18
const mB = 44
const PW = W - mL - mR
const PH = H - mT - mB
const VMAX = 6 // V_DS axis
const VT = 1
const K = 0.5 // mA/V²
const FAMILY = [2, 3, 4, 5] // V_GS steps (V)
const FAMCOL = ['#bfdbfe', '#93c5fd', '#3b82f6', '#1d4ed8']
const N = 90
const yScale = (K / 2) * (5 - VT) ** 2 * 1.15 // headroom above the top curve

const xOf = (v: number) => mL + (v / VMAX) * PW
const yOf = (i: number) => mT + (1 - i / yScale) * PH

export default function OutputCharChart({ lambda = 0 }: { lambda?: number }) {
  const [vgs, setVgs] = useState(4)
  const id = (vg: number, vd: number) =>
    lambda > 0 ? mosfetDrainCurrentCLM(vg, vd, VT, K, lambda) : mosfetDrainCurrent(vg, vd, VT, K)
  const vdsat = mosfetVdsat(vgs, VT)
  const isat = id(vgs, Math.max(vdsat, 0.001))
  const region = mosfetRegion(vgs, VMAX, VT)
  const ro = mosfetOutputResistance(isat, lambda) // kΩ if I in mA and λ in 1/V

  const curve = (vg: number) => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const v = (VMAX * i) / N
      pts.push(`${xOf(v).toFixed(1)},${yOf(id(vg, v)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>מתח שער · <Tex>{'V_{GS}'}</Tex></>} value={vgs} min={VT} max={5} step={0.05} onChange={setVgs} display={`${vgs.toFixed(2)} V`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* saturation locus: knees of all curves, I = (K/2)·V_DS² */}
            {(() => {
              const pts: string[] = []
              for (let i = 0; i <= N; i++) {
                const v = (VMAX * i) / N
                if (v > 5 - VT) break
                pts.push(`${xOf(v).toFixed(1)},${yOf((K / 2) * v * v).toFixed(1)}`)
              }
              return <path d={'M ' + pts.join(' L ')} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            })()}
            <text x={xOf(2.6)} y={yOf((K / 2) * 2.6 * 2.6) - 6} className="fill-slate-400" style={{ fontSize: 9, fontWeight: 700 }}>קו-הצביטה V_DS=V_DS,sat</text>

            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>DS</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>DS</tspan></text>
            <text x={mL - 8} y={mT + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8.5 }}>(mA)</text>

            {/* family */}
            {FAMILY.map((vg, i) => (
              <g key={vg}>
                <path d={curve(vg)} fill="none" stroke={FAMCOL[i]} strokeWidth={2} strokeLinejoin="round" opacity={0.85} />
                <text x={mL + PW + 4} y={yOf(id(vg, VMAX)) + 4} textAnchor="start" style={{ fontSize: 8.5, fontWeight: 700, fill: FAMCOL[i] }}>V_GS={vg}</text>
              </g>
            ))}

            {/* highlighted (slider) curve + knee */}
            <path d={curve(vgs)} fill="none" stroke="#0f766e" strokeWidth={3} strokeLinejoin="round" />
            {vdsat > 0.01 && (
              <>
                <line x1={xOf(vdsat)} y1={mT + PH} x2={xOf(vdsat)} y2={yOf(isat)} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={xOf(vdsat)} cy={yOf(isat)} r={3.5} fill="#0f766e" />
                <text x={xOf(vdsat)} y={mT + PH + 16} textAnchor="middle" className="fill-teal-700" style={{ fontSize: 9, fontWeight: 700 }}>V_DS,sat</text>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="$V_{DS,sat}=V_{GS}-V_T$" value={`${vdsat.toFixed(2)} V`} accent="border-teal-100 bg-teal-50" />
        <Readout label="$I_{DS,sat}$" value={`${isat.toFixed(2)} mA`} accent="border-sky-100 bg-sky-50" />
        <Readout label="$k=(W/L)\\mu^*C_{ox}$" value={`${K} mA/V²`} accent="border-indigo-100 bg-indigo-50" />
        {lambda > 0 ? (
          <Readout label="$r_o\\approx 1/\\lambda I_D$" value={Number.isFinite(ro) ? `${ro.toFixed(1)} kΩ` : '∞'} accent="border-amber-100 bg-amber-50" />
        ) : (
          <Readout label="משטר בקצה" value={region === 'saturation' ? 'רוויה' : 'טריודה'} accent="border-rose-100 bg-rose-50" />
        )}
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        קרוב לראשית (<Tex>{'V_{DS}<V_{DS,sat}'}</Tex>) הזרם כמעט <b>לינארי</b> — טריודה. מעבר לברך הזרם <b>רווי</b> ב-
        <Tex>{'I_{DS}=\\tfrac{k}{2}(V_{GS}-V_T)^2'}</Tex>{lambda > 0 ? <>, אך {' '}<b>עולה מעט</b> עם <Tex>{'V_{DS}'}</Tex> בגלל אפקט התקצרות-התעלה.</> : '.'} העקומה המודגשת היא ה-<Tex>{'V_{GS}'}</Tex> שבחרתם.
      </p>
    </div>
  )
}
