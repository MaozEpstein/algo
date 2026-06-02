import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AlgorithmSpec, Frame, Step, ViewKind } from '@/core/engine/types'
import DualView from '@/core/viz/DualView'
import CodePanel from './panels/CodePanel'
import NarrationBar from './panels/NarrationBar'
import WatchPanel from './panels/WatchPanel'
import CostMeter from './panels/CostMeter'
import StepTimeline from './panels/StepTimeline'
import TransportControls from './player/TransportControls'
import Scrubber from './player/Scrubber'
import KeyboardHelp from './player/KeyboardHelp'
import { usePlayback } from './player/usePlayback'
import { usePlayerHotkeys } from './player/usePlayerHotkeys'
import { selectCurrentFrame, usePlayerStore } from './player/usePlayerStore'

interface Props {
  frames: Frame[]
  algorithm: AlgorithmSpec
  views: ViewKind[]
  /** High-level step chips for the StepTimeline (course-derived). */
  steps?: Step[]
  /** Seek to this frame once after loading (deep-link support). */
  seekTo?: number
}

/** The shared playback layout: narration · canvas + code · controls. */
export default function PlaybackStage({ frames, algorithm, views, steps, seekTo }: Props) {
  const load = usePlayerStore((s) => s.load)
  const seek = usePlayerStore((s) => s.seek)
  const [helpOpen, setHelpOpen] = useState(false)
  const toggleHelp = useCallback(() => setHelpOpen((o) => !o), [])
  usePlayback()
  usePlayerHotkeys(toggleHelp)

  useEffect(() => {
    load(frames, steps)
    if (typeof seekTo === 'number') seek(seekTo)
  }, [frames, steps, load, seek, seekTo])

  const frame = usePlayerStore(selectCurrentFrame)
  const jumped = usePlayerStore((s) => s.jumped)
  const index = usePlayerStore((s) => s.index)
  // Does this run track any variables? If so, reserve a left gutter for the box.
  const hasVars = useMemo(
    () => frames.some((f) => (f.vars?.length ?? 0) > 0 || (f.markers?.length ?? 0) > 0),
    [frames],
  )
  if (!frame) return null

  const mainBlock = algorithm.pseudocode[0]
  const effViews = algorithm.views ?? views
  // Tree views put the box top-left (room above the tree); everything else
  // (array, custom flow) puts it bottom-right, clear of the centered transport.
  const isTree = effViews.includes('tree')

  return (
    <div className="flex flex-col gap-4">
      <NarrationBar frame={frame} />
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="relative min-h-[340px] min-w-0 sm:min-h-[460px]">
          <DualView
            frame={frame}
            views={effViews}
            customViz={algorithm.customViz}
            instant={jumped}
            reserveBottomSpace
          />
          {/* watched-variables box: top-left for tree views, bottom-right (above
              the transport controls) for array views. */}
          {hasVars && (
            <div
              className={`absolute z-20 ${isTree ? 'left-3 top-3' : 'bottom-20 right-3'}`}
            >
              <WatchPanel frames={frames} index={index} jumped={jumped} />
            </div>
          )}
          {/* floating transport, near the content */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <div className="pointer-events-auto">
              <TransportControls />
            </div>
          </div>
        </div>
        <CodePanel
          blocks={algorithm.pseudocode}
          frame={frame}
          mainBlockId={mainBlock.id}
          mainTitleHe={algorithm.titleEn}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <Scrubber />
        <StepTimeline />
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <CostMeter />
          <button
            onClick={() => setHelpOpen(true)}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            title="קיצורי מקלדת (?)"
          >
            ⌨ קיצורים
          </button>
        </div>
      </div>
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}

