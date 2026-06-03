import { shortBaseProfile } from '../../../lib/junction'

/**
 * The minority profile in a neutral base of width W_B (in units of the diffusion
 * length L), ending in an ohmic contact where Δp=0. As the base shrinks the exact
 * sinh solution morphs from an exponential decay (long base, W_B≫L) to a straight
 * line (short base, W_B≪L). The dashed grey curve is the pure-exponential (long)
 * reference; the emerald tangent is the boundary slope at x=0 — and it hits zero
 * exactly at L_eff = L·tanh(W_B/L), the effective length that sets the current.
 */
const W = 480
const H = 270
const mL = 44
const mR = 18
const mT = 22
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const XF = 4 // x-frame, in units of L
const YMAX = 1.12

export default function LengthRegimeProfile({ ratio }: { ratio: number }) {
  const xOf = (xL: number) => mL + (xL / XF) * PW
  const yOf = (v: number) => yBot - (v / YMAX) * PH
  const Leff = Math.tanh(ratio) // in units of L (tangent's x-intercept)

  const NS = 80
  const prof = Array.from({ length: NS + 1 }, (_, i) => {
    const x = (ratio * i) / NS
    return `${xOf(x).toFixed(1)},${yOf(shortBaseProfile(x, ratio, 1)).toFixed(1)}`
  })
  const expRef = Array.from({ length: NS + 1 }, (_, i) => {
    const x = (XF * i) / NS
    return `${xOf(x).toFixed(1)},${yOf(Math.exp(-x)).toFixed(1)}`
  })

  const xContact = xOf(Math.min(ratio, XF))

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* neutral-base shading + metal contact block */}
        <rect x={mL} y={mT} width={xContact - mL} height={PH} fill="#f5f3ff" />
        {ratio < XF && (
          <>
            <rect x={xContact} y={mT} width={mL + PW - xContact} height={PH} fill="#e2e8f0" opacity={0.7} />
            <text x={(xContact + mL + PW) / 2} y={mT + PH / 2} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>
              מגע אוהמי
            </text>
          </>
        )}

        {/* axes */}
        <line x1={mL} y1={yBot} x2={W - mR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>Δp</text>
        <text x={W - mR} y={yBot + 14} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>מרחק מהצומת (ביחידות L)</text>

        {/* one-diffusion-length reference tick */}
        <line x1={xOf(1)} y1={mT} x2={xOf(1)} y2={yBot} stroke="#f59e0b" strokeWidth={1.1} strokeDasharray="4 3" opacity={0.8} />
        <text x={xOf(1)} y={mT - 6} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 10, fontWeight: 700 }}>L</text>

        {/* long-base exponential reference */}
        <path d={'M ' + expRef.join(' L ')} fill="none" stroke="#94a3b8" strokeWidth={1.6} strokeDasharray="5 4" />
        <text x={xOf(2.1)} y={yOf(Math.exp(-2.1)) - 6} className="fill-slate-400" style={{ fontSize: 9, fontWeight: 700 }}>
          ארוכה: e^(−x/L)
        </text>

        {/* tangent at x=0 → hits zero at L_eff */}
        <line x1={xOf(0)} y1={yOf(1)} x2={xOf(Leff)} y2={yOf(0)} stroke="#10b981" strokeWidth={1.75} strokeDasharray="3 3" />
        <circle cx={xOf(Leff)} cy={yOf(0)} r={3.5} fill="#10b981" />
        <text x={xOf(Leff)} y={yBot + 26} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 10, fontWeight: 700 }}>
          L<tspan dy={2} style={{ fontSize: 7 }}>eff</tspan>
        </text>

        {/* the actual profile */}
        <path d={'M ' + prof.join(' L ')} fill="none" stroke="#7c3aed" strokeWidth={2.85} strokeLinejoin="round" />
        <circle cx={xOf(0)} cy={yOf(1)} r={4} fill="#7c3aed" />
        <text x={xOf(0) + 6} y={yOf(1) - 6} className="fill-violet-700" style={{ fontSize: 10, fontWeight: 700 }}>Δp(0)</text>

        {/* contact / base-width marker */}
        {ratio < XF && (
          <text x={xContact} y={yBot + 26} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10, fontWeight: 700 }}>
            W<tspan dy={2} style={{ fontSize: 7 }}>B</tspan>
          </text>
        )}
      </svg>
    </div>
  )
}
