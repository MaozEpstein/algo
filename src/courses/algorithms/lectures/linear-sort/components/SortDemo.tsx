import { useMemo, useState } from 'react'
import type { AlgorithmInput, Frame, PseudocodeBlock } from '@/core/engine/types'
import { parseIntArray } from '@/core/engine/parseInput'
import LocalPlayer from '@/core/shell/LocalPlayer'
import FlowView from '../views/FlowView'
import { phaseSteps } from '../steps'

export interface DemoPreset {
  labelHe: string
  array: number[]
  noteHe?: string
}

/** Optional editable input (a comma/space list of numbers), validated with parseIntArray. */
interface EditableOpts {
  min?: number
  max?: number
  minValue?: number
  maxValue?: number
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
  varsPlacement,
  editable,
}: {
  titleHe: string
  block: PseudocodeBlock
  run: (input: AlgorithmInput) => Frame[]
  presets: DemoPreset[]
  /** Forwarded to LocalPlayer: 'side' docks the variables box beside the code. */
  varsPlacement?: 'overlay' | 'side'
  /** When set, render an editable number-list input above the player. */
  editable?: EditableOpts
}) {
  const [array, setArray] = useState<number[]>(presets[0].array)
  const [raw, setRaw] = useState(() => presets[0].array.join(', '))
  const [error, setError] = useState<string | null>(null)
  const frames = useMemo(() => run({ array }), [array, run])
  const steps = useMemo(() => phaseSteps(frames), [frames])
  const active = presets.find((p) => p.array.join() === array.join())

  const pickPreset = (p: DemoPreset) => {
    setArray(p.array)
    setRaw(p.array.join(', '))
    setError(null)
  }

  const runEdited = () => {
    const res = parseIntArray(raw, editable)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setError(null)
    setArray(res.value.array)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">קלט:</span>
        {presets.map((p) => (
          <button
            key={p.labelHe}
            onClick={() => pickPreset(p)}
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

      {editable && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <input
              dir="ltr"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runEdited()}
              placeholder="לדוגמה: 3, 1, 2, 3, 1, 2"
              className="ltr w-full rounded-xl border border-slate-300 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
          </div>
          <button
            onClick={runEdited}
            className="rounded-xl bg-sky-500 px-6 py-2.5 font-medium text-white transition hover:bg-sky-600"
          >
            הרצה
          </button>
        </div>
      )}

      {active?.noteHe && <p className="text-sm text-slate-500">{active.noteHe}</p>}
      <LocalPlayer
        key={array.join(',')}
        frames={frames}
        pseudocode={[block]}
        titleHe={titleHe}
        views={['custom']}
        customViz={FlowView}
        steps={steps}
        varsPlacement={varsPlacement}
      />
    </div>
  )
}
