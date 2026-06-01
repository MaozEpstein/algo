import { motion } from 'framer-motion'
import type { Frame, Marker } from '@/core/engine/types'
import { roleForIndex, styleForRole } from './nodeColors'

interface Props {
  frame: Frame
  instant?: boolean
  /** Optional click handler, receives 1-indexed slot. */
  onCellClick?: (index: number) => void
  clickable?: boolean
}

const CELL = 56
const GAP = 8
const PITCH = CELL + GAP

const TONE: Record<Marker['tone'], string> = {
  pivot: '#a855f7',
  i: '#0284c7',
  j: '#f59e0b',
  bound: '#64748b',
  k: '#10b981',
}

/**
 * The array view. Slot frames + index labels are fixed; value chips are keyed by
 * elementId and slide between slots, so swaps animate. Two optional layers:
 *  - pointer markers above cells (Quicksort i / j / pivot), from frame.markers;
 *  - dimming of cells outside the heap boundary (HeapSort tail) OR outside the
 *    active subarray (Quicksort), so the focus region stands out.
 */
export default function ArrayView({ frame, instant, onCellClick, clickable }: Props) {
  const width = frame.n * PITCH - GAP
  const transition = instant
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 24 }

  const markers = frame.markers ?? []
  const MARK_H = markers.length ? 34 : 0
  const byIndex = new Map<number, Marker[]>()
  markers.forEach((m) => {
    const arr = byIndex.get(m.index) ?? []
    arr.push(m)
    byIndex.set(m.index, arr)
  })

  const activeHl = frame.highlights.find((h) => h.role === 'active')
  const inActive = (i: number) => !activeHl || activeHl.indices.includes(i)

  return (
    <div className="ltr flex w-full justify-center overflow-x-auto py-2">
      <div className="relative" style={{ width, height: MARK_H + CELL + 26 }}>
        {/* pointer markers (Quicksort) */}
        {[...byIndex.entries()].map(([idx, ms]) => (
          <div
            key={`mk-${idx}`}
            className="absolute flex flex-col items-center justify-end gap-0.5"
            style={{ left: (idx - 1) * PITCH, top: 0, width: CELL, height: MARK_H }}
          >
            {ms.map((m, k) => (
              <span
                key={k}
                className="rounded px-1.5 text-[10px] font-bold leading-tight text-white"
                style={{ background: TONE[m.tone] }}
              >
                {m.label}
              </span>
            ))}
            <span className="text-[9px] leading-none" style={{ color: TONE[ms[0].tone] }}>
              ▼
            </span>
          </div>
        ))}

        {/* fixed slot frames + index labels */}
        {Array.from({ length: frame.n }, (_, k) => k + 1).map((i) => {
          const x = (i - 1) * PITCH
          const inHeap = i <= frame.heapSize
          return (
            <div key={`slot-${i}`} className="absolute" style={{ left: x, top: MARK_H }}>
              <div
                className="rounded-xl border-2 border-dashed"
                style={{
                  width: CELL,
                  height: CELL,
                  borderColor: inHeap ? '#334155' : '#1e293b',
                  background: inHeap ? 'rgba(148,163,184,0.06)' : 'rgba(52,211,153,0.05)',
                }}
              />
              <div
                className="mt-1 text-center font-mono text-[11px]"
                style={{ width: CELL, color: '#64748b' }}
              >
                {i}
              </div>
            </div>
          )
        })}

        {/* value chips keyed by identity */}
        {Array.from({ length: frame.n }, (_, k) => k + 1).map((i) => {
          const id = frame.elementIds[i]
          const x = (i - 1) * PITCH
          const role = roleForIndex(frame.highlights, i)
          const inHeap = i <= frame.heapSize
          const st = styleForRole(inHeap ? role : 'sorted')
          const emphasized = !!role && role !== 'active' && inHeap
          let opacity = 1
          if (!inHeap) opacity = 0.55 // HeapSort sorted tail
          else if (!inActive(i) && role !== 'sorted') opacity = 0.35 // Quicksort inactive subarray
          return (
            <motion.button
              key={`arr-${id}`}
              type="button"
              disabled={!clickable}
              onClick={() => onCellClick?.(i)}
              className="absolute flex items-center justify-center rounded-xl font-mono text-lg font-bold"
              initial={{ x, opacity: 0, scale: 0.6 }}
              animate={{ x, opacity, scale: 1 }}
              transition={transition}
              style={{
                top: MARK_H,
                width: CELL,
                height: CELL,
                background: st.fill,
                color: st.text,
                border: `${emphasized ? 3 : 2}px solid ${st.ring}`,
                boxShadow: emphasized ? `0 0 10px ${st.glow}` : 'none',
                cursor: clickable ? 'pointer' : 'default',
              }}
            >
              {frame.array[i]}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
