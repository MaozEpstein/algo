import { useState } from 'react'
import Tex from '@/core/components/Tex'
import { gaussianPdf } from '../lib/distributions'
import { softDecision, mapThreshold } from '../lib/bayes'

/**
 * The bit-through-Gaussian-channel (Example 28). X∈{0,1}, Y=X+N. The MMSE "soft
 * decision" E[X|Y] is a sigmoid rising 0→1; the MAP "hard decision" is a step at
 * the threshold ½+σ²ln((1−p)/p). Faint background: the two conditional Gaussians
 * weighted by the prior. Ties back to the lesson-1 sigmoid and lesson-5 detection.
 */

const W = 360
const Hh = 200
const PAD = { l: 24, r: 12, t: 12, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b
const LO = -3, HI = 4

export default function SoftDecisionExplorer() {
  const [p, setP] = useState(0.5)
  const [sigma, setSigma] = useState(0.6)

  const sx = (y: number) => PAD.l + ((y - LO) / (HI - LO)) * IW
  const sy = (v: number) => PAD.t + IH - v * IH // v in [0,1]
  const thr = Math.max(LO, Math.min(HI, mapThreshold(p, sigma)))

  const sigmoidPath = (() => {
    let d = ''
    for (let i = 0; i <= 160; i++) {
      const y = LO + (i / 160) * (HI - LO)
      d += `${i ? 'L' : 'M'}${sx(y).toFixed(1)} ${sy(softDecision(y, p, sigma)).toFixed(1)} `
    }
    return d
  })()

  // faint conditional densities (scaled to fit under the plot)
  const gmax = gaussianPdf(0, 0, sigma)
  const densPath = (mu: number, weight: number) => {
    let d = ''
    for (let i = 0; i <= 160; i++) {
      const y = LO + (i / 160) * (HI - LO)
      const v = (weight * gaussianPdf(y, mu, sigma)) / gmax // 0..~1
      d += `${i ? 'L' : 'M'}${sx(y).toFixed(1)} ${sy(v * 0.9).toFixed(1)} `
    }
    return d
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 440 }}>
        <line x1={PAD.l} y1={PAD.t + IH} x2={W - PAD.r} y2={PAD.t + IH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
        <text x={PAD.l - 4} y={sy(1) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">1</text>
        <text x={PAD.l - 4} y={sy(0) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">0</text>

        {/* conditional densities */}
        <path d={densPath(0, 1 - p)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.7} />
        <path d={densPath(1, p)} fill="none" stroke="#34d399" strokeWidth={1} strokeOpacity={0.7} />

        {/* MAP hard decision (step) */}
        <path d={`M${sx(LO)} ${sy(0)} L${sx(thr)} ${sy(0)} L${sx(thr)} ${sy(1)} L${sx(HI)} ${sy(1)}`} fill="none" stroke="#0f172a" strokeWidth={1.6} strokeDasharray="5 3" />
        {/* MMSE soft decision (sigmoid) */}
        <path d={sigmoidPath} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
        {/* threshold */}
        <line x1={sx(thr)} y1={PAD.t} x2={sx(thr)} y2={PAD.t + IH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={sx(thr)} y={Hh - 3} textAnchor="middle" fontSize="8" fill="#b45309">סף MAP</text>
        <text x={sx(HI) - 2} y={sy(1) - 4} textAnchor="end" fontSize="8" fill="#7c3aed">E[X|Y]</text>
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-[11px] text-slate-400">
        <span className="text-violet-600">— רך (MMSE, סיגמואיד)</span>
        <span className="text-slate-700">‑ ‑ קשה (MAP, מדרגה)</span>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="prior" tex="p=\\Pr(X{=}1)" value={p} min={0.1} max={0.9} step={0.05} onChange={setP} display={p.toFixed(2)} />
        <Slider label="רעש" tex="\\sigma" value={sigma} min={0.2} max={1.5} step={0.05} onChange={setSigma} display={sigma.toFixed(2)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        ה-MMSE נותן החלטה <b>רכה</b> (הסתברות ל-1) בצורת סיגמואיד; ה-MAP נותן החלטה <b>קשה</b> (0/1) בסף. הקטנת הרעש
        מחדדת את הסיגמואיד למדרגה, ושינוי ה-prior מזיז את הסף.
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
      <span className="w-14 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
