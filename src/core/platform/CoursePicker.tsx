import { Link } from 'react-router-dom'
import { COURSES } from './courses'
import { coursePath } from './links'

/** The platform landing page: a menu of all courses (one site, one design). */
export default function CoursePicker() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
          🎬 לראות, לא לקרוא
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">הקורסים שלי</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500">
          אוסף הקורסים — ויזואליים, אינטראקטיביים, צעד אחר צעד. בחרו קורס כדי להתחיל.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <Link
            key={c.id}
            to={coursePath(c.id)}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-sky-100 opacity-60 transition group-hover:scale-125" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-slate-900">{c.titleHe}</h2>
              <p className="mt-1 font-mono text-sm text-slate-400">{c.subtitleEn}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                כניסה לקורס
                <span className="transition group-hover:-translate-x-1">←</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
