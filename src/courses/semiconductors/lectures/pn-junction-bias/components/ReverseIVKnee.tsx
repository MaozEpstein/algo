/**
 * Schematic diode I–V focused on the reverse side: a tiny, almost-flat leakage
 * current for V_A<0, then a sharp "knee" at V_A = −V_BR where the reverse
 * current plunges (breakdown). A hint of the forward rise on the right. Purely
 * illustrative (no scale).
 */
const W = 460
const H = 240
const MX = 40
const MR = 16
const MT = 16
const MB = 40
const PW = W - MX - MR
const PH = H - MT - MB

// axes origin (V_A = 0, I = 0) placed toward the right so the reverse side is wide
const X0 = MX + PW * 0.72 // x of V_A = 0
const Y0 = MT + PH * 0.42 // y of I = 0
const XBR = MX + PW * 0.14 // x of −V_BR (the knee)

export default function ReverseIVKnee() {
  // reverse leakage: almost flat just below 0, then the knee dives down at XBR
  const leak = `M ${X0},${Y0} L ${XBR + 26},${Y0 + 5}`
  const knee = `M ${XBR + 26},${Y0 + 5} C ${XBR + 4},${Y0 + 6} ${XBR},${Y0 + 24} ${XBR},${MT + PH}`
  // forward hint: exponential-ish rise just right of 0
  const fwd = `M ${X0},${Y0} C ${X0 + 26},${Y0} ${X0 + 40},${Y0 - 30} ${X0 + 46},${MT}`

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* axes */}
        <line x1={MX} y1={Y0} x2={W - MR} y2={Y0} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={X0} y1={MT} x2={X0} y2={H - MB} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={W - MR} y={Y0 - 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 12 }}>
          V<tspan dy={2} style={{ fontSize: 9 }}>A</tspan>
        </text>
        <text x={X0 + 6} y={MT + 8} className="fill-slate-400" style={{ fontSize: 12 }}>I</text>

        {/* breakdown region shading + knee voltage marker */}
        <rect x={MX} y={MT} width={XBR - MX} height={PH} fill="#fef2f2" opacity={0.7} />
        <line x1={XBR} y1={MT} x2={XBR} y2={H - MB} stroke="#f43f5e" strokeWidth={1.25} strokeDasharray="4 3" />
        <text x={XBR} y={Y0 - 8} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 12, fontWeight: 700 }}>
          −V<tspan dy={2} style={{ fontSize: 9 }}>BR</tspan>
        </text>

        {/* curves */}
        <path d={fwd} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 3" />
        <path d={leak} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />
        <path d={knee} fill="none" stroke="#f43f5e" strokeWidth={3} />

        {/* labels */}
        <text x={(XBR + 26 + X0) / 2} y={Y0 + 20} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 11 }}>
          זרם דליפה זעיר
        </text>
        <text x={XBR - 6} y={MT + PH - 8} textAnchor="end" className="fill-rose-600" style={{ fontSize: 12, fontWeight: 700 }}>
          ברך הפריצה
        </text>
        <text x={X0 + 30} y={MT + 18} className="fill-slate-400" style={{ fontSize: 11 }}>קדמי</text>
      </svg>
    </div>
  )
}
