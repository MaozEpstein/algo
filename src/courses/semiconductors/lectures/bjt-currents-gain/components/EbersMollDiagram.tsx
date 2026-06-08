import Tex from '@/core/components/Tex'

/**
 * The Ebers-Moll equivalent circuit (npn, injection version), drawn to match the
 * handwritten lecture sketch: each junction is a PARALLEL box of a diode and a
 * dependent current source. The emitter box (D_E ∥ α_R·I_R) and the collector box
 * (D_C ∥ α_F·I_F) meet at a central base node, from which the base terminal drops
 * down. Each source models the carriers injected by one junction and collected by
 * the OTHER. One model reproduces all four operating modes. Pure schematic.
 */
const W = 600
const H = 264
const ymid = 130
const yt = 92 // top edge (diode row)
const yb = 168 // bottom edge (source row)
const xE = 60
const xC = 540
const La = 130
const Lb = 255 // left (emitter) box
const Ra = 345
const Rb = 470 // right (collector) box
const cx = 300 // central base node
const cxL = (La + Lb) / 2
const cxR = (Ra + Rb) / 2
const yB = 238
const SLATE = '#475569'
const BLUE = '#2563eb'

/** A horizontal diode centred at (x,y); `dir` is the direction it points (= cathode side). */
function HDiode({ x, y, dir, sub }: { x: number; y: number; dir: 'left' | 'right'; sub: string }) {
  const s = dir === 'right' ? 1 : -1
  return (
    <g>
      <path d={`M ${x - 7 * s} ${y - 7} L ${x - 7 * s} ${y + 7} L ${x + 7 * s} ${y} Z`} fill="#e0f2fe" stroke={SLATE} strokeWidth={1.75} />
      <line x1={x + 7 * s} y1={y - 8} x2={x + 7 * s} y2={y + 8} stroke={SLATE} strokeWidth={2} />
      <text x={x} y={y + 19} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 700 }}>D<tspan dy={2} style={{ fontSize: 8 }}>{sub}</tspan></text>
    </g>
  )
}

/** A dependent current-source diamond centred at (x,y) with a horizontal arrow (`dir`)
 *  and a label α_<aSub>·I_<iSub> below it. */
function HSource({ x, y, dir, aSub, iSub }: { x: number; y: number; dir: 'left' | 'right'; aSub: string; iSub: string }) {
  const s = dir === 'right' ? 1 : -1
  return (
    <g>
      <path d={`M ${x} ${y - 12} L ${x + 12} ${y} L ${x} ${y + 12} L ${x - 12} ${y} Z`} fill="#ecfdf5" stroke="#10b981" strokeWidth={1.5} />
      <line x1={x - 6 * s} y1={y} x2={x + 6 * s} y2={y} stroke="#059669" strokeWidth={2} markerEnd="url(#em-arr)" />
      <text x={x} y={y + 26} textAnchor="middle" fill="#059669" style={{ fontSize: 11, fontWeight: 800 }}>α<tspan dy={2} style={{ fontSize: 7.5 }}>{aSub}</tspan><tspan dy={-2}>I</tspan><tspan dy={2} style={{ fontSize: 7.5 }}>{iSub}</tspan></text>
    </g>
  )
}

/** A blue current label with a small direction arrow. */
function Current({ x, y, dir, sub, label }: { x: number; y: number; dir: 'left' | 'right' | 'up'; sub: string; label?: string }) {
  const arrow =
    dir === 'up'
      ? { x1: x, y1: y + 12, x2: x, y2: y - 12 }
      : { x1: dir === 'right' ? x - 12 : x + 12, y1: y, x2: dir === 'right' ? x + 12 : x - 12, y2: y }
  const tx = dir === 'up' ? x + 14 : x
  const ty = dir === 'up' ? y - 1 : y - 10
  return (
    <g>
      <line x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} stroke={BLUE} strokeWidth={1.75} markerEnd="url(#em-cur)" />
      <text x={tx} y={ty} textAnchor="middle" fill={BLUE} style={{ fontSize: 11.5, fontWeight: 800 }}>{label ?? 'I'}<tspan dy={2} style={{ fontSize: 8 }}>{sub}</tspan></text>
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
            <marker id="em-cur" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={BLUE} /></marker>
          </defs>
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

          {/* wires: E → emitter box → base node → collector box → C, and B dropping down */}
          <g stroke={SLATE} strokeWidth={2} fill="none">
            <line x1={xE} y1={ymid} x2={La} y2={ymid} />
            <line x1={La} y1={yt} x2={La} y2={yb} />
            <line x1={Lb} y1={yt} x2={Lb} y2={yb} />
            <line x1={La} y1={yt} x2={Lb} y2={yt} />
            <line x1={La} y1={yb} x2={Lb} y2={yb} />
            <line x1={Lb} y1={ymid} x2={Ra} y2={ymid} />
            <line x1={Ra} y1={yt} x2={Ra} y2={yb} />
            <line x1={Rb} y1={yt} x2={Rb} y2={yb} />
            <line x1={Ra} y1={yt} x2={Rb} y2={yt} />
            <line x1={Ra} y1={yb} x2={Rb} y2={yb} />
            <line x1={Rb} y1={ymid} x2={xC} y2={ymid} />
            <line x1={cx} y1={ymid} x2={cx} y2={yB} />
          </g>

          {/* terminals */}
          <circle cx={xE} cy={ymid} r={3.5} fill={SLATE} />
          <circle cx={xC} cy={ymid} r={3.5} fill={SLATE} />
          <circle cx={cx} cy={ymid} r={4} fill={SLATE} />
          <circle cx={cx} cy={yB} r={3.5} fill={SLATE} />
          <text x={xE - 4} y={ymid - 14} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>E · פולט</text>
          <text x={xC + 4} y={ymid - 14} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>C · קולט</text>
          <text x={cx} y={yB + 18} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 13, fontWeight: 800 }}>B · בסיס</text>

          {/* diodes (top edges) — emitter points left (toward E), collector points right (toward C) */}
          <HDiode x={cxL} y={yt} dir="left" sub="E" />
          <HDiode x={cxR} y={yt} dir="right" sub="C" />

          {/* dependent sources (bottom edges) — α_R·I_R on the emitter side, α_F·I_F on the collector side */}
          <HSource x={cxL} y={yb} dir="right" aSub="R" iSub="R" />
          <HSource x={cxR} y={yb} dir="left" aSub="F" iSub="F" />

          {/* terminal & diode currents (blue) */}
          <Current x={cxL} y={yt - 17} dir="left" sub="F" />
          <Current x={cxR} y={yt - 17} dir="right" sub="R" />
          <Current x={xE + 36} y={ymid + 16} dir="right" sub="E" />
          <Current x={xC - 36} y={ymid + 16} dir="left" sub="C" />
          <Current x={cx} y={yB - 28} dir="up" sub="B" />
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
