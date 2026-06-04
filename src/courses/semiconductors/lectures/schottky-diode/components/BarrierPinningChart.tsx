import { MATERIALS, METALS, pinnedBarrier, schottkyBarrier } from '../../../lib/junction'

/**
 * φ_B vs φ_m — the Schottky-Mott (ideal) vs Bardeen (pinned) picture. The IDEAL
 * line φ_B = φ_m − χ has slope 1, so the open dots spread widely with the metal.
 * In REALITY, surface states pin E_F near a neutral level (~⅔E_g), so the filled
 * dots all sit near a constant ~0.72 eV — barrier height almost independent of the
 * metal. The faint connectors show how pinning "pulls" every metal to the same φ_B.
 */
const W = 440
const H = 264
const ML = 46
const MR = 16
const MT = 40
const MB = 40
const PL = ML
const PR = W - MR
const PT = MT
const PB = H - MB
const PHIM_LO = 4.0
const PHIM_HI = 5.8
const PHIB_HI = 1.7
const CHI = MATERIALS.Si.chi // 4.05
const PIN = pinnedBarrier(MATERIALS.Si.eg) // ⅔E_g pinned barrier on Si ≈ 0.747
const VIOLET = '#7c3aed'
const EMERALD = '#10b981'

const xAt = (phim: number) => PL + ((phim - PHIM_LO) / (PHIM_HI - PHIM_LO)) * (PR - PL)
const yAt = (phib: number) => PB - (phib / PHIB_HI) * (PB - PT)

// well-spread representative metals (Al/Ag ≈ Ti, omitted to avoid label overlap)
const SHOWN = [METALS.Ti, METALS.W, METALS.Au, METALS.Pt]

export default function BarrierPinningChart() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* y grid + ticks */}
        {[0, 0.5, 1.0, 1.5].map((v) => (
          <g key={v}>
            <line x1={PL} y1={yAt(v)} x2={PR} y2={yAt(v)} stroke="#eef2f7" strokeWidth={1} />
            <text x={PL - 6} y={yAt(v) + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11 }}>{v.toFixed(1)}</text>
          </g>
        ))}
        {/* axes */}
        <line x1={PL} y1={PT} x2={PL} y2={PB} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={PL} y1={PB} x2={PR} y2={PB} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={PL - 30} y={PT - 6} className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>φ<tspan dy={3} style={{ fontSize: 9 }}>B</tspan> (eV)</text>
        <text x={PR} y={PB + 30} textAnchor="end" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>φ<tspan dy={3} style={{ fontSize: 9 }}>m</tspan> (eV)</text>

        {/* ideal line φ_B = φ_m − χ (slope 1) */}
        <line x1={xAt(CHI)} y1={yAt(0)} x2={xAt(CHI + PHIB_HI)} y2={yAt(PHIB_HI)} stroke={VIOLET} strokeWidth={2.25} strokeDasharray="6 4" />
        {/* pinned line φ_B ≈ ⅔E_g (flat) */}
        <line x1={PL} y1={yAt(PIN)} x2={PR} y2={yAt(PIN)} stroke={EMERALD} strokeWidth={2.75} />

        {/* per-metal: connector + ideal (open) + pinned (filled) dots + label */}
        {SHOWN.map((m, i) => {
          const ideal = schottkyBarrier(m.phiM, CHI)
          const x = xAt(m.phiM)
          return (
            <g key={i}>
              <line x1={x} y1={yAt(ideal)} x2={x} y2={yAt(PIN)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
              <line x1={x} y1={PB} x2={x} y2={PB + 4} stroke="#cbd5e1" strokeWidth={1} />
              <text x={x} y={PB + 16} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>{m.key}</text>
              <circle cx={x} cy={yAt(ideal)} r={4} fill="#fff" stroke={VIOLET} strokeWidth={2} />
              <circle cx={x} cy={yAt(PIN)} r={4} fill={EMERALD} />
            </g>
          )
        })}

        {/* legend */}
        <g>
          <line x1={PL + 6} y1={PT - 22} x2={PL + 28} y2={PT - 22} stroke={VIOLET} strokeWidth={2.25} strokeDasharray="6 4" />
          <text x={PL + 33} y={PT - 18} className="fill-violet-700" style={{ fontSize: 11, fontWeight: 700 }}>אידיאלי (φ<tspan dy={2} style={{ fontSize: 8 }}>m</tspan><tspan dy={-2}>−χ)</tspan></text>
          <line x1={PL + 150} y1={PT - 22} x2={PL + 172} y2={PT - 22} stroke={EMERALD} strokeWidth={2.75} />
          <text x={PL + 177} y={PT - 18} className="fill-emerald-700" style={{ fontSize: 11, fontWeight: 700 }}>מקובע (ממשי)</text>
        </g>
      </svg>
    </div>
  )
}
