import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { jfetChannelOpening, jfetRegion, jfetVdsat } from '../../../lib/junction'

/**
 * The flagship JFET interactive: a live cross-section showing the conducting channel being
 * squeezed by the two depletion regions. The gate reverse bias |V_GS| widens them
 * uniformly; V_DS adds extra reverse bias toward the drain, so the channel tapers and
 * pinches at the DRAIN end first (→ saturation). When the gate alone closes the whole
 * channel → cutoff. Region badge + readouts update live. Built on jfetChannelOpening /
 * jfetRegion / jfetVdsat (V in volts, geometry in px). Schematic.
 */
const W = 480
const H = 280
const xS = 72
const xD = 408
const yC = 150
const a = 44 // channel half-width (px)
const yGateBot = yC - a // top gate's lower edge = channel top
const yGateTop = yC + a // bottom gate's upper edge = channel bottom

const VBI = 0.7
const VP = 4.0 // applied pinch-off magnitude
const VPINCH = VBI + VP // total reverse bias that fully depletes
const N = 56
const SLATE = '#64748b'
const ROSE = '#f43f5e'
const SKY = '#0ea5e9'

export default function ChannelView() {
  const [vgs, setVgs] = useState(0) // magnitude (displayed as −V_GS)
  const [vds, setVds] = useState(0)

  const region = jfetRegion(vgs, vds, VP)
  const vdsat = jfetVdsat(vgs, VP)
  // channel half-opening at fractional position t∈[0,1] (0 = source, 1 = drain)
  const openAt = (t: number) => jfetChannelOpening(a, VBI + vgs + vds * t, VPINCH)
  const openDrain = openAt(1)

  const xAt = (t: number) => xS + t * (xD - xS)
  const samples = Array.from({ length: N + 1 }, (_, i) => i / N)

  // top depletion polygon: from the top gate (y=yGateBot) down to the upper channel edge
  const topPath =
    `M ${xS},${yGateBot} L ${xD},${yGateBot} ` +
    [...samples].reverse().map((t) => `L ${xAt(t).toFixed(1)},${(yC - openAt(t)).toFixed(1)}`).join(' ') +
    ' Z'
  const botPath =
    `M ${xS},${yGateTop} L ${xD},${yGateTop} ` +
    [...samples].reverse().map((t) => `L ${xAt(t).toFixed(1)},${(yC + openAt(t)).toFixed(1)}`).join(' ') +
    ' Z'

  const badge =
    region === 'cutoff'
      ? { he: 'קטעון (Cutoff) — התעלה סגורה', cls: 'border-slate-400 bg-slate-100 text-slate-700' }
      : region === 'ohmic'
        ? { he: 'אזור אוהמי (לינארי) — נגד נשלט', cls: 'border-sky-300 bg-sky-50 text-sky-700' }
        : { he: 'רוויה — צביטה בקצה הניקוז', cls: 'border-emerald-300 bg-emerald-50 text-emerald-700' }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* p⁺ gate slabs */}
            <rect x={xS} y={yGateBot - 36} width={xD - xS} height={36} fill={ROSE} fillOpacity={0.18} stroke={ROSE} strokeOpacity={0.4} />
            <rect x={xS} y={yGateTop} width={xD - xS} height={36} fill={ROSE} fillOpacity={0.18} stroke={ROSE} strokeOpacity={0.4} />
            <text x={xS + 16} y={yGateBot - 14} className="fill-rose-500" style={{ fontSize: 12, fontWeight: 800 }}>p⁺ (שער)</text>
            <text x={xS + 16} y={yGateTop + 23} className="fill-rose-500" style={{ fontSize: 12, fontWeight: 800 }}>p⁺ (שער)</text>

            {/* conducting channel (sky) */}
            <rect x={xS} y={yGateBot} width={xD - xS} height={2 * a} fill={SKY} fillOpacity={0.22} />

            {/* depletion regions (grey) eating into the channel */}
            <path d={topPath} fill={SLATE} fillOpacity={0.42} />
            <path d={botPath} fill={SLATE} fillOpacity={0.42} />

            {/* terminals */}
            <line x1={xS} y1={yC} x2={40} y2={yC} stroke="#334155" strokeWidth={2} />
            <text x={30} y={yC - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>S</text>
            <line x1={xD} y1={yC} x2={W - 40} y2={yC} stroke="#334155" strokeWidth={2} />
            <text x={W - 30} y={yC - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>D</text>
            <text x={(xS + xD) / 2} y={H - 12} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10.5 }}>
              אזור-המחסור (אפור) חונק את התעלה; הוא רחב יותר לכיוון הניקוז כי שם הצומת מוטה אחורה יותר
            </text>
          </svg>
        </div>
      </div>

      {/* region badge */}
      <div className={`rounded-2xl border-s-4 px-4 py-2.5 text-center text-base font-extrabold ${badge.cls}`}>{badge.he}</div>

      {/* sliders */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <Slider label={<>מתח שער · <Tex>{'V_{GS}'}</Tex></>} value={vgs} min={0} max={VP} step={0.05} onChange={setVgs} display={`−${vgs.toFixed(2)} V`} />
        <Slider label={<>מתח ניקוז · <Tex>{'V_{DS}'}</Tex></>} value={vds} min={0} max={6} step={0.05} onChange={setVds} display={`${vds.toFixed(2)} V`} />
      </div>

      {/* readouts */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Readout label="מתח-צביטה $|V_P|$" value={`${VP.toFixed(1)} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="$V_{Dsat}=|V_P|-|V_{GS}|$" value={`${vdsat.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="פתח התעלה בניקוז" value={`${((openDrain / a) * 100).toFixed(0)}%`} accent="border-sky-100 bg-sky-50" />
      </div>
    </div>
  )
}
