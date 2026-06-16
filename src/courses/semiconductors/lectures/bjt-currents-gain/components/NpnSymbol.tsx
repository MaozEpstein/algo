/**
 * Standard npn BJT schematic symbol (the answer sketch for תרגול-5 part א): base
 * on the left, collector top, emitter bottom with the outgoing arrow that marks
 * an npn. Pure SVG.
 */
const STROKE = '#334155'

export default function NpnSymbol() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox="0 0 200 180" className="mx-auto" style={{ maxWidth: 200 }}>
        <defs>
          <marker id="npn-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={STROKE} />
          </marker>
        </defs>
        {/* base lead + vertical bar */}
        <line x1={20} y1={90} x2={70} y2={90} stroke={STROKE} strokeWidth={2} />
        <line x1={70} y1={55} x2={70} y2={125} stroke={STROKE} strokeWidth={3} />
        <text x={14} y={94} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: STROKE }}>B</text>

        {/* collector branch (top) */}
        <line x1={70} y1={78} x2={140} y2={40} stroke={STROKE} strokeWidth={2} />
        <line x1={140} y1={40} x2={140} y2={16} stroke={STROKE} strokeWidth={2} />
        <text x={146} y={20} style={{ fontSize: 14, fontWeight: 700, fill: STROKE }}>C</text>

        {/* emitter branch (bottom) with outgoing arrow = npn */}
        <line x1={70} y1={102} x2={140} y2={140} stroke={STROKE} strokeWidth={2} markerEnd="url(#npn-ar)" />
        <line x1={140} y1={140} x2={140} y2={164} stroke={STROKE} strokeWidth={2} />
        <text x={146} y={160} style={{ fontSize: 14, fontWeight: 700, fill: STROKE }}>E</text>
      </svg>
    </div>
  )
}
