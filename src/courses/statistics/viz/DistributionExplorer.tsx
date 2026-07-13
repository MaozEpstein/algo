import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import {
  uniformPdf,
  uniformCdf,
  expPdf,
  expCdf,
  gaussianPdf,
  gaussianCdf,
  poissonPmf,
  poissonCdf,
} from '../lib/distributions'

/**
 * The lesson-1 sandbox. Pick a distribution, move its parameters, and drag the
 * threshold x: the shaded area under the PDF (left) equals the height of the CDF
 * (right) at that x — i.e. F(x) = Pr(X ≤ x) = ∫_{-∞}^{x} f. This *is* the CDF↔PDF
 * definition made visible, not decoration.
 */

type Dist = 'uniform' | 'exp' | 'gauss' | 'poisson'

const DISTS: { id: Dist; labelHe: string; tex: string }[] = [
  { id: 'uniform', labelHe: 'אחיד', tex: 'U(a,b)' },
  { id: 'exp', labelHe: 'מעריכי', tex: '\\mathrm{Exp}(\\lambda)' },
  { id: 'gauss', labelHe: 'גאוסי', tex: 'N(m,\\sigma^2)' },
  { id: 'poisson', labelHe: 'פואסון', tex: '\\mathrm{Pois}(\\lambda)' },
]

const W = 340
const H = 210
const PAD = { l: 34, r: 12, t: 14, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = H - PAD.t - PAD.b

export default function DistributionExplorer() {
  const [dist, setDist] = useState<Dist>('gauss')
  // one param set; each distribution reads what it needs
  const [a, setA] = useState(2)
  const [b, setB] = useState(8)
  const [lambda, setLambda] = useState(1)
  const [m, setM] = useState(5)
  const [sigma, setSigma] = useState(1.5)
  const [t, setT] = useState(0.5) // threshold as a 0..1 fraction of the domain

  const model = useMemo(() => {
    if (dist === 'uniform') {
      const lo = Math.min(a, b) - 1
      const hi = Math.max(a, b) + 1
      return {
        continuous: true as const,
        xmin: lo,
        xmax: hi,
        pdf: (x: number) => uniformPdf(x, Math.min(a, b), Math.max(a, b)),
        cdf: (x: number) => uniformCdf(x, Math.min(a, b), Math.max(a, b)),
        pdfMax: 1 / Math.max(1e-6, Math.abs(b - a)),
      }
    }
    if (dist === 'exp') {
      const hi = 6 / lambda
      return {
        continuous: true as const,
        xmin: 0,
        xmax: hi,
        pdf: (x: number) => expPdf(x, lambda),
        cdf: (x: number) => expCdf(x, lambda),
        pdfMax: lambda,
      }
    }
    if (dist === 'gauss') {
      return {
        continuous: true as const,
        xmin: m - 4 * sigma,
        xmax: m + 4 * sigma,
        pdf: (x: number) => gaussianPdf(x, m, sigma),
        cdf: (x: number) => gaussianCdf(x, m, sigma),
        pdfMax: gaussianPdf(m, m, sigma),
      }
    }
    // poisson (discrete)
    const kmax = Math.max(6, Math.ceil(lambda + 4 * Math.sqrt(lambda)))
    let pmax = 0
    for (let k = 0; k <= kmax; k++) pmax = Math.max(pmax, poissonPmf(k, lambda))
    return {
      continuous: false as const,
      xmin: -0.5,
      xmax: kmax + 0.5,
      kmax,
      pmf: (k: number) => poissonPmf(k, lambda),
      cdf: (x: number) => poissonCdf(x, lambda),
      pdfMax: pmax,
    }
  }, [dist, a, b, lambda, m, sigma])

  const { xmin, xmax, pdfMax } = model
  const xAt = (frac: number) => xmin + frac * (xmax - xmin)
  const thr = xAt(t)

  // scales (data → svg)
  const sx = (x: number) => PAD.l + ((x - xmin) / (xmax - xmin)) * IW
  const syPdf = (y: number) => PAD.t + IH - (y / (pdfMax * 1.15)) * IH
  const syCdf = (y: number) => PAD.t + IH - y * IH

  // sampled PDF/CDF paths (continuous)
  const samples = 160
  const pdfPath = useMemo(() => {
    if (!model.continuous) return ''
    let d = ''
    for (let i = 0; i <= samples; i++) {
      const x = xmin + (i / samples) * (xmax - xmin)
      d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${syPdf(model.pdf(x)).toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, xmin, xmax, pdfMax])

  const pdfArea = useMemo(() => {
    if (!model.continuous) return ''
    let d = `M${sx(xmin).toFixed(1)} ${syPdf(0).toFixed(1)} `
    for (let i = 0; i <= samples; i++) {
      const x = xmin + (i / samples) * (thr - xmin)
      d += `L${sx(x).toFixed(1)} ${syPdf(model.pdf(x)).toFixed(1)} `
    }
    d += `L${sx(thr).toFixed(1)} ${syPdf(0).toFixed(1)} Z`
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, thr, xmin, xmax, pdfMax])

  const cdfPath = useMemo(() => {
    if (!model.continuous) return ''
    let d = ''
    for (let i = 0; i <= samples; i++) {
      const x = xmin + (i / samples) * (xmax - xmin)
      d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${syCdf(model.cdf(x)).toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, xmin, xmax])

  const Fval = model.cdf(model.continuous ? thr : Math.floor(thr))
  const kThr = Math.floor(thr)

  // live E[X] and Var(X) for the selected distribution (from its parameters)
  const moments = (() => {
    if (dist === 'uniform') {
      const lo = Math.min(a, b), hi = Math.max(a, b)
      return { mean: (lo + hi) / 2, variance: (hi - lo) ** 2 / 12 }
    }
    if (dist === 'exp') return { mean: 1 / lambda, variance: 1 / (lambda * lambda) }
    if (dist === 'gauss') return { mean: m, variance: sigma * sigma }
    return { mean: lambda, variance: lambda } // poisson
  })()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      {/* distribution picker */}
      <div className="mb-3 flex flex-wrap gap-2">
        {DISTS.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setDist(d.id)
              setT(0.5)
            }}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              dist === d.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {d.labelHe}
            <span className={dist === d.id ? 'text-emerald-100' : 'text-slate-400'} dir="ltr">
              <Tex>{d.tex}</Tex>
            </span>
          </button>
        ))}
      </div>

      {/* two panels: PDF/PMF and CDF */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Chart title={model.continuous ? 'צפיפות f(x)' : 'הסתברות P(X=k)'}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <line x1={PAD.l} y1={PAD.t + IH} x2={W - PAD.r} y2={PAD.t + IH} stroke="#cbd5e1" />
            <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
            {model.continuous ? (
              <>
                <path d={pdfArea} fill="#34d399" fillOpacity={0.35} />
                <path d={pdfPath} fill="none" stroke="#059669" strokeWidth={2} />
              </>
            ) : (
              Array.from({ length: model.kmax + 1 }, (_, k) => {
                const on = k <= kThr
                const x = sx(k)
                const yTop = syPdf(model.pmf(k))
                return (
                  <g key={k}>
                    <line
                      x1={x}
                      y1={PAD.t + IH}
                      x2={x}
                      y2={yTop}
                      stroke={on ? '#059669' : '#cbd5e1'}
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                    <circle cx={x} cy={yTop} r={3} fill={on ? '#059669' : '#94a3b8'} />
                  </g>
                )
              })
            )}
            {/* mean marker E[X] */}
            {moments.mean >= xmin && moments.mean <= xmax && (
              <>
                <line x1={sx(moments.mean)} y1={PAD.t - 2} x2={sx(moments.mean)} y2={PAD.t + IH} stroke="#7c3aed" strokeWidth={1.5} />
                <text x={sx(moments.mean)} y={PAD.t - 4} textAnchor="middle" fontSize="8" fill="#7c3aed">E[X]</text>
              </>
            )}
            {/* threshold line */}
            <line x1={sx(model.continuous ? thr : kThr)} y1={PAD.t} x2={sx(model.continuous ? thr : kThr)} y2={PAD.t + IH} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="4 3" />
          </svg>
        </Chart>

        <Chart title="פונקציית התפלגות F(x)=Pr(X≤x)">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <line x1={PAD.l} y1={PAD.t + IH} x2={W - PAD.r} y2={PAD.t + IH} stroke="#cbd5e1" />
            <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
            <text x={PAD.l - 6} y={syCdf(1) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">1</text>
            <text x={PAD.l - 6} y={syCdf(0) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">0</text>
            {model.continuous ? (
              <path d={cdfPath} fill="none" stroke="#059669" strokeWidth={2} />
            ) : (
              // step CDF
              Array.from({ length: model.kmax + 1 }, (_, k) => {
                const y = syCdf(model.cdf(k))
                return <line key={k} x1={sx(k)} y1={y} x2={sx(k + 1)} y2={y} stroke="#059669" strokeWidth={2} />
              })
            )}
            {/* readout point at threshold */}
            <line x1={PAD.l} y1={syCdf(Fval)} x2={sx(model.continuous ? thr : kThr)} y2={syCdf(Fval)} stroke="#0f172a" strokeWidth={1} strokeDasharray="4 3" />
            <line x1={sx(model.continuous ? thr : kThr)} y1={PAD.t} x2={sx(model.continuous ? thr : kThr)} y2={PAD.t + IH} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="4 3" />
            <circle cx={sx(model.continuous ? thr : kThr)} cy={syCdf(Fval)} r={4} fill="#0f172a" />
          </svg>
        </Chart>
      </div>

      {/* readouts */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-50 px-4 py-2 text-center text-emerald-900" dir="ltr">
          <Tex>{`\\Pr(X \\le ${(model.continuous ? thr : kThr).toFixed(model.continuous ? 2 : 0)}) = F(x) = ${Fval.toFixed(3)}`}</Tex>
        </div>
        <div className="rounded-xl bg-violet-50 px-4 py-2 text-center text-violet-900" dir="ltr">
          <Tex>{`\\mathbb{E}[X]=${moments.mean.toFixed(2)},\\ \\ \\mathrm{Var}(X)=${moments.variance.toFixed(2)}`}</Tex>
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 space-y-2">
        <Slider label="סף x" tex="x" value={t} min={0} max={1} step={0.01} onChange={setT} display={(model.continuous ? thr : kThr).toFixed(model.continuous ? 2 : 0)} />
        {dist === 'uniform' && (
          <>
            <Slider label="גבול תחתון" tex="a" value={a} min={0} max={9} step={0.5} onChange={setA} display={a.toFixed(1)} />
            <Slider label="גבול עליון" tex="b" value={b} min={1} max={10} step={0.5} onChange={setB} display={b.toFixed(1)} />
          </>
        )}
        {dist === 'exp' && (
          <Slider label="קצב" tex="\\lambda" value={lambda} min={0.3} max={3} step={0.1} onChange={setLambda} display={lambda.toFixed(1)} />
        )}
        {dist === 'gauss' && (
          <>
            <Slider label="תוחלת" tex="m" value={m} min={1} max={9} step={0.5} onChange={setM} display={m.toFixed(1)} />
            <Slider label="סטיית תקן" tex="\\sigma" value={sigma} min={0.5} max={3} step={0.1} onChange={setSigma} display={sigma.toFixed(1)} />
          </>
        )}
        {dist === 'poisson' && (
          <Slider label="קצב" tex="\\lambda" value={lambda} min={0.5} max={9} step={0.5} onChange={setLambda} display={lambda.toFixed(1)} />
        )}
      </div>
    </div>
  )
}

function Chart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2">
      <div className="mb-1 text-center text-xs font-semibold text-slate-500">{title}</div>
      {children}
    </div>
  )
}

function Slider({
  label,
  tex,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string
  tex: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display: string
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}
        <span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600"
      />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
