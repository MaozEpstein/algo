import Tex from '@/components/Tex'

/** One row of the cost tree: a level with its node count, size, and cost. */
export interface CostRow {
  /** Level index; 0 = root. */
  i: number
  /** Number of nodes at this level (drawn as dots, capped). */
  nodes: number
  /** Sub-problem size at this level, as LaTeX (e.g. 'n/2'). */
  sizeTex: string
  /** Total cost contributed by this whole level, as LaTeX. */
  levelCostTex: string
}

const MAX_DOTS = 32

/**
 * A level-by-level recursion tree annotated with per-level cost — the visual
 * heart of both the iteration and master-theorem tabs. Shows the doubling/
 * branching of sub-problems and how the per-level costs sum to the total.
 */
export default function CostTree({
  rows,
  totalTex,
  noteHe,
}: {
  rows: CostRow[]
  totalTex: string
  noteHe?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const shown = Math.min(r.nodes, MAX_DOTS)
          return (
            <div
              key={r.i}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-12 shrink-0 text-xs font-semibold text-slate-400">
                  רמה {r.i}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {Array.from({ length: shown }).map((_, j) => (
                    <span
                      key={j}
                      className="inline-block rounded-full bg-sky-400"
                      style={{ width: 9, height: 9 }}
                    />
                  ))}
                  {r.nodes > MAX_DOTS && (
                    <span className="text-xs font-semibold text-slate-400">…</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <span className="text-slate-500">
                  <Tex>{`${r.nodes}\\text{ צמתים} \\times ${r.sizeTex}`}</Tex>
                </span>
                <span className="rounded-lg bg-sky-50 px-2 py-1 font-semibold text-sky-700">
                  <Tex>{r.levelCostTex}</Tex>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <span className="text-sm font-semibold text-slate-600">סכום כל הרמות:</span>
        <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">
          <Tex>{totalTex}</Tex>
        </span>
      </div>

      {noteHe && <p className="text-sm leading-relaxed text-slate-500">{noteHe}</p>}
    </div>
  )
}
