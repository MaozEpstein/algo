import { useState } from 'react'
import Tex from '@/components/Tex'

/** A single expansion line: the running equation plus an optional aside. */
export interface UnrollStep {
  /** The expression so far, as LaTeX (e.g. 'T(n) = 2T(n/2) + n'). */
  tex: string
  /** Optional short Hebrew note shown beside the line. */
  noteHe?: string
}

/**
 * Walk through the iterative expansion of a recurrence one substitution at a
 * time. Reveals lines cumulatively so the growing pattern is visible, then
 * surfaces the closed-form result at the end.
 */
export default function UnrollStepper({
  steps,
  resultTex,
  introHe,
}: {
  steps: UnrollStep[]
  resultTex: string
  introHe?: string
}) {
  const [idx, setIdx] = useState(0)
  const last = steps.length - 1
  const atEnd = idx >= last

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      {introHe && <p className="text-sm leading-relaxed text-slate-600">{introHe}</p>}

      <div className="flex flex-col gap-2">
        {steps.slice(0, idx + 1).map((s, j) => (
          <div
            key={j}
            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition ${
              j === idx ? 'bg-sky-50 ring-1 ring-sky-200' : 'bg-slate-50'
            }`}
          >
            <Tex>{s.tex}</Tex>
            {s.noteHe && <span className="text-xs text-slate-400">{s.noteHe}</span>}
          </div>
        ))}
      </div>

      {atEnd && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-500">סך הכול:</span>
          <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">
            <Tex>{resultTex}</Tex>
          </span>
        </div>
      )}

      <div dir="ltr" className="flex items-center justify-center gap-2">
        <button
          onClick={() => setIdx(0)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          ⟲ איפוס
        </button>
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
        >
          ← הקודם
        </button>
        <span className="min-w-[5rem] text-center text-xs font-semibold text-slate-400">
          צעד {idx + 1}/{steps.length}
        </span>
        <button
          onClick={() => setIdx((i) => Math.min(last, i + 1))}
          disabled={atEnd}
          className="rounded-lg border border-sky-500 bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-sky-600 disabled:opacity-40"
        >
          הבא →
        </button>
      </div>
    </div>
  )
}
