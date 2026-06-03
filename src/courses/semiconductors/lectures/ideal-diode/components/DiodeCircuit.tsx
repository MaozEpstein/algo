import { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { fmtVolt } from '../../../lib/junction'

/**
 * A tangible "does current flow?" circuit: a wire loop with a voltage source, a
 * diode symbol and a light bulb, plus charge particles streaming around it. The
 * particle count / speed and the bulb glow scale with `level` (0..1, the
 * perceptual conduction level): forward bias above the knee → a bright, fast
 * stream and a lit bulb; equilibrium → nothing; reverse → a red "blocked" barrier
 * over the diode and only a faint backward leakage trickle.
 */
interface Props {
  Va: number
  level: number
}

const W = 480
const H = 300
const X1 = 64
const X2 = 416
const Y1 = 72
const Y2 = 248
const R = 28
const BULB = { x: 240, y: Y1 }
const SRC = { x: X1, y: 160 }
const DIODE = { x: X2, y: 160 }

type Pt = { x: number; y: number }

/** Sample the rounded-rect perimeter (clockwise) into a polyline + cumulative
 *  arc lengths, so a particle phase t∈[0,1] maps to a point on the loop. */
function buildLoop() {
  const pts: Pt[] = []
  const push = (x: number, y: number) => {
    const last = pts[pts.length - 1]
    if (!last || Math.hypot(last.x - x, last.y - y) > 0.01) pts.push({ x, y })
  }
  const arc = (cx: number, cy: number, a0: number, a1: number, n = 8) => {
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n
      push(cx + R * Math.cos(a), cy + R * Math.sin(a))
    }
  }
  push(X1 + R, Y1)
  push(X2 - R, Y1)
  arc(X2 - R, Y1 + R, -Math.PI / 2, 0)
  push(X2, Y2 - R)
  arc(X2 - R, Y2 - R, 0, Math.PI / 2)
  push(X1 + R, Y2)
  arc(X1 + R, Y2 - R, Math.PI / 2, Math.PI)
  push(X1, Y1 + R)
  arc(X1 + R, Y1 + R, Math.PI, Math.PI * 1.5)

  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  const total = cum[cum.length - 1] + Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y)
  return { pts, cum, total }
}

const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function DiodeCircuit({ Va, level }: Props) {
  const loop = useMemo(() => buildLoop(), [])
  const pointAt = (t: number): Pt => {
    const d = (((t % 1) + 1) % 1) * loop.total
    const { pts, cum } = loop
    for (let i = 1; i < pts.length; i++) {
      if (d <= cum[i]) {
        const f = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
        return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f }
      }
    }
    return pts[0]
  }

  // latest props for the animation loop, synced outside render (refs must not be
  // written during render)
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
    const speed = fwd ? 0.12 + 1.1 * lvl : 0.1 // loops / sec
    phaseRef.current += (fwd ? 1 : -1) * speed * (dt / 1000)
    setPhase(phaseRef.current)
  })

  const blocked = Va < 0
  const strong = Va >= 0 && level > 0.55
  const weak = Va >= 0 && level > 0.12 && !strong
  const conducting = strong || weak
  const eqLike = Va >= 0 && level <= 0.12

  // forward stream: count ∝ level; reverse: a single faint leakage particle
  const nFwd = blocked ? 0 : Math.round(level * 14)
  const fwdParticles = Array.from({ length: nFwd }, (_, i) => pointAt(phase + i / Math.max(1, nFwd)))
  const leak = blocked ? pointAt(phase) : null

  const stateLabel = strong ? 'מוליך' : weak ? 'מוליך חלש' : blocked ? 'חוסם' : Math.abs(Va) < 0.02 ? 'אין זרם נטו' : 'כמעט אין זרם'
  const stateColor = strong ? '#10b981' : weak ? '#0d9488' : blocked ? '#f43f5e' : '#94a3b8'
  const bulbLit = 0.18 + 0.82 * level

  return (
    <div className="ltr w-full" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        <defs>
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="55%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* wire loop */}
        <rect x={X1} y={Y1} width={X2 - X1} height={Y2 - Y1} rx={R} fill="none" stroke="#94a3b8" strokeWidth={3} />

        {/* flowing charge particles */}
        {fwdParticles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4.5} fill="#38bdf8" style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.8))' }} />
        ))}
        {leak && <circle cx={leak.x} cy={leak.y} r={3.5} fill="#94a3b8" opacity={0.45} style={{ filter: 'drop-shadow(0 0 4px rgba(148,163,184,0.6))' }} />}

        {/* current symbol I (proper math italic) on the top wire, where the charge streams */}
        {conducting && (
          <text x={150} y={Y1 - 9} textAnchor="middle" fill="#0ea5e9" style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic', fontFamily: '"KaTeX_Math", "Times New Roman", serif' }}>
            I
          </text>
        )}

        {/* light bulb (top) */}
        <g>
          <rect x={BULB.x - 22} y={BULB.y - 6} width={44} height={12} fill="#ffffff" />
          <circle cx={BULB.x} cy={BULB.y} r={15} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={1.5} />
          <circle
            cx={BULB.x}
            cy={BULB.y}
            r={15}
            fill="url(#bulbGlow)"
            opacity={bulbLit}
            style={{ filter: `drop-shadow(0 0 ${6 + 20 * level}px rgba(251,191,36,${0.7 * level}))` }}
          />
          <path d={`M${BULB.x - 5} ${BULB.y + 4} L${BULB.x - 2} ${BULB.y - 4} L${BULB.x + 2} ${BULB.y + 4} L${BULB.x + 5} ${BULB.y - 4}`} fill="none" stroke={level > 0.3 ? '#b45309' : '#94a3b8'} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        </g>

        {/* voltage source (left) */}
        <g>
          <rect x={SRC.x - 14} y={SRC.y - 16} width={28} height={32} fill="#ffffff" />
          <line x1={SRC.x - 15} y1={SRC.y - 9} x2={SRC.x + 15} y2={SRC.y - 9} stroke="#475569" strokeWidth={3} />
          <line x1={SRC.x - 8} y1={SRC.y + 2} x2={SRC.x + 8} y2={SRC.y + 2} stroke="#475569" strokeWidth={5} />
          <line x1={SRC.x - 15} y1={SRC.y + 11} x2={SRC.x + 15} y2={SRC.y + 11} stroke="#475569" strokeWidth={3} />
          <text x={SRC.x + 20} y={SRC.y - 6} className="fill-slate-400" style={{ fontSize: 13, fontWeight: 700 }}>+</text>
          <text x={SRC.x + 20} y={SRC.y + 18} className="fill-slate-400" style={{ fontSize: 13, fontWeight: 700 }}>−</text>
        </g>
        <text x={SRC.x} y={Y2 + 22} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12, fontWeight: 700 }}>
          מקור · {fmtVolt(Va)}
        </text>

        {/* diode (right) — triangle pointing in the forward (downward, clockwise) direction */}
        <g>
          <rect x={DIODE.x - 18} y={DIODE.y - 20} width={36} height={42} fill="#ffffff" />
          <polygon
            points={`${DIODE.x - 13},${DIODE.y - 12} ${DIODE.x + 13},${DIODE.y - 12} ${DIODE.x},${DIODE.y + 10}`}
            fill={conducting ? '#f59e0b' : blocked ? '#fda4af' : '#cbd5e1'}
            stroke={conducting ? '#b45309' : '#64748b'}
            strokeWidth={1.5}
            strokeLinejoin="round"
            style={conducting ? { filter: `drop-shadow(0 0 ${4 + 12 * level}px rgba(245,158,11,${0.7 * level}))` } : undefined}
          />
          <line x1={DIODE.x - 14} y1={DIODE.y + 13} x2={DIODE.x + 14} y2={DIODE.y + 13} stroke={conducting ? '#b45309' : '#64748b'} strokeWidth={3} strokeLinecap="round" />
          {/* blocked barrier */}
          {blocked && (
            <>
              <circle cx={DIODE.x} cy={DIODE.y} r={20} fill="#f43f5e" opacity={0.12} />
              <line x1={DIODE.x - 13} y1={DIODE.y - 13} x2={DIODE.x + 13} y2={DIODE.y + 13} stroke="#f43f5e" strokeWidth={3} strokeLinecap="round" />
            </>
          )}
        </g>

        {/* center state label */}
        <text x={240} y={156} textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: stateColor }}>
          {stateLabel}
        </text>
        {conducting && (
          <text x={240} y={182} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12, fontWeight: 600 }}>
            ← הזרם זורם →
          </text>
        )}
        {eqLike && (
          <text x={240} y={182} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12, fontWeight: 600 }}>
            השסתום עדיין סגור
          </text>
        )}
        {blocked && (
          <text x={240} y={182} textAnchor="middle" className="fill-rose-400" style={{ fontSize: 12, fontWeight: 600 }}>
            רק דליפה זעירה אחורה
          </text>
        )}
      </svg>
    </div>
  )
}
