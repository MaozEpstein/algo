import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { OPEN_FORMULA_SHEET } from '@/core/platform/types'

/**
 * The official course formula sheet (התקנים של מוליכים למחצה – 83812), shown
 * exactly as the original: the source PDF is served from /public and embedded in
 * a modal via the browser's PDF viewer, and "ייצא ל-PDF" downloads that same
 * original file. BASE_URL keeps the path correct under any deploy base.
 *
 * This component is the *modal only* — it's mounted once per course by
 * CourseProvider, so it's reachable from any page. It opens on the global
 * keyboard shortcut (Ctrl+Shift+S, or Cmd+Shift+S on Mac) or the
 * OPEN_FORMULA_SHEET window event (dispatched by CourseHome's button). Esc, or
 * the shortcut again, closes it.
 */
const PDF_URL = `${import.meta.env.BASE_URL}docs/semiconductors-formula-sheet.pdf`

/** True when focus is in a text field, so the shortcut doesn't hijack typing. */
function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

export default function FormulaSheet() {
  const [open, setOpen] = useState(false)

  // Global hotkey + window-event trigger — active regardless of which page is
  // showing. `e.code === 'KeyS'` is layout-independent (works on a Hebrew layout
  // too, where `e.key` would be a Hebrew letter). Ctrl (or Cmd on Mac) + Shift + S.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS' && !e.altKey && !isTyping(e.target)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpenEvent = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_FORMULA_SHEET, onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_FORMULA_SHEET, onOpenEvent)
    }
  }, [])

  return (
    <>
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
              className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-violet-100 bg-gradient-to-l from-violet-50 to-white px-6 py-3">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📄</span>
                  דף נוסחאות — 83812
                  <kbd className="rounded border border-violet-200 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-violet-400" dir="ltr">
                    Ctrl+Shift+S
                  </kbd>
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={PDF_URL}
                    download="דף נוסחאות 83812.pdf"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                    </svg>
                    ייצא ל-PDF
                  </a>
                  <button
                    onClick={() => setOpen(false)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="סגירה"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* the original PDF, embedded exactly as-is */}
              <iframe
                src={`${PDF_URL}#view=FitH`}
                title="דף נוסחאות 83812"
                className="min-h-0 w-full flex-1 bg-slate-100"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
