import { motion } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import { CELL, GAP, PAD, cellLeft, cellTop, isLcsScene, type Cell } from '../lcsScene'

/**
 * The LCS dynamic-programming table. Rows are labelled by X's characters,
 * columns by Y's (index 0 = the empty prefix ∅). Cells fill in row-major order;
 * the current cell glows, its dependency cells tint (diagonal = emerald on a
 * match, up/left = amber), and during the traceback the path highlights with a
 * move arrow. A strip under the grid shows the LCS recovered so far.
 */
const key = (c: Cell) => `${c.i},${c.j}`

export default function LcsGridView({ frame, instant }: { frame: Frame; instant?: boolean }) {
  const scene = frame.scene
  if (!isLcsScene(scene)) return null
  const { X, Y, m, n, c } = scene
  const dur = instant ? 0 : 0.25

  const width = cellLeft(n) + CELL + 10
  const height = cellTop(m) + CELL + 44 // extra room for the LCS strip below
  const curKey = scene.cur ? key(scene.cur) : null
  const depKeys = new Set((scene.deps ?? []).map(key))
  const pathKeys = new Set((scene.path ?? []).map(key))
  const centre = (cl: Cell) => ({ x: cellLeft(cl.j) + CELL / 2, y: cellTop(cl.i) + CELL / 2 })

  return (
    <div className="ltr w-full overflow-x-auto" dir="ltr">
      <div className="relative mx-auto" style={{ width, height }}>
        {/* Y characters across the top (col j, j≥1) */}
        {Array.from({ length: n }, (_, k) => k + 1).map((j) => (
          <div key={`yc-${j}`} className="absolute flex items-center justify-center font-mono text-sm font-bold text-sky-300" style={{ left: cellLeft(j), top: 8, width: CELL, height: PAD - 12 }}>
            {Y[j - 1]}
          </div>
        ))}
        {/* X characters down the left (row i, i≥1) */}
        {Array.from({ length: m }, (_, k) => k + 1).map((i) => (
          <div key={`xc-${i}`} className="absolute flex items-center justify-center font-mono text-sm font-bold text-emerald-300" style={{ left: 8, top: cellTop(i), width: PAD - 12, height: CELL }}>
            {X[i - 1]}
          </div>
        ))}

        {/* arrow for the current move (traceback) or dependency (fill) */}
        {scene.arrow && (
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={width} height={height}>
            <defs>
              <marker id="lcs-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
              </marker>
            </defs>
            <line
              x1={centre(scene.arrow.from).x}
              y1={centre(scene.arrow.from).y}
              x2={centre(scene.arrow.to).x}
              y2={centre(scene.arrow.to).y}
              stroke="#6366f1"
              strokeWidth={2.5}
              markerEnd="url(#lcs-arrow)"
            />
          </svg>
        )}

        {/* the cells */}
        {c.flatMap((row, i) =>
          row.map((val, j) => {
            const k = `${i},${j}`
            const isCur = k === curKey
            const isDep = depKeys.has(k)
            const onPath = pathKeys.has(k)
            const filled = val !== null
            let cls = 'border-slate-700 bg-slate-800/40 text-slate-500'
            if (i === 0 || j === 0) cls = 'border-slate-700 bg-slate-800/70 text-slate-400'
            if (filled && i > 0 && j > 0) cls = 'border-slate-600 bg-slate-700 text-white'
            if (onPath) cls = 'border-indigo-400 bg-indigo-500/40 text-white'
            if (isDep) cls = scene.match ? 'border-emerald-400 bg-emerald-500/30 text-white' : 'border-amber-400 bg-amber-500/25 text-white'
            return (
              <motion.div
                key={k}
                className={`absolute flex items-center justify-center rounded-lg border-2 font-mono text-base font-bold ${cls}`}
                style={{ left: cellLeft(j), top: cellTop(i), width: CELL, height: CELL }}
                animate={isCur ? { boxShadow: '0 0 0 3px #0ea5e9, 0 0 12px #0ea5e9aa', scale: 1.06 } : { boxShadow: 'none', scale: 1 }}
                transition={{ duration: dur }}
              >
                {filled ? val : ''}
              </motion.div>
            )
          }),
        )}

        {/* running LCS strip */}
        <div className="absolute font-mono text-sm" style={{ left: PAD, top: cellTop(m) + CELL + GAP + 6 }}>
          <span className="text-slate-400">LCS: </span>
          <span className="rounded bg-indigo-500/30 px-2 py-0.5 font-bold tracking-widest text-indigo-200">{scene.lcs || '∅'}</span>
        </div>
      </div>
    </div>
  )
}
