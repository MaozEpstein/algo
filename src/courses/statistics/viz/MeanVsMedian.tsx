import { useState } from 'react'
import Tex from '@/core/components/Tex'
import { median } from '../lib/leastsquares'

/**
 * L2 vs L1 on the location model. Points on a number line: the mean (L2 / least
 * squares) is dragged toward a single outlier, while the median (L1 / least
 * absolute deviations) barely moves — the robustness result of §7.6.
 */

const BASE = [3, 4, 4, 5, 6]
const OUT = 20

const W = 360
const Hh = 90
const PAD = 16
const X0 = 0, X1 = 22

export default function MeanVsMedian() {
  const [outlier, setOutlier] = useState(true)
  const pts = outlier ? [...BASE, OUT] : BASE
  const mean = pts.reduce((s, x) => s + x, 0) / pts.length
  const med = median(pts)
  const px = (x: number) => PAD + ((x - X0) / (X1 - X0)) * (W - 2 * PAD)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <button onClick={() => setOutlier((o) => !o)} className={`mb-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${outlier ? 'bg-rose-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
        {outlier ? 'הסר חריג' : 'הוסף חריג'}
      </button>
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 470 }}>
        <line x1={PAD} y1={Hh - 30} x2={W - PAD} y2={Hh - 30} stroke="#cbd5e1" />
        {pts.map((x, i) => (
          <circle key={i} cx={px(x)} cy={Hh - 30} r={4.5} fill={outlier && x === OUT ? '#e11d48' : '#0f172a'} fillOpacity={0.75} />
        ))}
        {/* mean (L2) */}
        <line x1={px(mean)} y1={16} x2={px(mean)} y2={Hh - 30} stroke="#2563eb" strokeWidth={2} strokeDasharray="4 3" />
        <text x={px(mean)} y={12} textAnchor="middle" fontSize="9" fill="#2563eb">ממוצע (L2)</text>
        {/* median (L1) */}
        <line x1={px(med)} y1={Hh - 30} x2={px(med)} y2={Hh - 6} stroke="#059669" strokeWidth={2} />
        <text x={px(med)} y={Hh - 1} textAnchor="middle" fontSize="9" fill="#059669">חציון (L1)</text>
      </svg>
      <div className="mt-1 grid grid-cols-2 gap-2 text-center text-sm">
        <div className="rounded-lg bg-blue-50 px-2 py-1 text-blue-800" dir="ltr"><Tex>{`\\text{mean}=${mean.toFixed(2)}`}</Tex></div>
        <div className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-800" dir="ltr"><Tex>{`\\text{median}=${med.toFixed(2)}`}</Tex></div>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">חריג אחד "מושך" את הממוצע (L2), אבל החציון (L1) כמעט לא זז — חסינות.</p>
    </div>
  )
}
