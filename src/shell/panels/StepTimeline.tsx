import { useMemo } from 'react'
import { usePlayerStore } from '../player/usePlayerStore'
import { deriveSteps } from '../player/steps'

export default function StepTimeline() {
  const frames = usePlayerStore((s) => s.frames)
  const index = usePlayerStore((s) => s.index)
  const seek = usePlayerStore((s) => s.seek)
  const steps = useMemo(() => deriveSteps(frames), [frames])

  if (steps.length <= 1) return null

  let active = -1
  for (let k = 0; k < steps.length; k++) if (steps[k].index <= index) active = k

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs font-medium text-slate-400">שלבים:</span>
      {steps.map((s, k) => (
        <button
          key={k}
          onClick={() => seek(s.index)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
            k === active
              ? 'bg-sky-500 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span dir={s.ltr ? 'ltr' : undefined} className="inline-block">
            {s.label}
          </span>
        </button>
      ))}
    </div>
  )
}
