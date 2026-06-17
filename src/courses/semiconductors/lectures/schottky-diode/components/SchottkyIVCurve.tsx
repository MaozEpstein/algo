import { motion } from 'framer-motion'
import {
  diodeCurrents,
  schottkyBarrier,
  thermalVoltage,
  thermionicJst,
  type Material,
  type Metal,
} from '../../../lib/junction'

/**
 * The Schottky thermionic-emission characteristic J = J_ST·(e^{V_A/V_T}−1), with
 * the SAME Shockley shape as a PN diode but a far larger J_ST (A*T²e^{−φ_B/V_T}),
 * so it turns on at a lower voltage. With `comparePN` it overlays the PN Shockley
 * curve (dashed grey) on the same axes — the turn-on shift and the ~10⁶ J_ST/J_S
 * gap read directly on a semilog plot. Linear or log mode; reverse saturates at −J_ST.
 */
interface Props {
  metal: Metal
  mat: Material
  Va: number
  T?: number
  mode?: 'log' | 'linear'
  comparePN?: { Na: number; Nd: number }
  showTurnOn?: boolean
  /** recent V_A values (newest first) — fading comet trail during auto-sweep */
  trail?: number[]
  /** pulsing halo around the operating point during auto-sweep */
  pulsing?: boolean
}

const W = 460
const H = 260
const mL = 50
const mR = 16
const mT = 18
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH

const VIOLET = '#7c3aed'
const SLATE = '#94a3b8'
const ROSE = '#f43f5e'

export default function SchottkyIVCurve({ metal, mat, Va, T = 300, mode = 'log', comparePN, showTurnOn, trail, pulsing }: Props) {
  const VT = thermalVoltage(T)
  const phiB = schottkyBarrier(metal.phiM, mat.chi)
  const Jst = thermionicJst(mat.astar, phiB, T)
  const Jpn = comparePN ? diodeCurrents(comparePN.Na, comparePN.Nd, mat, 0, T).Js : 0
  const Jref = 100
  const vMin = -0.3
  const vMax = 0.85

  const Jsch = (v: number) => Jst * (Math.exp(v / VT) - 1)
  const JpnOf = (v: number) => Jpn * (Math.exp(v / VT) - 1)

  const xOf = (v: number) => mL + ((v - vMin) / (vMax - vMin)) * PW

  const jLo = -0.05 * Jref
  const yLin = (j: number) => yBot - ((Math.max(jLo, Math.min(Jref, j)) - jLo) / (Jref - jLo)) * PH
  const floor = comparePN ? Math.min(Jpn, Jst) : Jst
  const yLogMin = Math.log10(floor) - 0.6
  const yLogMax = Math.log10(Jref) + 0.3
  const yLog = (j: number) => {
    const l = Math.log10(Math.max(floor, Math.abs(j)))
    return yBot - ((Math.max(yLogMin, Math.min(yLogMax, l)) - yLogMin) / (yLogMax - yLogMin)) * PH
  }
  const yOf = mode === 'log' ? yLog : yLin

  const NS = 100
  const sample = (f: (v: number) => number) =>
    'M ' +
    Array.from({ length: NS + 1 }, (_, i) => {
      const v = vMin + ((vMax - vMin) * i) / NS
      return `${xOf(v).toFixed(1)},${yOf(f(v)).toFixed(1)}`
    }).join(' L ')

  const x0 = xOf(0)
  const vOp = Math.max(vMin, Math.min(vMax, Va))
  const vTurn = VT * Math.log(1 / Jst + 1)

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={mL} y={mT} width={x0 - mL} height={PH} fill="#f0f9ff" opacity={0.7} />
        <line x1={mL} y1={mode === 'log' ? yBot : yLin(0)} x2={W - mR} y2={mode === 'log' ? yBot : yLin(0)} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={x0} y1={mT} x2={x0} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={W - mR} y={(mode === 'log' ? yBot : yLin(0)) - 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 13 }}>
          V<tspan dy={2} style={{ fontSize: 10 }}>A</tspan>
        </text>
        <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>{mode === 'log' ? 'log|J|' : 'J'}</text>

        {/* J_ST floor (log) */}
        {mode === 'log' && (
          <>
            <line x1={mL} y1={yLog(Jst)} x2={W - mR} y2={yLog(Jst)} stroke={ROSE} strokeWidth={1.1} strokeDasharray="4 3" opacity={0.7} />
            <text x={W - mR - 2} y={yLog(Jst) - 4} textAnchor="end" className="fill-rose-500" style={{ fontSize: 11, fontWeight: 700 }}>
              ≈ J<tspan dy={2} style={{ fontSize: 8 }}>ST</tspan> (רוויה)
            </text>
          </>
        )}

        {/* PN overlay (dashed grey) */}
        {comparePN && (
          <>
            <path d={sample(JpnOf)} fill="none" stroke={SLATE} strokeWidth={1.9} strokeDasharray="5 4" />
            <text x={xOf(0.72)} y={yOf(JpnOf(0.72)) - 6} className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>PN</text>
          </>
        )}

        {/* turn-on marker */}
        {showTurnOn && vTurn > vMin && vTurn < vMax && (
          <line x1={xOf(vTurn)} y1={mT} x2={xOf(vTurn)} y2={yBot} stroke={VIOLET} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
        )}

        {/* the Schottky characteristic */}
        <path d={sample(Jsch)} fill="none" stroke={VIOLET} strokeWidth={2.75} strokeLinejoin="round" />
        <text x={xOf(0.3)} y={yOf(Jsch(0.3)) - 6} className="fill-violet-600" style={{ fontSize: 12, fontWeight: 700 }}>שוטקי</text>

        {/* comet trail (auto-sweep) */}
        {trail && trail.map((tv, i) => (
          i === 0 ? null : (
            <circle key={i} cx={xOf(Math.max(vMin, Math.min(vMax, tv)))} cy={yOf(Jsch(Math.max(vMin, Math.min(vMax, tv))))} r={Math.max(1.2, 4 - i * 0.25)} fill={VIOLET} opacity={0.4 * (1 - i / trail.length)} />
          )
        ))}

        {/* operating point (+ pulsing halo) */}
        {pulsing && (
          <motion.circle
            cx={xOf(vOp)}
            cy={yOf(Jsch(vOp))}
            fill="none"
            stroke={VIOLET}
            strokeWidth={1.75}
            initial={{ r: 4, opacity: 0.6 }}
            animate={{ r: [4, 14], opacity: [0.6, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <circle cx={xOf(vOp)} cy={yOf(Jsch(vOp))} r={4.5} fill={VIOLET} stroke="#fff" strokeWidth={1.5} />

        <text x={(mL + x0) / 2} y={mT + 15} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 12, fontWeight: 700 }}>אחורי</text>
        <text x={(x0 + W - mR) / 2} y={mT + 15} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 12, fontWeight: 700 }}>קדמי</text>
        <text x={mL + PW / 2} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11 }}>
          {comparePN ? 'שוטקי נדלקת מוקדם יותר — מחסום נמוך' : 'מתח חיצוני'}
        </text>
      </svg>
    </div>
  )
}
