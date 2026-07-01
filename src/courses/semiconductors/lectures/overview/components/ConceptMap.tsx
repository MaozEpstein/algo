import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { lecturePath } from '@/core/platform/links'

/**
 * The flagship course map: a layered dependency graph (tech-tree) of the whole semiconductors
 * course, revealed layer-by-layer to tell the story of *how the understanding is built* — each
 * step narrates why the new layer rests on the previous one. Nodes are clickable and deep-link to
 * their lecture. A dashed "same effect" edge teases the Early≡CLM parallel (see the Effects tab).
 */

interface MapNode {
  id: string
  title: string
  sub?: string
  icon: string
  cx: number
  cy: number
  lectureId: string
  layer: number
}
interface MapEdge {
  from: string
  to: string
  kind?: 'flow' | 'parallel'
}

const NODES: MapNode[] = [
  // L0 — foundations
  { id: 'found', title: 'יסודות', sub: 'פסים · נושאים · סחיפה+דיפוזיה', icon: '🧱', cx: 460, cy: 52, lectureId: 'pn-junction-equilibrium', layer: 0 },
  // L1 — the junction
  { id: 'pneq', title: 'צומת PN — שיווי משקל', sub: 'ρ→E→V · V_bi', icon: '⚖️', cx: 330, cy: 150, lectureId: 'pn-junction-equilibrium', layer: 1 },
  { id: 'pnbias', title: 'צומת PN — ממתח', sub: 'חוק-הצומת · פריצות', icon: '🔌', cx: 610, cy: 150, lectureId: 'pn-junction-bias', layer: 1 },
  // L2 — junction devices
  { id: 'diode', title: 'דיודה אידיאלית', icon: '▷', cx: 150, cy: 258, lectureId: 'ideal-diode', layer: 2 },
  { id: 'ndiode', title: 'דיודה לא-אידיאלית', icon: '♻️', cx: 320, cy: 258, lectureId: 'non-ideal-diode', layer: 2 },
  { id: 'schottky', title: 'דיודת שוטקי', icon: '⚡', cx: 610, cy: 258, lectureId: 'schottky-diode', layer: 2 },
  { id: 'ohmic', title: 'מגע אוהמי', icon: '🔗', cx: 780, cy: 258, lectureId: 'ohmic-contact', layer: 2 },
  // L3 — multi-junction / bipolar
  { id: 'bjt', title: 'BJT — מבנה', icon: '🔺', cx: 175, cy: 372, lectureId: 'bjt-structure', layer: 3 },
  { id: 'bjtcur', title: 'BJT — זרמים/הגבר', icon: '📶', cx: 345, cy: 372, lectureId: 'bjt-currents-gain', layer: 3 },
  { id: 'bjtnon', title: 'BJT — לא-אידיאלי', icon: '📈', cx: 520, cy: 372, lectureId: 'bjt-nonideal', layer: 3 },
  { id: 'scr', title: 'תיריסטור SCR', icon: '🔒', cx: 700, cy: 372, lectureId: 'scr', layer: 3 },
  // L4 — field effect
  { id: 'moscap', title: 'קבל MOS', icon: '🔋', cx: 250, cy: 488, lectureId: 'mos-capacitor', layer: 4 },
  { id: 'jfet', title: 'JFET', icon: '🎚️', cx: 415, cy: 488, lectureId: 'jfet', layer: 4 },
  { id: 'mosfet', title: 'MOSFET', icon: '🧮', cx: 585, cy: 488, lectureId: 'mosfet', layer: 4 },
  { id: 'mosnon', title: 'MOSFET מודרני', icon: '🏎️', cx: 760, cy: 488, lectureId: 'mosfet-nonideal', layer: 4 },
]

const EDGES: MapEdge[] = [
  { from: 'found', to: 'pneq' },
  { from: 'found', to: 'pnbias' },
  { from: 'pneq', to: 'pnbias' },
  { from: 'pnbias', to: 'diode' },
  { from: 'diode', to: 'ndiode' },
  { from: 'pneq', to: 'schottky' },
  { from: 'pneq', to: 'ohmic' },
  { from: 'diode', to: 'bjt' },
  { from: 'bjt', to: 'bjtcur' },
  { from: 'bjtcur', to: 'bjtnon' },
  { from: 'bjt', to: 'scr' },
  { from: 'found', to: 'moscap' },
  { from: 'pneq', to: 'jfet' },
  { from: 'moscap', to: 'mosfet' },
  { from: 'mosfet', to: 'mosnon' },
  { from: 'bjtnon', to: 'mosnon', kind: 'parallel' }, // Early ≡ CLM
]

const LAYER_FILL = ['#eef2ff', '#e0f2fe', '#ecfeff', '#f0fdf4', '#fef3c7']
const LAYER_STROKE = ['#818cf8', '#38bdf8', '#22d3ee', '#4ade80', '#f59e0b']

interface Step {
  title: string
  body: string
  layer: number
}
const STEPS: Step[] = [
  { title: 'יסודות', body: 'הכול נשען על נושאי-מטען, דיאגרמת-פסים, ושני מנגנוני-הובלה: סחיפה (שדה) ודיפוזיה (מפל-ריכוז).', layer: 0 },
  { title: 'הצומת — אבן-הבניין', body: 'מחברים p ל-n → אזור-מחסור, שדה ומתח-בנוי (ρ→E→V). ממתח חושף את חוק-הצומת exp(qV/kT) ואת הפריצות.', layer: 1 },
  { title: 'התקני-צומת', body: 'צומת בודד = דיודה (ואי-אידאליות). מגע מתכת–מל"מ = שוטקי (מיישר) או אוהמי (חיבור למעגל).', layer: 2 },
  { title: 'ריבוי-צמתים', body: 'שני צמתים גב-אל-גב = BJT — מגביר. הרחבה לזרמים/הגבר, לאי-אידאליות, ולמבנה ארבע-שכבתי: תיריסטור.', layer: 3 },
  { title: 'אפקט-השדה', body: 'שליטה קיבולית/מחסור בערוץ: קבל MOS → MOSFET (וההתקן המודרני), ובמקביל JFET. כאן חיים המחשבים.', layer: 4 },
]

const W = 920
const H = 560
const NW = 150
const NH = 46

export default function ConceptMap() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0) // 0..STEPS.length-1
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (step >= STEPS.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 2200)
    return () => clearTimeout(t)
  }, [playing, step])

  const nodeOf = (id: string) => NODES.find((n) => n.id === id)!
  const shown = (n: MapNode) => n.layer <= step
  const edgeShown = (e: MapEdge) => shown(nodeOf(e.from)) && shown(nodeOf(e.to))

  const edgePath = (e: MapEdge) => {
    const a = nodeOf(e.from)
    const b = nodeOf(e.to)
    const x1 = a.cx
    const y1 = a.cy + NH / 2
    const x2 = b.cx
    const y2 = b.cy - NH / 2
    const my = (y1 + y2) / 2
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`
  }

  return (
    <div className="flex flex-col gap-3">
      {/* step controller + narration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)) }}
              disabled={step === 0}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40"
            >‹ הקודם</button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold text-white transition ${playing ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >{playing ? '⏸ עצור' : '▶ בנה את ההבנה'}</button>
            <button
              onClick={() => { setPlaying(false); setStep((s) => Math.min(STEPS.length - 1, s + 1)) }}
              disabled={step === STEPS.length - 1}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40"
            >הבא ›</button>
            <button
              onClick={() => { setPlaying(false); setStep(STEPS.length - 1) }}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >הצג הכול</button>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setStep(i) }}
                aria-label={s.title}
                className={`h-2.5 rounded-full transition-all ${i === step ? 'w-6 bg-slate-800' : i < step ? 'w-2.5 bg-slate-400' : 'w-2.5 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-start gap-3 rounded-xl border-s-4 border-sky-500 bg-sky-50/70 p-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-600 text-sm font-bold text-white">{step + 1}</span>
          <div>
            <p className="font-bold text-slate-800">{STEPS[step].title}</p>
            <p className="text-sm leading-relaxed text-slate-600">{STEPS[step].body}</p>
          </div>
        </div>
      </div>

      {/* the graph */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
            <defs>
              <marker id="cmArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M1,1 L6,4 L1,7" fill="none" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {/* edges */}
            {EDGES.map((e) => {
              if (!edgeShown(e)) return null
              const isParallel = e.kind === 'parallel'
              return (
                <motion.path
                  key={`${e.from}-${e.to}`}
                  d={edgePath(e)}
                  fill="none"
                  stroke={isParallel ? '#fb7185' : '#cbd5e1'}
                  strokeWidth={isParallel ? 1.75 : 1.5}
                  strokeDasharray={isParallel ? '5 4' : undefined}
                  markerEnd={isParallel ? undefined : 'url(#cmArrow)'}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: isParallel ? 0.9 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              )
            })}
            {/* parallel-edge label */}
            {edgeShown({ from: 'bjtnon', to: 'mosnon' }) && (
              <text x={(nodeOf('bjtnon').cx + nodeOf('mosnon').cx) / 2} y={nodeOf('bjtnon').cy - 8} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#e11d48' }}>אותו אפקט (Early ≡ CLM)</text>
            )}

            {/* nodes */}
            <AnimatePresence>
              {NODES.filter(shown).map((n) => (
                <motion.g
                  key={n.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(lecturePath('semiconductors', n.lectureId))}
                >
                  <rect
                    x={n.cx - NW / 2}
                    y={n.cy - NH / 2}
                    width={NW}
                    height={NH}
                    rx={10}
                    fill={LAYER_FILL[n.layer]}
                    stroke={LAYER_STROKE[n.layer]}
                    strokeWidth={1.75}
                  />
                  <text x={n.cx - NW / 2 + 12} y={n.cy - (n.sub ? 2 : -4)} style={{ fontSize: 15 }}>{n.icon}</text>
                  <text x={n.cx + 8} y={n.cy - (n.sub ? 3 : -4)} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: '#0f172a' }}>{n.title}</text>
                  {n.sub && <text x={n.cx + 8} y={n.cy + 12} textAnchor="middle" style={{ fontSize: 8.5, fill: '#64748b' }}>{n.sub}</text>}
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>
        <p className="mt-1 text-center text-xs text-slate-400">לחצו על צומת כדי לקפוץ לשיעור · הקו המקווקו האדום מסמן אפקט משותף בין התקנים</p>
      </div>
    </div>
  )
}
