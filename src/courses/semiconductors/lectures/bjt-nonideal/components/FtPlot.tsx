import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { currentGainAC } from '../../../lib/junction'

/**
 * The AC current gain |β(f)| on a log-log plot: flat at β₀ up to f_β, then falling
 * −20 dB/decade, crossing unity at the cutoff frequency f_T = β₀·f_β. A β₀ slider moves
 * f_β (f_T fixed). Pure schematic.
 */
const W = 500
const H = 250
const mL = 46
const mR = 18
const mT = 18
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const FT = 3e8 // 300 MHz

const fmtHz = (f: number) => (f >= 1e9 ? `${(f / 1e9).toFixed(1)} GHz` : f >= 1e6 ? `${(f / 1e6).toFixed(0)} MHz` : f >= 1e3 ? `${(f / 1e3).toFixed(0)} kHz` : `${f.toFixed(0)} Hz`)

export default function FtPlot() {
  const [beta0, setBeta0] = useState(120)
  const fBeta = FT / beta0
  const xLo = Math.log10(fBeta) - 1.8
  const xHi = Math.log10(FT) + 0.4
  const yHi = Math.log10(beta0) + 0.3
  const yLoEdge = -0.3 // log β slightly below 1
  const xOf = (lf: number) => mL + ((lf - xLo) / (xHi - xLo)) * PW
  const yOf = (lb: number) => mT + (1 - (lb - yLoEdge) / (yHi - yLoEdge)) * PH
  const N = 100
  const pts: string[] = []
  for (let k = 0; k <= N; k++) {
    const lf = xLo + ((xHi - xLo) * k) / N
    pts.push(`${xOf(lf).toFixed(1)},${yOf(Math.log10(currentGainAC(beta0, 10 ** lf, FT))).toFixed(1)}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>הגבר DC · <Tex>{'\\beta_0'}</Tex></>} value={beta0} min={50} max={300} step={10} onChange={setBeta0} display={`${beta0}`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* axes */}
            <line x1={mL} y1={yBot} x2={mL + PW} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={yBot + 15} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>log f →</text>
            <text x={mL - 6} y={mT + 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>|β|</text>
            {/* β=1 line */}
            <line x1={mL} y1={yOf(0)} x2={mL + PW} y2={yOf(0)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={mL + 3} y={yOf(0) - 4} className="fill-slate-400" style={{ fontSize: 9, fontWeight: 700 }}>β=1</text>
            {/* f_β and f_T markers */}
            <line x1={xOf(Math.log10(fBeta))} y1={mT} x2={xOf(Math.log10(fBeta))} y2={yBot} stroke="#f59e0b" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={xOf(Math.log10(fBeta))} y={yBot + 15} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 9.5, fontWeight: 800 }}>f<tspan dy={2} style={{ fontSize: 7 }}>β</tspan></text>
            <line x1={xOf(Math.log10(FT))} y1={mT} x2={xOf(Math.log10(FT))} y2={yBot} stroke="#f43f5e" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={xOf(Math.log10(FT))} y={yBot + 15} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 9.5, fontWeight: 800 }}>f<tspan dy={2} style={{ fontSize: 7 }}>T</tspan></text>
            {/* curve */}
            <path d={'M ' + pts.join(' L ')} fill="none" stroke="#0ea5e9" strokeWidth={2.75} strokeLinejoin="round" />
            <text x={xOf((xLo + Math.log10(fBeta)) / 2)} y={yOf(Math.log10(beta0)) - 6} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 9.5, fontWeight: 700 }}>β₀ (שטוח)</text>
            <text x={xOf((Math.log10(fBeta) + Math.log10(FT)) / 2) + 6} y={yOf((Math.log10(beta0)) / 2) - 4} textAnchor="start" className="fill-slate-500" style={{ fontSize: 9 }}>−20dB/דקדה</text>
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Readout label="הגבר DC $\beta_0$" value={`${beta0}`} accent="border-sky-100 bg-sky-50" />
        <Readout label="תדר נפילה $f_\beta=f_T/\beta_0$" value={fmtHz(fBeta)} accent="border-amber-100 bg-amber-50" />
        <Readout label="תדר-חיתוך $f_T$" value={fmtHz(FT)} accent="border-rose-100 bg-rose-50" />
      </div>
    </div>
  )
}
