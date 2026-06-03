import { Fragment, type ReactNode } from 'react'

/**
 * A cause→effect flowchart: numbered step-cards (each keeping its full detail /
 * formula) chained by arrows into a final outcome badge. Lays out in one
 * horizontal row when there's room and wraps gracefully on narrow screens, so the
 * prose "chain" becomes a flow without losing any detail. Text is centered.
 */
export interface FlowStep {
  title: ReactNode
  body?: ReactNode
}

const TONES = {
  forward: { card: 'border-amber-200 bg-amber-50/50', num: 'bg-amber-500', arrow: 'text-amber-400', out: 'bg-emerald-500' },
  reverse: { card: 'border-sky-200 bg-sky-50/50', num: 'bg-sky-500', arrow: 'text-sky-400', out: 'bg-rose-500' },
}

export default function StepFlow({
  tone,
  steps,
  outcome,
}: {
  tone: keyof typeof TONES
  steps: FlowStep[]
  outcome: { label: string; sub?: ReactNode }
}) {
  const t = TONES[tone]
  return (
    <div className="mt-4 flex flex-wrap items-stretch justify-center gap-x-4 gap-y-3 px-1">
      {steps.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className={`self-center text-2xl font-bold ${t.arrow}`} aria-hidden>
              ←
            </span>
          )}
          <div className={`flex w-48 flex-col items-center rounded-xl border px-3 py-3 text-center ${t.card}`}>
            <span className={`mb-1 grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white ${t.num}`}>{i + 1}</span>
            <p className="text-sm font-semibold leading-snug text-slate-800">{s.title}</p>
            {s.body && <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.body}</p>}
          </div>
        </Fragment>
      ))}
      <span className={`self-center text-2xl font-bold ${t.arrow}`} aria-hidden>
        ←
      </span>
      <div className={`flex w-48 flex-col items-center justify-center rounded-xl px-3 py-3 text-center text-white shadow-sm ${t.out}`}>
        <p className="text-sm font-bold leading-snug">{outcome.label}</p>
        {outcome.sub && <p className="mt-1 text-[11px] font-medium leading-relaxed opacity-90">{outcome.sub}</p>}
      </div>
    </div>
  )
}
