import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { iidBernoulli, randomWalk, maProcess, arProcess, cosineProcess } from '../lib/processes'

/**
 * A random process seen two ways at once (Def 10.1): the overlaid polylines are
 * REALIZATIONS (fix ζ → a function of time); the sideways histogram at the movable
 * time-slice t₀ is the RANDOM VARIABLE X(t₀) (fix t → an RV) sampled across the
 * ensemble. Switch between the textbook processes (i.i.d. Bernoulli, counting,
 * MA(1), AR(1), random-phase cosine). Samples come from lib/processes.ts.
 */

type Kind = 'bernoulli' | 'counting' | 'ma' | 'ar' | 'cosine'

const KINDS: { id: Kind; labelHe: string }[] = [
  { id: 'bernoulli', labelHe: 'ברנולי i.i.d' },
  { id: 'counting', labelHe: 'מהלך מקרי' },
  { id: 'ma', labelHe: 'MA(1)' },
  { id: 'ar', labelHe: 'AR(1)' },
  { id: 'cosine', labelHe: 'קוסינוס אקראי' },
]

const LEN = 24
const N_LINES = 7
const N_HIST = 240
const HIST_BINS = 12

const W = 380
const Hh = 240
const PAD = { l: 26, r: 74, t: 12, b: 26 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b

function realization(kind: Kind, seed: number, param: number): number[] {
  switch (kind) {
    case 'bernoulli': return iidBernoulli(LEN, param, seed)
    case 'counting': return randomWalk(LEN, param, seed)
    case 'ma': return maProcess(LEN, seed)
    case 'ar': return arProcess(LEN, param, seed)
    case 'cosine': return cosineProcess(LEN, param, seed)
  }
}

export default function ProcessExplorer() {
  const [kind, setKind] = useState<Kind>('ma')
  const [t0, setT0] = useState(12)
  const [p, setP] = useState(0.5)
  const [a, setA] = useState(0.7)
  const [f, setF] = useState(0.12)

  const param = kind === 'ar' ? a : kind === 'cosine' ? f : p

  const { lines, lo, hi, hist, maxCount } = useMemo(() => {
    const lines = Array.from({ length: N_LINES }, (_, i) => realization(kind, 101 + i * 37, param))
    // value range across the drawn lines (with a little padding)
    let lo = Infinity, hi = -Infinity
    for (const ln of lines) for (const v of ln) { lo = Math.min(lo, v); hi = Math.max(hi, v) }
    if (lo === hi) { lo -= 1; hi += 1 }
    const pad = (hi - lo) * 0.08
    lo -= pad; hi += pad
    // histogram of X(t0) across a big ensemble
    const bins = new Array(HIST_BINS).fill(0)
    for (let s = 0; s < N_HIST; s++) {
      const v = realization(kind, 5000 + s * 13, param)[t0]
      let b = Math.floor(((v - lo) / (hi - lo)) * HIST_BINS)
      b = Math.max(0, Math.min(HIST_BINS - 1, b))
      bins[b]++
    }
    return { lines, lo, hi, hist: bins, maxCount: Math.max(...bins) || 1 }
  }, [kind, param, t0])

  const sx = (n: number) => PAD.l + (n / (LEN - 1)) * IW
  const sy = (v: number) => PAD.t + IH - ((v - lo) / (hi - lo)) * IH

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

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        {/* axes */}
        <line x1={PAD.l} y1={PAD.t + IH} x2={PAD.l + IW} y2={PAD.t + IH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + IH} stroke="#cbd5e1" />
        <text x={PAD.l + IW / 2} y={Hh - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">n (זמן)</text>

        {/* ensemble of realizations */}
        {lines.map((ln, i) => (
          <polyline
            key={i}
            points={ln.map((v, n) => `${sx(n).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')}
            fill="none"
            stroke="#059669"
            strokeWidth={1.2}
            strokeOpacity={0.4}
          />
        ))}

        {/* time-slice t0 */}
        <line x1={sx(t0)} y1={PAD.t} x2={sx(t0)} y2={PAD.t + IH} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={sx(t0)} y={PAD.t - 2} textAnchor="middle" fontSize="8" fill="#b45309">t₀={t0}</text>

        {/* sideways histogram of X(t0) in the right band */}
        {hist.map((c, b) => {
          const bandX = PAD.l + IW + 6
          const bandW = W - PAD.r + 62 - bandX
          const yTop = PAD.t + IH - ((b + 1) / HIST_BINS) * IH
          const h = IH / HIST_BINS - 1
          return <rect key={b} x={bandX} y={yTop} width={(c / maxCount) * bandW} height={h} fill="#7c3aed" fillOpacity={0.65} rx={1} />
        })}
        <text x={PAD.l + IW + 6} y={PAD.t - 2} fontSize="8" fill="#7c3aed">X(t₀)</text>
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-[11px] text-slate-400">
        <span className="text-emerald-600">— מימושים (fix ζ → פונקציה)</span>
        <span className="text-violet-600">▮ התפלגות X(t₀) (fix t → מ״מ)</span>
      </div>

      <div className="mt-2 space-y-1.5">
        <Slider label="זמן t₀" tex="t_0" value={t0} min={0} max={LEN - 1} step={1} onChange={setT0} display={String(t0)} />
        {(kind === 'bernoulli' || kind === 'counting') && (
          <Slider label="הסתברות" tex="p" value={p} min={0.1} max={0.9} step={0.05} onChange={setP} display={p.toFixed(2)} />
        )}
        {kind === 'ar' && <Slider label="מקדם" tex="a" value={a} min={-0.95} max={0.95} step={0.05} onChange={setA} display={a.toFixed(2)} />}
        {kind === 'cosine' && <Slider label="תדר" tex="f" value={f} min={0.02} max={0.3} step={0.01} onChange={setF} display={f.toFixed(2)} />}
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        כל קו ירוק הוא <b>מימוש</b> אחד (ζ קבוע). הפרוסה הכתומה ב-<span dir="ltr"><Tex>{'t_0'}</Tex></span> מגדירה
        <b> משתנה מקרי</b> <span dir="ltr"><Tex>{'X(t_0)'}</Tex></span> — ההיסטוגרמה הסגולה היא התפלגותו על פני האנסמבל.
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
