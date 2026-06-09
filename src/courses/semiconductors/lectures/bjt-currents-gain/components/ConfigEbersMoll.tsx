import Tex from '@/core/components/Tex'

/**
 * Configuration equivalent circuit (drawing #2), the active-region Ebers-Moll view
 * matching the lecture sketch: the INPUT junction is a forward diode and the OUTPUT
 * is a dependent current source + a small reverse leakage.
 *   CB: E–B forward diode, source α_F·I_E into the collector, leakage I_CBO. (image 1)
 *   CE: B–E forward diode, source β·I_B into the collector, leakage I_CEO.
 * Pure schematic.
 */
type Config = 'CB' | 'CE'
const W = 540
const H = 230
const SLATE = '#475569'
const BLUE = '#2563eb'
const RED = '#e11d48'
const GREEN = '#059669'

export default function ConfigEbersMoll({ config }: { config: Config }) {
  const cb = config === 'CB'
  const yTop = 78 // device row
  const yRail = 176 // common (base for CB / emitter for CE) rail
  const xIn = 60 // input terminal (E for CB, B for CE)
  const xSrc = 360 // dependent source
  const xOut = 484 // collector (output)

  return (
    <div className="flex flex-col gap-3">
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <marker id="cem-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={GREEN} /></marker>
            <marker id="cem-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={BLUE} /></marker>
          </defs>
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

          {/* common rail */}
          <line x1={xIn} y1={yRail} x2={xOut} y2={yRail} stroke={SLATE} strokeWidth={2} />
          <text x={(xIn + xOut) / 2} y={yRail + 20} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 800 }}>
            {cb ? 'B · בסיס (משותף)' : 'E · פולט (משותף)'}
          </text>

          {/* input terminal + lead down to rail through the forward diode */}
          <circle cx={xIn} cy={yTop} r={3.5} fill={SLATE} />
          <text x={xIn} y={yTop - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>{cb ? 'E' : 'B'}</text>
          <line x1={xIn} y1={yTop} x2={xIn} y2={yTop + 26} stroke={SLATE} strokeWidth={2} />
          {/* forward diode (input junction), pointing down toward the rail */}
          <path d={`M ${xIn - 9} ${yTop + 26} L ${xIn + 9} ${yTop + 26} L ${xIn} ${yTop + 44} Z`} fill="#e0f2fe" stroke={SLATE} strokeWidth={1.75} />
          <line x1={xIn - 9} y1={yTop + 44} x2={xIn + 9} y2={yTop + 44} stroke={SLATE} strokeWidth={2} />
          <line x1={xIn} y1={yTop + 44} x2={xIn} y2={yRail} stroke={SLATE} strokeWidth={2} />
          <text x={xIn + 14} y={yTop + 40} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>D<tspan dy={2} style={{ fontSize: 8 }}>{cb ? 'E' : 'BE'}</tspan></text>
          {/* V across the input junction (red) */}
          <text x={xIn - 14} y={yTop + 40} textAnchor="end" fill={RED} style={{ fontSize: 11, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 8 }}>{cb ? 'EB' : 'BE'}</tspan></text>

          {/* dependent current source (output) → C */}
          <path d={`M ${xSrc} ${yTop} L ${xSrc + 16} ${yTop + 20} L ${xSrc} ${yTop + 40} L ${xSrc - 16} ${yTop + 20} Z`} fill="#ecfdf5" stroke={GREEN} strokeWidth={1.5} />
          <line x1={xSrc} y1={yTop + 34} x2={xSrc} y2={yTop + 8} stroke={GREEN} strokeWidth={2} markerEnd="url(#cem-g)" />
          <line x1={xSrc} y1={yTop + 40} x2={xSrc} y2={yRail} stroke={GREEN} strokeWidth={1.75} />
          <text x={xSrc} y={yTop - 8} textAnchor="middle" fill={GREEN} style={{ fontSize: 12, fontWeight: 800 }}>
            {cb ? <>α<tspan dy={2} style={{ fontSize: 8 }}>F</tspan><tspan dy={-2}>·I</tspan><tspan dy={2} style={{ fontSize: 8 }}>E</tspan></> : <>β·I<tspan dy={2} style={{ fontSize: 8 }}>B</tspan></>}
          </text>

          {/* top wire from source to collector */}
          <line x1={xSrc} y1={yTop} x2={xOut} y2={yTop} stroke={SLATE} strokeWidth={2} />
          <circle cx={xOut} cy={yTop} r={3.5} fill={SLATE} />
          <text x={xOut} y={yTop - 10} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C</text>
          {/* leakage I_CBO / I_CEO near the source */}
          <line x1={xSrc + 40} y1={yRail} x2={xSrc + 40} y2={yTop + 8} stroke={BLUE} strokeWidth={1.5} strokeDasharray="3 3" markerEnd="url(#cem-b)" />
          <text x={xSrc + 46} y={yTop + 60} fill={BLUE} style={{ fontSize: 10.5, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 7.5 }}>{cb ? 'CBO' : 'CEO'}</tspan></text>
          {/* V across the output junction (red) */}
          <text x={xOut + 6} y={yTop + 70} textAnchor="middle" fill={RED} style={{ fontSize: 11, fontWeight: 800 }}>V<tspan dy={2} style={{ fontSize: 8 }}>{cb ? 'CB' : 'CE'}</tspan></text>

          {/* terminal currents (blue) */}
          <line x1={xIn + 30} y1={yTop} x2={xIn + 12} y2={yTop} stroke={BLUE} strokeWidth={1.75} markerEnd="url(#cem-b)" />
          <text x={xIn + 34} y={yTop + 3} fill={BLUE} style={{ fontSize: 11, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 8 }}>{cb ? 'E' : 'B'}</tspan></text>
          <line x1={xOut - 30} y1={yTop} x2={xOut - 12} y2={yTop} stroke={BLUE} strokeWidth={1.75} markerEnd="url(#cem-b)" />
          <text x={xOut - 38} y={yTop + 3} fill={BLUE} style={{ fontSize: 11, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 8 }}>C</tspan></text>
        </svg>
      </div>
      <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700" dir="rtl">
        {cb ? (
          <>צומת ה-E-B מוטה קדמית (דיודה) ומזריק את הזרם; הקולט אוסף חלק <Tex>{'\\alpha_F\\approx1'}</Tex> ממנו —{' '}
          <Tex>{'I_C=\\alpha_F I_E + I_{CBO}'}</Tex>. זו צורת ה-Ebers-Moll הטבעית של תצורת בסיס-משותף.</>
        ) : (
          <>כניסת הבסיס (דיודה B-E) שולטת בזרם-בסיס קטן <Tex>{'I_B'}</Tex>, והקולט מספק <Tex>{'\\beta'}</Tex> פעמים ממנו —{' '}
          <Tex>{'I_C=\\beta I_B + I_{CEO}'}</Tex>. אותו התקן, ממופה לתצורת פולט-משותף.</>
        )}
      </div>
    </div>
  )
}
