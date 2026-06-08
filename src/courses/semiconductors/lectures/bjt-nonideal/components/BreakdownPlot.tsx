import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { avalancheMultiplication, bvCeo, collectorOutput } from '../../../lib/junction'

/**
 * Breakdown of the common-emitter output family: each curve runs flat (active) then
 * bends sharply UP as V_CE approaches BV_CEO, where avalanche multiplication M diverges.
 * BV_CEO = BV_CBO/β^{1/n} is well below the bare junction breakdown BV_CBO, because the
 * transistor's gain re-amplifies the avalanche carriers. A β slider moves BV_CEO. Pure
 * schematic.
 */
const W = 520
const H = 300
const mL = 50
const mR = 20
const mT = 18
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const BVCBO = 60 // V
const VMAX = BVCBO * 1.08
const IB_STEPS = [10, 20, 30, 40] // µA
const COLORS = ['#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7']
const N_EXP = 4

export default function BreakdownPlot() {
  const [beta, setBeta] = useState(100)
  const BVceo = bvCeo(BVCBO, beta, N_EXP)
  const iFlat = (beta * IB_STEPS[IB_STEPS.length - 1]) / 1000
  const yScale = iFlat * 2.2
  const xOf = (v: number) => mL + (v / VMAX) * PW
  const yOf = (iMa: number) => mT + (1 - Math.min(iMa, yScale) / yScale) * PH
  const N = 120

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>הגבר · <Tex>{'\\beta'}</Tex></>} value={beta} min={40} max={250} step={5} onChange={setBeta} display={`${beta}`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* axes */}
            <line x1={mL} y1={yBot} x2={mL + PW} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={yBot + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>CE</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 6} y={mT + 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>C</tspan></text>

            {/* BV_CEO and BV_CBO markers */}
            <line x1={xOf(BVceo)} y1={mT} x2={xOf(BVceo)} y2={yBot} stroke="#f43f5e" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={xOf(BVceo)} y={mT + 11} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 10, fontWeight: 800 }}>BV<tspan dy={2} style={{ fontSize: 7 }}>CEO</tspan></text>
            <line x1={xOf(BVCBO)} y1={mT} x2={xOf(BVCBO)} y2={yBot} stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={xOf(BVCBO) - 2} y={mT + 11} textAnchor="end" className="fill-violet-600" style={{ fontSize: 10, fontWeight: 800 }}>BV<tspan dy={2} style={{ fontSize: 7 }}>CBO</tspan></text>

            {/* output curves bending up at BV_CEO */}
            {IB_STEPS.map((ib, i) => {
              const pts: string[] = []
              for (let k = 0; k <= N; k++) {
                const v = (VMAX * k) / N
                const ic = collectorOutput(v, ib / 1000, beta) * avalancheMultiplication(v, BVceo, N_EXP)
                pts.push(`${xOf(v).toFixed(1)},${yOf(ic).toFixed(1)}`)
                if (ic >= yScale) break
              }
              return <path key={ib} d={'M ' + pts.join(' L ')} fill="none" stroke={COLORS[i]} strokeWidth={2.5} strokeLinejoin="round" />
            })}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Readout label="$BV_{CBO}$ (בסיס משותף)" value={`${BVCBO} V`} accent="border-violet-100 bg-violet-50" />
        <Readout label="$BV_{CEO}=BV_{CBO}/\beta^{1/n}$" value={`${BVceo.toFixed(0)} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="יחס" value={`÷${(BVCBO / BVceo).toFixed(1)}`} accent="border-sky-100 bg-sky-50" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <p className="rounded-lg bg-rose-50/60 px-3 py-2 text-sm leading-relaxed text-slate-700">
          <b>מפולת (Avalanche):</b> ב-<Tex>{'V_{CE}'}</Tex> גבוה השדה בצומת C-B מאיץ נושאים שיוצרים זוגות נוספים — מקדם המפולת <Tex>{'M\\to\\infty'}</Tex>. ההגבר מכפיל אותם, ולכן <Tex>{'BV_{CEO}<BV_{CBO}'}</Tex>.
        </p>
        <p className="rounded-lg bg-amber-50/60 px-3 py-2 text-sm leading-relaxed text-slate-700">
          <b>Punch-through:</b> מנגנון נוסף — אם <Tex>{'V_{CB}'}</Tex> גבוה כל-כך שאזור-המחסור חוצה את כל הבסיס ונוגע בפולט, נוצר מעבר ישיר. <Tex>{'\\beta'}</Tex> גבוה ⇐ <Tex>{'BV_{CEO}'}</Tex> נמוך יותר.
        </p>
      </div>
    </div>
  )
}
