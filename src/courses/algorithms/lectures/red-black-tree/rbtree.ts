/**
 * Pure Red-Black tree core (CLRS ch. 13) — no React, no coordinates.
 * Uses a single shared black NIL sentinel per tree (leaves + root's parent),
 * exactly as CLRS does, so RB-Delete-Fixup can set x.p even when x is NIL.
 *
 * Every mutating op accepts an optional `trace` callback invoked at each
 * meaningful step (with the active code line, a Hebrew narration, the role→node
 * map and a case label). The guided generators pass a tracer that emits a frame;
 * `buildRbTree` and the tests pass none. ONE implementation — no divergence.
 */

export type Color = 'red' | 'black'

export interface RbNode {
  id: string
  key: number
  color: Color
  left: RbNode
  right: RbNode
  p: RbNode
}

export interface RbTree {
  root: RbNode
  NIL: RbNode
}

/** A single step in a traced RB operation — enough to render one frame. */
export interface RbStep {
  block: string
  code: number | null
  he: string
  /** Named roles to highlight: z (focus), y, x, w (sibling), uncle, gp, … */
  roles?: Record<string, RbNode | undefined>
  caseLabel?: string
  /** Mark the current node as carrying an extra "black" (delete-fixup). */
  doubleBlack?: RbNode
  done?: boolean
}
export type Tracer = (s: RbStep) => void
const noop: Tracer = () => {}

let _seq = 0
export function resetIds(): void {
  _seq = 0
}

export function makeTree(): RbTree {
  const NIL: RbNode = {
    id: 'nil',
    key: NaN,
    color: 'black',
    left: null as unknown as RbNode,
    right: null as unknown as RbNode,
    p: null as unknown as RbNode,
  }
  NIL.left = NIL
  NIL.right = NIL
  NIL.p = NIL
  return { root: NIL, NIL }
}

export function newNode(T: RbTree, key: number, color: Color = 'red'): RbNode {
  return { id: `r${_seq++}`, key, color, left: T.NIL, right: T.NIL, p: T.NIL }
}

export const isNil = (T: RbTree, x: RbNode): boolean => x === T.NIL

// ---- rotations (CLRS p. 313) ----------------------------------------------
export function leftRotate(T: RbTree, x: RbNode, trace: Tracer = noop): void {
  const y = x.right // set y
  trace({ block: 'leftRotate', code: 2, he: `Left-Rotate סביב ${x.key}: y = הילד הימני (${y.key}).`, roles: { x, y } })
  x.right = y.left // turn y's left subtree into x's right subtree
  if (!isNil(T, y.left)) y.left.p = x
  y.p = x.p // link x's parent to y
  if (isNil(T, x.p)) T.root = y
  else if (x === x.p.left) x.p.left = y
  else x.p.right = y
  y.left = x // put x on y's left
  x.p = y
  trace({ block: 'leftRotate', code: 10, he: `הסיבוב הושלם — הסדר התוך-סדרי נשמר.`, roles: { x, y } })
}

export function rightRotate(T: RbTree, x: RbNode, trace: Tracer = noop): void {
  const y = x.left // set y (mirror of leftRotate)
  trace({ block: 'rightRotate', code: 2, he: `Right-Rotate סביב ${x.key}: y = הילד השמאלי (${y.key}).`, roles: { x, y } })
  x.left = y.right
  if (!isNil(T, y.right)) y.right.p = x
  y.p = x.p
  if (isNil(T, x.p)) T.root = y
  else if (x === x.p.right) x.p.right = y
  else x.p.left = y
  y.right = x
  x.p = y
  trace({ block: 'rightRotate', code: 10, he: `הסיבוב הושלם — הסדר התוך-סדרי נשמר.`, roles: { x, y } })
}

// ---- insert (CLRS p. 315) -------------------------------------------------
export function rbInsert(T: RbTree, key: number, trace: Tracer = noop): RbNode {
  const z = newNode(T, key)
  let y = T.NIL
  let x = T.root
  trace({ block: 'rbInsert', code: 3, he: `מכניסים מפתח חדש z=${key}. נחפש את מקומו כמו ב-BST.`, roles: { z, x } })
  while (!isNil(T, x)) {
    y = x
    if (z.key < x.key) {
      trace({ block: 'rbInsert', code: 5, he: `z=${key} < ${x.key} ← פונים שמאלה.`, roles: { z, x, y } })
      x = x.left
    } else {
      trace({ block: 'rbInsert', code: 6, he: `z=${key} ≥ ${x.key} ← פונים ימינה.`, roles: { z, x, y } })
      x = x.right
    }
  }
  z.p = y
  if (isNil(T, y)) T.root = z
  else if (z.key < y.key) y.left = z
  else y.right = z
  z.left = T.NIL
  z.right = T.NIL
  z.color = 'red'
  trace({ block: 'rbInsert', code: 11, he: `מציבים את ${key} כעלה אדום (z.color = RED).`, roles: { z } })
  rbInsertFixup(T, z, trace)
  return z
}

function rbInsertFixup(T: RbTree, z: RbNode, trace: Tracer): void {
  trace({ block: 'rbInsertFixup', code: 2, he: `תיקון: כל עוד ל-z יש הורה אדום, תכונה 3 מופרת.`, roles: { z } })
  while (z.p.color === 'red') {
    if (z.p === z.p.p.left) {
      const y = z.p.p.right // uncle
      if (y.color === 'red') {
        // case 1: uncle red → recolor, move up
        trace({ block: 'rbInsertFixup', code: 5, caseLabel: '1', he: `מקרה 1: הדוד (${y.key}) אדום → צובעים הורה+דוד בשחור, סבא באדום, וממשיכים מהסבא.`, roles: { z, uncle: y, gp: z.p.p } })
        z.p.color = 'black'
        y.color = 'black'
        z.p.p.color = 'red'
        z = z.p.p
      } else {
        if (z === z.p.right) {
          // case 2: triangle → left-rotate to a line
          trace({ block: 'rbInsertFixup', code: 8, caseLabel: '2', he: `מקרה 2: הדוד שחור ו-z ילד ימני ("משולש") → Left-Rotate להפיכה למקרה 3.`, roles: { z, uncle: y, gp: z.p.p } })
          z = z.p
          leftRotate(T, z, trace)
        }
        // case 3: line → recolor + right-rotate
        trace({ block: 'rbInsertFixup', code: 10, caseLabel: '3', he: `מקרה 3: הדוד שחור ו-z ילד שמאלי ("קו ישר") → צובעים מחדש ומסובבים ימינה את הסבא.`, roles: { z, gp: z.p.p } })
        z.p.color = 'black'
        z.p.p.color = 'red'
        rightRotate(T, z.p.p, trace)
      }
    } else {
      // mirror: parent is a right child
      const y = z.p.p.left
      if (y.color === 'red') {
        trace({ block: 'rbInsertFixup', code: 5, caseLabel: '1', he: `מקרה 1 (מראה): הדוד (${y.key}) אדום → צביעה מחדש, ממשיכים מהסבא.`, roles: { z, uncle: y, gp: z.p.p } })
        z.p.color = 'black'
        y.color = 'black'
        z.p.p.color = 'red'
        z = z.p.p
      } else {
        if (z === z.p.left) {
          trace({ block: 'rbInsertFixup', code: 8, caseLabel: '2', he: `מקרה 2 (מראה): הדוד שחור ו-z ילד שמאלי → Right-Rotate להפיכה למקרה 3.`, roles: { z, uncle: y, gp: z.p.p } })
          z = z.p
          rightRotate(T, z, trace)
        }
        trace({ block: 'rbInsertFixup', code: 10, caseLabel: '3', he: `מקרה 3 (מראה): צביעה מחדש ו-Left-Rotate על הסבא.`, roles: { z, gp: z.p.p } })
        z.p.color = 'black'
        z.p.p.color = 'red'
        leftRotate(T, z.p.p, trace)
      }
    }
  }
  T.root.color = 'black'
  trace({ block: 'rbInsertFixup', code: 13, he: `צובעים את השורש בשחור (תכונה 5). העץ תקין שוב.`, roles: { z: T.root }, done: true })
}

// ---- delete (CLRS p. 324) -------------------------------------------------
function transplant(T: RbTree, u: RbNode, v: RbNode): void {
  if (isNil(T, u.p)) T.root = v
  else if (u === u.p.left) u.p.left = v
  else u.p.right = v
  v.p = u.p
}

export function treeMinimum(T: RbTree, x: RbNode): RbNode {
  while (!isNil(T, x.left)) x = x.left
  return x
}

/** Find a node by key (NIL if absent). */
export function find(T: RbTree, key: number): RbNode {
  let x = T.root
  while (!isNil(T, x) && x.key !== key) x = key < x.key ? x.left : x.right
  return x
}

export function rbDelete(T: RbTree, z: RbNode, trace: Tracer = noop): void {
  let y = z
  let yOrig = y.color
  let x: RbNode
  trace({ block: 'rbDelete', code: 2, he: `מוחקים את z=${z.key}. נשמור את צבע הצומת שיוסר בפועל.`, roles: { z } })
  if (isNil(T, z.left)) {
    x = z.right
    trace({ block: 'rbDelete', code: 4, he: `ל-z אין ילד שמאלי — מחליפים אותו בילד הימני.`, roles: { z, x } })
    transplant(T, z, z.right)
  } else if (isNil(T, z.right)) {
    x = z.left
    trace({ block: 'rbDelete', code: 6, he: `ל-z אין ילד ימני — מחליפים אותו בילד השמאלי.`, roles: { z, x } })
    transplant(T, z, z.left)
  } else {
    y = treeMinimum(T, z.right)
    yOrig = y.color
    x = y.right
    trace({ block: 'rbDelete', code: 7, he: `ל-z שני ילדים — y=${y.key} הוא העוקב (המינימום בתת-העץ הימני).`, roles: { z, y, x } })
    if (y.p === z) {
      x.p = y
    } else {
      transplant(T, y, y.right)
      y.right = z.right
      y.right.p = y
    }
    transplant(T, z, y)
    y.left = z.left
    y.left.p = y
    y.color = z.color
    trace({ block: 'rbDelete', code: 10, he: `y תופס את מקום z וצובע בצבעו. כעת נבדוק את הצבע שהוסר.`, roles: { y, x } })
  }
  if (yOrig === 'black') {
    trace({ block: 'rbDelete', code: 11, he: `הצבע שהוסר היה שחור → ייתכן הפרה של תכונה 4/5. מריצים Delete-Fixup.`, roles: { x }, doubleBlack: x })
    rbDeleteFixup(T, x, trace)
  } else {
    trace({ block: 'rbDelete', code: 11, he: `הצבע שהוסר היה אדום — אין הפרה. סיום.`, roles: { x }, done: true })
  }
}

function rbDeleteFixup(T: RbTree, x: RbNode, trace: Tracer): void {
  while (x !== T.root && x.color === 'black') {
    if (x === x.p.left) {
      let w = x.p.right // sibling
      if (w.color === 'red') {
        // case 1: sibling red
        trace({ block: 'rbDeleteFixup', code: 5, caseLabel: '1', he: `מקרה 1: האח (${w.key}) אדום → צביעה מחדש ו-Left-Rotate על ההורה; ממשיכים.`, roles: { x, w, p: x.p }, doubleBlack: x })
        w.color = 'black'
        x.p.color = 'red'
        leftRotate(T, x.p, trace)
        w = x.p.right
      }
      if (w.left.color === 'black' && w.right.color === 'black') {
        // case 2: sibling black, both its children black
        trace({ block: 'rbDeleteFixup', code: 7, caseLabel: '2', he: `מקרה 2: האח שחור ושני ילדיו שחורים → צובעים את האח באדום ומעלים את ה"שחור הכפול" להורה.`, roles: { x, w }, doubleBlack: x })
        w.color = 'red'
        x = x.p
      } else {
        if (w.right.color === 'black') {
          // case 3: sibling black, near child red, far child black
          trace({ block: 'rbDeleteFixup', code: 10, caseLabel: '3', he: `מקרה 3: ילד-האח הרחוק שחור והקרוב אדום → צביעה מחדש ו-Right-Rotate על האח (הפיכה למקרה 4).`, roles: { x, w }, doubleBlack: x })
          w.left.color = 'black'
          w.color = 'red'
          rightRotate(T, w, trace)
          w = x.p.right
        }
        // case 4: sibling black, far child red
        trace({ block: 'rbDeleteFixup', code: 12, caseLabel: '4', he: `מקרה 4: ילד-האח הרחוק אדום → צביעה מחדש ו-Left-Rotate על ההורה; ה"שחור הכפול" נפתר.`, roles: { x, w, p: x.p }, doubleBlack: x })
        w.color = x.p.color
        x.p.color = 'black'
        w.right.color = 'black'
        leftRotate(T, x.p, trace)
        x = T.root
      }
    } else {
      // mirror
      let w = x.p.left
      if (w.color === 'red') {
        trace({ block: 'rbDeleteFixup', code: 5, caseLabel: '1', he: `מקרה 1 (מראה): האח (${w.key}) אדום → צביעה מחדש ו-Right-Rotate על ההורה.`, roles: { x, w, p: x.p }, doubleBlack: x })
        w.color = 'black'
        x.p.color = 'red'
        rightRotate(T, x.p, trace)
        w = x.p.left
      }
      if (w.right.color === 'black' && w.left.color === 'black') {
        trace({ block: 'rbDeleteFixup', code: 7, caseLabel: '2', he: `מקרה 2 (מראה): האח שחור ושני ילדיו שחורים → צובעים את האח באדום, מעלים מעלה.`, roles: { x, w }, doubleBlack: x })
        w.color = 'red'
        x = x.p
      } else {
        if (w.left.color === 'black') {
          trace({ block: 'rbDeleteFixup', code: 10, caseLabel: '3', he: `מקרה 3 (מראה): צביעה מחדש ו-Left-Rotate על האח.`, roles: { x, w }, doubleBlack: x })
          w.right.color = 'black'
          w.color = 'red'
          leftRotate(T, w, trace)
          w = x.p.left
        }
        trace({ block: 'rbDeleteFixup', code: 12, caseLabel: '4', he: `מקרה 4 (מראה): צביעה מחדש ו-Right-Rotate על ההורה; השחור הכפול נפתר.`, roles: { x, w, p: x.p }, doubleBlack: x })
        w.color = x.p.color
        x.p.color = 'black'
        w.left.color = 'black'
        rightRotate(T, x.p, trace)
        x = T.root
      }
    }
  }
  x.color = 'black'
  trace({ block: 'rbDeleteFixup', code: 15, he: `צובעים את x בשחור — העץ אדום-שחור תקין שוב.`, roles: { x }, done: true })
}

// ---- construction + queries (no trace) ------------------------------------
export function buildRbTree(keys: number[]): RbTree {
  const T = makeTree()
  for (const k of keys) rbInsert(T, k)
  return T
}

/** All real (non-NIL) nodes, any order. */
export function realNodes(T: RbTree): RbNode[] {
  const out: RbNode[] = []
  const rec = (x: RbNode) => {
    if (isNil(T, x)) return
    out.push(x)
    rec(x.left)
    rec(x.right)
  }
  rec(T.root)
  return out
}

/** Keys in inorder (sorted) order. */
export function inorderKeys(T: RbTree): number[] {
  const out: number[] = []
  const rec = (x: RbNode) => {
    if (isNil(T, x)) return
    rec(x.left)
    out.push(x.key)
    rec(x.right)
  }
  rec(T.root)
  return out
}

export function treeHeight(T: RbTree): number {
  const h = (x: RbNode): number => (isNil(T, x) ? -1 : 1 + Math.max(h(x.left), h(x.right)))
  return h(T.root)
}

/** Verify the five red-black properties; returns the black-height if valid. */
export function validateRb(T: RbTree): { ok: boolean; reason?: string; blackHeight?: number } {
  if (T.root.color !== 'black') return { ok: false, reason: 'root is not black' }
  let bad: string | undefined
  const check = (x: RbNode): number => {
    if (isNil(T, x)) return 1 // NIL counts as one black
    if (x.color === 'red' && (x.left.color === 'red' || x.right.color === 'red'))
      bad = bad ?? `red node ${x.key} has a red child`
    const lb = check(x.left)
    const rb = check(x.right)
    if (lb !== rb) bad = bad ?? `black-height mismatch at ${x.key} (${lb} vs ${rb})`
    return lb + (x.color === 'black' ? 1 : 0)
  }
  const bh = check(T.root)
  return bad ? { ok: false, reason: bad } : { ok: true, blackHeight: bh }
}
