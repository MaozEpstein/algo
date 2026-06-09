import Tex from '@/core/components/Tex'
import { cbOutput } from '../../../lib/junction'

/**
 * Common-base output characteristics I_C(V_CB): one curve per EMITTER-current step.
 * Each is essentially FLAT at the active value I_C≈α·I_E (very high output resistance),
 * collapsing only when the collector junction is driven forward (V_CB ≲ 0 → saturation).
 * Contrast the CE family (knee at V_CE≈0, spacing ∝ β). Pure schematic (reuses cbOutput).
 */
const W = 500
const H = 300
const mL = 52
const mR = 56
const mT = 18
const mB = 42
const PW = W - mL - mR
const PH = H - mT - mB
const VMIN = -0.6
const VMAX = 4 // V (V_CB axis)
const ALPHA = 0.98
const IE_STEPS = [1, 2, 3, 4, 5] // mA
const COLORS = ['#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a']

export default function CbOutputCharacteristics() {
  const iMax = ALPHA * IE_STEPS[IE_STEPS.length - 1]
  const yScale = iMax * 1.12
  const xOf = (v: number) => mL + ((v - VMIN) / (VMAX - VMIN)) * PW
  const yOf = (iMa: number) => mT + (1 - iMa / yScale) * PH
  const x0 = xOf(0) // V_CB = 0 divider

  const N = 90
  const curveFor = (ieMa: number) => {
    const pts: string[] = []
    for (let i = 0; i <= N; i++) {
      const v = VMIN + ((VMAX - VMIN) * i) / N
      const ic = cbOutput(v, ieMa, ALPHA) // mA
      pts.push(`${xOf(v).toFixed(1)},${yOf(ic).toFixed(1)}`)
    }
    return 'M ' + pts.join(' L ')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* saturation region (V_CB < 0) */}
            <rect x={mL} y={mT} width={x0 - mL} height={PH} fill="#f59e0b" fillOpacity={0.08} />
            <text x={(mL + x0) / 2} y={mT + PH - 6} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 9, fontWeight: 700 }}>רוויה</text>
            <text x={(x0 + mL + PW) / 2} y={mT + 12} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 10, fontWeight: 700 }}>אזור פעיל (שטוח)</text>
            {/* axes */}
            <line x1={mL} y1={mT + PH} x2={mL + PW} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} />
            <line x1={x0} y1={mT} x2={x0} y2={mT + PH} stroke="#cbd5e1" strokeWidth={1.25} strokeDasharray="3 3" />
            <text x={mL + PW} y={mT + PH + 16} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>CB</tspan><tspan dy={-2}> (V) →</tspan></text>
            <text x={x0} y={mT + PH + 16} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 8.5 }}>0</text>
            <text x={mL - 8} y={mT + 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 8 }}>C</tspan></text>
            <text x={mL - 8} y={mT + 16} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8.5 }}>(mA)</text>
            {/* curves, one per I_E */}
            {IE_STEPS.map((ieMa, i) => {
              const yActive = yOf(ALPHA * ieMa)
              return (
                <g key={ieMa}>
                  <path d={curveFor(ieMa)} fill="none" stroke={COLORS[i]} strokeWidth={2.5} strokeLinejoin="round" />
                  <text x={mL + PW + 4} y={yActive + 4} textAnchor="start" style={{ fontSize: 9, fontWeight: 700, fill: COLORS[i] }}>{ieMa}mA</text>
                </g>
              )
            })}
            <text x={mL + PW + 4} y={mT + PH + 16} textAnchor="start" className="fill-slate-400" style={{ fontSize: 9, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 7 }}>E</tspan></text>
          </svg>
        </div>
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        כל עקומה היא <Tex>{'I_E'}</Tex> קבוע. ב<b>אזור הפעיל</b> הזרם שטוח לחלוטין ב-<Tex>{'I_C\\approx\\alpha I_E'}</Tex>
        (התנגדות-מוצא כמעט אינסופית, כי <Tex>{'\\alpha<1'}</Tex> — אין הגבר-זרם), והוא צונח רק כשהקולט מוטה קדמית
        (<Tex>{'V_{CB}<0'}</Tex>, רוויה). הבדל מהותי מ-CE: כאן אין תלות ב-<Tex>{'\\beta'}</Tex>.
      </p>
    </div>
  )
}
