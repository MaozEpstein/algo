import { storageTime } from '../../../lib/junction'

/**
 * Reverse-recovery turn-off transient I(t): a forward-conducting diode (+I_F) is
 * switched reverse at t=0. The stored minority charge must be removed first, so the
 * current sits at −I_R (R-limited) for the STORAGE time t_s while the junction stays
 * forward; then it RECOVERS (decays to ~0) over t_r. t_s = τ_eff·ln(1+I_F/I_R), so a
 * short base / Schottky (τ_eff→0) gives almost no recovery. Pure schematic.
 */
interface Props {
  If: number
  ratio: number // I_F / I_R
  tauEff: number // s (lifetime, long; or transit time, short) — drives the curve
  tauRef?: number // s — sets the (fixed) time axis; pass the lifetime so a short base visibly compresses
}

const W = 520
const H = 260
const mL = 46
const mR = 18
const mT = 22
const mB = 40
const PW = W - mL - mR
const PH = H - mT - mB
const yZero = mT + PH * 0.42
const ampF = (yZero - mT) * 0.85
const ampR = (mT + PH - yZero) * 0.85
const VIOLET = '#7c3aed'

export default function ReverseRecoveryWaveform({ If, ratio, tauEff, tauRef }: Props) {
  const Ir = If / ratio
  const tS = storageTime(tauEff, If, Ir)
  const tR = 0.6 * tauEff
  const tTau = tR / 3
  const tRR = tS + tR
  // axis fixed to the long-base reference, so a short base visibly compresses (fast switching)
  const ref = tauRef ?? tauEff
  const tEnd = (storageTime(ref, If, Ir) + 0.6 * ref) * 1.18
  const t0 = -0.3 * tEnd
  const xOf = (t: number) => mL + ((t - t0) / (tEnd - t0)) * PW
  const yOf = (i: number) => (i >= 0 ? yZero - (i / If) * ampF : yZero + (Math.abs(i) / Ir) * ampR)

  // I(t) polyline
  const pts: [number, number][] = [
    [xOf(t0), yOf(If)],
    [xOf(0), yOf(If)],
    [xOf(0), yOf(-Ir)],
    [xOf(tS), yOf(-Ir)],
  ]
  const N = 44
  for (let k = 0; k <= N; k++) {
    const t = tS + (tR * 1.18 * k) / N
    pts.push([xOf(t), yOf(-Ir * Math.exp(-(t - tS) / tTau))])
  }
  pts.push([xOf(tEnd), yZero]) // flat at ~0 to the end of the (fixed) axis
  const curve = 'M ' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')
  const area = curve + ` L ${xOf(tEnd).toFixed(1)},${yZero} L ${xOf(t0).toFixed(1)},${yZero} Z`

  const bands = [
    { a: t0, b: 0, fill: 'rgba(16,185,129,0.07)', label: 'הולכה קדמית', sub: '', cls: 'fill-emerald-600' },
    { a: 0, b: tS, fill: 'rgba(244,63,94,0.12)', label: 'אגירה t', sub: 's', cls: 'fill-rose-600' },
    { a: tS, b: tRR, fill: 'rgba(245,158,11,0.13)', label: 'התאוששות t', sub: 'r', cls: 'fill-amber-600' },
  ]

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <linearGradient id="rr-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.22" />
            <stop offset="42%" stopColor={VIOLET} stopOpacity="0.04" />
            <stop offset="100%" stopColor={VIOLET} stopOpacity="0.22" />
          </linearGradient>
          <marker id="rr-cap" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1,1 L7,4 L1,7 Z" fill="#64748b" /></marker>
        </defs>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfcff" stroke="#eef2f7" />

        {/* phase bands */}
        {bands.map((bd, i) => (
          <g key={i}>
            <rect x={xOf(bd.a)} y={mT} width={xOf(bd.b) - xOf(bd.a)} height={PH} fill={bd.fill} />
            {xOf(bd.b) - xOf(bd.a) > 42 && (
              <text x={(xOf(bd.a) + xOf(bd.b)) / 2} y={mT + 13} textAnchor="middle" className={bd.cls} style={{ fontSize: 11, fontWeight: 700 }}>{bd.label}{bd.sub && <tspan dy={2} style={{ fontSize: 8 }}>{bd.sub}</tspan>}</text>
            )}
          </g>
        ))}

        {/* zero-current axis */}
        <line x1={mL} y1={yZero} x2={W - mR} y2={yZero} stroke="#cbd5e1" strokeWidth={1.25} />
        <text x={mL - 6} y={yZero + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11 }}>0</text>

        {/* I(t) */}
        <path d={area} fill="url(#rr-fill)" />
        <path d={curve} fill="none" stroke={VIOLET} strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />

        {/* dashed time markers */}
        <line x1={xOf(0)} y1={mT} x2={xOf(0)} y2={mT + PH} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
        <text x={xOf(0)} y={mT + PH + 13} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 10, fontWeight: 700 }}>מיתוג</text>
        <line x1={xOf(tS)} y1={yZero} x2={xOf(tS)} y2={mT + PH} stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 3" />

        {/* current labels */}
        <text x={mL - 6} y={yOf(If) + 4} textAnchor="end" className="fill-emerald-700" style={{ fontSize: 11, fontWeight: 700 }}>+I<tspan dy={2} style={{ fontSize: 8 }}>F</tspan></text>
        <text x={mL - 6} y={yOf(-Ir) + 4} textAnchor="end" className="fill-rose-600" style={{ fontSize: 11, fontWeight: 700 }}>−I<tspan dy={2} style={{ fontSize: 8 }}>R</tspan></text>

        {/* t_rr caliper */}
        <line x1={xOf(0)} y1={mT + PH + 24} x2={xOf(tRR)} y2={mT + PH + 24} stroke="#64748b" strokeWidth={1.25} markerStart="url(#rr-cap)" markerEnd="url(#rr-cap)" />
        <text x={(xOf(0) + xOf(tRR)) / 2} y={mT + PH + 21} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10.5, fontWeight: 700 }}>t<tspan dy={2} style={{ fontSize: 7.5 }}>rr</tspan><tspan dy={-2}> = t</tspan><tspan dy={2} style={{ fontSize: 7.5 }}>s</tspan><tspan dy={-2}> + t</tspan><tspan dy={2} style={{ fontSize: 7.5 }}>r</tspan></text>

        <text x={W - mR} y={mT + PH + 13} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 700 }}>זמן t</text>
      </svg>
    </div>
  )
}
