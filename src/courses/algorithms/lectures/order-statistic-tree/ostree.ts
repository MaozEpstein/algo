/**
 * Order-statistic queries on an augmented red-black tree (CLRS ch. 14). Pure +
 * traced, reusing lesson 11's RbTree/RbStep/Tracer. Both read the `size` field
 * maintained by rbtree.ts; neither mutates the tree.
 */
import { isNil, type RbNode, type RbTree, type Tracer } from '../red-black-tree/rbtree'

const noop: Tracer = () => {}

/** OS-Select: return the node holding the i-th smallest key (1-indexed). */
export function osSelect(T: RbTree, i: number, trace: Tracer = noop): RbNode {
  const target = i // the original query index (i is decremented as we go right)
  let x = T.root
  while (!isNil(T, x)) {
    const r = x.left.size + 1 // rank of x within its own subtree
    trace({ block: 'osSelect', code: 2, he: `בצומת ${x.key}: r = size[left]+1 = ${x.left.size}+1 = ${r} (הדרגה של ${x.key} בתת-העץ).`, roles: { x } })
    if (i === r) {
      trace({ block: 'osSelect', code: 3, he: `i = r = ${r} → ${x.key} הוא האיבר ה-${target} בגודלו! עלות: O(log n).`, roles: { x }, done: true })
      return x
    }
    if (i < r) {
      trace({ block: 'osSelect', code: 4, he: `i=${i} < r=${r} → האיבר נמצא בתת-העץ השמאלי. ממשיכים שמאלה.`, roles: { x } })
      x = x.left
    } else {
      trace({ block: 'osSelect', code: 5, he: `i=${i} > r=${r} → פונים ימינה ומורידים ${r} מ-i (i ← ${i - r}).`, roles: { x } })
      i -= r
      x = x.right
    }
  }
  trace({ block: 'osSelect', code: 1, he: `i מחוץ לטווח — אין איבר כזה.`, roles: {}, done: true })
  return T.NIL
}

/** OS-Rank: return the rank (1-indexed position in sorted order) of node x. */
export function osRank(T: RbTree, x: RbNode, trace: Tracer = noop): number {
  let r = x.left.size + 1
  trace({ block: 'osRank', code: 2, he: `r = size[left[x]]+1 = ${x.left.size}+1 = ${r} (כמה איברים ≤ ${x.key} בתת-העץ שלו).`, roles: { x } })
  let y = x
  while (y !== T.root) {
    if (y === y.p.right) {
      r += y.p.left.size + 1
      trace({ block: 'osRank', code: 5, he: `${y.key} הוא ילד ימני של ${y.p.key} → מוסיפים size[left]+1 = ${y.p.left.size}+1. כעת r = ${r}.`, roles: { x: y, w: y.p } })
    } else {
      trace({ block: 'osRank', code: 6, he: `${y.key} הוא ילד שמאלי של ${y.p.key} → לא מוסיפים דבר; מטפסים מעלה.`, roles: { x: y, w: y.p } })
    }
    y = y.p
  }
  trace({ block: 'osRank', code: 7, he: `הגענו לשורש. הדרגה של ${x.key} היא ${r}. עלות: O(log n).`, roles: { x }, done: true })
  return r
}
