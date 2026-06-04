/**
 * Schematic I–V contrast: an OHMIC contact is a straight line through the origin
 * (V=I·ρ_c, symmetric — conducts both ways), whereas a RECTIFYING (Schottky)
 * contact is the one-way diode exponential. Pure schematic (no scale) — the shape
 * contrast is the point.
 */
const W = 420
const H = 240
const cx = W / 2
const cy = H / 2
const AX = W / 2 - 26 // half-width of the V axis
const AY = H / 2 - 22 // half-height of the I axis

export default function OhmicVsRectifyingIV() {
  // ohmic: straight line I = k·V through origin (both quadrants)
  const k = AY / AX
  const ohmic = `M ${cx - AX},${cy + k * AX} L ${cx + AX},${cy - k * AX}`
  // rectifying: ~flat (slightly negative) for V<0, steep exponential for V>0
  const N = 60
  const rectPts: string[] = []
  for (let i = 0; i <= N; i++) {
    const v = -1 + (2 * i) / N // −1..1 (normalized)
    const I = v <= 0 ? -0.06 : Math.min(1, (Math.exp(4.2 * v) - 1) / (Math.exp(4.2) - 1)) // diode shape
    rectPts.push(`${(cx + v * AX).toFixed(1)},${(cy - I * AY).toFixed(1)}`)
  }

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* axes through the origin */}
        <line x1={cx - AX} y1={cy} x2={cx + AX} y2={cy} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={cx} y1={cy - AY} x2={cx} y2={cy + AY} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={cx + AX} y={cy - 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 12 }}>V</text>
        <text x={cx + 6} y={cy - AY + 10} className="fill-slate-400" style={{ fontSize: 12 }}>I</text>

        {/* ohmic — straight, symmetric */}
        <path d={ohmic} fill="none" stroke="#10b981" strokeWidth={2.75} strokeLinecap="round" />
        {/* rectifying — one-way diode */}
        <path d={'M ' + rectPts.join(' L ')} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />

        {/* legend — top-left (empty Q2), off the curves */}
        <g>
          <rect x={cx - AX + 6} y={26} width={166} height={42} rx={7} fill="#ffffff" opacity={0.92} stroke="#e2e8f0" />
          <text x={cx - AX + 134} y={47} textAnchor="end" className="fill-emerald-700" style={{ fontSize: 12, fontWeight: 700 }}>אוהמי (ליניארי)</text>
          <line x1={cx - AX + 142} y1={43} x2={cx - AX + 160} y2={43} stroke="#10b981" strokeWidth={3.5} strokeLinecap="round" />
          <text x={cx - AX + 134} y={62} textAnchor="end" className="fill-violet-700" style={{ fontSize: 12, fontWeight: 700 }}>מיישר (שוטקי)</text>
          <line x1={cx - AX + 142} y1={58} x2={cx - AX + 160} y2={58} stroke="#7c3aed" strokeWidth={3.5} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}
