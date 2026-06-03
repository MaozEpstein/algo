import {
  builtInVoltage,
  niAt,
  nonIdealCurrents,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

/**
 * The *measured* local ideality factor as a function of junction voltage — the
 * lecture's thesis made visible. n(V_j) = (1/V_T)·dV_term/d(ln J) rolls along the
 * curve: ≈2 at low forward (recombination), dips to ≈1 in the middle (diffusion),
 * then shoots up as the high-current R_s drop flattens the slope (apparent n
 * diverges). Plotted vs junction voltage (not terminal) so the roll spreads out
 * instead of being compressed into a sliver by the R_s stretch of the x-axis.
 */
interface Props {
  Na: number
  Nd: number
  mat: Material
  tau0: number
  rs: number
  Vj: number // operating point
  T?: number
}

const W = 460
const H = 170
const mL = 50
const mR = 16
const mT = 14
const mB = 38
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const N_MAX = 3 // y-axis top (n is clamped here; the R_s knee pushes n past it)

export default function IdealityCurve({ Na, Nd, mat, tau0, rs, Vj, T = 300 }: Props) {
  const VT = thermalVoltage(T)
  const Vbi = builtInVoltage(Na, Nd, niAt(mat, T), T)
  const Jref = 100
  const vMin = 0.1 // below this the e^{V/nV_T}−1 shape is ohmic (n→V/V_T), not meaningful
  const vCapJ = Math.min(Vbi - 0.04, 1.1)
  const NS = 140

  // local measured ideality at junction voltage vj (parametric in V_term)
  const J = (v: number) => nonIdealCurrents(Na, Nd, mat, v, tau0, T).Jtot
  const nOf = (vj: number) => {
    const h = 0.002
    const Jv = J(vj)
    const dJdV = (J(vj + h) - J(vj - h)) / (2 * h)
    if (Jv <= 0 || dJdV <= 0) return NaN
    return ((1 + rs * dJdV) * Jv) / (dJdV * VT) // (1/V_T)·dV_term/d(lnJ)
  }

  // build the sample list vs junction voltage (stop where J exceeds Jref, matching
  // the I–V plot's current ceiling); xMax is that junction voltage
  const data: { vj: number; n: number }[] = []
  let xMax = vCapJ
  for (let i = 0; i <= NS; i++) {
    const vj = vMin + ((vCapJ - vMin) * i) / NS
    const Jv = J(vj)
    if (Jv > Jref) { xMax = vj; break }
    const n = nOf(vj)
    if (Number.isFinite(n)) data.push({ vj, n })
    xMax = vj
  }

  const xOf = (v: number) => mL + ((v - vMin) / (xMax - vMin)) * PW
  const yOf = (n: number) => yBot - (Math.max(0, Math.min(N_MAX, n)) / N_MAX) * PH
  const path = 'M ' + data.map((d) => `${xOf(d.vj).toFixed(1)},${yOf(d.n).toFixed(1)}`).join(' L ')

  const vjOp = Math.max(vMin, Math.min(xMax, Vj))
  const opN = nOf(vjOp)

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* axes */}
        <line x1={mL} y1={yBot} x2={W - mR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL - 6} y={mT + 9} textAnchor="end" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>n</text>
        <text x={W - mR} y={yBot + 14} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11 }}>
          V<tspan dy={2} style={{ fontSize: 8 }}>j</tspan> (מתח-צומת)
        </text>

        {/* reference lines n=1 (diffusion) and n=2 (recombination) */}
        <line x1={mL} y1={yOf(1)} x2={W - mR} y2={yOf(1)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" opacity={0.8} />
        <text x={mL + 4} y={yOf(1) - 4} className="fill-amber-600" style={{ fontSize: 9, fontWeight: 700 }}>n=1 · דיפוזיה</text>
        <line x1={mL} y1={yOf(2)} x2={W - mR} y2={yOf(2)} stroke="#10b981" strokeWidth={1} strokeDasharray="4 3" opacity={0.8} />
        <text x={mL + 4} y={yOf(2) - 4} className="fill-emerald-600" style={{ fontSize: 9, fontWeight: 700 }}>n=2 · רקומבינציה</text>

        {/* the n(V) curve */}
        <path d={path} fill="none" stroke="#7c3aed" strokeWidth={2.75} strokeLinejoin="round" />

        {/* R_s rise annotation */}
        {rs > 0 && (
          <text x={W - mR - 2} y={mT + 11} textAnchor="end" className="fill-violet-600" style={{ fontSize: 9, fontWeight: 700 }}>
            עליית R<tspan dy={2} style={{ fontSize: 6 }}>S</tspan> ↑
          </text>
        )}

        {/* operating point */}
        {Number.isFinite(opN) && <circle cx={xOf(vjOp)} cy={yOf(opN)} r={4} fill="#7c3aed" />}
      </svg>
    </div>
  )
}
