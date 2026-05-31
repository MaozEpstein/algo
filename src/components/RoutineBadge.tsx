import type { RoutineKind } from '@/engine/types'

interface Props {
  kind: RoutineKind
  /** For helpers: the algorithm it's currently being called from (contextual). */
  calledFromHe?: string
  /** For helpers: all algorithms that use it (shown as a tooltip / subtitle). */
  helperOfHe?: string[]
  size?: 'sm' | 'md'
}

/**
 * A consistent badge that marks every routine as either a main algorithm or a
 * helper — and, for helpers, which algorithm they serve. Used in the code panel
 * and in every operation picker so the distinction is uniform across the app.
 */
export default function RoutineBadge({ kind, calledFromHe, helperOfHe, size = 'md' }: Props) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  if (kind === 'helper') {
    const subtitle = calledFromHe
      ? `נקראת מתוך ${calledFromHe}`
      : helperOfHe && helperOfHe.length
        ? `עזר של ${helperOfHe.join(', ')}`
        : null
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-violet-100 font-semibold text-violet-700 ${pad}`}
        title={helperOfHe?.length ? `עזר של ${helperOfHe.join(', ')}` : undefined}
      >
        <span aria-hidden>🔧</span>
        פונקציית עזר
        {subtitle && <span className="font-normal text-violet-500">· {subtitle}</span>}
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-slate-100 font-semibold text-slate-600 ${pad}`}
    >
      <span aria-hidden>📦</span>
      אלגוריתם
    </span>
  )
}
