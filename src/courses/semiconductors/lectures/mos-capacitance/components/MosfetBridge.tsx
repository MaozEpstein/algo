/**
 * The bridge from MOS capacitor to MOSFET: the same gate/oxide/p-substrate stack, but with two
 * n⁺ regions (source & drain) added at the ends. Once V_G>V_T the inversion electron layer links
 * them into a conducting channel — current flows source↔drain, controlled by the gate. Schematic.
 */
const W = 380
const H = 200
const SKY = '#0284c7'

export default function MosfetBridge() {
  const subTop = 70
  const xL = 24
  const xR = W - 24
  const nW = 64 // n⁺ region width
  const chTop = subTop
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* p-type substrate */}
        <rect x={xL} y={subTop} width={xR - xL} height={H - subTop - 24} fill="#eff6ff" stroke="#93c5fd" />
        <text x={(xL + xR) / 2} y={H - 30} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 12, fontWeight: 700 }}>מצע p-Si</text>

        {/* n⁺ source / drain */}
        {[{ x: xL, lab: 'S', he: 'מקור' }, { x: xR - nW, lab: 'D', he: 'ניקוז' }].map((r) => (
          <g key={r.lab}>
            <rect x={r.x} y={subTop} width={nW} height={42} fill="#bae6fd" stroke={SKY} />
            <text x={r.x + nW / 2} y={subTop + 26} textAnchor="middle" fill={SKY} style={{ fontSize: 13, fontWeight: 800 }}>n⁺</text>
            <text x={r.x + nW / 2} y={subTop - 6} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 12, fontWeight: 700 }}>{r.lab} <tspan className="fill-slate-400" style={{ fontSize: 9 }}>{r.he}</tspan></text>
          </g>
        ))}

        {/* inversion channel between S and D (the MOS-cap inversion layer!) */}
        <rect x={xL + nW} y={chTop} width={xR - nW - (xL + nW)} height={6} fill="#34d399" />
        <text x={(xL + xR) / 2} y={chTop + 24} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 11, fontWeight: 700 }}>ערוץ-היפוך (אלקטרונים)</text>

        {/* gate stack: oxide + metal, over the channel */}
        <rect x={xL + nW} y={subTop - 12} width={xR - nW - (xL + nW)} height={5} fill="#fef9c3" stroke="#eab308" />
        <rect x={xL + nW} y={subTop - 30} width={xR - nW - (xL + nW)} height={16} fill="#cbd5e1" stroke="#64748b" />
        <line x1={(xL + xR) / 2} y1={subTop - 30} x2={(xL + xR) / 2} y2={subTop - 48} stroke="#334155" strokeWidth={2} />
        <circle cx={(xL + xR) / 2} cy={subTop - 50} r={3.5} fill="#1e293b" />
        <text x={(xL + xR) / 2} y={subTop - 56} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 12, fontWeight: 800 }}>
          G · שער (V<tspan dy={2} style={{ fontSize: 8 }}>G</tspan><tspan dy={-2}> &gt; V</tspan><tspan dy={2} style={{ fontSize: 8 }}>T</tspan><tspan dy={-2}>)</tspan>
        </text>

        {/* electron current arrow S→D */}
        <defs>
          <marker id="mosfet-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1,1 L9,5 L1,9 Z" fill="#10b981" />
          </marker>
        </defs>
        <line x1={xL + nW + 6} y1={chTop + 3} x2={xR - nW - 6} y2={chTop + 3} stroke="#10b981" strokeWidth={2} markerEnd="url(#mosfet-arr)" opacity={0.85} />
      </svg>
    </div>
  )
}
