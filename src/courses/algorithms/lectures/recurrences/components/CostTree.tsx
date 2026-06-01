import Tex from '@/core/components/Tex'

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

/** Which part of the tree carries most of the cost (drives the highlight). */
export type Dominant = 'leaves' | 'root' | 'balanced'

const MAX_DOTS = 32

/**
 * A level-by-level recursion tree annotated with per-level cost — the visual
 * heart of both the iteration and master-theorem tabs. Shows the branching of
 * sub-problems and how the per-level costs sum to the total. When `dominant`
 * is set, the level(s) that carry the cost are highlighted so the Master-Theorem
 * intuition ("who dominates?") is visible rather than just stated.
 */
export default function CostTree({
  rows,
  totalTex,
  noteHe,
  dominant,
  revealCount,
}: {
  rows: CostRow[]
  totalTex: string
  noteHe?: string
  dominant?: Dominant
  /** Show only the first N levels (for step-by-step build-up). Defaults to all. */
  revealCount?: number
}) {
  const lastIdx = rows.length - 1
  const isDominant = (idx: number) =>
    dominant === 'balanced' ||
    (dominant === 'root' && idx === 0) ||
    (dominant === 'leaves' && idx === lastIdx)
  // 'balanced' tints every level equally (sky); a single dominant level is amber.
  const single = dominant === 'root' || dominant === 'leaves'
  const visible = revealCount ?? rows.length
  const full = visible >= rows.length

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex flex-col gap-2">
        {rows.slice(0, visible).map((r, idx) => {
          const shown = Math.min(r.nodes, MAX_DOTS)
          const dom = isDominant(idx)
          const rowCls = !dom
            ? 'bg-white shadow-sm'
            : single
              ? 'bg-amber-50 ring-2 ring-amber-300'
              : 'bg-sky-50 ring-1 ring-sky-200'
          return (
            <div
              key={r.i}
              className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${rowCls}`}
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
                {dom && single && (
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    שולט
                  </span>
                )}
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
        {full ? (
          <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">
            <Tex>{totalTex}</Tex>
          </span>
        ) : (
          <span className="text-sm text-slate-400">ממשיכים לפתח… ↑</span>
        )}
      </div>

      {full && noteHe && <p className="text-sm leading-relaxed text-slate-500">{noteHe}</p>}
    </div>
  )
}
