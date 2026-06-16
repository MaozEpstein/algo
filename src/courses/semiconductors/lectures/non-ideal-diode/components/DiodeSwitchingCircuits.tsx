/**
 * Faithful static reproductions of the circuit schematics in תרגול 3 (diode
 * switching). Clean SVG, standard symbols (resistor zig-zag, battery, diode
 * triangle+bar, capacitor plates). KaTeX-style labels are drawn as SVG text.
 *  - BiasCircuit     : V_DD — R — diode loop (parts א/ב)
 *  - SmallSignalModel: r_D ∥ C_dep ∥ C_diff small-signal model (part ג)
 *  - SwitchCircuit   : SPDT switch between (R_F,V_F) and (R_R,V_R) (part ה)
 */
const STROKE = '#334155'

/** A horizontal resistor zig-zag from (x,y) spanning width w. */
function ResistorH({ x, y, w = 56 }: { x: number; y: number; w?: number }) {
  const seg = w / 6
  const z = 7
  const pts = [
    `${x},${y}`,
    `${x + seg / 2},${y}`,
    `${x + seg},${y - z}`,
    `${x + 2 * seg},${y + z}`,
    `${x + 3 * seg},${y - z}`,
    `${x + 4 * seg},${y + z}`,
    `${x + 5 * seg},${y - z}`,
    `${x + 5.5 * seg},${y}`,
    `${x + w},${y}`,
  ].join(' ')
  return <polyline points={pts} fill="none" stroke={STROKE} strokeWidth={2} />
}

/** A vertical resistor zig-zag from (x,y) spanning height h. */
function ResistorV({ x, y, h = 56 }: { x: number; y: number; h?: number }) {
  const seg = h / 6
  const z = 7
  const pts = [
    `${x},${y}`,
    `${x},${y + seg / 2}`,
    `${x - z},${y + seg}`,
    `${x + z},${y + 2 * seg}`,
    `${x - z},${y + 3 * seg}`,
    `${x + z},${y + 4 * seg}`,
    `${x - z},${y + 5 * seg}`,
    `${x},${y + 5.5 * seg}`,
    `${x},${y + h}`,
  ].join(' ')
  return <polyline points={pts} fill="none" stroke={STROKE} strokeWidth={2} />
}

/** A battery symbol (long + short plate pair) centered vertically at (x,y). */
function BatteryV({ x, y }: { x: number; y: number }) {
  return (
    <>
      <line x1={x - 12} y1={y - 5} x2={x + 12} y2={y - 5} stroke={STROKE} strokeWidth={2.5} />
      <line x1={x - 6} y1={y + 4} x2={x + 6} y2={y + 4} stroke={STROKE} strokeWidth={2.5} />
    </>
  )
}

/** A diode pointing down (anode top → cathode bottom). */
function DiodeV({ x, y, size = 14 }: { x: number; y: number; size?: number }) {
  return (
    <>
      <polygon points={`${x - size},${y - size} ${x + size},${y - size} ${x},${y + size * 0.7}`} fill="none" stroke={STROKE} strokeWidth={2} />
      <line x1={x - size} y1={y + size * 0.7} x2={x + size} y2={y + size * 0.7} stroke={STROKE} strokeWidth={2.5} />
    </>
  )
}

/** Small label helper (KaTeX-style subscripts via tspan). */
function Lbl({ x, y, anchor = 'start', children }: { x: number; y: number; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={anchor} style={{ fontSize: 14, fontWeight: 600, fill: STROKE }}>
      {children}
    </text>
  )
}
const sub = (s: string) => <tspan dy={3} style={{ fontSize: 10 }}>{s}</tspan>
const unsub = <tspan dy={-3} />

export function BiasCircuit() {
  // rectangle loop: left battery, top resistor, right diode
  const L = 70, R = 330, T = 50, B = 180
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox="0 0 400 220" className="mx-auto w-full" style={{ maxWidth: 400 }}>
        {/* wires */}
        <polyline points={`${L},${T} ${R},${T}`} fill="none" stroke={STROKE} strokeWidth={2} />
        <polyline points={`${L},${B} ${R},${B}`} fill="none" stroke={STROKE} strokeWidth={2} />
        <line x1={L} y1={T} x2={L} y2={95} stroke={STROKE} strokeWidth={2} />
        <line x1={L} y1={115} x2={L} y2={B} stroke={STROKE} strokeWidth={2} />
        <line x1={R} y1={T} x2={R} y2={70} stroke={STROKE} strokeWidth={2} />
        <line x1={R} y1={98} x2={R} y2={B} stroke={STROKE} strokeWidth={2} />
        {/* V_DD battery (left) */}
        <BatteryV x={L} y={105} />
        <Lbl x={L - 18} y={109} anchor="end">V{sub('DD')}</Lbl>
        {/* R resistor (top) */}
        <ResistorH x={170} y={T} w={60} />
        <Lbl x={200} y={T - 12} anchor="middle">R = 1{unsub}kΩ</Lbl>
        {/* diode (right) */}
        <DiodeV x={R} y={84} />
        <Lbl x={R + 16} y={88}>דיודה</Lbl>
        {/* nodes */}
        {[[L, T], [R, T], [L, B], [R, B]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.6} fill={STROKE} />
        ))}
      </svg>
    </div>
  )
}

export function SmallSignalModel() {
  // three parallel branches between a top rail and bottom rail
  const T = 40, B = 150
  const xs = [90, 190, 290]
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox="0 0 380 200" className="mx-auto w-full" style={{ maxWidth: 380 }}>
        {/* rails */}
        <line x1={50} y1={T} x2={330} y2={T} stroke={STROKE} strokeWidth={2} />
        <line x1={50} y1={B} x2={330} y2={B} stroke={STROKE} strokeWidth={2} />
        {/* terminals */}
        <line x1={40} y1={T} x2={50} y2={T} stroke={STROKE} strokeWidth={2} />
        <line x1={40} y1={B} x2={50} y2={B} stroke={STROKE} strokeWidth={2} />
        <circle cx={40} cy={T} r={3.5} fill="none" stroke={STROKE} strokeWidth={2} />
        <circle cx={40} cy={B} r={3.5} fill="none" stroke={STROKE} strokeWidth={2} />

        {/* branch 1: r_D (resistor) */}
        <line x1={xs[0]} y1={T} x2={xs[0]} y2={62} stroke={STROKE} strokeWidth={2} />
        <ResistorV x={xs[0]} y={62} h={48} />
        <line x1={xs[0]} y1={110} x2={xs[0]} y2={B} stroke={STROKE} strokeWidth={2} />
        <Lbl x={xs[0] + 14} y={90}>r{sub('D')}</Lbl>

        {/* branches 2,3: capacitors C_dep, C_diff */}
        {[
          { x: xs[1], label: <>C{sub('dep')}</> },
          { x: xs[2], label: <>C{sub('diff')}</> },
        ].map((b, i) => (
          <g key={i}>
            <line x1={b.x} y1={T} x2={b.x} y2={80} stroke={STROKE} strokeWidth={2} />
            <line x1={b.x - 13} y1={80} x2={b.x + 13} y2={80} stroke={STROKE} strokeWidth={2.5} />
            <line x1={b.x - 13} y1={92} x2={b.x + 13} y2={92} stroke={STROKE} strokeWidth={2.5} />
            <line x1={b.x} y1={92} x2={b.x} y2={B} stroke={STROKE} strokeWidth={2} />
            <Lbl x={b.x + 17} y={90}>{b.label}</Lbl>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function SwitchCircuit() {
  // SPDT switch (thrown to pos 2 = reverse): common pole → diode; two source legs.
  const C1 = 90, C2 = 175 // source columns
  const CONTACT = 66 // contact-circle y
  const PIVOT_X = 250, PIVOT_Y = 132
  const TOP = 45, BOT = 215, DX = 380
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox="0 0 440 250" className="mx-auto w-full" style={{ maxWidth: 440 }}>
        {/* two source legs: contact → R → V → bottom rail */}
        {[
          { x: C1, rLabel: <>R{sub('F')}</>, rVal: '1 kΩ', vLabel: <>V{sub('F')}</>, pos: '1' },
          { x: C2, rLabel: <>R{sub('R')}</>, rVal: '2 kΩ', vLabel: <>V{sub('R')}</>, pos: '2' },
        ].map((b, i) => (
          <g key={i}>
            <text x={b.x} y={CONTACT - 14} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: '#7c3aed' }}>{b.pos}</text>
            <circle cx={b.x} cy={CONTACT} r={3.5} fill="white" stroke={STROKE} strokeWidth={1.8} />
            <line x1={b.x} y1={CONTACT + 4} x2={b.x} y2={84} stroke={STROKE} strokeWidth={2} />
            <ResistorV x={b.x} y={84} h={42} />
            <line x1={b.x} y1={126} x2={b.x} y2={148} stroke={STROKE} strokeWidth={2} />
            <BatteryV x={b.x} y={158} />
            <line x1={b.x} y1={163} x2={b.x} y2={BOT} stroke={STROKE} strokeWidth={2} />
            <Lbl x={b.x - 14} y={101} anchor="end">{b.rLabel}</Lbl>
            <text x={b.x - 14} y={117} textAnchor="end" style={{ fontSize: 12, fontWeight: 600, fill: STROKE }}>= {b.rVal}</text>
            <Lbl x={b.x - 14} y={163} anchor="end">{b.vLabel}</Lbl>
          </g>
        ))}

        {/* common pole: vertical to top rail, plus the arm thrown onto contact 2 */}
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={PIVOT_X} y2={TOP} stroke={STROKE} strokeWidth={2} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={3.4} fill={STROKE} />
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={C2 + 2} y2={CONTACT + 6} stroke={STROKE} strokeWidth={2.4} strokeLinecap="round" />

        {/* top rail → diode → bottom rail */}
        <line x1={PIVOT_X} y1={TOP} x2={DX} y2={TOP} stroke={STROKE} strokeWidth={2} />
        <line x1={DX} y1={TOP} x2={DX} y2={70} stroke={STROKE} strokeWidth={2} />
        <DiodeV x={DX} y={84} />
        <line x1={DX} y1={98} x2={DX} y2={BOT} stroke={STROKE} strokeWidth={2} />
        <Lbl x={DX + 16} y={88}>דיודה</Lbl>

        {/* shared bottom rail */}
        <line x1={C1} y1={BOT} x2={DX} y2={BOT} stroke={STROKE} strokeWidth={2} />
        {[[C1, BOT], [C2, BOT], [DX, BOT]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.4} fill={STROKE} />
        ))}
      </svg>
    </div>
  )
}
