/**
 * The excess minority-carrier profile Δp(x) stored in the neutral region during
 * forward conduction. The shaded area IS the stored charge Q = I_F·τ that must be
 * swept out before the diode can block — the root of the turn-off delay.
 */
const W = 320
const H = 150
const mL = 30
const mR = 16
const mT = 16
const mB = 28
const PW = W - mL - mR
const PH = H - mT - mB
const SKY = '#0ea5e9'

export default function MinorityStorageProfile() {
  const x0 = mL
  const yBase = mT + PH
  const amp = PH * 0.86
  const L = 0.42 // decay length as a fraction of the pane
  const N = 48
  const pts: [number, number][] = []
  for (let k = 0; k <= N; k++) {
    const f = k / N
    const dp = Math.exp(-f / L)
    pts.push([x0 + f * PW, yBase - dp * amp])
  }
  const curve = 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')
  const area = curve + ` L ${(x0 + PW).toFixed(1)},${yBase} L ${x0},${yBase} Z`

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <linearGradient id="msp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKY} stopOpacity="0.32" />
            <stop offset="100%" stopColor={SKY} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfcff" stroke="#eef2f7" />
        {/* axes */}
        <line x1={x0} y1={mT} x2={x0} y2={yBase} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={x0} y1={yBase} x2={W - mR} y2={yBase} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={x0 - 4} y={mT + 8} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>Δp</text>
        <text x={W - mR} y={yBase + 18} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>מרחק מקצה המחסור</text>
        {/* area = stored charge */}
        <path d={area} fill="url(#msp-fill)" />
        <path d={curve} fill="none" stroke={SKY} strokeWidth={2.5} strokeLinejoin="round" />
        <text x={x0 + PW * 0.34} y={yBase - amp * 0.42} className="fill-violet-700" style={{ fontSize: 13, fontWeight: 800 }}>Q = I<tspan dy={3} style={{ fontSize: 9 }}>F</tspan><tspan dy={-3}>·τ</tspan></text>
        <text x={x0 + PW * 0.5} y={yBase - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9.5 }}>המטען האגור — נשטף בזמן t<tspan dy={2} style={{ fontSize: 7.5 }}>s</tspan></text>
      </svg>
    </div>
  )
}
