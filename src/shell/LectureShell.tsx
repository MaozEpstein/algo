import { Link, Navigate, useParams } from 'react-router-dom'
import type { LearningMode, LectureModule } from '@/engine/types'
import { LECTURES, LECTURE_LIST } from '@/app/registry'
import ModeSelector from './ModeSelector'
import GuidedMode from '@/modes/GuidedMode'
import SummaryMode from '@/modes/SummaryMode'

const VALID_MODES: LearningMode[] = ['guided', 'summary']

export default function LectureShell() {
  const { lectureId, mode } = useParams()
  const lecture = lectureId ? LECTURES[lectureId] : undefined

  if (!lecture) return <Navigate to="/" replace />

  // An "explainer" lecture (e.g. recurrence relations) is not a runnable
  // algorithm — it renders its own tabbed page from the `summary` slot, with no
  // mode tabs and no guided player.
  const Content = lecture.summary
  if (lecture.explainer) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
        <LectureHeader lecture={lecture} />
        <main>
          <Content />
        </main>
      </div>
    )
  }

  if (!mode || !VALID_MODES.includes(mode as LearningMode)) {
    return <Navigate to={`/lecture/${lecture.id}/guided`} replace />
  }
  const active = mode as LearningMode

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <LectureHeader lecture={lecture} />

      <ModeSelector lecture={lecture} active={active} />

      <main>
        {/* key by lecture.id so state resets cleanly when navigating lecture→lecture */}
        {active === 'guided' && <GuidedMode key={lecture.id} lecture={lecture} />}
        {active === 'summary' && <SummaryMode key={lecture.id} lecture={lecture} />}
      </main>
    </div>
  )
}

const linkForLecture = (l: LectureModule) =>
  l.explainer ? `/lecture/${l.id}` : `/lecture/${l.id}/guided`

const NAV_PILL =
  'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'

function LectureHeader({ lecture }: { lecture: LectureModule }) {
  const idx = LECTURE_LIST.findIndex((l) => l.id === lecture.id)
  const prev = idx > 0 ? LECTURE_LIST[idx - 1] : undefined
  const next = idx >= 0 && idx < LECTURE_LIST.length - 1 ? LECTURE_LIST[idx + 1] : undefined
  const labelOf = (l: LectureModule) => `שיעור ${l.numberLabelHe ?? l.number} · ${l.titleHe}`

  return (
    <header className="no-print">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Link to="/" className={`${NAV_PILL} font-semibold`}>
          <span aria-hidden>←</span>
          כל השיעורים
        </Link>
        {prev && (
          <Link to={linkForLecture(prev)} title={labelOf(prev)} className={NAV_PILL}>
            <span aria-hidden>→</span>
            השיעור שעבר
          </Link>
        )}
        {next && (
          <Link to={linkForLecture(next)} title={labelOf(next)} className={NAV_PILL}>
            השיעור הבא
            <span aria-hidden>←</span>
          </Link>
        )}
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        שיעור {lecture.numberLabelHe ?? lecture.number} · {lecture.titleHe}
        <span className="ms-2 font-mono text-base font-medium text-slate-400">
          {lecture.subtitleEn}
        </span>
      </h1>
    </header>
  )
}
