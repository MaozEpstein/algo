import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import { isRbScene, NIL_SZ, type NodeTone } from '../rbScene'

/**
 * Renderer for every Red-Black operation. Two independent visual channels:
 * the node FILL encodes the RB color (crimson / near-black), while a glowing
 * RING encodes the algorithm highlight (active / sibling / uncle / …). The
 * black NIL sentinel leaves (property 2) render as small black squares and can
 * be toggled. A node carrying an extra "black" during Delete-Fixup gets a
 * distinct amber double-ring. Nodes animate by stable id, like lesson 10.
 */
const FILL: Record<Color, string> = { red: '#dc2626', black: '#1e293b' }
type Color = 'red' | 'black'

const RING: Record<NodeTone, string | null> = {
  idle: null,
  active: '#0ea5e9',
  compare: '#f59e0b',
  inserted: '#10b981',
  deleted: '#f43f5e',
  sibling: '#8b5cf6',
  uncle: '#a855f7',
  gp: '#f59e0b',
}
const POINTER_STYLE: Record<'z' | 'x' | 'w' | 'uncle', string> = {
  z: 'text-sky-600',
  x: 'text-sky-600',
  w: 'text-violet-600',
  uncle: 'text-fuchsia-600',
}

export default function RbTreeView({ frame, instant }: { frame: Frame; instant?: boolean }) {
  const [showNil, setShowNil] = useState(true)
  const scene = frame.scene
  if (!isRbScene(scene)) return null
  const dur = instant ? 0 : 0.34
  const { width, height } = scene

  if (scene.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[180px] w-full flex-col items-center justify-center gap-2 text-slate-400">
        <span className="text-sm font-medium">העץ ריק (root = NIL)</span>
      </div>
    )
  }

  return (
    <div className="ltr w-full" dir="ltr">
      <div className="mb-1 flex justify-end">
        <button
          onClick={() => setShowNil((s) => !s)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10"
        >
          {showNil ? 'הסתר עלי NIL' : 'הצג עלי NIL'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="relative mx-auto" style={{ width, height }}>
          {/* edges */}
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={width} height={height}>
            {scene.edges.map((e, i) => (
              <motion.line
                key={`edge-${i}`}
                initial={false}
                animate={{ x1: e.from.x, y1: e.from.y, x2: e.to.x, y2: e.to.y }}
                transition={instant ? { duration: 0 } : { duration: dur, ease: 'easeInOut' }}
                stroke="#475569"
                strokeWidth={2}
              />
            ))}
          </svg>

          {/* black NIL sentinel leaves */}
          {showNil &&
            scene.nilLeaves.map((leaf, i) => (
              <div
                key={`nil-${i}`}
                className="absolute flex items-center justify-center rounded-[4px] font-mono text-[8px] font-bold text-slate-300"
                style={{ left: leaf.x + (46 - NIL_SZ) / 2, top: leaf.y, width: NIL_SZ, height: NIL_SZ, background: '#0b1220', border: '1px solid #334155' }}
              >
                NIL
              </div>
            ))}

          {/* nodes — fill by RB color, ring by highlight tone */}
          {scene.nodes.map((n) => {
            const ring = RING[n.tone]
            const shadow = n.doubleBlack
              ? `0 0 0 3px #fff, 0 0 0 6px #f59e0b` // amber double-ring = extra black
              : ring
                ? `0 0 0 3px ${ring}, 0 0 10px ${ring}aa`
                : 'none'
            return (
              <motion.div
                key={n.id}
                className="absolute flex items-center justify-center rounded-full font-mono text-base font-bold text-white"
                initial={{ x: n.x, y: n.y, opacity: 0, scale: 0.5 }}
                animate={{ x: n.x, y: n.y, opacity: 1, scale: 1 }}
                transition={instant ? { duration: 0 } : { duration: dur, ease: 'easeInOut' }}
                style={{
                  width: 46,
                  height: 46,
                  background: FILL[n.color as Color],
                  border: '2px solid rgba(255,255,255,0.55)',
                  boxShadow: shadow,
                }}
              >
                {n.key}
              </motion.div>
            )
          })}

          {/* pointers (z / x / w / uncle) */}
          {scene.pointers.map((p, i) => {
            const below = p.place === 'below'
            return (
              <div
                key={`ptr-${i}-${p.label}`}
                className={`absolute z-10 flex flex-col items-center text-[11px] font-bold leading-none ${POINTER_STYLE[p.tone]}`}
                style={{ left: p.x, top: below ? p.y + 46 + 2 : p.y - 22, width: 46 }}
              >
                {below && <span>▲</span>}
                <span className="whitespace-nowrap">{p.label}</span>
                {!below && <span>▼</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
