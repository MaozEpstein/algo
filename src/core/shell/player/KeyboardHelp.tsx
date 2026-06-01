import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SHORTCUTS: { keys: string[]; he: string }[] = [
  { keys: ['Space'], he: 'נגן / השהיה' },
  { keys: ['→'], he: 'צעד קדימה' },
  { keys: ['←'], he: 'צעד אחורה' },
  { keys: ['↑'], he: 'האצה (מהירות הבאה)' },
  { keys: ['↓'], he: 'האטה (מהירות קודמת)' },
  { keys: ['.'], he: 'לשלב הבא' },
  { keys: [','], he: 'לשלב הקודם' },
  { keys: ['Home'], he: 'לתחילת ההרצה' },
  { keys: ['End'], he: 'לסוף ההרצה' },
  { keys: ['R'], he: 'איפוס' },
  { keys: ['?'], he: 'פתיחת חלון זה' },
]

export default function KeyboardHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">⌨ קיצורי מקלדת</h3>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>
            <ul className="flex flex-col divide-y divide-slate-100">
              {SHORTCUTS.map((s) => (
                <li key={s.he} className="flex items-center justify-between gap-4 py-2">
                  <span className="text-slate-600">{s.he}</span>
                  <span className="flex gap-1" dir="ltr">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="min-w-[2rem] rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-center font-mono text-sm font-semibold text-slate-700 shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
