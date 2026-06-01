import { motion } from 'framer-motion'
import type { Frame } from '@/engine/types'
import { CELL, isFlowScene, type ChipTone, type BoxTone, type FlowChip } from '../scene'

/**
 * One dumb renderer for all three linear-time sorts. The pure generator computes
 * every chip's target (x, y) and the static "zone" boxes; here we just draw the
 * boxes and animate each chip (keyed by its stable id) to its position — so a
 * value flying from the input row into a bucket or the output is a single layout
 * transition. `instant` (passed by LocalPlayer when scrubbing) skips the motion.
 */
const CHIP_FILL: Record<ChipTone, string> = {
  idle: '#ffffff',
  active: '#0ea5e9',
  compare: '#f59e0b',
  done: '#10b981',
  count: '#8b5cf6',
}
const CHIP_TEXT: Record<ChipTone, string> = {
  idle: '#334155',
  active: '#ffffff',
  compare: '#ffffff',
  done: '#ffffff',
  count: '#ffffff',
}
const CHIP_RING: Record<ChipTone, string> = {
  idle: '#cbd5e1',
  active: '#0284c7',
  compare: '#d97706',
  done: '#059669',
  count: '#7c3aed',
}
const BOX_STYLE: Record<BoxTone, string> = {
  lane: 'border-dashed border-slate-300',
  bucket: 'border-dashed border-violet-200 bg-violet-50/40',
  count: 'border-solid border-violet-300 bg-white',
  active: 'border-solid border-amber-400 bg-amber-50',
  output: 'border-dashed border-emerald-300',
}

function ChipLabel({ chip }: { chip: FlowChip }) {
  if (chip.emphAt == null) return <>{chip.label}</>
  const i = chip.emphAt
  return (
    <>
      {chip.label.slice(0, i)}
      <span className="underline decoration-2 underline-offset-2">{chip.label[i]}</span>
      {chip.label.slice(i + 1)}
    </>
  )
}

export default function FlowView({ frame, instant }: { frame: Frame; instant?: boolean }) {
  const scene = frame.scene
  // Guard the load race: a frame from another algorithm has no flow scene.
  if (!isFlowScene(scene)) return null
  const dur = instant ? 0 : 0.32

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <div className="relative mx-auto" style={{ width: scene.width, height: scene.height }}>
        {/* static zone boxes (lanes / buckets / count bins) */}
        {scene.boxes.map((b, i) => (
          <div key={`box-${i}`} className="absolute" style={{ left: b.x, top: b.y, width: b.w, height: b.h }}>
            {b.labelTop && (
              <div className="absolute -top-5 left-0 w-full text-center font-mono text-[10px] text-slate-400">
                {b.labelTop}
              </div>
            )}
            <div
              className={`flex h-full w-full items-center justify-center rounded-lg border-2 font-mono text-sm font-bold text-slate-600 ${
                BOX_STYLE[b.tone ?? 'lane']
              }`}
            >
              {b.value ?? ''}
            </div>
            {b.labelBottom && (
              <div className="absolute -bottom-5 left-0 w-full text-center font-mono text-[10px] text-slate-400">
                {b.labelBottom}
              </div>
            )}
          </div>
        ))}

        {/* value chips — one per stable id, animate to (x, y) */}
        {scene.chips.map((c) => {
          const tone = c.tone ?? 'idle'
          return (
            <motion.div
              key={c.id}
              className="absolute flex items-center justify-center rounded-lg font-mono text-sm font-bold"
              initial={{ x: c.x, y: c.y, opacity: 0, scale: 0.6 }}
              animate={{ x: c.x, y: c.y, opacity: 1, scale: 1 }}
              transition={instant ? { duration: 0 } : { duration: dur, ease: 'easeInOut' }}
              style={{
                width: CELL,
                height: CELL,
                background: CHIP_FILL[tone],
                color: CHIP_TEXT[tone],
                border: `2px solid ${CHIP_RING[tone]}`,
              }}
            >
              <ChipLabel chip={c} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
