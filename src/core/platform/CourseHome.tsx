import { Link } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { lecturePath, overviewPath, savedListPath } from './links'
import { OPEN_FORMULA_SHEET, OPEN_CALCULATOR, OPEN_CONSTANTS } from './types'
import { useFeature } from './features'
import { useProgress, summarize, cycleStatus, STATUS_META, type Status } from './progress'
import { useSavedItems } from './savedItems'
import SettingsButton from './SettingsButton'
import { paletteFor } from './lessonPalette'
import { usePrefs, setPref, useContentWidthClass } from './prefs'
import CourseLessonList from './CourseLessonList'

/** A course's landing page: the lecture grid or collapsible list (+ optional overview hub). */
export default function CourseHome() {
  const { courseId, course } = useCourse()
  const { manifest, LECTURE_LIST, Overview, formulaSheet: hasFormulaSheet, syllabus: Syllabus, calculator: hasCalculator, constants: hasConstants } = course
  const progressOn = useFeature('progress')
  const savedOn = useFeature('savedList')
  const progress = useProgress(courseId)
  const summary = summarize(progress.map, LECTURE_LIST.map((l) => l.id))
  const savedCount = useSavedItems().listByCourse(courseId).length
  const homeView = usePrefs().homeView
  const widthClass = useContentWidthClass()

  return (
    <div className={`mx-auto flex w-full ${widthClass} flex-col gap-10 px-4 py-12 sm:px-6`}>
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
          לא עוד קירות טקסט — כאן רואים את החומר קורה ומבינים אותו, צעד אחר צעד.
          בחרו שיעור והתחילו.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Syllabus && <Syllabus />}
          {hasFormulaSheet && (
            // the modal itself lives in CourseProvider (so it's reachable from any
            // page); this button just asks it to open — same as pressing Ctrl+Shift+S
            <button
              onClick={() => window.dispatchEvent(new Event(OPEN_FORMULA_SHEET))}
              title="דף נוסחאות · Ctrl+Shift+S"
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-100"
            >
              <span aria-hidden>📄</span>
              דף נוסחאות
            </button>
          )}
          {hasCalculator && (
            <button
              onClick={() => window.dispatchEvent(new Event(OPEN_CALCULATOR))}
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              <span aria-hidden>🧮</span>
              מחשבון
            </button>
          )}
          {hasConstants && (
            <button
              onClick={() => window.dispatchEvent(new Event(OPEN_CONSTANTS))}
              title="קבועים · Ctrl+Shift+C"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              <span aria-hidden>📌</span>
              קבועים
            </button>
          )}
          {savedOn && (
            <Link
              to={savedListPath(courseId)}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-100"
            >
              <span aria-hidden>⭐</span>
              רשימת הלמידה שלי
              {savedCount > 0 && <span className="rounded-full bg-amber-200 px-1.5 text-[11px] font-bold text-amber-800">{savedCount}</span>}
            </Link>
          )}
          <SettingsButton />
          <div className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5 shadow-sm" role="group" aria-label="תצוגת שיעורים">
            {([
              { v: 'cards', icon: '▦', label: 'תצוגת כרטיסים' },
              { v: 'list', icon: '☰', label: 'תצוגת רשימה' },
            ] as const).map((o) => (
              <button
                key={o.v}
                onClick={() => setPref('homeView', o.v)}
                aria-pressed={homeView === o.v}
                title={o.label}
                className={`grid h-8 w-8 place-items-center rounded-full text-sm transition ${homeView === o.v ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              >
                <span aria-hidden>{o.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {progressOn && summary.total > 0 && (
          <div className="mx-auto mt-5 max-w-md">
            <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-500">
              <span>ההתקדמות שלי</span>
              <span>{summary.done}/{summary.total} נלמדו</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${summary.total ? (summary.done / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
        )}
      </header>

      {LECTURE_LIST.length === 0 && !Overview && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700">השיעורים יתווספו כאן בקרוב 🛠️</p>
          <p className="mt-1 text-slate-500">הקורס נפתח — התוכן עדיין בהכנה.</p>
        </div>
      )}

      {homeView === 'list' ? (
        <CourseLessonList courseId={courseId} lectures={LECTURE_LIST} hasOverview={!!Overview} progressOn={progressOn} />
      ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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

        {LECTURE_LIST.map((lec) => {
          const c = paletteFor(lec.number)
          const st: Status | undefined = progressOn ? progress.get(lec.id) : undefined
          return (
            <Link
              key={lec.id}
              to={lecturePath(courseId, lec.id, lec.explainer ? undefined : { mode: 'guided' })}
              className={`group relative overflow-hidden rounded-3xl border p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg ${c.card} ${st ? `ring-2 ${STATUS_META[st].ring}` : ''}`}
            >
              <div className={`absolute -left-8 -top-8 h-24 w-24 rounded-full opacity-60 transition group-hover:scale-125 ${c.circle}`} />
              {progressOn && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    progress.set(lec.id, cycleStatus(st))
                  }}
                  title={st ? `סטטוס: ${STATUS_META[st].he} (לחצו לשינוי)` : 'סמנו סטטוס'}
                  aria-label="סטטוס למידה"
                  className={`absolute end-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold transition hover:scale-105 ${st ? STATUS_META[st].chip : 'bg-white/80 text-slate-400 ring-1 ring-slate-200'}`}
                >
                  <span aria-hidden>{st ? STATUS_META[st].icon : '○'}</span>
                  {st && <span>{STATUS_META[st].he}</span>}
                </button>
              )}
              <div className="relative">
                <span className={`font-mono text-sm font-semibold ${c.label}`}>
                  שיעור {lec.numberLabelHe ?? lec.number}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{lec.titleHe}</h2>
                <p className="mt-0.5 font-mono text-sm text-slate-400">{lec.subtitleEn}</p>
                <span className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${c.cta}`}>
                  התחילו ללמוד
                  <span className="transition group-hover:-translate-x-1">←</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>
      )}
    </div>
  )
}
