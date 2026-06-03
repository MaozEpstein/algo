import { Link } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { lecturePath, overviewPath } from './links'
import { OPEN_FORMULA_SHEET } from './types'

/** A course's landing page: the lecture grid (+ optional overview hub card). */
export default function CourseHome() {
  const { courseId, course } = useCourse()
  const { manifest, LECTURE_LIST, Overview, formulaSheet: hasFormulaSheet, syllabus: Syllabus } = course

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="text-center">
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <span aria-hidden>←</span>
          כל הקורסים
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {manifest.titleHe}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500">
          לא עוד קירות טקסט — כאן רואים את האלגוריתם רץ, צעד אחר צעד, עם הקוד שמתרחש לצידו.
          בחרו שיעור והתחילו.
        </p>
        {(Syllabus || hasFormulaSheet) && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Syllabus && <Syllabus />}
            {hasFormulaSheet && (
              // the modal itself lives in CourseProvider (so it's reachable from any
              // page); this button just asks it to open — same as pressing Ctrl+Shift+S
              <button
                onClick={() => window.dispatchEvent(new Event(OPEN_FORMULA_SHEET))}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-100"
              >
                <span aria-hidden>📄</span>
                דף נוסחאות
                <kbd className="ms-1 rounded border border-violet-200 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-violet-500" dir="ltr">
                  Ctrl+Shift+S
                </kbd>
              </button>
            )}
          </div>
        )}
      </header>

      {LECTURE_LIST.length === 0 && !Overview && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700">השיעורים יתווספו כאן בקרוב 🛠️</p>
          <p className="mt-1 text-slate-500">הקורס נפתח — התוכן עדיין בהכנה.</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Overview && (
          <Link
            to={overviewPath(courseId)}
            className="group relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-card transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
          >
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-violet-100 opacity-70 transition group-hover:scale-125" />
            <div className="relative">
              <span className="font-mono text-sm font-semibold text-violet-500">כללי</span>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">מבט-על · השוואות</h2>
              <p className="mt-0.5 font-mono text-sm text-slate-400">Overview &amp; Race</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-600">
                השוואות ומירוץ אלגוריתמים
                <span className="transition group-hover:-translate-x-1">←</span>
              </span>
            </div>
          </Link>
        )}

        {LECTURE_LIST.map((lec) => (
          <Link
            key={lec.id}
            to={lecturePath(courseId, lec.id, lec.explainer ? undefined : { mode: 'guided' })}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-sky-100 opacity-60 transition group-hover:scale-125" />
            <div className="relative">
              <span className="font-mono text-sm font-semibold text-sky-500">
                שיעור {lec.numberLabelHe ?? lec.number}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{lec.titleHe}</h2>
              <p className="mt-0.5 font-mono text-sm text-slate-400">{lec.subtitleEn}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                התחילו ללמוד
                <span className="transition group-hover:-translate-x-1">←</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
