import { vv } from '@/core/engine/FrameBuilder'
import type { AlgorithmInput, AlgorithmSpec, Frame } from '@/core/engine/types'
import { bfsBlock, dfsBlock } from '../pseudocode'
import { buildScene, type NodeTone } from '../scene'
import type { BstNode } from '../bst'
import { DEFAULT_KEYS, SKEWED_KEYS, setup, validateKeys } from './_shared'

/**
 * Two structural traversals on the same tree (like Tree-Minimum/Maximum runs two
 * walks): breadth-first (level order, with a queue) then depth-first (preorder,
 * recursion). Reuses the shared BstView; visited nodes tint 'sorted', the queue/
 * stack frontier 'compare', the current node 'active'.
 */
export function runTraversals(input: AlgorithmInput): Frame[] {
  const { b, root } = setup(input)

  const visited: string[] = []
  const frontier = new Set<string>()
  let current: string | null = null

  const keyOf = (id: string): number | undefined => find(root, id)?.key
  const order = () => visited.map(keyOf).filter((v): v is number => v != null).join(', ')
  const tone = (n: BstNode): NodeTone =>
    n.id === current ? 'active' : visited.includes(n.id) ? 'sorted' : frontier.has(n.id) ? 'compare' : 'idle'
  const emit = (block: string, codeLine: number | null, narration: string, x: BstNode | null, action?: Frame['action']) => {
    b.setScene(buildScene({ root, tone, pointers: x ? [{ label: 'x', node: x, tone: 'x' }] : [] }))
    b.emit({ codeBlock: block, codeLine, narration, action, vars: [vv('ביקרנו', visited.length, 'bound')] })
  }

  if (!root) {
    emit('bfs', null, 'העץ ריק — אין מה לסרוק.', null, { kind: 'done' })
    return b.build()
  }

  // ---- BFS (level order) ----
  b.setBlock('bfs').setPhase('bfs')
  emit('bfs', 1, 'סריקה לרוחב (BFS): עוברים רמה אחר רמה בעזרת תור (FIFO).', null)
  const queue: BstNode[] = [root]
  frontier.add(root.id)
  emit('bfs', 2, `מכניסים את השורש ${root.key} לתור.`, root)
  while (queue.length) {
    const x = queue.shift()!
    frontier.delete(x.id)
    current = x.id
    emit('bfs', 4, `שולפים מראש התור: ${x.key}.`, x)
    visited.push(x.id)
    emit('bfs', 5, `מבקרים ב-${x.key}. סדר עד כה: ${order()}.`, x)
    current = null
    if (x.left) {
      queue.push(x.left)
      frontier.add(x.left.id)
      emit('bfs', 6, `מכניסים את הילד השמאלי ${x.left.key} לתור.`, x.left)
    }
    if (x.right) {
      queue.push(x.right)
      frontier.add(x.right.id)
      emit('bfs', 7, `מכניסים את הילד הימני ${x.right.key} לתור.`, x.right)
    }
  }
  emit('bfs', 3, `סריקת BFS הסתיימה: ${order()} — רמה אחר רמה. עלות: O(n).`, null)

  // ---- DFS (preorder) ----
  visited.length = 0
  frontier.clear()
  current = null
  b.setBlock('dfs').setPhase('dfs')
  emit('dfs', 1, 'כעת סריקה לעומק (DFS, preorder): צומת → תת-עץ שמאלי → תת-עץ ימני.', root)

  const dfs = (x: BstNode | null) => {
    if (!x) return
    current = x.id
    visited.push(x.id)
    emit('dfs', 3, `מבקרים ב-${x.key}. סדר עד כה: ${order()}.`, x)
    current = null
    if (x.left) {
      emit('dfs', 4, `צוללים שמאלה אל ${x.left.key}.`, x.left)
      dfs(x.left)
    }
    if (x.right) {
      emit('dfs', 5, `צוללים ימינה אל ${x.right.key}.`, x.right)
      dfs(x.right)
    }
  }
  dfs(root)
  b.setScene(buildScene({ root, tone: () => 'sorted' }))
  b.emit({ codeBlock: 'dfs', codeLine: null, narration: `סריקת DFS הסתיימה: ${order()}. עלות: O(n).`, action: { kind: 'done' }, vars: [vv('ביקרנו', visited.length, 'bound')] })
  return b.build()
}

function find(root: BstNode | null, id: string): BstNode | null {
  if (!root) return null
  if (root.id === id) return root
  return find(root.left, id) ?? find(root.right, id)
}

export const traversalsSpec: AlgorithmSpec = {
  id: 'traversals',
  titleHe: 'סריקות לרוחב ולעומק — BFS / DFS',
  titleEn: 'BFS / DFS Traversal',
  kind: 'main',
  blurbHe:
    'שתי סריקות מבניות של העץ: לרוחב (BFS) עוברת רמה אחר רמה בעזרת תור; לעומק (DFS) צוללת לכל ענף עד הסוף (preorder: צומת→שמאל→ימין). שתיהן O(n).',
  complexity: 'O(n)',
  proof: {
    result: '\\Theta(n)',
    claimHe: 'כל סריקה עולה Θ(n).',
    steps: [
      { he: 'כל צומת נכנס/נשלף מהתור (BFS) או נכנס למחסנית הרקורסיה (DFS) בדיוק פעם אחת.', tex: '\\Theta(1)' },
      { he: 'יש n צמתים, ולכן סך-הכול:', tex: '\\Theta(n)' },
    ],
    intuitionHe: 'כל צומת מבוקר פעם אחת — ההבדל הוא רק בסדר: לרוחב (תור) מול לעומק (מחסנית/רקורסיה).',
  },
  pseudocode: [bfsBlock, dfsBlock],
  run: runTraversals,
  validateInput: validateKeys,
  defaultInput: { array: DEFAULT_KEYS },
  presets: [
    { labelHe: 'עץ מאוזן (CLRS)', input: { array: DEFAULT_KEYS } },
    { labelHe: 'דוגמה קטנה', input: { array: [8, 3, 10, 1, 6, 14] } },
    { labelHe: 'עץ סימטרי', input: { array: [8, 4, 12, 2, 6, 10, 14] } },
    { labelHe: 'עץ נטוי (המקרה הגרוע ביותר)', input: { array: SKEWED_KEYS }, worst: true, noteHe: 'בשרשרת, BFS ו-DFS מבקרים באותו סדר — והתור/מחסנית מגיעים לעומק n.' },
  ],
}
