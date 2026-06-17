import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * A small button that reveals a derivation/proof in a modal (so the tab stays scannable).
 * Same modal idiom as SourceSketch: Esc / click-outside close. The proof content (KaTeX etc.)
 * is passed as children.
 */
export default function ProofModal({ title, label = 'הצג הוכחה', children }: { title: string; label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
      >
        <span aria-hidden>📐</span> {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-indigo-100 bg-gradient-to-l from-indigo-50 to-white px-6 py-3">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📐</span>
                  {title}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="סגירה"
                >
                  ✕
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-6 py-5 leading-relaxed text-slate-700" dir="rtl">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
