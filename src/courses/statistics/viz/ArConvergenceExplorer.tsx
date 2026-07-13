import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { arProcess } from '../lib/processes'
import { arLimits } from '../lib/filters'

/**
 * Asymptotic stationarity of AR(1) made visible (§12.1). An ensemble of
 * realizations all start at X_0=0; the empirical variance Var(X_n) climbs and
 * converges to the stationary line σ_W²/(1−α²) (from arLimits). Near |α|→1 the
 * limit shoots up and convergence slows; at |α|≥1 it diverges (no finite limit).
 * σ_W²=1 fixed. Realizations from lib/processes.ts.
 */

const LEN = 40
const ENS = 220
const W = 380
const Hh = 220
const PAD = { l: 34, r: 12, t: 14, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b

export default function ArConvergenceExplorer() {
  const [alpha, setAlpha] = useState(0.7)

  const { vars, limit, ymax } = useMemo(() => {
    const ens = Array.from({ length: ENS }, (_, s) => arProcess(LEN, alpha, 900 + s * 17))
    const vars = Array.from({ length: LEN }, (_, n) => {
      let s2 = 0
      for (const r of ens) s2 += r[n] * r[n] // mean ≈ 0
      return s2 / ENS
    })
    const stable = Math.abs(alpha) < 1
    const limit = stable ? arLimits(alpha, 1).variance : Infinity
    const empMax = Math.max(...vars)
    const ymax = stable ? Math.max(limit, empMax) * 1.15 : empMax * 1.1
    return { vars, limit, ymax }
  }, [alpha])

  const sx = (n: number) => PAD.l + (n / (LEN - 1)) * IW
  const sy = (v: number) => PAD.t + IH - (v / ymax) * IH

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={PAD.t + IH} x2={PAD.l + IW} y2={PAD.t + IH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
        <text x={PAD.l + IW / 2} y={Hh - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">n</text>
        <text x={PAD.l - 4} y={sy(0) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">0</text>

        {/* stationary limit line */}
        {Number.isFinite(limit) && (
          <>
            <line x1={PAD.l} y1={sy(limit)} x2={PAD.l + IW} y2={sy(limit)} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="5 3" />
            <text x={PAD.l + IW} y={sy(limit) - 4} textAnchor="end" fontSize="8" fill="#7c3aed">σ²/(1−α²)</text>
          </>
        )}

        {/* empirical variance curve */}
        <polyline points={vars.map((v, n) => `${sx(n).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')} fill="none" stroke="#059669" strokeWidth={2} />
        {vars.map((v, n) => <circle key={n} cx={sx(n)} cy={sy(v)} r={1.8} fill="#059669" />)}
        <text x={PAD.l + 4} y={PAD.t + 8} fontSize="8" fill="#059669">Var(X_n) אמפירי</text>
      </svg>

      <div className="mt-2 rounded-lg px-3 py-1.5 text-center text-sm" dir="ltr" style={{ background: Math.abs(alpha) < 1 ? '#f5f3ff' : '#fff7ed', color: Math.abs(alpha) < 1 ? '#5b21b6' : '#9a3412' }}>
        {Math.abs(alpha) < 1
          ? <Tex>{`\\lim_{n\\to\\infty}\\mathrm{Var}(X_n)=\\frac{\\sigma^2}{1-\\alpha^2}=${arLimits(alpha, 1).variance.toFixed(2)}`}</Tex>
          : <Tex>{'\\mathrm{Var}(X_n)\\to\\infty\\quad(|\\alpha|\\ge1)'}</Tex>}
      </div>

      <div className="mt-2">
        <Slider label="מקדם" tex="\\alpha" value={alpha} min={0.3} max={1.1} step={0.05} onChange={setAlpha} display={alpha.toFixed(2)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        כל המימושים מתחילים ב-<span dir="ltr"><Tex>{'X_0=0'}</Tex></span>. השונות <b>מטפסת ומתייצבת</b> על{' '}
        <span dir="ltr"><Tex>{'\\sigma^2/(1-\\alpha^2)'}</Tex></span> — <b>סטציונרי אסימפטוטית</b>. ככל ש-<span dir="ltr"><Tex>{'\\alpha\\to1'}</Tex></span> הגבול מתפוצץ; ב-
        <span dir="ltr"><Tex>{'|\\alpha|\\ge1'}</Tex></span> אין גבול סופי — לא סטציונרי.
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
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-violet-200 accent-violet-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
