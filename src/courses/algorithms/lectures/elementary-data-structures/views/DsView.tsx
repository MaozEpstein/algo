import { motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import {
  CELL,
  isDsScene,
  type ArrowTone,
  type ChipTone,
  type PointerTone,
  type SlotTone,
} from '../scene'

/**
 * One dumb renderer for every lecture-9 demo. The pure generator computes each
 * chip's target (x, y), the static slot boxes, the chain/probe arrows and the
 * top/front/rear/h(k) pointers; here we just draw them and animate each chip
 * (keyed by stable id) to its position — so a key flying into a slot, dropping
 * down a chain, or hopping along a probe sequence is a single layout transition.
 * `instant` (passed by LocalPlayer when scrubbing) skips the motion.
 */
const SLOT_STYLE: Record<SlotTone, string> = {
  empty: 'border-dashed border-slate-300 bg-white',
  occupied: 'border-solid border-sky-300 bg-sky-50',
  probed: 'border-solid border-amber-400 bg-amber-50',
  collision: 'border-solid border-rose-400 bg-rose-50',
  active: 'border-solid border-amber-400 bg-amber-50',
  deleted: 'border-dashed border-slate-300 bg-slate-100 text-slate-400',
}
const CHIP_FILL: Record<ChipTone, string> = {
  idle: '#ffffff',
  active: '#0ea5e9',
  inserted: '#10b981',
  found: '#22c55e',
  collision: '#f43f5e',
  ghost: '#e2e8f0',
}
const CHIP_TEXT: Record<ChipTone, string> = {
  idle: '#334155',
  active: '#ffffff',
  inserted: '#ffffff',
  found: '#ffffff',
  collision: '#ffffff',
  ghost: '#94a3b8',
}
const CHIP_RING: Record<ChipTone, string> = {
  idle: '#cbd5e1',
  active: '#0284c7',
  inserted: '#059669',
  found: '#16a34a',
  collision: '#e11d48',
  ghost: '#cbd5e1',
}
const ARROW_STROKE: Record<ArrowTone, string> = { chain: '#0ea5e9', probe: '#f59e0b' }
const POINTER_STYLE: Record<PointerTone, string> = {
  top: 'text-violet-600',
  front: 'text-sky-600',
  rear: 'text-amber-600',
  hash: 'text-emerald-600',
  probe: 'text-amber-600',
}

export default function DsView({ frame, instant }: { frame: Frame; instant?: boolean }) {
  const scene = frame.scene
  // Guard the load race: a frame from another demo has no DsScene.
  if (!isDsScene(scene)) return null
  const dur = instant ? 0 : 0.32
  const arrows = scene.arrows ?? []
  const pointers = scene.pointers ?? []

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <div className="relative mx-auto" style={{ width: scene.width, height: scene.height }}>
        {/* arrow layer (chain links / probe hops) — behind the chips */}
        {arrows.length > 0 && (
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={scene.width} height={scene.height}>
            <defs>
              <marker id="ds-arrow-chain" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 Z" fill={ARROW_STROKE.chain} />
              </marker>
              <marker id="ds-arrow-probe" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 Z" fill={ARROW_STROKE.probe} />
              </marker>
            </defs>
            {arrows.map((a, i) => {
              const tone = a.tone ?? 'chain'
              return (
                <line
                  key={`arr-${i}`}
                  x1={a.from.x}
                  y1={a.from.y}
                  x2={a.to.x}
                  y2={a.to.y}
                  stroke={ARROW_STROKE[tone]}
                  strokeWidth={2}
                  strokeDasharray={a.dashed ? '4 3' : undefined}
                  markerEnd={`url(#ds-arrow-${tone})`}
                  opacity={0.85}
                />
              )
            })}
          </svg>
        )}

        {/* static slot / cell / bin boxes */}
        {scene.boxes.map((b, i) => (
          <div key={`box-${i}`} className="absolute" style={{ left: b.x, top: b.y, width: b.w, height: b.h }}>
            {b.labelTop && (
              <div className="absolute -top-5 left-0 w-full text-center font-mono text-[10px] text-slate-400">
                {b.labelTop}
              </div>
            )}
            <div
              className={`flex h-full w-full items-center justify-center rounded-lg border-2 font-mono text-sm font-bold text-slate-600 ${
                SLOT_STYLE[b.tone ?? 'empty']
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
              {c.label}
            </motion.div>
          )
        })}

        {/* labelled pointers (top / front / rear / h(k) / probe i) */}
        {pointers.map((p, i) => {
          const below = p.place === 'below'
          return (
            <div
              key={`ptr-${i}`}
              className={`absolute flex flex-col items-center text-[11px] font-bold leading-none ${POINTER_STYLE[p.tone]}`}
              style={{ left: p.x, top: below ? p.y + CELL + 2 : p.y - 22, width: CELL }}
            >
              {below && <span>▲</span>}
              <span className="whitespace-nowrap">{p.label}</span>
              {!below && <span>▼</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
