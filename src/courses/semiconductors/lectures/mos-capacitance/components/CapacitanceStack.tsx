import type { Regime } from '../../mos-capacitor/components/regime'

/**
 * Where the small-signal charge ΔQ appears (lecturer's sketch, summary p41). One gate plate
 * (ΔQ_G, always at the oxide), and the responding semiconductor ΔQ at a regime-dependent place:
 *   accumulation — majority holes at the surface (fast, always respond)
 *   depletion    — ionised acceptors at the depletion EDGE (W modulates → C_dep)
 *   inversion LF — the inversion electron layer at the surface (minority, only at low freq)
 *   inversion HF — minority can't follow → ΔQ stays at the depletion edge (W_max) → C_min
 * `follows=false` (HF inversion) moves the response back to the depletion edge.
 */
const W = 360
const H = 190
const MAG = '#db2777'

export default function CapacitanceStack({ regime, follows = true }: { regime: Regime; follows?: boolean }) {
  const xGate = 40
  const xOxL = 70
  const xOxR = 104
  const xSurf = 104
  const xR = 330
  const top = 30
  const bot = 150
  const midY = (top + bot) / 2

  // depletion-edge x (schematic): mid for depletion, far for inversion (W_max)
  const edgeX = regime === 'inversion' ? 250 : 190

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* metal gate */}
        <rect x={xGate} y={top} width={xOxL - xGate} height={bot - top} fill="#cbd5e1" stroke="#64748b" />
        <text x={(xGate + xOxL) / 2} y={top - 6} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>M</text>
        {/* oxide */}
        <rect x={xOxL} y={top} width={xOxR - xOxL} height={bot - top} fill="#fef9c3" stroke="#eab308" />
        <text x={(xOxL + xOxR) / 2} y={top - 6} textAnchor="middle" className="fill-yellow-600" style={{ fontSize: 9, fontWeight: 700 }}>ox</text>
        {/* semiconductor */}
        <rect x={xSurf} y={top} width={xR - xSurf} height={bot - top} fill="#eff6ff" stroke="#93c5fd" />
        <text x={(xSurf + xR) / 2} y={top - 6} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 10, fontWeight: 700 }}>S (p-type)</text>

        {/* gate ΔQ (always at the oxide interface on the metal side) */}
        <rect x={xOxL - 8} y={top + 6} width={6} height={bot - top - 12} fill={MAG} fillOpacity={0.35} stroke={MAG} strokeWidth={1.25} />
        <text x={xGate + 4} y={midY} className="fill-pink-600" style={{ fontSize: 11, fontWeight: 800 }}>ΔQ<tspan dy={2} style={{ fontSize: 7.5 }}>G</tspan></text>

        {/* responding semiconductor ΔQ */}
        {regime === 'accumulation' && (
          <>
            <rect x={xSurf} y={top + 6} width={7} height={bot - top - 12} fill={MAG} fillOpacity={0.35} stroke={MAG} strokeWidth={1.25} />
            <text x={xSurf + 14} y={midY - 6} className="fill-pink-600" style={{ fontSize: 10, fontWeight: 700 }}>ΔQ חורים (בשפה)</text>
          </>
        )}
        {regime === 'depletion' && (
          <>
            <line x1={edgeX} y1={top + 4} x2={edgeX} y2={bot - 4} stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="4 3" />
            <rect x={edgeX - 6} y={top + 6} width={6} height={bot - top - 12} fill={MAG} fillOpacity={0.35} stroke={MAG} strokeWidth={1.25} />
            <text x={edgeX + 6} y={midY - 6} className="fill-pink-600" style={{ fontSize: 10, fontWeight: 700 }}>ΔQ בקצה המחסור (W משתנה)</text>
          </>
        )}
        {regime === 'inversion' && (
          <>
            {/* depletion box pinned at W_max */}
            <rect x={xSurf} y={top + 6} width={edgeX - xSurf} height={bot - top - 12} fill="#bae6fd" fillOpacity={0.3} />
            <line x1={edgeX} y1={top + 4} x2={edgeX} y2={bot - 4} stroke="#0ea5e9" strokeWidth={1.25} strokeDasharray="4 3" />
            {follows ? (
              <>
                <rect x={xSurf} y={top + 6} width={7} height={bot - top - 12} fill={MAG} fillOpacity={0.4} stroke={MAG} strokeWidth={1.25} />
                <text x={xSurf + 14} y={midY + 10} className="fill-pink-600" style={{ fontSize: 9.5, fontWeight: 700 }}>ΔQ ערוץ-היפוך (LF)</text>
              </>
            ) : (
              <>
                <rect x={edgeX - 6} y={top + 6} width={6} height={bot - top - 12} fill={MAG} fillOpacity={0.35} stroke={MAG} strokeWidth={1.25} />
                <text x={edgeX + 6} y={midY + 10} className="fill-pink-600" style={{ fontSize: 9.5, fontWeight: 700 }}>ΔQ בקצה W<tspan dy={2} style={{ fontSize: 7 }}>max</tspan><tspan dy={-2}> (HF)</tspan></text>
              </>
            )}
          </>
        )}
      </svg>
    </div>
  )
}
