/**
 * The MOS-capacitor device schematic (lateral): Gate metal | SiO₂ | p-type Si, with the
 * gate bias V_G, the x-axis (x=0 at the metal–oxide face, t_ox at the oxide–Si face), and a
 * substrate ground. Matches the summary's structure sketch. Pure schematic.
 */
const W = 460
const H = 250
const SLATE = '#334155'
const ROSE = '#f43f5e'

export default function MosStructure() {
  const yTop = 60
  const yBot = 160
  const xM0 = 120
  const xM1 = 170 // metal
  const xOx1 = 196 // oxide right (x=0 at xM1, t_ox at xOx1)
  const xS1 = 380 // semiconductor right

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <pattern id="mos-ox" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#e2e8f0" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.1" />
          </pattern>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* metal gate */}
        <rect x={xM0} y={yTop} width={xM1 - xM0} height={yBot - yTop} fill={SLATE} fillOpacity={0.82} />
        <text x={(xM0 + xM1) / 2} y={yTop - 24} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>שער (Metal)</text>
        {/* gate lead + V_G */}
        <line x1={(xM0 + xM1) / 2} y1={yTop} x2={(xM0 + xM1) / 2} y2={yTop - 18} stroke={SLATE} strokeWidth={2.25} />
        <circle cx={(xM0 + xM1) / 2} cy={yTop - 18} r={4} fill={SLATE} />
        <text x={(xM0 + xM1) / 2 + 8} y={yTop - 30} className="fill-slate-800" style={{ fontSize: 13, fontWeight: 800 }}>G</text>
        <text x={xM0 - 10} y={(yTop + yBot) / 2 + 4} textAnchor="end" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 9 }}>G</tspan></text>
        <line x1={xM0 - 6} y1={(yTop + yBot) / 2} x2={xM0} y2={(yTop + yBot) / 2} stroke={SLATE} strokeWidth={2.25} />

        {/* oxide */}
        <rect x={xM1} y={yTop} width={xOx1 - xM1} height={yBot - yTop} fill="url(#mos-ox)" stroke="#94a3b8" strokeOpacity={0.5} strokeWidth={0.75} />
        <text x={(xM1 + xOx1) / 2} y={yTop - 8} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>SiO₂</text>

        {/* p-type semiconductor */}
        <rect x={xOx1} y={yTop} width={xS1 - xOx1} height={yBot - yTop} fill={ROSE} fillOpacity={0.13} stroke={ROSE} strokeOpacity={0.4} />
        <text x={(xOx1 + xS1) / 2} y={(yTop + yBot) / 2 + 5} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 14, fontWeight: 800 }}>p-type Si</text>
        {/* substrate ground */}
        <line x1={xS1} y1={(yTop + yBot) / 2} x2={xS1 + 28} y2={(yTop + yBot) / 2} stroke={SLATE} strokeWidth={2.25} />
        <line x1={xS1 + 28} y1={(yTop + yBot) / 2 - 9} x2={xS1 + 28} y2={(yTop + yBot) / 2 + 9} stroke={SLATE} strokeWidth={2} />
        <line x1={xS1 + 33} y1={(yTop + yBot) / 2 - 5} x2={xS1 + 33} y2={(yTop + yBot) / 2 + 5} stroke={SLATE} strokeWidth={2} />

        {/* x-axis with x=0 and t_ox */}
        <line x1={xM1} y1={yBot + 22} x2={xS1} y2={yBot + 22} stroke="#cbd5e1" strokeWidth={1.25} markerEnd="url(#)" />
        <line x1={xM1} y1={yBot} x2={xM1} y2={yBot + 28} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={xOx1} y1={yBot} x2={xOx1} y2={yBot + 28} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
        <text x={xM1} y={yBot + 40} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11 }}>x=0</text>
        <text x={xOx1} y={yBot + 40} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11 }}>t<tspan dy={2} style={{ fontSize: 8 }}>ox</tspan></text>
        <text x={xS1} y={yBot + 40} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11 }}>x →</text>
      </svg>
    </div>
  )
}
