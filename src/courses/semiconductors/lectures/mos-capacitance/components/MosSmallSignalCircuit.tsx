/**
 * The MOS-capacitor small-signal equivalent circuit (lecturer's sketch, summary p41-42):
 * the gate sees C_ox in SERIES with the parallel combination of the semiconductor capacitance
 * C_s and the interface-state capacitance C_ss. 1/C = 1/C_ox + 1/(C_s + C_ss).
 * `highlight` optionally emphasises which branch dominates in the current regime.
 */
const W = 360
const H = 240

function Cap({ x, y, label, sub, color, dim }: { x: number; y: number; label: string; sub?: string; color: string; dim?: boolean }) {
  const o = dim ? 0.35 : 1
  return (
    <g opacity={o}>
      <line x1={x} y1={y - 22} x2={x} y2={y - 7} stroke="#334155" strokeWidth={2} />
      <line x1={x - 16} y1={y - 7} x2={x + 16} y2={y - 7} stroke={color} strokeWidth={3} />
      <line x1={x - 16} y1={y + 7} x2={x + 16} y2={y + 7} stroke={color} strokeWidth={3} />
      <line x1={x} y1={y + 7} x2={x} y2={y + 22} stroke="#334155" strokeWidth={2} />
      <text x={x + 22} y={y + 1} className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>
        {label}{sub && <tspan dy={3} style={{ fontSize: 9 }}>{sub}</tspan>}
      </text>
    </g>
  )
}

export default function MosSmallSignalCircuit({ highlight }: { highlight?: 'ox' | 'dep' | 'inv' }) {
  const nodeY = 96
  const botY = 196
  const xC = 80 // C_ox column
  const xS = 200 // C_s branch
  const xSS = 290 // C_ss branch
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* gate terminal */}
        <circle cx={xC} cy={26} r={4} fill="#1e293b" />
        <text x={xC} y={18} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 12, fontWeight: 800 }}>G (שער)</text>
        <line x1={xC} y1={30} x2={xC} y2={48} stroke="#334155" strokeWidth={2} />

        {/* C_ox */}
        <Cap x={xC} y={70} label="C" sub="ox" color="#7c3aed" dim={highlight === 'inv'} />

        {/* node line to the parallel branches */}
        <line x1={xC} y1={nodeY} x2={xSS} y2={nodeY} stroke="#334155" strokeWidth={2} />
        <circle cx={xC} cy={nodeY} r={3} fill="#334155" />
        <text x={(xS + xSS) / 2} y={nodeY - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>פני-השטח</text>

        {/* C_s and C_ss in parallel */}
        <line x1={xS} y1={nodeY} x2={xS} y2={nodeY + 8} stroke="#334155" strokeWidth={2} />
        <Cap x={xS} y={nodeY + 30} label="C" sub="s" color="#0ea5e9" dim={highlight === 'ox'} />
        <line x1={xSS} y1={nodeY} x2={xSS} y2={nodeY + 8} stroke="#334155" strokeWidth={2} />
        <Cap x={xSS} y={nodeY + 30} label="C" sub="ss" color="#f59e0b" dim={highlight === 'ox'} />

        {/* tie to ground rail */}
        <line x1={xS} y1={nodeY + 52} x2={xS} y2={botY} stroke="#334155" strokeWidth={2} />
        <line x1={xSS} y1={nodeY + 52} x2={xSS} y2={botY} stroke="#334155" strokeWidth={2} />
        <line x1={xS} y1={botY} x2={xSS} y2={botY} stroke="#334155" strokeWidth={2} />
        {/* ground symbol */}
        <line x1={(xS + xSS) / 2} y1={botY} x2={(xS + xSS) / 2} y2={botY + 10} stroke="#334155" strokeWidth={2} />
        <line x1={(xS + xSS) / 2 - 14} y1={botY + 10} x2={(xS + xSS) / 2 + 14} y2={botY + 10} stroke="#334155" strokeWidth={2} />
        <line x1={(xS + xSS) / 2 - 9} y1={botY + 14} x2={(xS + xSS) / 2 + 9} y2={botY + 14} stroke="#334155" strokeWidth={2} />
        <line x1={(xS + xSS) / 2 - 4} y1={botY + 18} x2={(xS + xSS) / 2 + 4} y2={botY + 18} stroke="#334155" strokeWidth={2} />

        {/* formula */}
        <text x={W / 2} y={H - 2} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11.5, fontWeight: 600 }}>
          1/C = 1/C<tspan dy={3} style={{ fontSize: 8 }}>ox</tspan><tspan dy={-3}> + 1/(C</tspan><tspan dy={3} style={{ fontSize: 8 }}>s</tspan><tspan dy={-3}> + C</tspan><tspan dy={3} style={{ fontSize: 8 }}>ss</tspan><tspan dy={-3}>)</tspan>
        </text>
      </svg>
    </div>
  )
}
