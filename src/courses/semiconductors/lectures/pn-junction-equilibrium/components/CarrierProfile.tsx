/**
 * Log-scale carrier-concentration profile n(x), p(x) across a symmetric Si
 * junction at equilibrium. On the p-side holes are the majority (≈N_A) and
 * electrons the minority (≈n_i²/N_A), and vice-versa on the n-side; the two
 * curves cross at n_i right at the junction, and both plunge through the
 * depletion region. Illustrative (fixed example), so it stays unit-free.
 */
const W = 520
const H = 240
const mL = 50
const mR = 14
const mT = 16
const mB = 42
const plotW = W - mL - mR
const plotH = H - mT - mB

const NA = 1e16
const ND = 1e16
const NI = 1.5e10
const logNA = Math.log10(NA)
const logND = Math.log10(ND)
const logNI = Math.log10(NI)
const logPmin = Math.log10((NI * NI) / ND) // electrons' minority on n-side ≈ holes' minority on p-side (symmetric)
const logNmin = Math.log10((NI * NI) / NA)
const LOGMAX = 16.6
const LOGMIN = 3.4

const xOf = (t: number) => mL + t * plotW
const yOf = (logc: number) => mT + ((LOGMAX - logc) / (LOGMAX - LOGMIN)) * plotH

const SAMPLES = 64
const path = (pick: (s: number) => number) => {
  const pts: string[] = []
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1)
    const s = 1 / (1 + Math.exp(-(t - 0.5) * 14)) // sharp transition at the junction
    pts.push(`${xOf(t).toFixed(1)},${yOf(pick(s)).toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}
const pPath = path((s) => logNA + (logPmin - logNA) * s) // holes: high on p (left) → low on n (right)
const nPath = path((s) => logNmin + (logND - logNmin) * s) // electrons: low on left → high on right

const TICKS = [16, 12, 8, 4]

function Pow10({ x, y, exp }: { x: number; y: number; exp: number }) {
  return (
    <text x={x} y={y} textAnchor="end" className="fill-slate-400" style={{ fontSize: 13 }}>
      10
      <tspan dy={-5} style={{ fontSize: 10.4 }}>
        {exp}
      </tspan>
    </text>
  )
}

export default function CarrierProfile() {
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* depletion strip */}
        <rect x={xOf(0.4)} y={mT} width={xOf(0.6) - xOf(0.4)} height={plotH} fill="#ede9fe" opacity={0.7} />
        {/* p / n region tints */}
        <rect x={mL} y={H - mB} width={plotW * 0.4} height={5} fill="#fb7185" />
        <rect x={xOf(0.6)} y={H - mB} width={plotW * 0.4} height={5} fill="#38bdf8" />

        {/* axes */}
        <line x1={mL} y1={mT} x2={mL} y2={H - mB} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke="#cbd5e1" strokeWidth={1} />
        {TICKS.map((e) => (
          <g key={e}>
            <line x1={mL - 3} y1={yOf(e)} x2={W - mR} y2={yOf(e)} stroke="#f1f5f9" strokeWidth={1} />
            <Pow10 x={mL - 6} y={yOf(e) + 3} exp={e} />
          </g>
        ))}
        {/* y-axis caption */}
        <text x={14} y={mT + plotH / 2} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 13 }} transform={`rotate(-90 14 ${mT + plotH / 2})`}>
          ריכוז (cm⁻³)
        </text>

        {/* n_i reference */}
        <line x1={mL} y1={yOf(logNI)} x2={W - mR} y2={yOf(logNI)} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={W - mR - 2} y={yOf(logNI) - 4} textAnchor="end" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>
          n
          <tspan dy={3} style={{ fontSize: 10.4 }}>i</tspan>
        </text>

        {/* curves */}
        <path d={pPath} fill="none" stroke="#f43f5e" strokeWidth={2.5} />
        <path d={nPath} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />

        {/* curve labels */}
        <text x={xOf(0.06)} y={yOf(logNA) - 6} className="fill-rose-500" style={{ fontSize: 14.3, fontWeight: 800 }}>
          p (חורים)
        </text>
        <text x={xOf(0.94)} y={yOf(logND) - 6} textAnchor="end" className="fill-sky-600" style={{ fontSize: 14.3, fontWeight: 800 }}>
          n (אלקטרונים)
        </text>

        {/* region captions */}
        <text x={xOf(0.2)} y={H - mB + 18} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 14.3, fontWeight: 800 }}>
          צד p
        </text>
        <text x={xOf(0.5)} y={H - mB + 18} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 13, fontWeight: 700 }}>
          אזור מחסור
        </text>
        <text x={xOf(0.8)} y={H - mB + 18} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 14.3, fontWeight: 800 }}>
          צד n
        </text>
        <text x={mL + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 13 }}>
          מיקום x →
        </text>
      </svg>
    </div>
  )
}
