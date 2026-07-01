/**
 * Labeled MOSFET cross-section (pure SVG), NMOS or PMOS. Shows the four terminals
 * (Source / Gate / Drain / Body), the gate metal + thin oxide, the two heavily-doped
 * source/drain wells in the oppositely-doped substrate, and — when `showChannel` — the
 * inversion channel that bridges source↔drain. The channel length L is marked with a
 * double-headed dimension arrow (course standard for measurements).
 */
const W = 540
const H = 300

export default function MosfetStructure({
  type = 'nmos',
  showChannel = true,
}: {
  type?: 'nmos' | 'pmos'
  showChannel?: boolean
}) {
  const isN = type === 'nmos'
  const wellLabel = isN ? 'n⁺' : 'p⁺'
  const subLabel = isN ? 'p-sub' : 'n-well'
  const subFill = isN ? '#fce7f3' : '#dbeafe' // p → rose, n → blue
  const subStroke = isN ? '#f9a8d4' : '#93c5fd'
  const wellFill = isN ? '#bfdbfe' : '#fbcfe8'
  const wellStroke = isN ? '#60a5fa' : '#f472b6'
  const channelFill = isN ? '#a7f3d0' : '#fdba74'
  const carrier = isN ? 'אלקטרונים' : 'חורים'

  // geometry
  const subX = 40
  const subW = 460
  const subTop = 150
  const subBot = 262
  const wellW = 96
  const wellTop = subTop
  const wellH = 54
  const srcX = subX + 26
  const drnX = subX + subW - 26 - wellW
  const oxTop = 118
  const oxH = 12
  const oxX = srcX + wellW - 6
  const oxRight = drnX + 6
  const oxW = oxRight - oxX
  const gateH = 26
  const chanX1 = srcX + wellW
  const chanX2 = drnX

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="mfArrow" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M1,1 L5,4.5 L1,8" fill="none" stroke="#0f766e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

        {/* substrate */}
        <rect x={subX} y={subTop} width={subW} height={subBot - subTop} rx={5} fill={subFill} stroke={subStroke} strokeWidth={1.5} />
        <text x={subX + subW - 10} y={subBot - 12} textAnchor="end" style={{ fontSize: 12, fontWeight: 700, fill: '#9d174d' }}>{subLabel}</text>

        {/* source & drain wells */}
        {[srcX, drnX].map((x, i) => (
          <g key={i}>
            <rect x={x} y={wellTop} width={wellW} height={wellH} rx={4} fill={wellFill} stroke={wellStroke} strokeWidth={1.5} />
            <text x={x + wellW / 2} y={wellTop + 32} textAnchor="middle" style={{ fontSize: 15, fontWeight: 800, fill: '#1d4ed8' }}>{wellLabel}</text>
          </g>
        ))}

        {/* channel (inversion layer) */}
        {showChannel && (
          <>
            <rect x={chanX1} y={subTop} width={chanX2 - chanX1} height={7} fill={channelFill} stroke={wellStroke} strokeWidth={0.75} strokeDasharray="3 2" />
            <text x={(chanX1 + chanX2) / 2} y={subTop + 24} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 700, fill: '#047857' }}>ערוץ מוליך ({carrier})</text>
          </>
        )}

        {/* gate oxide + gate metal */}
        <rect x={oxX} y={oxTop} width={oxW} height={oxH} fill="#fde68a" stroke="#f59e0b" strokeWidth={1} />
        <text x={oxX + oxW + 4} y={oxTop + oxH} textAnchor="start" style={{ fontSize: 8.5, fontWeight: 700, fill: '#b45309' }}>oxide</text>
        <rect x={oxX - 4} y={oxTop - gateH} width={oxW + 8} height={gateH} rx={3} fill="#cbd5e1" stroke="#64748b" strokeWidth={1.25} />
        {/* diagonal hatch on gate metal */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={oxX + 2 + i * (oxW / 7)} y1={oxTop - gateH + 2} x2={oxX + 2 + i * (oxW / 7) - 12} y2={oxTop - 2} stroke="#94a3b8" strokeWidth={0.75} />
        ))}

        {/* terminals */}
        {(() => {
          const term = (x: number, label: string, sub?: string) => (
            <g key={label}>
              <line x1={x} y1={60} x2={x} y2={oxTop - gateH} stroke="#334155" strokeWidth={1.5} />
              <circle cx={x} cy={60} r={3.5} fill="#334155" />
              <text x={x} y={52} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, fill: '#0f172a' }}>{label}</text>
              {sub && <text x={x} y={40} textAnchor="middle" style={{ fontSize: 9, fill: '#64748b' }}>{sub}</text>}
            </g>
          )
          return (
            <>
              {term(srcX + wellW / 2, 'S', 'Source')}
              {term(oxX + oxW / 2, 'G', 'Gate')}
              {term(drnX + wellW / 2, 'D', 'Drain')}
            </>
          )
        })()}
        {/* body terminal at the bottom */}
        <line x1={subX + subW / 2} y1={subBot} x2={subX + subW / 2} y2={subBot + 18} stroke="#334155" strokeWidth={1.5} />
        <circle cx={subX + subW / 2} cy={subBot + 18} r={3.5} fill="#334155" />
        <text x={subX + subW / 2 + 12} y={subBot + 22} textAnchor="start" style={{ fontSize: 13, fontWeight: 800, fill: '#0f172a' }}>B</text>

        {/* channel-length dimension arrow (double-headed) */}
        <line x1={chanX1} y1={subTop + 40} x2={chanX2} y2={subTop + 40} stroke="#0f766e" strokeWidth={1.4} markerStart="url(#mfArrow)" markerEnd="url(#mfArrow)" />
        <text x={(chanX1 + chanX2) / 2} y={subTop + 54} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: '#0f766e' }}>L</text>
      </svg>
    </div>
  )
}
