import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { MATERIALS, fermiPotential, mosSurfaceCharge } from '../../../lib/junction'

/**
 * The classic |Q_s| vs ψ_s plot (log scale): three branches — accumulation (∝e^{q|ψ_s|/2kT}),
 * depletion (∝√ψ_s) and inversion (∝e^{qψ_s/2kT}) — with markers at φ_F and 2φ_F. A ψ_s slider
 * moves the operating point. Built on mosSurfaceCharge. Schematic (bespoke SVG, log y).
 */
const SI = MATERIALS.Si
const Na = 1e17
const W = 560
const H = 330
const mL = 60
const mR = 24
const mT = 22
const mB = 48
const PW = W - mL - mR
const PH = H - mT - mB
const PSMIN = -0.28
const PSMAX = 0.95
const Q_FLOOR = 3e-9 // C/cm² (so the cusp near ψ_s=0 bottoms out on the log axis)
const YMIN = -8.7 // log10
const YMAX = -5.2
const N = 120

const phiF = fermiPotential(Na, SI.ni)
const qs = (ps: number) => Math.max(mosSurfaceCharge(ps, Na, SI.ni, SI.epsR), Q_FLOOR)
const xOf = (ps: number) => mL + ((ps - PSMIN) / (PSMAX - PSMIN)) * PW
const yOf = (logq: number) => mT + (1 - (logq - YMIN) / (YMAX - YMIN)) * PH

function regimeOf(ps: number): string {
  if (ps < 0) return 'הצטברות (Accumulation)'
  if (ps < phiF) return 'מחסור (Depletion)'
  if (ps < 2 * phiF) return 'היפוך חלש (Weak inv.)'
  return 'היפוך חזק (Strong inv.)'
}

export default function SurfaceChargeChart() {
  const [ps, setPs] = useState(0.4)
  const Qcur = mosSurfaceCharge(ps, Na, SI.ni, SI.epsR)

  const path = (() => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const p = PSMIN + ((PSMAX - PSMIN) * i) / N
      pts.push(`${xOf(p).toFixed(1)},${yOf(Math.log10(qs(p))).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  })()

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>פוטנציאל פני-השטח · <Tex>{'\\psi_s'}</Tex></>} value={ps} min={PSMIN} max={PSMAX} step={0.01} onChange={setPs} display={`${ps.toFixed(2)} V`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* zone shading + per-zone regime name */}
            {([
              [xOf(PSMIN), xOf(0), '#fecdd3', 0.25, '#e11d48', 'הצטברות'],
              [xOf(0), xOf(phiF), '#fde68a', 0.25, '#d97706', 'מחסור'],
              [xOf(phiF), xOf(2 * phiF), '#bbf7d0', 0.3, '#059669', 'היפוך חלש'],
              [xOf(2 * phiF), xOf(PSMAX), '#6ee7b7', 0.3, '#047857', 'היפוך חזק'],
            ] as [number, number, string, number, string, string][]).map(([x1, x2, fill, op, tcol, name]) => (
              <g key={name}>
                <rect x={x1} y={mT} width={x2 - x1} height={PH} fill={fill} fillOpacity={op} />
                <text x={(x1 + x2) / 2} y={mT + 14} textAnchor="middle" fill={tcol} style={{ fontSize: 10, fontWeight: 800 }}>{name}</text>
              </g>
            ))}
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#475569" strokeWidth={1.5} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#475569" strokeWidth={1.5} />
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>log|Q<tspan dy={2} style={{ fontSize: 7 }}>s</tspan><tspan dy={-2}>|</tspan></text>
            <text x={mL + PW} y={mT + PH + 18} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>ψ<tspan dy={2} style={{ fontSize: 7 }}>s</tspan><tspan dy={-2}> (V) →</tspan></text>
            {/* markers φ_F, 2φ_F, 0 */}
            {[{ x: 0, l: '0' }, { x: phiF, l: 'φ_F' }, { x: 2 * phiF, l: '2φ_F' }].map((m) => (
              <g key={m.l}>
                <line x1={xOf(m.x)} y1={mT} x2={xOf(m.x)} y2={mT + PH} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={xOf(m.x)} y={mT + PH + 32} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>
                  {m.l === '0' ? '0' : m.l === 'φ_F' ? <>φ<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></> : <>2φ<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></>}
                </text>
              </g>
            ))}
            {/* curve */}
            <path d={path} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />
            {/* branch labels */}
            <text x={xOf(-0.16)} y={yOf(Math.log10(qs(-0.16))) - 8} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9, fontWeight: 700 }}>∝e^(q|ψ|/2kT)</text>
            <text x={xOf(0.86)} y={yOf(Math.log10(qs(0.86))) - 8} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 9, fontWeight: 700 }}>∝e^(qψ/2kT)</text>
            {/* operating point */}
            <circle cx={xOf(ps)} cy={yOf(Math.log10(qs(ps)))} r={5} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Readout label={'פוטנציאל-שטח $\\psi_s$'} value={`${ps.toFixed(2)} V`} accent="border-violet-100 bg-violet-50" />
        <Readout label="מטען פני-השטח $|Q_s|$" value={`${(Qcur * 1e9).toFixed(1)} nC/cm²`} accent="border-sky-100 bg-sky-50" />
      </div>
      <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-2 text-center text-sm font-extrabold text-violet-800">משטר: {regimeOf(ps)}</div>
    </div>
  )
}
