import { motion } from 'framer-motion'
import type { Frame } from '@/engine/types'
import { roleForIndex, styleForRole } from './nodeColors'

interface Props {
  frame: Frame
  instant?: boolean
  /** Optional click handler (practice mode), receives 1-indexed slot. */
  onCellClick?: (index: number) => void
  clickable?: boolean
}

const CELL = 56
const GAP = 8
const PITCH = CELL + GAP

/**
 * The array half of the dual view. Slot frames + index labels are fixed;
 * value chips are keyed by elementId and slide between slots, so swaps in the
 * tree and the array animate together. Slots past the heap boundary are dimmed
 * (the sorted tail in HeapSort).
 */
export default function ArrayView({ frame, instant, onCellClick, clickable }: Props) {
  const width = frame.n * PITCH - GAP
  const transition = instant
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 24 }

  return (
    <div className="ltr flex w-full justify-center overflow-x-auto py-2">
      <div className="relative" style={{ width, height: CELL + 26 }}>
        {/* fixed slot frames + index labels */}
        {Array.from({ length: frame.n }, (_, k) => k + 1).map((i) => {
          const x = (i - 1) * PITCH
          const inHeap = i <= frame.heapSize
          return (
            <div key={`slot-${i}`} className="absolute" style={{ left: x, top: 0 }}>
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
          return (
            <motion.button
              key={`arr-${id}`}
              type="button"
              disabled={!clickable}
              onClick={() => onCellClick?.(i)}
              className="absolute flex items-center justify-center rounded-xl font-mono text-lg font-bold"
              initial={{ x, opacity: 0, scale: 0.6 }}
              animate={{
                x,
                opacity: inHeap ? 1 : 0.55,
                scale: 1,
              }}
              transition={transition}
              style={{
                top: 0,
                width: CELL,
                height: CELL,
                background: st.fill,
                color: st.text,
                border: `${role && inHeap ? 3 : 2}px solid ${st.ring}`,
                boxShadow: role && inHeap ? `0 0 10px ${st.glow}` : 'none',
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
