import { useCallback, useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

/**
 * Interactive band diagram of the carrier transitions. A toggle picks the
 * mechanism and "הצג מעבר" replays it: the electron physically travels its path
 * — climbing E_v→E_c (generation, a pair is created) or falling E_c→E_v (direct
 * recombination + photon, or SRH in two steps via a trap E_t). A coloured burst
 * marks the creation/annihilation event, and the partner hole appears/vanishes
 * in sync. Driven imperatively (useAnimationControls) so replay always fires.
 */
type Mode = 'gen' | 'direct' | 'srh'

const W = 460
const H = 264
const EC = 66 // conduction-band edge (y)
const EV = 200 // valence-band edge (y)
const ET = 133 // trap level (y)
const CX = W / 2

const MODES: { id: Mode; label: string }[] = [
  { id: 'gen', label: 'גנרציה' },
  { id: 'direct', label: 'רקומבינציה ישירה' },
  { id: 'srh', label: 'רקומבינציה SRH' },
]

// electron path: absolute y keyframes, opacity, fractional times, duration (s)
const ANIM: Record<Mode, { y: number[]; opacity: number[]; times: number[]; dur: number }> = {
  gen: { y: [EV, EC], opacity: [1, 1], times: [0, 1], dur: 1.8 },
  direct: { y: [EC, EV, EV], opacity: [1, 1, 0], times: [0, 0.82, 1], dur: 1.8 },
  srh: { y: [EC, ET, ET, EV, EV], opacity: [1, 1, 1, 1, 0], times: [0, 0.34, 0.5, 0.86, 1], dur: 2.6 },
}
// partner hole opacity over the same timeline (created in gen, consumed in recomb)
const HOLE: Record<Mode, { opacity: number[]; times: number[] }> = {
  gen: { opacity: [0, 0, 1], times: [0, 0.2, 1] },
  direct: { opacity: [1, 1, 0], times: [0, 0.82, 1] },
  srh: { opacity: [1, 1, 1, 1, 0], times: [0, 0.34, 0.5, 0.86, 1] },
}
// the creation/annihilation burst: colour, when it pops (s), final radius
const FLASH: Record<Mode, { color: string; delay: number; rEnd: number }> = {
  gen: { color: '#10b981', delay: 0.2, rEnd: 24 },
  direct: { color: '#f43f5e', delay: 1.45, rEnd: 30 },
  srh: { color: '#f59e0b', delay: 2.2, rEnd: 30 },
}
const COLOR: Record<Mode, { stroke: string; marker: string; energy: string; energyText: string }> = {
  gen: { stroke: '#10b981', marker: 'gr-up-g', energy: 'fill-emerald-600', energyText: '↗ חום / אור (קליטה)' },
  direct: { stroke: '#f43f5e', marker: 'gr-dn-r', energy: 'fill-amber-600', energyText: '↝ hν (פליטת אור)' },
  srh: { stroke: '#f59e0b', marker: 'gr-dn-a', energy: 'fill-amber-600', energyText: '↝ חום (פונונים)' },
}

export default function GenRecombDiagram({ initialMode = 'gen' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const eControls = useAnimationControls()
  const holeControls = useAnimationControls()
  const flashControls = useAnimationControls()
  const c = COLOR[mode]

  const run = useCallback(() => {
    const a = ANIM[mode]
    const hole = HOLE[mode]
    const f = FLASH[mode]
    eControls.set({ y: a.y[0], opacity: a.opacity[0] })
    eControls.start({ y: a.y, opacity: a.opacity, transition: { duration: a.dur, times: a.times, ease: 'easeInOut' } })
    holeControls.set({ opacity: hole.opacity[0] })
    holeControls.start({ opacity: hole.opacity, transition: { duration: a.dur, times: hole.times, ease: 'easeInOut' } })
    flashControls.set({ r: 4, opacity: 0 })
    flashControls.start({
      r: [4, f.rEnd],
      opacity: [0, 0.85, 0],
      transition: { duration: 0.6, delay: f.delay, times: [0, 0.3, 1], ease: 'easeOut' },
    })
  }, [mode, eControls, holeControls, flashControls])

  useEffect(() => {
    run()
  }, [run])

  return (
    <div className="flex flex-col gap-3">
      {/* mechanism toggle + replay */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              m.id === mode
                ? 'border-violet-500 bg-violet-500 text-white shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {m.label}
          </button>
        ))}
        <button
          onClick={run}
          className="ms-1 inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-slate-900"
        >
          <span aria-hidden>▶</span> הצג מעבר
        </button>
      </div>

      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <linearGradient id="gr-cb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#eff6ff" />
            </linearGradient>
            <linearGradient id="gr-vb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fee2e2" />
              <stop offset="100%" stopColor="#fef2f2" />
            </linearGradient>
            <marker id="gr-up-g" viewBox="0 0 10 10" refX="5" refY="2" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,10 L5,0 L10,10 z" fill="#10b981" />
            </marker>
            <marker id="gr-dn-r" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L5,10 L10,0 z" fill="#f43f5e" />
            </marker>
            <marker id="gr-dn-a" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L5,10 L10,0 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* band regions + edges */}
          <rect x={30} y={22} width={W - 42} height={44} rx={7} fill="url(#gr-cb)" />
          <rect x={30} y={EV} width={W - 42} height={44} rx={7} fill="url(#gr-vb)" />
          <line x1={30} y1={EC} x2={W - 12} y2={EC} stroke="#1e293b" strokeWidth={2.5} />
          <line x1={30} y1={EV} x2={W - 12} y2={EV} stroke="#1e293b" strokeWidth={2.5} />
          <text x={26} y={EC + 5} textAnchor="end" className="fill-sky-700" style={{ fontSize: 16.9, fontWeight: 800 }}>
            E<tspan dy={3} style={{ fontSize: 13 }}>c</tspan>
          </text>
          <text x={26} y={EV + 5} textAnchor="end" className="fill-rose-600" style={{ fontSize: 16.9, fontWeight: 800 }}>
            E<tspan dy={3} style={{ fontSize: 13 }}>v</tspan>
          </text>
          <text x={W - 16} y={40} textAnchor="end" className="fill-sky-600" style={{ fontSize: 14.3, fontWeight: 700 }}>
            פס הולכה
          </text>
          <text x={W - 16} y={EV + 30} textAnchor="end" className="fill-rose-500" style={{ fontSize: 14.3, fontWeight: 700 }}>
            פס ערכיות
          </text>

          {/* faint full-height guide the electron travels along */}
          <line x1={CX} y1={EC} x2={CX} y2={EV} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="3 4" />

          {/* short, centered direction arrow(s) — clear of the band lines & carriers */}
          {mode === 'srh' ? (
            <>
              <line x1={CX - 34} y1={ET} x2={CX + 34} y2={ET} stroke="#d97706" strokeWidth={2.5} strokeDasharray="6 3" />
              <text x={CX - 42} y={ET + 4} textAnchor="end" className="fill-amber-600" style={{ fontSize: 15.6, fontWeight: 700 }}>
                E<tspan dy={3} style={{ fontSize: 11.7 }}>t</tspan>
              </text>
              <line x1={CX} y1={88} x2={CX} y2={ET - 13} stroke={c.stroke} strokeWidth={3} markerEnd={`url(#${c.marker})`} />
              <line x1={CX} y1={ET + 13} x2={CX} y2={EV - 22} stroke={c.stroke} strokeWidth={3} markerEnd={`url(#${c.marker})`} />
              <text x={CX + 22} y={(ET + EV) / 2 + 4} className={c.energy} style={{ fontSize: 15.6, fontWeight: 700 }}>
                {c.energyText}
              </text>
            </>
          ) : (
            <>
              {mode === 'gen' ? (
                <line x1={CX} y1={150} x2={CX} y2={116} stroke={c.stroke} strokeWidth={3} markerEnd={`url(#${c.marker})`} />
              ) : (
                <line x1={CX} y1={116} x2={CX} y2={150} stroke={c.stroke} strokeWidth={3} markerEnd={`url(#${c.marker})`} />
              )}
              <text x={CX + 22} y={(EC + EV) / 2 + 4} className={c.energy} style={{ fontSize: 15.6, fontWeight: 700 }}>
                {c.energyText}
              </text>
            </>
          )}

          {/* creation / annihilation burst */}
          <motion.circle cx={CX} cy={EV} fill="none" stroke={FLASH[mode].color} strokeWidth={2.5} initial={{ r: 4, opacity: 0 }} animate={flashControls} />

          {/* partner hole (created in gen, consumed in recomb) */}
          <motion.g initial={{ opacity: HOLE[mode].opacity[0] }} animate={holeControls}>
            <circle cx={CX} cy={EV} r={9} fill="white" stroke="#f43f5e" strokeWidth={2.5} />
            <text x={CX} y={EV + 4} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 15.6, fontWeight: 800 }}>
              +
            </text>
          </motion.g>

          {/* the travelling electron (with a soft glow) */}
          <motion.g initial={{ y: ANIM[mode].y[0], opacity: 1 }} animate={eControls}>
            <circle cx={CX} cy={0} r={15} fill="#0ea5e9" opacity={0.22} />
            <circle cx={CX} cy={0} r={9.5} fill="#0ea5e9" />
            <text x={CX} y={4} textAnchor="middle" fill="white" style={{ fontSize: 15.6, fontWeight: 800 }}>
              −
            </text>
          </motion.g>

          {/* caption */}
          <text x={CX} y={H - 10} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 14.3 }}>
            {mode === 'gen'
              ? 'אלקטרון מטפס מ-Ev אל Ec — נוצר זוג אלקטרון–חור'
              : 'אלקטרון נופל אל Ev ומאחה עם חור — הזוג נעלם'}
          </text>
        </svg>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-sky-500" /> אלקטרון
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-rose-400 bg-white" /> חור
        </span>
        {mode === 'srh' && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-3.5 border-b-2 border-dashed border-amber-500" /> מלכודת E_t
          </span>
        )}
      </div>
    </div>
  )
}
