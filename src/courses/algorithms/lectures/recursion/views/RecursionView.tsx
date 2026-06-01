import { AnimatePresence, motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import { usePlayerStore } from '@/core/shell/player/usePlayerStore'
import type { CallFrame, RecursionScene } from '../scene'

const STATUS_CLS: Record<CallFrame['status'], string> = {
  active: 'border-sky-400 bg-sky-50',
  waiting: 'border-slate-200 bg-white',
  base: 'border-emerald-400 bg-emerald-50',
  returned: 'border-emerald-400 bg-emerald-50',
}

export default function RecursionView({ frame }: { frame: Frame }) {
  // Speed-aware push/pop so the animation finishes within the frame interval
  // (≈1100/speed ms); instant when scrubbing. Same pattern as Hanoi/Merge views.
  const speed = usePlayerStore((s) => s.speed)
  const jumped = usePlayerStore((s) => s.jumped)
  const dur = jumped ? 0 : Math.min(0.4, ((1100 / speed) / 1000) * 0.8)

  const scene = frame.scene as RecursionScene | undefined
  // Guard the load race: a frame from a different algorithm has no call stack.
  if (!scene || !Array.isArray(scene.stack)) return null
  const { stack, resultTex, printed } = scene

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="text-xs font-medium text-slate-400">
        מחסנית הקריאות (Stack) — הקריאה העמוקה בתחתית, והיא הראשונה שמסתיימת
      </div>

      <div className="flex w-full max-w-xl flex-col gap-2">
        <AnimatePresence initial={false}>
          {stack.map((f, i) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: dur } }}
              transition={{ duration: dur, ease: 'easeOut' as const }}
              className={`rounded-2xl border px-4 py-3 shadow-sm ${STATUS_CLS[f.status]}`}
              style={{ marginInlineStart: i * 18 }}
            >
              <div className="flex items-center justify-between gap-3">
                <span dir="ltr" className="ltr font-mono text-sm font-bold text-slate-800">
                  {f.callTex}
                </span>
                {f.returnTex && (
                  <span className="shrink-0 rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                    מחזירה {f.returnTex}
                  </span>
                )}
              </div>
              {f.detailHe && <div className="mt-1 text-sm leading-relaxed text-slate-600">{f.detailHe}</div>}
            </motion.div>
          ))}
        </AnimatePresence>

        {stack.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
            המחסנית ריקה
          </div>
        )}
      </div>

      {printed && printed.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500">פלט:</span>
          <span dir="ltr" className="ltr rounded-lg bg-slate-100 px-3 py-1 font-mono font-semibold text-slate-700">
            {printed.join('  ')}
          </span>
        </div>
      )}

      {resultTex && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500">תוצאה:</span>
          <span className="rounded-lg bg-slate-900 px-3 py-1.5 font-mono font-bold text-white">
            {resultTex}
          </span>
        </div>
      )}
    </div>
  )
}
