import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { coursePath, examViewPath, revisionViewPath } from './links'
import { useFeature } from './features'
import { useProgress, cycleStatus, summarize, STATUS_META, type Status } from './progress'
import type { ExamEntry } from './types'

/**
 * The exam-bank gallery (/c/<course>/exams): a designed grid of past-exam cards,
 * filterable by year, with per-exam learning-status tracking (בלמידה / סיימתי /
 * לחזרה) that reuses the same progress store as the lessons. Each card links to
 * the full-screen source-PDF viewer.
 */

const MOED_LABEL: Record<ExamEntry['moed'], string> = { a: 'מועד א׳', b: 'מועד ב׳', c: 'מועד ג׳', s: 'מועד מיוחד' }
const MOED_CHIP: Record<ExamEntry['moed'], string> = {
  a: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  b: 'bg-sky-100 text-sky-700 ring-sky-200',
  c: 'bg-violet-100 text-violet-700 ring-violet-200',
  s: 'bg-amber-100 text-amber-700 ring-amber-200',
}

export default function ExamsBank() {
  const { courseId, course } = useCourse()
  const exams = course.exams ?? []
  const revision = course.revision ?? []
  const [year, setYear] = useState<number | 'all'>('all')
  const progressOn = useFeature('progress')
  const progress = useProgress(courseId)

  const years = useMemo(() => [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a), [exams])
  const shown = year === 'all' ? exams : exams.filter((e) => e.year === year)
  const summary = summarize(progress.map, exams.map((e) => e.id))

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="text-center">
        <Link
          to={coursePath(courseId)}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <span aria-hidden>→</span> חזרה לקורס
        </Link>
        <h1 className="flex items-center justify-center gap-2 text-3xl font-black text-slate-900">
          <span aria-hidden>📄</span> בנק מבחנים
        </h1>
        <p className="mt-2 leading-relaxed text-slate-500">
          מבחני עבר עם פתרונות — נפתחים כקובץ המקור המלא. {exams.length} מבחנים.
        </p>

        {progressOn && summary.total > 0 && (
          <div className="mx-auto mt-5 max-w-md">
            <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-500">
              <span>סיימתי</span>
              <span>{summary.done}/{summary.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(summary.done / summary.total) * 100}%` }} />
            </div>
          </div>
        )}
      </header>

      {revision.length > 0 && (
        <section className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-indigo-800">
            <span aria-hidden>📝</span> שאלות חזרה של המרצה
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {revision.map((d) => (
              <Link
                key={d.id}
                to={revisionViewPath(courseId, d.id)}
                className="group flex items-center gap-3 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-lg text-indigo-600 ring-1 ring-inset ring-indigo-200" aria-hidden>📝</span>
                <span className="min-w-0 flex-1 text-sm font-bold text-slate-700">{d.titleHe}</span>
                <span className="shrink-0 text-sm font-semibold text-indigo-400 transition group-hover:text-indigo-600">←</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {years.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          <FilterChip active={year === 'all'} onClick={() => setYear('all')}>הכל</FilterChip>
          {years.map((y) => (
            <FilterChip key={y} active={year === y} onClick={() => setYear(y)}>{y}</FilterChip>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center text-slate-500">
          אין מבחנים להצגה.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => {
            const st = progressOn ? progress.get(e.id) : undefined
            return (
              <Link
                key={e.id}
                to={examViewPath(courseId, e.id)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${
                  st ? `border-transparent ring-2 ${STATUS_META[st].ring}` : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-4xl font-black tracking-tight text-slate-800 transition group-hover:text-emerald-700">{e.year}</div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${MOED_CHIP[e.moed]}`}>
                    {MOED_LABEL[e.moed]}
                  </span>
                </div>

                {e.solutionFile && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                      <span aria-hidden className="text-emerald-600">✓</span> כולל פתרון
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  {progressOn ? (
                    <StatusButton status={st} onCycle={() => progress.set(e.id, cycleStatus(st))} />
                  ) : <span />}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition group-hover:text-emerald-600">
                    פתיחה <span aria-hidden className="transition group-hover:translate-x-[-2px]">←</span>
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-emerald-400 transition-transform group-hover:scale-x-100" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** A status cycle button living inside the card Link — clicking it toggles status, not navigation. */
function StatusButton({ status, onCycle }: { status: Status | undefined; onCycle: () => void }) {
  const handle = (ev: React.MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    onCycle()
  }
  if (!status) {
    return (
      <button onClick={handle} className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-400 transition hover:border-slate-400 hover:text-slate-600">
        <span aria-hidden>＋</span> סמן
      </button>
    )
  }
  return (
    <button onClick={handle} title="לחצו לשינוי הסטטוס" className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition hover:brightness-95 ${STATUS_META[status].chip}`}>
      <span aria-hidden>{STATUS_META[status].icon}</span>
      {STATUS_META[status].he}
    </button>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active ? 'bg-slate-800 text-white shadow' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}
