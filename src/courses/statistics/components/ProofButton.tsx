import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ComplexityProof } from '@/core/engine/types'
import ProofView from '@/core/components/ProofView'

/**
 * A small inline button placed next to a definition/theorem. On click it opens a
 * centered modal showing the full derivation — the same popup pattern as the
 * algorithms course's complexity proofs, but driven directly by a
 * `ComplexityProof` (not an AlgorithmSpec), so any definition can carry a proof.
 * Keeps the main page light; the depth lives here for whoever wants it.
 */
export default function ProofButton({
  proof,
  label = 'הוכחה',
  titleHe,
}: {
  proof: ComplexityProof
  /** Button text — e.g. 'הוכחה', 'מדוע?', 'גזירה'. */
  label?: string
  /** Optional heading shown at the top of the modal. */
  titleHe?: string
}) {
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
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        title="פתיחת ההוכחה"
      >
        <span aria-hidden>📐</span>
        {label}
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
              className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6 shadow-2xl"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">{titleHe ?? 'הוכחה'}</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100"
                  aria-label="סגירה"
                >
                  ✕
                </button>
              </div>
              <ProofView proof={proof} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
