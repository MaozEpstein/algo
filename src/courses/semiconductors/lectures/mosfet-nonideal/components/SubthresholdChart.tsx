import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from '../../mosfet/components/Readout'
import { mosfetSubthresholdSwing } from '../../../lib/junction'

/**
 * Subthreshold conduction on a LOG axis: below V_T the drain current does not vanish but decays
 * exponentially (diffusion conduction, like a BJT), so log₁₀ I_D falls linearly with slope set by
 * the subthreshold swing S = 2.3·m·kT/q ≈ m·60 mV/dec. An m (ideality) slider tilts the
 * subthreshold slope; the ideal 60 mV/dec limit is drawn dashed. Above V_T the square law takes over.
 */
const VT = 1
const K = 1e-3 // A/V²
const IVT = 1e-7 // A, reference current at threshold
const LOGMIN = -9
const LOGMAX = -2
const W = 500
const H = 280
const mL = 58
const mR = 24
const mT = 20
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const VGMAX = 3
const N = 100

const xOf = (vg: number) => mL + (vg / VGMAX) * PW
const yOf = (logI: number) => mT + (1 - (logI - LOGMIN) / (LOGMAX - LOGMIN)) * PH

export default function SubthresholdChart() {
  const [m, setM] = useState(1.3)
  const S = mosfetSubthresholdSwing(m) // V/decade
  const current = (vg: number) => {
    const sub = IVT * Math.pow(10, (vg - VT) / S)
    const sq = vg > VT ? (K / 2) * (vg - VT) ** 2 : 0
    return Math.max(1e-13, sub + sq)
  }
  const path = (fn: (v: number) => number) => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const vg = (VGMAX * i) / N
      const logI = Math.max(LOGMIN, Math.log10(fn(vg)))
      pts.push(`${xOf(vg).toFixed(1)},${yOf(logI).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }
  const ideal = (vg: number) => Math.max(1e-13, IVT * Math.pow(10, (vg - VT) / mosfetSubthresholdSwing(1)))

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>מקדם-אידאליות · <Tex>{'m=1+C_{dep}/C_{ox}'}</Tex></>} value={m} min={1} max={2} step={0.05} onChange={setM} display={`${m.toFixed(2)}`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* decade gridlines */}
            {Array.from({ length: LOGMAX - LOGMIN + 1 }).map((_, i) => {
              const logI = LOGMIN + i
              return (
                <g key={i}>
                  <line x1={mL} y1={yOf(logI)} x2={mL + PW} y2={yOf(logI)} stroke="#f1f5f9" strokeWidth={1} />
                  <text x={mL - 6} y={yOf(logI) + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8 }}>10{sup(logI)}</text>
                </g>
              )
            })}
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>GS</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 6} y={mT - 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>I_D (A)</text>
            {/* threshold */}
            <line x1={xOf(VT)} y1={mT} x2={xOf(VT)} y2={mT + PH} stroke="#fda4af" strokeWidth={1} strokeDasharray="3 3" />
            <text x={xOf(VT)} y={mT + PH + 16} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9, fontWeight: 700 }}>V_T</text>
            {/* ideal 60 mV/dec reference */}
            <path d={path(ideal)} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="5 3" />
            <text x={xOf(0.35)} y={yOf(Math.log10(ideal(0.35))) - 4} className="fill-slate-400" style={{ fontSize: 8.5, fontWeight: 700 }}>60 mV/dec (אידיאלי)</text>
            {/* actual curve */}
            <path d={path(current)} fill="none" stroke="#0284c7" strokeWidth={2.75} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Readout label="נדנוד תת-סף $S$" value={`${(S * 1000).toFixed(0)} mV/dec`} accent="border-sky-100 bg-sky-50" />
        <Readout label="$S_{min}$ ($m=1$)" value="≈ 60 mV/dec" accent="border-slate-200 bg-slate-50" />
        <Readout label="הולכה" value="דיפוזיה" accent="border-amber-100 bg-amber-50" />
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        מתחת ל-<Tex>{'V_T'}</Tex> הזרם <b>אינו אפס</b> אלא דועך <b>אקספוננציאלית</b> — הולכת-<b>דיפוזיה</b> מעל מחסום, בדיוק כמו ב-BJT.
        השיפוע על ציר-לוג הוא <Tex>{'S=2.3\\,m\\,kT/q\\approx m\\cdot60'}</Tex> mV/dec; הגבול האידיאלי (<Tex>{'m=1'}</Tex>) הוא
        {' '}<b>60 mV/dec</b> — קובע כמה תלול אפשר לכבות טרנזיסטור, וקריטי לצריכת-ההספק.
      </p>
    </div>
  )
}

function sup(n: number): string {
  const map: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
  return String(n).split('').map((c) => map[c] ?? c).join('')
}
