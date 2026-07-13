import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { arProcess, arAutocorr, ltiOutputAutocorr } from '../lib/processes'

/**
 * A WSS input through a stable LTI system (Ex 45): a moving-average filter
 * h=[1/L,…,1/L] of adjustable length L. The input is AR(1) (α=0.5); the output
 * y[n]=Σ h[i]x[n−i] is visibly smoother. The output autocorrelation R_Y(k)=
 * Σᵢ Σⱼ h[i]h[j]R_X[k+j−i] (from ltiOutputAutocorr) is drawn as a stem plot —
 * WSS in ⇒ WSS out, and a longer filter reshapes/narrows R_Y.
 */

const A_IN = 0.5
const LEN = 44
const KMAX = 8
const W = 380
const H_TOP = 116
const H_BOT = 122
const PAD = { l: 28, r: 12, t: 14, b: 20 }

export default function LtiFilterExplorer() {
  const [L, setL] = useState(3)

  const { xin, yout, acf, rmax } = useMemo(() => {
    const h = new Array(L).fill(1 / L)
    const xin = arProcess(LEN, A_IN, 271)
    const yout = xin.map((_, n) => h.reduce((s, hi, i) => s + hi * (n - i >= 0 ? xin[n - i] : 0), 0))
    const acf = Array.from({ length: 2 * KMAX + 1 }, (_, i) => {
      const k = i - KMAX
      return { k, r: ltiOutputAutocorr(h, (lag) => arAutocorr(lag, A_IN), k) }
    })
    const rmax = Math.max(...acf.map((d) => Math.abs(d.r))) || 1
    return { xin, yout, acf, rmax }
  }, [L])

  const allv = [...xin, ...yout]
  const lo = Math.min(...allv), hi = Math.max(...allv)
  const span = hi - lo || 1
  const tx = (n: number) => PAD.l + (n / (LEN - 1)) * (W - PAD.l - PAD.r)
  const ty = (v: number) => PAD.t + (H_TOP - PAD.t - PAD.b) * (1 - (v - lo) / span)

  const iw = W - PAD.l - PAD.r
  const ax = (k: number) => PAD.l + ((k + KMAX) / (2 * KMAX)) * iw
  const zero = PAD.t + (H_BOT - PAD.t - PAD.b) / 2
  const ay = (r: number) => zero - (r / rmax) * ((H_BOT - PAD.t - PAD.b) / 2 - 4)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${H_TOP}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <polyline points={xin.map((v, n) => `${tx(n).toFixed(1)},${ty(v).toFixed(1)}`).join(' ')} fill="none" stroke="#cbd5e1" strokeWidth={1.2} />
        <polyline points={yout.map((v, n) => `${tx(n).toFixed(1)},${ty(v).toFixed(1)}`).join(' ')} fill="none" stroke="#059669" strokeWidth={1.8} />
        <text x={PAD.l} y={PAD.t - 2} fontSize="8" fill="#94a3b8">כניסה x[n] (אפור) → יציאה y[n] (ירוק)</text>
      </svg>

      <svg viewBox={`0 0 ${W} ${H_BOT}`} className="mx-auto mt-1 block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={zero} x2={W - PAD.r} y2={zero} stroke="#cbd5e1" />
        {acf.map((d) => (
          <g key={d.k}>
            <line x1={ax(d.k)} y1={zero} x2={ax(d.k)} y2={ay(d.r)} stroke={d.k === 0 ? '#7c3aed' : '#a78bfa'} strokeWidth={d.k === 0 ? 2.4 : 1.6} />
            <circle cx={ax(d.k)} cy={ay(d.r)} r={d.k === 0 ? 3 : 2.2} fill={d.k === 0 ? '#7c3aed' : '#a78bfa'} />
          </g>
        ))}
        <text x={PAD.l} y={PAD.t + 2} fontSize="8" fill="#94a3b8">אוטו-קורלציה של היציאה R_Y(τ)</text>
        <text x={W - PAD.r} y={zero + 12} textAnchor="end" fontSize="8" fill="#94a3b8">τ</text>
      </svg>

      <div className="mt-2">
        <Slider label="אורך מסנן" tex="L" value={L} min={1} max={7} step={1} onChange={setL} display={String(L)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        מסנן ממוצע-נע <span dir="ltr"><Tex>{'h=[1/L,\\dots,1/L]'}</Tex></span> על כניסת AR(1). ה<b>יציאה חלקה יותר</b>, ונשארת
        <b> WSS</b> — <span dir="ltr"><Tex>{'R_Y(k)=\\sum_i\\sum_j h[i]h[j]R_X[k+j-i]'}</Tex></span>. מסנן ארוך יותר מרחיב את הזיכרון של <span dir="ltr"><Tex>{'R_Y'}</Tex></span>.
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
