import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { lineFit, ssr } from '../lib/leastsquares'

/**
 * "Least squares" made literal. A scatter of points and a draggable line: each
 * residual is drawn as an actual SQUARE (side = residual), and the readout is the
 * sum of their areas — SSR. "פתרון LS" snaps the line to θ̂_LS, the minimum. An
 * outlier toggle shows how a single far point drags the (L2) line.
 */

const BASE_X = [1, 2, 3, 4, 5, 6, 7, 8]
const BASE_Y = [1.4, 3.1, 3.6, 5.2, 6.0, 7.4, 8.1, 9.3]
const OUTLIER = { x: 7, y: 0.5 }

const W = 360
const Hh = 300
const PAD = { l: 30, r: 12, t: 12, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b
const X0 = 0, X1 = 9, Y0 = -1, Y1 = 12

export default function RegressionExplorer() {
  const [a, setA] = useState(0.5)
  const [b, setB] = useState(0.7)
  const [outlier, setOutlier] = useState(false)

  const xs = outlier ? [...BASE_X, OUTLIER.x] : BASE_X
  const ys = outlier ? [...BASE_Y, OUTLIER.y] : BASE_Y

  const px = (x: number) => PAD.l + ((x - X0) / (X1 - X0)) * IW
  const py = (y: number) => PAD.t + IH - ((y - Y0) / (Y1 - Y0)) * IH
  const yUnitPx = IH / (Y1 - Y0)

  const cur = ssr(xs, ys, a, b)
  const ls = useMemo(() => lineFit(xs, ys), [outlier])

  const snap = () => { setA(ls.a); setB(ls.b) }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={snap} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white shadow transition hover:bg-emerald-700">פתרון LS ↧</button>
        <button onClick={() => setOutlier((o) => !o)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${outlier ? 'bg-rose-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          {outlier ? 'הסר חריג' : 'הוסף נקודה חריגה'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 470 }}>
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={py(0)} x2={W - PAD.r} y2={py(0)} stroke="#e2e8f0" />

        {/* residual squares */}
        {xs.map((x, i) => {
          const yhat = a + b * x
          const resid = ys[i] - yhat
          const side = Math.abs(resid) * yUnitPx
          const topY = Math.min(py(ys[i]), py(yhat))
          return (
            <g key={i}>
              <rect x={px(x)} y={topY} width={side} height={side} fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeOpacity={0.5} />
              <line x1={px(x)} y1={py(ys[i])} x2={px(x)} y2={py(yhat)} stroke="#f59e0b" strokeWidth={1} />
            </g>
          )
        })}

        {/* fitted line */}
        <line x1={px(X0)} y1={py(a + b * X0)} x2={px(X1)} y2={py(a + b * X1)} stroke="#0f172a" strokeWidth={2} />

        {/* data points */}
        {xs.map((x, i) => (
          <circle key={i} cx={px(x)} cy={py(ys[i])} r={4} fill={outlier && i === xs.length - 1 ? '#e11d48' : '#059669'} />
        ))}
      </svg>

      <div className="mt-2 rounded-lg bg-amber-50 px-3 py-1.5 text-center text-sm text-amber-900" dir="ltr">
        <Tex>{`\\text{SSR}=\\sum_i(y_i-\\hat y_i)^2=${cur.toFixed(2)}`}</Tex>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="חותך" tex="\\theta_0" value={a} min={-2} max={4} step={0.05} onChange={setA} />
        <Slider label="שיפוע" tex="\\theta_1" value={b} min={-0.5} max={2} step={0.02} onChange={setB} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        כל ריבוע כתום = השארית בריבוע; ה-<b>SSR</b> הוא סכום שטחיהם. «פתרון LS» מקפיץ לקו שממזער אותו.
        {outlier && ' שימו לב איך נקודה חריגה אחת "מושכת" את קו ה-LS.'}
      </p>
    </div>
  )
}

function Slider({ label, tex, value, min, max, step, onChange }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}<span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{value.toFixed(2)}</span>
    </label>
  )
}
