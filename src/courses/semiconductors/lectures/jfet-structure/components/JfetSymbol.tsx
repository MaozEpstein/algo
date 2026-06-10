/**
 * n-channel JFET schematic symbol: a vertical channel bar (Drain on top, Source on the
 * bottom) with the Gate lead entering from the left — the gate arrow points INTO the
 * channel for an n-channel device. Pure schematic.
 */
const W = 200
const H = 220
const SLATE = '#334155'

export default function JfetSymbol() {
  const xCh = 122 // channel bar
  const yD = 36 // drain terminal
  const yS = 188 // source terminal
  const yBarTop = 70
  const yBarBot = 154
  const yGate = 112 // gate contact height
  const xG = 44 // gate terminal

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="jfet-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={SLATE} /></marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfcff" stroke="#eef2f7" />

        {/* channel bar */}
        <line x1={xCh} y1={yBarTop} x2={xCh} y2={yBarBot} stroke={SLATE} strokeWidth={3.5} />
        {/* drain (top) */}
        <line x1={xCh} y1={yBarTop} x2={xCh} y2={yD} stroke={SLATE} strokeWidth={2.5} />
        <line x1={xCh} y1={yBarTop + 8} x2={xCh + 16} y2={yBarTop + 8} stroke={SLATE} strokeWidth={2.5} />
        <line x1={xCh + 16} y1={yBarTop + 8} x2={xCh + 16} y2={yD} stroke={SLATE} strokeWidth={2.5} />
        <circle cx={xCh + 16} cy={yD} r={4} fill={SLATE} />
        <text x={xCh + 16} y={yD - 8} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 800 }}>D</text>
        {/* source (bottom) */}
        <line x1={xCh} y1={yBarBot - 8} x2={xCh + 16} y2={yBarBot - 8} stroke={SLATE} strokeWidth={2.5} />
        <line x1={xCh + 16} y1={yBarBot - 8} x2={xCh + 16} y2={yS} stroke={SLATE} strokeWidth={2.5} />
        <circle cx={xCh + 16} cy={yS} r={4} fill={SLATE} />
        <text x={xCh + 16} y={yS + 18} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 800 }}>S</text>

        {/* gate — arrow points INTO the channel (n-channel) */}
        <circle cx={xG} cy={yGate} r={4} fill={SLATE} />
        <text x={xG} y={yGate - 10} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 800 }}>G</text>
        <line x1={xG} y1={yGate} x2={xCh} y2={yGate} stroke={SLATE} strokeWidth={2.5} markerEnd="url(#jfet-g)" />

        <text x={W - 12} y={H - 12} textAnchor="end" className="fill-violet-600" style={{ fontSize: 11, fontWeight: 800 }}>JFET (n)</text>
      </svg>
    </div>
  )
}
