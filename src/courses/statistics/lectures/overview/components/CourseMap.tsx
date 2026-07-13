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

/** Exam-importance tier (from the solution analysis): 3=must, 2=important, 1=foundation. */
type Tier = 1 | 2 | 3

interface MapNode {
  id: string
  title: string
  sub: string
  icon: string
  cx: number
  cy: number
  lectureId: string
  part: Part
  /** Weight in the exams. */
  tier: Tier
  /** One-line exam-importance note (shown in the focus-mode tooltip). */
  examInfoHe: string
}
interface MapEdge {
  from: string
  to: string
}

export const NODES: MapNode[] = [
  // חלק א׳ — משתנים מקריים ווקטורים
  { id: 'rv', title: 'משתנים מקריים', sub: 'שיעור 1', icon: '🎲', cx: 460, cy: 52, lectureId: 'random-variables', part: 0, tier: 1, examInfoHe: 'המנוע — Bayes, התניה, פואסון/גאומטרי. משמש כמעט בכל שאלה, אך נדיר כשאלה עצמאית.' },
  { id: 'mom', title: 'מומנטים', sub: 'שיעור 2', icon: '📊', cx: 300, cy: 150, lectureId: 'moments', part: 0, tier: 1, examInfoHe: 'עמוד השדרה — שלב 1 של כל מתכון (E, Var, Cov, φ). נדיר כשאלה שלמה.' },
  { id: 'func', title: 'פונקציות של מ״מ', sub: 'שיעור 3', icon: '🔀', cx: 620, cy: 150, lectureId: 'functions-of-rvs', part: 0, tier: 1, examInfoHe: 'נקודתי — טרנספורמציות (X², X³, אינדיקטורים, יעקוביאן). מופיע מדי פעם.' },
  { id: 'mvn', title: 'נורמלי רב-ממדי', sub: 'שיעור 4', icon: '🧭', cx: 460, cy: 248, lectureId: 'multivariate-normal', part: 0, tier: 2, examInfoHe: 'המנוע של T3/T4 — תוחלת מותנית גאוסית. מאפשר, כמעט לא נבחן ישירות.' },
  // חלק ב׳ — גילוי ואמידה
  { id: 'hyp', title: 'בדיקת השערות', sub: 'שיעור 5', icon: '⚖️', cx: 180, cy: 350, lectureId: 'hypothesis-testing', part: 1, tier: 3, examInfoHe: 'T5 · גילוי — 6 שאלות עצמאיות (LRT + P_D/P_FA + GLRT).' },
  { id: 'ml', title: 'נראות מרבית', sub: 'שיעור 6', icon: '🎯', cx: 460, cy: 350, lectureId: 'maximum-likelihood', part: 1, tier: 2, examInfoHe: 'T1 · נראות מרבית — 6 שאלות + חלקי ML בתוך T2/T4.' },
  { id: 'ls', title: 'ריבועים פחותים', sub: 'שיעור 7', icon: '📏', cx: 745, cy: 350, lectureId: 'least-squares', part: 1, tier: 2, examInfoHe: 'T2 · מודל לינארי — 5 שאלות (ML/LS/BLUE).' },
  { id: 'bayes', title: 'סטטיסטיקה בייסיאנית', sub: 'שיעור 8', icon: '🔁', cx: 320, cy: 452, lectureId: 'bayesian-statistics', part: 1, tier: 3, examInfoHe: 'T3 · בייסיאני — 11 שאלות, הקלאסטר הכי גדול. כמעט בכל מבחן.' },
  { id: 'lbayes', title: 'אמידה בייסיאנית לינארית', sub: 'שיעור 9', icon: '📐', cx: 620, cy: 452, lectureId: 'linear-bayesian-estimation', part: 1, tier: 3, examInfoHe: 'LMMSE — הנוסחה הכי שמישה, ~15 שאלות (T3 + prior של T2 + ניבוי T4).' },
  // חלק ג׳ — תהליכים מקריים
  { id: 'rp', title: 'תהליכים מקריים', sub: 'שיעור 10', icon: '〰️', cx: 250, cy: 556, lectureId: 'random-processes', part: 2, tier: 3, examInfoHe: 'T4 · תהליכים מקריים — 10 שאלות. שאלת Q3 כמעט בכל מבחן.' },
  { id: 'rpmom', title: 'מומנטים של ת״מ', sub: 'שיעור 11', icon: '📈', cx: 460, cy: 556, lectureId: 'moments-of-random-processes', part: 2, tier: 3, examInfoHe: 'ליבת T4 — אוטו-קורלציה, WSS, ניבוי. חלק מ-10 שאלות התהליכים.' },
  { id: 'rpex', title: 'דוגמאות לת״מ', sub: 'שיעור 12', icon: '🌊', cx: 680, cy: 556, lectureId: 'linear-random-processes', part: 2, tier: 2, examInfoHe: 'AR / וינר / קלמן — צומח; 2025 בשני המועדים (~5 שאלות).' },
]

/** Per-tier label + dots + accent for the exam-focus overlay. */
const TIER_META: Record<Tier, { he: string; dots: string; chip: string; dot: string }> = {
  3: { he: 'חובה למבחן', dots: '●●●', chip: 'bg-rose-100 text-rose-700 ring-rose-200', dot: '#f43f5e' },
  2: { he: 'חשוב', dots: '●●', chip: 'bg-amber-100 text-amber-700 ring-amber-200', dot: '#f59e0b' },
  1: { he: 'תשתית', dots: '●', chip: 'bg-slate-100 text-slate-600 ring-slate-200', dot: '#94a3b8' },
}

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
  const [examFocus, setExamFocus] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
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
            <button
              onClick={() => { setExamFocus((v) => !v); if (!examFocus) setStep(STEPS.length - 1) }}
              aria-pressed={examFocus}
              title="הדגשת השיעורים לפי משקלם במבחנים"
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${examFocus ? 'bg-rose-500 text-white shadow hover:bg-rose-600' : 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
            >🎯 מיקוד למבחן</button>
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
        {examFocus && (
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
            <span className="font-semibold text-slate-500">חשיבות למבחן:</span>
            {([3, 2, 1] as const).map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-slate-500">
                <span style={{ color: TIER_META[t].dot }}>{TIER_META[t].dots}</span> {TIER_META[t].he}
              </span>
            ))}
            <span className="text-slate-400">· עמדו על שיעור למידע</span>
          </div>
        )}
        <div className="relative mx-auto w-full" style={{ maxWidth: W }} dir="ltr">
          <svg viewBox={`0 0 ${W} ${H}`} className="ltr block w-full">
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
                const dim = examFocus ? (n.tier === 3 ? 1 : n.tier === 2 ? 0.82 : 0.42) : 1
                const hot = examFocus && n.tier === 3
                return (
                  <motion.g
                    key={n.id}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: dim, scale: 1 }}
                    transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
                    style={{ cursor: isBuilt ? 'pointer' : 'default' }}
                    onClick={() => isBuilt && navigate(lecturePath('statistics', n.lectureId))}
                    onMouseEnter={() => examFocus && setHoverId(n.id)}
                    onMouseLeave={() => examFocus && setHoverId(null)}
                  >
                    <rect
                      x={n.cx - NW / 2}
                      y={n.cy - NH / 2}
                      width={NW}
                      height={NH}
                      rx={10}
                      fill={isBuilt ? PART_FILL[n.part] : PLANNED_FILL}
                      stroke={hot ? TIER_META[3].dot : isBuilt ? PART_STROKE[n.part] : PLANNED_STROKE}
                      strokeWidth={hot ? 2.75 : 1.75}
                      strokeDasharray={isBuilt ? undefined : '5 4'}
                    />
                    <text x={n.cx - NW / 2 + 12} y={n.cy - 2} style={{ fontSize: 15 }}>{n.icon}</text>
                    <text x={n.cx + 12} y={n.cy - 3} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: isBuilt ? '#0f172a' : '#94a3b8' }}>{n.title}</text>
                    <text x={n.cx + 12} y={n.cy + 12} textAnchor="middle" style={{ fontSize: 8.5, fill: isBuilt ? '#475569' : '#cbd5e1' }}>
                      {n.sub}{isBuilt ? ' ✓' : ' · בקרוב'}
                    </text>
                    {/* tier dots badge (focus mode) */}
                    {examFocus && Array.from({ length: n.tier }, (_, di) => (
                      <circle key={di} cx={n.cx + NW / 2 - 9 - di * 8} cy={n.cy - NH / 2 + 9} r={3} fill={TIER_META[n.tier].dot} />
                    ))}
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>

          {/* exam-importance tooltip (focus mode, hover) */}
          {examFocus && hoverId && (() => {
            const n = nodeOf(hoverId)
            const below = n.cy < 150
            return (
              <div
                className={`pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-right shadow-xl ${below ? 'translate-y-2' : '-translate-y-full'}`}
                style={{ left: `${(n.cx / W) * 100}%`, top: `${((below ? n.cy + NH / 2 : n.cy - NH / 2) / H) * 100}%`, marginTop: below ? 0 : -8 }}
                dir="rtl"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-800">{n.title}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${TIER_META[n.tier].chip}`}>
                    <span style={{ color: TIER_META[n.tier].dot }}>{TIER_META[n.tier].dots}</span> {TIER_META[n.tier].he}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">{n.examInfoHe}</p>
              </div>
            )
          })()}
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
