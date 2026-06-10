import type { Regime } from './regime'

/**
 * Charge-density profile ρ(x) across the MOS, matching the summary: a sheet charge on the
 * metal (x=−t_ox), zero in the oxide, and the semiconductor charge at the surface.
 *   accumulation — gate −Q ; semiconductor +Q (holes), so the two sheets mirror each other.
 *   depletion    — gate +Q ; a negative depletion box (ionised acceptors).
 *   inversion    — gate +Q ; depletion box + a thin negative electron spike at the surface.
 * `wRel`∈(0,1] scales the depletion-box width (used by the sandbox). Pure schematic.
 */
const W = 380
const H = 210
const ROSE = '#e11d48'
const SKY = '#0284c7'
const y0 = 108 // ρ = 0 axis
const xMetal = 72
const xSurf = 176
const xR = 352

export default function MosChargeProfile({ regime, wRel = 1 }: { regime: Regime; wRel?: number }) {
  const gatePlus = regime === 'depletion' || regime === 'inversion'
  const hG = 52
  const wDep = (xR - xSurf - 12) * Math.max(0.15, Math.min(1, wRel))

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <pattern id="rho-pos" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill={ROSE} fillOpacity={0.12} />
            <line x1="0" y1="0" x2="0" y2="5" stroke={ROSE} strokeWidth="0.9" strokeOpacity={0.5} />
          </pattern>
          <pattern id="rho-neg" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill={SKY} fillOpacity={0.12} />
            <line x1="0" y1="0" x2="0" y2="5" stroke={SKY} strokeWidth="0.9" strokeOpacity={0.5} />
          </pattern>
          <marker id="rho-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1,1 L9,5 L1,9 Z" fill="#475569" /></marker>
        </defs>

        {/* x = 0 surface guide (solid, emphasised) */}
        <line x1={xSurf} y1={24} x2={xSurf} y2={H - 18} stroke="#94a3b8" strokeWidth={1.5} />
        {/* axes (bold) */}
        <line x1={44} y1={y0} x2={xR + 12} y2={y0} stroke="#475569" strokeWidth={1.9} markerEnd="url(#rho-arr)" />
        <line x1={48} y1={18} x2={48} y2={H - 16} stroke="#475569" strokeWidth={1.9} markerEnd="url(#rho-arr)" />
        <text x={38} y={28} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 13, fontWeight: 800 }}>ρ</text>
        <text x={xR + 10} y={y0 - 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>x</text>
        {/* origin tick + labels */}
        <circle cx={xSurf} cy={y0} r={3} fill="#334155" />
        <text x={xSurf} y={H - 6} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>x = 0</text>
        <text x={xMetal} y={H - 6} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>−t<tspan dy={2} style={{ fontSize: 8 }}>ox</tspan></text>

        {/* gate sheet charge */}
        {gatePlus ? (
          <>
            <rect x={xMetal - 6} y={y0 - hG} width={12} height={hG} fill="url(#rho-pos)" stroke={ROSE} strokeWidth={1.25} />
            <text x={xMetal} y={y0 - hG - 5} textAnchor="middle" fill={ROSE} style={{ fontSize: 10.5, fontWeight: 800 }}>+Q<tspan dy={2} style={{ fontSize: 7.5 }}>G</tspan></text>
          </>
        ) : (
          <>
            <rect x={xMetal - 6} y={y0} width={12} height={hG} fill="url(#rho-neg)" stroke={SKY} strokeWidth={1.25} />
            <text x={xMetal} y={y0 + hG + 14} textAnchor="middle" fill={SKY} style={{ fontSize: 10.5, fontWeight: 800 }}>−Q<tspan dy={2} style={{ fontSize: 7.5 }}>G</tspan></text>
          </>
        )}

        {/* semiconductor charge */}
        {regime === 'accumulation' && (
          <>
            <rect x={xSurf} y={y0 - hG} width={14} height={hG} fill="url(#rho-pos)" stroke={ROSE} strokeWidth={1.25} />
            <text x={xSurf + 30} y={y0 - hG + 6} textAnchor="start" fill={ROSE} style={{ fontSize: 10.5, fontWeight: 800 }}>+Q (חורים)</text>
          </>
        )}
        {regime === 'depletion' && (
          <>
            <rect x={xSurf} y={y0} width={wDep} height={40} fill="url(#rho-neg)" stroke={SKY} strokeWidth={1.25} />
            <text x={xSurf + wDep / 2} y={y0 + 56} textAnchor="middle" fill={SKY} style={{ fontSize: 10.5, fontWeight: 800 }}>−Q<tspan dy={2} style={{ fontSize: 7.5 }}>dep</tspan></text>
          </>
        )}
        {regime === 'inversion' && (
          <>
            <rect x={xSurf} y={y0} width={wDep} height={36} fill="url(#rho-neg)" stroke={SKY} strokeWidth={1} />
            <rect x={xSurf} y={y0} width={13} height={58} fill={SKY} fillOpacity={0.4} stroke={SKY} strokeWidth={1.25} />
            <text x={xSurf + 16} y={y0 + 70} textAnchor="start" fill={SKY} style={{ fontSize: 10, fontWeight: 800 }}>Q<tspan dy={2} style={{ fontSize: 7.5 }}>inv</tspan><tspan dy={-2}> + Q</tspan><tspan dy={2} style={{ fontSize: 7.5 }}>dep,max</tspan></text>
          </>
        )}
        {regime === 'flat' && (
          <text x={(xSurf + xR) / 2} y={y0 - 10} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>ρ ≈ 0 (אין מטען)</text>
        )}
      </svg>
    </div>
  )
}
