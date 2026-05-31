import { depthOf, parent } from '@/engine/indexing'

export interface NodePos {
  index: number
  x: number
  y: number
}

export interface Edge {
  from: number
  to: number
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface TreeLayout {
  width: number
  height: number
  radius: number
  nodes: NodePos[] // indices 1..n
  edges: Edge[]
  posOf: (index: number) => NodePos
}

const RADIUS = 24
const LEVEL_HEIGHT = 92
const TOP = 36
const SIDE = 24

/**
 * Closed-form layout of a complete binary tree (1-indexed). The root is
 * centered; for node i: depth = ⌊log2 i⌋, position-in-level = i − 2^depth,
 * x spreads that level evenly across the width. Index grows left→right so the
 * tree agrees with the array view.
 */
export function computeTreeLayout(n: number): TreeLayout {
  const maxDepth = n >= 1 ? depthOf(n) : 0
  const bottomSlots = Math.pow(2, maxDepth)
  const slotW = RADIUS * 2.4
  const width = SIDE * 2 + bottomSlots * slotW
  const height = TOP * 2 + maxDepth * LEVEL_HEIGHT + RADIUS * 2

  const nodes: NodePos[] = []
  const byIndex = new Map<number, NodePos>()
  for (let i = 1; i <= n; i++) {
    const depth = depthOf(i)
    const levelCount = Math.pow(2, depth)
    const posInLevel = i - levelCount
    const x = SIDE + ((posInLevel + 0.5) / levelCount) * (width - SIDE * 2)
    const y = TOP + RADIUS + depth * LEVEL_HEIGHT
    const node = { index: i, x, y }
    nodes.push(node)
    byIndex.set(i, node)
  }

  const edges: Edge[] = []
  for (let i = 2; i <= n; i++) {
    const p = byIndex.get(parent(i))!
    const c = byIndex.get(i)!
    edges.push({ from: parent(i), to: i, x1: p.x, y1: p.y, x2: c.x, y2: c.y })
  }

  const posOf = (index: number): NodePos =>
    byIndex.get(index) ?? { index, x: width / 2, y: TOP }

  return { width, height, radius: RADIUS, nodes, edges, posOf }
}
