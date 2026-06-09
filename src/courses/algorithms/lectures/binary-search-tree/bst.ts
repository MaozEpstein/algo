/**
 * Pure pointer-based Binary Search Tree core — no React, no coordinates.
 * Each node carries a STABLE `id` so the BstView can animate a node by identity
 * across frames (a node keeps its id as the tree is restructured by insert/delete).
 * Coordinates (layout) live in `scene.ts`; this file is only the data structure.
 */

export interface BstNode {
  /** Stable identity, e.g. 'n3'. Travels with the node across frames. */
  id: string
  key: number
  left: BstNode | null
  right: BstNode | null
  p: BstNode | null
}

let _seq = 0
/** Fresh, run-local id. Reset per run so frames are deterministic. */
export function resetIds(): void {
  _seq = 0
}
export function newNode(key: number): BstNode {
  return { id: `n${_seq++}`, key, left: null, right: null, p: null }
}

/** Insert a key into a (sub)tree rooted at `root`, returning the new root.
 *  Plain recursive BST insert — used to BUILD the starting tree. */
export function insert(root: BstNode | null, node: BstNode): BstNode {
  if (!root) return node
  let x: BstNode | null = root
  let y: BstNode = root
  while (x) {
    y = x
    x = node.key < x.key ? x.left : x.right
  }
  node.p = y
  if (node.key < y.key) y.left = node
  else y.right = node
  return root
}

/** Build a BST by inserting `keys` left→right. Returns the root (or null). */
export function buildBst(keys: number[]): BstNode | null {
  let root: BstNode | null = null
  for (const k of keys) root = insert(root, newNode(k))
  return root
}

/** Leftmost descendant (minimum) of the subtree rooted at x. */
export function treeMin(x: BstNode): BstNode {
  while (x.left) x = x.left
  return x
}

/** Rightmost descendant (maximum) of the subtree rooted at x. */
export function treeMax(x: BstNode): BstNode {
  while (x.right) x = x.right
  return x
}

/** All nodes in inorder (sorted) order. */
export function inorder(root: BstNode | null): BstNode[] {
  const out: BstNode[] = []
  const rec = (x: BstNode | null) => {
    if (!x) return
    rec(x.left)
    out.push(x)
    rec(x.right)
  }
  rec(root)
  return out
}

/** All nodes (any order — used for layout/rendering). */
export function allNodes(root: BstNode | null): BstNode[] {
  const out: BstNode[] = []
  const rec = (x: BstNode | null) => {
    if (!x) return
    out.push(x)
    rec(x.left)
    rec(x.right)
  }
  rec(root)
  return out
}

/** Height of the subtree (edges on the longest root→leaf path; empty = -1). */
export function height(x: BstNode | null): number {
  if (!x) return -1
  return 1 + Math.max(height(x.left), height(x.right))
}
