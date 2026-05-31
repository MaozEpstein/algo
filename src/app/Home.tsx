import { Link } from 'react-router-dom'
import { LECTURE_LIST } from './registry'

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
          🎬 לראות אלגוריתמים בעיניים
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          מבני נתונים ומבוא לאלגוריתמים
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500">
          לא עוד קירות טקסט — כאן רואים את האלגוריתם רץ, צעד אחר צעד, עם הקוד שמתרחש לצידו.
          בחרו שיעור והתחילו.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LECTURE_LIST.map((lec) => (
          <Link
            key={lec.id}
            to={`/lecture/${lec.id}/guided`}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-sky-100 opacity-60 transition group-hover:scale-125" />
            <div className="relative">
              <span className="font-mono text-sm font-semibold text-sky-500">
                שיעור {lec.number}
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
