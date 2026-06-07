/**
 * Two-junction npn band diagram along E-B-C, in equilibrium OR forward-active.
 * The conduction band E_c forms a HUMP over the p-base (a barrier at each junction).
 * In forward-active the emitter bands are raised by V_BE → the E-B barrier is
 * LOWERED (electrons injected over it), and the collector bands are pulled down by
 * the reverse V_BC → the B-C side is a steep downhill that COLLECTS whatever diffused
 * across the thin base. One geometry engine; the mode only changes two shifts.
 * Conventions: E_c sky, E_v rose, E_F slate-dashed; tspan subscripts; dir=ltr.
 */
interface Props {
  mode: 'eq' | 'active'
}

const W = 600
const H = 300
const MX = 22
const MR = 42
const TOP = 42
const BOT = 46
const PR = W - MR
const PW = PR - MX
const PLOT_H = H - TOP - BOT
const yBot = TOP + PLOT_H

const EG = 1.12
const XN = 0.16 // E_c − E_F in the n-regions
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const VIOLET = '#7c3aed'
const EMERALD = '#10b981'
const GLOW_C = 'drop-shadow(0 1.5px 2px rgba(14,165,233,0.28))'
const GLOW_V = 'drop-shadow(0 1.5px 2px rgba(244,63,94,0.25))'

// region boundaries as fractions of the plot width
const fE = 0.23 // emitter flat ends
const fEBd = 0.33 // E-B depletion ends
const fB = 0.47 // base flat ends
const fBCd = 0.59 // B-C depletion ends
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * smooth(Math.min(1, Math.max(0, t)))

export default function BjtBandDiagram({ mode }: Props) {
  const active = mode === 'active'
  const emShift = active ? 0.5 : 0 // V_BE raises emitter bands
  const colShift = active ? -0.65 : 0 // reverse V_BC pulls collector bands down

  const ecE = XN + emShift
  const ecBase = EG - XN // 0.96
  const ecC = XN + colShift

  const ecAt = (f: number): number => {
    if (f <= fE) return ecE
    if (f <= fEBd) return lerp(ecE, ecBase, (f - fE) / (fEBd - fE))
    if (f <= fB) return ecBase
    if (f <= fBCd) return lerp(ecBase, ecC, (f - fB) / (fBCd - fB))
    return ecC
  }
  const eFAt = (f: number): number => {
    if (f <= fE) return emShift
    if (f <= fEBd) return lerp(emShift, 0, (f - fE) / (fEBd - fE))
    if (f <= fB) return 0
    if (f <= fBCd) return lerp(0, colShift, (f - fB) / (fBCd - fB))
    return colShift
  }

  const eHi = Math.max(ecBase, ecE, ecC, emShift, 0) + 0.32
  const eLo = Math.min(ecC - EG, colShift, -EG) - 0.3
  const xOf = (f: number) => MX + f * PW
  const yOf = (e: number) => TOP + ((eHi - e) / (eHi - eLo)) * PLOT_H

  const N = 140
  const ec: [number, number][] = []
  const ev: [number, number][] = []
  const ef: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const f = i / N
    const e = ecAt(f)
    ec.push([xOf(f), yOf(e)])
    ev.push([xOf(f), yOf(e - EG)])
    ef.push([xOf(f), yOf(eFAt(f))])
  }
  const toPath = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

  // electron flow path (active only): along E_c emitter → over base → down to collector
  const flowPts = ec.filter((_, i) => i / N >= 0.1 && i / N <= 0.78).map(([x, y]) => [x, y - 7] as [number, number])
  const flowPath = flowPts.length ? 'M ' + flowPts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ') : ''

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="bbd-cap" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill={VIOLET} /></marker>
          <marker id="bbd-flow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={EMERALD} /></marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* faint region tints */}
        <rect x={xOf(0)} y={TOP} width={xOf(fE) - xOf(0)} height={PLOT_H} fill={SKY} fillOpacity={0.05} />
        <rect x={xOf(fEBd)} y={TOP} width={xOf(fB) - xOf(fEBd)} height={PLOT_H} fill={ROSE} fillOpacity={0.05} />
        <rect x={xOf(fBCd)} y={TOP} width={xOf(1) - xOf(fBCd)} height={PLOT_H} fill={SKY} fillOpacity={0.05} />

        {/* depletion regions (violet) */}
        <rect x={xOf(fE)} y={TOP} width={xOf(fEBd) - xOf(fE)} height={PLOT_H} fill="#ddd6fe" fillOpacity={0.5} />
        <rect x={xOf(fB)} y={TOP} width={xOf(fBCd) - xOf(fB)} height={PLOT_H} fill="#ddd6fe" fillOpacity={0.5} />

        {/* region labels (bottom) */}
        <text x={(xOf(0) + xOf(fE)) / 2} y={yBot + 16} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 12, fontWeight: 800 }}>פולט · n</text>
        <text x={(xOf(fEBd) + xOf(fB)) / 2} y={yBot + 16} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 12, fontWeight: 800 }}>בסיס · p</text>
        <text x={(xOf(fBCd) + xOf(1)) / 2} y={yBot + 16} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 12, fontWeight: 800 }}>קולט · n</text>
        <text x={(xOf(fE) + xOf(fEBd)) / 2} y={TOP + 12} textAnchor="middle" className="fill-violet-500" style={{ fontSize: 9.5, fontWeight: 700 }}>B-E</text>
        <text x={(xOf(fB) + xOf(fBCd)) / 2} y={TOP + 12} textAnchor="middle" className="fill-violet-500" style={{ fontSize: 9.5, fontWeight: 700 }}>C-B</text>

        {/* bands */}
        <path d={toPath(ef)} fill="none" stroke="#475569" strokeWidth={1.4} strokeDasharray="6 3" />
        <path d={toPath(ec)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_C }} />
        <path d={toPath(ev)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" style={{ filter: GLOW_V }} />
        <text x={PR + 4} y={yOf(ecC) + 4} className="fill-sky-700" style={{ fontSize: 13, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 9 }}>c</tspan></text>
        <text x={PR + 4} y={yOf(ecC - EG) + 4} className="fill-rose-600" style={{ fontSize: 13, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 9 }}>v</tspan></text>

        {/* E_F label(s) */}
        {active ? (
          <>
            <text x={xOf(0) + 2} y={yOf(emShift) - 5} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 8 }}>FE</tspan></text>
            <text x={PR + 4} y={yOf(colShift) + 4} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 8 }}>FC</tspan></text>
          </>
        ) : (
          <text x={PR + 4} y={yOf(0) + 4} className="fill-slate-600" style={{ fontSize: 13, fontWeight: 700 }}>E<tspan dy={3} style={{ fontSize: 9 }}>F</tspan></text>
        )}

        {/* E-B barrier caliper (emitter E_c → base E_c) — shrinks in active */}
        <line x1={xOf(fE) - 5} y1={yOf(ecE)} x2={xOf(fE) - 5} y2={yOf(ecBase)} stroke={VIOLET} strokeWidth={1.75} markerStart="url(#bbd-cap)" markerEnd="url(#bbd-cap)" />
        <text x={xOf(fE) - 9} y={(yOf(ecE) + yOf(ecBase)) / 2 + 3} textAnchor="end" className="fill-violet-700" style={{ fontSize: 10.5, fontWeight: 700 }}>מחסום BE</text>

        {/* electron flow (active only) */}
        {active && flowPath && (
          <>
            <path d={flowPath} fill="none" stroke={EMERALD} strokeWidth={2} strokeDasharray="1 5" strokeLinecap="round" opacity={0.85} markerEnd="url(#bbd-flow)" />
            <text x={(xOf(0.1) + xOf(0.78)) / 2} y={TOP + 30} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 11, fontWeight: 700 }}>אלקטרונים: הזרקה ← דיפוזיה ← קליטה</text>
          </>
        )}

        {/* mode badge */}
        <g>
          <rect x={MX + 4} y={TOP + 4} width={active ? 96 : 78} height={20} rx={6} fill={active ? '#ecfdf5' : '#f8fafc'} stroke={active ? '#a7f3d0' : '#e2e8f0'} />
          <text x={MX + 4 + (active ? 48 : 39)} y={TOP + 18} textAnchor="middle" className={active ? 'fill-emerald-700' : 'fill-slate-500'} style={{ fontSize: 11, fontWeight: 800 }}>{active ? 'פעיל-קדמי' : 'שיווי משקל'}</text>
        </g>
      </svg>
    </div>
  )
}
