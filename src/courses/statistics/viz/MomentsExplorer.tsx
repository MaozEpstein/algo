import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import {
  uniformPdf,
  expPdf,
  gaussianPdf,
  bernoulliPmf,
  binomialPmf,
  poissonPmf,
} from '../lib/distributions'
import { distMoments, type DistId } from '../lib/moments'

/**
 * Lesson-2 sandbox: the mean as the distribution's balance point (a fulcrum
 * under the curve) and the variance as its spread (a ±σ band). Change the
 * distribution/parameters and watch the fulcrum slide and the band widen — E[X]
 * = center of mass, Var = spread, shown rather than asserted.
 */

const DISTS: { id: DistId; labelHe: string; tex: string; continuous: boolean }[] = [
  { id: 'gauss', labelHe: 'גאוסי', tex: 'N(m,\\sigma^2)', continuous: true },
  { id: 'uniform', labelHe: 'אחיד', tex: 'U(a,b)', continuous: true },
  { id: 'exp', labelHe: 'מעריכי', tex: '\\mathrm{Exp}(\\lambda)', continuous: true },
  { id: 'poisson', labelHe: 'פואסון', tex: '\\mathrm{Pois}(\\lambda)', continuous: false },
  { id: 'binomial', labelHe: 'בינומי', tex: '\\mathrm{Bin}(n,p)', continuous: false },
  { id: 'bernoulli', labelHe: 'ברנולי', tex: '\\mathrm{Bern}(\\theta)', continuous: false },
]

const W = 380
const H = 220
const PAD = { l: 16, r: 16, t: 16, b: 40 }
const IW = W - PAD.l - PAD.r
const IH = H - PAD.t - PAD.b

export default function MomentsExplorer() {
  const [id, setId] = useState<DistId>('gauss')
  const [a, setA] = useState(2)
  const [b, setB] = useState(8)
  const [lambda, setLambda] = useState(1)
  const [m, setM] = useState(5)
  const [sigma, setSigma] = useState(1.5)
  const [n, setN] = useState(10)
  const [pp, setPp] = useState(0.4)
  const [theta, setTheta] = useState(0.6)

  const dist = DISTS.find((d) => d.id === id)!

  const model = useMemo(() => {
    switch (id) {
      case 'uniform':
        return { continuous: true, xmin: Math.min(a, b) - 1, xmax: Math.max(a, b) + 1, f: (x: number) => uniformPdf(x, Math.min(a, b), Math.max(a, b)), params: { a, b } }
      case 'exp':
        return { continuous: true, xmin: 0, xmax: 6 / lambda, f: (x: number) => expPdf(x, lambda), params: { lambda } }
      case 'gauss':
        return { continuous: true, xmin: m - 4 * sigma, xmax: m + 4 * sigma, f: (x: number) => gaussianPdf(x, m, sigma), params: { m, sigma } }
      case 'poisson': {
        const kmax = Math.max(6, Math.ceil(lambda + 4 * Math.sqrt(lambda)))
        return { continuous: false, xmin: -0.5, xmax: kmax + 0.5, kmax, f: (k: number) => poissonPmf(k, lambda), params: { lambda } }
      }
      case 'binomial':
        return { continuous: false, xmin: -0.5, xmax: n + 0.5, kmax: n, f: (k: number) => binomialPmf(k, n, pp), params: { n, p: pp } }
      case 'bernoulli':
        return { continuous: false, xmin: -0.5, xmax: 1.5, kmax: 1, f: (k: number) => bernoulliPmf(k, theta), params: { theta } }
    }
  }, [id, a, b, lambda, m, sigma, n, pp, theta])

  const { xmin, xmax } = model
  const { mean, variance } = distMoments(id, model.params)
  const sd = Math.sqrt(variance)

  let fmax = 0
  const NS = 160
  if (model.continuous) {
    for (let i = 0; i <= NS; i++) fmax = Math.max(fmax, model.f(xmin + (i / NS) * (xmax - xmin)))
  } else {
    for (let k = 0; k <= model.kmax!; k++) fmax = Math.max(fmax, model.f(k))
  }
  fmax = fmax || 1

  const sx = (x: number) => PAD.l + ((x - xmin) / (xmax - xmin)) * IW
  const sy = (y: number) => PAD.t + IH - (y / (fmax * 1.15)) * IH
  const baseY = PAD.t + IH

  const pdfPath = useMemo(() => {
    if (!model.continuous) return ''
    let d = ''
    for (let i = 0; i <= NS; i++) {
      const x = xmin + (i / NS) * (xmax - xmin)
      d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(model.f(x)).toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, xmin, xmax, fmax])

  // ±σ band clamped to the drawing area
  const bandLo = Math.max(xmin, mean - sd)
  const bandHi = Math.min(xmax, mean + sd)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        {DISTS.map((d) => (
          <button
            key={d.id}
            onClick={() => setId(d.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              id === d.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {d.labelHe}
            <span className={id === d.id ? 'text-emerald-100' : 'text-slate-400'} dir="ltr"><Tex>{d.tex}</Tex></span>
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full" style={{ maxWidth: 470 }}>
        {/* ±σ spread band */}
        <rect x={sx(bandLo)} y={PAD.t} width={Math.max(0, sx(bandHi) - sx(bandLo))} height={IH} fill="#fbbf24" fillOpacity={0.14} />
        <line x1={PAD.l} y1={baseY} x2={W - PAD.r} y2={baseY} stroke="#cbd5e1" />

        {model.continuous ? (
          <path d={pdfPath} fill="none" stroke="#059669" strokeWidth={2} />
        ) : (
          Array.from({ length: model.kmax! + 1 }, (_, k) => (
            <g key={k}>
              <line x1={sx(k)} y1={baseY} x2={sx(k)} y2={sy(model.f(k))} stroke="#059669" strokeWidth={4} strokeLinecap="round" />
              <circle cx={sx(k)} cy={sy(model.f(k))} r={3} fill="#059669" />
            </g>
          ))
        )}

        {/* ±σ end ticks + label */}
        <line x1={sx(bandLo)} y1={PAD.t} x2={sx(bandLo)} y2={baseY} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={sx(bandHi)} y1={PAD.t} x2={sx(bandHi)} y2={baseY} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
        <text x={sx(mean)} y={PAD.t + 10} textAnchor="middle" fontSize="9" fill="#b45309">±σ</text>

        {/* mean fulcrum triangle under the baseline */}
        <line x1={sx(mean)} y1={PAD.t} x2={sx(mean)} y2={baseY} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="4 3" />
        <path d={`M${sx(mean)} ${baseY + 2} L${sx(mean) - 8} ${baseY + 15} L${sx(mean) + 8} ${baseY + 15} Z`} fill="#0f172a" />
        <text x={sx(mean)} y={baseY + 30} textAnchor="middle" fontSize="10" fontWeight={700} fill="#0f172a">E[X]</text>
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
        <Readout label="תוחלת" tex={`E[X]=${fmt(mean)}`} tone="slate" />
        <Readout label="שונות" tex={`\\mathrm{Var}=${fmt(variance)}`} tone="amber" />
        <Readout label="סטיית תקן" tex={`\\sigma=${fmt(sd)}`} tone="amber" />
      </div>

      {/* controls */}
      <div className="mt-3 space-y-2">
        {id === 'uniform' && (<>
          <Slider label="גבול תחתון" tex="a" value={a} min={0} max={9} step={0.5} onChange={setA} />
          <Slider label="גבול עליון" tex="b" value={b} min={1} max={10} step={0.5} onChange={setB} />
        </>)}
        {id === 'exp' && <Slider label="קצב" tex="\\lambda" value={lambda} min={0.3} max={3} step={0.1} onChange={setLambda} />}
        {id === 'gauss' && (<>
          <Slider label="תוחלת" tex="m" value={m} min={1} max={9} step={0.5} onChange={setM} />
          <Slider label="סטיית תקן" tex="\\sigma" value={sigma} min={0.5} max={3} step={0.1} onChange={setSigma} />
        </>)}
        {id === 'poisson' && <Slider label="קצב" tex="\\lambda" value={lambda} min={0.5} max={9} step={0.5} onChange={setLambda} />}
        {id === 'binomial' && (<>
          <Slider label="ניסויים" tex="n" value={n} min={1} max={20} step={1} onChange={setN} />
          <Slider label="הסתברות" tex="p" value={pp} min={0.05} max={0.95} step={0.05} onChange={setPp} />
        </>)}
        {id === 'bernoulli' && <Slider label="הסתברות" tex="\\theta" value={theta} min={0.05} max={0.95} step={0.05} onChange={setTheta} />}
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">המשולש השחור = נקודת האיזון (תוחלת) · הפס הכתום = פיזור של ±σ</p>
    </div>
  )
}

const fmt = (v: number) => (Math.abs(v) >= 100 || (v !== 0 && Math.abs(v) < 0.01) ? v.toPrecision(3) : v.toFixed(2))

function Readout({ label, tex, tone }: { label: string; tex: string; tone: 'slate' | 'amber' }) {
  const cls = tone === 'amber' ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-700'
  return (
    <div className={`rounded-lg px-2 py-1.5 ${cls}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div dir="ltr"><Tex>{tex}</Tex></div>
    </div>
  )
}

function Slider({ label, tex, value, min, max, step, onChange }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}
        <span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{value}</span>
    </label>
  )
}
