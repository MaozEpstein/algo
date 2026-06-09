/**
 * SCR schematic symbol, drawn to match the standard figure: a diode (anode A on top →
 * downward triangle → cathode bar → K at the bottom) with the GATE lead branching off
 * the cathode bar at an angle. Conducts A→K only after being triggered. Pure schematic.
 */
const W = 220
const H = 230
const SLATE = '#334155'

export default function ScrSymbol() {
  const cx = 120
  const yA = 34 // anode terminal
  const yBase = 84 // triangle base (anode side)
  const yApex = 128 // triangle apex (bottom) = cathode bar
  const yK = 196 // cathode terminal
  const halfBase = 26
  const halfBar = 30

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfcff" stroke="#eef2f7" />

        {/* anode lead + terminal */}
        <line x1={cx} y1={yA} x2={cx} y2={yBase} stroke={SLATE} strokeWidth={2.5} />
        <circle cx={cx} cy={yA} r={4} fill={SLATE} />
        <text x={cx} y={yA - 8} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 15, fontWeight: 800 }}>A</text>

        {/* diode triangle (anode→cathode), apex down */}
        <path d={`M ${cx - halfBase} ${yBase} L ${cx + halfBase} ${yBase} L ${cx} ${yApex} Z`} fill="#e0f2fe" stroke={SLATE} strokeWidth={2.5} strokeLinejoin="round" />
        {/* cathode bar at the apex */}
        <line x1={cx - halfBar} y1={yApex} x2={cx + halfBar} y2={yApex} stroke={SLATE} strokeWidth={3.5} />
        {/* cathode lead + terminal */}
        <line x1={cx} y1={yApex} x2={cx} y2={yK} stroke={SLATE} strokeWidth={2.5} />
        <circle cx={cx} cy={yK} r={4} fill={SLATE} />
        <text x={cx} y={yK + 18} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 15, fontWeight: 800 }}>K</text>

        {/* gate: branches off the cathode bar's left end, angling down-left to G */}
        <line x1={cx - halfBar} y1={yApex} x2={cx - 58} y2={yApex + 24} stroke={SLATE} strokeWidth={2.5} />
        <circle cx={cx - 58} cy={yApex + 24} r={4} fill={SLATE} />
        <text x={cx - 58} y={yApex + 42} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 15, fontWeight: 800 }}>G</text>

        <text x={W - 14} y={H - 12} textAnchor="end" className="fill-violet-600" style={{ fontSize: 12, fontWeight: 800 }}>SCR</text>
      </svg>
    </div>
  )
}
