import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { commonBaseAlpha, commonEmitterBeta } from '../../../lib/junction'

/**
 * Interactive gain explorer: two sliders (γ, b) set α=γ·b and β=α/(1−α). A β-vs-α
 * curve shows how β "explodes" as α→1 — the whole reason a tiny imperfection in α
 * matters. Pure schematic plot.
 */
const W = 420
const H = 210
const mL = 44
const mR = 16
const mT = 16
const mB = 38
const PW = W - mL - mR
const PH = H - mT - mB
const A0 = 0.8
const A1 = 0.999
const BMAX = 250

export default function GainExplorer() {
  const [gamma, setGamma] = useState(0.995)
  const [b, setB] = useState(0.997)
  const alpha = commonBaseAlpha(gamma, b)
  const beta = commonEmitterBeta(alpha)

  const xOf = (a: number) => mL + ((a - A0) / (A1 - A0)) * PW
  const yOf = (bt: number) => mT + (1 - Math.min(bt, BMAX) / BMAX) * PH
  const N = 80
  const pts: string[] = []
  for (let i = 0; i <= N; i++) {
    const a = A0 + ((A1 - A0) * i) / N
    pts.push(`${xOf(a).toFixed(1)},${yOf(commonEmitterBeta(a)).toFixed(1)}`)
  }
  const curve = 'M ' + pts.join(' L ')
  const px = xOf(Math.min(alpha, A1))
  const py = yOf(beta)

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Slider label={<>נצילות הזרקה · <Tex>{'\\gamma'}</Tex></>} value={gamma} min={0.9} max={0.999} step={0.001} onChange={setGamma} display={gamma.toFixed(3)} />
          <Slider label={<>מקדם מעבר · <Tex>{'b'}</Tex></>} value={b} min={0.9} max={0.9999} step={0.0001} onChange={setB} display={b.toFixed(4)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Readout label="$\alpha=\gamma b$" value={alpha.toFixed(4)} accent="border-sky-100 bg-sky-50" />
          <Readout label="$1-\alpha$" value={(1 - alpha).toFixed(4)} accent="border-rose-100 bg-rose-50" />
          <Readout label="$\beta=\alpha/(1-\alpha)$" value={beta < BMAX ? beta.toFixed(0) : `${BMAX}+`} accent="border-emerald-100 bg-emerald-50" />
        </div>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          <b>בסיס משותף:</b> ההגבר הוא <Tex>{'\\alpha=I_C/I_E<1'}</Tex>. <b>פולט משותף:</b> ההגבר הוא{' '}
          <Tex>{'\\beta=I_C/I_B\\gg1'}</Tex> — ולכן שינוי זעיר ב-<Tex>{'\\alpha'}</Tex> (קרוב ל-1) משנה את <Tex>{'\\beta'}</Tex> דרמטית.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-1 text-center text-xs font-semibold text-slate-400"><Tex>{'\\beta(\\alpha)=\\alpha/(1-\\alpha)'}</Tex> — ההתפוצצות ליד <Tex>{'\\alpha\\to1'}</Tex></p>
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 14} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>α →</text>
            <text x={mL - 6} y={mT + 8} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>β</text>
            {[0.85, 0.9, 0.95, 0.99].map((a) => (
              <text key={a} x={xOf(a)} y={mT + PH + 14} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9 }}>{a}</text>
            ))}
            <path d={curve} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinejoin="round" />
            {/* operating point */}
            <line x1={px} y1={mT} x2={px} y2={mT + PH} stroke="#0ea5e9" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={px} cy={py} r={4.5} fill="#0ea5e9" />
            <text x={px - 6} y={Math.max(py, mT + 12)} textAnchor="end" className="fill-sky-700" style={{ fontSize: 10.5, fontWeight: 800 }}>β≈{beta < BMAX ? beta.toFixed(0) : `${BMAX}+`}</text>
          </svg>
        </div>
      </div>
    </div>
  )
}
