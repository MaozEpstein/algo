/**
 * BJT cross-section for one type (npn or pnp): three doped slabs E | B | C with the
 * base drawn deliberately THIN, the doping ordering N_E ≫ N_B > N_C annotated above,
 * and the three terminals led out to CIRCLED letter-badges (E/B/C, accent colour) with
 * their Hebrew names. The two junction labels sit centred on their own guide lines, in
 * device order E-B (left) and B-C (right). The schematic SYMBOL is a separate
 * component (BjtSymbol). Pure schematic.
 */
interface Props {
  kind: 'npn' | 'pnp'
}

const W = 540
const H = 226
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const VIO = '#7c3aed'

const xE0 = 84
const xEB = 222 // emitter | base
const xBC = 264 // base | collector  (thin base)
const xC1 = 470
const yTop = 74
const yBot = 152
const mid = (yTop + yBot) / 2
const xB = (xEB + xBC) / 2

function Badge({ cx, cy, letter }: { cx: number; cy: number; letter: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={11} fill={VIO} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" style={{ fontSize: 13, fontWeight: 800 }}>{letter}</text>
    </>
  )
}

export default function BjtStructure({ kind }: Props) {
  const npn = kind === 'npn'
  const letters = npn ? ['N', 'P', 'N'] : ['P', 'N', 'P']
  const colE = npn ? SKY : ROSE
  const colB = npn ? ROSE : SKY

  const regions = [
    { x0: xE0, x1: xEB, letter: letters[0], col: colE, op: 0.2 },
    { x0: xEB, x1: xBC, letter: letters[1], col: colB, op: 0.18 },
    { x0: xBC, x1: xC1, letter: letters[2], col: colE, op: 0.1 },
  ]
  const doping = [
    { x: (xE0 + xEB) / 2, sub: 'E', tail: '≫' },
    { x: xB, sub: 'B', tail: '>' },
    { x: (xBC + xC1) / 2, sub: 'C', tail: '' },
  ]

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* junction guides + labels — each centred on its own line, device order E-B | B-C */}
        <line x1={xEB} y1={32} x2={xEB} y2={yTop} stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 2" />
        <text x={xEB - 5} y={27} textAnchor="end" className="fill-violet-500" style={{ fontSize: 10.5, fontWeight: 700 }}>צומת B-E</text>
        <line x1={xBC} y1={32} x2={xBC} y2={yTop} stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 2" />
        <text x={xBC + 5} y={27} textAnchor="start" className="fill-violet-500" style={{ fontSize: 10.5, fontWeight: 700 }}>צומת C-B</text>

        {/* doping ordering */}
        {doping.map((d, i) => (
          <text key={i} x={d.x} y={yTop - 10} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12.5, fontWeight: 700 }}>
            N<tspan dy={3} style={{ fontSize: 8.5 }}>{d.sub}</tspan>{d.tail && <tspan dy={-3} dx={2}>{d.tail}</tspan>}
          </text>
        ))}

        {/* slab regions */}
        {regions.map((r, i) => (
          <g key={i}>
            <rect x={r.x0} y={yTop} width={r.x1 - r.x0} height={yBot - yTop} fill={r.col} fillOpacity={r.op} stroke={r.col} strokeOpacity={0.5} strokeWidth={1} />
            <text x={(r.x0 + r.x1) / 2} y={mid + 9} textAnchor="middle" fill={r.col} style={{ fontSize: i === 1 ? 20 : 27, fontWeight: 800 }}>{r.letter}</text>
          </g>
        ))}

        {/* terminals → circled letter-badges + Hebrew names */}
        {/* emitter (left) */}
        <line x1={xE0} y1={mid} x2={42} y2={mid} stroke="#475569" strokeWidth={2} />
        <text x={28} y={mid - 18} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>פולט</text>
        <Badge cx={28} cy={mid} letter="E" />
        {/* collector (right) */}
        <line x1={xC1} y1={mid} x2={W - 42} y2={mid} stroke="#475569" strokeWidth={2} />
        <text x={W - 28} y={mid - 18} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>קולט</text>
        <Badge cx={W - 28} cy={mid} letter="C" />
        {/* base (down) */}
        <line x1={xB} y1={yBot} x2={xB} y2={yBot + 22} stroke="#475569" strokeWidth={2} />
        <Badge cx={xB} cy={yBot + 34} letter="B" />
        <text x={xB} y={yBot + 56} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>בסיס</text>
      </svg>
    </div>
  )
}
