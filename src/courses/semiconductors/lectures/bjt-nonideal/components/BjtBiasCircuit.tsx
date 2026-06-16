/**
 * Faithful static reproduction of the תרגול-6 bias circuit (part ד): an npn in a
 * voltage-divider-less base bias — V_BB through R_B into the base, R_C up to V_CC
 * at the collector, and a shared emitter resistor R_E. Currents I_B/I_C/I_E and
 * the junction voltages V_BE/V_BC/V_CE are labeled. Pure SVG.
 */
const STROKE = '#334155'
const AMBER = '#d97706'

function ResistorH({ x, y, w = 46 }: { x: number; y: number; w?: number }) {
  const s = w / 6, z = 6
  const p = [`${x},${y}`, `${x + s / 2},${y}`, `${x + s},${y - z}`, `${x + 2 * s},${y + z}`, `${x + 3 * s},${y - z}`, `${x + 4 * s},${y + z}`, `${x + 5 * s},${y - z}`, `${x + 5.5 * s},${y}`, `${x + w},${y}`].join(' ')
  return <polyline points={p} fill="none" stroke={STROKE} strokeWidth={2} />
}
function ResistorV({ x, y, h = 46 }: { x: number; y: number; h?: number }) {
  const s = h / 6, z = 6
  const p = [`${x},${y}`, `${x},${y + s / 2}`, `${x - z},${y + s}`, `${x + z},${y + 2 * s}`, `${x - z},${y + 3 * s}`, `${x + z},${y + 4 * s}`, `${x - z},${y + 5 * s}`, `${x},${y + 5.5 * s}`, `${x},${y + h}`].join(' ')
  return <polyline points={p} fill="none" stroke={STROKE} strokeWidth={2} />
}
function BatteryV({ x, y }: { x: number; y: number }) {
  return (
    <>
      <line x1={x - 12} y1={y - 5} x2={x + 12} y2={y - 5} stroke={STROKE} strokeWidth={2.5} />
      <line x1={x - 6} y1={y + 4} x2={x + 6} y2={y + 4} stroke={STROKE} strokeWidth={2.5} />
    </>
  )
}
const sub = (s: string) => <tspan dy={3} style={{ fontSize: 9 }}>{s}</tspan>

export default function BjtBiasCircuit() {
  const BX = 250 // transistor base bar x
  const BarT = 80, BarB = 150 // base bar
  const yTop = 30, yBot = 250
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox="0 0 440 280" className="mx-auto w-full" style={{ maxWidth: 440 }}>
        <defs>
          <marker id="bc-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={STROKE} /></marker>
        </defs>

        {/* ── transistor symbol (npn) ── */}
        <line x1={BX} y1={BarT} x2={BX} y2={BarB} stroke={STROKE} strokeWidth={3} />
        {/* collector branch up */}
        <line x1={BX} y1={BarT + 12} x2={BX + 46} y2={BarT - 6} stroke={STROKE} strokeWidth={2} />
        <line x1={BX + 46} y1={BarT - 6} x2={BX + 46} y2={yTop} stroke={STROKE} strokeWidth={2} />
        {/* emitter branch down (arrow out = npn) */}
        <line x1={BX} y1={BarB - 12} x2={BX + 46} y2={BarB + 6} stroke={STROKE} strokeWidth={2} markerEnd="url(#bc-ar)" />
        <line x1={BX + 46} y1={BarB + 6} x2={BX + 46} y2={185} stroke={STROKE} strokeWidth={2} />

        {/* ── base input: V_BB — R_B — base ── */}
        <line x1={BX} y1={115} x2={150} y2={115} stroke={STROKE} strokeWidth={2} />
        <ResistorH x={150} y={115} w={46} />
        <text x={173} y={104} textAnchor="middle" style={{ fontSize: 12, fontWeight: 600, fill: STROKE }}>R{sub('B')}</text>
        <line x1={150} y1={115} x2={70} y2={115} stroke={STROKE} strokeWidth={2} />
        <line x1={70} y1={115} x2={70} y2={200} stroke={STROKE} strokeWidth={2} />
        <BatteryV x={70} y={210} />
        <text x={52} y={214} textAnchor="end" style={{ fontSize: 12, fontWeight: 600, fill: STROKE }}>V{sub('BB')}</text>
        <line x1={70} y1={215} x2={70} y2={yBot} stroke={STROKE} strokeWidth={2} />
        {/* I_B arrow */}
        <line x1={205} y1={108} x2={228} y2={108} stroke={STROKE} strokeWidth={1.4} markerEnd="url(#bc-ar)" />
        <text x={216} y={100} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: STROKE }}>I{sub('B')}</text>

        {/* ── collector: R_C up to V_CC ── */}
        <ResistorV x={BX + 46} y={yTop} h={42} />
        <text x={BX + 62} y={yTop + 24} style={{ fontSize: 12, fontWeight: 600, fill: STROKE }}>R{sub('C')}</text>
        <line x1={BX + 46} y1={yTop} x2={BX + 46} y2={20} stroke={STROKE} strokeWidth={2} />
        <line x1={BX + 46} y1={20} x2={370} y2={20} stroke={STROKE} strokeWidth={2} />
        <line x1={370} y1={20} x2={370} y2={205} stroke={STROKE} strokeWidth={2} />
        <BatteryV x={370} y={215} />
        <text x={388} y={219} style={{ fontSize: 12, fontWeight: 600, fill: STROKE }}>V{sub('CC')}</text>
        <line x1={370} y1={220} x2={370} y2={yBot} stroke={STROKE} strokeWidth={2} />
        {/* I_C arrow */}
        <line x1={BX + 46} y1={86} x2={BX + 46} y2={70} stroke={STROKE} strokeWidth={1.4} markerEnd="url(#bc-ar)" />
        <text x={BX + 58} y={80} style={{ fontSize: 11, fontWeight: 600, fill: STROKE }}>I{sub('C')}</text>

        {/* ── emitter: R_E down to ground rail ── */}
        <ResistorV x={BX + 46} y={185} h={42} />
        <text x={BX + 62} y={209} style={{ fontSize: 12, fontWeight: 600, fill: STROKE }}>R{sub('E')}</text>
        <line x1={BX + 46} y1={227} x2={BX + 46} y2={yBot} stroke={STROKE} strokeWidth={2} />
        {/* I_E arrow */}
        <line x1={BX + 46} y1={178} x2={BX + 46} y2={194} stroke={STROKE} strokeWidth={1.4} markerEnd="url(#bc-ar)" />
        <text x={BX + 58} y={190} style={{ fontSize: 11, fontWeight: 600, fill: STROKE }}>I{sub('E')}</text>

        {/* ground rail */}
        <line x1={70} y1={yBot} x2={370} y2={yBot} stroke={STROKE} strokeWidth={2} />

        {/* junction-voltage labels */}
        <text x={BX - 8} y={108} textAnchor="end" style={{ fontSize: 11, fontWeight: 600, fill: AMBER }}>V{sub('BE')}</text>
        <text x={BX + 70} y={120} style={{ fontSize: 11, fontWeight: 600, fill: AMBER }}>V{sub('CE')}</text>
      </svg>
    </div>
  )
}
