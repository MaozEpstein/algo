import { thermalVoltage } from '../../../lib/junction'

/**
 * The "junction → diode" picture: near equilibrium the diode current is the
 * difference of TWO components, drawn here in units of I_S so the shape is
 * universal (depends only on V_T):
 *   • diffusion (majority over the barrier):  +e^{V_A/V_T}   — grows with bias
 *   • drift / generation (minority swept):    −1             — fixed, ~I_S
 *   • net = diffusion + drift = e^{V_A/V_T} − 1               — the characteristic
 * At V_A = 0 the two are equal and opposite (+1, −1) → net 0 (the dynamic
 * balance). Forward tips it toward diffusion; reverse leaves only the −1 floor.
 * A dashed operating line drops three dots so the difference is visible at a glance.
 */
interface Props {
  Va: number
  T?: number
}

const W = 480
const H = 290
const mL = 30
const mR = 16
const mT = 40
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB

export default function CurrentBalanceCurve({ Va, T = 300 }: Props) {
  const VT = thermalVoltage(T)
  const vMin = -0.15
  const vMax = 0.05
  const yMin = -1.5
  const yMax = 7.5

  const diff = (v: number) => Math.exp(v / VT)
  const net = (v: number) => diff(v) - 1

  const xOf = (v: number) => mL + ((v - vMin) / (vMax - vMin)) * PW
  const yBot = mT + PH
  const yOf = (u: number) => {
    const c = Math.max(yMin, Math.min(yMax, u))
    return yBot - ((c - yMin) / (yMax - yMin)) * PH
  }

  const N = 100
  const sample = (f: (v: number) => number) =>
    'M ' +
    Array.from({ length: N + 1 }, (_, i) => {
      const v = vMin + ((vMax - vMin) * i) / N
      return `${xOf(v).toFixed(1)},${yOf(f(v)).toFixed(1)}`
    }).join(' L ')

  const x0 = xOf(0)
  const yU = yOf(0)
  const vOp = Math.max(vMin, Math.min(vMax, Va))
  const xOp = xOf(vOp)
  const dDot = yOf(diff(vOp))
  const sDot = yOf(-1)
  const nDot = yOf(net(vOp))

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* reverse-region tint */}
        <rect x={mL} y={mT} width={x0 - mL} height={PH} fill="#f0f9ff" opacity={0.7} />

        {/* zero axes */}
        <line x1={mL} y1={yU} x2={W - mR} y2={yU} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={x0} y1={mT} x2={x0} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={W - mR} y={yU - 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 12 }}>
          V<tspan dy={2} style={{ fontSize: 9 }}>A</tspan>
        </text>
        <text x={mL + 2} y={mT - 6} className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>
          I / I<tspan dy={2} style={{ fontSize: 9 }}>S</tspan>
        </text>

        {/* legend */}
        <g style={{ fontSize: 11, fontWeight: 700 }}>
          <line x1={mL + 6} y1={mT - 24} x2={mL + 26} y2={mT - 24} stroke="#f59e0b" strokeWidth={2.5} />
          <text x={mL + 30} y={mT - 20} className="fill-amber-600">דיפוזיה</text>
          <line x1={mL + 96} y1={mT - 24} x2={mL + 116} y2={mT - 24} stroke="#0ea5e9" strokeWidth={2.5} strokeDasharray="4 3" />
          <text x={mL + 120} y={mT - 20} className="fill-sky-600">סחיפה</text>
          <line x1={mL + 176} y1={mT - 24} x2={mL + 196} y2={mT - 24} stroke="#7c3aed" strokeWidth={3} />
          <text x={mL + 200} y={mT - 20} className="fill-violet-700">נטו (האופיין)</text>
        </g>

        {/* operating line + difference dots */}
        <line x1={xOp} y1={mT} x2={xOp} y2={yBot} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />

        {/* curves */}
        <path d={sample(() => -1)} fill="none" stroke="#0ea5e9" strokeWidth={2.25} strokeDasharray="5 3" />
        <path d={sample(diff)} fill="none" stroke="#f59e0b" strokeWidth={2.25} strokeLinejoin="round" />
        <path d={sample(net)} fill="none" stroke="#7c3aed" strokeWidth={3} strokeLinejoin="round" />

        {/* dots at the operating point */}
        <circle cx={xOp} cy={sDot} r={3.5} fill="#0ea5e9" />
        <circle cx={xOp} cy={dDot} r={3.5} fill="#f59e0b" />
        <circle cx={xOp} cy={nDot} r={4} fill="#7c3aed" />

        {/* region labels */}
        <text x={(mL + x0) / 2} y={yBot + 26} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 11, fontWeight: 700 }}>
          אחורי
        </text>
        <text x={(x0 + W - mR) / 2} y={yBot + 26} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 11, fontWeight: 700 }}>
          קדמי
        </text>
        <text x={mL + PW / 2} y={H - 4} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          מבט מקורב סביב שיווי-המשקל — ההצתה המלאה בלשונית האופיין
        </text>
      </svg>
    </div>
  )
}
