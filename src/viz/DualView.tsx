import type { Frame, ViewKind } from '@/engine/types'
import TreeView from './TreeView'
import ArrayView from './ArrayView'

interface Props {
  frame: Frame
  views: ViewKind[]
  instant?: boolean
  onCellClick?: (index: number) => void
  clickable?: boolean
}

/**
 * The synchronized array↔tree canvas. Both halves read the SAME frame with the
 * same transition, so a value's motion in the tree and in the array happen in
 * parallel — the core "see it" moment.
 */
export default function DualView({ frame, views, instant, onCellClick, clickable }: Props) {
  const showTree = views.includes('tree')
  const showArray = views.includes('array')

  return (
    <div className="viz-canvas flex h-full w-full flex-col gap-2 p-4 sm:p-6">
      {showTree && (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <TreeView frame={frame} instant={instant} />
        </div>
      )}

      {showArray && (
        <div className="shrink-0">
          {showTree && (
            <div className="ltr mb-1 text-center font-mono text-xs tracking-wide text-slate-400" dir="ltr">
              array view
            </div>
          )}
          <ArrayView
            frame={frame}
            instant={instant}
            onCellClick={onCellClick}
            clickable={clickable}
          />
        </div>
      )}
    </div>
  )
}
