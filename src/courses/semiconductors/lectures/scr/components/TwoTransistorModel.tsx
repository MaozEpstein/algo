/**
 * The two-transistor model of an SCR. LEFT: the PNPN splits into two interleaved BJTs
 * sharing the middle layers — a PNP (P₂N₂P₁) and an NPN (N₂P₁N₁). RIGHT: the cross-
 * coupled schematic — the PNP's collector drives the NPN's base and the NPN's collector
 * drives the PNP's base, so once it starts it feeds itself (regeneration). The gate
 * injects into the NPN base; ΔI_Bp is the regenerative base drive of the PNP. Faithful
 * to the standard textbook figure. Pure schematic.
 */
const ROSE = '#e11d48'
const SKY = '#0ea5e9'
const SLATE = '#475569'
const BLUE = '#2563eb'

/** A small vertical 3-layer stack used in the structural-split view. */
function MiniStack({ x, y, layers, title }: { x: number; y: number; layers: { t: string; s: string; c: string }[]; title: string }) {
  const w = 56
  const h = 38
  return (
    <g>
      <text x={x + w / 2} y={y - 8} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 800 }}>{title}</text>
      {layers.map((l, i) => (
        <g key={i}>
          <rect x={x} y={y + i * h} width={w} height={h} fill={l.c} fillOpacity={0.16} stroke={l.c} strokeOpacity={0.55} strokeWidth={1} />
          <text x={x + w / 2} y={y + i * h + h / 2 + 6} textAnchor="middle" fill={l.c} style={{ fontSize: 17, fontWeight: 800 }}>{l.t}<tspan dy={4} style={{ fontSize: 10 }}>{l.s}</tspan></text>
        </g>
      ))}
    </g>
  )
}

export default function TwoTransistorModel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ---- structural split ---- */}
      <div className="ltr w-full rounded-2xl border border-slate-200 bg-white p-2" dir="ltr">
        <svg viewBox="0 0 320 300" className="mx-auto w-full" style={{ maxWidth: 320 }}>
          <text x={160} y={20} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>הפיצול המבני</text>
          <MiniStack x={40} y={64} title="PNPN" layers={[{ t: 'P', s: '2', c: ROSE }, { t: 'N', s: '2', c: SKY }, { t: 'P', s: '1', c: ROSE }, { t: 'N', s: '1', c: SKY }]} />
          <text x={150} y={138} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 22, fontWeight: 800 }}>→</text>
          <MiniStack x={186} y={52} title="PNP · Q₂" layers={[{ t: 'P', s: '2', c: ROSE }, { t: 'N', s: '2', c: SKY }, { t: 'P', s: '1', c: ROSE }]} />
          <MiniStack x={250} y={128} title="NPN · Q₁" layers={[{ t: 'N', s: '2', c: SKY }, { t: 'P', s: '1', c: ROSE }, { t: 'N', s: '1', c: SKY }]} />
          <text x={160} y={284} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10.5 }}>השכבות המשותפות: N₂ ו-P₁</text>
        </svg>
      </div>

      {/* ---- cross-coupled schematic (faithful) ---- */}
      <div className="ltr w-full rounded-2xl border border-slate-200 bg-white p-2" dir="ltr">
        <svg viewBox="0 0 300 340" className="mx-auto w-full" style={{ maxWidth: 300 }}>
          <defs>
            <marker id="tt-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M1,1 L9,5 L1,9 Z" fill={SLATE} /></marker>
            <marker id="tt-fb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={BLUE} /></marker>
          </defs>
          <text x={150} y={20} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>המעגל המוצלב</text>

          {/* terminals A / K / G */}
          <circle cx={120} cy={42} r={4} fill={SLATE} /><text x={120} y={36} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 800 }}>A</text>
          <circle cx={180} cy={300} r={4} fill={SLATE} /><text x={180} y={318} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 800 }}>K</text>
          <circle cx={56} cy={228} r={4} fill={SLATE} /><text x={42} y={232} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 800 }}>G</text>

          {/* ===== Q2 — PNP (top); base bar at x=150, leads to the LEFT, base to the RIGHT ===== */}
          <line x1={150} y1={90} x2={150} y2={132} stroke={SLATE} strokeWidth={3} /> {/* base bar */}
          {/* emitter → A (pnp arrow points INTO the bar) */}
          <line x1={120} y1={42} x2={120} y2={72} stroke={SLATE} strokeWidth={2} />
          <line x1={120} y1={72} x2={150} y2={92} stroke={SLATE} strokeWidth={2} markerEnd="url(#tt-arr)" />
          {/* collector → down to the NPN base node */}
          <line x1={150} y1={130} x2={124} y2={150} stroke={SLATE} strokeWidth={2} />
          <line x1={124} y1={150} x2={124} y2={219} stroke={SLATE} strokeWidth={2} />
          {/* base → right (receives ΔI_Bp) */}
          <line x1={150} y1={111} x2={196} y2={111} stroke={SLATE} strokeWidth={2} />
          <text x={208} y={104} className="fill-rose-500" style={{ fontSize: 12.5, fontWeight: 800 }}>Q₂ pnp</text>
          <text x={128} y={84} className="fill-rose-500" style={{ fontSize: 14, fontWeight: 800 }}>P₂</text>
          <text x={160} y={128} className="fill-sky-600" style={{ fontSize: 14, fontWeight: 800 }}>N₂</text>

          {/* ===== Q1 — NPN (bottom); base bar at x=150, leads to the RIGHT, base to the LEFT ===== */}
          <line x1={150} y1={198} x2={150} y2={240} stroke={SLATE} strokeWidth={3} /> {/* base bar */}
          {/* collector → up-right, then up the ΔI wire into the PNP base */}
          <line x1={150} y1={200} x2={176} y2={182} stroke={SLATE} strokeWidth={2} />
          <line x1={176} y1={182} x2={196} y2={176} stroke={SLATE} strokeWidth={2} />
          <line x1={196} y1={176} x2={196} y2={113} stroke={BLUE} strokeWidth={2} markerEnd="url(#tt-fb)" /> {/* ΔI_Bp feedback */}
          {/* base → left (gate + PNP collector) */}
          <line x1={150} y1={219} x2={110} y2={219} stroke={SLATE} strokeWidth={2} />
          {/* emitter → K (npn arrow points OUT) */}
          <line x1={150} y1={238} x2={176} y2={258} stroke={SLATE} strokeWidth={2} markerEnd="url(#tt-arr)" />
          <line x1={176} y1={258} x2={180} y2={300} stroke={SLATE} strokeWidth={2} />
          <text x={102} y={250} textAnchor="end" className="fill-sky-600" style={{ fontSize: 12.5, fontWeight: 800 }}>Q₁ npn</text>
          <text x={126} y={214} className="fill-rose-500" style={{ fontSize: 14, fontWeight: 800 }}>P₁</text>
          <text x={184} y={252} className="fill-sky-600" style={{ fontSize: 14, fontWeight: 800 }}>N₁</text>

          {/* gate G → NPN base node */}
          <line x1={56} y1={228} x2={56} y2={219} stroke={SLATE} strokeWidth={2} />
          <line x1={56} y1={219} x2={110} y2={219} stroke={SLATE} strokeWidth={2} />

          {/* junction dots: NPN base node (shared by gate + PNP collector + NPN base) and PNP base node */}
          <circle cx={124} cy={219} r={3.5} fill={SLATE} />
          <circle cx={196} cy={111} r={3.5} fill={SLATE} />

          {/* ΔI_Bp label */}
          <text x={210} y={150} className="fill-blue-600" style={{ fontSize: 11, fontWeight: 800 }}>ΔI<tspan dy={2} style={{ fontSize: 7.5 }}>Bp</tspan></text>
          <text x={210} y={163} className="fill-blue-500" style={{ fontSize: 9 }}>(משוב)</text>
        </svg>
      </div>
    </div>
  )
}
