import { niAt, thermalVoltage, type Material } from '../../../lib/junction'

/**
 * Minority-carrier concentration near the junction under bias (log scale). In
 * each neutral region the minority concentration sits at its equilibrium value
 * (n_{p0}=n_i²/N_A on the p-side, p_{n0}=n_i²/N_D on the n-side) far from the
 * junction, and at the depletion edge it is set by the law of the junction to
 * n_{p0}·e^{V_A/V_T}: forward bias lifts it (injection), reverse depresses it
 * (extraction). The excess relaxes back over a diffusion length. Illustrative.
 */
interface Props {
  Va: number
  Na: number
  Nd: number
  mat: Material
  T?: number
}

const W = 520
const H = 250
const mL = 50
const mR = 14
const mT = 20
const mB = 46
const plotW = W - mL - mR
const plotH = H - mT - mB
const LOGMAX = 16
const LOGMIN = 2
const DEP_L = 0.44
const DEP_R = 0.56
const LAMBDA = 0.14 // decay length (in t-units) of the injected excess

const xOf = (t: number) => mL + t * plotW
const clampLog = (c: number) => Math.max(LOGMIN, Math.min(LOGMAX, Math.log10(Math.max(c, 1))))
const yOf = (c: number) => mT + ((LOGMAX - clampLog(c)) / (LOGMAX - LOGMIN)) * plotH

const TICKS = [16, 12, 8, 4]

function Pow10({ x, y, exp }: { x: number; y: number; exp: number }) {
  return (
    <text x={x} y={y} textAnchor="end" className="fill-slate-400" style={{ fontSize: 13 }}>
      10<tspan dy={-5} style={{ fontSize: 10.4 }}>{exp}</tspan>
    </text>
  )
}

export default function MinorityInjectionProfile({ Va, Na, Nd, mat, T = 300 }: Props) {
  const ni = niAt(mat, T)
  const np0 = (ni * ni) / Na // electron minority on the p-side
  const pn0 = (ni * ni) / Nd // hole minority on the n-side
  const factor = Math.exp(Va / thermalVoltage(T))
  const edgeP = np0 * factor
  const edgeN = pn0 * factor

  const SAMPLES = 40
  // p-side electrons: t∈[0,DEP_L], excess decays into the bulk (toward t=0)
  const pSide: string[] = []
  for (let i = 0; i < SAMPLES; i++) {
    const t = (DEP_L * i) / (SAMPLES - 1)
    const c = np0 + (edgeP - np0) * Math.exp(-(DEP_L - t) / LAMBDA)
    pSide.push(`${xOf(t).toFixed(1)},${yOf(c).toFixed(1)}`)
  }
  // n-side holes: t∈[DEP_R,1], excess decays into the bulk (toward t=1)
  const nSide: string[] = []
  for (let i = 0; i < SAMPLES; i++) {
    const t = DEP_R + ((1 - DEP_R) * i) / (SAMPLES - 1)
    const c = pn0 + (edgeN - pn0) * Math.exp(-(t - DEP_R) / LAMBDA)
    nSide.push(`${xOf(t).toFixed(1)},${yOf(c).toFixed(1)}`)
  }

  const forward = Va > 0.001

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* depletion strip */}
        <rect x={xOf(DEP_L)} y={mT} width={xOf(DEP_R) - xOf(DEP_L)} height={plotH} fill="#ede9fe" opacity={0.7} />
        {/* side tints */}
        <rect x={mL} y={H - mB} width={plotW * DEP_L} height={5} fill="#fb7185" />
        <rect x={xOf(DEP_R)} y={H - mB} width={plotW * (1 - DEP_R)} height={5} fill="#38bdf8" />

        {/* axes + gridlines */}
        <line x1={mL} y1={mT} x2={mL} y2={H - mB} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke="#cbd5e1" strokeWidth={1} />
        {TICKS.map((e) => (
          <g key={e}>
            <line x1={mL - 3} y1={yOf(10 ** e)} x2={W - mR} y2={yOf(10 ** e)} stroke="#f1f5f9" strokeWidth={1} />
            <Pow10 x={mL - 6} y={yOf(10 ** e) + 3} exp={e} />
          </g>
        ))}
        <text x={14} y={mT + plotH / 2} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 13 }} transform={`rotate(-90 14 ${mT + plotH / 2})`}>
          ריכוז מיעוט (cm⁻³)
        </text>

        {/* equilibrium reference levels (dashed) */}
        <line x1={mL} y1={yOf(np0)} x2={xOf(DEP_L)} y2={yOf(np0)} stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="5 4" />
        <line x1={xOf(DEP_R)} y1={yOf(pn0)} x2={W - mR} y2={yOf(pn0)} stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="5 4" />
        <text x={xOf(0.02)} y={yOf(np0) - 4} className="fill-slate-400" style={{ fontSize: 11.7 }}>
          n<tspan dy={2} style={{ fontSize: 9.1 }}>p0</tspan>
        </text>
        <text x={W - mR - 2} y={yOf(pn0) - 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11.7 }}>
          p<tspan dy={2} style={{ fontSize: 9.1 }}>n0</tspan>
        </text>

        {/* the minority profiles */}
        <path d={'M ' + pSide.join(' L ')} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />
        <path d={'M ' + nSide.join(' L ')} fill="none" stroke="#f43f5e" strokeWidth={2.5} />

        {/* edge markers */}
        <circle cx={xOf(DEP_L)} cy={yOf(edgeP)} r={3} fill="#0ea5e9" />
        <circle cx={xOf(DEP_R)} cy={yOf(edgeN)} r={3} fill="#f43f5e" />

        {/* labels */}
        <text x={xOf(0.04)} y={mT + 12} className="fill-sky-600" style={{ fontSize: 13, fontWeight: 800 }}>
          אלקטרונים — מיעוט בצד p
        </text>
        <text x={W - mR - 2} y={mT + 12} textAnchor="end" className="fill-rose-500" style={{ fontSize: 13, fontWeight: 800 }}>
          חורים — מיעוט בצד n
        </text>

        {/* region captions */}
        <text x={xOf(DEP_L / 2)} y={H - mB + 18} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 13, fontWeight: 800 }}>
          צד p
        </text>
        <text x={xOf((DEP_L + DEP_R) / 2)} y={H - mB + 18} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 11.7, fontWeight: 700 }}>
          מחסור
        </text>
        <text x={xOf(DEP_R + (1 - DEP_R) / 2)} y={H - mB + 18} textAnchor="middle" className="fill-sky-600" style={{ fontSize: 13, fontWeight: 800 }}>
          צד n
        </text>
        <text x={mL + plotW / 2} y={H - 6} textAnchor="middle" className={forward ? 'fill-amber-600' : 'fill-slate-400'} style={{ fontSize: 13, fontWeight: 700 }}>
          {forward ? 'הזרקה: ריכוז המיעוט בקצה עולה מעריכית' : Va < -0.001 ? 'שאיבה: ריכוז המיעוט בקצה צונח אל ~0' : 'שיווי משקל: אין עודף'}
        </text>
      </svg>
    </div>
  )
}
