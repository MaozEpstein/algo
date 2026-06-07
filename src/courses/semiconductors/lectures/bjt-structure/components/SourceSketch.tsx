import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * A button that opens the ORIGINAL hand-drawn sketch in a modal — same idea as the
 * formula sheet (FormulaSheet.tsx): the source image is served from /public and shown
 * one-to-one, with a download link. BASE_URL keeps the path correct under any deploy
 * base. Self-contained; Esc or click-outside closes.
 */
interface Props {
  /** file under /public, e.g. "docs/bjt-band-diagram-source.png". */
  src: string
  title: string
  label?: string
  download?: string
}

export default function SourceSketch({ src, title, label = 'שרטוט המקור (כתב-יד)', download }: Props) {
  const [open, setOpen] = useState(false)
  const url = `${import.meta.env.BASE_URL}${src}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        <span aria-hidden>📄</span> {label}
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
              className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-violet-100 bg-gradient-to-l from-violet-50 to-white px-6 py-3">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📄</span>
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={url}
                    download={download || 'source-sketch.png'}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                    </svg>
                    הורדה
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
              <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3">
                <img src={url} alt={title} className="mx-auto h-auto w-full max-w-2xl rounded-lg bg-white shadow" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
