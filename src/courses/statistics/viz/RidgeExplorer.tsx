import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { polyFit, predict } from '../lib/leastsquares'

/**
 * The bias-variance of regularization. Noisy data fitted by a polynomial: raise
 * the degree with λ=0 and the curve overfits (wiggles through every point — high
 * variance); raise λ and it smooths out (biased toward flat — low variance). x is
 * rescaled to [-1,1] before fitting so high powers stay well-conditioned.
 */

// deterministic noisy data around a gentle curve
const XS = Array.from({ length: 11 }, (_, i) => (i / 10) * 6)
const YS = ((): number[] => {
  let s = 24681
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  return XS.map((x) => 2 + 1.1 * x - 0.16 * x * x + 1.1 * (rnd() - 0.5) * 2)
})()

const W = 360
const Hh = 260
const PAD = { l: 28, r: 12, t: 12, b: 24 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b
const X0 = 0, X1 = 6, Y0 = -1, Y1 = 8

const tOf = (x: number) => (x - 3) / 3 // rescale to [-1,1] for conditioning

export default function RidgeExplorer() {
  const [degree, setDegree] = useState(9)
  const [lambda, setLambda] = useState(0)

  const coeffs = useMemo(() => polyFit(XS.map(tOf), YS, degree, lambda), [degree, lambda])

  const px = (x: number) => PAD.l + ((x - X0) / (X1 - X0)) * IW
  const py = (y: number) => PAD.t + IH - ((y - Y0) / (Y1 - Y0)) * IH
  const path = useMemo(() => {
    let d = ''
    for (let i = 0; i <= 160; i++) {
      const x = X0 + (i / 160) * (X1 - X0)
      const y = Math.max(Y0 - 2, Math.min(Y1 + 2, predict(coeffs, tOf(x))))
      d += `${i ? 'L' : 'M'}${px(x).toFixed(1)} ${py(y).toFixed(1)} `
    }
    return d
  }, [coeffs])

  const overfit = lambda < 0.05 && degree >= 6

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 470 }}>
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={py(0)} x2={W - PAD.r} y2={py(0)} stroke="#e2e8f0" />
        <path d={path} fill="none" stroke={overfit ? '#e11d48' : '#059669'} strokeWidth={2} />
        {XS.map((x, i) => (
          <circle key={i} cx={px(x)} cy={py(YS[i])} r={4} fill="#0f172a" fillOpacity={0.7} />
        ))}
      </svg>

      <div className="mt-1 text-center text-sm" dir="ltr">
        <span className={`rounded-lg px-2 py-1 ${overfit ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'}`}>
          <Tex>{`\\text{degree}=${degree},\\ \\lambda=${lambda.toFixed(2)}`}</Tex>
        </span>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="דרגת פולינום" tex="d" value={degree} min={1} max={10} step={1} onChange={setDegree} display={String(degree)} />
        <Slider label="רגולריזציה" tex="\\lambda" value={lambda} min={0} max={4} step={0.05} onChange={setLambda} display={lambda.toFixed(2)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        דרגה גבוהה עם <span dir="ltr"><Tex>{'\\lambda=0'}</Tex></span> → <b>התאמת-יתר</b> (עקומה מתפתלת, שונות גבוהה). הגדלת{' '}
        <span dir="ltr"><Tex>{'\\lambda'}</Tex></span> "מרגיעה" את המקדמים → עקומה חלקה (מוטה, שונות נמוכה).
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
