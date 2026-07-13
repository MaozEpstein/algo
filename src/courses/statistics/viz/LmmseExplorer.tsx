import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { conditionalNormal } from '../lib/gaussian2d'
import { lmmseScalar } from '../lib/linbayes'

/**
 * LMMSE made visible for a jointly-Gaussian (Y,X): a fixed standard-normal cloud
 * re-correlated by the ρ slider, with the BLE/LMMSE line x̂=ρ(σ_x/σ_y)(y−μ_y)
 * drawn through it. A movable observation y* shows the estimate x̂(y*) and the
 * √mse error band. Because the cloud is Gaussian, this straight line IS the MMSE
 * E[X|Y=y] (conditionalNormal from lesson 4) — the punchline of Thm 9.2.
 */

// A fixed standard-normal sample (seeded LCG + Box–Muller) so the cloud is stable
// across renders; only its correlation changes with the slider.
const PAIRS: [number, number][] = (() => {
  let s = 20240709 >>> 0
  const rand = () => (s = (1103515245 * s + 12345) >>> 0) / 4294967296
  const out: [number, number][] = []
  for (let i = 0; i < 140; i++) {
    const u1 = Math.max(rand(), 1e-6)
    const u2 = rand()
    const r = Math.sqrt(-2 * Math.log(u1))
    out.push([r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)])
  }
  return out
})()

const W = 380
const Hh = 300
const PAD = { l: 30, r: 12, t: 14, b: 28 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b
const LO = -3.2, HI = 3.2

export default function LmmseExplorer() {
  const [rho, setRho] = useState(0.7)
  const [ystar, setYstar] = useState(1.4)

  const sx = (y: number) => PAD.l + ((y - LO) / (HI - LO)) * IW
  const sy = (x: number) => PAD.t + IH - ((x - LO) / (HI - LO)) * IH

  const { pts, cond, est } = useMemo(() => {
    // Y = a, X = ρ·a + √(1−ρ²)·b  →  correlation ρ, unit variances, zero means.
    const k = Math.sqrt(Math.max(0, 1 - rho * rho))
    const pts = PAIRS.map(([a, b]) => ({ y: a, x: rho * a + k * b }))
    const cond = conditionalNormal(1, 1, rho, ystar) // σx=σy=1
    const est = lmmseScalar({ muX: 0, varX: 1, muY: 0, varY: 1, covXY: rho }, ystar)
    return { pts, cond, est }
  }, [rho, ystar])

  const sd = Math.sqrt(Math.max(0, est.mse))
  // BLE line endpoints: x̂ = ρ·y across the y-domain.
  const lineY1 = LO, lineY2 = HI

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        {/* axes */}
        <line x1={PAD.l} y1={sy(0)} x2={W - PAD.r} y2={sy(0)} stroke="#e2e8f0" />
        <line x1={sx(0)} y1={PAD.t} x2={sx(0)} y2={PAD.t + IH} stroke="#e2e8f0" />
        <text x={W - PAD.r} y={sy(0) - 4} textAnchor="end" fontSize="9" fill="#94a3b8">y</text>
        <text x={sx(0) + 4} y={PAD.t + 8} fontSize="9" fill="#94a3b8">x</text>

        {/* ±√mse band around the BLE line */}
        <path
          d={`M${sx(lineY1)} ${sy(rho * lineY1 + sd)} L${sx(lineY2)} ${sy(rho * lineY2 + sd)} L${sx(lineY2)} ${sy(rho * lineY2 - sd)} L${sx(lineY1)} ${sy(rho * lineY1 - sd)} Z`}
          fill="#7c3aed" fillOpacity={0.08}
        />

        {/* scatter cloud */}
        {pts.map((p, i) => (
          <circle key={i} cx={sx(p.y)} cy={sy(p.x)} r={2} fill="#059669" fillOpacity={0.5} />
        ))}

        {/* BLE / LMMSE line */}
        <line x1={sx(lineY1)} y1={sy(rho * lineY1)} x2={sx(lineY2)} y2={sy(rho * lineY2)} stroke="#7c3aed" strokeWidth={2.5} />

        {/* observation y* and the estimate x̂(y*) */}
        <line x1={sx(ystar)} y1={PAD.t} x2={sx(ystar)} y2={PAD.t + IH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={sx(ystar)} y1={sy(est.estimate)} x2={sx(0)} y2={sy(est.estimate)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <circle cx={sx(ystar)} cy={sy(est.estimate)} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1} />
        <text x={sx(ystar) + 4} y={sy(est.estimate) - 6} fontSize="8" fill="#b45309">x̂(y*)</text>
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-[11px] text-slate-400">
        <span className="text-violet-600">— קו LMMSE (BLE)</span>
        <span className="text-emerald-600">• ענן גאוסי משותף</span>
        <span className="text-amber-600">◆ אמד בתצפית y*</span>
      </div>

      <div className="mt-2 rounded-lg bg-violet-50 px-3 py-1.5 text-center text-sm text-violet-900" dir="ltr">
        <Tex>{`\\hat x(y^*)=${est.estimate.toFixed(2)},\\quad \\mathrm{mse}=1-\\rho^2=${est.mse.toFixed(2)}`}</Tex>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="מתאם" tex="\\rho" value={rho} min={-0.95} max={0.95} step={0.05} onChange={setRho} display={rho.toFixed(2)} />
        <Slider label="תצפית" tex="y^*" value={ystar} min={-3} max={3} step={0.1} onChange={setYstar} display={ystar.toFixed(1)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        כיוון שהענן <b>גאוסי משותף</b>, הקו הישר הזה הוא בדיוק ה-MMSE משיעור 4:{' '}
        <span dir="ltr"><Tex>{`E[X\\mid Y{=}y^*]=\\rho\\,y^*=${cond.mean.toFixed(2)}`}</Tex></span> — אין אמד לא-לינארי טוב יותר. ככל ש-<span dir="ltr"><Tex>{'|\\rho|'}</Tex></span> גדל, רצועת השגיאה מצטמצמת.
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
