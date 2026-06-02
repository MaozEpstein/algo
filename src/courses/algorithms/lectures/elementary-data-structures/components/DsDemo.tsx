import { useMemo, useState } from 'react'
import type { AlgorithmInput, Frame, PseudocodeBlock } from '@/core/engine/types'
import { parseIntArray } from '@/core/engine/parseInput'
import LocalPlayer from '@/core/shell/LocalPlayer'
import DsView from '../views/DsView'
import { phaseSteps } from '../steps'

export interface DsPreset {
  labelHe: string
  /** Keys to insert (hashing) OR an op-stream for stack/queue (n>0 = push/enqueue n, 0 = pop/dequeue). */
  array: number[]
  /** Extra scalars the generator reads, e.g. { m: 7 } table size, { search: 42 }, { method: 0 }. */
  extra?: Record<string, number>
  noteHe?: string
}

/** Optional editable input (a comma/space list of keys), validated with parseIntArray. */
interface EditableOpts {
  min?: number
  max?: number
  minValue?: number
  maxValue?: number
}

/**
 * An embedded lecture-9 demo: input presets (chips) + an optional editable key
 * list + a LocalPlayer running the generator with the shared DsView. Mirrors the
 * linear-sort SortDemo so every demo inherits the full player pipeline (floating
 * transport, narration, watched-variables panel, step timeline, code panel).
 */
export default function DsDemo({
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
  presets: DsPreset[]
  varsPlacement?: 'overlay' | 'side'
  /** When set, render an editable key-list input above the player. */
  editable?: EditableOpts
}) {
  const [preset, setPreset] = useState<DsPreset>(presets[0])
  const [raw, setRaw] = useState(() => presets[0].array.join(', '))
  const [error, setError] = useState<string | null>(null)

  const frames = useMemo(
    () => run({ array: preset.array, extra: preset.extra }),
    [preset, run],
  )
  const steps = useMemo(() => phaseSteps(frames), [frames])

  const pickPreset = (p: DsPreset) => {
    setPreset(p)
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
    setPreset({ labelHe: 'מותאם', array: res.value.array, extra: preset.extra })
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
              p === preset
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
              placeholder="לדוגמה: 12, 7, 25, 18, 3"
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

      {preset.noteHe && <p className="text-sm text-slate-500">{preset.noteHe}</p>}

      <LocalPlayer
        key={JSON.stringify([preset.array, preset.extra])}
        frames={frames}
        pseudocode={[block]}
        titleHe={titleHe}
        views={['custom']}
        customViz={DsView}
        steps={steps}
        varsPlacement={varsPlacement}
      />
    </div>
  )
}
