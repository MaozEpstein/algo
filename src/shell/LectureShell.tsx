import { Link, Navigate, useParams } from 'react-router-dom'
import type { LearningMode } from '@/engine/types'
import { LECTURES } from '@/app/registry'
import ModeSelector from './ModeSelector'
import GuidedMode from '@/modes/GuidedMode'
import SummaryMode from '@/modes/SummaryMode'

const VALID_MODES: LearningMode[] = ['guided', 'summary']

export default function LectureShell() {
  const { lectureId, mode } = useParams()
  const lecture = lectureId ? LECTURES[lectureId] : undefined

  if (!lecture) return <Navigate to="/" replace />
  if (!mode || !VALID_MODES.includes(mode as LearningMode)) {
    return <Navigate to={`/lecture/${lecture.id}/guided`} replace />
  }
  const active = mode as LearningMode

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <header className="no-print flex items-center justify-between gap-4">
        <div>
          <Link to="/" className="text-sm text-slate-400 transition hover:text-slate-600">
            ← כל השיעורים
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            שיעור {lecture.number} · {lecture.titleHe}
            <span className="ms-2 font-mono text-base font-medium text-slate-400">
              {lecture.subtitleEn}
            </span>
          </h1>
        </div>
      </header>

      <ModeSelector lecture={lecture} active={active} />

      <main>
        {active === 'guided' && <GuidedMode lecture={lecture} />}
        {active === 'summary' && <SummaryMode lecture={lecture} />}
      </main>
    </div>
  )
}
