/**
 * SCR cross-section: a vertical four-layer P-N-P-N stack — anode A on top (P₂),
 * cathode K on the bottom (N₁), and the gate G on the inner P₁ layer. The three
 * junctions J₁ (P₂-N₂), J₂ (N₂-P₁) and J₃ (P₁-N₁) are marked on the right; J₂ is the
 * one that blocks in the forward-off state. Pure schematic (mirrors BjtStructure, vertical).
 */
const W = 360
const H = 360
const ROSE = '#f43f5e'
const SKY = '#0ea5e9'
const VIO = '#7c3aed'

const colX = 130 // column left
const colW = 100
const yTop = 44
const layerH = 62
const ys = [yTop, yTop + layerH, yTop + 2 * layerH, yTop + 3 * layerH, yTop + 4 * layerH]

const LAYERS = [
  { letter: 'P', sub: '2', col: ROSE },
  { letter: 'N', sub: '2', col: SKY },
  { letter: 'P', sub: '1', col: ROSE },
  { letter: 'N', sub: '1', col: SKY },
]
const JUNCS = [
  { y: ys[1], label: 'J₁' },
  { y: ys[2], label: 'J₂' },
  { y: ys[3], label: 'J₃' },
]

function Badge({ cx, cy, letter }: { cx: number; cy: number; letter: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={12} fill={VIO} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" style={{ fontSize: 13, fontWeight: 800 }}>{letter}</text>
    </>
  )
}

export default function ScrStructure() {
  const cx = colX + colW / 2
  const yP1mid = (ys[2] + ys[3]) / 2 // gate attaches to P₁
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* four doped layers */}
        {LAYERS.map((l, i) => (
          <g key={i}>
            <rect x={colX} y={ys[i]} width={colW} height={layerH} fill={l.col} fillOpacity={i % 2 === 0 ? 0.2 : 0.14} stroke={l.col} strokeOpacity={0.5} strokeWidth={1} />
            <text x={cx} y={(ys[i] + ys[i + 1]) / 2 + 9} textAnchor="middle" fill={l.col} style={{ fontSize: 24, fontWeight: 800 }}>
              {l.letter}<tspan dy={6} style={{ fontSize: 13 }}>{l.sub}</tspan>
            </text>
          </g>
        ))}

        {/* junction guide lines + labels (right) */}
        {JUNCS.map((j) => (
          <g key={j.label}>
            <line x1={colX + colW} y1={j.y} x2={colX + colW + 70} y2={j.y} stroke="#f43f5e" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={colX + colW + 74} y={j.y + 4} textAnchor="start" className="fill-rose-500" style={{ fontSize: 13, fontWeight: 800 }}>{j.label}</text>
          </g>
        ))}

        {/* anode A (top, +) */}
        <line x1={cx} y1={yTop} x2={cx} y2={yTop - 24} stroke="#475569" strokeWidth={2} />
        <Badge cx={cx} cy={yTop - 34} letter="A" />
        <text x={cx + 20} y={yTop - 31} textAnchor="start" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>אנודה +</text>

        {/* cathode K (bottom, −) */}
        <line x1={cx} y1={ys[4]} x2={cx} y2={ys[4] + 24} stroke="#475569" strokeWidth={2} />
        <Badge cx={cx} cy={ys[4] + 34} letter="K" />
        <text x={cx + 20} y={ys[4] + 37} textAnchor="start" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>קתודה −</text>

        {/* gate G (left, on P₁) */}
        <line x1={colX} y1={yP1mid} x2={colX - 40} y2={yP1mid} stroke="#475569" strokeWidth={2} />
        <Badge cx={colX - 52} cy={yP1mid} letter="G" />
        <text x={colX - 52} y={yP1mid - 18} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>שער</text>
      </svg>
    </div>
  )
}
