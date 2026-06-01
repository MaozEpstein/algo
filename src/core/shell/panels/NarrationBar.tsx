import { AnimatePresence, motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'

const PHASE_LABELS: Record<string, string> = {
  build: 'בניית ערימה',
  sort: 'מיון',
  insert: 'הכנסה',
  extract: 'שליפה',
}

/** The one-sentence-per-step narration — this replaces walls of text. */
export default function NarrationBar({ frame }: { frame: Frame }) {
  const phase = frame.phase ? PHASE_LABELS[frame.phase] ?? frame.phase : null
  return (
    <div className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-l from-sky-50 to-white px-5 py-3 shadow-card">
      {phase && (
        <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
          {phase}
        </span>
      )}
      {typeof frame.callDepth === 'number' && frame.callDepth > 0 && (
        <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 font-mono text-xs text-violet-700">
          עומק רקורסיה {frame.callDepth}
        </span>
      )}
      <AnimatePresence mode="wait">
        <motion.p
          key={frame.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-medium leading-snug text-slate-800"
        >
          {frame.narration}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
