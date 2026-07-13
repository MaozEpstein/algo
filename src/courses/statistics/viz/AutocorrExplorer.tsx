import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { maProcess, arProcess, cosineProcess, maAutocorr, arAutocorr, cosineAutocorr } from '../lib/processes'

/**
 * The autocorrelation as the "fingerprint" of a WSS process. Pick a process
 * (random-phase cosine / MA(1) / AR(1)); the top panel is a realization, the
 * bottom is its autocorrelation R_X(τ) as a stem plot over lags. R_X(0) is the
 * power; the plot is symmetric R(τ)=R(−τ). AR decay follows α, the cosine is
 * periodic, MA is 2/1/0. Values from lib/processes.ts.
 */

type Kind = 'cosine' | 'ma' | 'ar'

const KINDS: { id: Kind; labelHe: string }[] = [
  { id: 'cosine', labelHe: 'קוסינוס אקראי' },
  { id: 'ma', labelHe: 'MA(1)' },
  { id: 'ar', labelHe: 'AR(1)' },
]

const LEN = 40
const KMAX = 8
const W = 380
const H_TOP = 108
const H_BOT = 128
const PAD = { l: 28, r: 12, t: 12, b: 22 }

export default function AutocorrExplorer() {
  const [kind, setKind] = useState<Kind>('ar')
  const [a, setA] = useState(0.7)
  const [f, setF] = useState(0.1)

  const { real, acf, rmax } = useMemo(() => {
    const real =
      kind === 'ma' ? maProcess(LEN, 314) : kind === 'ar' ? arProcess(LEN, a, 314) : cosineProcess(LEN, f, 314)
    const rfun = (k: number) => (kind === 'ma' ? maAutocorr(k) : kind === 'ar' ? arAutocorr(k, a) : cosineAutocorr(k, f))
    const acf = Array.from({ length: 2 * KMAX + 1 }, (_, i) => {
      const k = i - KMAX
      return { k, r: rfun(k) }
    })
    const rmax = Math.max(...acf.map((d) => Math.abs(d.r))) || 1
    return { real, acf, rmax }
  }, [kind, a, f])

  // realization panel
  const rlo = Math.min(...real), rhi = Math.max(...real)
  const rspan = rhi - rlo || 1
  const tx = (n: number) => PAD.l + (n / (LEN - 1)) * (W - PAD.l - PAD.r)
  const ty = (v: number) => PAD.t + (H_TOP - PAD.t - PAD.b) * (1 - (v - rlo) / rspan)

  // acf panel
  const iw = W - PAD.l - PAD.r
  const ax = (k: number) => PAD.l + ((k + KMAX) / (2 * KMAX)) * iw
  const zero = PAD.t + (H_BOT - PAD.t - PAD.b) / 2
  const ay = (r: number) => zero - (r / rmax) * ((H_BOT - PAD.t - PAD.b) / 2 - 4)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => setKind(k.id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${kind === k.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {k.labelHe}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H_TOP}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={ty(0)} x2={W - PAD.r} y2={ty(0)} stroke="#e2e8f0" />
        <polyline points={real.map((v, n) => `${tx(n).toFixed(1)},${ty(v).toFixed(1)}`).join(' ')} fill="none" stroke="#059669" strokeWidth={1.4} />
        <text x={PAD.l} y={PAD.t + 2} fontSize="8" fill="#94a3b8">מימוש x[n]</text>
      </svg>

      <svg viewBox={`0 0 ${W} ${H_BOT}`} className="mx-auto mt-1 block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={zero} x2={W - PAD.r} y2={zero} stroke="#cbd5e1" />
        {/* stems */}
        {acf.map((d) => (
          <g key={d.k}>
            <line x1={ax(d.k)} y1={zero} x2={ax(d.k)} y2={ay(d.r)} stroke={d.k === 0 ? '#7c3aed' : '#a78bfa'} strokeWidth={d.k === 0 ? 2.4 : 1.6} />
            <circle cx={ax(d.k)} cy={ay(d.r)} r={d.k === 0 ? 3 : 2.2} fill={d.k === 0 ? '#7c3aed' : '#a78bfa'} />
          </g>
        ))}
        <text x={ax(0) + 5} y={ay(rmax) + 2} fontSize="8" fill="#7c3aed">R(0) = הספק</text>
        <text x={W - PAD.r} y={zero + 12} textAnchor="end" fontSize="8" fill="#94a3b8">τ (פיגור)</text>
        <text x={PAD.l} y={PAD.t + 2} fontSize="8" fill="#94a3b8">אוטו-קורלציה R_X(τ)</text>
      </svg>

      <div className="mt-2 space-y-1.5">
        {kind === 'ar' && <Slider label="מקדם" tex="\\alpha" value={a} min={-0.95} max={0.95} step={0.05} onChange={setA} display={a.toFixed(2)} />}
        {kind === 'cosine' && <Slider label="תדר" tex="f" value={f} min={0.02} max={0.3} step={0.01} onChange={setF} display={f.toFixed(2)} />}
        {kind === 'ma' && <p className="text-center text-xs text-slate-400">ל-MA(1) אין פרמטר — <span dir="ltr"><Tex>{'R_X=\\{2,1,0\\}'}</Tex></span>.</p>}
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        האוטו-קורלציה היא "טביעת האצבע" של תהליך WSS: <b>סימטרית</b> (<span dir="ltr"><Tex>{'R(\\tau)=R(-\\tau)'}</Tex></span>), שיאה ב-
        <span dir="ltr"><Tex>{'\\tau=0'}</Tex></span> (ההספק), וחסומה <span dir="ltr"><Tex>{'|R(\\tau)|\\le R(0)'}</Tex></span>. AR דועך עם <span dir="ltr"><Tex>{'\\alpha'}</Tex></span>, קוסינוס מחזורי.
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
