/**
 * Configuration schematic (drawing #1): an npn BJT symbol with the three terminals
 * colour-coded by ROLE — input (sky), common (slate, tied to the ground rail) and
 * output (rose) — plus the two bias sources, matching the lecture sketches.
 *   CB: input = Emitter, common = Base, output = Collector.
 *   CE: input = Base,    common = Emitter, output = Collector.
 * Pure schematic.
 */
type Config = 'CB' | 'CE'
const W = 360
const H = 250
const SKY = '#0284c7'
const ROSE = '#e11d48'
const SLATE = '#475569'

/** Tiny battery (bias source) centred on (x,y), vertical, with a Tex-free label drawn separately. */
function Battery({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth={2}>
      <line x1={x - 9} y1={y - 5} x2={x + 9} y2={y - 5} />
      <line x1={x - 5} y1={y + 4} x2={x + 5} y2={y + 4} />
    </g>
  )
}

export default function ConfigSchematic({ config }: { config: Config }) {
  const cb = config === 'CB'
  // role per terminal
  const role = cb
    ? { E: 'in', B: 'common', C: 'out' }
    : { B: 'in', E: 'common', C: 'out' }
  const colOf = (r: string) => (r === 'in' ? SKY : r === 'out' ? ROSE : SLATE)

  // transistor symbol geometry (centre)
  const barX = 150, barTop = 86, barBot = 134, mid = (barTop + barBot) / 2
  const nodeX = 196, cTopY = 56, eBotY = 168
  const groundY = 214

  return (
    <div className="flex flex-col gap-2">
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <marker id="cs-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1,1 L9,5 L1,9 Z" fill={SLATE} />
            </marker>
          </defs>
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfcff" stroke="#eef2f7" />

          {/* ground (common) rail */}
          <line x1={36} y1={groundY} x2={W - 36} y2={groundY} stroke={SLATE} strokeWidth={2} />
          <text x={W - 32} y={groundY + 4} className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>⏚</text>

          {/* base lead + bar */}
          <line x1={96} y1={mid} x2={barX} y2={mid} stroke={colOf(role.B)} strokeWidth={2.5} />
          <line x1={barX} y1={barTop} x2={barX} y2={barBot} stroke={SLATE} strokeWidth={3} />
          {/* collector lead (up) */}
          <line x1={barX} y1={barTop + 8} x2={nodeX} y2={cTopY + 14} stroke={colOf(role.C)} strokeWidth={2.5} />
          <line x1={nodeX} y1={cTopY + 14} x2={nodeX} y2={cTopY} stroke={colOf(role.C)} strokeWidth={2.5} />
          {/* emitter lead (down) with npn arrow out */}
          <line x1={barX} y1={barBot - 8} x2={nodeX} y2={eBotY - 14} stroke={colOf(role.E)} strokeWidth={2.5} markerEnd="url(#cs-arr)" />
          <line x1={nodeX} y1={eBotY - 14} x2={nodeX} y2={eBotY} stroke={colOf(role.E)} strokeWidth={2.5} />

          {/* terminal letters */}
          <text x={nodeX + 10} y={cTopY + 2} className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C</text>
          <text x={88} y={mid + 4} textAnchor="end" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>B</text>
          <text x={nodeX + 10} y={eBotY} className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>E</text>

          {/* ---- wiring per configuration ---- */}
          {cb ? (
            <>
              {/* CB: emitter = input (left, down to input battery → ground); base = common → ground; collector = output → up → output battery → ground */}
              {/* emitter input branch */}
              <line x1={nodeX} y1={eBotY} x2={nodeX} y2={groundY - 40} stroke={SKY} strokeWidth={2} />
              <Battery x={nodeX} y={groundY - 30} color={SKY} />
              <line x1={nodeX} y1={groundY - 20} x2={nodeX} y2={groundY} stroke={SKY} strokeWidth={2} />
              {/* base common to ground */}
              <line x1={96} y1={mid} x2={70} y2={mid} stroke={SLATE} strokeWidth={2.5} />
              <line x1={70} y1={mid} x2={70} y2={groundY} stroke={SLATE} strokeWidth={2} />
              {/* collector output branch */}
              <line x1={nodeX} y1={cTopY} x2={300} y2={cTopY} stroke={ROSE} strokeWidth={2} />
              <line x1={300} y1={cTopY} x2={300} y2={groundY - 40} stroke={ROSE} strokeWidth={2} />
              <Battery x={300} y={groundY - 30} color={ROSE} />
              <line x1={300} y1={groundY - 20} x2={300} y2={groundY} stroke={ROSE} strokeWidth={2} />
              {/* source labels + currents */}
              <text x={nodeX - 14} y={groundY - 26} textAnchor="end" fill={SKY} style={{ fontSize: 11, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 8 }}>EB</tspan></text>
              <text x={300 + 14} y={groundY - 26} fill={ROSE} style={{ fontSize: 11, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 8 }}>CB</tspan></text>
            </>
          ) : (
            <>
              {/* CE: base = input (left, to input battery → ground); emitter = common → ground; collector = output → up → output battery → ground */}
              {/* base input branch */}
              <line x1={96} y1={mid} x2={64} y2={mid} stroke={SKY} strokeWidth={2.5} />
              <line x1={64} y1={mid} x2={64} y2={groundY - 40} stroke={SKY} strokeWidth={2} />
              <Battery x={64} y={groundY - 30} color={SKY} />
              <line x1={64} y1={groundY - 20} x2={64} y2={groundY} stroke={SKY} strokeWidth={2} />
              {/* emitter common to ground */}
              <line x1={nodeX} y1={eBotY} x2={nodeX} y2={groundY} stroke={SLATE} strokeWidth={2.5} />
              {/* collector output branch */}
              <line x1={nodeX} y1={cTopY} x2={300} y2={cTopY} stroke={ROSE} strokeWidth={2} />
              <line x1={300} y1={cTopY} x2={300} y2={groundY - 40} stroke={ROSE} strokeWidth={2} />
              <Battery x={300} y={groundY - 30} color={ROSE} />
              <line x1={300} y1={groundY - 20} x2={300} y2={groundY} stroke={ROSE} strokeWidth={2} />
              <text x={64 - 14} y={groundY - 26} textAnchor="end" fill={SKY} style={{ fontSize: 11, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 8 }}>BE</tspan></text>
              <text x={300 + 14} y={groundY - 26} fill={ROSE} style={{ fontSize: 11, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 8 }}>CE</tspan></text>
            </>
          )}
        </svg>
      </div>
      {/* role legend */}
      <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold">
        <span className="rounded-full px-2.5 py-1" style={{ background: '#e0f2fe', color: SKY }}>כניסה · {cb ? 'פולט E' : 'בסיס B'}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">משותף · {cb ? 'בסיס B' : 'פולט E'}</span>
        <span className="rounded-full px-2.5 py-1" style={{ background: '#ffe4e6', color: ROSE }}>מוצא · קולט C</span>
      </div>
    </div>
  )
}
