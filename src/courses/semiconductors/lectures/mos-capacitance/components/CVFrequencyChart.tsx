import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  mosThreshold,
  mosDepletionCharge,
  mosCVCurve,
  mosCapLF,
  mosCapHF,
  mosCapDeepDepletion,
  type MosCvParams,
} from '../../../lib/junction'

/**
 * The MOS C-V characteristic C(V_G)/C_ox for a p-type substrate, drawing any subset of the three
 * measurement curves — low-frequency (LF), high-frequency (HF) and deep-depletion (DD) — on one
 * axis, exactly like the lecturer's coloured sketch. Optionally marks a live operating point on
 * the active curve. All curves come from the physics helpers in lib/junction.ts.
 */
const MODES = {
  LF: { label: 'תדר נמוך', en: 'LF', color: '#059669', fn: mosCapLF },
  HF: { label: 'תדר גבוה', en: 'HF', color: '#0ea5e9', fn: mosCapHF },
  DD: { label: 'דלדול-עמוק', en: 'Deep-Dep', color: '#e11d48', fn: mosCapDeepDepletion },
} as const

export type CvMode = keyof typeof MODES

interface Props extends MosCvParams {
  show?: CvMode[]
  vgNow?: number
  activeMode?: CvMode
  /** recent V_G values (newest first) — drawn as a fading comet trail on the active curve */
  trail?: number[]
  /** pulsing halo around the operating point (used during auto-sweep) */
  pulsing?: boolean
}

const W = 600
const H = 380
const mL = 60
const mR = 26
const mT = 34
const mB = 64

export default function CVFrequencyChart({ show = ['LF', 'HF', 'DD'], vgNow, activeMode = 'LF', trail, pulsing, ...p }: Props) {
  const VT = mosThreshold(p.VFB, p.phiF, mosDepletionCharge(2 * p.phiF, p.Na, p.epsR), p.Cox)
  const vMin = p.VFB - 2.2
  const vMax = VT + 2.2
  const xL = mL
  const xR = W - mR
  const yT = mT
  const yB = H - mB
  const xOf = (v: number) => xL + ((Math.max(vMin, Math.min(vMax, v)) - vMin) / (vMax - vMin)) * (xR - xL)
  const yOf = (cNorm: number) => yB - cNorm * (yB - yT) // cNorm = C/C_ox ∈ [0,~1.05]

  // Curve paths only depend on the device params + which curves are shown — NOT on the operating
  // point or the trail. Memoising keeps the per-frame auto-sweep (only the dot/trail move) smooth.
  const showKey = show.join(',')
  const paths = useMemo(() => {
    const SAMPLES = 170
    const vs = Array.from({ length: SAMPLES }, (_, i) => vMin + ((vMax - vMin) * i) / (SAMPLES - 1))
    const out: Partial<Record<CvMode, string>> = {}
    ;(['LF', 'HF', 'DD'] as CvMode[]).forEach((m) => {
      if (!show.includes(m)) return
      out[m] = 'M ' + mosCVCurve(vs, p, m).map(({ vg, c }) => `${xOf(vg).toFixed(1)},${yOf(c / p.Cox).toFixed(1)}`).join(' L ')
    })
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.Na, p.ni, p.epsR, p.Cox, p.phiF, p.VFB, showKey, VT])

  const opX = vgNow !== undefined ? xOf(vgNow) : 0
  const opY = vgNow !== undefined ? yOf(MODES[activeMode].fn(vgNow, p) / p.Cox) : 0

  // legend box (placed in the open lower-left area, clear of the curves)
  const legX = xL + 16
  const legY = yOf(0.6)
  const legW = 168
  const legRow = 22

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* axes */}
        <line x1={xL} y1={yT} x2={xL} y2={yB} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={xL} y1={yB} x2={xR} y2={yB} stroke="#94a3b8" strokeWidth={1.5} />
        {/* C_ox reference line */}
        <line x1={xL} y1={yOf(1)} x2={xR} y2={yOf(1)} stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="5 4" />
        <text x={xR - 4} y={yOf(1) - 7} textAnchor="end" className="fill-slate-500" style={{ fontSize: 15, fontWeight: 700 }}>
          C<tspan dy={3} style={{ fontSize: 11 }}>ox</tspan>
        </text>
        <text x={xL - 8} y={yT + 12} textAnchor="end" className="fill-slate-600" style={{ fontSize: 15, fontWeight: 700 }}>
          C/C<tspan dy={3} style={{ fontSize: 11 }}>ox</tspan>
        </text>

        {/* V_FB and V_T ticks */}
        {[{ v: p.VFB, lab: 'FB' }, { v: VT, lab: 'T' }].map((t) => (
          <g key={t.lab}>
            <line x1={xOf(t.v)} y1={yT} x2={xOf(t.v)} y2={yB} stroke="#e2e8f0" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={xOf(t.v)} y={yB + 20} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 14, fontWeight: 700 }}>
              V<tspan dy={3} style={{ fontSize: 10 }}>{t.lab}</tspan>
            </text>
          </g>
        ))}

        {/* regime labels */}
        <text x={(xL + xOf(p.VFB)) / 2} y={yT + 16} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 14, fontWeight: 700 }}>הצטברות</text>
        <text x={(xOf(p.VFB) + xOf(VT)) / 2} y={yB - 10} textAnchor="middle" className="fill-amber-500" style={{ fontSize: 14, fontWeight: 700 }}>מחסור</text>
        <text x={(xOf(VT) + xR) / 2} y={yT + 16} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 14, fontWeight: 700 }}>היפוך</text>

        {/* the curves (draw DD first so LF/HF sit on top near C_ox) */}
        {(['DD', 'HF', 'LF'] as CvMode[]).filter((m) => show.includes(m)).map((m) => (
          <path
            key={m}
            d={paths[m]}
            fill="none"
            stroke={MODES[m].color}
            strokeWidth={m === activeMode ? 3.5 : 2.5}
            strokeDasharray={m === 'DD' ? '7 5' : undefined}
            strokeLinejoin="round"
            opacity={m === activeMode ? 1 : 0.82}
          />
        ))}

        {/* comet trail (auto-sweep): fading dots along the active curve, behind the operating point */}
        {trail && show.includes(activeMode) && trail.map((tv, i) => (
          i === 0 ? null : (
            <circle
              key={i}
              cx={xOf(tv)}
              cy={yOf(MODES[activeMode].fn(tv, p) / p.Cox)}
              r={Math.max(1.5, 5 - i * 0.3)}
              fill={MODES[activeMode].color}
              opacity={0.45 * (1 - i / trail.length)}
            />
          )
        ))}

        {/* live operating point on the active curve (+ pulsing halo during auto-sweep) */}
        {vgNow !== undefined && show.includes(activeMode) && (
          <>
            {pulsing && (
              <motion.circle
                cx={opX}
                cy={opY}
                fill="none"
                stroke={MODES[activeMode].color}
                strokeWidth={2}
                initial={{ r: 6, opacity: 0.6 }}
                animate={{ r: [6, 18], opacity: [0.6, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <circle cx={opX} cy={opY} r={6} fill={MODES[activeMode].color} stroke="#fff" strokeWidth={2.5} />
          </>
        )}

        {/* x label */}
        <text x={(xL + xR) / 2} y={H - 8} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 15, fontWeight: 600 }}>
          מתח שער V<tspan dy={3} style={{ fontSize: 11 }}>G</tspan>
        </text>

        {/* legend with a solid backing so it stays readable over the curve */}
        {show.length > 1 && (
          <g>
            <rect x={legX - 8} y={legY - 16} width={legW} height={show.length * legRow + 10} rx={8} fill="#ffffff" fillOpacity={0.92} stroke="#e2e8f0" />
            {show.map((m, i) => (
              <g key={m} transform={`translate(${legX}, ${legY + i * legRow})`}>
                <line x1={0} y1={0} x2={24} y2={0} stroke={MODES[m].color} strokeWidth={3.5} strokeDasharray={m === 'DD' ? '6 4' : undefined} />
                <text x={32} y={5} className="fill-slate-700" style={{ fontSize: 13.5, fontWeight: 600 }}>{MODES[m].label} ({MODES[m].en})</text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}
