/**
 * Faithful static reproduction of the תרגול-6 output characteristics (part ג):
 * three curves for I_B1<I_B2<I_B3, each with a finite Early slope in the active
 * region (dashed back-extrapolations meeting at −V_A), and a sharp avalanche
 * breakdown rise at BV_CEO = 12 V. Pure SVG.
 */
const DARK = '#334155'
const CURVE = '#0f4c5c'
const EARLY = '#f59e0b'
const GREEN = '#10b981'

export default function BjtOutputBreakdown() {
  const W = 480, H = 300
  const x0 = 110, y0 = 250 // origin
  const xBV = 360 // BV_CEO = 12V
  const xVA = 30 // −V_A back-extrapolation point (left of origin)
  // three curves with increasing knee current and Early slope
  const levels = [
    { sub: '1', knee: 58, slope: 0.14 },
    { sub: '2', knee: 98, slope: 0.24 },
    { sub: '3', knee: 150, slope: 0.40 },
  ]
  const curvePath = (knee: number, slope: number) => {
    // quick rise to the knee, linear (Early) active region, then avalanche at xBV
    const xa = x0 + 26
    const yk = y0 - knee
    const yActiveEnd = yk - slope * (xBV - xa)
    return `M ${x0},${y0 - 4} C ${x0 + 8},${yk} ${xa - 6},${yk} ${xa},${yk} L ${xBV},${yActiveEnd} C ${xBV + 14},${yActiveEnd} ${xBV + 20},${yActiveEnd - 40} ${xBV + 22},${yActiveEnd - 120}`
  }
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="ob-ax" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={DARK} /></marker>
        </defs>
        {/* axes */}
        <line x1={x0} y1={y0} x2={W - 16} y2={y0} stroke={DARK} strokeWidth={1.5} markerEnd="url(#ob-ax)" />
        <line x1={x0} y1={y0 + 6} x2={x0} y2={20} stroke={DARK} strokeWidth={1.5} markerEnd="url(#ob-ax)" />
        <text x={x0 - 8} y={22} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>I<tspan dy={3} style={{ fontSize: 10 }}>C</tspan></text>
        <text x={W - 14} y={y0 + 16} style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>V<tspan dy={3} style={{ fontSize: 10 }}>CE</tspan></text>

        {/* Early back-extrapolations (dashed) → meet at −V_A */}
        {levels.map((l, i) => {
          const xa = x0 + 26
          const yk = y0 - l.knee
          return <line key={i} x1={xa} y1={yk} x2={xVA} y2={y0} stroke={EARLY} strokeWidth={1} strokeDasharray="5 4" opacity={0.7} />
        })}
        <text x={xVA} y={y0 + 16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>−V<tspan dy={3} style={{ fontSize: 9 }}>A</tspan></text>

        {/* the three curves */}
        {levels.map((l, i) => (
          <g key={i}>
            <path d={curvePath(l.knee, l.slope)} fill="none" stroke={CURVE} strokeWidth={2.4} />
            <text x={x0 + 60} y={y0 - l.knee - l.slope * 60 - 6} style={{ fontSize: 12, fontWeight: 700, fill: CURVE }}>I<tspan dy={3} style={{ fontSize: 9 }}>B{l.sub}</tspan></text>
          </g>
        ))}

        {/* BV_CEO marker */}
        <line x1={xBV} y1={y0} x2={xBV} y2={y0 - 200} stroke={GREEN} strokeWidth={1} strokeDasharray="5 4" opacity={0.7} />
        <text x={xBV} y={y0 + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: DARK }}>BV<tspan dy={3} style={{ fontSize: 8 }}>CEO</tspan><tspan dy={-3}>=12V</tspan></text>

        {/* annotations */}
        <text x={x0 + 150} y={70} textAnchor="middle" style={{ fontSize: 12, fontWeight: 600, fill: EARLY }}>אפקט התקצרות הבסיס</text>
        <text x={xBV + 30} y={60} style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>פריצה</text>
        <line x1={xBV + 28} y1={66} x2={xBV + 10} y2={90} stroke={DARK} strokeWidth={1} markerEnd="url(#ob-ax)" />
      </svg>
    </div>
  )
}
