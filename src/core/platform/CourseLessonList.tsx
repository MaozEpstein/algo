import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { LectureModule } from '@/core/engine/types'
import { lecturePath, overviewPath } from './links'
import { paletteFor, type Palette } from './lessonPalette'
import { useProgress, cycleStatus, STATUS_META, type Status } from './progress'
import { useExpandedLessons, toggleLessonExpand } from './lessonCollapse'
import { usePrefs } from './prefs'

interface Props {
  courseId: string
  lectures: LectureModule[]
  hasOverview: boolean
  progressOn: boolean
}

interface Group {
  n: number
  name: string
  parts: LectureModule[]
}

/** Strip the lesson-name prefix from a part title so the row reads crisply under the group header. */
function partTitle(lec: LectureModule): string {
  if (lec.lessonHe && lec.titleHe.startsWith(lec.lessonHe)) {
    return lec.titleHe.slice(lec.lessonHe.length).replace(/^\s*[—–-]\s*/, '') || lec.titleHe
  }
  return lec.titleHe
}

/**
 * Derived status of a whole lesson from its parts: all-same → that status; any progress but mixed
 * → 'learning' (in progress); none set → undefined. (e.g. both learning → learning, both done → done.)
 */
function lessonStatus(parts: LectureModule[], getStatus: (id: string) => Status | undefined): Status | undefined {
  const sts = parts.map((p) => getStatus(p.id))
  if (sts.every((s) => s === undefined)) return undefined
  const all = (v: Status) => sts.every((s) => s === v)
  if (all('done')) return 'done'
  if (all('review')) return 'review'
  if (all('learning')) return 'learning'
  return 'learning' // mixed / partial → in progress
}

/** The collapsible "lesson → parts" list view of a course home (alternative to the card grid). */
export default function CourseLessonList({ courseId, lectures, hasOverview, progressOn }: Props) {
  const progress = useProgress(courseId)
  const expanded = useExpandedLessons(courseId)
  const reduce = usePrefs().reduceMotion

  const groups: Group[] = []
  for (const lec of lectures) {
    const n = Math.floor(lec.number)
    let g = groups.find((x) => x.n === n)
    if (!g) {
      g = { n, name: lec.lessonHe ?? lec.titleHe, parts: [] }
      groups.push(g)
    }
    g.parts.push(lec)
  }

  return (
    <div className="flex flex-col gap-3.5">
      {hasOverview && (
        <Link
          to={overviewPath(courseId)}
          className="group flex items-center gap-4 rounded-3xl border border-violet-200 bg-gradient-to-l from-violet-50/60 to-white px-4 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-100 text-lg font-extrabold text-violet-500 ring-1 ring-inset ring-violet-200" aria-hidden>★</span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-slate-900">מבט-על · השוואות</h2>
            <p className="mt-0.5 truncate font-mono text-xs text-slate-400">Overview &amp; Race</p>
          </div>
          <span className="text-lg text-violet-300 transition group-hover:-translate-x-1">←</span>
        </Link>
      )}

      {groups.map((g) => (
        <LessonRow
          key={g.n}
          group={g}
          courseId={courseId}
          palette={paletteFor(g.n)}
          open={expanded.includes(g.n)}
          onToggle={() => toggleLessonExpand(courseId, g.n)}
          progressOn={progressOn}
          getStatus={(id) => (progressOn ? progress.get(id) : undefined)}
          setStatus={(id, s) => progress.set(id, s)}
          reduce={reduce}
        />
      ))}
    </div>
  )
}

interface RowProps {
  group: Group
  courseId: string
  palette: Palette
  open: boolean
  onToggle: () => void
  progressOn: boolean
  getStatus: (id: string) => Status | undefined
  setStatus: (id: string, s: Status | undefined) => void
  reduce: boolean
}

/** Small read-only status pill (icon + label). */
function StatusPill({ st }: { st: Status }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_META[st].chip}`}>
      <span aria-hidden>{STATUS_META[st].icon}</span>
      {STATUS_META[st].he}
    </span>
  )
}

function LessonRow({ group, courseId, palette: c, open, onToggle, progressOn, getStatus, setStatus, reduce }: RowProps) {
  const { n, name, parts } = group
  const linkOf = (lec: LectureModule) => lecturePath(courseId, lec.id, lec.explainer ? undefined : { mode: 'guided' })

  const Badge = () => (
    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl font-extrabold ring-1 ring-inset ${c.circle} ${c.label} ${c.ring}`} aria-hidden>{n}</span>
  )

  // clickable status chip (cycles on click) for an individual part / single lesson
  const StatusChip = ({ id }: { id: string }) => {
    if (!progressOn) return null
    const st = getStatus(id)
    return (
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setStatus(id, cycleStatus(st))
        }}
        title={st ? `סטטוס: ${STATUS_META[st].he} (לחצו לשינוי)` : 'סמנו סטטוס'}
        aria-label="סטטוס למידה"
        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold transition hover:scale-105 ${st ? STATUS_META[st].chip : 'bg-white text-slate-400 ring-1 ring-slate-200'}`}
      >
        <span aria-hidden>{st ? STATUS_META[st].icon : '○'}</span>
      </button>
    )
  }

  // single-part lesson → one clean clickable row (no accordion)
  if (parts.length === 1) {
    const lec = parts[0]
    return (
      <Link
        to={linkOf(lec)}
        className={`group flex items-center gap-4 rounded-3xl border bg-gradient-to-l ${c.grad} to-white px-4 py-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${c.border} ${c.hoverBorder}`}
      >
        <Badge />
        <div className="min-w-0 flex-1">
          <span className={`font-mono text-xs font-semibold ${c.label}`}>שיעור {lec.numberLabelHe ?? n}</span>
          <h2 className="truncate text-lg font-bold text-slate-900">{lec.titleHe}</h2>
          <p className="truncate font-mono text-xs text-slate-400">{lec.subtitleEn}</p>
        </div>
        <StatusChip id={lec.id} />
        <span className={`text-lg transition group-hover:-translate-x-1 ${c.cta}`}>←</span>
      </Link>
    )
  }

  // multi-part lesson → accordion
  const agg = progressOn ? lessonStatus(parts, getStatus) : undefined
  return (
    <div className={`overflow-hidden rounded-3xl border bg-gradient-to-l ${c.grad} to-white shadow-card transition ${c.border} ${open ? '' : c.hoverBorder}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-4 text-start transition hover:bg-white/40"
      >
        <Badge />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-slate-900">{name}</h2>
            <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">{parts.length} חלקים</span>
            {agg && <StatusPill st={agg} />}
          </div>
          <p className="mt-0.5 font-mono text-xs text-slate-400">שיעור {n}</p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="mx-2 mb-2 overflow-hidden rounded-2xl bg-white/70 ring-1 ring-slate-100">
              {parts.map((lec) => (
                <li key={lec.id} className="border-b border-slate-100 last:border-b-0">
                  <Link to={linkOf(lec)} className={`group flex items-center gap-3 px-4 py-3 transition ${c.row}`}>
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 self-start rounded-full ${c.bar}`} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <span className={`font-mono text-xs font-semibold ${c.label}`}>{lec.numberLabelHe ?? lec.number}</span>
                      <p className="truncate font-semibold text-slate-800">{partTitle(lec)}</p>
                      <p className="truncate font-mono text-xs text-slate-400">{lec.subtitleEn}</p>
                    </div>
                    <StatusChip id={lec.id} />
                    <span className={`transition group-hover:-translate-x-1 ${c.cta}`}>←</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
