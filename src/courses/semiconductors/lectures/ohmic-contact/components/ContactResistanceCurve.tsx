import { specificContactResistance, tunnelingMass, thermalVoltage, type Material, type Metal } from '../../../lib/junction'

/**
 * Specific contact resistance ρ_c versus doping N_D on a log–log plot — the
 * memorable visual of the lecture: ρ_c is roughly flat at low doping (thermionic,
 * barrier-limited) then COLLAPSES exponentially once heavy doping thins the barrier
 * into the field-emission (tunneling) regime. TE/TFE/FE bands are marked and the
 * operating N_D is dotted.
 */
interface Props {
  metal: Metal
  mat: Material
  Nd: number // operating point
  T?: number
}

const W = 460
const H = 250
const mL = 54
const mR = 16
const mT = 22
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const VIOLET = '#7c3aed'

const LOGN_MIN = 16
const LOGN_MAX = 21

export default function ContactResistanceCurve({ metal, mat, Nd, T = 300 }: Props) {
  const xOf = (logN: number) => mL + ((logN - LOGN_MIN) / (LOGN_MAX - LOGN_MIN)) * PW

  // sample ρ_c across the doping range (log–log)
  const NS = 90
  const pts = Array.from({ length: NS + 1 }, (_, i) => {
    const logN = LOGN_MIN + ((LOGN_MAX - LOGN_MIN) * i) / NS
    return { logN, logR: Math.log10(specificContactResistance(metal, mat, 10 ** logN, T)) }
  })
  const yTop = Math.max(...pts.map((p) => p.logR)) + 0.4
  const yLo = Math.min(...pts.map((p) => p.logR)) - 0.4
  const yOf = (logR: number) => yBot - ((Math.max(yLo, Math.min(yTop, logR)) - yLo) / (yTop - yLo)) * PH
  const path = 'M ' + pts.map((p) => `${xOf(p.logN).toFixed(1)},${yOf(p.logR).toFixed(1)}`).join(' L ')

  // regime boundaries: solve E_00(N_D) = 0.5·kT (TE↔TFE) and 5·kT (TFE↔FE)
  const kT = thermalVoltage(T) // ≈ kT/q in eV-volts
  const ndFor = (E: number) => (E / 1.857e-11) ** 2 * (mat.epsR * tunnelingMass(mat))
  const logTE = Math.log10(ndFor(0.5 * kT))
  const logFE = Math.log10(ndFor(5 * kT))

  const opLogN = Math.log10(Nd)
  const opLogR = Math.log10(specificContactResistance(metal, mat, Nd, T))

  const bands: { x0: number; x1: number; label: string; fill: string }[] = [
    { x0: mL, x1: xOf(logTE), label: 'TE', fill: '#f59e0b' },
    { x0: xOf(logTE), x1: xOf(logFE), label: 'TFE', fill: '#0ea5e9' },
    { x0: xOf(logFE), x1: mL + PW, label: 'FE', fill: '#10b981' },
  ]

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* regime band tints + dividers */}
        {bands.map((b, i) =>
          b.x1 > b.x0 + 1 ? (
            <g key={i}>
              <rect x={Math.max(mL, b.x0)} y={mT} width={Math.min(mL + PW, b.x1) - Math.max(mL, b.x0)} height={PH} fill={b.fill} opacity={0.07} />
              <text x={(Math.max(mL, b.x0) + Math.min(mL + PW, b.x1)) / 2} y={mT + 12} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: b.fill }}>{b.label}</text>
            </g>
          ) : null,
        )}
        {[logTE, logFE].map((l, i) =>
          l > LOGN_MIN && l < LOGN_MAX ? <line key={i} x1={xOf(l)} y1={mT} x2={xOf(l)} y2={yBot} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" /> : null,
        )}

        {/* axes */}
        <line x1={mL} y1={yBot} x2={W - mR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>log ρ<tspan dy={2} style={{ fontSize: 8 }}>c</tspan></text>
        <text x={W - mR} y={yBot + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11 }}>
          log N<tspan dy={2} style={{ fontSize: 8 }}>D</tspan> (סימום ↑)
        </text>

        {/* the ρ_c(N_D) curve */}
        <path d={path} fill="none" stroke={VIOLET} strokeWidth={2.75} strokeLinejoin="round" />
        {/* operating point */}
        {opLogN >= LOGN_MIN && opLogN <= LOGN_MAX && <circle cx={xOf(opLogN)} cy={yOf(opLogR)} r={4.5} fill={VIOLET} />}

        <text x={mL + PW / 2} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          סימום כבד ⇐ מחסום דק ⇐ מנהור ⇐ ρ<tspan dy={2} style={{ fontSize: 7 }}>c</tspan> צונח מעריכית
        </text>
      </svg>
    </div>
  )
}
