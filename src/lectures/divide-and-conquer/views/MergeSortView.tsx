import { motion } from 'framer-motion'
import type { Frame } from '@/engine/types'
import { roleForIndex, styleForRole } from '@/viz/nodeColors'
import { usePlayerStore } from '@/shell/player/usePlayerStore'
import { rangeKey, type MergeScene } from '../scene'

const CELL = 46
const PITCH = 58
const OUT_Y = CELL + 70 // vertical gap between the array row and the output row

// ---- recursion tree -------------------------------------------------------
const TW = 26 // tree column width per leaf
const LEVEL_H = 50

interface TNode {
  lo: number
  hi: number
  depth: number
  cx: number // center x, px
}

function buildTree(n: number): { nodes: TNode[]; maxDepth: number } {
  const nodes: TNode[] = []
  let maxDepth = 0
  const rec = (lo: number, hi: number, depth: number) => {
    maxDepth = Math.max(maxDepth, depth)
    const cx = ((lo - 1 + (hi - 1)) / 2) * TW + TW / 2
    nodes.push({ lo, hi, depth, cx })
    if (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      rec(lo, mid, depth + 1)
      rec(mid + 1, hi, depth + 1)
    }
  }
  rec(1, n, 0)
  return { nodes, maxDepth }
}

function RecursionTree({ frame, scene }: { frame: Frame; scene: MergeScene }) {
  const { nodes, maxDepth } = buildTree(frame.n)
  const width = frame.n * TW
  const height = (maxDepth + 1) * LEVEL_H
  const childTop = (depth: number) => depth * LEVEL_H

  return (
    <div className="ltr relative mx-auto" style={{ width, height }} dir="ltr">
      <svg className="absolute inset-0" width={width} height={height}>
        {nodes
          .filter((nd) => nd.lo < nd.hi)
          .flatMap((nd) => {
            const mid = Math.floor((nd.lo + nd.hi) / 2)
            const kids = [
              { lo: nd.lo, hi: mid },
              { lo: mid + 1, hi: nd.hi },
            ]
            return kids.map((kc) => {
              const ccx = ((kc.lo - 1 + (kc.hi - 1)) / 2) * TW + TW / 2
              return (
                <line
                  key={`${nd.lo}-${nd.hi}->${kc.lo}-${kc.hi}`}
                  x1={nd.cx}
                  y1={childTop(nd.depth) + 30}
                  x2={ccx}
                  y2={childTop(nd.depth + 1) + 4}
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
              )
            })
          })}
      </svg>
      {nodes.map((nd) => {
        const key = rangeKey(nd.lo, nd.hi)
        const active = scene.active && scene.active.lo === nd.lo && scene.active.hi === nd.hi
        const done = scene.done.includes(key)
        const cls = active
          ? scene.phase === 'merge'
            ? 'border-amber-400 bg-amber-50 shadow'
            : 'border-sky-400 bg-sky-50 shadow'
          : done
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-200 bg-white'
        const left = (nd.lo - 1) * TW
        const w = (nd.hi - nd.lo + 1) * TW
        return (
          <div
            key={key}
            className={`absolute flex items-center justify-center gap-px rounded-md border px-0.5 ${cls}`}
            style={{ left, top: childTop(nd.depth), width: w, height: 30 }}
          >
            {Array.from({ length: nd.hi - nd.lo + 1 }, (_, t) => nd.lo + t).map((idx) => {
              const v = frame.array[idx]
              return (
                <span
                  key={idx}
                  className="font-mono text-[10px] font-semibold text-slate-700"
                  style={{ opacity: Number.isNaN(v) ? 0.2 : 1 }}
                >
                  {Number.isNaN(v) ? '·' : v}
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ---- array + output lane (the fly) ----------------------------------------
interface Chip {
  id: string
  x: number
  y: number
  value: number
  fill: string
  text: string
  ring: string
}

export default function MergeSortView({ frame }: { frame: Frame }) {
  // Speed-aware so a value's "fly" to the output finishes before the next frame
  // (auto-advance ≈ 1100/speed ms); instant when scrubbing.
  const speed = usePlayerStore((s) => s.speed)
  const jumped = usePlayerStore((s) => s.jumped)
  const flyDur = jumped ? 0 : Math.min(0.5, ((1100 / speed) / 1000) * 0.8)

  const scene = frame.scene as MergeScene | undefined
  // Guard the load race: a frame from a different algorithm has no merge scene.
  if (!scene || !Array.isArray(scene.done)) return null
  const aux = frame.aux
  const auxLen = aux ? aux.array.length - 1 : 0
  const hasAux = auxLen > 0 || !!aux

  const chips: Chip[] = []
  for (let i = 1; i <= frame.n; i++) {
    const id = frame.elementIds[i]
    if (!id || Number.isNaN(frame.array[i])) continue
    const role = roleForIndex(frame.highlights, i)
    const st = styleForRole(role ?? 'active')
    chips.push({
      id,
      x: (i - 1) * PITCH,
      y: 0,
      value: frame.array[i],
      fill: role ? st.fill : '#ffffff',
      text: st.text,
      ring: role ? st.ring : '#cbd5e1',
    })
  }
  if (aux) {
    for (let t = 1; t <= auxLen; t++) {
      const st = styleForRole(t === auxLen ? 'comparing' : 'sorted')
      chips.push({
        id: aux.elementIds[t],
        x: (t - 1) * PITCH,
        y: OUT_Y,
        value: aux.array[t],
        fill: st.fill,
        text: st.text,
        ring: st.ring,
      })
    }
  }

  const markers = frame.markers ?? []
  const MARK_H = 26
  const width = frame.n * PITCH - (PITCH - CELL)
  const height = (hasAux ? OUT_Y + CELL : CELL) + MARK_H + 8

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <RecursionTree frame={frame} scene={scene} />

      <div className="ltr w-full overflow-x-auto" dir="ltr">
        <div className="relative mx-auto" style={{ width, height }}>
          {/* markers (i / j) above the array row */}
          {markers.map((m, idx) => (
            <div
              key={`mk-${idx}`}
              className="absolute flex flex-col items-center"
              style={{ left: (m.index - 1) * PITCH, top: 0, width: CELL }}
            >
              <span
                className="rounded px-1.5 text-[10px] font-bold text-white"
                style={{ background: m.tone === 'i' ? '#0284c7' : '#f59e0b' }}
              >
                {m.label}
              </span>
              <span
                className="text-[9px] leading-none"
                style={{ color: m.tone === 'i' ? '#0284c7' : '#f59e0b' }}
              >
                ▼
              </span>
            </div>
          ))}

          {/* array-row slot frames */}
          {Array.from({ length: frame.n }, (_, k) => k + 1).map((i) => (
            <div
              key={`slot-${i}`}
              className="absolute rounded-xl border-2 border-dashed border-slate-300"
              style={{ left: (i - 1) * PITCH, top: MARK_H, width: CELL, height: CELL }}
            />
          ))}

          {/* output-row slots + label */}
          {hasAux && (
            <>
              <div
                className="absolute font-mono text-[11px] text-emerald-600"
                style={{ left: 0, top: MARK_H + OUT_Y - 18 }}
              >
                ↓ פלט (output)
              </div>
              {Array.from(
                { length: scene.active ? scene.active.hi - scene.active.lo + 1 : frame.n },
                (_, k) => k,
              ).map((k) => (
                <div
                  key={`out-${k}`}
                  className="absolute rounded-xl border-2 border-dashed border-emerald-200"
                  style={{ left: k * PITCH, top: MARK_H + OUT_Y, width: CELL, height: CELL }}
                />
              ))}
            </>
          )}

          {/* value chips (one per element id) — animate x/y so they fly to the output */}
          {chips.map((c) => (
            <motion.div
              key={c.id}
              className="absolute flex items-center justify-center rounded-xl font-mono text-lg font-bold"
              initial={{ x: c.x, y: c.y + MARK_H, opacity: 0, scale: 0.6 }}
              animate={{ x: c.x, y: c.y + MARK_H, opacity: 1, scale: 1 }}
              transition={jumped ? { duration: 0 } : { duration: flyDur, ease: 'easeInOut' as const }}
              style={{
                width: CELL,
                height: CELL,
                background: c.fill,
                color: c.text,
                border: `2px solid ${c.ring}`,
              }}
            >
              {c.value}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
