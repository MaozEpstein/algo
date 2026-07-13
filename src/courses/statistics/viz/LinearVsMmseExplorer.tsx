import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { cubicExample } from '../lib/linbayes'

/**
 * The cubic contrast (recitation 10 · שאלה 3): X∼N(0,σ²), Y=X³. The true MMSE
 * E[Y|X]=x³ is a curve; the best straight line (BLE/LMMSE) is ŷ=3σ²·x. They
 * differ — linear is optimal only among lines, and here the data is NOT jointly
 * Gaussian, so LMMSE ≠ MMSE. The σ slider steepens the BLE line while the cubic
 * stays fixed. MSE(BLE)=6σ⁶ annotated.
 */

const W = 380
const Hh = 260
const PAD = { l: 30, r: 12, t: 14, b: 28 }
const IW = W - PAD.l - PAD.r
const IH = Hh - PAD.t - PAD.b
const XLO = -1.9, XHI = 1.9

export default function LinearVsMmseExplorer() {
  const [sigma, setSigma] = useState(1)

  const { cubicPath, blePath, ex } = useMemo(() => {
    const ex = cubicExample(sigma)
    const ymax = Math.max(Math.abs(XHI ** 3), Math.abs(ex.bleYslope * XHI)) * 1.05
    const sx = (x: number) => PAD.l + ((x - XLO) / (XHI - XLO)) * IW
    const sy = (y: number) => PAD.t + IH / 2 - (y / ymax) * (IH / 2)
    const build = (f: (x: number) => number) => {
      let d = ''
      for (let i = 0; i <= 120; i++) {
        const x = XLO + (i / 120) * (XHI - XLO)
        d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)} `
      }
      return d
    }
    return { cubicPath: build((x) => x ** 3), blePath: build((x) => ex.bleYslope * x), ex }
  }, [sigma])

  const sx = (x: number) => PAD.l + ((x - XLO) / (XHI - XLO)) * IW
  const midY = PAD.t + IH / 2

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 460 }}>
        <line x1={PAD.l} y1={midY} x2={W - PAD.r} y2={midY} stroke="#e2e8f0" />
        <line x1={sx(0)} y1={PAD.t} x2={sx(0)} y2={PAD.t + IH} stroke="#e2e8f0" />
        <text x={W - PAD.r} y={midY - 4} textAnchor="end" fontSize="9" fill="#94a3b8">x</text>
        <text x={sx(0) + 4} y={PAD.t + 8} fontSize="9" fill="#94a3b8">y</text>

        {/* true MMSE curve y = x³ */}
        <path d={cubicPath} fill="none" stroke="#059669" strokeWidth={2.5} />
        {/* best straight line (BLE) ŷ = 3σ²x */}
        <path d={blePath} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeDasharray="6 3" />
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-[11px] text-slate-400">
        <span className="text-emerald-600">— MMSE אמיתי <span dir="ltr"><Tex>{'E[Y|X]=x^3'}</Tex></span></span>
        <span className="text-violet-600">‑ ‑ BLE (הקו הטוב ביותר) <span dir="ltr"><Tex>{'3\\sigma^2 x'}</Tex></span></span>
      </div>

      <div className="mt-2 rounded-lg bg-violet-50 px-3 py-1.5 text-center text-sm text-violet-900" dir="ltr">
        <Tex>{`\\hat Y_{BLE}=${ex.bleYslope.toFixed(2)}\\,x,\\quad \\mathrm{MSE}=6\\sigma^6=${ex.mseBLEy.toFixed(2)}`}</Tex>
      </div>

      <div className="mt-2">
        <Slider label="פיזור" tex="\\sigma" value={sigma} min={0.5} max={1.6} step={0.05} onChange={setSigma} display={sigma.toFixed(2)} />
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        הנתונים כאן <b>אינם</b> גאוסיים משותפים (<span dir="ltr"><Tex>{'Y=X^3'}</Tex></span>), ולכן ה-BLE הישר <b>נבדל</b> מה-MMSE
        המעוקב. לינאריות אופטימלית רק <b>בין קווים</b> — גאוסיות היא מה שהופך אותה לאופטימלית באופן מוחלט (משפט 9.2).
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
