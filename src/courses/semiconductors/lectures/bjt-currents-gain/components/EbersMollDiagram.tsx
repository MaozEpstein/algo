import Tex from '@/core/components/Tex'

/**
 * The Ebers-Moll equivalent circuit (npn): two back-to-back diodes (emitter D_E and
 * collector D_C) sharing the base, each with a dependent current source that models the
 * carriers collected by the OTHER junction (α_F·I_F into the collector, α_R·I_R into the
 * emitter). One model reproduces all four operating modes. Pure schematic.
 */
const W = 540
const H = 250
const xE = 96
const xC = 444
const yTop = 38
const yRail = 196
const xB = (xE + xC) / 2
const SLATE = '#475569'

/** A diode triangle (anode top → cathode bottom) centred at (x,y). */
function Diode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <path d={`M ${x - 8} ${y - 7} L ${x + 8} ${y - 7} L ${x} ${y + 6} Z`} fill="#e0f2fe" stroke={SLATE} strokeWidth={1.75} />
      <line x1={x - 9} y1={y + 6} x2={x + 9} y2={y + 6} stroke={SLATE} strokeWidth={2} />
      <text x={x + 14} y={y + 3} className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>{label}</text>
    </g>
  )
}

/** A dependent current-source diamond at (x,y) with a vertical arrow + label. */
function Source({ x, y, up, label, sub }: { x: number; y: number; up: boolean; label: string; sub: string }) {
  return (
    <g>
      <path d={`M ${x} ${y - 14} L ${x + 12} ${y} L ${x} ${y + 14} L ${x - 12} ${y} Z`} fill="#ecfdf5" stroke="#10b981" strokeWidth={1.5} />
      <line x1={x} y1={up ? y + 7 : y - 7} x2={x} y2={up ? y - 7 : y + 7} stroke="#059669" strokeWidth={2} markerEnd="url(#em-arr)" />
      <text x={x} y={y + 28} textAnchor="middle" fill="#059669" style={{ fontSize: 10.5, fontWeight: 800 }}>{label}<tspan dy={2} style={{ fontSize: 7.5 }}>{sub}</tspan></text>
    </g>
  )
}

export default function EbersMollDiagram() {
  return (
    <div className="flex flex-col gap-4">
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <marker id="em-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill="#059669" /></marker>
          </defs>
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

          {/* base rail + B terminal */}
          <line x1={xE} y1={yRail} x2={xC} y2={yRail} stroke={SLATE} strokeWidth={2} />
          <line x1={xB} y1={yRail} x2={xB} y2={yRail + 30} stroke={SLATE} strokeWidth={2} />
          <circle cx={xB} cy={yRail} r={3.5} fill={SLATE} />
          <text x={xB} y={yRail + 44} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>B · בסיס</text>

          {/* emitter branch (left): E → D_E → base */}
          <line x1={xE} y1={yTop} x2={xE} y2={yRail} stroke={SLATE} strokeWidth={2} />
          <circle cx={xE} cy={yTop} r={3.5} fill={SLATE} />
          <text x={xE} y={yTop - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>E · פולט</text>
          <Diode x={xE} y={(yTop + yRail) / 2 - 10} label="D_E" />

          {/* collector branch (right): C → D_C → base */}
          <line x1={xC} y1={yTop} x2={xC} y2={yRail} stroke={SLATE} strokeWidth={2} />
          <circle cx={xC} cy={yTop} r={3.5} fill={SLATE} />
          <text x={xC} y={yTop - 8} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C · קולט</text>
          <Diode x={xC} y={(yTop + yRail) / 2 - 10} label="D_C" />

          {/* dependent sources: α_F·I_F feeds the collector, α_R·I_R feeds the emitter */}
          <Source x={xB - 44} y={(yTop + yRail) / 2 + 12} up label="α" sub="R I_R" />
          <Source x={xB + 44} y={(yTop + yRail) / 2 + 12} up label="α" sub="F I_F" />
          <text x={xE} y={(yTop + yRail) / 2 + 44} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9.5, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 7 }}>F</tspan></text>
          <text x={xC} y={(yTop + yRail) / 2 + 44} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9.5, fontWeight: 700 }}>I<tspan dy={2} style={{ fontSize: 7 }}>R</tspan></text>
        </svg>
      </div>

      {/* equations */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
          <p className="text-sm" dir="ltr"><Tex>{'I_E=-I_F+\\alpha_R I_R'}</Tex></p>
          <p className="mt-1 text-sm" dir="ltr"><Tex>{'I_C=\\alpha_F I_F-I_R'}</Tex></p>
          <p className="mt-1 text-xs text-slate-500" dir="ltr"><Tex>{'I_F=I_{ES}(e^{V_{BE}/V_T}\\!-\\!1)'}</Tex></p>
          <p className="text-xs text-slate-500" dir="ltr"><Tex>{'I_R=I_{CS}(e^{V_{BC}/V_T}\\!-\\!1)'}</Tex></p>
        </div>
        <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
          <b>הדדיות:</b> <Tex>{'\\alpha_F I_{ES}=\\alpha_R I_{CS}'}</Tex> — שלושה פרמטרים בלבד (<Tex>{'\\alpha_F,\\alpha_R,I_{ES}'}</Tex>) מתארים את ההתקן.
          הצבת ההטיות של כל מצב (קדמי/אחורי בכל צומת) משחזרת את <b>ארבעת מצבי-הפעולה</b> — קטעון, פעיל-קדמי, רוויה ופעיל-הפוך.
        </div>
      </div>
    </div>
  )
}
