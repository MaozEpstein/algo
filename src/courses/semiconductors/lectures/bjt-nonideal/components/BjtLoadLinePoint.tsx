/**
 * Faithful static reproduction of the תרגול-6 operating-point figure (part ד): a
 * single output characteristic (Early slope → avalanche at BV_CEO), the load line,
 * and the Q-point at (V_CE=6.9 V, I_C=0.26 mA). Labels V_A, V_CC, BV_CEO and the
 * 1/r_o slope. Pure SVG.
 */
const DARK = '#334155'
const CURVE = '#0f4c5c'
const LOAD = '#60a5fa'
const EARLY = '#f59e0b'
const GREEN = '#10b981'

export default function BjtLoadLinePoint() {
  const W = 470, H = 290
  const x0 = 110, y0 = 240
  const xVA = 26 // −V_A
  const xQ = 210, yQ = y0 - 86 // Q-point (6.9V, 0.26mA)
  const xVcc = 300 // V_CC on axis (load-line x-intercept-ish)
  const xBV = 380 // BV_CEO

  const knee = 60
  const xa = x0 + 22
  const yk = y0 - knee
  const slope = (y0 - 86 - yk) / (xQ - xa) // pass curve through Q
  const yBVactive = yk + slope * (xBV - xa)
  const curve = `M ${x0},${y0 - 4} C ${x0 + 8},${yk} ${xa - 6},${yk} ${xa},${yk} L ${xBV},${yBVactive} C ${xBV + 12},${yBVactive} ${xBV + 18},${yBVactive - 30} ${xBV + 20},${yBVactive - 110}`

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="ll-ax" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={DARK} /></marker>
        </defs>
        <line x1={x0} y1={y0} x2={W - 16} y2={y0} stroke={DARK} strokeWidth={1.5} markerEnd="url(#ll-ax)" />
        <line x1={x0} y1={y0 + 6} x2={x0} y2={18} stroke={DARK} strokeWidth={1.5} markerEnd="url(#ll-ax)" />
        <text x={x0 - 8} y={20} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>I<tspan dy={3} style={{ fontSize: 10 }}>C</tspan></text>
        <text x={W - 14} y={y0 + 16} style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>V<tspan dy={3} style={{ fontSize: 10 }}>CE</tspan></text>

        {/* Early back-extrapolation to −V_A */}
        <line x1={xa} y1={yk} x2={xVA} y2={y0} stroke={EARLY} strokeWidth={1} strokeDasharray="5 4" opacity={0.75} />
        <text x={xVA} y={y0 + 16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>V<tspan dy={3} style={{ fontSize: 9 }}>A</tspan></text>

        {/* output curve */}
        <path d={curve} fill="none" stroke={CURVE} strokeWidth={2.4} />

        {/* load line: from (V_CC,0) up-left */}
        <line x1={xVcc} y1={y0} x2={x0 + 6} y2={y0 - 150} stroke={LOAD} strokeWidth={1.8} />

        {/* Q-point */}
        <line x1={xQ} y1={y0} x2={xQ} y2={yQ} stroke={DARK} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.6} />
        <line x1={x0} y1={yQ} x2={xQ} y2={yQ} stroke={DARK} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.6} />
        <circle cx={xQ} cy={yQ} r={4} fill="#dc2626" />
        <text x={xQ} y={y0 + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: DARK }}>6.9V</text>
        <text x={x0 - 8} y={yQ + 4} textAnchor="end" style={{ fontSize: 11, fontWeight: 600, fill: DARK }}>0.26mA</text>

        {/* V_CC + BV_CEO ticks */}
        <text x={xVcc} y={y0 + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: LOAD }}>V<tspan dy={3} style={{ fontSize: 9 }}>CC</tspan></text>
        <line x1={xBV} y1={y0} x2={xBV} y2={y0 - 150} stroke={GREEN} strokeWidth={1} strokeDasharray="5 4" opacity={0.7} />
        <text x={xBV} y={y0 + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: DARK }}>BV<tspan dy={3} style={{ fontSize: 8 }}>CEO</tspan></text>

        {/* 1/r_o slope label */}
        <text x={xQ + 56} y={yQ - 6} style={{ fontSize: 11, fontWeight: 600, fill: EARLY }}>שיפוע 1/r<tspan dy={3} style={{ fontSize: 8 }}>o</tspan></text>
      </svg>
    </div>
  )
}
