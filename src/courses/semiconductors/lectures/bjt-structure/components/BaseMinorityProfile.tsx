import { shortBaseProfile } from '../../../lib/junction'

/**
 * Excess minority-carrier profile along E-B-C in forward-active. The story lives in
 * the BASE: injected electrons fall almost linearly from Δn(0) at the emitter edge
 * to ~0 at the collector edge (swept away by the reverse B-C field). A THIN base
 * (small W_B) means the SAME Δn(0) drops over a shorter distance → a STEEPER slope →
 * a larger diffusion current I_C ∝ 1/W_B. The base width here is drawn to scale, so
 * shrinking W_B visibly steepens the line. Pure schematic (reuses shortBaseProfile).
 */
interface Props {
  /** neutral base width in µm (drawn to scale). */
  wbMicron: number
  /** base diffusion length in µm (sets the slight curvature). */
  lMicron: number
}

const W = 560
const H = 220
const MX = 40
const MR = 26
const TOP = 24
const BOT = 34
const PR = W - MR
const yBot = H - BOT
const amp = H - TOP - BOT - 6
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export default function BaseMinorityProfile({ wbMicron, lMicron }: Props) {
  const xEB = MX + 124
  const baseW = clamp(28 + wbMicron * 20, 34, 196)
  const xBC = xEB + baseW

  // base electron profile (prominent)
  const Nb = 40
  const basePts: [number, number][] = []
  for (let i = 0; i <= Nb; i++) {
    const x = (wbMicron * i) / Nb
    const dp = shortBaseProfile(x, wbMicron, lMicron)
    basePts.push([xEB + (baseW * i) / Nb, yBot - dp * amp])
  }
  const baseCurve = 'M ' + basePts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')
  const baseArea = baseCurve + ` L ${xBC.toFixed(1)},${yBot} L ${xEB.toFixed(1)},${yBot} Z`

  // faint emitter back-injected holes near the E-B junction
  const Ne = 24
  const emPts: [number, number][] = []
  for (let i = 0; i <= Ne; i++) {
    const f = i / Ne
    const x = xEB - (xEB - MX) * (1 - f)
    const dp = Math.exp(-(1 - f) * 3) * 0.4
    emPts.push([x, yBot - dp * amp])
  }
  const emCurve = 'M ' + emPts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <linearGradient id="bmp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKY} stopOpacity="0.34" />
            <stop offset="100%" stopColor={SKY} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfcff" stroke="#eef2f7" />

        {/* region tints */}
        <rect x={MX} y={TOP} width={xEB - MX} height={yBot - TOP} fill={SKY} fillOpacity={0.05} />
        <rect x={xEB} y={TOP} width={baseW} height={yBot - TOP} fill={ROSE} fillOpacity={0.06} />
        <rect x={xBC} y={TOP} width={PR - xBC} height={yBot - TOP} fill={SKY} fillOpacity={0.05} />
        <line x1={xEB} y1={TOP} x2={xEB} y2={yBot} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={xBC} y1={TOP} x2={xBC} y2={yBot} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 2" />

        {/* axes */}
        <line x1={MX} y1={yBot} x2={PR} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />

        {/* emitter holes (faint) */}
        <path d={emCurve} fill="none" stroke={ROSE} strokeWidth={1.75} strokeDasharray="4 3" opacity={0.55} />

        {/* base electrons (prominent) */}
        <path d={baseArea} fill="url(#bmp-fill)" />
        <path d={baseCurve} fill="none" stroke={SKY} strokeWidth={2.75} strokeLinejoin="round" />

        {/* Δn(0) marker */}
        <circle cx={xEB} cy={yBot - amp} r={3.5} fill={SKY} />
        <text x={xEB - 5} y={yBot - amp - 6} textAnchor="end" className="fill-sky-700" style={{ fontSize: 11, fontWeight: 700 }}>Δn(0)</text>

        {/* region labels */}
        <text x={(MX + xEB) / 2} y={yBot + 18} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 11.5, fontWeight: 800 }}>פולט · n</text>
        <text x={(xEB + xBC) / 2} y={yBot + 18} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 11.5, fontWeight: 800 }}>בסיס · p</text>
        <text x={(xBC + PR) / 2} y={yBot + 18} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 11.5, fontWeight: 800 }}>קולט · n</text>

        {/* slope → current callout */}
        <text x={(xEB + xBC) / 2} y={TOP + 14} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>שיפוע ∝ 1/W<tspan dy={2} style={{ fontSize: 8 }}>B</tspan><tspan dy={-2}> → I</tspan><tspan dy={2} style={{ fontSize: 8 }}>C</tspan></text>

        <text x={MX - 4} y={TOP + 6} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>Δn</text>
      </svg>
    </div>
  )
}
