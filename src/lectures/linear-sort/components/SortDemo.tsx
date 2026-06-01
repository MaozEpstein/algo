import { useMemo, useState } from 'react'
import type { AlgorithmInput, Frame, PseudocodeBlock } from '@/engine/types'
import LocalPlayer from '@/shell/LocalPlayer'
import FlowView from '../views/FlowView'
import { phaseSteps } from '../steps'

export interface DemoPreset {
  labelHe: string
  array: number[]
  noteHe?: string
}

/**
 * An embedded linear-sort demo: input presets (chips) + a LocalPlayer running
 * the algorithm with the shared FlowView. Reused by the counting/radix/bucket
 * tabs (mirrors the foundations InsertionSortTab pattern).
 */
export default function SortDemo({
  titleHe,
  block,
  run,
  presets,
}: {
  titleHe: string
  block: PseudocodeBlock
  run: (input: AlgorithmInput) => Frame[]
  presets: DemoPreset[]
}) {
  const [array, setArray] = useState<number[]>(presets[0].array)
  const frames = useMemo(() => run({ array }), [array, run])
  const steps = useMemo(() => phaseSteps(frames), [frames])
  const active = presets.find((p) => p.array.join() === array.join())

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">קלט:</span>
        {presets.map((p) => (
          <button
            key={p.labelHe}
            onClick={() => setArray(p.array)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              p.array.join() === array.join()
                ? 'border-sky-500 bg-sky-500 text-white shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {p.labelHe}
          </button>
        ))}
      </div>
      {active?.noteHe && <p className="text-sm text-slate-500">{active.noteHe}</p>}
      <LocalPlayer
        key={array.join(',')}
        frames={frames}
        pseudocode={[block]}
        titleHe={titleHe}
        views={['custom']}
        customViz={FlowView}
        steps={steps}
      />
    </div>
  )
}
