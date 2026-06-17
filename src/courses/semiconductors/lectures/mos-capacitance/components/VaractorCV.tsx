import {
  mosThreshold,
  mosDepletionCharge,
  mosDepletionWidth,
  mosCapHF,
  capPerArea,
  type MosCvParams,
} from '../../../lib/junction'

/**
 * Junction-controlled capacitor (varactor): a reverse substrate/body bias V_R adds to the band
 * bending the surface must support, so the C-V curve shifts toward higher V_G and its inversion
 * floor C_min drops (W_max grows). Drawing a family V_R1<V_R2<V_R3 reproduces the lecturer's
 * sketch (summary p42-43) — the device behaves as a voltage-tunable capacitor.
 */
const W = 540
const H = 300
const mL = 50
const mR = 20
const mT = 24
const mB = 50
const COLORS = ['#0ea5e9', '#7c3aed', '#e11d48']

export default function VaractorCV({ vrs = [0, 1.5, 3], ...p }: MosCvParams & { vrs?: number[] }) {
  const VT0 = mosThreshold(p.VFB, p.phiF, mosDepletionCharge(2 * p.phiF, p.Na, p.epsR), p.Cox)
  const vMin = p.VFB - 2
  const vMax = VT0 + Math.max(...vrs) + 2.5
  const xL = mL
  const xR = W - mR
  const yT = mT
  const yB = H - mB
  const xOf = (v: number) => xL + ((v - vMin) / (vMax - vMin)) * (xR - xL)
  const yOf = (cN: number) => yB - cN * (yB - yT)

  const series = (a: number, b: number) => (a * b) / (a + b)
  const SAMPLES = 80

  const curveFor = (vr: number) => {
    const cminVr = series(p.Cox, capPerArea(p.epsR, mosDepletionWidth(2 * p.phiF + vr, p.Na, p.epsR)))
    const pts: string[] = []
    for (let i = 0; i < SAMPLES; i++) {
      const vg = vMin + ((vMax - vMin) * i) / (SAMPLES - 1)
      const base = mosCapHF(vg - vr, p) // shift right by V_R
      // below threshold use the shifted HF value; above threshold clamp to V_R-dependent floor
      const c = vg - vr >= VT0 ? cminVr : base
      pts.push(`${xOf(vg).toFixed(1)},${yOf(c / p.Cox).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <line x1={xL} y1={yT} x2={xL} y2={yB} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={xL} y1={yB} x2={xR} y2={yB} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={xL} y1={yOf(1)} x2={xR} y2={yOf(1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
        <text x={xR - 4} y={yOf(1) - 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 14, fontWeight: 700 }}>C<tspan dy={3} style={{ fontSize: 10 }}>ox</tspan></text>
        <text x={xL - 8} y={yT + 12} textAnchor="end" className="fill-slate-600" style={{ fontSize: 14, fontWeight: 700 }}>C/C<tspan dy={3} style={{ fontSize: 10 }}>ox</tspan></text>

        {vrs.map((vr, i) => (
          <path key={vr} d={curveFor(vr)} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth={3} strokeLinejoin="round" />
        ))}

        {/* arrow showing the shift direction */}
        <text x={(xL + xR) / 2} y={yB - 10} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12.5 }}>
          ⟵ עליית V<tspan dy={3} style={{ fontSize: 9 }}>R</tspan><tspan dy={-3}> מזיזה את העקומה ימינה ומורידה את הרצפה</tspan>
        </text>

        <text x={(xL + xR) / 2} y={H - 8} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 14, fontWeight: 600 }}>
          מתח שער V<tspan dy={3} style={{ fontSize: 10 }}>G</tspan>
        </text>
        <rect x={xR - 118} y={yT + 2} width={108} height={vrs.length * 20 + 8} rx={8} fill="#ffffff" fillOpacity={0.92} stroke="#e2e8f0" />
        {vrs.map((vr, i) => (
          <g key={vr} transform={`translate(${xR - 108}, ${yT + 16 + i * 20})`}>
            <line x1={0} y1={0} x2={22} y2={0} stroke={COLORS[i % COLORS.length]} strokeWidth={3} />
            <text x={30} y={5} className="fill-slate-700" style={{ fontSize: 13, fontWeight: 600 }}>V<tspan dy={3} style={{ fontSize: 9 }}>R</tspan><tspan dy={-3}> = {vr} V</tspan></text>
          </g>
        ))}
      </svg>
    </div>
  )
}
