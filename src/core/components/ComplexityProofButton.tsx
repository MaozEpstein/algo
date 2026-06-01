import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AlgorithmSpec } from '@/core/engine/types'
import Tex from './Tex'
import ProofView from './ProofView'

/**
 * A chip that shows an algorithm's complexity and, if a proof exists, opens a
 * modal with the full derivation. Reused in guided/sandbox and the summary.
 */
interface Props {
  algo: AlgorithmSpec
  /** 'chip' shows complexity + "מדוע?"; 'link' shows just a "מדוע?" button. */
  variant?: 'chip' | 'link'
}

export default function ComplexityProofButton({ algo, variant = 'chip' }: Props) {
  const [open, setOpen] = useState(false)
  const hasProof = !!algo.proof

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {variant === 'link' ? (
        <button
          onClick={() => hasProof && setOpen(true)}
          disabled={!hasProof}
          className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
            hasProof
              ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              : 'text-slate-300'
          }`}
          title={hasProof ? 'הצגת הוכחת הסיבוכיות' : 'אין הוכחה'}
        >
          מדוע?
        </button>
      ) : (
        <button
          onClick={() => hasProof && setOpen(true)}
          disabled={!hasProof}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
            hasProof
              ? 'border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:bg-sky-50'
              : 'border-slate-200 bg-white text-slate-500'
          }`}
          title={hasProof ? 'הצגת הוכחת הסיבוכיות' : undefined}
        >
          <span className="text-slate-400">סיבוכיות</span>
          <Tex>{algo.complexity}</Tex>
          {hasProof && <span className="font-semibold text-sky-600">· מדוע?</span>}
        </button>
      )}

      <AnimatePresence>
        {open && algo.proof && (
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
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    הוכחת הסיבוכיות · {algo.titleEn}
                  </h3>
                  <p className="text-sm text-slate-500">{algo.titleHe}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100"
                  aria-label="סגירה"
                >
                  ✕
                </button>
              </div>
              <ProofView proof={algo.proof} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
