import type { Frame, Step } from '@/core/engine/types'

function currentIndexOf(f: Frame): number | null {
  const h = f.highlights.find((x) => x.role === 'current')
  return h && h.indices.length === 1 ? h.indices[0] : null
}

/** True for a recursion-lecture frame (its scene carries a call stack). */
function hasCallStack(f: Frame): boolean {
  return !!f.scene && Array.isArray((f.scene as { stack?: unknown }).stack)
}

/**
 * Derive high-level navigable steps from the frame stream of the ALGORITHMS
 * course: one chip per Build-Max-Heap node visit, one per HeapSort extraction,
 * one per Quicksort/Merge call, one per Hanoi move, and call/return chips for
 * the recursion lecture. This knows algorithm `codeBlock` names, so it lives in
 * the course (not the core shell). Wired onto each lecture via the registry.
 */
export function deriveAlgorithmSteps(frames: Frame[]): Step[] {
  const steps: Step[] = []
  let extract = 0
  let move = 0
  let bstStep = 0 // BST: count descents / prints / insertions
  frames.forEach((f, i) => {
    if (f.codeBlock === 'buildMaxHeap' && f.codeLine === 3) {
      const node = currentIndexOf(f)
      steps.push({ label: node != null ? `צומת ${node}` : 'בנייה', index: i })
    } else if (f.codeBlock === 'heapSort' && f.codeLine === 3) {
      extract += 1
      steps.push({ label: `שליפה ${extract}`, index: i })
    } else if (f.codeBlock === 'hoarePartition' && f.codeLine === 2) {
      const active = f.highlights.find((h) => h.role === 'active')
      if (active && active.indices.length) {
        const lo = Math.min(...active.indices)
        const hi = Math.max(...active.indices)
        steps.push({ label: `[${lo}..${hi}]`, index: i, ltr: true })
      }
    } else if (f.codeBlock === 'mergeSort' && f.codeLine === 6) {
      // one chip per Merge call — its range is the union of the two halves
      const idxs = f.highlights.flatMap((h) => h.indices)
      if (idxs.length) {
        steps.push({ label: `[${Math.min(...idxs)}..${Math.max(...idxs)}]`, index: i, ltr: true })
      }
    } else if (f.codeBlock === 'hanoi' && f.codeLine === 4) {
      move += 1
      steps.push({ label: `מהלך ${move}`, index: i })
    } else if (f.codeBlock === 'inorderWalk' && f.codeLine === 4) {
      // BST inorder walk (standalone and inside BSTSort): one chip per printed key
      bstStep += 1
      steps.push({ label: `הדפסה ${bstStep}`, index: i })
    } else if (f.codeBlock === 'bstSort' && f.codeLine === 4 && f.phase === 'build') {
      bstStep += 1
      steps.push({ label: `הכנסה ${bstStep}`, index: i })
    } else if (f.codeBlock === 'treeSearch' && f.codeLine === 2) {
      bstStep += 1
      steps.push({ label: `צעד ${bstStep}`, index: i })
    } else if (f.codeBlock === 'treeInsert' && f.codeLine === 5) {
      bstStep += 1
      steps.push({ label: `צעד ${bstStep}`, index: i })
    } else if (
      (f.codeBlock === 'treeMinimum' || f.codeBlock === 'treeMaximum') &&
      f.codeLine === 1
    ) {
      steps.push({ label: f.codeBlock === 'treeMinimum' ? 'מינימום' : 'מקסימום', index: i })
    } else if (
      (f.codeBlock === 'treeSuccessor' || f.codeBlock === 'treeDelete') &&
      f.codeLine === 1
    ) {
      steps.push({ label: 'התחלה', index: i })
    } else if (f.codeBlock === 'rbInsert' && f.codeLine === 11) {
      steps.push({ label: 'עלה אדום', index: i })
    } else if (f.codeBlock === 'rbInsertFixup' && (f.codeLine === 5 || f.codeLine === 8 || f.codeLine === 10)) {
      const c = f.codeLine === 5 ? 1 : f.codeLine === 8 ? 2 : 3
      steps.push({ label: `תיקון ${c}`, index: i })
    } else if (f.codeBlock === 'rbDeleteFixup' && (f.codeLine === 5 || f.codeLine === 7 || f.codeLine === 10 || f.codeLine === 12)) {
      const c = f.codeLine === 5 ? 1 : f.codeLine === 7 ? 2 : f.codeLine === 10 ? 3 : 4
      steps.push({ label: `תיקון ${c}`, index: i })
    } else if ((f.codeBlock === 'leftRotate' || f.codeBlock === 'rightRotate') && f.codeLine === 2) {
      steps.push({ label: f.codeBlock === 'leftRotate' ? 'Left-Rotate' : 'Right-Rotate', index: i, ltr: true })
    } else if (f.codeBlock === 'osSelect' && f.codeLine === 2) {
      bstStep += 1
      steps.push({ label: `צעד ${bstStep}`, index: i })
    } else if (f.codeBlock === 'osRank' && (f.codeLine === 5 || f.codeLine === 6)) {
      bstStep += 1
      steps.push({ label: `טיפוס ${bstStep}`, index: i })
    } else if (hasCallStack(f)) {
      // Recursion lecture: a chip per call entered (↓) and per return (↑ = value).
      const stack = (f.scene as { stack: { callTex: string; returnTex?: string }[] }).stack
      const top = stack[stack.length - 1]
      if (top && f.codeLine === 1) {
        steps.push({ label: top.callTex, index: i, ltr: true, kind: 'call' })
      } else if (top && top.returnTex != null) {
        const val = top.returnTex !== '—' ? ` = ${top.returnTex}` : ''
        steps.push({ label: `${top.callTex}${val}`, index: i, ltr: true, kind: 'return' })
      }
    }
  })
  return steps
}
