import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { collectorOutputEarly, earlyResistance } from '../../../lib/junction'

/**
 * Output characteristics WITH the Early effect: the active region is no longer flat but
 * slopes up, and the dashed back-extrapolations of all curves meet the V_CE axis at a
 * single point −V_A (drawn on a broken axis, since V_A ≫ V_CE). The output resistance
 * r_o = V_A/I_C falls out of the slope. Sliders for V_A and β. Pure schematic.
 */
const W = 520
const H = 300
const mT = 18
const mB = 42
const mR = 58
const X_VA = 30 // vertex screen-x = (−V_A, 0)
const X0 = 96 // screen-x of V_CE = 0
const XR = W - mR
const PH = H - mT - mB
const yZero = mT + PH
const VCEMAX = 6
const IB_STEPS = [10, 20, 30, 40] // µA
const COLORS = ['#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7']

export default function EarlyOutput() {
  const [VA, setVA] = useState(60)
  const [beta, setBeta] = useState(100)

  const iMax = (beta * IB_STEPS[IB_STEPS.length - 1]) / 1000 * (1 + VCEMAX / VA)
  const yScale = iMax * 1.14
  const xOf = (v: number) => X0 + (v / VCEMAX) * (XR - X0)
  const yOf = (iMa: number) => mT + (1 - iMa / yScale) * PH
  const N = 70
  const roMid = earlyResistance(VA, (beta * 30) / 1000) // r_o at I_C = β·30µA (kΩ since I in mA)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Slider label={<>מתח Early · <Tex>{'V_A'}</Tex></>} value={VA} min={15} max={120} step={5} onChange={setVA} display={`${VA} V`} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Slider label={<>הגבר · <Tex>{'\\beta'}</Tex></>} value={beta} min={50} max={200} step={5} onChange={setBeta} display={`${beta}`} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* axes */}
            <line x1={X0} y1={yZero} x2={XR} y2={yZero} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={X0} y1={mT} x2={X0} y2={yZero} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={XR} y={yZero + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>CE</tspan><tspan dy={-2}> →</tspan></text>
            <text x={X0 - 6} y={mT + 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>C</tspan></text>
            {/* broken-axis to the −V_A vertex */}
            <line x1={X_VA} y1={yZero} x2={X0 - 20} y2={yZero} stroke="#cbd5e1" strokeWidth={1.25} strokeDasharray="2 3" />
            <line x1={X0 - 24} y1={yZero - 5} x2={X0 - 18} y2={yZero + 5} stroke="#94a3b8" strokeWidth={1.25} />
            <line x1={X0 - 30} y1={yZero - 5} x2={X0 - 24} y2={yZero + 5} stroke="#94a3b8" strokeWidth={1.25} />
            <circle cx={X_VA} cy={yZero} r={3.5} fill="#f43f5e" />
            <text x={X_VA} y={yZero + 16} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 10.5, fontWeight: 800 }}>−V<tspan dy={2} style={{ fontSize: 7.5 }}>A</tspan></text>

            {/* curves + their back-extrapolations to the vertex */}
            {IB_STEPS.map((ib, i) => {
              const pts: string[] = []
              for (let k = 0; k <= N; k++) {
                const v = (VCEMAX * k) / N
                pts.push(`${xOf(v).toFixed(1)},${yOf(collectorOutputEarly(v, ib / 1000, beta, VA)).toFixed(1)}`)
              }
              const endY = yOf(collectorOutputEarly(VCEMAX, ib / 1000, beta, VA))
              return (
                <g key={ib}>
                  <line x1={X_VA} y1={yZero} x2={XR} y2={endY} stroke={COLORS[i]} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                  <path d={'M ' + pts.join(' L ')} fill="none" stroke={COLORS[i]} strokeWidth={2.5} strokeLinejoin="round" />
                  <text x={XR + 4} y={endY + 4} textAnchor="start" style={{ fontSize: 9, fontWeight: 700, fill: COLORS[i] }}>{ib}µA</text>
                </g>
              )
            })}
            <text x={(X0 + XR) / 2} y={mT + 12} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 10, fontWeight: 700 }}>אזור פעיל — שיפוע מעלה (לא שטוח)</text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Readout label="מתח Early $V_A$" value={`${VA} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="התנגדות מוצא $r_o=V_A/I_C$" value={`${roMid < 1000 ? roMid.toFixed(0) : (roMid / 1000).toFixed(1) + 'M'} kΩ`} accent="border-violet-100 bg-violet-50" />
        <Readout label="$I_C$ ייחוס" value={`${((beta * 30) / 1000).toFixed(1)} mA`} accent="border-sky-100 bg-sky-50" />
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        <Tex>{'V_{CE}\\uparrow'}</Tex> ⇐ אזור-המחסור ב-C-B מתרחב ⇐ הבסיס האפקטיבי <Tex>{'W_B'}</Tex> מצטמצם ⇐ <Tex>{'I_C'}</Tex> עולה מעט.
        ככל ש-<Tex>{'V_A'}</Tex> גדול יותר, השיפוע מתון יותר וההתנגדות <Tex>{'r_o'}</Tex> גבוהה יותר (קרוב למקור-זרם אידיאלי).
      </p>
    </div>
  )
}
