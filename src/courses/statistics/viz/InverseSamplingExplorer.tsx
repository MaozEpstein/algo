import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { expInvCdf, uniformInvCdf } from '../lib/transforms'

/**
 * Inverse-transform sampling (Theorem 3.5) made visible. Uniform draws U∈[0,1] on
 * the vertical axis are mapped through F⁻¹ (read across to the CDF, then down) to
 * samples X on the horizontal axis. Evenly-spread U turns into samples that follow
 * the target density — bunching where the CDF is steep (pdf high). Drag U to trace
 * one draw; the bottom histogram is many deterministic draws.
 */

type Target = {
  id: string
  labelHe: string
  xmin: number
  xmax: number
  cdf: (x: number) => number
  invCdf: (u: number) => number
  pdf: (x: number) => number
  fTex: string
}

const TARGETS: Target[] = [
  {
    id: 'exp',
    labelHe: 'מעריכי',
    xmin: 0, xmax: 6,
    cdf: (x) => (x <= 0 ? 0 : 1 - Math.exp(-x)),
    invCdf: (u) => expInvCdf(u, 1),
    pdf: (x) => (x < 0 ? 0 : Math.exp(-x)),
    fTex: 'f(x)=e^{-x}',
  },
  {
    id: 'uniform',
    labelHe: 'אחיד',
    xmin: 0, xmax: 4,
    cdf: (x) => Math.max(0, Math.min(1, x / 4)),
    invCdf: (u) => uniformInvCdf(u, 0, 4),
    pdf: (x) => (x >= 0 && x <= 4 ? 0.25 : 0),
    fTex: 'f(x)=\\tfrac14',
  },
  {
    id: 'recit',
    labelHe: 'מהתרגול',
    xmin: 1, xmax: 7,
    cdf: (x) => (x < 1 ? 0 : 1 - Math.exp(1 - x)),
    invCdf: (u) => 1 - Math.log(1 - u),
    pdf: (x) => (x < 1 ? 0 : Math.exp(1 - x)),
    fTex: 'f(y)=e^{\\,1-y}',
  },
]

// deterministic uniform draws (seeded LCG)
const U_SAMPLES = ((): number[] => {
  let s = 424242
  const out: number[] = []
  for (let i = 0; i < 240; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    out.push(Math.min(0.999, Math.max(0.001, s / 0x7fffffff)))
  }
  return out
})()

const W = 320
const Hh = 300
const PAD = { l: 30, r: 12, t: 12, b: 58 }
const IW = W - PAD.l - PAD.r
const PH = Hh - PAD.t - PAD.b // CDF plot height

export default function InverseSamplingExplorer() {
  const [tid, setTid] = useState('exp')
  const [u, setU] = useState(0.5)
  const t = TARGETS.find((x) => x.id === tid)!
  const { xmin, xmax } = t

  const sx = (x: number) => PAD.l + ((x - xmin) / (xmax - xmin)) * IW
  const syU = (uu: number) => PAD.t + PH - uu * PH // U axis: 0 bottom, 1 top

  const cdfPath = useMemo(() => {
    let d = ''
    for (let i = 0; i <= 160; i++) {
      const x = xmin + (i / 160) * (xmax - xmin)
      d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${syU(t.cdf(x)).toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t])

  // histogram of F⁻¹(U) samples
  const BINS = 26
  const hist = useMemo(() => {
    const h = new Array(BINS).fill(0)
    for (const uu of U_SAMPLES) {
      const x = t.invCdf(uu)
      const bin = Math.floor(((x - xmin) / (xmax - xmin)) * BINS)
      if (bin >= 0 && bin < BINS) h[bin]++
    }
    const hmax = Math.max(...h) || 1
    return { h, hmax }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t])

  const xSel = t.invCdf(u)
  const histTop = Hh - PAD.b + 8
  const histH = Hh - histTop - 4

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {TARGETS.map((x) => (
          <button key={x.id} onClick={() => setTid(x.id)} className={`rounded-lg px-2.5 py-1 text-sm font-semibold transition ${tid === x.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <span className="flex items-center gap-1">{x.labelHe}<span dir="ltr" className={tid === x.id ? '' : 'text-slate-400'}><Tex>{x.fTex}</Tex></span></span>
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 430 }}>
        {/* U axis + CDF plot frame */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH} stroke="#cbd5e1" />
        <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH} stroke="#cbd5e1" />
        <text x={PAD.l - 5} y={syU(1) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">1</text>
        <text x={PAD.l - 5} y={syU(0) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">U</text>

        {/* the CDF F(x) */}
        <path d={cdfPath} fill="none" stroke="#0f172a" strokeWidth={2} />

        {/* the mapping U → x: across to the curve, then down to the axis */}
        <line x1={PAD.l} y1={syU(u)} x2={sx(xSel)} y2={syU(u)} stroke="#f59e0b" strokeWidth={1.4} strokeDasharray="4 3" />
        <line x1={sx(xSel)} y1={syU(u)} x2={sx(xSel)} y2={histTop} stroke="#f59e0b" strokeWidth={1.4} strokeDasharray="4 3" />
        <circle cx={PAD.l} cy={syU(u)} r={3.5} fill="#f59e0b" />
        <circle cx={sx(xSel)} cy={syU(u)} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />

        {/* histogram of samples along x */}
        {hist.h.map((c, i) => {
          const bw = IW / BINS
          const bx = PAD.l + i * bw
          const bh = (c / hist.hmax) * histH
          return <rect key={i} x={bx + 0.5} y={histTop + histH - bh} width={bw - 1} height={bh} fill="#34d399" fillOpacity={0.6} />
        })}
        <text x={W - PAD.r} y={Hh - 3} textAnchor="end" fontSize="9" fill="#059669">דגימות של X</text>
      </svg>

      <label className="mt-1 flex items-center gap-3">
        <span className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-slate-600">
          משיכה <span dir="ltr" className="text-slate-400"><Tex>{'U'}</Tex></span>
        </span>
        <input type="range" min={0.01} max={0.99} step={0.01} value={u} onChange={(e) => setU(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-amber-200 accent-amber-600" />
        <span className="w-20 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{u.toFixed(2)}→{xSel.toFixed(2)}</span>
      </label>

      <p className="mt-2 text-center text-xs text-slate-400">
        <span dir="ltr"><Tex>{'X=F^{-1}(U)'}</Tex></span> — משיכות אחידות ב-U נדחסות היכן שה-CDF תלולה (הצפיפות גבוהה).
      </p>
    </div>
  )
}
