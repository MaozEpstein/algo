import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { gaussianPdf } from '../lib/distributions'
import { sampleMeans, cltTarget, empiricalStats, type BaseDist } from '../lib/sampling'

/**
 * The Central Limit Theorem made visible. Pick a clearly non-Gaussian base
 * distribution, average n i.i.d. samples, and watch the histogram of the sample
 * means tighten onto the limiting bell N(μ, σ²/n) as n grows. Samples + target
 * from lib/sampling.ts.
 */

const BASES: { id: BaseDist; labelHe: string; tex: string }[] = [
  { id: 'uniform', labelHe: 'אחיד', tex: 'U(0,1)' },
  { id: 'exp', labelHe: 'מעריכי', tex: '\\mathrm{Exp}(1)' },
  { id: 'bernoulli', labelHe: 'ברנולי', tex: '\\mathrm{Bern}(0.5)' },
]

const COUNT = 4000
const BINS = 34
const W = 380
const Hh = 220
const PAD = { l: 20, r: 12, t: 12, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b

export default function CLTExplorer() {
  const [base, setBase] = useState<BaseDist>('exp')
  const [n, setN] = useState(1)

  const { bars, curve, lo, hi, emp, tgt } = useMemo(() => {
    const tgt = cltTarget(base, n)
    const sd = Math.sqrt(tgt.variance)
    // fix the view to the base's full range so the "narrowing" is visible as n grows
    const lo = 0
    const hi = base === 'exp' ? 3 : 1
    const xs = sampleMeans(base, n, COUNT, 24680)
    const emp = empiricalStats(xs)
    const bins = new Array(BINS).fill(0)
    for (const x of xs) {
      let b = Math.floor(((x - lo) / (hi - lo)) * BINS)
      b = Math.max(0, Math.min(BINS - 1, b))
      bins[b]++
    }
    const binW = (hi - lo) / BINS
    // histogram as density (area = 1) so the Gaussian overlay is comparable
    const dens = bins.map((c) => c / (COUNT * binW))
    const gauss = (x: number) => gaussianPdf(x, tgt.mean, sd)
    let peak = Math.max(...dens)
    for (let i = 0; i <= 100; i++) peak = Math.max(peak, gauss(lo + (i / 100) * (hi - lo)))
    peak = peak || 1
    const bars = dens.map((d, i) => ({ x0: lo + i * binW, h: d / peak }))
    let curve = ''
    for (let i = 0; i <= 120; i++) {
      const x = lo + (i / 120) * (hi - lo)
      curve += `${i ? 'L' : 'M'}${(PAD.l + ((x - lo) / (hi - lo)) * IW).toFixed(1)} ${(PAD.t + IH - (gauss(x) / peak) * IH).toFixed(1)} `
    }
    return { bars, curve, lo, hi, emp, tgt }
  }, [base, n])

  const sx = (x: number) => PAD.l + ((x - lo) / (hi - lo)) * IW

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        {BASES.map((bd) => (
          <button
            key={bd.id}
            onClick={() => setBase(bd.id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${base === bd.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {bd.labelHe}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={PAD.t + IH} x2={W - PAD.r} y2={PAD.t + IH} stroke="#cbd5e1" />
        {bars.map((b, i) => (
          <rect
            key={i}
            x={sx(b.x0) + 0.5}
            y={PAD.t + IH - b.h * IH}
            width={(IW / BINS) - 1}
            height={b.h * IH}
            fill="#34d399"
            fillOpacity={0.55}
            rx={1}
          />
        ))}
        <path d={curve} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
        <text x={W - PAD.r} y={PAD.t + 8} textAnchor="end" fontSize="8" fill="#7c3aed">N(μ, σ²/n)</text>
      </svg>

      <div className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-center text-sm text-slate-700" dir="ltr">
        <Tex>{`n=${n}:\\ \\ \\mathrm{Var}(\\bar X)\\to\\frac{\\sigma^2}{n}=${tgt.variance.toFixed(3)}\\ \\ (\\text{emp } ${emp.variance.toFixed(3)})`}</Tex>
      </div>

      <div className="mt-2">
        <Slider label="גודל מדגם" tex="n" value={n} min={1} max={40} step={1} onChange={setN} display={String(n)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        גם כשההתפלגות הבסיסית רחוקה מגאוסי, ממוצע של <span dir="ltr"><Tex>{'n'}</Tex></span> דגימות מתכנס ל<b>פעמון</b>{' '}
        <span dir="ltr"><Tex>{'N(\\mu,\\sigma^2/n)'}</Tex></span> — וככל ש-<span dir="ltr"><Tex>{'n'}</Tex></span> גדל, ההיסטוגרמה מתחדדת. זה "למה גאוסי בכל מקום".
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
