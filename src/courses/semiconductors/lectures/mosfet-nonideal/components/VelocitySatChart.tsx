import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from '../../mosfet/components/Readout'

/**
 * Velocity saturation: at high lateral field the drift velocity clamps at v_sat≈10⁷ cm/s, so the
 * saturation current stops following the square law and becomes ~LINEAR in the overdrive
 * (V_GS−V_T). Left: v(E) saturating curve. Right: the transfer characteristic — ideal square law
 * (dashed) vs. the real velocity-saturated device (solid, linear at high overdrive).
 */
const OVMAX = 4
const CROSS = 2 // overdrive where the two models coincide (illustrative)
const sq = (ov: number) => 0.5 * ov * ov // ideal square law (arb. units)
const lin = (ov: number) => (Math.max(0, ov) * CROSS) / 2 // velocity-saturated, linear; = sq at ov=CROSS

// v(E) chart geometry
const CW = 240
const CH = 180
const cmL = 40
const cmB = 36
const EMAX = 5
const VS = 1 // normalized v_sat
const vOfE = (e: number) => VS * (1 - Math.exp(-e / 1.1)) // smooth saturating curve

// transfer chart geometry
const TW = 260
const TH = 180
const tmL = 40
const tmB = 36
const yScaleT = sq(OVMAX) * 1.1

export default function VelocitySatChart() {
  const [ov, setOv] = useState(3)
  const iSq = sq(ov)
  const iLin = lin(ov)

  const cX = (e: number) => cmL + (e / EMAX) * (CW - cmL - 12)
  const cY = (v: number) => (CH - cmB) - v * (CH - cmB - 14)
  const tX = (o: number) => tmL + (o / OVMAX) * (TW - tmL - 12)
  const tY = (i: number) => (TH - tmB) - (i / yScaleT) * (TH - tmB - 14)

  const vePath = (() => {
    const pts: string[] = []
    for (let i = 0; i <= 60; i++) {
      const e = (EMAX * i) / 60
      pts.push(`${cX(e).toFixed(1)},${cY(vOfE(e)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  })()
  const line = (fn: (o: number) => number) => {
    const pts: string[] = []
    for (let i = 0; i <= 60; i++) {
      const o = (OVMAX * i) / 60
      pts.push(`${tX(o).toFixed(1)},${tY(fn(o)).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>עודף-מתח · <Tex>{'V_{GS}-V_T'}</Tex></>} value={ov} min={0} max={OVMAX} step={0.05} onChange={setOv} display={`${ov.toFixed(2)} V`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* v(E) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">מהירות-סחיפה מול שדה <Tex>{'v(\\xi)'}</Tex></p>
          <div className="ltr w-full" dir="ltr">
            <svg viewBox={`0 0 ${CW} ${CH}`} className="mx-auto w-full" style={{ maxWidth: CW }}>
              <line x1={cmL} y1={CH - cmB} x2={CW - 12} y2={CH - cmB} stroke="#cbd5e1" strokeWidth={1.25} />
              <line x1={cmL} y1={CH - cmB} x2={cmL} y2={14} stroke="#cbd5e1" strokeWidth={1.25} />
              <line x1={cmL} y1={cY(VS)} x2={CW - 12} y2={cY(VS)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
              <text x={CW - 14} y={cY(VS) - 4} textAnchor="end" className="fill-amber-600" style={{ fontSize: 8.5, fontWeight: 700 }}>v_sat≈10⁷ cm/s</text>
              <path d={vePath} fill="none" stroke="#0284c7" strokeWidth={2.5} />
              <text x={CW - 12} y={CH - cmB + 14} textAnchor="end" className="fill-slate-500" style={{ fontSize: 9, fontWeight: 700 }}>ξ →</text>
              <text x={cmL - 4} y={16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 9, fontWeight: 700 }}>v</text>
            </svg>
          </div>
        </div>
        {/* transfer comparison */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">אופיין-העברה ברוויה</p>
          <div className="ltr w-full" dir="ltr">
            <svg viewBox={`0 0 ${TW} ${TH}`} className="mx-auto w-full" style={{ maxWidth: TW }}>
              <line x1={tmL} y1={TH - tmB} x2={TW - 12} y2={TH - tmB} stroke="#cbd5e1" strokeWidth={1.25} />
              <line x1={tmL} y1={TH - tmB} x2={tmL} y2={14} stroke="#cbd5e1" strokeWidth={1.25} />
              <path d={line(sq)} fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeDasharray="5 3" />
              <path d={line(lin)} fill="none" stroke="#e11d48" strokeWidth={2.5} />
              <circle cx={tX(ov)} cy={tY(iLin)} r={4} fill="#e11d48" stroke="#fff" strokeWidth={1.25} />
              <text x={TW - 14} y={tY(sq(OVMAX)) + 2} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8, fontWeight: 700 }}>אידיאלי ∝(V_ov)²</text>
              <text x={TW - 14} y={tY(lin(OVMAX)) - 4} textAnchor="end" className="fill-rose-500" style={{ fontSize: 8, fontWeight: 700 }}>רוויית-מהירות ∝V_ov</text>
              <text x={TW - 12} y={TH - tmB + 14} textAnchor="end" className="fill-slate-500" style={{ fontSize: 9, fontWeight: 700 }}>V_GS−V_T →</text>
              <text x={tmL - 4} y={16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 9, fontWeight: 700 }}>I_DS</text>
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Readout label="זרם אידיאלי ($\\propto V_{ov}^2$)" value={iSq.toFixed(2)} accent="border-slate-200 bg-slate-50" />
        <Readout label="זרם עם רוויית-מהירות ($\\propto V_{ov}$)" value={iLin.toFixed(2)} accent="border-rose-100 bg-rose-50" />
      </div>
    </div>
  )
}
