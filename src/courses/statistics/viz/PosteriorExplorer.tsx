import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { gaussianPdf } from '../lib/distributions'
import { gaussianPosterior, betaPdfUnnorm, betaMean, betaMode, numericMedian } from '../lib/bayes'

/**
 * Bayesian estimation made visible: prior (dashed) × likelihood (dotted) →
 * posterior (filled), with the three estimators marked — MMSE (mean), MAP (mode),
 * median. Gaussian-conjugate mode: the posterior mean is the weighted average of
 * prior and data (slide the noise), and all three estimators coincide. Beta mode:
 * a skewed posterior where mean ≠ mode ≠ median — so the loss function matters.
 */

type Mode = 'gauss' | 'beta'

const W = 380
const Hh = 200
const PAD = { l: 12, r: 12, t: 30, b: 22 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b

export default function PosteriorExplorer() {
  const [mode, setMode] = useState<Mode>('gauss')
  const [x, setX] = useState(1.6)
  const [sw, setSw] = useState(1)
  const [heads, setHeads] = useState(6)
  const [tails, setTails] = useState(2)

  const m = useMemo(() => {
    if (mode === 'gauss') {
      const lo = -4, hi = 4
      const post = gaussianPosterior(0, 1, x, sw * sw)
      const prior = (t: number) => gaussianPdf(t, 0, 1)
      const like = (t: number) => gaussianPdf(t, x, sw)
      const posterior = (t: number) => gaussianPdf(t, post.mean, Math.sqrt(post.variance))
      return { lo, hi, prior, like, posterior, mean: post.mean, mode: post.mean, median: post.mean, coincide: true, weighted: post }
    }
    const lo = 0, hi = 1
    const a = heads + 1, b = tails + 1
    const prior = () => 1
    const like = (t: number) => betaPdfUnnorm(t, a, b)
    const posterior = (t: number) => betaPdfUnnorm(t, a, b)
    return {
      lo, hi, prior, like, posterior,
      mean: betaMean(a, b), mode: betaMode(a, b), median: numericMedian((t) => betaPdfUnnorm(t, a, b), 0, 1),
      coincide: false, weighted: null as null | { mean: number; variance: number },
    }
  }, [mode, x, sw, heads, tails])

  const { lo, hi } = m
  const sx = (v: number) => PAD.l + ((v - lo) / (hi - lo)) * IW
  const base = PAD.t + IH
  const peak = (f: (t: number) => number) => {
    let mx = 0
    for (let i = 0; i <= 120; i++) mx = Math.max(mx, f(lo + (i / 120) * (hi - lo)))
    return mx || 1
  }
  const path = (f: (t: number) => number, area = false) => {
    const mx = peak(f)
    let d = area ? `M${sx(lo).toFixed(1)} ${base} ` : ''
    for (let i = 0; i <= 120; i++) {
      const t = lo + (i / 120) * (hi - lo)
      const y = base - (f(t) / mx) * (IH - 4)
      d += `${!area && i === 0 ? 'M' : 'L'}${sx(t).toFixed(1)} ${y.toFixed(1)} `
    }
    if (area) d += `L${sx(hi).toFixed(1)} ${base} Z`
    return d
  }

  const Est = ({ v, color, label }: { v: number; color: string; label: string }) => (
    <g>
      <line x1={sx(v)} y1={PAD.t - 4} x2={sx(v)} y2={base} stroke={color} strokeWidth={1.5} />
      <text x={sx(v)} y={PAD.t - 6} textAnchor="middle" fontSize="8" fill={color}>{label}</text>
    </g>
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setMode('gauss')} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${mode === 'gauss' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>גאוסי צמוד</button>
        <button onClick={() => setMode('beta')} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${mode === 'beta' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>בטא (מוטה)</button>
      </div>

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={base} x2={W - PAD.r} y2={base} stroke="#cbd5e1" />
        {/* prior · likelihood · posterior */}
        <path d={path(m.posterior, true)} fill="#34d399" fillOpacity={0.3} />
        <path d={path(m.prior)} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" />
        <path d={path(m.like)} fill="none" stroke="#0f172a" strokeWidth={1.3} strokeDasharray="1 3" />
        <path d={path(m.posterior)} fill="none" stroke="#059669" strokeWidth={2} />
        {/* estimator markers */}
        {m.coincide ? (
          <Est v={m.mean} color="#7c3aed" label="MMSE=MAP=median" />
        ) : (
          <>
            <Est v={m.mean} color="#059669" label="MMSE (מ״מ)" />
            <Est v={m.mode} color="#7c3aed" label="MAP (שיא)" />
            <Est v={m.median} color="#f59e0b" label="median" />
          </>
        )}
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-4 border-t border-dashed border-slate-400" /> prior</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-4 border-t border-dotted border-slate-800" /> likelihood</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-emerald-300/50" /> posterior</span>
      </div>

      {mode === 'gauss' && m.weighted && (
        <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-center text-sm text-emerald-900" dir="ltr">
          <Tex>{`\\hat\\theta_{MMSE}=E[\\theta\\mid x]=${m.weighted.mean.toFixed(2)}\\ \\ (\\text{ממוצע משוקלל})`}</Tex>
        </div>
      )}

      <div className="mt-2 space-y-1.5">
        {mode === 'gauss' ? (
          <>
            <Slider label="תצפית" tex="x" value={x} min={-3} max={3} step={0.1} onChange={setX} display={x.toFixed(1)} />
            <Slider label="רעש" tex="\\sigma_w" value={sw} min={0.3} max={3} step={0.1} onChange={setSw} display={sw.toFixed(1)} />
          </>
        ) : (
          <>
            <Slider label="הצלחות" tex="h" value={heads} min={1} max={12} step={1} onChange={setHeads} display={String(heads)} />
            <Slider label="כשלונות" tex="t" value={tails} min={1} max={12} step={1} onChange={setTails} display={String(tails)} />
          </>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        {mode === 'gauss'
          ? 'הפוסטריור הוא ממוצע משוקלל של ה-prior והתצפית — רעש קטן → נצמד לנתונים; רעש גדול → נצמד ל-prior. שלושת האמדים מתלכדים.'
          : 'פוסטריור מוטה: התוחלת (MMSE), השיא (MAP) והחציון נבדלים — ולכן פונקציית העלות קובעת את האמד.'}
      </p>
    </div>
  )
}

function Slider({ label, tex, value, min, max, step, onChange, display }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}<span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
