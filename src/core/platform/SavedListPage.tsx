import { Link } from 'react-router-dom'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import { useCourse } from './CourseProvider'
import { coursePath, lecturePath } from './links'
import { useSavedItems, type SavedKind, type SavedItem } from './savedItems'

const GROUPS: { kind: SavedKind; he: string; dot: string }[] = [
  { kind: 'symbol', he: 'משתנים', dot: 'bg-emerald-400' },
  { kind: 'concept', he: 'מושגים', dot: 'bg-violet-400' },
  { kind: 'formula', he: 'נוסחאות', dot: 'bg-sky-400' },
  { kind: 'note', he: 'קטעים שמורים', dot: 'bg-amber-400' },
]

/** The learner's saved list for a course — grouped, with deep-links back and remove. */
export default function SavedListPage() {
  const { courseId, course } = useCourse()
  const saved = useSavedItems()
  const items = saved.listByCourse(courseId)
  const titleOf = (lectureId: string) => course.LECTURES[lectureId]?.titleHe ?? lectureId

  const Row = ({ it }: { it: SavedItem }) => (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button onClick={() => saved.remove(it.id)} title="הסר" aria-label="הסר" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">✕</button>
      <Link to={lecturePath(courseId, it.lectureId, it.tab ? { tab: it.tab } : undefined)} className="group flex min-w-0 flex-1 items-start justify-between gap-3">
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            {it.kind === 'symbol' && it.tex ? (
              <span className="font-mono text-base text-slate-900" dir="ltr"><Tex>{it.tex}</Tex></span>
            ) : null}
            <span className="text-sm font-semibold text-slate-800"><RichText>{it.label}</RichText></span>
          </span>
          {it.kind === 'formula' && it.tex && <span className="overflow-x-auto" dir="ltr"><Tex>{it.tex}</Tex></span>}
          {it.kind === 'concept' && it.note && <span className="text-xs leading-relaxed text-slate-500"><RichText>{it.note}</RichText></span>}
        </span>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition group-hover:bg-sky-100 group-hover:text-sky-700">{titleOf(it.lectureId)}</span>
      </Link>
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="text-center">
        <Link to={coursePath(courseId)} className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700">
          <span aria-hidden>←</span> חזרה לקורס
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">⭐ רשימת הלמידה שלי</h1>
        <p className="mt-2 text-slate-500">{items.length > 0 ? `${items.length} פריטים שמורים` : 'עדיין לא שמרת פריטים.'}</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center text-slate-500">
          לחצו על ＋ ליד מושג, נוסחה, משתנה או בולט בשיעורים כדי לשמור אותו כאן.
        </div>
      ) : (
        GROUPS.map((g) => {
          const rows = items.filter((it) => it.kind === g.kind)
          if (rows.length === 0) return null
          return (
            <section key={g.kind} className="flex flex-col gap-2">
              <h2 className="flex items-center gap-2 px-1 text-sm font-bold text-slate-500">
                <span className={`h-2 w-2 rounded-full ${g.dot}`} />
                {g.he}
                <span className="rounded-full bg-slate-100 px-1.5 text-[11px] font-semibold text-slate-500">{rows.length}</span>
              </h2>
              {rows.map((it) => <Row key={it.id} it={it} />)}
            </section>
          )
        })
      )}
    </div>
  )
}
