/**
 * Schematic circuit symbol for a BJT. The emitter arrow points OUT for npn and IN
 * for pnp — the only difference between the two. Drawn standalone (its own card) so
 * it never crowds the cross-section. Pure schematic.
 */
interface Props {
  kind: 'npn' | 'pnp'
}

const W = 220
const H = 180

export default function BjtSymbol({ kind }: Props) {
  const npn = kind === 'npn'
  const barX = 104
  const barTop = 66
  const barBot = 114
  const nodeX = 150
  const cTopY = 40
  const eBotY = 140
  const cJoinY = barTop + 8
  const eJoinY = barBot - 8
  const cMidY = (cJoinY + cTopY) / 2 + 4

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="bsym-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M1,1 L9,5 L1,9 Z" fill="#475569" />
          </marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfcff" stroke="#eef2f7" />

        {/* base lead + bar */}
        <line x1={48} y1={(barTop + barBot) / 2} x2={barX} y2={(barTop + barBot) / 2} stroke="#475569" strokeWidth={2.25} />
        <line x1={barX} y1={barTop} x2={barX} y2={barBot} stroke="#475569" strokeWidth={3} />
        <text x={40} y={(barTop + barBot) / 2 + 4} textAnchor="end" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>B</text>

        {/* collector lead (up) */}
        <line x1={barX} y1={cJoinY} x2={nodeX} y2={cTopY + 14} stroke="#475569" strokeWidth={2.25} />
        <line x1={nodeX} y1={cTopY + 14} x2={nodeX} y2={cTopY} stroke="#475569" strokeWidth={2.25} />
        <text x={nodeX} y={cTopY - 6} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C</text>

        {/* emitter lead (down) with arrow — OUT for npn, IN for pnp */}
        {npn ? (
          <line x1={barX} y1={eJoinY} x2={nodeX} y2={eBotY - 14} stroke="#475569" strokeWidth={2.25} markerEnd="url(#bsym-arrow)" />
        ) : (
          <line x1={nodeX} y1={eBotY - 14} x2={barX} y2={eJoinY} stroke="#475569" strokeWidth={2.25} markerEnd="url(#bsym-arrow)" />
        )}
        <line x1={nodeX} y1={eBotY - 14} x2={nodeX} y2={eBotY} stroke="#475569" strokeWidth={2.25} />
        <text x={nodeX} y={eBotY + 14} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>E</text>

        {/* type label */}
        <text x={W - 16} y={cMidY} textAnchor="end" className="fill-violet-600" style={{ fontSize: 13, fontWeight: 800 }}>{npn ? 'npn' : 'pnp'}</text>
      </svg>
    </div>
  )
}
