import { capPerArea, fmtCapPerArea, junctionState, type Material } from '../../../lib/junction'

/**
 * Junction (depletion) capacitance vs bias. Top panel: C_j/A = ε_s/d vs V_A —
 * rises toward forward bias (narrow depletion), falls toward reverse. Bottom
 * panel: 1/C_j² vs V_A — a STRAIGHT line that hits zero at V_A = V_bi (the
 * x-intercept extracts V_bi; the slope ∝ 1/doping). A marker tracks the current
 * V_A. Driven by junctionState(...,Va), so it stays physically consistent.
 */
interface Props {
  Na: number
  Nd: number
  mat: Material
  Va: number
  T?: number
}

const W = 520
const H = 310
const mL = 54
const mR = 16
const PANEL_H = 104
const GAP = 40
const A_TOP = 26
const A_BOT = A_TOP + PANEL_H
const B_TOP = A_BOT + GAP
const B_BOT = B_TOP + PANEL_H

export default function CVPlot({ Na, Nd, mat, Va, T = 300 }: Props) {
  const Vbi = junctionState(Na, Nd, mat, 0, T).Vbi
  const vMin = -Math.max(2, 3 * Vbi) // reverse end of the axis
  const vFwdMax = 0.85 * Vbi // clamp forward (d→0 as V_A→V_bi)

  const xL = mL
  const xR = W - mR
  const xOf = (v: number) => xL + ((v - vMin) / (Vbi - vMin)) * (xR - xL)

  const SAMPLES = 48
  const vs = Array.from({ length: SAMPLES }, (_, i) => vMin + ((vFwdMax - vMin) * i) / (SAMPLES - 1))
  const cap = vs.map((v) => capPerArea(mat.epsR, junctionState(Na, Nd, mat, v, T).d)) // F/cm²
  const invC2 = cap.map((c) => 1 / (c * c))

  const capMax = Math.max(...cap)
  const invMax = Math.max(...invC2)
  const yA = (c: number) => A_BOT - (c / capMax) * (PANEL_H - 6)
  const yB = (v: number) => B_BOT - (v / invMax) * (PANEL_H - 6)

  const capPath = 'M ' + vs.map((v, i) => `${xOf(v).toFixed(1)},${yA(cap[i]).toFixed(1)}`).join(' L ')
  const invPath = 'M ' + vs.map((v, i) => `${xOf(v).toFixed(1)},${yB(invC2[i]).toFixed(1)}`).join(' L ')

  const capNow = capPerArea(mat.epsR, junctionState(Na, Nd, mat, Va, T).d)
  const xNow = xOf(Math.min(Va, vFwdMax))

  const axis = (top: number, bot: number) => (
    <>
      <line x1={xL} y1={top} x2={xL} y2={bot} stroke="#cbd5e1" strokeWidth={1} />
      <line x1={xL} y1={bot} x2={xR} y2={bot} stroke="#cbd5e1" strokeWidth={1} />
      {/* V_A=0 gridline */}
      <line x1={xOf(0)} y1={top} x2={xOf(0)} y2={bot} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
    </>
  )

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* current-V_A marker spanning both panels */}
        <line x1={xNow} y1={A_TOP - 4} x2={xNow} y2={B_BOT} stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="4 3" />

        {/* ---- Panel A: C_j/A vs V_A ---- */}
        {axis(A_TOP, A_BOT)}
        <text x={xL - 6} y={A_TOP + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>
          C<tspan dy={2} style={{ fontSize: 9.1 }}>j</tspan>/A
        </text>
        <path d={capPath} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
        <circle cx={xNow} cy={yA(capNow)} r={3.5} fill="#7c3aed" />
        <text x={xNow + 6} y={yA(capNow) - 4} className="fill-violet-700" style={{ fontSize: 11.7, fontWeight: 700 }}>
          {fmtCapPerArea(capNow)}
        </text>

        {/* ---- Panel B: 1/C_j² vs V_A (straight line, intercept at V_bi) ---- */}
        {axis(B_TOP, B_BOT)}
        <text x={xL - 6} y={B_TOP + 10} textAnchor="end" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>
          1/C<tspan dy={2} style={{ fontSize: 9.1 }}>j</tspan>²
        </text>
        {/* extrapolation to the x-intercept at V_bi (dashed) */}
        <line x1={xOf(vFwdMax)} y1={yB(invC2[SAMPLES - 1])} x2={xOf(Vbi)} y2={B_BOT} stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="4 3" />
        <path d={invPath} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />
        {/* V_bi intercept marker */}
        <circle cx={xOf(Vbi)} cy={B_BOT} r={3.5} fill="#0ea5e9" />
        <text x={xOf(Vbi)} y={B_BOT + 14} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 11.7, fontWeight: 700 }}>
          V<tspan dy={2} style={{ fontSize: 9.1 }}>bi</tspan>
        </text>
        <text x={xL + 8} y={B_TOP + 12} className="fill-sky-600" style={{ fontSize: 11.1 }}>
          קו ישר · שיפוע ∝ 1/N
        </text>

        {/* shared x-axis labels */}
        <text x={xOf(0)} y={B_BOT + 14} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11.7 }}>
          0
        </text>
        <text x={xL} y={B_BOT + 14} textAnchor="start" className="fill-sky-500" style={{ fontSize: 11.7, fontWeight: 700 }}>
          ← אחורי
        </text>
        <text x={xOf(vFwdMax)} y={B_BOT + 14} textAnchor="end" className="fill-amber-600" style={{ fontSize: 11.7, fontWeight: 700 }}>
          קדמי →
        </text>
        <text x={(xL + xR) / 2} y={H - 4} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 13 }}>
          מתח חיצוני V<tspan dy={2} style={{ fontSize: 10.4 }}>A</tspan>
        </text>
      </svg>
    </div>
  )
}
