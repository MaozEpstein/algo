import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { kalmanRun } from '../lib/filters'

/**
 * The Kalman filter as the course capstone (recitation §3). A scalar state
 * S_n=S_{n−1}+Q_n (random walk) is observed through noise X_n=S_n+R_n. The filter
 * tracks the hidden state: true state (line), noisy measurements (dots), the
 * recursive estimate Ŝ_{n|n} (line) and its ±√P error band. Sliders for the
 * process noise σ_Q and measurement noise σ_R trade trust between model and data
 * via the gain K_n. Uses kalmanRun from lib/filters.ts.
 */

const LEN = 44
const A = 1 // random-walk state
const W = 380
const Hh = 230
const PAD = { l: 24, r: 12, t: 14, b: 24 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b

/** Deterministic standard-normal stream (LCG + Box–Muller) so the scene is stable. */
function gaussStream(seed: number): () => number {
  let s = seed >>> 0
  const u = () => (s = (1103515245 * s + 12345) >>> 0) / 4294967296
  return () => {
    const u1 = Math.max(u(), 1e-6)
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u())
  }
}

export default function KalmanFilterExplorer() {
  const [sigQ, setSigQ] = useState(0.4)
  const [sigR, setSigR] = useState(1.2)

  const { state, obs, est, band, lo, hi } = useMemo(() => {
    const gs = gaussStream(4242)
    const go = gaussStream(1337)
    const state: number[] = []
    const obs: number[] = []
    let s = 0
    for (let n = 0; n < LEN; n++) {
      s = A * s + sigQ * gs()
      state.push(s)
      obs.push(s + sigR * go())
    }
    const run = kalmanRun(obs, A, sigQ * sigQ, sigR * sigR, 1)
    const est = run.sHat
    const band = run.P.map((p) => Math.sqrt(Math.max(0, p)))
    const all = [...state, ...obs, ...est]
    return { state, obs, est, band, lo: Math.min(...all), hi: Math.max(...all) }
  }, [sigQ, sigR])

  const span = hi - lo || 1
  const sx = (n: number) => PAD.l + (n / (LEN - 1)) * IW
  const sy = (v: number) => PAD.t + IH - ((v - lo) / span) * IH

  const bandPath = (() => {
    const up = est.map((e, n) => `${sx(n).toFixed(1)},${sy(e + band[n]).toFixed(1)}`).join(' L')
    const dn = est.map((e, n) => `${sx(n).toFixed(1)},${sy(e - band[n]).toFixed(1)}`).reverse().join(' L')
    return `M${up} L${dn} Z`
  })()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        {/* ±√P error band */}
        <path d={bandPath} fill="#7c3aed" fillOpacity={0.12} />
        {/* measurements */}
        {obs.map((v, n) => <circle key={n} cx={sx(n)} cy={sy(v)} r={1.9} fill="#f59e0b" fillOpacity={0.8} />)}
        {/* true state */}
        <polyline points={state.map((v, n) => `${sx(n).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')} fill="none" stroke="#94a3b8" strokeWidth={1.6} strokeDasharray="4 3" />
        {/* kalman estimate */}
        <polyline points={est.map((v, n) => `${sx(n).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')} fill="none" stroke="#059669" strokeWidth={2.2} />
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-[11px] text-slate-400">
        <span className="text-slate-500">‑ ‑ מצב אמיתי</span>
        <span className="text-amber-600">• מדידות רועשות</span>
        <span className="text-emerald-600">— אמד קלמן</span>
        <span className="text-violet-600">▮ רצועת ±√P</span>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="רעש מודל" tex="\\sigma_Q" value={sigQ} min={0.1} max={1.2} step={0.05} onChange={setSigQ} display={sigQ.toFixed(2)} />
        <Slider label="רעש מדידה" tex="\\sigma_R" value={sigR} min={0.2} max={2.5} step={0.1} onChange={setSigR} display={sigR.toFixed(2)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        הפילטר משקלל <b>ניבוי</b> (מהמודל) מול <b>מדידה</b> דרך הרווח <span dir="ltr"><Tex>{'K_n=P_{n|n-1}/(P_{n|n-1}+\\sigma_R^2)'}</Tex></span>.
        רעש מדידה גבוה → נצמדים למודל (רצועה רחבה); רעש מודל גבוה → נצמדים למדידות. זהו ה-LMMSE של שיעור 9, <b>רקורסיבי</b>.
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
