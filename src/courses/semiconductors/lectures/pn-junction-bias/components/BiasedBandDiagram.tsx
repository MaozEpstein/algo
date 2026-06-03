import { niAt, thermalVoltage, type JunctionState, type Material } from '../../../lib/junction'

/**
 * Energy-band diagram of a PN junction UNDER BIAS. The bands bend by the active
 * drop q(V_bi − V_A): forward (V_A>0) flattens them, reverse (V_A<0) steepens
 * them. Out of equilibrium the Fermi level splits into two quasi-Fermi levels —
 * E_Fn (n-side) and E_Fp (p-side) — separated by exactly qV_A across the
 * junction. At V_A=0 they merge to a single flat E_F (the equilibrium picture).
 * Pass a BIASED `state` (from junctionState(Na,Nd,mat,Va)) plus the same `Va`.
 */
interface Props {
  state: JunctionState
  Va: number
  Na: number
  Nd: number
  mat: Material
  T?: number
  /** Fixed x-domain half-width (cm). When given, the x-axis does NOT auto-scale
   *  to the depletion, so the band visibly shrinks (forward) / widens (reverse)
   *  as V_A changes. Callers pass a reference computed independently of V_A. */
  xMaxRef?: number
}

const W = 560
const MX = 16
const MR = 44 // right margin for band labels
const H = 250
const TOP = 30
const PW = W - MX - MR

export default function BiasedBandDiagram({ state, Va, Na, mat, T = 300, xMaxRef }: Props) {
  const { Vbi, dn, dp, Emax } = state
  const VT = thermalVoltage(T)
  const drive = Math.max(Vbi - Va, 1e-6) // the active potential drop across the junction
  const phiP = VT * Math.log(Na / niAt(mat, T)) // E_i,p above E_Fp (eV)
  const eg = mat.eg

  const xMax = xMaxRef ?? Math.max(dn, dp, 1e-30) * 2.2
  const sx = (x: number) => MX + ((x + xMax) / (2 * xMax)) * PW

  // energies measured relative to E_Fp = 0. Span must cover both quasi-Fermi
  // levels (0 and V_A) and the full band edges.
  const eTop = phiP + eg / 2 + Math.max(Va, 0)
  const eBot = phiP - drive - eg / 2 + Math.min(Va, 0)
  const span = eTop - eBot || 1
  const drawH = H - TOP - 26
  const eToY = (e: number) => TOP + ((eTop - e) / span) * drawH

  // band-bending fraction ψ(x) ∈ [0,1], from the (biased) triangular field,
  // normalized by the active drop `drive`.
  const psi = (x: number): number => {
    if (x <= -dp) return 0
    if (x < 0) return (Emax * (x + dp) * (x + dp)) / (2 * dp) / drive
    if (x < dn) return ((Emax * dp) / 2 + (Emax * (dn * x - (x * x) / 2)) / dn) / drive
    return 1
  }
  const Ei = (x: number) => phiP - drive * psi(x)

  const N = 80
  const sample = (eOffset: number) =>
    Array.from({ length: N + 1 }, (_, i) => {
      const x = -dp + ((dn + dp) * i) / N
      const xx = i === 0 ? -xMax : i === N ? xMax : x
      return `${i ? 'L' : 'M'} ${sx(xx).toFixed(1)},${eToY(Ei(x) + eOffset).toFixed(1)}`
    }).join(' ')

  const Ec = sample(+eg / 2)
  const Ev = sample(-eg / 2)
  const EiPath = sample(0)
  const yFp = eToY(0) // p-side quasi-Fermi level
  const yFn = eToY(Va) // n-side quasi-Fermi level (offset by V_A)
  const xL = sx(-dp)
  const xR = sx(dn)
  const x0 = sx(0)
  const split = Math.abs(yFp - yFn) > 4 // show the qV_A gap only when it's visible

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* depletion region (data-driven: −d_p … +d_n) */}
        <rect x={xL} y={TOP - 6} width={Math.max(xR - xL, 0)} height={drawH + 12} fill="#ede9fe" opacity={0.75} />
        {[
          { gx: xL, c: '#a78bfa' },
          { gx: x0, c: '#cbd5e1' },
          { gx: xR, c: '#a78bfa' },
        ].map(({ gx, c }, i) => (
          <line key={i} x1={gx} y1={TOP - 6} x2={gx} y2={TOP + drawH + 6} stroke={c} strokeWidth={1} strokeDasharray="3 3" />
        ))}
        {xR > xL + 10 && (
          <text x={(xL + xR) / 2} y={TOP - 13} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 11.7, fontWeight: 700 }}>
            אזור המחסור
          </text>
        )}

        {/* E_Fp — p-side quasi-Fermi level (flat, left → through junction) */}
        <line x1={MX} y1={yFp} x2={xR} y2={yFp} stroke="#e11d48" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={MX + 2} y={yFp - 4} className="fill-rose-600" style={{ fontSize: 13, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 9.1 }}>Fp</tspan>
        </text>
        {/* E_Fn — n-side quasi-Fermi level (flat, through junction → right) */}
        <line x1={xL} y1={yFn} x2={W - MR} y2={yFn} stroke="#0284c7" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={W - MR + 3} y={yFn + 3} className="fill-sky-700" style={{ fontSize: 13, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 9.1 }}>Fn</tspan>
        </text>

        {/* qV_A split between the quasi-Fermi levels (shown only under bias) */}
        {split && (
          <>
            <line x1={x0 + 24} y1={yFp} x2={x0 + 24} y2={yFn} stroke="#16a34a" strokeWidth={1.5} markerStart="url(#bb-cap)" markerEnd="url(#bb-cap)" />
            <text x={x0 + 28} y={(yFp + yFn) / 2 + 3} className="fill-emerald-600" style={{ fontSize: 11.7, fontWeight: 700 }}>
              qV<tspan dy={2.5} style={{ fontSize: 9.1 }}>A</tspan>
            </text>
          </>
        )}

        {/* E_i — dashed midgap */}
        <path d={EiPath} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="5 4" />
        <text x={W - MR + 3} y={eToY(Ei(dn)) + 3} className="fill-slate-400" style={{ fontSize: 13 }}>
          E<tspan dy={3} style={{ fontSize: 9.1 }}>i</tspan>
        </text>

        {/* E_c / E_v — solid */}
        <path d={Ec} fill="none" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={Ev} fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={W - MR + 3} y={eToY(Ei(dn) + eg / 2) + 3} className="fill-sky-600" style={{ fontSize: 14.3, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 10.4 }}>c</tspan>
        </text>
        <text x={W - MR + 3} y={eToY(Ei(-dp) - eg / 2) + 3} className="fill-rose-500" style={{ fontSize: 14.3, fontWeight: 700 }}>
          E<tspan dy={3} style={{ fontSize: 10.4 }}>v</tspan>
        </text>

        {/* barrier label */}
        <text x={x0} y={H - 7} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13 }}>
          ← מחסום q(V<tspan dy={2.5} style={{ fontSize: 10.4 }}>bi</tspan><tspan dy={-2.5}>−V</tspan><tspan dy={2.5} style={{ fontSize: 10.4 }}>A</tspan><tspan dy={-2.5}>) →</tspan>
        </text>
        <text x={MX + 4} y={TOP - 14} className="fill-rose-400" style={{ fontSize: 13, fontWeight: 700 }}>
          p
        </text>
        <text x={W - MR - 8} y={TOP - 14} className="fill-sky-500" style={{ fontSize: 13, fontWeight: 700 }}>
          n
        </text>

        <defs>
          <marker id="bb-cap" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,5 L10,5" stroke="#16a34a" strokeWidth="2" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
