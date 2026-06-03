import { Link } from 'react-router-dom'
import { COURSES } from './courses'
import { coursePath } from './links'

/** The site's eye mark (matches the favicon) — the brand logo. */
function EyeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="eye-iris" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#863bff" />
          <stop offset="1" stopColor="#47bfff" />
        </linearGradient>
      </defs>
      <path d="M3 24 C 12 9, 36 9, 45 24 C 36 39, 12 39, 3 24 Z" fill="none" stroke="#7c3aed" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="9.6" fill="url(#eye-iris)" />
      <circle cx="24" cy="24" r="4.4" fill="#1e1b4b" />
      <circle cx="20.4" cy="20.4" r="1.9" fill="#fff" />
    </svg>
  )
}

/** The platform landing page: a menu of all courses (one site, one design). */
export default function CoursePicker() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
          🎬 לראות, לא לקרוא
        </div>
        <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          <EyeMark className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
          הנדסה בעיניים
        </h1>
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
