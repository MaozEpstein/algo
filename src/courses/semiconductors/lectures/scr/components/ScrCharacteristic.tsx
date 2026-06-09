import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import { scrCurve } from '../../../lib/junction'

/**
 * The SCR forward I-V characteristic, drawn as a bespoke PARAMETRIC path so the snapback
 * can fold back on itself (negative differential resistance — multivalued in V, which a
 * plain x-monotonic chart can't show). Forward: blocking → breakover V_BF → NDR → on-state.
 * Reverse: blocking. A gate-current slider lowers V_BF; at high gate the NDR vanishes and
 * the device conducts like a diode.
 */
const W = 540
const H = 340
const mL = 54
const mR = 20
const mT = 20
const mB = 44
const PW = W - mL - mR
const PH = H - mT - mB
const VMIN = -5
const VMAX = 9
const IMAX = 5.6

const xOf = (v: number) => mL + ((v - VMIN) / (VMAX - VMIN)) * PW
const yOf = (i: number) => mT + (1 - i / IMAX) * PH

export default function ScrCharacteristic() {
  const [gate, setGate] = useState(0)
  const pts = scrCurve(gate, { VBO0: 8, Ih: 0.4, Von: 1.1, Imax: 5 })
  const VBF = Math.max(...pts.map((p) => p.V))
  const Ih = 0.4
  const fwd = 'M ' + pts.map((p) => `${xOf(p.V).toFixed(1)},${yOf(p.I).toFixed(1)}`).join(' L ')
  const x0 = xOf(0)
  const yAxis0 = yOf(0)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>זרם-שער · <Tex>{'I_G'}</Tex></>} value={gate} min={0} max={1} step={0.01} onChange={setGate} display={gate === 0 ? 'ללא שער' : `${(gate * 100).toFixed(0)}%`} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* axes through origin */}
            <line x1={mL} y1={yAxis0} x2={mL + PW} y2={yAxis0} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={x0} y1={mT} x2={x0} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <text x={mL + PW} y={yAxis0 - 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>AK</tspan><tspan dy={-2}> →</tspan></text>
            <text x={x0 + 6} y={mT + 10} textAnchor="start" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>A</tspan></text>

            {/* reverse blocking (flat near 0) + reverse breakdown hint */}
            <line x1={x0} y1={yAxis0} x2={xOf(VMIN + 0.6)} y2={yAxis0 - 2} stroke="#94a3b8" strokeWidth={2} />
            <line x1={xOf(VMIN + 0.6)} y1={yAxis0 - 2} x2={xOf(VMIN)} y2={yAxis0 + 40} stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 3" />
            <text x={xOf(VMIN + 0.4)} y={yAxis0 + 22} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9.5, fontWeight: 700 }}>חסימה הפוכה</text>

            {/* holding-current guide */}
            <line x1={x0} y1={yOf(Ih)} x2={mL + PW} y2={yOf(Ih)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={mL + PW - 4} y={yOf(Ih) - 4} textAnchor="end" className="fill-amber-600" style={{ fontSize: 9, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 7 }}>H</tspan> (החזקה)</text>

            {/* breakover marker */}
            <line x1={xOf(VBF)} y1={mT + PH} x2={xOf(VBF)} y2={yOf(Ih) + 6} stroke="#e11d48" strokeWidth={1} strokeDasharray="3 3" />
            <text x={xOf(VBF)} y={mT + PH + 14} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9.5, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 7 }}>BF</tspan></text>

            {/* the forward characteristic (folds back through NDR) */}
            <path d={fwd} fill="none" stroke="#2563eb" strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />

            {/* annotations */}
            <text x={xOf(VBF * 0.5)} y={yOf(Ih) + 22} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9.5, fontWeight: 700 }}>חסימה קדמית</text>
            <text x={xOf(2.6)} y={yOf(2.6)} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 9.5, fontWeight: 800 }}>הולכה (ON)</text>
            {gate < 0.5 && (
              <text x={xOf(VBF) - 30} y={yOf(Ih * 1.2) - 2} textAnchor="end" className="fill-violet-600" style={{ fontSize: 9, fontWeight: 800 }}>NDR (dV/dI&lt;0)</text>
            )}
          </svg>
        </div>
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        בלי שער, ההתקן חוסם עד מתח-הפריצה <Tex>{'V_{BF}'}</Tex>, ואז "קופץ אחורה" דרך אזור ה-<b>NDR</b>
        (<Tex>{'dV/dI<0'}</Tex>) למצב הולכה במתח נמוך. <b>גררו את זרם-השער</b>: <Tex>{'V_{BF}'}</Tex> יורד, ובזרם-שער
        גבוה ה-NDR נעלם וההתקן נדלק כמו דיודה. כיבוי רק כשהזרם יורד מתחת לזרם-ההחזקה <Tex>{'I_H'}</Tex>.
      </p>
    </div>
  )
}
