import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { mosfetVdsat, mosfetRegion } from '../../../lib/junction'

/**
 * Interactive channel picture of an n-MOSFET. The inversion-charge thickness at position y is
 * ∝ the local overdrive V_GS − V_T − V(y); V(y) climbs from 0 at the source to min(V_DS, V_ov)
 * at the drain. As V_DS grows the channel tapers toward the drain; at V_DS = V_DS,sat = V_GS − V_T
 * it PINCHES OFF there (Q_inv→0) and the excess V_DS − V_DS,sat drops across a short depletion
 * region — the device saturates. Sliders drive V_GS and V_DS (V_T fixed).
 */
const VT = 1
const W = 540
const H = 250
const oxX = 90
const oxW = 360
const oxTop = 60
const chTop = 96 // channel top (oxide/semiconductor interface)
const MAXQ = 46 // px thickness at full overdrive
const OVMAX = 4 // overdrive that maps to MAXQ

export default function ChannelDiagram() {
  const [vgs, setVgs] = useState(3)
  const [vds, setVds] = useState(1)
  const vov = Math.max(0, vgs - VT)
  const vdsat = mosfetVdsat(vgs, VT)
  const region = mosfetRegion(vgs, vds, VT)

  // local channel voltage rises 0→vEnd across the gate; capped at the overdrive (pinch-off)
  const vEnd = Math.min(vds, vov)
  const pinched = vds >= vdsat && vov > 0
  // fraction of the gate length still inverted (1 in triode; <1 once pinched — illustrative)
  const invFrac = pinched ? Math.max(0.72, 1 - 0.28 * Math.min(1, (vds - vdsat) / 2)) : 1

  const N = 60
  const topPts: string[] = []
  const botPts: string[] = []
  for (let i = 0; i <= N; i++) {
    const f = i / N
    const x = oxX + f * oxW
    const inGate = f <= invFrac
    // V(y) linear from 0 to vEnd over the inverted part
    const vy = inGate ? (vEnd * f) / (invFrac || 1) : vEnd
    const q = inGate ? Math.max(0, vov - vy) : 0
    const th = (q / OVMAX) * MAXQ
    topPts.push(`${x.toFixed(1)},${chTop.toFixed(1)}`)
    botPts.push(`${x.toFixed(1)},${(chTop + th).toFixed(1)}`)
  }
  const channelPath = 'M ' + topPts.join(' L ') + ' L ' + botPts.reverse().join(' L ') + ' Z'
  const pinchX = oxX + invFrac * oxW

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <Slider label={<>מתח שער · <Tex>{'V_{GS}'}</Tex></>} value={vgs} min={0} max={5} step={0.05} onChange={setVgs} display={`${vgs.toFixed(2)} V`} />
        <Slider label={<>מתח ניקוז · <Tex>{'V_{DS}'}</Tex></>} value={vds} min={0} max={5} step={0.05} onChange={setVds} display={`${vds.toFixed(2)} V`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* substrate */}
            <rect x={40} y={chTop} width={W - 80} height={120} rx={5} fill="#fce7f3" stroke="#f9a8d4" strokeWidth={1.25} />
            <text x={W - 50} y={chTop + 110} textAnchor="end" style={{ fontSize: 11, fontWeight: 700, fill: '#9d174d' }}>p-sub</text>

            {/* source & drain */}
            <rect x={40} y={chTop} width={50} height={46} rx={4} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1.25} />
            <rect x={W - 90} y={chTop} width={50} height={46} rx={4} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1.25} />
            <text x={65} y={chTop + 28} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: '#1d4ed8' }}>n⁺</text>
            <text x={W - 65} y={chTop + 28} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: '#1d4ed8' }}>n⁺</text>
            <text x={65} y={chTop - 42} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: '#0f172a' }}>S</text>
            <text x={W - 65} y={chTop - 42} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: '#0f172a' }}>D</text>
            <text x={W - 65} y={chTop - 28} textAnchor="middle" style={{ fontSize: 9, fill: '#64748b' }}>V_DS={vds.toFixed(1)}</text>

            {/* oxide + gate */}
            <rect x={oxX} y={oxTop + 22} width={oxW} height={10} fill="#fde68a" stroke="#f59e0b" strokeWidth={1} />
            <rect x={oxX} y={oxTop} width={oxW} height={20} rx={3} fill="#cbd5e1" stroke="#64748b" strokeWidth={1.25} />
            <text x={oxX + oxW / 2} y={oxTop - 6} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: '#0f172a' }}>G · V_GS={vgs.toFixed(1)}</text>

            {/* inversion channel */}
            {vov > 0 ? (
              <path d={channelPath} fill="#34d399" stroke="#059669" strokeWidth={0.75} opacity={0.9} />
            ) : (
              <text x={oxX + oxW / 2} y={chTop + 40} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: '#dc2626' }}>אין ערוץ — ההתקן כבוי (V_GS ≤ V_T)</text>
            )}

            {/* pinch-off marker */}
            {pinched && vov > 0 && (
              <>
                <line x1={pinchX} y1={chTop} x2={pinchX} y2={chTop + 54} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
                <circle cx={pinchX} cy={chTop} r={3} fill="#dc2626" />
                <text x={pinchX} y={chTop + 70} textAnchor="middle" style={{ fontSize: 9, fontWeight: 800, fill: '#dc2626' }}>pinch-off</text>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="$V_{ov}=V_{GS}-V_T$" value={`${vov.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="$V_{DS,sat}$" value={`${vdsat.toFixed(2)} V`} accent="border-teal-100 bg-teal-50" />
        <Readout label="$V_T$" value={`${VT.toFixed(1)} V`} accent="border-rose-100 bg-rose-50" />
        <Readout
          label="משטר"
          value={region === 'cutoff' ? 'קטעון' : region === 'triode' ? 'טריודה' : 'רוויה'}
          accent="border-sky-100 bg-sky-50"
        />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        עובי הערוץ בכל נקודה יחסי ל<b>עודף-המתח המקומי</b> <Tex>{'V_{GS}-V_T-V(y)'}</Tex>: עבה במקור, דק בניקוז.
        כש-<Tex>{'V_{DS}=V_{DS,sat}=V_{GS}-V_T'}</Tex> הערוץ <b>נצבט</b> בקצה-הניקוז (<Tex>{'Q_{inv}\\to0'}</Tex>),
        ומעבר לכך עודף-המתח נופל על אזור-מחסור קצר — ההתקן <b>ברוויה</b> והזרם כמעט קבוע.
      </p>
    </div>
  )
}
