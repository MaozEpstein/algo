import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AlgorithmInput, Frame, LectureModule, Preset } from '@/core/engine/types'
import PlaybackStage from '@/core/shell/PlaybackStage'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import RoutineBadge from '@/core/components/RoutineBadge'

/**
 * The unified learning mode (formerly "guided" + "sandbox"): pick an
 * operation, read its instruction, optionally edit the input array, and watch
 * it run with synced code + narration. Deep-linkable via `?algo=<id>`.
 */
export default function GuidedMode({ lecture }: { lecture: LectureModule }) {
  const [params] = useSearchParams()
  const requested = params.get('algo') ?? params.get('tour')
  const initialId = lecture.algorithms.find((a) => a.id === requested)?.id ?? lecture.algorithms[0].id

  const [algoId, setAlgoId] = useState(initialId)
  const algo = lecture.algorithms.find((a) => a.id === algoId)!

  const [raw, setRaw] = useState(() => algo.defaultInput.array.join(', '))
  const [frames, setFrames] = useState<Frame[]>(() => algo.run(algo.defaultInput))
  const [error, setError] = useState<string | null>(null)
  const [runKey, setRunKey] = useState(0)
  const [dirty, setDirty] = useState(false)
  // The `extra` params (startIndex / key / i / seed) for the current run —
  // updated by presets so manual edits keep the right context.
  const [currentExtra, setCurrentExtra] = useState(algo.defaultInput.extra)

  const placeholder = useMemo(() => algo.defaultInput.array.join(', '), [algo])
  const steps = useMemo(() => lecture.deriveSteps?.(frames) ?? [], [lecture, frames])

  function loadInput(input: AlgorithmInput) {
    setRaw(input.array.join(', '))
    setCurrentExtra(input.extra)
    setFrames(algo.run(input))
    setError(null)
    setDirty(false)
    setRunKey((k) => k + 1)
  }

  function pickAlgo(id: string) {
    const next = lecture.algorithms.find((a) => a.id === id)!
    setAlgoId(id)
    setRaw(next.defaultInput.array.join(', '))
    setCurrentExtra(next.defaultInput.extra)
    setFrames(next.run(next.defaultInput))
    setError(null)
    setDirty(false)
    setRunKey((k) => k + 1)
  }

  function run() {
    const res = algo.validateInput(raw)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setError(null)
    setFrames(algo.run({ ...res.value, extra: currentExtra }))
    setDirty(false)
    setRunKey((k) => k + 1)
  }

  function loadPreset(p: Preset) {
    loadInput(p.input)
  }

  function resetInput() {
    loadInput(algo.defaultInput)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* operation picker */}
      <div className="flex flex-wrap gap-2">
        {lecture.algorithms.map((a) => (
          <button
            key={a.id}
            onClick={() => pickAlgo(a.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              a.id === algoId
                ? 'border-sky-500 bg-sky-500 text-white shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
            title={a.kind === 'helper' ? `פונקציית עזר · ${a.blurbHe}` : a.blurbHe}
          >
            <span aria-hidden>{a.kind === 'helper' ? '🔧' : '📦'}</span>
            {a.titleHe}
            {a.optional && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  a.id === algoId ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700'
                }`}
              >
                רשות
              </span>
            )}
          </button>
        ))}
      </div>

      {/* instruction for the selected operation */}
      <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-white px-5 py-4 shadow-card">
        <span className="mt-0.5 text-xl" aria-hidden>
          💡
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">{algo.titleHe}</span>
            <RoutineBadge
              kind={algo.kind}
              helperOfHe={algo.helperOfHe}
              mainLabelHe={algo.routineLabelHe}
              size="sm"
            />
          </div>
          <p className="leading-relaxed text-slate-600">{algo.blurbHe}</p>
        </div>
      </div>

      {/* editable input — change the tree yourself */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-slate-600">
            המערך (נסו לשנות ולראות מה קורה):
          </label>
          <ComplexityProofButton algo={algo} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <input
              dir="ltr"
              value={raw}
              onChange={(e) => {
                setRaw(e.target.value)
                setDirty(true)
              }}
              onKeyDown={(e) => e.key === 'Enter' && run()}
              placeholder={placeholder}
              className="ltr w-full rounded-xl border border-slate-300 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={run}
              className={`rounded-xl px-6 py-2.5 font-medium text-white transition ${
                dirty ? 'bg-sky-500 hover:bg-sky-600' : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              הרצה
            </button>
            <button
              onClick={resetInput}
              className="rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
              title="חזרה למערך לדוגמה"
            >
              איפוס
            </button>
          </div>
        </div>

        {/* instructive example inputs (edge cases) */}
        {algo.presets && algo.presets.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-xs font-medium text-slate-400">דוגמאות:</span>
            {algo.presets.map((p) => (
              <button
                key={p.labelHe}
                onClick={() => loadPreset(p)}
                title={p.noteHe}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  p.worst
                    ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-700'
                }`}
              >
                {p.worst && <span aria-hidden>⚠ </span>}
                {p.labelHe}
              </button>
            ))}
          </div>
        )}
      </div>

      <PlaybackStage key={runKey} frames={frames} algorithm={algo} views={lecture.views} steps={steps} />
    </div>
  )
}
