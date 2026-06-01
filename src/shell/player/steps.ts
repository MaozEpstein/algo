import type { Frame } from '@/engine/types'

export interface Step {
  label: string
  index: number
  /** Render the label left-to-right (for bracketed ranges like [1..5]). */
  ltr?: boolean
}

function currentIndexOf(f: Frame): number | null {
  const h = f.highlights.find((x) => x.role === 'current')
  return h && h.indices.length === 1 ? h.indices[0] : null
}

/**
 * Derive high-level navigable steps from the frame stream: one chip per
 * Build-Max-Heap node visit, one per HeapSort extraction, one per Quicksort
 * partition call. Used by the StepTimeline and by the ,/. keyboard shortcuts.
 */
export function deriveSteps(frames: Frame[]): Step[] {
  const steps: Step[] = []
  let extract = 0
  let move = 0
  frames.forEach((f, i) => {
    if (f.codeBlock === 'buildMaxHeap' && f.codeLine === 3) {
      const node = currentIndexOf(f)
      steps.push({ label: node != null ? `צומת ${node}` : 'בנייה', index: i })
    } else if (f.codeBlock === 'heapSort' && f.codeLine === 3) {
      extract += 1
      steps.push({ label: `שליפה ${extract}`, index: i })
    } else if (f.codeBlock === 'hoarePartition' && f.codeLine === 2) {
      const active = f.highlights.find((h) => h.role === 'active')
      if (active && active.indices.length) {
        const lo = Math.min(...active.indices)
        const hi = Math.max(...active.indices)
        steps.push({ label: `[${lo}..${hi}]`, index: i, ltr: true })
      }
    } else if (f.codeBlock === 'mergeSort' && f.codeLine === 6) {
      // one chip per Merge call — its range is the union of the two halves
      const idxs = f.highlights.flatMap((h) => h.indices)
      if (idxs.length) {
        steps.push({ label: `[${Math.min(...idxs)}..${Math.max(...idxs)}]`, index: i, ltr: true })
      }
    } else if (f.codeBlock === 'hanoi' && f.codeLine === 4) {
      move += 1
      steps.push({ label: `מהלך ${move}`, index: i })
    }
  })
  return steps
}
