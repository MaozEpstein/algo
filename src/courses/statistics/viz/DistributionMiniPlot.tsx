/**
 * A small, static PDF/PMF thumbnail in the same emerald style as the
 * DistributionExplorer — a "portrait" of a distribution for its reference card.
 * Continuous → filled curve; discrete → stems + dots. Pure presentational SVG
 * driven by a density/mass function; no state, no interaction.
 */
export default function DistributionMiniPlot({
  kind,
  fn,
  xmin,
  xmax,
  kmax,
}: {
  kind: 'continuous' | 'discrete'
  /** continuous: pdf(x) over [xmin,xmax]; discrete: pmf(k) over 0..kmax */
  fn: (x: number) => number
  xmin?: number
  xmax?: number
  kmax?: number
}) {
  const W = 200
  const H = 90
  const PAD = 8

  if (kind === 'discrete') {
    const K = kmax ?? 8
    let pmax = 0
    for (let k = 0; k <= K; k++) pmax = Math.max(pmax, fn(k))
    pmax = pmax || 1
    const sx = (k: number) => PAD + (k / K) * (W - 2 * PAD)
    const sy = (y: number) => H - PAD - (y / (pmax * 1.1)) * (H - 2 * PAD)
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#cbd5e1" />
        {Array.from({ length: K + 1 }, (_, k) => (
          <g key={k}>
            <line x1={sx(k)} y1={H - PAD} x2={sx(k)} y2={sy(fn(k))} stroke="#059669" strokeWidth={3} strokeLinecap="round" />
            <circle cx={sx(k)} cy={sy(fn(k))} r={2.5} fill="#059669" />
          </g>
        ))}
      </svg>
    )
  }

  const lo = xmin ?? 0
  const hi = xmax ?? 1
  const N = 100
  let pmax = 0
  for (let i = 0; i <= N; i++) pmax = Math.max(pmax, fn(lo + (i / N) * (hi - lo)))
  pmax = pmax || 1
  const sx = (x: number) => PAD + ((x - lo) / (hi - lo)) * (W - 2 * PAD)
  const sy = (y: number) => H - PAD - (y / (pmax * 1.1)) * (H - 2 * PAD)
  let line = ''
  for (let i = 0; i <= N; i++) {
    const x = lo + (i / N) * (hi - lo)
    line += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(fn(x)).toFixed(1)} `
  }
  const area = `M${sx(lo).toFixed(1)} ${(H - PAD).toFixed(1)} L${line.slice(1)} L${sx(hi).toFixed(1)} ${(H - PAD).toFixed(1)} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#cbd5e1" />
      <path d={area} fill="#34d399" fillOpacity={0.3} />
      <path d={line} fill="none" stroke="#059669" strokeWidth={2} />
    </svg>
  )
}
