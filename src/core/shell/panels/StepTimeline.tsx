import { Fragment } from 'react'
import { usePlayerStore } from '../player/usePlayerStore'

export default function StepTimeline() {
  const index = usePlayerStore((s) => s.index)
  const seek = usePlayerStore((s) => s.seek)
  const steps = usePlayerStore((s) => s.steps)

  if (steps.length <= 1) return null

  let active = -1
  for (let k = 0; k < steps.length; k++) if (steps[k].index <= index) active = k

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs font-medium text-slate-400">שלבים:</span>
      {steps.map((s, k) => {
        const isActive = k === active
        // Divider at the call→return turning point (deepest call → first return).
        const showDivider = k > 0 && steps[k - 1].kind === 'call' && s.kind === 'return'
        const idle =
          s.kind === 'call'
            ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
            : s.kind === 'return'
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        return (
          <Fragment key={k}>
            {showDivider && (
              <span className="flex shrink-0 items-center gap-1 ps-1 text-[10px] font-bold text-slate-400">
                <span className="h-5 w-px bg-slate-300" />
                חזרות
              </span>
            )}
            <button
              onClick={() => seek(s.index)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                isActive ? 'bg-slate-800 text-white shadow' : idle
              }`}
            >
              {s.kind && (
                <span className="text-sm font-black leading-none" aria-hidden>
                  {s.kind === 'call' ? '↓' : '↑'}
                </span>
              )}
              <span dir={s.ltr ? 'ltr' : undefined} className="inline-block">
                {s.label}
              </span>
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}
