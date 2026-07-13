import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { coursePath, examViewPath } from './links'
import type { ExamEntry } from './types'

/**
 * The exam-bank gallery (/c/<course>/exams): a designed grid of past-exam cards,
 * filterable by year. Each card links to the full-screen source-PDF viewer.
 * Reads the exams from the course module (course.exams).
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
  const [year, setYear] = useState<number | 'all'>('all')

  const years = useMemo(() => [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a), [exams])
  const shown = year === 'all' ? exams : exams.filter((e) => e.year === year)

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
      </header>

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
          {shown.map((e) => (
            <Link
              key={e.id}
              to={examViewPath(courseId, e.id)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-4xl font-black tracking-tight text-slate-800 transition group-hover:text-emerald-700">{e.year}</div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${MOED_CHIP[e.moed]}`}>
                  {MOED_LABEL[e.moed]}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                {e.solutionFile ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    <span aria-hidden className="text-emerald-600">✓</span> כולל פתרון
                  </span>
                ) : <span />}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition group-hover:text-emerald-600">
                  פתיחה <span aria-hidden className="transition group-hover:translate-x-[-2px]">←</span>
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-emerald-400 transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      )}
    </div>
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
