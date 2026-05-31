import { useMemo } from 'react'
import type { Frame } from '@/engine/types'
import { usePlayerStore } from '../player/usePlayerStore'

interface Step {
  label: string
  index: number
}

function currentIndexOf(f: Frame): number | null {
  const h = f.highlights.find((x) => x.role === 'current')
  return h && h.indices.length === 1 ? h.indices[0] : null
}

/**
 * Derive high-level navigable steps from the frame stream: one chip per
 * Build-Max-Heap node visit, and one per HeapSort extraction. Lets the user
 * jump straight to a phase in long runs instead of dragging the scrubber.
 */
function deriveSteps(frames: Frame[]): Step[] {
  const steps: Step[] = []
  let extract = 0
  frames.forEach((f, i) => {
    if (f.codeBlock === 'buildMaxHeap' && f.codeLine === 3) {
      const node = currentIndexOf(f)
      steps.push({ label: node != null ? `צומת ${node}` : 'בנייה', index: i })
    } else if (f.codeBlock === 'heapSort' && f.codeLine === 3) {
      extract += 1
      steps.push({ label: `שליפה ${extract}`, index: i })
    }
  })
  return steps
}

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
          {s.label}
        </button>
      ))}
    </div>
  )
}
