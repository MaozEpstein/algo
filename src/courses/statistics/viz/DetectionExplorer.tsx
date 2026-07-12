import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { gaussianPdf } from '../lib/distributions'
import { qFunc, rocPd, bayesThreshold } from '../lib/detection'

/**
 * The canonical detection sandbox. Two equal-variance Gaussians f(x;H0), f(x;H1)
 * with a decision threshold: the H0 tail beyond it is the false alarm P_FA, the
 * H1 tail is the detection P_D. A separation slider d=(μ1−μ0)/σ pulls the curves
 * apart; a linked ROC panel plots the operating point. Neyman-Pearson mode drags
 * the threshold freely; Bayesian mode places it from the prior P(H0) at the
 * min-error point and shades P(error).
 */

const DW = 360
const DH = 170
const DP = { l: 8, r: 8, t: 10, b: 22 }
const DIW = DW - DP.l - DP.r
const DIH = DH - DP.t - DP.b

const RS = 190 // ROC panel size
const RP = 26

export default function DetectionExplorer() {
  const [bayes, setBayes] = useState(false)
  const [d, setD] = useState(2)
  const [tf, setTf] = useState(0.55) // NP: threshold as a fraction of the domain
  const [p0, setP0] = useState(0.5) // Bayesian prior P(H0)

  const xmin = -3.6
  const xmax = d + 3.6
  const t = bayes ? bayesThreshold(0, d, 1, p0) : xmin + tf * (xmax - xmin)

  const pfa = qFunc(t) // Q((t−0)/1)
  const pd = qFunc(t - d) // Q((t−d)/1)
  const perr = p0 * pfa + (1 - p0) * (1 - pd)

  const sx = (x: number) => DP.l + ((x - xmin) / (xmax - xmin)) * DIW
  const fmax = gaussianPdf(0, 0, 1)
  const sy = (v: number) => DP.t + DIH - (v / (fmax * 1.1)) * DIH
  const baseY = DP.t + DIH

  const curve = (mu: number) => {
    let s = ''
    for (let i = 0; i <= 160; i++) {
      const x = xmin + (i / 160) * (xmax - xmin)
      s += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(gaussianPdf(x, mu, 1)).toFixed(1)} `
    }
    return s
  }
  // shaded tail area under a curve, on [a,b]
  const area = (mu: number, a: number, b: number) => {
    let s = `M${sx(a).toFixed(1)} ${baseY} `
    for (let i = 0; i <= 100; i++) {
      const x = a + (i / 100) * (b - a)
      s += `L${sx(x).toFixed(1)} ${sy(gaussianPdf(x, mu, 1)).toFixed(1)} `
    }
    s += `L${sx(b).toFixed(1)} ${baseY} Z`
    return s
  }

  const h0Path = useMemo(() => curve(0), [d])
  const h1Path = useMemo(() => curve(d), [d])

  // ROC
  const rx = (v: number) => RP + v * (RS - 2 * RP)
  const ry = (v: number) => RS - RP - v * (RS - 2 * RP)
  const rocPath = useMemo(() => {
    let s = ''
    for (let i = 0; i <= 100; i++) {
      const f = i / 100
      s += `${i ? 'L' : 'M'}${rx(f).toFixed(1)} ${ry(rocPd(f, d)).toFixed(1)} `
    }
    return s
  }, [d])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setBayes(false)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${!bayes ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ניימן-פירסון</button>
        <button onClick={() => setBayes(true)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${bayes ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>בייסיאני</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        {/* densities */}
        <div>
          <svg viewBox={`0 0 ${DW} ${DH}`} className="w-full">
            <line x1={DP.l} y1={baseY} x2={DW - DP.r} y2={baseY} stroke="#cbd5e1" />
            {/* shaded regions */}
            {bayes ? (
              <>
                {/* error regions: H0 tail right of t + H1 tail left of t */}
                <path d={area(0, t, xmax)} fill="#f43f5e" fillOpacity={0.25} />
                <path d={area(d, xmin, t)} fill="#f59e0b" fillOpacity={0.25} />
              </>
            ) : (
              <>
                <path d={area(0, t, xmax)} fill="#f43f5e" fillOpacity={0.3} />
                <path d={area(d, t, xmax)} fill="#10b981" fillOpacity={0.3} />
              </>
            )}
            <path d={h0Path} fill="none" stroke="#64748b" strokeWidth={2} />
            <path d={h1Path} fill="none" stroke="#059669" strokeWidth={2} />
            {/* threshold */}
            <line x1={sx(t)} y1={DP.t} x2={sx(t)} y2={baseY} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={sx(0)} y={baseY + 16} textAnchor="middle" fontSize="10" fill="#64748b">H₀</text>
            <text x={sx(d)} y={baseY + 16} textAnchor="middle" fontSize="10" fill="#059669">H₁</text>
            <text x={sx(t)} y={DP.t + 8} textAnchor="middle" fontSize="9" fill="#0f172a">η</text>
          </svg>
          <div className="mt-1 grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="rounded bg-rose-50 px-1.5 py-1 text-rose-700" dir="ltr"><Tex>{`P_{FA}=${pfa.toFixed(3)}`}</Tex></div>
            <div className="rounded bg-emerald-50 px-1.5 py-1 text-emerald-800" dir="ltr"><Tex>{`P_{D}=${pd.toFixed(3)}`}</Tex></div>
            <div className="rounded bg-amber-50 px-1.5 py-1 text-amber-800" dir="ltr"><Tex>{`P_{err}=${perr.toFixed(3)}`}</Tex></div>
          </div>
        </div>

        {/* ROC */}
        <div className="mx-auto">
          <svg viewBox={`0 0 ${RS} ${RS}`} className="block" style={{ width: 170 }}>
            <rect x={RP} y={RP} width={RS - 2 * RP} height={RS - 2 * RP} fill="#f8fafc" stroke="#e2e8f0" />
            <line x1={RP} y1={RS - RP} x2={RS - RP} y2={RP} stroke="#cbd5e1" strokeDasharray="3 3" />
            <path d={rocPath} fill="none" stroke="#059669" strokeWidth={2} />
            <circle cx={rx(pfa)} cy={ry(pd)} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
            <text x={RS / 2} y={RS - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">P_FA</text>
            <text x={8} y={RS / 2} textAnchor="middle" fontSize="9" fill="#94a3b8" transform={`rotate(-90 8 ${RS / 2})`}>P_D</text>
          </svg>
          <div className="mt-1 text-center text-xs text-slate-400">ROC · האלכסון = ניחוש</div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 space-y-2">
        <Slider label="הפרדה" tex="d=\\tfrac{\\mu_1-\\mu_0}{\\sigma}" value={d} min={0} max={4} step={0.1} onChange={setD} display={d.toFixed(1)} />
        {bayes ? (
          <Slider label="prior" tex="P(H_0)" value={p0} min={0.05} max={0.95} step={0.01} onChange={setP0} display={p0.toFixed(2)} />
        ) : (
          <Slider label="סף" tex="\\eta" value={tf} min={0.02} max={0.98} step={0.01} onChange={setTf} display={t.toFixed(2)} />
        )}
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        {bayes
          ? 'הסף נקבע אוטומטית מה-prior (LRT ≷ P(H₀)/P(H₁)) כדי למזער את הסתברות השגיאה (השטח הצבוע).'
          : 'גררו את הסף: הזזה ימינה מקטינה P_FA אבל גם P_D. ההפרדה d "מקמרת" את ה-ROC כלפי הפינה.'}
      </p>
    </div>
  )
}

function Slider({ label, tex, value, min, max, step, onChange, display }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-32 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}<span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
