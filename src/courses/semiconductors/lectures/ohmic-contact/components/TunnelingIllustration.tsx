/**
 * What tunnelling means, drawn: an electron is a WAVE. Its wavefunction oscillates
 * up to the barrier, decays exponentially INSIDE it, and — if the barrier is thin
 * enough — re-emerges with a smaller amplitude on the far side. That residual
 * amplitude is the probability the electron "appears" beyond a barrier it never
 * climbed over. Classically (a ball vs a wall) it would just bounce back.
 * Pure schematic; the shrinking wave is the whole point.
 */
const W = 540
const H = 210
const x0 = 26
const x1 = W - 26
const y0 = 116 // wave axis = the electron's (conserved) energy
const A = 30 // incident amplitude
const xb1 = 232
const xb2 = 292 // thin barrier [xb1, xb2]
const K = (2 * Math.PI) / 46 // wavenumber
const KAPPA = 0.019 // evanescent decay inside the barrier

const ampAt = (x: number) => {
  if (x < xb1) return A
  if (x <= xb2) return A * Math.exp(-KAPPA * (x - xb1))
  return A * Math.exp(-KAPPA * (xb2 - xb1))
}

function wavePath() {
  const pts: string[] = []
  for (let x = x0; x <= x1; x += 2) {
    const y = y0 - ampAt(x) * Math.sin(K * (x - x0))
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}

function envPath(sign: number) {
  const pts: string[] = []
  for (let x = x0; x <= x1; x += 4) pts.push(`${x.toFixed(1)},${(y0 - sign * ampAt(x)).toFixed(1)}`)
  return 'M ' + pts.join(' L ')
}

export default function TunnelingIllustration() {
  const A3 = A * Math.exp(-KAPPA * (xb2 - xb1))
  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* the barrier */}
        <rect x={xb1} y={24} width={xb2 - xb1} height={H - 24 - 30} fill="#7c3aed" opacity={0.16} />
        <rect x={xb1} y={24} width={xb2 - xb1} height={H - 24 - 30} fill="none" stroke="#7c3aed" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="4 3" />
        <text x={(xb1 + xb2) / 2} y={18} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 12, fontWeight: 800 }}>מחסום דק</text>

        {/* electron energy level (conserved → horizontal) */}
        <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 4" />
        <text x={x0 + 2} y={y0 - 6} className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>אנרגיית האלקטרון E</text>

        {/* faint amplitude envelope */}
        <path d={envPath(1)} fill="none" stroke="#0ea5e9" strokeOpacity={0.28} strokeWidth={1} strokeDasharray="3 3" />
        <path d={envPath(-1)} fill="none" stroke="#0ea5e9" strokeOpacity={0.28} strokeWidth={1} strokeDasharray="3 3" />

        {/* the wavefunction */}
        <path d={wavePath()} fill="none" stroke="#0ea5e9" strokeWidth={2.75} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 1px 1.5px rgba(14,165,233,0.25))' }} />

        {/* electron markers: full on the left, faint on the right */}
        <circle cx={70} cy={y0 - A * Math.sin(K * (70 - x0))} r={4} fill="#0284c7" />
        <circle cx={x1 - 60} cy={y0 - A3 * Math.sin(K * (x1 - 60 - x0))} r={4} fill="#0284c7" opacity={0.5} />

        {/* captions */}
        <text x={(x0 + xb1) / 2} y={H - 10} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 12, fontWeight: 700 }}>נכנס — גל במלוא המשרעת</text>
        <text x={(xb2 + x1) / 2} y={H - 10} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 12, fontWeight: 700 }}>יוצא — משרעת קטנה (הסתברות)</text>
      </svg>
    </div>
  )
}
