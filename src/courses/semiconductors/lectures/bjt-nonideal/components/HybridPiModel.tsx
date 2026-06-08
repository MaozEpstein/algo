import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { earlyResistance, rPi, transconductance } from '../../../lib/junction'

/**
 * The common-emitter small-signal hybrid-π model: input r_π between B and E (the
 * signal v_be develops across it), and a dependent current source g_m·v_be in parallel
 * with the output resistance r_o between C and E. A bias-point slider (I_C) rescales
 * g_m=I_C/V_T, r_π=β/g_m and r_o=V_A/I_C. Pure schematic + live values.
 */
const W = 520
const H = 220
const yRail = 176
const xB = 44
const xRpi = 150
const xSrc = 320
const xRo = 430
const xC = 476
const yTop = 52
const SLATE = '#475569'

function Resistor({ x, label, sub }: { x: number; label: string; sub: string }) {
  return (
    <g>
      <line x1={x} y1={yTop} x2={x} y2={yTop + 18} stroke={SLATE} strokeWidth={1.75} />
      <rect x={x - 8} y={yTop + 18} width={16} height={40} rx={2} fill="#f8fafc" stroke={SLATE} strokeWidth={1.75} />
      <line x1={x} y1={yTop + 58} x2={x} y2={yRail} stroke={SLATE} strokeWidth={1.75} />
      <text x={x + 13} y={yTop + 42} className="fill-slate-700" style={{ fontSize: 12, fontWeight: 700 }}>{label}<tspan dy={3} style={{ fontSize: 8 }}>{sub}</tspan></text>
    </g>
  )
}

export default function HybridPiModel() {
  const [icMa, setIcMa] = useState(1)
  const beta = 100
  const VA = 60
  const ic = icMa / 1000 // A
  const gm = transconductance(ic) // S
  const rpi = rPi(beta, gm) // Ω
  const ro = earlyResistance(VA, ic) // Ω

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <defs>
              <marker id="hp-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill="#059669" /></marker>
            </defs>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* E rail */}
            <line x1={xB} y1={yRail} x2={xC} y2={yRail} stroke={SLATE} strokeWidth={2} />
            <text x={(xB + xC) / 2} y={yRail + 20} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>E (משותף)</text>

            {/* B terminal + input wire */}
            <circle cx={xB} cy={yTop} r={3.5} fill={SLATE} />
            <text x={xB} y={yTop - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>B</text>
            <line x1={xB} y1={yTop} x2={xRpi} y2={yTop} stroke={SLATE} strokeWidth={1.75} />
            <Resistor x={xRpi} label="r" sub="π" />
            {/* v_be marker */}
            <text x={xRpi - 13} y={yTop + 30} textAnchor="end" className="fill-blue-600" style={{ fontSize: 10.5, fontWeight: 800 }}>v<tspan dy={2} style={{ fontSize: 7.5 }}>be</tspan></text>

            {/* output: g_m·v_be source ∥ r_o, top wire to C */}
            <line x1={xSrc} y1={yTop} x2={xC} y2={yTop} stroke={SLATE} strokeWidth={1.75} />
            <circle cx={xC} cy={yTop} r={3.5} fill={SLATE} />
            <text x={xC} y={yTop - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C</text>
            {/* dependent source diamond */}
            <line x1={xSrc} y1={yTop} x2={xSrc} y2={yTop + 16} stroke="#059669" strokeWidth={1.75} />
            <path d={`M ${xSrc} ${yTop + 16} L ${xSrc + 14} ${yTop + 36} L ${xSrc} ${yTop + 56} L ${xSrc - 14} ${yTop + 36} Z`} fill="#ecfdf5" stroke="#059669" strokeWidth={1.5} />
            <line x1={xSrc} y1={yTop + 50} x2={xSrc} y2={yTop + 26} stroke="#059669" strokeWidth={2} markerEnd="url(#hp-arr)" />
            <line x1={xSrc} y1={yTop + 56} x2={xSrc} y2={yRail} stroke="#059669" strokeWidth={1.75} />
            <text x={xSrc - 18} y={yTop + 40} textAnchor="end" fill="#059669" style={{ fontSize: 10.5, fontWeight: 800 }}>g<tspan dy={2} style={{ fontSize: 7.5 }}>m</tspan><tspan dy={-2}>v</tspan><tspan dy={2} style={{ fontSize: 7.5 }}>be</tspan></text>
            <Resistor x={xRo} label="r" sub="o" />
          </svg>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>נקודת-עבודה · <Tex>{'I_C'}</Tex></>} value={icMa} min={0.1} max={10} step={0.1} onChange={setIcMa} display={`${icMa.toFixed(1)} mA`} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Readout label="מוליכות-מעבר $g_m=I_C/V_T$" value={`${(gm * 1000).toFixed(1)} mS`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="כניסה $r_\pi=\beta/g_m$" value={`${(rpi / 1000).toFixed(2)} kΩ`} accent="border-blue-100 bg-blue-50" />
        <Readout label="מוצא $r_o=V_A/I_C$" value={`${(ro / 1000).toFixed(0)} kΩ`} accent="border-violet-100 bg-violet-50" />
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        סביב נקודת-העבודה הטרנזיסטור הוא <b>מגבר ליניארי</b>: מתח-אות קטן <Tex>{'v_{be}'}</Tex> על <Tex>{'r_\\pi'}</Tex> יוצר זרם-מוצא <Tex>{'i_c=g_m v_{be}'}</Tex>.
        <Tex>{'\\;g_m'}</Tex> גדל עם זרם-העבודה, ו-<Tex>{'r_o'}</Tex> (מאפקט Early) קובע את עכבת-המוצא הסופית.
      </p>
    </div>
  )
}
