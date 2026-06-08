import { gummelIb, gummelIc } from '../../../lib/junction'

/**
 * Gummel plot: log(I_C) and log(I_B) vs V_BE. I_C is a clean exponential (≈ one decade
 * per 60 mV); I_B bends at low V_BE because of the n=2 recombination component. The
 * vertical gap between the two lines is log(β_F) — it shrinks at low V_BE (β drops).
 * Pure schematic.
 */
const W = 480
const H = 240
const mL = 44
const mR = 70
const mT = 18
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const V0 = 0.3
const V1 = 0.78
const IS = 1e-15
const BETA_MAX = 120
const IB2 = 2e-13
const LOG_LO = -13
const LOG_HI = 0

export default function GummelPlot() {
  const xOf = (v: number) => mL + ((v - V0) / (V1 - V0)) * PW
  const yOf = (i: number) => mT + (1 - (Math.log10(i) - LOG_LO) / (LOG_HI - LOG_LO)) * PH
  const N = 100
  const line = (f: (v: number) => number) => {
    const pts: string[] = []
    for (let k = 0; k <= N; k++) {
      const v = V0 + ((V1 - V0) * k) / N
      pts.push(`${xOf(v).toFixed(1)},${yOf(f(v)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }
  const vGap = 0.66 // V_BE where we annotate the β gap

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
        {/* axes */}
        <line x1={mL} y1={yBot} x2={mL + PW} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL + PW} y={yBot + 15} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>BE</tspan><tspan dy={-2}> (V) →</tspan></text>
        <text x={mL - 6} y={mT + 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>log I</text>
        {/* curves */}
        <path d={line((v) => gummelIc(v, IS))} fill="none" stroke="#f43f5e" strokeWidth={2.75} strokeLinejoin="round" />
        <path d={line((v) => gummelIb(v, IS, BETA_MAX, IB2))} fill="none" stroke="#2563eb" strokeWidth={2.75} strokeLinejoin="round" />
        <text x={mL + PW + 4} y={yOf(gummelIc(V1, IS)) + 4} className="fill-rose-600" style={{ fontSize: 11, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 7.5 }}>C</tspan></text>
        <text x={mL + PW + 4} y={yOf(gummelIb(V1, IS, BETA_MAX, IB2)) + 4} className="fill-blue-600" style={{ fontSize: 11, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 7.5 }}>B</tspan></text>
        {/* β gap caliper */}
        <line x1={xOf(vGap)} y1={yOf(gummelIc(vGap, IS))} x2={xOf(vGap)} y2={yOf(gummelIb(vGap, IS, BETA_MAX, IB2))} stroke="#059669" strokeWidth={1.5} markerStart="url(#gum-cap)" markerEnd="url(#gum-cap)" />
        <defs><marker id="gum-cap" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#059669" /></marker></defs>
        <text x={xOf(vGap) + 5} y={(yOf(gummelIc(vGap, IS)) + yOf(gummelIb(vGap, IS, BETA_MAX, IB2))) / 2} className="fill-emerald-700" style={{ fontSize: 10, fontWeight: 800 }}>log β<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></text>
      </svg>
    </div>
  )
}
