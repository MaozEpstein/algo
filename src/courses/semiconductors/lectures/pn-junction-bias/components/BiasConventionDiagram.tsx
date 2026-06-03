/**
 * A schematic of the sign convention: an external source V_A wired to a p│n
 * block, showing which terminal goes where for forward vs reverse bias, and the
 * fact that the applied voltage drops across the (high-resistance) depletion
 * region in the middle. Pure static SVG, switched by `mode`.
 */
interface Props {
  mode: 'forward' | 'reverse' | 'equilibrium'
}

const W = 560
const H = 210
const PL = 150 // p-block left
const PR = 410 // n-block right
const MID = 280
const BARY = 46 // bar top
const BARH = 64
const DEP = 18 // half-width of the depletion strip

export default function BiasConventionDiagram({ mode }: Props) {
  const eq = mode === 'equilibrium'
  const forward = mode === 'forward'
  // potential: forward → + on p (left); reverse → + on n (right)
  const leftSign = eq ? '' : forward ? '+' : '−'
  const rightSign = eq ? '' : forward ? '−' : '+'
  const captionHe = eq
    ? 'ללא מתח חיצוני — שיווי משקל'
    : forward
      ? 'ממתח קדמי: הקוטב החיובי על צד p'
      : 'ממתח אחורי: הקוטב החיובי על צד n'
  const captionColor = eq ? 'fill-slate-500' : forward ? 'fill-amber-600' : 'fill-sky-600'
  const cy = BARY + BARH / 2

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* the p│n bar */}
        <rect x={PL} y={BARY} width={MID - PL} height={BARH} fill="#fff1f2" stroke="#fda4af" strokeWidth={1.5} />
        <rect x={MID} y={BARY} width={PR - MID} height={BARH} fill="#eff6ff" stroke="#93c5fd" strokeWidth={1.5} />
        {/* depletion strip */}
        <rect x={MID - DEP} y={BARY} width={DEP * 2} height={BARH} fill="#ede9fe" stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" />
        <text x={PL + (MID - PL) / 2} y={cy + 4} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 20.8, fontWeight: 800 }}>
          p
        </text>
        <text x={MID + (PR - MID) / 2} y={cy + 4} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 20.8, fontWeight: 800 }}>
          n
        </text>

        {/* metal contacts at the two ends */}
        <rect x={PL - 10} y={BARY + 8} width={10} height={BARH - 16} rx={2} fill="#94a3b8" />
        <rect x={PR} y={BARY + 8} width={10} height={BARH - 16} rx={2} fill="#94a3b8" />

        {!eq && (
          <>
            {/* wires from each contact down to the battery */}
            <polyline points={`${PL - 5},${BARY + BARH} ${PL - 5},${H - 34} 232,${H - 34}`} fill="none" stroke="#475569" strokeWidth={2} />
            <polyline points={`${PR + 5},${BARY + BARH} ${PR + 5},${H - 34} 328,${H - 34}`} fill="none" stroke="#475569" strokeWidth={2} />
            {/* battery body */}
            <rect x={246} y={H - 50} width={68} height={32} rx={8} fill="white" stroke="#475569" strokeWidth={1.5} />
            <text x={280} y={H - 29} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 16.9, fontWeight: 700 }}>
              V<tspan dy={3} style={{ fontSize: 11.7 }}>A</tspan>
            </text>
            {/* polarity at the battery terminals */}
            <text x={238} y={H - 28} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 18.2, fontWeight: 800 }}>
              {forward ? '+' : '−'}
            </text>
            <text x={322} y={H - 28} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 18.2, fontWeight: 800 }}>
              {forward ? '−' : '+'}
            </text>
          </>
        )}

        {/* polarity badges on the semiconductor ends */}
        {!eq && (
          <>
            <circle cx={PL - 5} cy={BARY - 8} r={9} fill={forward ? '#f59e0b' : '#0ea5e9'} />
            <text x={PL - 5} y={BARY - 4} textAnchor="middle" fill="white" style={{ fontSize: 16.9, fontWeight: 800 }}>
              {leftSign}
            </text>
            <circle cx={PR + 5} cy={BARY - 8} r={9} fill={forward ? '#0ea5e9' : '#f59e0b'} />
            <text x={PR + 5} y={BARY - 4} textAnchor="middle" fill="white" style={{ fontSize: 16.9, fontWeight: 800 }}>
              {rightSign}
            </text>
          </>
        )}

        {/* "the voltage drops here" pointer to the depletion strip */}
        <line x1={MID} y1={BARY + BARH + 4} x2={MID} y2={BARY + BARH + 18} stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="3 2" />
        <text x={MID} y={BARY + BARH + 30} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 11.7, fontWeight: 700 }}>
          {eq ? 'אזור המחסור' : 'המתח נופל על אזור המחסור'}
        </text>

        {/* caption */}
        <text x={W / 2} y={20} textAnchor="middle" className={captionColor} style={{ fontSize: 15.6, fontWeight: 700 }}>
          {captionHe}
        </text>
      </svg>
    </div>
  )
}
