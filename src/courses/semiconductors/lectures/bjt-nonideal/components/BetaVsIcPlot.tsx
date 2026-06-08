import { betaVsIc } from '../../../lib/junction'

/**
 * β as a function of collector current on a log-I_C axis: flat at β_max in the middle,
 * falling at LOW I_C (B-E depletion recombination) and at HIGH I_C (high-level
 * injection). Pure schematic.
 */
const W = 480
const H = 240
const mL = 44
const mR = 18
const mT = 22
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const yBot = mT + PH
const DEC_LO = -8 // log10(I_C/A)
const DEC_HI = -1
const BETA_MAX = 120
const ILO = 1e-6
const IHI = 1e-2

export default function BetaVsIcPlot() {
  const xOf = (logI: number) => mL + ((logI - DEC_LO) / (DEC_HI - DEC_LO)) * PW
  const yOf = (b: number) => mT + (1 - b / (BETA_MAX * 1.12)) * PH
  const N = 120
  const pts: string[] = []
  for (let k = 0; k <= N; k++) {
    const logI = DEC_LO + ((DEC_HI - DEC_LO) * k) / N
    pts.push(`${xOf(logI).toFixed(1)},${yOf(betaVsIc(10 ** logI, BETA_MAX, ILO, IHI)).toFixed(1)}`)
  }

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={12} fill="#fcfdff" stroke="#eef2f7" />
        {/* region shading */}
        <rect x={xOf(DEC_LO)} y={mT} width={xOf(Math.log10(ILO) + 0.3) - xOf(DEC_LO)} height={PH} fill="#f59e0b" fillOpacity={0.07} />
        <rect x={xOf(Math.log10(IHI) - 0.3)} y={mT} width={xOf(DEC_HI) - xOf(Math.log10(IHI) - 0.3)} height={PH} fill="#f43f5e" fillOpacity={0.07} />
        {/* axes */}
        <line x1={mL} y1={yBot} x2={mL + PW} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <line x1={mL} y1={mT} x2={mL} y2={yBot} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL + PW} y={yBot + 15} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>log I<tspan dy={2} style={{ fontSize: 7.5 }}>C</tspan><tspan dy={-2}> →</tspan></text>
        <text x={mL - 6} y={mT + 6} textAnchor="end" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>β</text>
        {/* β_max guide */}
        <line x1={mL} y1={yOf(BETA_MAX)} x2={mL + PW} y2={yOf(BETA_MAX)} stroke="#10b981" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
        <text x={mL + 4} y={yOf(BETA_MAX) - 4} className="fill-emerald-600" style={{ fontSize: 9, fontWeight: 700 }}>β<tspan dy={2} style={{ fontSize: 7 }}>max</tspan></text>
        {/* curve */}
        <path d={'M ' + pts.join(' L ')} fill="none" stroke="#0ea5e9" strokeWidth={2.75} strokeLinejoin="round" />
        {/* region labels */}
        <text x={xOf(DEC_LO + 1)} y={yBot - 8} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 9.5, fontWeight: 700 }}>זרם נמוך</text>
        <text x={xOf(DEC_LO + 1)} y={yBot - 20} textAnchor="middle" className="fill-amber-500" style={{ fontSize: 8 }}>(רקומבינציה)</text>
        <text x={(xOf(DEC_LO) + xOf(DEC_HI)) / 2} y={yOf(BETA_MAX) - 8} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 9.5, fontWeight: 700 }}>שטוח</text>
        <text x={xOf(DEC_HI - 0.6)} y={yBot - 8} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 9.5, fontWeight: 700 }}>זרם גבוה</text>
        <text x={xOf(DEC_HI - 0.6)} y={yBot - 20} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 8 }}>(הזרקה-חזקה)</text>
      </svg>
    </div>
  )
}
