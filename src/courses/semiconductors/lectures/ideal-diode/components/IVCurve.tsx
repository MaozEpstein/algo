import { diodeCurrents, thermalVoltage, type Material } from '../../../lib/junction'

/**
 * The ideal-diode I–V characteristic, J = J_S(e^{V_A/V_T}−1). In `linear` mode
 * it's the classic curve: ≈0 for reverse/small forward, a sharp knee near the
 * turn-on voltage, then a steep exponential rise. In `log` mode (log|J| vs V_A)
 * the forward branch is a straight line rising from the reverse-saturation floor
 * J_S. A marker tracks the operating point V_A. Driven by diodeCurrents().
 */
interface Props {
  Na: number
  Nd: number
  mat: Material
  Va: number
  T?: number
  mode?: 'linear' | 'log'
}

const W = 460
const H = 260
const mL = 50
const mR = 16
const mT = 18
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB

export default function IVCurve({ Na, Nd, mat, Va, T = 300, mode = 'linear' }: Props) {
  const VT = thermalVoltage(T)
  const Js = diodeCurrents(Na, Nd, mat, 0, T).Js
  const Jref = 100 // A/cm² — top of the linear axis / forward reference
  const vMax = Math.min(1.2, Math.max(0.3, VT * Math.log(Jref / Js + 1)))
  const vMin = -0.4
  const Jof = (v: number) => Js * (Math.exp(v / VT) - 1)

  const xOf = (v: number) => mL + ((v - vMin) / (vMax - vMin)) * PW
  const yBot = mT + PH

  // linear y-map: J ∈ [−0.05·Jref, Jref] → axis
  const jLo = -0.05 * Jref
  const yLin = (j: number) => {
    const c = Math.max(jLo, Math.min(Jref, j))
    return yBot - ((c - jLo) / (Jref - jLo)) * PH
  }
  // log y-map: log|J| with a floor at J_S (the reverse saturation level)
  const logFloor = Math.log10(Js)
  const logTop = Math.log10(Jref)
  const yLogMin = logFloor - 0.6
  const yLogMax = logTop + 0.3
  const yLog = (j: number) => {
    const l = Math.log10(Math.max(Js, Math.abs(j)))
    const c = Math.max(yLogMin, Math.min(yLogMax, l))
    return yBot - ((c - yLogMin) / (yLogMax - yLogMin)) * PH
  }
  const yOf = mode === 'log' ? yLog : yLin

  const N = 90
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const v = vMin + ((vMax - vMin) * i) / N
    return `${xOf(v).toFixed(1)},${yOf(Jof(v)).toFixed(1)}`
  })
  const path = 'M ' + pts.join(' L ')

  const vOp = Math.max(vMin, Math.min(vMax, Va))
  const x0 = xOf(0)
  const yZero = mode === 'log' ? yBot : yLin(0)

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* reverse-region tint */}
        <rect x={mL} y={mT} width={x0 - mL} height={PH} fill="#f0f9ff" opacity={0.7} />

        {/* axes */}
        <line x1={mL} y1={yZero} x2={W - mR} y2={yZero} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={x0} y1={mT} x2={x0} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={W - mR} y={yZero - 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 12 }}>
          V<tspan dy={2} style={{ fontSize: 9 }}>A</tspan>
        </text>
        <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>
          {mode === 'log' ? 'log|J|' : 'J'}
        </text>

        {/* saturation floor (log mode) */}
        {mode === 'log' && (
          <>
            <line x1={mL} y1={yLog(Js)} x2={W - mR} y2={yLog(Js)} stroke="#f43f5e" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={W - mR - 2} y={yLog(Js) - 4} textAnchor="end" className="fill-rose-500" style={{ fontSize: 10, fontWeight: 700 }}>
              ≈ J<tspan dy={2} style={{ fontSize: 7 }}>S</tspan> (רוויה)
            </text>
          </>
        )}

        {/* the characteristic */}
        <path d={path} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />

        {/* operating point */}
        <circle cx={xOf(vOp)} cy={yOf(Jof(vOp))} r={4} fill="#7c3aed" />

        {/* region labels */}
        <text x={(mL + x0) / 2} y={mT + 14} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 11, fontWeight: 700 }}>
          אחורי
        </text>
        <text x={(x0 + W - mR) / 2} y={mT + 14} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 11, fontWeight: 700 }}>
          קדמי
        </text>
        <text x={mL + PW / 2} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          {mode === 'log' ? 'מתח חיצוני — בקדמי הקו ישר (מעריכי)' : 'מתח חיצוני — ברך מעריכית בקדמי'}
        </text>
      </svg>
    </div>
  )
}
