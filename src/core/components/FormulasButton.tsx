import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FormulaItem } from '@/core/engine/types'
import Tex from './Tex'
import RichText from './RichText'

/**
 * A header button that opens a modal gathering all of a lecture's key formulas
 * (name → KaTeX formula → optional note). Companion to GlossaryButton; shown for
 * any lecture that defines `formulas`. Esc / backdrop closes it.
 */
export default function FormulasButton({ formulas }: { formulas: FormulaItem[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // global shortcut: Ctrl+Shift+D toggles the formulas modal (e.code → layout-independent)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.code === 'KeyD') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="נוסחאות מרכזיות · Ctrl+Shift+D"
        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-100"
      >
        <span aria-hidden>📐</span>
        נוסחאות מרכזיות
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
              className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-3xl bg-slate-50 shadow-2xl"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-sky-100 bg-gradient-to-l from-sky-50 to-white px-6 py-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📐</span>
                  נוסחאות מרכזיות
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                    {formulas.length}
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

              <div className="grid gap-3 p-6 sm:grid-cols-2">
                {formulas.map((f) => (
                  <div key={f.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-2 text-sm font-bold text-slate-700">{f.name}</p>
                    <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
                      <Tex block>{f.tex}</Tex>
                    </div>
                    {f.note && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        <RichText>{f.note}</RichText>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
