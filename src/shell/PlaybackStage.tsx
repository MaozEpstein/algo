import { useEffect } from 'react'
import type { AlgorithmSpec, Frame, ViewKind } from '@/engine/types'
import DualView from '@/viz/DualView'
import CodePanel from './panels/CodePanel'
import NarrationBar from './panels/NarrationBar'
import CostMeter from './panels/CostMeter'
import StepTimeline from './panels/StepTimeline'
import PlayerControls from './player/PlayerControls'
import { usePlayback } from './player/usePlayback'
import { selectCurrentFrame, usePlayerStore } from './player/usePlayerStore'

interface Props {
  frames: Frame[]
  algorithm: AlgorithmSpec
  views: ViewKind[]
  /** Seek to this frame once after loading (deep-link support). */
  seekTo?: number
}

/** The shared playback layout: narration · canvas + code · controls. */
export default function PlaybackStage({ frames, algorithm, views, seekTo }: Props) {
  const load = usePlayerStore((s) => s.load)
  const seek = usePlayerStore((s) => s.seek)
  usePlayback()

  useEffect(() => {
    load(frames)
    if (typeof seekTo === 'number') seek(seekTo)
  }, [frames, load, seek, seekTo])

  const frame = usePlayerStore(selectCurrentFrame)
  const jumped = usePlayerStore((s) => s.jumped)
  if (!frame) return null

  const mainBlock = algorithm.pseudocode[0]

  return (
    <div className="flex flex-col gap-4">
      <NarrationBar frame={frame} />
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0 min-h-[340px] sm:min-h-[460px]">
          <DualView frame={frame} views={views} instant={jumped} />
        </div>
        <CodePanel
          blocks={algorithm.pseudocode}
          frame={frame}
          mainBlockId={mainBlock.id}
          mainTitleHe={algorithm.titleEn}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <StepTimeline />
        <CostMeter />
        <div className="border-t border-slate-100 pt-3">
          <PlayerControls />
        </div>
      </div>
    </div>
  )
}
