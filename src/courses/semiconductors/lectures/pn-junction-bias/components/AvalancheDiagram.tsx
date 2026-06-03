/**
 * Impact-ionization cascade (avalanche): inside the depletion region the strong
 * reverse field accelerates a carrier until it knocks an electron out of the
 * lattice — creating a new electron–hole pair. The new carriers accelerate and
 * ionize again, so the count multiplies (1 → 2 → 4 …). Illustrative SVG.
 */
const W = 520
const H = 220

const SKY = '#0ea5e9'
const ROSE = '#f43f5e'

// a small amber "collision" spark
const burst = (cx: number, cy: number) => (
  <g stroke="#f59e0b" strokeWidth={1.6} strokeLinecap="round">
    {[0, 45, 90, 135].map((a) => {
      const r = (a * Math.PI) / 180
      const dx = Math.cos(r) * 7
      const dy = Math.sin(r) * 7
      return <line key={a} x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} />
    })}
    <circle cx={cx} cy={cy} r={2.6} fill="#f59e0b" stroke="none" />
  </g>
)

const elec = (cx: number, cy: number) => (
  <g>
    <circle cx={cx} cy={cy} r={7} fill={SKY} />
    <text x={cx} y={cy + 3.5} textAnchor="middle" fill="white" style={{ fontSize: 11, fontWeight: 800 }}>−</text>
  </g>
)
const hole = (cx: number, cy: number) => (
  <g>
    <circle cx={cx} cy={cy} r={7} fill={ROSE} />
    <text x={cx} y={cy + 3.5} textAnchor="middle" fill="white" style={{ fontSize: 11, fontWeight: 800 }}>+</text>
  </g>
)

export default function AvalancheDiagram() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="av-e" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={SKY} />
          </marker>
          <marker id="av-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={ROSE} />
          </marker>
        </defs>

        {/* depletion strip */}
        <rect x={44} y={46} width={432} height={130} rx={10} fill="#ede9fe" opacity={0.7} />
        <text x={260} y={40} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 12, fontWeight: 700 }}>
          אזור המחסור — שדה חזק
        </text>
        <text x={28} y={115} textAnchor="middle" className="fill-rose-400" style={{ fontSize: 13, fontWeight: 700 }}>p</text>
        <text x={494} y={115} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 13, fontWeight: 700 }}>n</text>

        {/* electron drift arrows (the cascade), left → right */}
        <g fill="none" stroke={SKY} strokeWidth={2.5}>
          <line x1={74} y1={110} x2={150} y2={110} markerEnd="url(#av-e)" />
          <line x1={170} y1={108} x2={280} y2={84} markerEnd="url(#av-e)" />
          <line x1={170} y1={112} x2={280} y2={136} markerEnd="url(#av-e)" />
          <line x1={298} y1={78} x2={398} y2={62} markerEnd="url(#av-e)" />
          <line x1={298} y1={82} x2={398} y2={98} markerEnd="url(#av-e)" />
          <line x1={298} y1={138} x2={398} y2={122} markerEnd="url(#av-e)" />
          <line x1={298} y1={142} x2={398} y2={158} markerEnd="url(#av-e)" />
        </g>
        {/* holes drift the other way (rose), short arrows */}
        <g fill="none" stroke={ROSE} strokeWidth={2.5}>
          <line x1={150} y1={120} x2={96} y2={120} markerEnd="url(#av-h)" />
          <line x1={284} y1={92} x2={234} y2={104} markerEnd="url(#av-h)" />
          <line x1={284} y1={128} x2={234} y2={116} markerEnd="url(#av-h)" />
        </g>

        {/* collision sparks */}
        {burst(160, 110)}
        {burst(290, 80)}
        {burst(290, 140)}
        <text x={160} y={150} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 10.5, fontWeight: 700 }}>
          התנגשות מייננת
        </text>

        {/* carriers: 1 in → 4 out */}
        {elec(66, 110)}
        {elec(410, 60)}
        {elec(410, 100)}
        {elec(410, 122)}
        {elec(410, 160)}
        {hole(90, 120)}
        {hole(228, 106)}
        {hole(228, 114)}

        {/* count caption */}
        <text x={260} y={196} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12.5, fontWeight: 700 }}>
          כל התנגשות יוצרת זוג חדש → המספר מוכפל: 1 → 2 → 4 → …
        </text>
      </svg>
    </div>
  )
}
