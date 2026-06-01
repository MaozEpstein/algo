import { thermalVoltage, type JunctionState, type Material } from '../lib/junction'

/**
 * Equilibrium energy-band diagram of a PN junction: E_c, E_v (solid), E_i
 * (dashed, midgap) and a single FLAT E_F (the signature of equilibrium). The
 * bands bend down by q·V_bi across the depletion region — heavier doping ⇒ more
 * bending. Faithful: bending and Fermi-level offsets are computed from the real
 * doping/n_i and the material gap. Pure SVG; reusable across the course.
 */
interface Props {
  state: JunctionState
  Na: number
  Nd: number
  mat: Material
}

const W = 560
const MX = 16
const MR = 40 // right margin for band labels
const H = 240
const TOP = 26
const PW = W - MX - MR

export default function BandDiagram({ state, Na, mat }: Props) {
  const { Vbi, dn, dp, Emax } = state
  const VT = thermalVoltage()
  const phiP = VT * Math.log(Na / mat.ni) // E_i,p above E_F (eV); E_i,n below by V_bi−φ_p
  const eg = mat.eg

  const xMax = Math.max(dn, dp, 1e-30) * 1.45
  const sx = (x: number) => MX + ((x + xMax) / (2 * xMax)) * PW

  // energy → y (higher energy = smaller y). Span = E_c,p (top) … E_v,n (bottom).
  const eTop = phiP + eg / 2
  const span = Vbi + eg || 1
  const drawH = H - TOP - 22
  const eToY = (e: number) => TOP + ((eTop - e) / span) * drawH

  // band-bending fraction ψ(x) ∈ [0,1] (0 on neutral p, 1 on neutral n) — the
  // normalized potential from the triangular field.
  const psi = (x: number): number => {
    if (x <= -dp) return 0
    if (x < 0) return (Emax * (x + dp) * (x + dp)) / (2 * dp) / (Vbi || 1)
    if (x < dn) return ((Emax * dp) / 2 + (Emax * (dn * x - (x * x) / 2)) / dn) / (Vbi || 1)
    return 1
  }
  const Ei = (x: number) => phiP - Vbi * psi(x) // intrinsic level (eV rel. E_F)

  const N = 80
  const sample = (eOffset: number) =>
    Array.from({ length: N + 1 }, (_, i) => {
      const x = -dp + ((dn + dp) * i) / N
      const xx = i === 0 ? -xMax : i === N ? xMax : x // extend flats to the edges
      return `${i ? 'L' : 'M'} ${sx(xx).toFixed(1)},${eToY(Ei(x) + eOffset).toFixed(1)}`
    }).join(' ')

  const Ec = sample(+eg / 2)
  const Ev = sample(-eg / 2)
  const EiPath = sample(0)
  const yF = eToY(0)
  const xL = sx(-dp)
  const xR = sx(dn)
  const x0 = sx(0)

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* depletion shading + guides */}
        <rect x={xL} y={TOP - 6} width={Math.max(xR - xL, 0)} height={drawH + 12} fill="#f1f5f9" />
        {[xL, x0, xR].map((gx, i) => (
          <line key={i} x1={gx} y1={TOP - 6} x2={gx} y2={TOP + drawH + 6} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
        ))}

        {/* E_F — flat dashed line (equilibrium) */}
        <line x1={MX} y1={yF} x2={W - MR} y2={yF} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={W - MR + 3} y={yF + 3} className="fill-slate-800" style={{ fontSize: 11, fontWeight: 700 }}>
          E_F
        </text>

        {/* E_i — dashed midgap */}
        <path d={EiPath} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="5 4" />
        <text x={W - MR + 3} y={eToY(Ei(dn)) + 3} className="fill-slate-400" style={{ fontSize: 10 }}>
          E_i
        </text>

        {/* E_c / E_v — solid */}
        <path d={Ec} fill="none" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={Ev} fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={W - MR + 3} y={eToY(Ei(dn) + eg / 2) + 3} className="fill-sky-600" style={{ fontSize: 11, fontWeight: 700 }}>
          E_c
        </text>
        <text x={W - MR + 3} y={eToY(Ei(-dp) - eg / 2) + 3} className="fill-rose-500" style={{ fontSize: 11, fontWeight: 700 }}>
          E_v
        </text>

        {/* qV_bi bending bracket */}
        <text x={x0} y={H - 6} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10 }}>
          ← כיפוף qV_bi →
        </text>
        <text x={MX + 4} y={TOP - 12} className="fill-rose-400" style={{ fontSize: 10, fontWeight: 700 }}>
          p
        </text>
        <text x={W - MR - 8} y={TOP - 12} className="fill-sky-500" style={{ fontSize: 10, fontWeight: 700 }}>
          n
        </text>
      </svg>
    </div>
  )
}
