import { useEffect, useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { MATERIALS, junctionState } from '../../../lib/junction'

/**
 * The junction's-eye view companion to DiodeCircuit: a p│depletion│n block (the
 * lesson-1ב sign-convention style) with a blue charge stream crossing the
 * junction. Forward bias → carriers flow p→n (left→right), the stream thickens
 * and quickens with `level`, and the depletion strip narrows; reverse → a red
 * barrier at the junction, a wide depletion strip and only a faint backward
 * leakage trickle. Driven by the same Va/level as the circuit, in real time.
 */
interface Props {
  Va: number
  level: number
}

const W = 560
const H = 230
const XL = 140 // block left edge
const XR = 420 // block right edge
const MID = 280 // metallurgical junction
const BARY = 72
const BARH = 84

const NA = 1e16
const ND = 1e17
const Si = MATERIALS.Si
const flowL = XL + 18
const flowR = XR - 18
const flowY = BARY + BARH - 24

const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// depletion half-width (px) as a function of bias, via junctionState (clamped so
// the depletion approximation never collapses past ~0.9·V_bi)
const VBI = junctionState(NA, ND, Si, 0).Vbi
const D_EQ = junctionState(NA, ND, Si, 0).d
function depHalfPx(Va: number): number {
  const vaC = Math.min(Va, 0.9 * VBI)
  const ratio = junctionState(NA, ND, Si, vaC).d / D_EQ
  return Math.max(6, Math.min(34, 15 * ratio))
}

export default function PnCurrentFlow({ Va, level }: Props) {
  const levelRef = useRef(level)
  const vaRef = useRef(Va)
  useEffect(() => {
    levelRef.current = level
    vaRef.current = Va
  })
  const phaseRef = useRef(0)
  const [phase, setPhase] = useState(0)

  useAnimationFrame((_t, dt) => {
    if (prefersReduced) return
    const lvl = levelRef.current
    const fwd = vaRef.current >= 0
    const speed = fwd ? 0.1 + 0.8 * lvl : 0.06
    phaseRef.current += (fwd ? 1 : -1) * speed * (dt / 1000)
    setPhase(phaseRef.current)
  })

  const blocked = Va < 0
  const strong = Va >= 0 && level > 0.55
  const weak = Va >= 0 && level > 0.12 && !strong
  const conducting = strong || weak
  const dep = depHalfPx(Va)

  // polarity badges: forward → +(p, amber) / −(n, sky); reverse → swapped
  const eq = Math.abs(Va) < 1e-9
  const leftSign = forwardSign(Va, true)
  const rightSign = forwardSign(Va, false)

  // blue stream crossing the junction (p→n) — count/position from level/phase
  const n = blocked ? 0 : Math.round(level * 12)
  const xAt = (t: number) => {
    const f = ((t % 1) + 1) % 1
    return flowL + (flowR - flowL) * f
  }
  const particles = Array.from({ length: n }, (_, i) => xAt(phase + i / Math.max(1, n)))
  const leakX = blocked ? xAt(phase) : null

  const stateLabel = strong ? 'זרם זורם p→n' : weak ? 'זרם חלש p→n' : blocked ? 'חסום' : eq ? 'אין זרם נטו' : 'כמעט אין זרם'
  const stateColor = strong ? '#10b981' : weak ? '#0d9488' : blocked ? '#f43f5e' : '#94a3b8'

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <marker id="pnflow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0ea5e9" />
          </marker>
        </defs>

        {/* state caption */}
        <text x={W / 2} y={22} textAnchor="middle" style={{ fontSize: 16, fontWeight: 800, fill: stateColor }}>
          {stateLabel}
        </text>

        {/* metal contacts */}
        <rect x={XL - 10} y={BARY + 8} width={10} height={BARH - 16} rx={2} fill="#94a3b8" />
        <rect x={XR} y={BARY + 8} width={10} height={BARH - 16} rx={2} fill="#94a3b8" />

        {/* p region (left) / n region (right) / depletion strip (center) */}
        <rect x={XL} y={BARY} width={MID - dep - XL} height={BARH} fill="#fff1f2" stroke="#fda4af" strokeWidth={1.5} />
        <rect x={MID + dep} y={BARY} width={XR - (MID + dep)} height={BARH} fill="#eff6ff" stroke="#93c5fd" strokeWidth={1.5} />
        <rect x={MID - dep} y={BARY} width={dep * 2} height={BARH} fill="#ede9fe" stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" />

        <text x={(XL + MID - dep) / 2} y={BARY + 28} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 21, fontWeight: 800 }}>
          p
        </text>
        <text x={(MID + dep + XR) / 2} y={BARY + 28} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 21, fontWeight: 800 }}>
          n
        </text>

        {/* polarity badges on the ends */}
        {!eq && (
          <>
            <circle cx={XL - 5} cy={BARY - 10} r={9} fill={Va > 0 ? '#f59e0b' : '#0ea5e9'} />
            <text x={XL - 5} y={BARY - 6} textAnchor="middle" fill="white" style={{ fontSize: 15, fontWeight: 800 }}>
              {leftSign}
            </text>
            <circle cx={XR + 5} cy={BARY - 10} r={9} fill={Va > 0 ? '#0ea5e9' : '#f59e0b'} />
            <text x={XR + 5} y={BARY - 6} textAnchor="middle" fill="white" style={{ fontSize: 15, fontWeight: 800 }}>
              {rightSign}
            </text>
          </>
        )}

        {/* the blue current: a labeled direction arrow (opacity/length ∝ level) + a moving stream */}
        {conducting && (
          <>
            <line
              x1={flowL}
              y1={flowY}
              x2={flowL + (flowR - flowL) * (0.55 + 0.45 * level)}
              y2={flowY}
              stroke="#0ea5e9"
              strokeWidth={1.5 + 2 * level}
              opacity={0.25 + 0.4 * level}
              markerEnd="url(#pnflow-arrow)"
            />
            {/* the current symbol I (proper math italic), labeling the stream from the left */}
            <text
              x={XL - 22}
              y={flowY + 6}
              textAnchor="middle"
              fill="#0ea5e9"
              style={{ fontSize: 24, fontWeight: 700, fontStyle: 'italic', fontFamily: '"KaTeX_Math", "Times New Roman", serif' }}
            >
              I
            </text>
          </>
        )}
        {particles.map((x, i) => (
          <circle key={i} cx={x} cy={flowY} r={4.5} fill="#38bdf8" style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.85))' }} />
        ))}
        {leakX !== null && (
          <circle cx={leakX} cy={flowY} r={3} fill="#94a3b8" opacity={0.4} style={{ filter: 'drop-shadow(0 0 4px rgba(148,163,184,0.6))' }} />
        )}

        {/* reverse: a red barrier across the junction */}
        {blocked && (
          <>
            <rect x={MID - dep - 2} y={BARY - 4} width={dep * 2 + 4} height={BARH + 8} fill="#f43f5e" opacity={0.1} />
            <line x1={MID} y1={BARY - 4} x2={MID} y2={BARY + BARH + 4} stroke="#f43f5e" strokeWidth={3} strokeDasharray="5 4" />
          </>
        )}

        {/* junction caption */}
        <line x1={MID} y1={BARY + BARH + 4} x2={MID} y2={BARY + BARH + 16} stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="3 2" />
        <text x={MID} y={BARY + BARH + 30} textAnchor="middle" className="fill-violet-600" style={{ fontSize: 12, fontWeight: 700 }}>
          {blocked ? 'אזור המחסור מתרחב — חוסם' : conducting ? 'הנושאים חוצים את הצומת' : 'אזור המחסור'}
        </text>
      </svg>
    </div>
  )
}

/** Forward → + on p (left); reverse → + on n (right). */
function forwardSign(Va: number, left: boolean): string {
  if (Math.abs(Va) < 1e-9) return ''
  const forward = Va > 0
  if (left) return forward ? '+' : '−'
  return forward ? '−' : '+'
}
