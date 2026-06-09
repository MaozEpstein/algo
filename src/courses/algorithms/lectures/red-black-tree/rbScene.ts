/**
 * Per-frame bespoke data for the Red-Black custom view. Reuses lesson 10's
 * pointer-tree geometry constants, but is NIL-sentinel-aware (lesson 10's
 * helpers recurse on `null` and would loop on a sentinel). Two visual channels:
 * `color` (the RB color → fill) and `tone` (the algorithm highlight → ring).
 */
import { NODE, H_PITCH, V_PITCH, TREE_TOP, PAD_X, centreOf } from '../binary-search-tree/scene'
import { isNil, type Color, type RbNode, type RbTree } from './rbtree'

export type NodeTone = 'idle' | 'active' | 'compare' | 'inserted' | 'deleted' | 'sibling' | 'uncle' | 'gp'

export interface RbSceneNode {
  id: string
  key: number
  x: number
  y: number
  color: Color
  tone: NodeTone
  doubleBlack?: boolean
}
export interface RbSceneEdge {
  from: { x: number; y: number }
  to: { x: number; y: number }
}
export interface RbNilLeaf {
  /** Top-left of the small black NIL square. */
  x: number
  y: number
}
export interface RbScenePointer {
  label: string
  x: number
  y: number
  tone: 'z' | 'x' | 'w' | 'uncle'
  place?: 'above' | 'below'
}
export interface RbScene {
  kind: 'rb'
  width: number
  height: number
  nodes: RbSceneNode[]
  edges: RbSceneEdge[]
  nilLeaves: RbNilLeaf[]
  pointers: RbScenePointer[]
}

export const isRbScene = (s: unknown): s is RbScene =>
  !!s && typeof s === 'object' && (s as RbScene).kind === 'rb'

export const NIL_SZ = 20
const NIL_DROP = V_PITCH * 0.6
const NIL_SPREAD = H_PITCH * 0.42

interface Pos {
  x: number
  y: number
  depth: number
}

/** Inorder-index → x, depth → y (NIL-sentinel aware). */
function layoutRb(T: RbTree): { pos: Map<string, Pos>; width: number; height: number } {
  const order: RbNode[] = []
  const io = (x: RbNode) => {
    if (isNil(T, x)) return
    io(x.left)
    order.push(x)
    io(x.right)
  }
  io(T.root)
  const idx = new Map(order.map((n, i) => [n.id, i]))
  const pos = new Map<string, Pos>()
  let maxDepth = 0
  const rec = (x: RbNode, depth: number) => {
    if (isNil(T, x)) return
    maxDepth = Math.max(maxDepth, depth)
    pos.set(x.id, { x: PAD_X + (idx.get(x.id) ?? 0) * H_PITCH, y: TREE_TOP + depth * V_PITCH, depth })
    rec(x.left, depth + 1)
    rec(x.right, depth + 1)
  }
  rec(T.root, 0)
  const count = Math.max(order.length, 1)
  const width = PAD_X * 2 + (count - 1) * H_PITCH + NODE
  const height = TREE_TOP + maxDepth * V_PITCH + NODE + NIL_DROP + NIL_SZ + 12
  return { pos, width, height }
}

export interface BuildRbSceneOpts {
  tree: RbTree
  /** Highlight tone per node (default 'idle'). */
  tone?: (n: RbNode) => NodeTone | undefined
  /** Node id carrying an extra "black" (delete-fixup). */
  doubleBlackId?: string
  pointers?: { label: string; node?: RbNode; tone: RbScenePointer['tone']; place?: 'above' | 'below' }[]
  /** Render the black NIL sentinel leaves. */
  showNil?: boolean
}

export function buildRbScene(opts: BuildRbSceneOpts): RbScene {
  const { tree: T } = opts
  const lay = layoutRb(T)
  const nodes: RbSceneNode[] = []
  const edges: RbSceneEdge[] = []
  const nilLeaves: RbNilLeaf[] = []

  const real: RbNode[] = []
  const rec = (x: RbNode) => {
    if (isNil(T, x)) return
    real.push(x)
    rec(x.left)
    rec(x.right)
  }
  rec(T.root)

  for (const n of real) {
    const p = lay.pos.get(n.id)!
    nodes.push({
      id: n.id,
      key: n.key,
      x: p.x,
      y: p.y,
      color: n.color,
      tone: opts.tone?.(n) ?? 'idle',
      doubleBlack: opts.doubleBlackId === n.id,
    })
    for (const child of [n.left, n.right] as const) {
      if (!isNil(T, child)) {
        edges.push({ from: centreOf(p), to: centreOf(lay.pos.get(child.id)!) })
      } else if (opts.showNil) {
        const side = child === n.left ? -1 : 1
        nilLeaves.push({ x: p.x + side * NIL_SPREAD, y: p.y + NIL_DROP })
      }
    }
  }
  // Empty tree: one lone NIL where the root would be.
  if (real.length === 0 && opts.showNil) nilLeaves.push({ x: PAD_X, y: TREE_TOP })

  const pointers: RbScenePointer[] = []
  for (const ptr of opts.pointers ?? []) {
    if (!ptr.node || isNil(T, ptr.node)) continue
    const p = lay.pos.get(ptr.node.id)
    if (!p) continue
    pointers.push({ label: ptr.label, x: p.x, y: p.y, tone: ptr.tone, place: ptr.place })
  }

  return { kind: 'rb', width: lay.width, height: lay.height, nodes, edges, nilLeaves, pointers }
}
