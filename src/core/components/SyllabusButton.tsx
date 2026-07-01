import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RichText from './RichText'

/**
 * A reusable course-roadmap (סילבוס) button + modal. Each course supplies its
 * own `lessons` list (in order) with a one-line summary per lesson or per part,
 * and a done / "בקרוב" status. Esc / backdrop closes it. The course's thin
 * Syllabus component just passes its data here.
 */
export interface SyllabusPart {
  label: string
  desc: string // may contain $…$ inline math (rendered via RichText)
  done?: boolean
}
export interface SyllabusLesson {
  n: string
  title: string
  done?: boolean
  /** One-line summary, used when the lesson has no sub-parts. */
  desc?: string
  /** Sub-parts (e.g. חלק א׳/ב׳); when present, shown instead of `desc`. */
  parts?: SyllabusPart[]
}

export default function SyllabusButton({ lessons }: { lessons: SyllabusLesson[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-100"
      >
        <span aria-hidden>📚</span>
        סילבוס
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="max-h-[88vh] w-full max-w-6xl overflow-auto rounded-3xl bg-slate-50 shadow-2xl"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-sky-100 bg-gradient-to-l from-sky-50 to-white px-6 py-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📚</span>
                  סילבוס — מפת הקורס
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600"
                  aria-label="סגירה"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 items-start gap-4 p-6 lg:grid-cols-2">
                {lessons.map((lesson) => (
                  <div key={lesson.n + lesson.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">{lesson.n}</span>
                      <h4 className="text-lg font-bold text-slate-900">{lesson.title}</h4>
                    </div>

                    {lesson.parts ? (
                      <ul className="mt-1 flex flex-col gap-2 leading-relaxed">
                        {lesson.parts.map((part) => (
                          <li key={part.label}>
                            <span className="font-semibold text-slate-800">{part.label}</span>
                            <span className="text-slate-400"> — </span>
                            <span className="text-sm text-slate-600">
                              <RichText>{part.desc}</RichText>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      lesson.desc && (
                        <p className="text-sm leading-relaxed text-slate-600">
                          <RichText>{lesson.desc}</RichText>
                        </p>
                      )
                    )}
                  </div>
                ))}
                <p className="text-center text-xs text-slate-400 lg:col-span-2">הסילבוס יתעדכן עם הוספת כל שיעור / חלק.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
