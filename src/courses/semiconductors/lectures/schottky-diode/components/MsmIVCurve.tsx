/**
 * Faithful static reproduction of the תרגול-4 I–V characteristic of the
 * back-to-back M-S-M structure: whichever way it is biased, one Schottky junction
 * is always reverse-biased, so the current saturates at ±A·J_RD in BOTH
 * directions (an antisymmetric, doubly-saturating curve). Pure SVG.
 */
const DARK = '#334155'
const WAVE = '#0e7490'

export default function MsmIVCurve() {
  const W = 440, H = 240
  const cx = W / 2, cy = H / 2
  const sat = 64 // saturation current level (px)
  // antisymmetric saturating curve: I ≈ J_RD·tanh(V/Vt-ish)
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const v = (i / 80) * 2 - 1 // -1..1
    const x = cx + v * 170
    const y = cy - Math.tanh(v * 6) * sat
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="iv-ax" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={DARK} />
          </marker>
        </defs>
        {/* axes */}
        <line x1={40} y1={cy} x2={W - 16} y2={cy} stroke={DARK} strokeWidth={1.5} markerEnd="url(#iv-ax)" />
        <line x1={cx} y1={H - 20} x2={cx} y2={16} stroke={DARK} strokeWidth={1.5} markerEnd="url(#iv-ax)" />
        <text x={W - 14} y={cy + 16} style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>V</text>
        <text x={cx + 8} y={22} style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>I</text>

        {/* saturation guide lines */}
        <line x1={40} y1={cy - sat} x2={W - 20} y2={cy - sat} stroke={DARK} strokeWidth={1} strokeDasharray="4 4" opacity={0.55} />
        <line x1={40} y1={cy + sat} x2={W - 20} y2={cy + sat} stroke={DARK} strokeWidth={1} strokeDasharray="4 4" opacity={0.55} />
        <text x={cx + 8} y={cy - sat - 4} style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>+J<tspan dy={3} style={{ fontSize: 9 }}>RD</tspan></text>
        <text x={cx - 10} y={cy + sat + 14} textAnchor="end" style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>−J<tspan dy={3} style={{ fontSize: 9 }}>RD</tspan></text>

        {/* the curve */}
        <polyline points={pts.join(' ')} fill="none" stroke={WAVE} strokeWidth={2.6} />
      </svg>
    </div>
  )
}
