import { Link, Navigate, useParams } from 'react-router-dom'
import type { LearningMode, LectureModule } from '@/core/engine/types'
import { useCourse } from '@/core/platform/CourseProvider'
import { coursePath, lecturePath } from '@/core/platform/links'
import ModeSelector from './ModeSelector'
import GlossaryButton from '@/core/components/GlossaryButton'
import FormulasButton from '@/core/components/FormulasButton'
import SearchButton from '@/core/platform/SearchButton'
import GuidedMode from '@/core/modes/GuidedMode'
import SummaryMode from '@/core/modes/SummaryMode'

const VALID_MODES: LearningMode[] = ['guided', 'summary']

export default function LectureShell() {
  const { courseId, course } = useCourse()
  const { lectureId, mode } = useParams()
  const lecture = lectureId ? course.LECTURES[lectureId] : undefined

  if (!lecture) return <Navigate to={coursePath(courseId)} replace />

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
    return <Navigate to={lecturePath(courseId, lecture.id, { mode: 'guided' })} replace />
  }
  const active = mode as LearningMode

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <LectureHeader lecture={lecture} />

      <ModeSelector lecture={lecture} active={active} courseId={courseId} />

      <main>
        {/* key by lecture.id so state resets cleanly when navigating lecture→lecture */}
        {active === 'guided' && <GuidedMode key={lecture.id} lecture={lecture} />}
        {active === 'summary' && <SummaryMode key={lecture.id} lecture={lecture} />}
      </main>
    </div>
  )
}

const linkForLecture = (courseId: string, l: LectureModule) =>
  lecturePath(courseId, l.id, l.explainer ? undefined : { mode: 'guided' })

const NAV_PILL =
  'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'

function LectureHeader({ lecture }: { lecture: LectureModule }) {
  const { courseId, course } = useCourse()
  const list = course.LECTURE_LIST
  const idx = list.findIndex((l) => l.id === lecture.id)
  const prev = idx > 0 ? list[idx - 1] : undefined
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined
  const labelOf = (l: LectureModule) => `שיעור ${l.numberLabelHe ?? l.number} · ${l.titleHe}`

  return (
    <header className="no-print">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Link to={coursePath(courseId)} className={`${NAV_PILL} font-semibold`}>
          <span aria-hidden>←</span>
          כל השיעורים
        </Link>
        {prev && (
          <Link to={linkForLecture(courseId, prev)} title={labelOf(prev)} className={NAV_PILL}>
            <span aria-hidden>→</span>
            השיעור שעבר
          </Link>
        )}
        {next && (
          <Link to={linkForLecture(courseId, next)} title={labelOf(next)} className={NAV_PILL}>
            השיעור הבא
            <span aria-hidden>←</span>
          </Link>
        )}
        <span className="ms-auto flex flex-wrap gap-2">
          <SearchButton />
          {lecture.formulas && lecture.formulas.length > 0 && <FormulasButton formulas={lecture.formulas} />}
          {lecture.glossary && lecture.glossary.length > 0 && (
            <GlossaryButton terms={lecture.glossary} symbols={lecture.symbols} />
          )}
        </span>
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
