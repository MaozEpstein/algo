import { motion } from 'framer-motion'
import type { Frame } from '@/engine/types'
import { usePlayerStore } from '@/shell/player/usePlayerStore'
import type { HanoiScene } from '../scene'

const PEG_W = 168
const DISK_H = 24
const LIFT_Y = 0 // top of the canvas — clears every stack during a move
const PEG_LABEL = ['A', 'B', 'C']
const GOAL = 2 // peg C

export default function HanoiView({ frame }: { frame: Frame }) {
  // Read the player tempo so the move animation always finishes before the next
  // frame (the auto-advance interval is ~1100/speed ms); instant when scrubbing.
  const speed = usePlayerStore((s) => s.speed)
  const jumped = usePlayerStore((s) => s.jumped)
  const moveDur = jumped ? 0 : Math.min(0.5, ((1100 / speed) / 1000) * 0.8)

  const scene = frame.scene as HanoiScene | undefined
  // Guard the load race: a frame from a different algorithm has no pegs.
  if (!scene || !Array.isArray(scene.pegs)) return null
  const { pegs, moving, moves } = scene
  const total = pegs.reduce((s, p) => s + p.length, 0)
  const maxDisk = Math.max(1, total)
  const totalMoves = 2 ** maxDisk - 1

  const minW = 44
  const maxW = PEG_W - 22
  const diskWidth = (size: number) =>
    minW + ((size - 1) / Math.max(1, maxDisk - 1)) * (maxW - minW)

  const baseY = (maxDisk + 1) * DISK_H + 8
  const totalH = baseY + 34
  const totalW = 3 * PEG_W

  interface D {
    size: number
    x: number
    y: number
    w: number
    moving: boolean
  }
  const disks: D[] = []
  pegs.forEach((peg, pi) => {
    peg.forEach((size, s) => {
      const w = diskWidth(size)
      disks.push({
        size,
        w,
        x: pi * PEG_W + (PEG_W - w) / 2,
        y: baseY - (s + 1) * DISK_H,
        moving: !!moving && moving.disk === size,
      })
    })
  })

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* move counter */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-500">מהלכים:</span>
        <span dir="ltr" className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono font-bold text-white">
          {moves} / {totalMoves}
        </span>
      </div>

      <div className="ltr w-full overflow-x-auto" dir="ltr">
        <div className="relative mx-auto" style={{ width: totalW, height: totalH }}>
          {/* posts + base + labels */}
          {PEG_LABEL.map((label, pi) => {
            const cx = pi * PEG_W + PEG_W / 2
            const isGoal = pi === GOAL
            return (
              <div key={label}>
                <div
                  className={`absolute rounded-full ${isGoal ? 'bg-emerald-300' : 'bg-slate-300'}`}
                  style={{ left: cx - 3, top: DISK_H, width: 6, height: baseY - DISK_H }}
                />
                <div
                  className={`absolute rounded ${isGoal ? 'bg-emerald-400' : 'bg-slate-400'}`}
                  style={{ left: pi * PEG_W + 10, top: baseY, width: PEG_W - 20, height: 8 }}
                />
                <div
                  className={`absolute text-center font-mono text-sm font-bold ${
                    isGoal ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                  style={{ left: pi * PEG_W, top: baseY + 12, width: PEG_W }}
                >
                  {label}
                  {isGoal && <span className="ms-1 text-xs font-normal">🎯 יעד</span>}
                </div>
              </div>
            )
          })}

          {/* disks — the moving one lifts up, slides over, and drops */}
          {disks.map((d) => {
            if (d.moving && moving) {
              const fromX = moving.from * PEG_W + (PEG_W - d.w) / 2
              const fromY = baseY - (pegs[moving.from].length + 1) * DISK_H
              return (
                <motion.div
                  key={d.size}
                  className="absolute flex items-center justify-center rounded-full text-xs font-bold text-white"
                  initial={false}
                  animate={{ x: [fromX, fromX, d.x, d.x], y: [fromY, LIFT_Y, LIFT_Y, d.y] }}
                  transition={{ duration: moveDur, times: [0, 0.32, 0.68, 1], ease: 'easeInOut' as const }}
                  style={{
                    width: d.w,
                    height: DISK_H - 4,
                    background: `hsl(${200 + (d.size / maxDisk) * 150}, 68%, 52%)`,
                    boxShadow: '0 0 0 3px #fde68a, 0 6px 14px rgba(0,0,0,0.25)',
                    zIndex: 10,
                  }}
                >
                  {d.size}
                </motion.div>
              )
            }
            return (
              <motion.div
                key={d.size}
                className="absolute flex items-center justify-center rounded-full text-xs font-bold text-white"
                initial={false}
                animate={{ x: d.x, y: d.y }}
                transition={jumped ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 26 }}
                style={{
                  width: d.w,
                  height: DISK_H - 4,
                  background: `hsl(${200 + (d.size / maxDisk) * 150}, 68%, 52%)`,
                  zIndex: 1,
                }}
              >
                {d.size}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
