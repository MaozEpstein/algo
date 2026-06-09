import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { earlyResistance, emitterResistance, parallelR, transconductance, voltageGainCB } from '../../../lib/junction'

/**
 * The common-base small-signal model (T-model): the input drives the EMITTER through
 * the low emitter resistance r_e=1/g_m (base common), and the dependent source g_m·v_eb
 * feeds the collector in parallel with r_o. The voltage gain A_v=+g_m(r_o∥R_C) has the
 * SAME magnitude as the CE gain but is NON-inverting; the current gain is only ≈α≈1 and
 * the input resistance is the low r_e. Sliders for I_C and R_C. Pure schematic + live values.
 */
const W = 520
const H = 220
const yRail = 176
const xE = 44
const xRe = 150
const xSrc = 320
const xRo = 430
const xC = 476
const yTop = 52
const SLATE = '#475569'
const VA = 60

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

export default function SmallSignalCB() {
  const [icMa, setIcMa] = useState(1)
  const [rcK, setRcK] = useState(5)
  const ic = icMa / 1000
  const rc = rcK * 1000
  const gm = transconductance(ic)
  const re = emitterResistance(gm)
  const ro = earlyResistance(VA, ic)
  const rLoad = parallelR(ro, rc)
  const av = voltageGainCB(gm, ro, rc) // positive

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <defs>
              <marker id="cbss-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill="#059669" /></marker>
            </defs>
            <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />

            {/* B rail (common) */}
            <line x1={xE} y1={yRail} x2={xC} y2={yRail} stroke={SLATE} strokeWidth={2} />
            <text x={(xE + xC) / 2} y={yRail + 20} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>B (משותף)</text>

            {/* E terminal + input wire to r_e */}
            <circle cx={xE} cy={yTop} r={3.5} fill={SLATE} />
            <text x={xE} y={yTop - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>E</text>
            <line x1={xE} y1={yTop} x2={xRe} y2={yTop} stroke={SLATE} strokeWidth={1.75} />
            <Resistor x={xRe} label="r" sub="e" />
            <text x={xRe - 13} y={yTop + 30} textAnchor="end" className="fill-blue-600" style={{ fontSize: 10.5, fontWeight: 800 }}>v<tspan dy={2} style={{ fontSize: 7.5 }}>eb</tspan></text>

            {/* output: g_m·v source ∥ r_o → C */}
            <line x1={xSrc} y1={yTop} x2={xC} y2={yTop} stroke={SLATE} strokeWidth={1.75} />
            <circle cx={xC} cy={yTop} r={3.5} fill={SLATE} />
            <text x={xC} y={yTop - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C</text>
            <line x1={xSrc} y1={yTop} x2={xSrc} y2={yTop + 16} stroke="#059669" strokeWidth={1.75} />
            <path d={`M ${xSrc} ${yTop + 16} L ${xSrc + 14} ${yTop + 36} L ${xSrc} ${yTop + 56} L ${xSrc - 14} ${yTop + 36} Z`} fill="#ecfdf5" stroke="#059669" strokeWidth={1.5} />
            <line x1={xSrc} y1={yTop + 50} x2={xSrc} y2={yTop + 26} stroke="#059669" strokeWidth={2} markerEnd="url(#cbss-arr)" />
            <line x1={xSrc} y1={yTop + 56} x2={xSrc} y2={yRail} stroke="#059669" strokeWidth={1.75} />
            <text x={xSrc - 18} y={yTop + 40} textAnchor="end" fill="#059669" style={{ fontSize: 10.5, fontWeight: 800 }}>g<tspan dy={2} style={{ fontSize: 7.5 }}>m</tspan><tspan dy={-2}>v</tspan><tspan dy={2} style={{ fontSize: 7.5 }}>eb</tspan></text>
            <Resistor x={xRo} label="r" sub="o" />
          </svg>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <Slider label={<>זרם-עבודה · <Tex>{'I_C'}</Tex></>} value={icMa} min={0.1} max={10} step={0.1} onChange={setIcMa} display={`${icMa.toFixed(1)} mA`} />
        <Slider label={<>עומס-קולט · <Tex>{'R_C'}</Tex></>} value={rcK} min={0.5} max={50} step={0.5} onChange={setRcK} display={`${rcK.toFixed(1)} kΩ`} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="מוליכות $g_m$" value={`${(gm * 1000).toFixed(1)} mS`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="כניסה $r_e=1/g_m$" value={`${re.toFixed(0)} Ω`} accent="border-sky-100 bg-sky-50" />
        <Readout label="עומס $r_o\\parallel R_C$" value={`${(rLoad / 1000).toFixed(2)} kΩ`} accent="border-violet-100 bg-violet-50" />
        <Readout label="הגבר $A_v=+g_m(r_o\\parallel R_C)$" value={`+${av.toFixed(0)}×`} accent="border-rose-100 bg-rose-50" />
      </div>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        אותה <Tex>{'g_m'}</Tex> כמו ב-CE → <b>אותו גודל הגבר-מתח</b>, אבל <b>חיובי (ללא היפוך)</b> כי האות נכנס לפולט.
        לעומת זאת הגבר-הזרם הוא רק <Tex>{'\\approx\\alpha\\approx1'}</Tex>, והתנגדות-הכניסה <b>נמוכה מאוד</b>
        (<Tex>{'r_e=1/g_m'}</Tex>, עשרות אוהם) — לכן CB מתאים לתדרים גבוהים ולמתאם-עכבות.
      </p>
    </div>
  )
}
