/** A small, reusable Cartesian SVG chart (axes + labelled curves + optional
 *  log Y scale and vertical reference lines). Pure presentational — the caller
 *  supplies sampled points. Used for growth-rate / O-Θ-Ω visuals; reusable for
 *  any line chart (e.g. I-V curves in future courses). */

export interface ChartSeries {
  label: string
  color: string
  points: { x: number; y: number }[]
  dashed?: boolean
}

export interface ChartMarker {
  x: number
  label?: string
  color?: string
}

interface Props {
  series: ChartSeries[]
  yScale?: 'linear' | 'log'
  xLabel?: string
  yLabel?: string
  /** Override the auto y-max (linear) — useful to keep a steep curve readable. */
  yMax?: number
  markers?: ChartMarker[]
  height?: number
}

const W = 600
const M = { l: 50, r: 16, t: 14, b: 34 }

export default function Chart({
  series,
  yScale = 'linear',
  xLabel,
  yLabel,
  yMax,
  markers = [],
  height = 280,
}: Props) {
  const H = height
  const pw = W - M.l - M.r
  const ph = H - M.t - M.b

  const allX = series.flatMap((s) => s.points.map((p) => p.x))
  const allY = series.flatMap((s) => s.points.map((p) => p.y))
  const xMin = Math.min(...allX, 0)
  const xMax = Math.max(...allX, 1)
  const log = yScale === 'log'
  const yLo = log ? 1 : 0
  const yHi = Math.max(yMax ?? Math.max(...allY, 1), yLo + 1)

  const sx = (x: number) => M.l + ((x - xMin) / (xMax - xMin || 1)) * pw
  const sy = (y: number) => {
    if (log) {
      const ly = Math.log10(Math.max(y, 1))
      return M.t + ph - (ly / (Math.log10(yHi) || 1)) * ph
    }
    return M.t + ph - (Math.min(y, yHi) / yHi) * ph
  }

  const yTicks = log
    ? Array.from({ length: Math.floor(Math.log10(yHi)) + 1 }, (_, i) => 10 ** i)
    : [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * yHi))
  const xTicks = [xMin, Math.round((xMin + xMax) / 2), xMax]

  const pathOf = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i ? 'L' : 'M'} ${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ')

  return (
    <div className="flex flex-col gap-3">
      <div className="ltr w-full overflow-hidden" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
          {/* y gridlines + labels */}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={M.l} y1={sy(t)} x2={W - M.r} y2={sy(t)} stroke="#eef2f7" strokeWidth={1} />
              <text x={M.l - 6} y={sy(t) + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>
                {t >= 1000 ? `${t / 1000}k` : t}
              </text>
            </g>
          ))}
          {/* axes */}
          <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + ph} stroke="#cbd5e1" strokeWidth={1.5} />
          <line x1={M.l} y1={M.t + ph} x2={W - M.r} y2={M.t + ph} stroke="#cbd5e1" strokeWidth={1.5} />
          {/* x ticks */}
          {xTicks.map((t) => (
            <text key={`x${t}`} x={sx(t)} y={M.t + ph + 16} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
              {t}
            </text>
          ))}
          {/* axis labels */}
          {xLabel && (
            <text x={M.l + pw / 2} y={H - 2} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11 }}>
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text x={12} y={M.t + ph / 2} textAnchor="middle" transform={`rotate(-90 12 ${M.t + ph / 2})`} className="fill-slate-500" style={{ fontSize: 11 }}>
              {yLabel}
            </text>
          )}
          {/* vertical markers */}
          {markers.map((mk, i) => (
            <g key={`mk${i}`}>
              <line x1={sx(mk.x)} y1={M.t} x2={sx(mk.x)} y2={M.t + ph} stroke={mk.color ?? '#94a3b8'} strokeWidth={1.25} strokeDasharray="4 3" />
              {mk.label && (
                <text x={sx(mk.x)} y={M.t + 10} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10 }}>
                  {mk.label}
                </text>
              )}
            </g>
          ))}
          {/* series */}
          {series.map((s) => (
            <path
              key={s.label}
              d={pathOf(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? '6 4' : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
      {/* legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: s.color }} />
            <span dir="ltr" className="ltr font-mono">{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
