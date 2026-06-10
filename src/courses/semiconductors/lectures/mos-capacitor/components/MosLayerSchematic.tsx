import type { Regime } from './regime'

/**
 * The M-O-S layer stack with the charges drawn where they sit — the "where are the + and −"
 * picture from the summary. Metal (gate) on top, SiO₂ in the middle, p-Si below. Per regime:
 *   accumulation — gate −Q (V_G<0); holes (+) pile at the Si/SiO₂ surface.
 *   depletion    — gate +Q (V_G>0); a band of ionised acceptors (−) near the surface.
 *   inversion    — gate +Q (V_G≫0); a thin electron layer (−) at the surface + acceptor band (−).
 * Pure schematic.
 */
const W = 320
const H = 250
const SLATE = '#334155'
const ROSE = '#e11d48'
const SKY = '#0284c7'
const xL = 56
const xR = 264
const yM0 = 34
const yM1 = 62 // metal
const yOx1 = 86 // oxide bottom (= Si surface)
const ySi1 = 208 // p-Si bottom

function Charges({ y, n, sym, color }: { y: number; n: number; sym: string; color: string }) {
  const step = (xR - xL - 24) / (n - 1)
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <text key={i} x={xL + 12 + i * step} y={y} textAnchor="middle" fill={color} style={{ fontSize: 13, fontWeight: 800 }}>{sym}</text>
      ))}
    </>
  )
}

export default function MosLayerSchematic({ regime }: { regime: Regime }) {
  const gatePlus = regime === 'depletion' || regime === 'inversion'
  const gateLabel = regime === 'flat' ? 'Q = 0' : gatePlus ? '+Q' : '−Q'

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <pattern id="lay-ox" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#e2e8f0" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.1" />
          </pattern>
        </defs>

        {/* metal gate */}
        <rect x={xL} y={yM0} width={xR - xL} height={yM1 - yM0} fill={SLATE} fillOpacity={0.82} />
        <text x={xL + 8} y={yM0 - 8} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>מתכת (G)</text>
        <text x={xR - 8} y={(yM0 + yM1) / 2 + 4} textAnchor="end" fill="#fff" style={{ fontSize: 12, fontWeight: 800 }}>{gateLabel}</text>
        {/* gate lead + V_G */}
        <line x1={(xL + xR) / 2} y1={yM0} x2={(xL + xR) / 2} y2={yM0 - 16} stroke={SLATE} strokeWidth={2} />
        <circle cx={(xL + xR) / 2} cy={yM0 - 16} r={3.5} fill={SLATE} />
        <text x={(xL + xR) / 2 + 34} y={yM0 - 13} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>
          V<tspan dy={2} style={{ fontSize: 7 }}>G</tspan>
          {regime === 'flat' ? <><tspan dy={-2}> = V</tspan><tspan dy={2} style={{ fontSize: 7 }}>FB</tspan></> : <tspan dy={-2}>{gatePlus ? ' > 0' : ' < 0'}</tspan>}
        </text>

        {/* oxide */}
        <rect x={xL} y={yM1} width={xR - xL} height={yOx1 - yM1} fill="url(#lay-ox)" stroke="#94a3b8" strokeOpacity={0.5} strokeWidth={0.75} />
        <text x={xL + 8} y={(yM1 + yOx1) / 2 + 4} className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>SiO₂</text>

        {/* p-Si */}
        <rect x={xL} y={yOx1} width={xR - xL} height={ySi1 - yOx1} fill={ROSE} fillOpacity={0.1} stroke={ROSE} strokeOpacity={0.35} />
        <text x={xL + 8} y={ySi1 - 10} className="fill-rose-600" style={{ fontSize: 12, fontWeight: 800 }}>p-Si</text>

        {/* regime-specific surface charges */}
        {regime === 'accumulation' && (
          <>
            <Charges y={yOx1 + 16} n={11} sym="+" color={ROSE} />
            <text x={(xL + xR) / 2} y={yOx1 + 36} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 10.5, fontWeight: 700 }}>חורים (נושאי-רוב) נצברים</text>
          </>
        )}
        {regime === 'depletion' && (
          <>
            <rect x={xL} y={yOx1} width={xR - xL} height={36} fill={SLATE} fillOpacity={0.06} />
            <Charges y={yOx1 + 22} n={9} sym="−" color={SLATE} />
            <text x={(xL + xR) / 2} y={yOx1 + 50} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 10.5, fontWeight: 700 }}>יוני-מקבל שליליים (אזור דלדול)</text>
          </>
        )}
        {regime === 'inversion' && (
          <>
            <Charges y={yOx1 + 14} n={11} sym="−" color={SKY} />
            <text x={(xL + xR) / 2} y={yOx1 + 28} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 10, fontWeight: 700 }}>אלקטרונים — ערוץ היפוך</text>
            <rect x={xL} y={yOx1 + 34} width={xR - xL} height={32} fill={SLATE} fillOpacity={0.06} />
            <Charges y={yOx1 + 54} n={9} sym="−" color={SLATE} />
            <text x={(xL + xR) / 2} y={yOx1 + 74} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 10, fontWeight: 700 }}>אזור דלדול</text>
          </>
        )}

        {/* substrate ground */}
        <line x1={(xL + xR) / 2} y1={ySi1} x2={(xL + xR) / 2} y2={ySi1 + 14} stroke={SLATE} strokeWidth={2} />
        <line x1={(xL + xR) / 2 - 9} y1={ySi1 + 14} x2={(xL + xR) / 2 + 9} y2={ySi1 + 14} stroke={SLATE} strokeWidth={2} />
        <line x1={(xL + xR) / 2 - 5} y1={ySi1 + 18} x2={(xL + xR) / 2 + 5} y2={ySi1 + 18} stroke={SLATE} strokeWidth={2} />
      </svg>
    </div>
  )
}
