/**
 * Faithful static reproduction of the תרגול-3 reverse-recovery figures. The diode
 * current I(t) (part ז) and voltage V_D(t) (part ח) during turn-off, with the
 * storage phase (constant −I_R for t_s) then recovery, all source labels
 * (I_F, −I_R, −I_0, V_D, −V_R) and the t_s / t_rr intervals as double-headed
 * dimension arrows. Pure SVG. `panel` selects which curve(s) to draw.
 */
const DARK = '#334155'
const WAVE = '#0e7490'

const X0 = 70 // axis origin x
const XS = 120 // switch instant (t=0)
const XTS = 290 // end of storage (t_s)
const XRR = 360 // end of recovery (t_rr)
const XEND = 430

const Defs = () => (
  <defs>
    <marker id="rr-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={DARK} />
    </marker>
    <marker id="rr-ax" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill={DARK} />
    </marker>
  </defs>
)

function DimArrow({ x1, x2, y, sub }: { x1: number; x2: number; y: number; sub: string }) {
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={DARK} strokeWidth={1.3} markerStart="url(#rr-dim)" markerEnd="url(#rr-dim)" />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" style={{ fontSize: 13, fontWeight: 600, fill: DARK }}>
        t<tspan dy={3} style={{ fontSize: 9 }}>{sub}</tspan>
      </text>
    </>
  )
}

/** Current panel I(t). */
function CurrentPanel() {
  const yI0 = 80
  const yIF = 40
  const yIR = 125
  const yIleak = 93 // −I_0 small leakage floor
  return (
    <svg viewBox="0 0 470 170" className="mx-auto w-full" style={{ maxWidth: 470 }}>
      <Defs />
      <line x1={X0} y1={18} x2={X0} y2={150} stroke={DARK} strokeWidth={1.5} markerEnd="url(#rr-ax)" />
      <line x1={X0 - 10} y1={yI0} x2={XEND} y2={yI0} stroke={DARK} strokeWidth={1.5} markerEnd="url(#rr-ax)" />
      <text x={X0 - 8} y={18} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>I</text>
      <text x={XEND} y={yI0 + 16} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>t</text>

      <line x1={X0} y1={yIleak} x2={XEND - 10} y2={yIleak} stroke={DARK} strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />

      <polyline points={`${X0},${yIF} ${XS},${yIF} ${XS},${yIR} ${XTS},${yIR}`} fill="none" stroke={WAVE} strokeWidth={2.5} />
      <path d={`M ${XTS},${yIR} C ${XTS + 30},${yIR} ${XRR - 20},${yIleak} ${XRR + 20},${yIleak}`} fill="none" stroke={WAVE} strokeWidth={2.5} />
      <line x1={XRR + 20} y1={yIleak} x2={XEND - 10} y2={yIleak} stroke={WAVE} strokeWidth={2.5} />

      <text x={X0 - 8} y={yIF + 4} textAnchor="end" style={{ fontSize: 13, fontWeight: 600, fill: DARK }}>I<tspan dy={3} style={{ fontSize: 9 }}>F</tspan></text>
      <text x={X0 - 8} y={yIR + 4} textAnchor="end" style={{ fontSize: 13, fontWeight: 600, fill: DARK }}>−I<tspan dy={3} style={{ fontSize: 9 }}>R</tspan></text>
      <text x={X0 - 8} y={yIleak - 3} textAnchor="end" style={{ fontSize: 12, fontWeight: 600, fill: DARK }}>−I<tspan dy={3} style={{ fontSize: 9 }}>0</tspan></text>

      <DimArrow x1={XS} x2={XRR} y={30} sub="rr" />
      <DimArrow x1={XS} x2={XTS} y={145} sub="s" />
      <line x1={XS} y1={yIR} x2={XS} y2={149} stroke={DARK} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
      <line x1={XTS} y1={yIR} x2={XTS} y2={149} stroke={DARK} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
    </svg>
  )
}

/** Voltage panel V_D(t). */
function VoltagePanel() {
  const yV0 = 75
  const yVD = 35 // forward V_D
  const yVR = 120 // −V_R floor
  return (
    <svg viewBox="0 0 470 170" className="mx-auto w-full" style={{ maxWidth: 470 }}>
      <Defs />
      <line x1={X0} y1={13} x2={X0} y2={150} stroke={DARK} strokeWidth={1.5} markerEnd="url(#rr-ax)" />
      <line x1={X0 - 10} y1={yV0} x2={XEND} y2={yV0} stroke={DARK} strokeWidth={1.5} markerEnd="url(#rr-ax)" />
      <text x={X0 - 8} y={14} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>V<tspan dy={3} style={{ fontSize: 10 }}>D</tspan></text>
      <text x={XEND} y={yV0 + 16} textAnchor="end" style={{ fontSize: 14, fontWeight: 700, fill: DARK }}>t</text>

      <line x1={X0} y1={yVR} x2={XEND - 10} y2={yVR} stroke={DARK} strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />

      <polyline points={`${X0},${yVD} ${XS},${yVD}`} fill="none" stroke={WAVE} strokeWidth={2.5} />
      <path d={`M ${XS},${yVD} C ${XS + 70},${yVD + 18} ${XTS - 40},${yV0 - 4} ${XTS},${yV0}`} fill="none" stroke={WAVE} strokeWidth={2.5} />
      <path d={`M ${XTS},${yV0} C ${XTS + 25},${yV0 + 28} ${XRR - 25},${yVR} ${XRR + 15},${yVR}`} fill="none" stroke={WAVE} strokeWidth={2.5} />
      <line x1={XRR + 15} y1={yVR} x2={XEND - 10} y2={yVR} stroke={WAVE} strokeWidth={2.5} />

      <text x={X0 + 6} y={yVD - 6} style={{ fontSize: 13, fontWeight: 600, fill: DARK }}>V<tspan dy={3} style={{ fontSize: 9 }}>D</tspan></text>
      <text x={X0 - 8} y={yVR + 4} textAnchor="end" style={{ fontSize: 13, fontWeight: 600, fill: DARK }}>−V<tspan dy={3} style={{ fontSize: 9 }}>R</tspan></text>

      <DimArrow x1={XS} x2={XRR} y={13} sub="rr" />
      <DimArrow x1={XS} x2={XTS} y={145} sub="s" />
      <line x1={XS} y1={yVD} x2={XS} y2={149} stroke={DARK} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
      <line x1={XTS} y1={yV0} x2={XTS} y2={149} stroke={DARK} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
    </svg>
  )
}

export default function ReverseRecoveryFigure({ panel = 'both' }: { panel?: 'I' | 'V' | 'both' }) {
  return (
    <div className="ltr flex w-full flex-col gap-2" dir="ltr">
      {(panel === 'I' || panel === 'both') && <CurrentPanel />}
      {(panel === 'V' || panel === 'both') && <VoltagePanel />}
    </div>
  )
}
