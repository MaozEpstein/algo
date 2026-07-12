import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { gaussianPdf, expPdf } from '../lib/distributions'
import { seededNormals, sampleMean } from '../lib/estimation'

/**
 * The "what is ML" sandbox. A fixed dataset sits on the x-axis; a fitted density
 * f(x;θ) slides as you drag θ, and the log-likelihood curve ℓ(θ) below peaks
 * exactly at the closed-form estimator θ̂_ML (the sample mean). Slide θ and watch
 * the density fit the data best — and ℓ(θ) reach its top — at the same place.
 */

type Mode = 'gauss' | 'exp'
const SIGMA = 1.1

// deterministic datasets
const GAUSS_DATA = seededNormals(31337, 3, 1.1, 9)
const EXP_DATA = ((): number[] => {
  let s = 9001
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  return Array.from({ length: 9 }, () => -2 * Math.log(Math.max(1e-6, rnd())))
})()

const W = 360
const DHt = 120
const LHt = 120
const PAD = 30

export default function LikelihoodExplorer() {
  const [mode, setMode] = useState<Mode>('gauss')
  const data = mode === 'gauss' ? GAUSS_DATA : EXP_DATA
  const thetaHat = sampleMean(data) // MLE for both (Gaussian mean / exponential mean)

  const [theta, setTheta] = useState(mode === 'gauss' ? 1.5 : 3)

  const dens = (x: number, th: number) => (mode === 'gauss' ? gaussianPdf(x, th, SIGMA) : expPdf(x, 1 / th))
  const loglik = (th: number) => {
    let s = 0
    for (const x of data) s += Math.log(Math.max(1e-12, dens(x, th)))
    return s
  }

  const xmin = mode === 'gauss' ? -1 : 0
  const xmax = mode === 'gauss' ? 7 : 11
  const thmin = mode === 'gauss' ? 0 : 0.5
  const thmax = mode === 'gauss' ? 6 : 8

  const sx = (x: number) => PAD + ((x - xmin) / (xmax - xmin)) * (W - 2 * PAD)
  const fmax = mode === 'gauss' ? gaussianPdf(0, 0, SIGMA) : expPdf(0, 1 / thmin)
  const dsy = (y: number) => DHt - 6 - (y / (fmax * 1.05)) * (DHt - 20)
  const densPath = (th: number) => {
    let d = ''
    for (let i = 0; i <= 140; i++) {
      const x = xmin + (i / 140) * (xmax - xmin)
      d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${dsy(dens(x, th)).toFixed(1)} `
    }
    return d
  }

  // log-lik curve (shifted so the peak sits near the top)
  const ll = useMemo(() => {
    const xs: number[] = []
    const ys: number[] = []
    let lmax = -Infinity, lmin = Infinity
    for (let i = 0; i <= 140; i++) {
      const th = thmin + (i / 140) * (thmax - thmin)
      const v = loglik(th)
      xs.push(th); ys.push(v)
      lmax = Math.max(lmax, v); lmin = Math.min(lmin, Math.max(v, lmax - 30))
    }
    return { xs, ys, lmax, lmin }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])
  const stx = (th: number) => PAD + ((th - thmin) / (thmax - thmin)) * (W - 2 * PAD)
  const lsy = (v: number) => LHt - 22 - ((Math.max(v, ll.lmin) - ll.lmin) / (ll.lmax - ll.lmin || 1)) * (LHt - 34)
  const llPath = ll.xs.map((th, i) => `${i ? 'L' : 'M'}${stx(th).toFixed(1)} ${lsy(ll.ys[i]).toFixed(1)}`).join(' ')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => { setMode('gauss'); setTheta(1.5) }} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${mode === 'gauss' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>גאוסי (μ)</button>
        <button onClick={() => { setMode('exp'); setTheta(3) }} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${mode === 'exp' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>מעריכי (θ)</button>
      </div>

      {/* data + fitted density */}
      <svg viewBox={`0 0 ${W} ${DHt}`} className="mx-auto block w-full" style={{ maxWidth: 510 }}>
        <line x1={PAD} y1={DHt - 6} x2={W - PAD} y2={DHt - 6} stroke="#cbd5e1" />
        <path d={densPath(theta)} fill="none" stroke="#059669" strokeWidth={2} />
        {data.map((x, i) => (
          <circle key={i} cx={sx(x)} cy={DHt - 6} r={3.5} fill="#0f172a" fillOpacity={0.7} />
        ))}
        <text x={W - PAD} y={12} textAnchor="end" fontSize="9" fill="#059669">f(x;θ)</text>
      </svg>

      {/* log-likelihood curve */}
      <svg viewBox={`0 0 ${W} ${LHt}`} className="mx-auto block w-full" style={{ maxWidth: 510 }}>
        <line x1={PAD} y1={LHt - 22} x2={W - PAD} y2={LHt - 22} stroke="#cbd5e1" />
        <path d={llPath} fill="none" stroke="#7c3aed" strokeWidth={2} />
        {/* MLE peak */}
        <line x1={stx(thetaHat)} y1={4} x2={stx(thetaHat)} y2={LHt - 22} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={stx(thetaHat)} y={LHt - 8} textAnchor="middle" fontSize="9" fill="#b45309">θ̂_ML</text>
        {/* current θ */}
        <line x1={stx(theta)} y1={4} x2={stx(theta)} y2={LHt - 22} stroke="#0f172a" strokeWidth={1} strokeDasharray="2 2" />
        <circle cx={stx(theta)} cy={lsy(loglik(theta))} r={4} fill="#0f172a" />
        <text x={PAD} y={12} fontSize="9" fill="#7c3aed">ℓ(θ)=log f(y;θ)</text>
      </svg>

      <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-center text-sm text-emerald-900" dir="ltr">
        <Tex>{`\\hat\\theta_{ML}=\\text{mean}=${thetaHat.toFixed(2)}`}</Tex>
      </div>

      <label className="mt-2 flex items-center gap-3">
        <span className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-slate-600">
          פרמטר <span dir="ltr" className="text-slate-400"><Tex>{'\\theta'}</Tex></span>
        </span>
        <input type="range" min={thmin} max={thmax} step={0.05} value={theta} onChange={(e) => setTheta(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
        <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{theta.toFixed(2)}</span>
      </label>

      <p className="mt-2 text-center text-xs text-slate-400">
        גררו את <span dir="ltr"><Tex>{'\\theta'}</Tex></span>: הצפיפות "מתלבשת" הכי טוב על הנתונים, ו-<span dir="ltr"><Tex>{'\\ell(\\theta)'}</Tex></span> מגיע לשיא, בדיוק ב-<span dir="ltr"><Tex>{'\\hat\\theta_{ML}'}</Tex></span>.
      </p>
    </div>
  )
}
