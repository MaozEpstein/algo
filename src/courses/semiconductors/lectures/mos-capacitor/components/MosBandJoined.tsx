/**
 * The joined MOS band diagram (equilibrium / built-in bending) — faithful to the lecturer's
 * figure: metal Fermi sea | hatched SiO₂ barrier (with the qV_ox drop) | p-Si whose bands bend
 * DOWN near the surface. Labelled dimension arrows: φ_M, qV_ox, χ_S, E_g/2, qφ_F (bulk offsets)
 * and qψ_s (surface bending). The vacuum level (dashed) runs along the top. Drawing heights are
 * artistic (χ_S compressed), as in the board sketch. Pure schematic; subscripts via <tspan>.
 */
const W = 600
const H = 330
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const SLATE = '#475569'
const TEAL = '#0369a1'
const GREEN = '#059669'

const xM0 = 24
const xM1 = 118
const xOx1 = 202 // oxide right = surface
const xBend = 340 // bending settles here
const xR = 540

// pixel energy levels (y; smaller = higher energy)
const yEF = 206
const yEcBulk = 146
const yEiBulk = 184
const yEvBulk = 222
const VAC_OFF = 72 // χ_S drawing height (vacuum above E_c)
const BEND = 18 // surface band bending (qψ_s)
const yVacBulk = yEcBulk - VAC_OFF
const yVacMetal = 60

/** Sampled points of a band: bends (ease-out) from the surface down to its bulk level, then flat. */
function bandPts(bulk: number): [number, number][] {
  const surf = bulk + BEND
  const N = 28
  const pts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const x = xOx1 + ((xBend - xOx1) * i) / N
    const u = i / N
    pts.push([x, surf + (bulk - surf) * (1 - (1 - u) * (1 - u))])
  }
  pts.push([xR, bulk])
  return pts
}
const path = (pts: [number, number][]) => 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

function Dim({ x, y1, y2, label, sub, color }: { x: number; y1: number; y2: number; label: string; sub?: string; color: string }) {
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1.75} markerStart="url(#mj-cap)" markerEnd="url(#mj-cap)" />
      <text x={x + 5} y={(y1 + y2) / 2 + 4} fill={color} style={{ fontSize: 12.5, fontWeight: 800 }}>{label}{sub && <tspan dy={3} style={{ fontSize: 8 }}>{sub}</tspan>}</text>
    </>
  )
}

export default function MosBandJoined() {
  const ecPts = bandPts(yEcBulk)
  const evPts = bandPts(yEvBulk)
  const vacPts = bandPts(yVacBulk)
  const yVacSurf = yVacBulk + BEND
  const gapFill = path(ecPts) + ' ' + [...evPts].reverse().map((p) => `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
  const vacPath = `M ${xM0} ${yVacMetal} L ${xM1} ${yVacMetal} L ${xOx1} ${yVacSurf} ` + vacPts.map((p) => `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="mj-cap" viewBox="0 0 8 8" refX="6.6" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#475569" /></marker>
          <pattern id="mj-ox" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#e2e8f0" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.3" />
          </pattern>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* vacuum level */}
        <path d={vacPath} fill="none" stroke={SLATE} strokeWidth={1.4} strokeDasharray="7 4" />
        <text x={xM0 + 2} y={yVacMetal - 5} className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>רמת ואקום</text>

        {/* metal Fermi sea */}
        <rect x={xM0} y={yEF} width={xM1 - xM0} height={H - 40 - yEF} fill="#cbd5e1" fillOpacity={0.55} />
        <line x1={xM0} y1={yEF} x2={xM1} y2={yEF} stroke={SLATE} strokeWidth={2.5} />
        <text x={xM0 + 4} y={H - 26} className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>מתכת</text>
        <text x={xM0 + 4} y={yEF - 5} className="fill-slate-700" style={{ fontSize: 11, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 7 }}>Fm</tspan></text>
        <Dim x={xM0 + 34} y1={yVacMetal} y2={yEF} label="φ" sub="M" color={SLATE} />

        {/* oxide barrier (the middle partition — emphasised) + qV_ox */}
        <rect x={xM1} y={yVacMetal} width={xOx1 - xM1} height={H - 40 - yVacMetal} fill="url(#mj-ox)" stroke="#475569" strokeWidth={1.5} />
        <line x1={xM1} y1={yVacMetal} x2={xM1} y2={H - 40} stroke="#334155" strokeWidth={2.5} />
        <line x1={xOx1} y1={yVacMetal} x2={xOx1} y2={H - 40} stroke="#334155" strokeWidth={2.5} />
        <text x={(xM1 + xOx1) / 2} y={H - 26} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11.5, fontWeight: 800 }}>SiO₂</text>
        <line x1={(xM1 + xOx1) / 2} y1={yVacMetal} x2={(xM1 + xOx1) / 2} y2={yVacSurf} stroke={GREEN} strokeWidth={1.6} markerStart="url(#mj-cap)" markerEnd="url(#mj-cap)" />
        <text x={(xM1 + xOx1) / 2 + 5} y={(yVacMetal + yVacSurf) / 2 + 4} fill={GREEN} style={{ fontSize: 11, fontWeight: 800 }}>qV<tspan dy={2} style={{ fontSize: 7 }}>ox</tspan></text>

        {/* semiconductor gap + bands */}
        <path d={gapFill} fill="#fff1f2" fillOpacity={0.5} stroke="none" />
        <path d={path(ecPts)} fill="none" stroke={SKY} strokeWidth={3} strokeLinejoin="round" />
        <path d={path(bandPts(yEiBulk))} fill="none" stroke={SLATE} strokeWidth={1.25} strokeDasharray="4 3" />
        <path d={path(evPts)} fill="none" stroke={ROSE} strokeWidth={3} strokeLinejoin="round" />
        <line x1={xOx1} y1={yEF} x2={xR} y2={yEF} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={xR + 2} y={yEcBulk + 2} className="fill-sky-700" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>c</tspan></text>
        <text x={xR + 2} y={yEiBulk + 4} className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>i</tspan></text>
        <text x={xR + 2} y={yEF - 3} className="fill-slate-800" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>F</tspan></text>
        <text x={xR + 2} y={yEvBulk + 6} className="fill-rose-600" style={{ fontSize: 12, fontWeight: 700 }}>E<tspan dy={2} style={{ fontSize: 8 }}>v</tspan></text>

        {/* bulk dimension arrows */}
        <Dim x={xR - 24} y1={yVacBulk} y2={yEcBulk} label="χ" sub="S" color={TEAL} />
        <Dim x={xR - 66} y1={yEcBulk} y2={yEiBulk} label="E" sub="g/2" color={SLATE} />
        <Dim x={xR - 66} y1={yEiBulk} y2={yEF} label="qφ" sub="F" color={SLATE} />

        {/* surface bending qψ_s */}
        <line x1={xOx1 + 16} y1={yEiBulk} x2={xOx1 + 16} y2={yEiBulk + BEND} stroke={GREEN} strokeWidth={1.6} markerStart="url(#mj-cap)" markerEnd="url(#mj-cap)" />
        <text x={xOx1 + 21} y={yEiBulk + BEND / 2 + 4} fill={GREEN} style={{ fontSize: 11, fontWeight: 800 }}>qψ<tspan dy={2} style={{ fontSize: 7 }}>s</tspan></text>
      </svg>
    </div>
  )
}
