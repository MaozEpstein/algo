import { motion, AnimatePresence } from 'framer-motion'
import type { Frame } from '@/core/engine/types'
import { left } from '@/core/engine/indexing'
import { computeTreeLayout } from './treeLayout'
import { roleForIndex, styleForRole } from './nodeColors'

interface Props {
  frame: Frame
  instant?: boolean
}

/**
 * The binary-tree half of the dual view. Edges are drawn per SLOT (fixed);
 * nodes are keyed by elementId and animated to their current slot position, so
 * a swap makes two values glide past each other. Nodes outside the heap
 * boundary (sorted tail) leave the tree.
 */
export default function TreeView({ frame, instant }: Props) {
  const layout = computeTreeLayout(frame.n)
  const transition = instant
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 24 }

  // The single focused ("current") node — drives the live index-math labels.
  const currentHl = frame.highlights.find((h) => h.role === 'current')
  const current = currentHl && currentHl.indices.length === 1 ? currentHl.indices[0] : null

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="ltr h-full w-full"
      role="img"
      aria-label="עץ בינארי של הערימה"
    >
      {/* edges */}
      {layout.edges.map((e) =>
        e.to <= frame.heapSize ? (
          <line
            key={`edge-${e.to}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="#334155"
            strokeWidth={2}
            strokeLinecap="round"
          />
        ) : null,
      )}

      {/* live index math: 2i / 2i+1 on the current node's child edges */}
      {current != null &&
        layout.edges
          .filter((e) => e.from === current && e.to <= frame.heapSize)
          .map((e) => {
            const mx = (e.x1 + e.x2) / 2
            const my = (e.y1 + e.y2) / 2
            const label = e.to === left(current) ? '2i' : '2i+1'
            const w = label.length * 7 + 10
            return (
              <g key={`im-${e.to}`} transform={`translate(${mx}, ${my})`}>
                <rect x={-w / 2} y={-9} width={w} height={18} rx={6} fill="#0f172a" opacity={0.82} />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontFamily="'JetBrains Mono', monospace"
                  fill="#e2e8f0"
                >
                  {label}
                </text>
              </g>
            )
          })}

      {/* nodes */}
      <AnimatePresence>
        {Array.from({ length: frame.heapSize }, (_, k) => k + 1).map((i) => {
          const id = frame.elementIds[i]
          const pos = layout.posOf(i)
          const role = roleForIndex(frame.highlights, i)
          const st = styleForRole(role)
          return (
            <motion.g
              key={`tree-${id}`}
              initial={{ x: pos.x, y: pos.y, opacity: 0, scale: 0.5 }}
              animate={{ x: pos.x, y: pos.y, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={transition}
            >
              {role && (
                <circle
                  r={layout.radius + 6}
                  fill="none"
                  stroke={st.ring}
                  strokeWidth={3}
                  opacity={0.4}
                />
              )}
              <circle
                r={layout.radius}
                fill={st.fill}
                stroke={st.ring}
                strokeWidth={role ? 3.5 : 2}
                style={{ filter: role ? `drop-shadow(0 0 8px ${st.glow})` : undefined }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={18}
                fontWeight={700}
                fontFamily="'JetBrains Mono', monospace"
                fill={st.text}
              >
                {frame.array[i]}
              </text>
              {/* index badge */}
              <text
                textAnchor="middle"
                y={layout.radius + 16}
                fontSize={11}
                fontFamily="'JetBrains Mono', monospace"
                fill="#64748b"
              >
                {i}
              </text>
              {/* "i" tag anchors the index-math on the current node */}
              {i === current && (
                <text
                  textAnchor="middle"
                  y={-(layout.radius + 10)}
                  fontSize={13}
                  fontWeight={700}
                  fontFamily="'JetBrains Mono', monospace"
                  fill="#0284c7"
                >
                  i
                </text>
              )}
            </motion.g>
          )
        })}
      </AnimatePresence>
    </svg>
  )
}
