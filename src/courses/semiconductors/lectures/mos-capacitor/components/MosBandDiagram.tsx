import type { Regime } from './regime'

/**
 * MOS energy-band diagram: metal | SiO₂ barrier | p-type semiconductor, with the bands
 * bending near the surface by qψ_s (direction set by the regime):
 *   accumulation — bands bend UP, E_v rises toward E_F (holes pile up).
 *   depletion    — bands bend DOWN, surface depleted.
 *   inversion    — bands bend DOWN hard, E_i crosses BELOW E_F (electron channel).
 * E_F is the flat reference; q·V_ox is the drop across the oxide. Faithful to the summary.
 * Pure schematic. `bendPx` overrides the per-regime surface offset (used by the sandbox).
 */
const W = 460
const H = 270
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const SLATE = '#475569'
const GREEN = '#059669'

const xM0 = 28
const xM1 = 84 // metal
const xOx1 = 150 // oxide right = surface
const xR = 426
const xBend = 268 // band-bending region ends here

// bulk band energies (screen y; higher energy = smaller y)
const yC = 74
const yI = 134
const yV = 196
const yF = 160 // E_F (p-type: below E_i)

const BEND: Record<Regime, number> = { flat: 0, accumulation: -28, depletion: 30, inversion: 54 }

const band = (yBulk: number, bend: number) =>
  `M ${xOx1} ${yBulk + bend} C ${xOx1 + 58} ${yBulk + bend}, ${xBend - 22} ${yBulk}, ${xBend} ${yBulk} L ${xR} ${yBulk}`

function Marks({ x, y, n, sym, color }: { x: number; y: number; n: number; sym: string; color: string }) {
  return <>{Array.from({ length: n }, (_, i) => <text key={i} x={x + i * 11} y={y} fill={color} style={{ fontSize: 12, fontWeight: 800 }}>{sym}</text>)}</>
}

export default function MosBandDiagram({ regime, bendPx }: { regime: Regime; bendPx?: number }) {
  const bend = bendPx ?? BEND[regime]
  const gatePlus = regime === 'depletion' || regime === 'inversion'
  const yFm = regime === 'flat' ? yF : yF + (gatePlus ? 26 : -26) // metal Fermi shifted by ~qV_G

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <pattern id="band-ox" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#eef2f7" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth="1" />
          </pattern>
          <marker id="band-ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1,1 L9,5 L1,9" fill="none" stroke={GREEN} strokeWidth="1.6" />
          </marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

        {/* metal */}
        <rect x={xM0} y={40} width={xM1 - xM0} height={H - 70} fill={SLATE} fillOpacity={0.14} stroke={SLATE} strokeOpacity={0.3} />
        <text x={(xM0 + xM1) / 2} y={32} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 12, fontWeight: 800 }}>מתכת</text>
        <line x1={xM0 + 4} y1={yFm} x2={xM1} y2={yFm} stroke={SLATE} strokeWidth={2} strokeDasharray="5 3" />
        <text x={xM0 + 4} y={yFm - 5} className="fill-slate-600" style={{ fontSize: 10, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 7 }}>Fm</tspan></text>

        {/* oxide barrier */}
        <rect x={xM1} y={40} width={xOx1 - xM1} height={H - 70} fill="url(#band-ox)" stroke="#cbd5e1" strokeWidth={0.75} />
        <text x={(xM1 + xOx1) / 2} y={32} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>SiO₂</text>
        {/* qV_ox drop across the oxide */}
        {regime !== 'flat' && (
          <>
            <line x1={(xM1 + xOx1) / 2} y1={yFm} x2={(xM1 + xOx1) / 2} y2={yF + bend} stroke={GREEN} strokeWidth={1.5} markerStart="url(#band-ar)" markerEnd="url(#band-ar)" />
            <text x={(xM1 + xOx1) / 2 - 4} y={(yFm + yF + bend) / 2} textAnchor="end" fill={GREEN} style={{ fontSize: 10, fontWeight: 800 }}>qV<tspan dy={2} style={{ fontSize: 7 }}>ox</tspan></text>
          </>
        )}

        {/* semiconductor bands */}
        <path d={band(yC, bend)} fill="none" stroke={SKY} strokeWidth={2.5} />
        <path d={band(yV, bend)} fill="none" stroke={ROSE} strokeWidth={2.5} />
        <path d={band(yI, bend)} fill="none" stroke={SLATE} strokeWidth={1.5} strokeDasharray="5 3" />
        <line x1={xOx1} y1={yF} x2={xR} y2={yF} stroke="#0f766e" strokeWidth={1.75} strokeDasharray="6 3" />
        {/* band labels */}
        <text x={xR + 2} y={yC + 4} className="fill-sky-600" style={{ fontSize: 11, fontWeight: 800 }}>E<tspan dy={2} style={{ fontSize: 7 }}>c</tspan></text>
        <text x={xR + 2} y={yI + 4} className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 7 }}>i</tspan></text>
        <text x={xR + 2} y={yF + 4} className="fill-teal-700" style={{ fontSize: 11, fontWeight: 800 }}>E<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></text>
        <text x={xR + 2} y={yV + 4} className="fill-rose-600" style={{ fontSize: 11, fontWeight: 800 }}>E<tspan dy={2} style={{ fontSize: 7 }}>v</tspan></text>

        {/* qψ_s surface band-bending marker */}
        {regime !== 'flat' && (
          <>
            <line x1={xOx1 + 14} y1={yI} x2={xOx1 + 14} y2={yI + bend} stroke={GREEN} strokeWidth={1.5} markerStart="url(#band-ar)" markerEnd="url(#band-ar)" />
            <text x={xOx1 + 20} y={yI + bend / 2 + 4} className="fill-emerald-700" style={{ fontSize: 10, fontWeight: 800 }}>qψ<tspan dy={2} style={{ fontSize: 7 }}>s</tspan></text>
          </>
        )}

        {/* surface carriers */}
        {regime === 'accumulation' && <Marks x={xOx1 + 6} y={yV + bend - 6} n={4} sym="+" color={ROSE} />}
        {regime === 'inversion' && <Marks x={xOx1 + 6} y={yC + bend + 16} n={4} sym="−" color={SKY} />}
      </svg>
    </div>
  )
}
