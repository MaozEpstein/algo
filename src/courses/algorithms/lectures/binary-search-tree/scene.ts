/**
 * Per-frame bespoke data carried in `Frame.scene` for the BST custom view, plus
 * the layout that turns a pointer tree into screen coordinates. A node's
 * horizontal position is its INORDER index — so left-to-right on screen equals
 * the sorted order, making the BST property visible at a glance.
 */
import { allNodes, inorder, type BstNode } from './bst'

export type NodeTone =
  | 'idle'
  | 'active' // the node the algorithm is focused on (x)
  | 'compare' // on the search path, being compared
  | 'found' // the answer of a search
  | 'inserted' // freshly inserted
  | 'successor' // the computed successor/predecessor
  | 'min' // leftmost / minimum
  | 'max' // rightmost / maximum
  | 'deleted' // being removed
  | 'sorted' // already emitted by the inorder walk
export type EdgeTone = 'normal' | 'active'
export type PointerTone = 'root' | 'x' | 'y' | 'succ'

export interface SceneNode {
  id: string
  key: number
  /** Top-left of the node box. */
  x: number
  y: number
  tone: NodeTone
  /** Dimmed (e.g. NIL target reached, or detached). */
  faded?: boolean
}
export interface SceneEdge {
  /** Absolute centre coordinates. */
  from: { x: number; y: number }
  to: { x: number; y: number }
  tone: EdgeTone
}
export interface ScenePointer {
  label: string
  /** Top-left of the node it points at. */
  x: number
  y: number
  tone: PointerTone
  place?: 'above' | 'below'
}
export interface BstScene {
  kind: 'bst'
  width: number
  height: number
  nodes: SceneNode[]
  edges: SceneEdge[]
  pointers: ScenePointer[]
  /** A NIL slot marker (where a search fell off / where an insert will land). */
  nil?: { x: number; y: number }
}

export const isBstScene = (s: unknown): s is BstScene =>
  !!s && typeof s === 'object' && (s as BstScene).kind === 'bst'

// ---- layout ---------------------------------------------------------------
export const NODE = 46
export const H_PITCH = 62
export const V_PITCH = 76
export const TREE_TOP = 54 // room above the root for the staging chip + pointers
export const PAD_X = 22

export const centreOf = (n: { x: number; y: number }) => ({
  x: n.x + NODE / 2,
  y: n.y + NODE / 2,
})

export interface Layout {
  pos: Map<string, { x: number; y: number; depth: number }>
  width: number
  height: number
}

/** Inorder-index → x, depth → y. Reserves a header band (TREE_TOP). */
export function layout(root: BstNode | null): Layout {
  const pos = new Map<string, { x: number; y: number; depth: number }>()
  const order = inorder(root)
  const idx = new Map(order.map((n, i) => [n.id, i]))
  let maxDepth = 0
  const rec = (x: BstNode | null, depth: number) => {
    if (!x) return
    maxDepth = Math.max(maxDepth, depth)
    const i = idx.get(x.id) ?? 0
    pos.set(x.id, { x: PAD_X + i * H_PITCH, y: TREE_TOP + depth * V_PITCH, depth })
    rec(x.left, depth + 1)
    rec(x.right, depth + 1)
  }
  rec(root, 0)
  const count = Math.max(order.length, 1)
  const width = PAD_X * 2 + (count - 1) * H_PITCH + NODE
  const height = TREE_TOP + maxDepth * V_PITCH + NODE + 26
  return { pos, width, height }
}

export interface BuildSceneOpts {
  root: BstNode | null
  /** Per-node tone; default 'idle'. */
  tone?: (n: BstNode) => NodeTone | undefined
  faded?: (n: BstNode) => boolean
  /** Highlight the edge from a node to one of its children. */
  activeEdge?: { parentId: string; childId: string }
  pointers?: { label: string; node: BstNode | null; tone: PointerTone; place?: 'above' | 'below' }[]
  /** A staging chip not yet in the tree (e.g. the value being inserted). */
  staging?: { id: string; key: number; tone?: NodeTone }
  /** Show a dashed NIL box hanging off `parent` on the given side. */
  nilOf?: { parent: BstNode; side: 'left' | 'right' } | null
}

/** Build a full, self-contained BstScene from the live tree + per-frame decoration. */
export function buildScene(opts: BuildSceneOpts): BstScene {
  const { root } = opts
  const lay = layout(root)
  const nodes: SceneNode[] = []
  const edges: SceneEdge[] = []

  for (const n of allNodes(root)) {
    const p = lay.pos.get(n.id)!
    nodes.push({
      id: n.id,
      key: n.key,
      x: p.x,
      y: p.y,
      tone: opts.tone?.(n) ?? 'idle',
      faded: opts.faded?.(n),
    })
    for (const child of [n.left, n.right]) {
      if (!child) continue
      const cp = lay.pos.get(child.id)!
      const active =
        opts.activeEdge?.parentId === n.id && opts.activeEdge?.childId === child.id
      edges.push({
        from: centreOf(p),
        to: centreOf(cp),
        tone: active ? 'active' : 'normal',
      })
    }
  }

  // staging chip: parked top-centre so it animates down into place on insert.
  if (opts.staging) {
    nodes.push({
      id: opts.staging.id,
      key: opts.staging.key,
      x: lay.width / 2 - NODE / 2,
      y: 4,
      tone: opts.staging.tone ?? 'inserted',
    })
  }

  const pointers: ScenePointer[] = []
  for (const ptr of opts.pointers ?? []) {
    if (!ptr.node) continue
    const p = lay.pos.get(ptr.node.id)
    if (!p) continue
    pointers.push({ label: ptr.label, x: p.x, y: p.y, tone: ptr.tone, place: ptr.place })
  }

  // NIL slot (where a search fell off the tree / an insert will attach).
  let nil: BstScene['nil']
  if (opts.nilOf) {
    const pp = lay.pos.get(opts.nilOf.parent.id)
    if (pp) {
      nil = {
        x: pp.x + (opts.nilOf.side === 'left' ? -H_PITCH * 0.55 : H_PITCH * 0.55),
        y: pp.y + V_PITCH,
      }
    }
  }

  return { kind: 'bst', width: lay.width, height: lay.height, nodes, edges, pointers, nil }
}
