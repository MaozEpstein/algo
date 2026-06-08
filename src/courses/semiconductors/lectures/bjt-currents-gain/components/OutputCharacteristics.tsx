import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import { collectorOutput } from '../../../lib/junction'

/**
 * Common-emitter output characteristics I_C(V_CE): one curve per base-current step.
 * Each rises through the SATURATION knee (V_CE ≲ V_CE,sat) to a flat ACTIVE value
 * I_C ≈ β·I_B; the spacing between curves is set by β. A β slider rescales the family.
 * Pure schematic (reuses collectorOutput).
 */
const W = 500
const H = 300
const mL = 52
const mR = 56
const mT = 18
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const VCEMAX = 5 // V
const VSAT = 0.25 // V — saturation/active divider (visual)
const IB_STEPS = [10, 20, 30, 40, 50] // µA
const COLORS = ['#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7']

export default function OutputCharacteristics() {
  const [beta, setBeta] = useState(100)
  const iMax = (beta * IB_STEPS[IB_STEPS.length - 1]) / 1000 // mA, top curve active value
  const yScale = iMax * 1.12

  const xOf = (v: number) => mL + (v / VCEMAX) * PW
  const yOf = (iMa: number) => mT + (1 - iMa / yScale) * PH
  const N = 70
  const curveFor = (ibUA: number) => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const v = (VCEMAX * i) / N
      const ic = collectorOutput(v, ibUA / 1000, beta) // mA (I_B in mA)
      pts.push(`${xOf(v).toFixed(1)},${yOf(ic).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>הגבר · <Tex>{'\\beta'}</Tex></>} value={beta} min={20} max={250} step={5} onChange={setBeta} display={`${beta}`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* saturation region shading */}
            <rect x={mL} y={mT} width={xOf(VSAT) - mL} height={PH} fill="#f59e0b" fillOpacity={0.08} />
            <text x={(mL + xOf(VSAT)) / 2} y={mT + PH - 6} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 9, fontWeight: 700 }}>רוויה</text>
            <text x={(xOf(VSAT) + mL + PW) / 2} y={mT + 12} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 10, fontWeight: 700 }}>אזור פעיל</text>
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>CE</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>C</tspan></text>
            <text x={mL - 8} y={mT + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8.5 }}>(mA)</text>
            {/* curves, one per I_B */}
            {IB_STEPS.map((ib, i) => {
              const yActive = yOf((beta * ib) / 1000)
              return (
                <g key={ib}>
                  <path d={curveFor(ib)} fill="none" stroke={COLORS[i]} strokeWidth={2.5} strokeLinejoin="round" />
                  <text x={mL + PW + 4} y={yActive + 4} textAnchor="start" style={{ fontSize: 9, fontWeight: 700, fill: COLORS[i] }}>{ib}µA</text>
                </g>
              )
            })}
            <text x={mL + PW + 4} y={mT + PH + 16} textAnchor="start" className="fill-slate-400" style={{ fontSize: 9, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 7 }}>B</tspan></text>
          </svg>
        </div>
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        כל עקומה היא <Tex>{'I_B'}</Tex> קבוע. ב<b>אזור הפעיל</b> הזרם שטוח ב-<Tex>{'I_C\\approx\\beta I_B'}</Tex> (מגבר),
        וב<b>רוויה</b> (<Tex>{'V_{CE}\\lesssim0.2\\,V'}</Tex>) הוא צונח לאפס (מפסק סגור). ה<b>מרווח</b> בין העקומות
        פרופורציוני ל-<Tex>{'\\beta'}</Tex> — גררו אותו.
      </p>
    </div>
  )
}
