/**
 * The ψ_s regime map (summary p36/p38): a ψ_s axis with the four operating regimes and the key
 * markers 0 (flat-band), φ_F (intrinsic at the surface, n_s=p_s=n_i) and 2φ_F (strong-inversion
 * onset). Pure schematic; subscripts via <tspan>.
 */
const W = 620
const H = 168
const x0 = 168 // ψ_s = 0 (flat-band)
const xF = 340 // φ_F
const x2F = 444 // 2φ_F
const xL = 36
const xR = 584
const yAx = 92
const yZoneTop = 60
const zoneH = 22

const ZONES = [
  { x1: xL, x2: x0, he: 'הצטברות', en: 'Accumulation', fill: '#fecdd3', text: '#e11d48' },
  { x1: x0, x2: xF, he: 'מחסור', en: 'Depletion', fill: '#fde68a', text: '#d97706' },
  { x1: xF, x2: x2F, he: 'היפוך חלש', en: 'Weak inv.', fill: '#bbf7d0', text: '#059669' },
  { x1: x2F, x2: xR, he: 'היפוך חזק', en: 'Strong inv.', fill: '#6ee7b7', text: '#047857' },
]

function Psi() {
  return <>ψ<tspan dy={2} style={{ fontSize: 7 }}>s</tspan></>
}

export default function PsiAxisMap() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="psi-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill="#475569" /></marker>
        </defs>

        {/* zone bands + labels */}
        {ZONES.map((z) => (
          <g key={z.he}>
            <rect x={z.x1} y={yZoneTop} width={z.x2 - z.x1} height={zoneH} fill={z.fill} />
            <text x={(z.x1 + z.x2) / 2} y={yZoneTop - 14} textAnchor="middle" fill={z.text} style={{ fontSize: 12, fontWeight: 800 }}>{z.he}</text>
            <text x={(z.x1 + z.x2) / 2} y={yZoneTop - 2} textAnchor="middle" fill={z.text} style={{ fontSize: 9, fontWeight: 600, opacity: 0.8 }}>{z.en}</text>
          </g>
        ))}

        {/* axis */}
        <line x1={xL} y1={yAx} x2={xR + 8} y2={yAx} stroke="#475569" strokeWidth={1.75} markerEnd="url(#psi-arr)" />
        <text x={xR + 12} y={yAx + 5} className="fill-slate-600" style={{ fontSize: 12, fontWeight: 800 }}><Psi /></text>

        {/* markers */}
        {[
          { x: x0, top: 'FB', bot: <><Psi />=0</> },
          { x: xF, top: '', bot: <>φ<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></> },
          { x: x2F, top: '', bot: <>2φ<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></> },
        ].map((m, i) => (
          <g key={i}>
            <line x1={m.x} y1={yZoneTop} x2={m.x} y2={yAx + 8} stroke="#334155" strokeWidth={1.5} />
            <text x={m.x} y={yAx + 22} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 11, fontWeight: 800 }}>{m.bot}</text>
          </g>
        ))}

        {/* φ_F note: intrinsic at the surface */}
        <text x={xF} y={yAx + 40} textAnchor="middle" className="fill-emerald-700" style={{ fontSize: 9.5, fontWeight: 600 }}>בשפה: n<tspan dy={2} style={{ fontSize: 7 }}>s</tspan><tspan dy={-2}>=p</tspan><tspan dy={2} style={{ fontSize: 7 }}>s</tspan><tspan dy={-2}>=n</tspan><tspan dy={2} style={{ fontSize: 7 }}>i</tspan></text>
        {/* conditions under each zone */}
        <text x={(xL + x0) / 2} y={yAx + 22} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9.5, fontWeight: 700 }}><Psi />&lt;0</text>
        <text x={(x2F + xR) / 2} y={yAx + 22} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 9.5, fontWeight: 700 }}><Psi />&gt;2φ<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></text>
      </svg>
    </div>
  )
}
