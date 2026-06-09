import { motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import {
  centreOf,
  isBstScene,
  NODE,
  type EdgeTone,
  type NodeTone,
  type PointerTone,
} from '../scene'

/**
 * One renderer for every BST operation. The pure generator computes each node's
 * target (x, y) from the live pointer tree (inorder index → x, depth → y), the
 * parent→child edges, the trailing/root/successor pointers and an optional NIL
 * slot; here we just draw them and animate each node (keyed by its stable id) to
 * its position — so a node sliding as the tree restructures, or a freshly
 * inserted key dropping into place, is a single layout transition.
 * `instant` (passed by the player when scrubbing) skips the motion.
 */
const NODE_FILL: Record<NodeTone, string> = {
  idle: '#ffffff',
  active: '#0ea5e9',
  compare: '#f59e0b',
  found: '#22c55e',
  inserted: '#10b981',
  successor: '#8b5cf6',
  min: '#0ea5e9',
  max: '#0ea5e9',
  deleted: '#f43f5e',
  sorted: '#34d399',
}
const NODE_TEXT: Record<NodeTone, string> = {
  idle: '#334155',
  active: '#ffffff',
  compare: '#ffffff',
  found: '#ffffff',
  inserted: '#ffffff',
  successor: '#ffffff',
  min: '#ffffff',
  max: '#ffffff',
  deleted: '#ffffff',
  sorted: '#ffffff',
}
const NODE_RING: Record<NodeTone, string> = {
  idle: '#cbd5e1',
  active: '#0284c7',
  compare: '#d97706',
  found: '#16a34a',
  inserted: '#059669',
  successor: '#7c3aed',
  min: '#0284c7',
  max: '#0284c7',
  deleted: '#e11d48',
  sorted: '#10b981',
}
const EDGE_STROKE: Record<EdgeTone, string> = { normal: '#cbd5e1', active: '#0ea5e9' }
const POINTER_STYLE: Record<PointerTone, string> = {
  root: 'text-slate-500',
  x: 'text-sky-600',
  y: 'text-amber-600',
  succ: 'text-violet-600',
}

export default function BstView({ frame, instant }: { frame: Frame; instant?: boolean }) {
  const scene = frame.scene
  // Guard the load race: a frame from another algorithm has no BST scene.
  if (!isBstScene(scene)) return null
  const dur = instant ? 0 : 0.34
  const { width, height } = scene

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <div className="relative mx-auto" style={{ width, height }}>
        {/* edge layer — behind the nodes */}
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={width}
          height={height}
        >
          {scene.edges.map((e, i) => (
            <motion.line
              key={`edge-${i}`}
              initial={false}
              animate={{ x1: e.from.x, y1: e.from.y, x2: e.to.x, y2: e.to.y }}
              transition={instant ? { duration: 0 } : { duration: dur, ease: 'easeInOut' }}
              stroke={EDGE_STROKE[e.tone]}
              strokeWidth={e.tone === 'active' ? 3 : 2}
            />
          ))}
        </svg>

        {/* NIL slot (search fell off / insert target) */}
        {scene.nil && (
          <div
            className="absolute flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 font-mono text-[11px] text-slate-400"
            style={{ left: scene.nil.x, top: scene.nil.y, width: NODE, height: NODE }}
          >
            NIL
          </div>
        )}

        {/* nodes — one per stable id, animate to (x, y) */}
        {scene.nodes.map((n) => (
          <motion.div
            key={n.id}
            className="absolute flex items-center justify-center rounded-full font-mono text-base font-bold shadow-sm"
            initial={{ x: n.x, y: n.y, opacity: 0, scale: 0.5 }}
            animate={{ x: n.x, y: n.y, opacity: n.faded ? 0.35 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={instant ? { duration: 0 } : { duration: dur, ease: 'easeInOut' }}
            style={{
              width: NODE,
              height: NODE,
              background: NODE_FILL[n.tone],
              color: NODE_TEXT[n.tone],
              border: `2px solid ${NODE_RING[n.tone]}`,
            }}
          >
            {n.key}
          </motion.div>
        ))}

        {/* labelled pointers (root / x / y / succ) */}
        {scene.pointers.map((p, i) => {
          const below = p.place === 'below'
          return (
            <div
              key={`ptr-${i}-${p.label}`}
              className={`absolute z-10 flex flex-col items-center text-[11px] font-bold leading-none ${POINTER_STYLE[p.tone]}`}
              style={{ left: p.x, top: below ? p.y + NODE + 2 : p.y - 22, width: NODE }}
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

// re-exported for any caller needing the node centre helper alongside the view
export { centreOf }
