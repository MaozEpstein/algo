/**
 * The depletion-approximation cascade for an abrupt PN junction, drawn as three
 * stacked panels sharing one position axis (p-side left, n-side right, junction
 * at x=0): ρ(x) space charge → E(x) field → V(x) potential. `reveal` (1/2/3)
 * shows them progressively for the "integrate twice" story. Pure SVG; the caller
 * supplies the depletion widths, peak field and built-in voltage (cm, V/cm, V).
 * Reusable across the course (e.g. the MOS-cap depletion later).
 */
interface Props {
  dn: number // n-side depletion width (cm)
  dp: number // p-side depletion width (cm)
  Emax: number // peak field magnitude (V/cm)
  Vbi: number // total built-in (or junction) potential (V)
  Na: number
  Nd: number
  /** 1 = ρ only · 2 = +E · 3 = +V (default 3 = all). */
  reveal?: number
}

const W = 560
const MX = 44 // left margin (panel labels)
const MR = 16
const PH = 84 // each panel's drawable height
const GAP = 30 // vertical gap (axis + labels) between panels
const PW = W - MX - MR

const ROSE = '#fb7185'
const SKY = '#38bdf8'
const AMBER = '#f59e0b'
const EMER = '#10b981'

export default function JunctionElectrostatics({ dn, dp, Emax, Vbi, Na, Nd, reveal = 3 }: Props) {
  const xMax = Math.max(dn, dp, 1e-30) * 1.45 // domain half-width (cm), with neutral margins
  const sx = (x: number) => MX + ((x + xMax) / (2 * xMax)) * PW
  const x0 = sx(0)
  const xL = sx(-dp)
  const xR = sx(dn)

  const H = 3 * PH + 2 * GAP + 30
  const topOf = (row: number) => row * (PH + GAP) + 6

  // ρ box heights (∝ doping), scaled to the panel
  const chargeScale = (PH * 0.42) / Math.max(Na, Nd, 1)
  const hP = Nd * chargeScale // n-side donor box (positive)
  const hN = Na * chargeScale // p-side acceptor box (negative)

  // V(x) sampled from the triangular field (piecewise parabola), in volts
  const vAt = (x: number): number => {
    if (x <= -dp) return 0
    if (x < 0) return (Emax * (x + dp) * (x + dp)) / (2 * dp)
    if (x < dn) return (Emax * dp) / 2 + (Emax * (dn * x - (x * x) / 2)) / dn
    return Vbi
  }
  // build V path in pixel space (row 2)
  const vBase = topOf(2) + PH - 6
  const vPath = Array.from({ length: 61 }, (_, i) => {
    const x = -dp + ((dn + dp) * i) / 60
    const y = vBase - (vAt(x) / (Vbi || 1)) * (PH * 0.82)
    return `${i ? 'L' : 'M'} ${sx(x).toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const panels = [
    { row: 0, label: 'ρ', sub: 'מטען מרחבי', show: reveal >= 1 },
    { row: 1, label: 'E', sub: 'שדה חשמלי', show: reveal >= 2 },
    { row: 2, label: 'V', sub: 'פוטנציאל', show: reveal >= 3 },
  ]

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* shared p/n side tint + depletion shading + guide lines, per visible panel */}
        {panels.map((p) => {
          if (!p.show) return null
          const top = topOf(p.row)
          const mid = top + PH / 2
          return (
            <g key={`bg-${p.row}`}>
              {/* depletion region shading */}
              <rect x={xL} y={top} width={Math.max(xR - xL, 0)} height={PH} fill="#f1f5f9" />
              {/* guide verticals at -dp, 0, dn */}
              {[xL, x0, xR].map((gx, i) => (
                <line key={i} x1={gx} y1={top} x2={gx} y2={top + PH} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
              ))}
              {/* panel label */}
              <text x={10} y={mid} className="fill-slate-700" style={{ fontSize: 15, fontWeight: 800 }}>
                {p.label}
              </text>
              <text x={10} y={mid + 14} className="fill-slate-400" style={{ fontSize: 8 }}>
                {p.sub}
              </text>
            </g>
          )
        })}

        {/* ρ(x) — donor (+) and acceptor (−) boxes */}
        {reveal >= 1 &&
          (() => {
            const base = topOf(0) + PH / 2
            return (
              <g>
                <line x1={MX} y1={base} x2={W - MR} y2={base} stroke="#94a3b8" strokeWidth={1.25} />
                <rect x={x0} y={base - hP} width={Math.max(xR - x0, 0)} height={hP} fill={SKY} opacity={0.85} />
                <rect x={xL} y={base} width={Math.max(x0 - xL, 0)} height={hN} fill={ROSE} opacity={0.85} />
                <text x={(x0 + xR) / 2} y={base - hP - 4} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 9 }}>
                  +qN_D
                </text>
                <text x={(xL + x0) / 2} y={base + hN + 10} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9 }}>
                  −qN_A
                </text>
              </g>
            )
          })()}

        {/* E(x) — triangular, apex −Emax at the junction */}
        {reveal >= 2 &&
          (() => {
            const base = topOf(1) + 8
            const apex = base + PH * 0.8
            return (
              <g>
                <line x1={MX} y1={base} x2={W - MR} y2={base} stroke="#94a3b8" strokeWidth={1.25} />
                <polygon points={`${xL},${base} ${x0},${apex} ${xR},${base}`} fill={AMBER} opacity={0.18} />
                <polyline points={`${xL},${base} ${x0},${apex} ${xR},${base}`} fill="none" stroke={AMBER} strokeWidth={2.5} strokeLinejoin="round" />
                <text x={x0 + 4} y={apex + 2} className="fill-amber-600" style={{ fontSize: 9 }}>
                  −E_max
                </text>
              </g>
            )
          })()}

        {/* V(x) — rises by V_bi from p to n */}
        {reveal >= 3 && (
          <g>
            <line x1={MX} y1={vBase} x2={W - MR} y2={vBase} stroke="#94a3b8" strokeWidth={1.25} />
            <path d={vPath} fill="none" stroke={EMER} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            <text x={xR + 3} y={vBase - PH * 0.82 + 3} className="fill-emerald-600" style={{ fontSize: 9 }}>
              V_bi
            </text>
          </g>
        )}

        {/* x-axis side labels */}
        <text x={MX + 4} y={H - 6} className="fill-rose-400" style={{ fontSize: 10, fontWeight: 700 }}>
          p
        </text>
        <text x={W - MR - 8} y={H - 6} className="fill-sky-500" style={{ fontSize: 10, fontWeight: 700 }}>
          n
        </text>
        <text x={x0} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9 }}>
          x = 0
        </text>
      </svg>
    </div>
  )
}
