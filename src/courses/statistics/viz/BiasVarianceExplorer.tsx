import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { seededNormals, sampleMean, shrinkageMSE } from '../lib/estimation'

/**
 * The bias-variance sandbox. We estimate μ from N samples of N(μ,1) many times
 * and histogram the estimates — the *sampling distribution*. The gap between the
 * histogram centre and the true μ is the bias; the spread is the variance; and
 * MSE = bias² + variance. Grow N and the histogram concentrates (consistency).
 * The shrinkage estimator μ̂=α·mean is biased but can beat the MLE when μ≈0.
 */

const M = 500 // number of resampled datasets
const W = 340
const Hh = 150
const PAD = { l: 8, r: 8, t: 8, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b
const LO = -3.4
const HI = 3.4
const BINS = 34

export default function BiasVarianceExplorer() {
  const [n, setN] = useState(10)
  const [alpha, setAlpha] = useState(1)
  const [mu, setMu] = useState(1)

  const estimates = useMemo(() => {
    const out: number[] = []
    for (let j = 0; j < M; j++) {
      const data = seededNormals(1000 + j * 7919, mu, 1, n)
      out.push(alpha * sampleMean(data))
    }
    return out
  }, [n, alpha, mu])

  const hist = useMemo(() => {
    const h = new Array(BINS).fill(0)
    for (const e of estimates) {
      const b = Math.floor(((e - LO) / (HI - LO)) * BINS)
      if (b >= 0 && b < BINS) h[b]++
    }
    return { h, max: Math.max(...h) || 1 }
  }, [estimates])

  const bias = (alpha - 1) * mu
  const variance = (alpha * alpha) / n
  const theoryMse = shrinkageMSE(alpha, mu, 1, n)

  const sx = (x: number) => PAD.l + ((x - LO) / (HI - LO)) * IW
  const bw = IW / BINS

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setAlpha(1)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${alpha === 1 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>אמד ML (α=1)</button>
        <button onClick={() => setAlpha(0.5)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${alpha !== 1 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>אמד מכווץ (α&lt;1)</button>
      </div>

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 540 }}>
        <line x1={PAD.l} y1={PAD.t + IH} x2={W - PAD.r} y2={PAD.t + IH} stroke="#cbd5e1" />
        {/* histogram of estimates */}
        {hist.h.map((c, i) => {
          const h = (c / hist.max) * IH
          return <rect key={i} x={PAD.l + i * bw + 0.5} y={PAD.t + IH - h} width={bw - 1} height={h} fill="#34d399" fillOpacity={0.6} />
        })}
        {/* true μ */}
        <line x1={sx(mu)} y1={PAD.t} x2={sx(mu)} y2={PAD.t + IH} stroke="#2563eb" strokeWidth={1.5} />
        <text x={sx(mu)} y={Hh - 4} textAnchor="middle" fontSize="9" fill="#2563eb">μ אמיתי</text>
        {/* estimate mean = α·μ */}
        <line x1={sx(alpha * mu)} y1={PAD.t} x2={sx(alpha * mu)} y2={PAD.t + IH} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={sx(alpha * mu)} y={PAD.t + 8} textAnchor="middle" fontSize="9" fill="#b45309">E[θ̂]</text>
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700" dir="ltr"><Tex>{`\\text{bias}=${bias.toFixed(2)}`}</Tex></div>
        <div className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700" dir="ltr"><Tex>{`\\text{var}=${variance.toFixed(3)}`}</Tex></div>
        <div className="rounded-lg bg-amber-50 px-2 py-1.5 text-amber-800" dir="ltr"><Tex>{`\\text{MSE}=${theoryMse.toFixed(3)}`}</Tex></div>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="גודל מדגם" tex="N" value={n} min={2} max={60} step={1} onChange={setN} display={String(n)} />
        <Slider label="פרמטר אמיתי" tex="\\mu" value={mu} min={-2} max={2} step={0.1} onChange={setMu} display={mu.toFixed(1)} />
        {alpha !== 1 && <Slider label="כיווץ" tex="\\alpha" value={alpha} min={0.2} max={1} step={0.05} onChange={setAlpha} display={alpha.toFixed(2)} />}
      </div>

      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
        {alpha === 1
          ? 'האמד לא-מוטה (הכתום מעל הכחול), וה-MSE=σ²/N מצטמצם ככל ש-N גדל (עקביות).'
          : Math.abs(mu) < 0.4
            ? '✨ כאן μ≈0: האמד המכווץ מוטה מעט אבל בעל שונות קטנה יותר — וה-MSE שלו נמוך מזה של ה-ML!'
            : 'האמד המכווץ מוטה (הכתום זז מהכחול), אבל שונותו קטנה יותר — תמורת הטיה-שונות.'}
      </p>
    </div>
  )
}

function Slider({ label, tex, value, min, max, step, onChange, display }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}<span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
