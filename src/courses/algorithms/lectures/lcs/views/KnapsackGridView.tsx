import { motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import { CELL, PAD, cellLeft, cellTop } from '../lcsScene'
import { isKnapScene, type KnapCell } from '../knapsackScene'

/**
 * The 0-1 Knapsack DP table. Rows = items (1..k), columns = capacity (0..W).
 * Each cell K[i][w] is the best value; the current cell glows, the "skip" (up)
 * dependency tints amber and the "take" dependency (diagonal K[i-1][w-wᵢ]) tints
 * emerald; the traceback highlights its path and an items legend marks which
 * items were chosen. Reuses the LCS grid geometry.
 */
const key = (c: KnapCell) => `${c.i},${c.j}`

export default function KnapsackGridView({ frame, instant }: { frame: Frame; instant?: boolean }) {
  const scene = frame.scene
  if (!isKnapScene(scene)) return null
  const { items, W, k, K } = scene
  const dur = instant ? 0 : 0.25

  const gridW = cellLeft(W) + CELL + 10
  const legendTop = cellTop(k) + CELL + 16
  const height = legendTop + k * 24 + 28
  const curKey = scene.cur ? key(scene.cur) : null
  const skipKey = scene.deps?.[0] ? key(scene.deps[0]) : null
  const takeKey = scene.deps?.[1] ? key(scene.deps[1]) : null
  const pathKeys = new Set((scene.path ?? []).map(key))
  const taken = new Set(scene.taken ?? [])
  const centre = (c: KnapCell) => ({ x: cellLeft(c.j) + CELL / 2, y: cellTop(c.i) + CELL / 2 })

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <div className="relative mx-auto" style={{ width: Math.max(gridW, 320), height }}>
        {/* capacity numbers across the top */}
        {Array.from({ length: W + 1 }, (_, j) => j).map((j) => (
          <div key={`cap-${j}`} className="absolute flex items-center justify-center font-mono text-xs font-bold text-sky-300" style={{ left: cellLeft(j), top: 10, width: CELL, height: PAD - 14 }}>
            {j}
          </div>
        ))}
        <div className="absolute font-mono text-[10px] text-slate-400" style={{ left: 4, top: 12 }}>w→</div>

        {/* item index down the left */}
        {Array.from({ length: k }, (_, t) => t + 1).map((i) => (
          <div key={`it-${i}`} className="absolute flex items-center justify-center font-mono text-xs font-bold text-emerald-300" style={{ left: 8, top: cellTop(i), width: PAD - 12, height: CELL }}>
            {i}
          </div>
        ))}

        {/* dependency / move arrow */}
        {scene.arrow && (
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={gridW} height={height}>
            <defs>
              <marker id="knap-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
              </marker>
            </defs>
            <line x1={centre(scene.arrow.from).x} y1={centre(scene.arrow.from).y} x2={centre(scene.arrow.to).x} y2={centre(scene.arrow.to).y} stroke="#6366f1" strokeWidth={2.5} markerEnd="url(#knap-arrow)" />
          </svg>
        )}

        {/* cells */}
        {K.flatMap((row, i) =>
          row.map((val, j) => {
            const kk = `${i},${j}`
            const isCur = kk === curKey
            const filled = val !== null
            let cls = 'border-slate-700 bg-slate-800/40 text-slate-500'
            if (i === 0) cls = 'border-slate-700 bg-slate-800/70 text-slate-400'
            if (filled && i > 0) cls = 'border-slate-600 bg-slate-700 text-white'
            if (pathKeys.has(kk)) cls = 'border-indigo-400 bg-indigo-500/40 text-white'
            if (kk === skipKey) cls = 'border-amber-400 bg-amber-500/25 text-white'
            if (kk === takeKey) cls = 'border-emerald-400 bg-emerald-500/30 text-white'
            return (
              <motion.div
                key={kk}
                className={`absolute flex items-center justify-center rounded-lg border-2 font-mono text-sm font-bold ${cls}`}
                style={{ left: cellLeft(j), top: cellTop(i), width: CELL, height: CELL }}
                animate={isCur ? { boxShadow: '0 0 0 3px #0ea5e9, 0 0 12px #0ea5e9aa', scale: 1.06 } : { boxShadow: 'none', scale: 1 }}
                transition={{ duration: dur }}
              >
                {filled ? val : ''}
              </motion.div>
            )
          }),
        )}

        {/* items legend (marks chosen items) */}
        {items.map((it, idx) => {
          const chosen = taken.has(idx + 1)
          return (
            <div key={`lg-${idx}`} className="absolute flex items-center gap-2 font-mono text-xs" style={{ left: PAD, top: legendTop + idx * 24, width: gridW - PAD }}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${chosen ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{idx + 1}</span>
              <span className="text-slate-300">משקל {it.w}, ערך {it.v}</span>
              {chosen && <span className="text-indigo-300">✓ נבחר</span>}
            </div>
          )
        })}
        {scene.phase === 'back' && (
          <div className="absolute font-mono text-sm font-bold text-indigo-200" style={{ left: PAD, top: legendTop + k * 24 + 2 }}>
            ערך נבחר: {scene.value ?? 0}
          </div>
        )}
      </div>
    </div>
  )
}
