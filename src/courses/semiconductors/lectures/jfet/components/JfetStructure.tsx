/**
 * n-channel JFET cross-section: a horizontal n-type channel running Source (left) →
 * Drain (right), squeezed between two p⁺ gate slabs (tied together to the gate G). The
 * gate-channel junctions are reverse-biased in use, so their depletion regions pinch the
 * channel. Pure schematic (mirrors the BjtStructure/ScrStructure drawing style).
 */
const W = 440
const H = 250
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const VIO = '#7c3aed'

const xCh0 = 80
const xCh1 = 360
const yChTop = 110
const yChBot = 150
const xG0 = 150
const xG1 = 290
const yMid = (yChTop + yChBot) / 2

function Badge({ cx, cy, letter }: { cx: number; cy: number; letter: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={12} fill={VIO} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" style={{ fontSize: 13, fontWeight: 800 }}>{letter}</text>
    </>
  )
}

export default function JfetStructure() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* n-channel */}
        <rect x={xCh0} y={yChTop} width={xCh1 - xCh0} height={yChBot - yChTop} fill={SKY} fillOpacity={0.18} stroke={SKY} strokeOpacity={0.5} strokeWidth={1} />
        <text x={(xCh0 + xCh1) / 2} y={yMid + 5} textAnchor="middle" fill={SKY} style={{ fontSize: 15, fontWeight: 800 }}>n — תעלה<tspan dx={6} style={{ fontSize: 11 }}>(N</tspan><tspan dy={3} style={{ fontSize: 8 }}>D</tspan><tspan dy={-3} style={{ fontSize: 11 }}>)</tspan></text>

        {/* p⁺ gate slabs (top + bottom) */}
        {[{ y: 60, label: 'p⁺' }, { y: yChBot, label: 'p⁺' }].map((g) => (
          <g key={g.y}>
            <rect x={xG0} y={g.y} width={xG1 - xG0} height={50} fill={ROSE} fillOpacity={0.2} stroke={ROSE} strokeOpacity={0.5} strokeWidth={1} />
            <text x={(xG0 + xG1) / 2} y={g.y + 32} textAnchor="middle" fill={ROSE} style={{ fontSize: 17, fontWeight: 800 }}>p⁺</text>
          </g>
        ))}

        {/* gates tied together (left wire) + gate terminal up top */}
        <line x1={xG0} y1={85} x2={120} y2={85} stroke="#475569" strokeWidth={2} />
        <line x1={120} y1={85} x2={120} y2={175} stroke="#475569" strokeWidth={2} />
        <line x1={xG0} y1={175} x2={120} y2={175} stroke="#475569" strokeWidth={2} />
        <line x1={(xG0 + xG1) / 2} y1={60} x2={(xG0 + xG1) / 2} y2={34} stroke="#475569" strokeWidth={2} />
        <Badge cx={(xG0 + xG1) / 2} cy={24} letter="G" />
        <text x={(xG0 + xG1) / 2 + 20} y={22} textAnchor="start" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>שער</text>

        {/* source (left) + drain (right) */}
        <line x1={xCh0} y1={yMid} x2={44} y2={yMid} stroke="#475569" strokeWidth={2} />
        <Badge cx={32} cy={yMid} letter="S" />
        <text x={32} y={yMid - 18} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>מקור</text>
        <line x1={xCh1} y1={yMid} x2={W - 44} y2={yMid} stroke="#475569" strokeWidth={2} />
        <Badge cx={W - 32} cy={yMid} letter="D" />
        <text x={W - 32} y={yMid - 18} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>ניקוז</text>

        <text x={(xCh0 + xCh1) / 2} y={H - 14} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10.5 }}>שני שערי-ה-p⁺ מחוברים יחד; הצומת gate-תעלה מוטה אחורה ומדלדל את התעלה</text>
      </svg>
    </div>
  )
}
