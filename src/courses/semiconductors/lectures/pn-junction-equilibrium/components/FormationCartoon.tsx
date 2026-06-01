import { motion } from 'framer-motion'

/**
 * Animated cartoon of junction formation, parametrized by `stage` (0–4).
 * Carriers (circles) and fixed ionized dopants (squares) live on a lattice;
 * framer-motion animates the transitions: at stage 1 carriers near the junction
 * drift across, at stage 2 they recombine (fade) leaving exposed ions and a
 * growing depletion band, at stage 3 the built-in field fades in, stage 4 =
 * equilibrium. Smooth + legible.
 */
const W = 560
const H = 200
const MID = 280

const ROWS = [52, 100, 148]
const PX = [60, 122, 184]
const NX = [376, 438, 500]
const CARRIER_DX = 16 // carrier sits this much toward the junction from its ion

interface Site {
  id: string
  x: number
  y: number
  side: 'p' | 'n'
}
const SITES: Site[] = [
  ...PX.flatMap((x, ci) => ROWS.map((y, ri) => ({ id: `p${ci}${ri}`, x, y, side: 'p' as const }))),
  ...NX.flatMap((x, ci) => ROWS.map((y, ri) => ({ id: `n${ci}${ri}`, x, y, side: 'n' as const }))),
]

const DEP = [0, 0, 72, 100, 100] // depletion half-width (px) per stage
const spring = { type: 'spring' as const, stiffness: 120, damping: 20 }

export default function FormationCartoon({ stage }: { stage: number }) {
  const dep = DEP[Math.min(stage, 4)]
  const inDep = (x: number) => dep > 0 && Math.abs(x - MID) < dep
  const carrierX = (s: Site) => s.x + (s.side === 'p' ? CARRIER_DX : -CARRIER_DX)

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
        {/* region tints */}
        <rect x={0} y={22} width={MID} height={H - 56} rx={10} fill="#fff1f2" />
        <rect x={MID} y={22} width={W - MID} height={H - 56} rx={10} fill="#eff6ff" />
        {/* depletion band (animated width) — distinct violet so it clearly stands
            out from the rose p-side and blue n-side */}
        <motion.rect
          y={22}
          height={H - 56}
          rx={4}
          fill="#ddd6fe"
          initial={false}
          animate={{ x: MID - dep, width: dep * 2, opacity: dep > 0 ? 0.95 : 0 }}
          transition={spring}
        />
        {/* dashed violet boundary lines at the band edges */}
        {[-1, 1].map((side) => (
          <motion.line
            key={side}
            y1={20}
            y2={H - 26}
            stroke="#7c3aed"
            strokeWidth={2}
            strokeDasharray="5 4"
            initial={false}
            animate={{ x1: MID + side * dep, x2: MID + side * dep, opacity: dep > 0 ? 1 : 0 }}
            transition={spring}
          />
        ))}
        <line x1={MID} y1={14} x2={MID} y2={H - 28} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />

        <text x={MID / 2} y={16} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 12, fontWeight: 800 }}>
          p
        </text>
        <text x={MID + (W - MID) / 2} y={16} textAnchor="middle" className="fill-sky-500" style={{ fontSize: 12, fontWeight: 800 }}>
          n
        </text>

        {/* fixed ionized dopants — faint normally, bold (exposed) inside the depletion band */}
        {SITES.map((s) => {
          const exposed = inDep(s.x)
          return (
            <motion.g key={`ion-${s.id}`} initial={false} animate={{ opacity: exposed ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
              <rect x={s.x - 6} y={s.y - 6} width={12} height={12} rx={3} fill="white" stroke={s.side === 'p' ? '#f43f5e' : '#0ea5e9'} strokeWidth={1.5} />
              <text x={s.x} y={s.y + 3.5} textAnchor="middle" className={s.side === 'p' ? 'fill-rose-500' : 'fill-sky-600'} style={{ fontSize: 10, fontWeight: 800 }}>
                {s.side === 'p' ? '−' : '+'}
              </text>
            </motion.g>
          )
        })}

        {/* mobile majority carriers — drift at stage 1, recombine (fade) inside depletion */}
        {SITES.map((s) => {
          const baseX = carrierX(s)
          const recombined = stage >= 2 && inDep(baseX)
          // gentle drift toward the junction once they start moving
          const driftX = stage === 1 ? baseX + (s.side === 'p' ? 22 : -22) : baseX
          return (
            <motion.circle
              key={`c-${s.id}`}
              r={6}
              fill={s.side === 'p' ? '#fb7185' : '#38bdf8'}
              initial={false}
              animate={{ cx: recombined ? MID : driftX, cy: s.y, opacity: recombined ? 0 : 1 }}
              transition={spring}
            />
          )
        })}

        {/* diffusion arrows (stage 1) */}
        <motion.g stroke="#64748b" strokeWidth={1.75} initial={false} animate={{ opacity: stage === 1 ? 1 : 0 }} transition={{ duration: 0.3 }} markerEnd="url(#fc-arrow)">
          <line x1={MID - 44} y1={H / 2 - 26} x2={MID + 40} y2={H / 2 - 26} />
          <line x1={MID + 44} y1={H / 2 + 26} x2={MID - 40} y2={H / 2 + 26} />
        </motion.g>

        {/* "depletion region" label — appears once the region forms (stage ≥ 2) */}
        <motion.g initial={false} animate={{ opacity: stage >= 2 ? 1 : 0 }} transition={{ duration: 0.4 }}>
          <rect x={MID - 54} y={26} width={108} height={19} rx={9.5} fill="#475569" />
          <text x={MID} y={39} textAnchor="middle" fill="white" style={{ fontSize: 11, fontWeight: 700 }}>
            אזור המחסור
          </text>
        </motion.g>

        {/* built-in field arrow (n → p), fades in at stage ≥ 3 */}
        <motion.g initial={false} animate={{ opacity: stage >= 3 ? 1 : 0 }} transition={{ duration: 0.4 }}>
          <line x1={MID + dep - 8} y1={H / 2} x2={MID - dep + 8} y2={H / 2} stroke="#f59e0b" strokeWidth={3} markerEnd="url(#fc-arrow-amber)" />
          <text x={MID} y={H / 2 - 10} textAnchor="middle" className="fill-amber-600" style={{ fontSize: 12, fontWeight: 800 }}>
            E
          </text>
        </motion.g>

        {/* equilibrium caption */}
        <motion.text
          x={MID}
          y={H - 8}
          textAnchor="middle"
          className="fill-emerald-600"
          style={{ fontSize: 11, fontWeight: 700 }}
          initial={false}
          animate={{ opacity: stage >= 4 ? 1 : 0 }}
        >
          שיווי משקל — סחיפה מאזנת דיפוזיה
        </motion.text>

        <defs>
          <marker id="fc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
          </marker>
          <marker id="fc-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>

      {/* legend */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-rose-400" /> חור (נושא חופשי)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-sky-400" /> אלקטרון (נושא חופשי)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-slate-400" /> יון קבוע (סימום)
        </span>
      </div>
    </div>
  )
}
