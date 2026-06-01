import { useMemo } from 'react'
import { usePlayerStore } from '../player/usePlayerStore'

/**
 * Live cost counters — makes the complexity tangible. Counts comparisons and
 * swaps cumulatively up to the current frame (from the FrameAction stream), and
 * shows the current recursion depth. The growing numbers ARE the point: you
 * watch the O(...) cost accrue.
 */
export default function CostMeter() {
  const frames = usePlayerStore((s) => s.frames)
  const index = usePlayerStore((s) => s.index)

  // Prefix sums over the action stream — computed once per run.
  const prefix = useMemo(() => {
    let comparisons = 0
    let swaps = 0
    return frames.map((f) => {
      if (f.action?.kind === 'compare') comparisons += 1
      else if (f.action?.kind === 'swap') swaps += 1
      return { comparisons, swaps }
    })
  }, [frames])

  const cur = prefix[index] ?? { comparisons: 0, swaps: 0 }
  const depth = frames[index]?.callDepth ?? 0
  const atEnd = frames.length > 0 && index === frames.length - 1

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Stat label="השוואות" value={cur.comparisons} color="#f59e0b" />
      <Stat label="החלפות" value={cur.swaps} color="#fb7185" />
      <Stat label="עומק רקורסיה" value={depth} color="#a855f7" />
      {atEnd && (
        <span className="ms-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          סה״כ: {cur.comparisons} השוואות · {cur.swaps} החלפות
        </span>
      )}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-sm text-slate-500">{label}</span>
      <span className="min-w-[1.5rem] text-center font-mono text-lg font-bold tabular-nums text-slate-800">
        {value}
      </span>
    </div>
  )
}
