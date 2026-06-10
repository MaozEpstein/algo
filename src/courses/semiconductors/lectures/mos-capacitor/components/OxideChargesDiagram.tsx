/**
 * The four oxide/interface charges of a real MOS capacitor (faithful to the lecturer's p.34 figure):
 * a vertical stack  G (metal) → SiO₂ → thin SiOₓ → Si/SiO₂ interface → p-Si, with each charge drawn
 * in place and a colour-coded leader label:
 *   Q_ox  — trapped charge in the oxide bulk (± , slate)
 *   Q_m   — mobile ions Na⁺,K⁺ in the oxide (⊕ , amber, with mobility arrows)
 *   Q_f   — fixed charge in the SiOₓ transition layer (+ , emerald)
 *   Q_it  — interface-trapped charge at the Si surface (×××× , rose)
 * Subscripts via <tspan>.
 */
const W = 500
const H = 392
const xL = 196
const xR = 372 // device 176 wide
const xMid = (xL + xR) / 2

// layer y-bands
const yGate0 = 44
const yGate1 = 74
const ySiO2 = 232 // SiO₂ bottom
const ySiOx = 258 // SiOₓ bottom (thin transition layer)
const ySub = 356 // substrate bottom

const SLATE = '#475569'
const AMBER = '#d97706'
const EMER = '#059669'
const ROSE = '#e11d48'

function Leader({ y, color, label, sub, toX = xL }: { y: number; color: string; label: string; sub: string; toX?: number }) {
  return (
    <>
      <line x1={104} y1={y} x2={toX} y2={y} stroke={color} strokeWidth={1.1} strokeDasharray="2 2" opacity={0.7} />
      <circle cx={toX} cy={y} r={2.2} fill={color} />
      <text x={100} y={y + 4} textAnchor="end" fill={color} style={{ fontSize: 14, fontWeight: 800 }}>
        Q<tspan dy={3} style={{ fontSize: 9 }}>{sub}</tspan>
        <tspan dy={-3} dx={4} style={{ fontSize: 10, fontWeight: 600 }}>{label}</tspan>
      </text>
    </>
  )
}

export default function OxideChargesDiagram() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <pattern id="ox-gate" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#cbd5e1" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="1.1" />
          </pattern>
          <marker id="ox-mob" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L7,4 L1,7 Z" fill={AMBER} /></marker>
        </defs>

        {/* gate contact + G */}
        <line x1={xMid} y1={26} x2={xMid} y2={yGate0} stroke={SLATE} strokeWidth={1.5} />
        <circle cx={xMid} cy={24} r={3} fill={SLATE} />
        <text x={xMid + 8} y={26} className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>G</text>

        {/* layers */}
        <rect x={xL} y={yGate0} width={xR - xL} height={yGate1 - yGate0} fill="url(#ox-gate)" stroke={SLATE} strokeWidth={1.5} />
        <text x={xL - 8} y={(yGate0 + yGate1) / 2 + 4} textAnchor="end" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>M</text>

        <rect x={xL} y={yGate1} width={xR - xL} height={ySiO2 - yGate1} fill="#eef4fb" stroke="#cbd5e1" strokeWidth={1} />
        <text x={xR + 8} y={(yGate1 + ySiO2) / 2} className="fill-sky-700" style={{ fontSize: 12, fontWeight: 800 }}>SiO₂</text>

        <rect x={xL} y={ySiO2} width={xR - xL} height={ySiOx - ySiO2} fill="#dbeafe" stroke="#cbd5e1" strokeWidth={1} />
        <text x={xR + 8} y={(ySiO2 + ySiOx) / 2 + 4} className="fill-sky-600" style={{ fontSize: 10.5, fontWeight: 700 }}>SiOₓ</text>

        <rect x={xL} y={ySiOx} width={xR - xL} height={ySub - ySiOx} fill="#fff1f2" stroke="#fecdd3" strokeWidth={1} />
        <text x={xMid} y={(ySiOx + ySub) / 2 + 5} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 13, fontWeight: 800 }}>p-Si</text>
        <text x={xMid} y={(ySiOx + ySub) / 2 + 21} textAnchor="middle" className="fill-rose-400" style={{ fontSize: 9.5, fontWeight: 600 }}>(p-type)</text>

        {/* Q_m — mobile ions Na⁺, K⁺ (amber, with mobility arrows) */}
        {[{ x: xMid - 30, t: 'Na' }, { x: xMid + 26, t: 'K' }].map((m) => (
          <g key={m.t}>
            <circle cx={m.x} cy={104} r={9} fill="#fef3c7" stroke={AMBER} strokeWidth={1.4} />
            <text x={m.x} y={108} textAnchor="middle" fill={AMBER} style={{ fontSize: 11, fontWeight: 800 }}>+</text>
            <text x={m.x + 12} y={98} fill={AMBER} style={{ fontSize: 9, fontWeight: 700 }}>{m.t}<tspan dy={-3} style={{ fontSize: 7 }}>+</tspan></text>
            <line x1={m.x - 14} y1={118} x2={m.x + 14} y2={118} stroke={AMBER} strokeWidth={1} markerEnd="url(#ox-mob)" opacity={0.8} />
          </g>
        ))}

        {/* Q_ox — trapped charge in the bulk oxide (± slate) */}
        {[{ x: xMid - 20, s: '−' }, { x: xMid + 18, s: '+' }].map((c, i) => (
          <text key={i} x={c.x} y={172} textAnchor="middle" fill={SLATE} style={{ fontSize: 16, fontWeight: 800 }}>{c.s}</text>
        ))}

        {/* Q_f — fixed charge in the SiOₓ layer (+ emerald) */}
        {[-36, -12, 12, 36].map((dx) => (
          <text key={dx} x={xMid + dx} y={(ySiO2 + ySiOx) / 2 + 4} textAnchor="middle" fill={EMER} style={{ fontSize: 12, fontWeight: 800 }}>+</text>
        ))}

        {/* Q_it — interface traps at the Si surface (×××× rose) */}
        {Array.from({ length: 9 }, (_, i) => xL + 14 + i * ((xR - xL - 28) / 8)).map((x, i) => (
          <text key={i} x={x} y={ySiOx + 5} textAnchor="middle" fill={ROSE} style={{ fontSize: 11, fontWeight: 800 }}>×</text>
        ))}

        {/* leader labels (left) */}
        <Leader y={104} color={AMBER} label="ניידים" sub="m" />
        <Leader y={172} color={SLATE} label="בנפח" sub="ox" />
        <Leader y={(ySiO2 + ySiOx) / 2} color={EMER} label="קבוע" sub="f" />
        <Leader y={ySiOx} color={ROSE} label="ממשק" sub="it" />
      </svg>
    </div>
  )
}
