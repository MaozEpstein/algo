import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GlossaryTerm } from '@/core/engine/types'
import Tex from './Tex'
import RichText from './RichText'

/**
 * A header button that opens a modal gathering all of a lecture's foundational
 * concepts (term → short explanation, with optional inline/block math). Shown for
 * any lecture that defines a `glossary`. Esc / backdrop closes it.
 */
export default function GlossaryButton({ terms }: { terms: GlossaryTerm[] }) {
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
        className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-100"
      >
        <span aria-hidden>📖</span>
        מושגי יסוד
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
              className="max-h-[85vh] w-full max-w-5xl overflow-auto rounded-3xl bg-slate-50 shadow-2xl"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-violet-100 bg-gradient-to-l from-violet-50 to-white px-6 py-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📖</span>
                  מושגי יסוד
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                    {terms.length}
                  </span>
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600"
                  aria-label="סגירה"
                >
                  ✕
                </button>
              </div>

              {/* term cards */}
              <dl className="grid gap-3 p-6 sm:grid-cols-2">
                {terms.map((t) => (
                  <div
                    key={t.term}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                  >
                    <dt className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400 transition group-hover:scale-150" />
                      <span>
                        <RichText>{t.term}</RichText>
                      </span>
                    </dt>
                    <dd className="mt-1.5 ps-4 text-sm leading-relaxed text-slate-600">
                      <RichText>{t.def}</RichText>
                    </dd>
                    {t.tex && (
                      <dd className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-center">
                        <Tex block>{t.tex}</Tex>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
