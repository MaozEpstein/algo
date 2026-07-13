import { useState } from 'react'
import Tex from '@/core/components/Tex'
import { xorMarginal } from '../lib/processes'

/**
 * SSS vs asymptotic stationarity, on the XOR process (Ex 34): the marginal
 * P(Xₙ=1)=½[1−(1−2p)ⁿ] plotted against n. For p≠½ it DRIFTS toward ½ — the
 * process is not SSS but IS asymptotically stationary (Def 10.5). At p=½ it is
 * flat at ½ from n=1 — SSS (Def 10.4). Slide p to see the two regimes.
 */

const NMAX = 20
const W = 380
const Hh = 210
const PAD = { l: 30, r: 12, t: 14, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b

export default function MarginalDriftExplorer() {
  const [p, setP] = useState(0.2)

  const sx = (n: number) => PAD.l + ((n - 1) / (NMAX - 1)) * IW
  const sy = (v: number) => PAD.t + IH - v * IH // v in [0,1]

  const pts = Array.from({ length: NMAX }, (_, i) => {
    const n = i + 1
    return { n, p1: xorMarginal(n, p).p1 }
  })
  const isSSS = Math.abs(p - 0.5) < 1e-9

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={PAD.t + IH} x2={PAD.l + IW} y2={PAD.t + IH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
        {/* the ½ asymptote */}
        <line x1={PAD.l} y1={sy(0.5)} x2={PAD.l + IW} y2={sy(0.5)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
        <text x={PAD.l - 4} y={sy(0.5) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">½</text>
        <text x={PAD.l - 4} y={sy(1) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">1</text>
        <text x={PAD.l - 4} y={sy(0) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">0</text>
        <text x={PAD.l + IW / 2} y={Hh - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">n</text>

        {/* P(Xn=1) vs n */}
        <polyline points={pts.map((d) => `${sx(d.n).toFixed(1)},${sy(d.p1).toFixed(1)}`).join(' ')} fill="none" stroke="#7c3aed" strokeWidth={2} />
        {pts.map((d) => <circle key={d.n} cx={sx(d.n)} cy={sy(d.p1)} r={2.2} fill="#7c3aed" />)}
        <text x={PAD.l + IW} y={sy(pts[NMAX - 1].p1) - 5} textAnchor="end" fontSize="8" fill="#7c3aed">P(Xₙ=1)</text>
      </svg>

      <div className={`mt-2 rounded-lg px-3 py-1.5 text-center text-sm ${isSSS ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
        {isSSS
          ? <>ב-<span dir="ltr"><Tex>{'p=\\tfrac12'}</Tex></span>: השוליים קבועים ½ מ-n=1 — התהליך <b>SSS</b>.</>
          : <>ב-<span dir="ltr"><Tex>{'p\\ne\\tfrac12'}</Tex></span>: השוליים תלויים ב-n אך מתכנסים ל-½ — <b>סטציונרי אסימפטוטית</b> בלבד.</>}
      </div>

      <div className="mt-2">
        <Slider label="הסתברות" tex="p" value={p} min={0.05} max={0.95} step={0.05} onChange={setP} display={p.toFixed(2)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        <span dir="ltr"><Tex>{'P(X_n{=}1)=\\tfrac12[1-(1-2p)^n]'}</Tex></span> — סטציונריות במובן הצר (SSS) דורשת שהשוליים
        (וכל ההתפלגויות) <b>לא</b> יהיו תלויים ב-n; סטציונריות אסימפטוטית דורשת רק <b>התכנסות</b> כאשר <span dir="ltr"><Tex>{'n\\to\\infty'}</Tex></span>.
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
