import Tex from '@/components/Tex'

/**
 * A staircase of bars of heights 1, 2, …, n — the visual for a "decrease-by-one"
 * recurrence whose per-level costs form an arithmetic series. The triangular
 * area makes the Θ(n²) total visible (it fills ~half of an n×n square).
 */
export default function SeriesStaircase({
  n,
  sumTex,
  noteHe,
  revealCount,
}: {
  n: number
  sumTex: string
  noteHe?: string
  /** Fill only the first N bars (for step-by-step build-up). Defaults to all. */
  revealCount?: number
}) {
  const bars = Array.from({ length: n }, (_, i) => i + 1)
  const visible = revealCount ?? n
  const full = visible >= n
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div dir="ltr" className="flex items-end justify-center gap-1.5">
        {bars.map((h, idx) => {
          const shown = idx < visible
          return (
            <div key={h} className="flex w-7 flex-col items-center">
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  shown ? 'bg-gradient-to-t from-sky-500 to-sky-300' : 'bg-slate-200'
                }`}
                style={{ height: shown ? (h / n) * 120 : 4 }}
              />
              <span className="mt-1 text-[10px] text-slate-400">{h}</span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <span className="text-sm font-semibold text-slate-600">סכום השטח:</span>
        {full ? (
          <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">
            <Tex>{sumTex}</Tex>
          </span>
        ) : (
          <span className="text-sm text-slate-400">ממשיכים לצבור… ↑</span>
        )}
      </div>

      {full && noteHe && <p className="text-sm leading-relaxed text-slate-500">{noteHe}</p>}
    </div>
  )
}
