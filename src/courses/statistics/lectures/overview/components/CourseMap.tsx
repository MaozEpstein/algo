import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { lecturePath } from '@/core/platform/links'
import { useCourse } from '@/core/platform/CourseProvider'

/**
 * The statistics course map: a layered tech-tree of all 12 chapters, grouped into
 * the summary's own three parts, revealed part-by-part to tell how the course
 * builds on itself. Doubles as a progress tracker — a node is "live" (colored,
 * clickable, deep-links to its lesson) iff its lectureId is registered; otherwise
 * it shows as "בקרוב". Adding a lesson to the registry lights its node up
 * automatically, with no change here.
 */

type Part = 0 | 1 | 2 // 0=RV & vectors, 1=detection & estimation, 2=random processes

interface MapNode {
  id: string
  title: string
  sub: string
  icon: string
  cx: number
  cy: number
  lectureId: string
  part: Part
}
interface MapEdge {
  from: string
  to: string
}

export const NODES: MapNode[] = [
  // חלק א׳ — משתנים מקריים ווקטורים
  { id: 'rv', title: 'משתנים מקריים', sub: 'שיעור 1', icon: '🎲', cx: 460, cy: 52, lectureId: 'random-variables', part: 0 },
  { id: 'mom', title: 'מומנטים', sub: 'שיעור 2', icon: '📊', cx: 300, cy: 150, lectureId: 'moments', part: 0 },
  { id: 'func', title: 'פונקציות של מ״מ', sub: 'שיעור 3', icon: '🔀', cx: 620, cy: 150, lectureId: 'functions-of-rvs', part: 0 },
  { id: 'mvn', title: 'נורמלי רב-ממדי', sub: 'שיעור 4', icon: '🧭', cx: 460, cy: 248, lectureId: 'multivariate-normal', part: 0 },
  // חלק ב׳ — גילוי ואמידה
  { id: 'hyp', title: 'בדיקת השערות', sub: 'שיעור 5', icon: '⚖️', cx: 180, cy: 350, lectureId: 'hypothesis-testing', part: 1 },
  { id: 'ml', title: 'נראות מרבית', sub: 'שיעור 6', icon: '🎯', cx: 460, cy: 350, lectureId: 'maximum-likelihood', part: 1 },
  { id: 'ls', title: 'ריבועים פחותים', sub: 'שיעור 7', icon: '📏', cx: 745, cy: 350, lectureId: 'least-squares', part: 1 },
  { id: 'bayes', title: 'סטטיסטיקה בייסיאנית', sub: 'שיעור 8', icon: '🔁', cx: 320, cy: 452, lectureId: 'bayesian-statistics', part: 1 },
  { id: 'lbayes', title: 'אמידה בייסיאנית לינארית', sub: 'שיעור 9', icon: '📐', cx: 620, cy: 452, lectureId: 'linear-bayesian-estimation', part: 1 },
  // חלק ג׳ — תהליכים מקריים
  { id: 'rp', title: 'תהליכים מקריים', sub: 'שיעור 10', icon: '〰️', cx: 250, cy: 556, lectureId: 'random-processes', part: 2 },
  { id: 'rpmom', title: 'מומנטים של ת״מ', sub: 'שיעור 11', icon: '📈', cx: 460, cy: 556, lectureId: 'moments-of-random-processes', part: 2 },
  { id: 'rpex', title: 'דוגמאות לת״מ', sub: 'שיעור 12', icon: '🌊', cx: 680, cy: 556, lectureId: 'linear-random-processes', part: 2 },
]

const EDGES: MapEdge[] = [
  { from: 'rv', to: 'mom' },
  { from: 'rv', to: 'func' },
  { from: 'mom', to: 'mvn' },
  { from: 'func', to: 'mvn' },
  { from: 'mvn', to: 'hyp' },
  { from: 'mvn', to: 'ml' },
  { from: 'ml', to: 'ls' },
  { from: 'hyp', to: 'bayes' },
  { from: 'ml', to: 'bayes' },
  { from: 'bayes', to: 'lbayes' },
  { from: 'ls', to: 'lbayes' },
  { from: 'mvn', to: 'rp' },
  { from: 'lbayes', to: 'rp' },
  { from: 'rp', to: 'rpmom' },
  { from: 'rpmom', to: 'rpex' },
]

// per-part colors (light fill + stroke) for live nodes; planned nodes are grey
const PART_FILL = ['#ecfdf5', '#eef2ff', '#fffbeb']
const PART_STROKE = ['#34d399', '#818cf8', '#fbbf24']
const PLANNED_FILL = '#f8fafc'
const PLANNED_STROKE = '#cbd5e1'

interface Step {
  title: string
  body: string
}
const STEPS: Step[] = [
  {
    title: 'חלק א׳ · משתנים מקריים ווקטורים',
    body: 'שפת ההסתברות: משתנה מקרי, המומנטים שלו (תוחלת, שונות ופונקציה אופיינית), פונקציות של משתנים, וההכללה הווקטורית — הנורמלי הרב-ממדי.',
  },
  {
    title: 'חלק ב׳ · גילוי ואמידה',
    body: 'בהינתן מדידות: מחליטים בין השערות (ניימן-פירסון), ומעריכים פרמטרים — נראות מרבית, ריבועים פחותים, והגישה הבייסיאנית (MMSE) על שני סוגיה.',
  },
  {
    title: 'חלק ג׳ · תהליכים מקריים',
    body: 'אות אקראי לאורך זמן: הגדרות, המומנטים שלו (מתאם עצמי וסטציונריות), ודוגמאות — תהליכים לינאריים ורעש.',
  },
]

const W = 920
const H = 610
const NW = 168
const NH = 48

export default function CourseMap() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { course } = useCourse()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const built = new Set(course.LECTURE_LIST.map((l) => l.id))

  useEffect(() => {
    if (!playing) return
    if (step >= STEPS.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 2600)
    return () => clearTimeout(t)
  }, [playing, step])

  const nodeOf = (id: string) => NODES.find((n) => n.id === id)!
  const shown = (n: MapNode) => n.part <= step
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
        <div className="mt-3 flex items-start gap-3 rounded-xl border-s-4 border-emerald-500 bg-emerald-50/70 p-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">{step + 1}</span>
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
              <marker id="mapArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M1,1 L6,4 L1,7" fill="none" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {/* edges */}
            {EDGES.map((e) => {
              if (!edgeShown(e)) return null
              return (
                <motion.path
                  key={`${e.from}-${e.to}`}
                  d={edgePath(e)}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                  markerEnd="url(#mapArrow)"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )
            })}

            {/* nodes */}
            <AnimatePresence>
              {NODES.filter(shown).map((n) => {
                const isBuilt = built.has(n.lectureId)
                return (
                  <motion.g
                    key={n.id}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
                    style={{ cursor: isBuilt ? 'pointer' : 'default' }}
                    onClick={() => isBuilt && navigate(lecturePath('statistics', n.lectureId))}
                  >
                    <rect
                      x={n.cx - NW / 2}
                      y={n.cy - NH / 2}
                      width={NW}
                      height={NH}
                      rx={10}
                      fill={isBuilt ? PART_FILL[n.part] : PLANNED_FILL}
                      stroke={isBuilt ? PART_STROKE[n.part] : PLANNED_STROKE}
                      strokeWidth={1.75}
                      strokeDasharray={isBuilt ? undefined : '5 4'}
                    />
                    <text x={n.cx - NW / 2 + 12} y={n.cy - 2} style={{ fontSize: 15 }}>{n.icon}</text>
                    <text x={n.cx + 12} y={n.cy - 3} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: isBuilt ? '#0f172a' : '#94a3b8' }}>{n.title}</text>
                    <text x={n.cx + 12} y={n.cy + 12} textAnchor="middle" style={{ fontSize: 8.5, fill: isBuilt ? '#475569' : '#cbd5e1' }}>
                      {n.sub}{isBuilt ? ' ✓' : ' · בקרוב'}
                    </text>
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>לחצו על נושא <b className="text-slate-500">שנלמד</b> כדי לקפוץ לשיעור</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded border border-emerald-400 bg-emerald-50" /> נלמד ✓</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded border border-dashed border-slate-300 bg-slate-50" /> בקרוב</span>
        </div>
      </div>
    </div>
  )
}
