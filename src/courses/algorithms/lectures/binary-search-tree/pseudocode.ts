import type { PseudocodeBlock } from '@/core/engine/types'

/**
 * Pseudocode blocks for lecture 10 (Binary Search Trees), transcribed from the
 * course slides (שיעור 10, based on CLRS ch. 12) with parallel Python. Line
 * numbers are 1-based to match the `codeLine` the generators emit.
 */

export const inorderWalkBlock: PseudocodeBlock = {
  id: 'inorderWalk',
  titleEn: 'InorderTreeWalk(x)',
  titleHe: 'סריקה תוך-סדרית',
  kind: 'main',
  lines: [
    'InorderTreeWalk(x)',
    '    if x ≠ NIL',
    '        InorderTreeWalk(left[x])',
    '        print key[x]',
    '        InorderTreeWalk(right[x])',
  ],
  pythonLines: [
    'def inorder_walk(x):',
    '    if x is not None:',
    '        inorder_walk(x.left)',
    '        print(x.key)',
    '        inorder_walk(x.right)',
  ],
}

export const treeSearchBlock: PseudocodeBlock = {
  id: 'treeSearch',
  titleEn: 'TreeSearch(x, k)',
  titleHe: 'חיפוש בעץ',
  kind: 'main',
  lines: [
    'TreeSearch(x, k)',
    '    if x == NIL or k == key[x]',
    '        return x',
    '    if k < key[x]',
    '        return TreeSearch(left[x], k)',
    '    else',
    '        return TreeSearch(right[x], k)',
  ],
  pythonLines: [
    'def tree_search(x, k):',
    '    if x is None or k == x.key:',
    '        return x',
    '    if k < x.key:',
    '        return tree_search(x.left, k)',
    '    else:',
    '        return tree_search(x.right, k)',
  ],
}

export const treeInsertBlock: PseudocodeBlock = {
  id: 'treeInsert',
  titleEn: 'TreeInsert(T, z)',
  titleHe: 'הכנסה לעץ',
  kind: 'main',
  lines: [
    'TreeInsert(T, z)',
    '    y = NIL                  // trailing pointer',
    '    x = root[T]',
    '    while x ≠ NIL',
    '        y = x',
    '        if key[z] < key[x]',
    '            x = left[x]',
    '        else',
    '            x = right[x]',
    '    p[z] = y',
    '    if y == NIL',
    '        root[T] = z          // tree was empty',
    '    elseif key[z] < key[y]',
    '        left[y] = z',
    '    else',
    '        right[y] = z',
  ],
  pythonLines: [
    'def tree_insert(T, z):',
    '    y = None                 # trailing pointer',
    '    x = T.root',
    '    while x is not None:',
    '        y = x',
    '        if z.key < x.key:',
    '            x = x.left',
    '        else:',
    '            x = x.right',
    '    z.p = y',
    '    if y is None:',
    '        T.root = z           # tree was empty',
    '    elif z.key < y.key:',
    '        y.left = z',
    '    else:',
    '        y.right = z',
  ],
}

export const treeMinimumBlock: PseudocodeBlock = {
  id: 'treeMinimum',
  titleEn: 'TreeMinimum(x)',
  titleHe: 'מינימום',
  kind: 'main',
  lines: [
    'TreeMinimum(x)',
    '    while left[x] ≠ NIL',
    '        x = left[x]',
    '    return x',
  ],
  pythonLines: [
    'def tree_minimum(x):',
    '    while x.left is not None:',
    '        x = x.left',
    '    return x',
  ],
}

export const treeMaximumBlock: PseudocodeBlock = {
  id: 'treeMaximum',
  titleEn: 'TreeMaximum(x)',
  titleHe: 'מקסימום',
  kind: 'main',
  lines: [
    'TreeMaximum(x)',
    '    while right[x] ≠ NIL',
    '        x = right[x]',
    '    return x',
  ],
  pythonLines: [
    'def tree_maximum(x):',
    '    while x.right is not None:',
    '        x = x.right',
    '    return x',
  ],
}

export const treeSuccessorBlock: PseudocodeBlock = {
  id: 'treeSuccessor',
  titleEn: 'TreeSuccessor(x)',
  titleHe: 'איבר עוקב',
  kind: 'main',
  lines: [
    'TreeSuccessor(x)',
    '    if right[x] ≠ NIL                 // case 1',
    '        return TreeMinimum(right[x])',
    '    y = p[x]                          // case 2: climb up',
    '    while y ≠ NIL and x == right[y]',
    '        x = y',
    '        y = p[y]',
    '    return y',
  ],
  pythonLines: [
    'def tree_successor(x):',
    '    if x.right is not None:           # case 1',
    '        return tree_minimum(x.right)',
    '    y = x.p                           # case 2: climb up',
    '    while y is not None and x is y.right:',
    '        x = y',
    '        y = y.p',
    '    return y',
  ],
}

export const treeDeleteBlock: PseudocodeBlock = {
  id: 'treeDelete',
  titleEn: 'TreeDelete(T, z)',
  titleHe: 'מחיקה מהעץ',
  kind: 'main',
  lines: [
    'TreeDelete(T, z)',
    '    if left[z] == NIL and right[z] == NIL      // case 0: leaf',
    '        remove z from its parent',
    '    elseif left[z] == NIL or right[z] == NIL   // case 1: one child',
    '        splice z out — its child takes its place',
    '    else                                       // case 2: two children',
    '        y = TreeMinimum(right[z])              // the successor',
    '        key[z] = key[y]                        // copy successor up',
    '        splice y out (y has no left child)',
  ],
  pythonLines: [
    'def tree_delete(T, z):',
    '    if z.left is None and z.right is None:     # case 0: leaf',
    '        _remove(z)',
    '    elif z.left is None or z.right is None:     # case 1: one child',
    '        _splice(z)                              # child replaces z',
    '    else:                                       # case 2: two children',
    '        y = tree_minimum(z.right)               # the successor',
    '        z.key = y.key                           # copy successor up',
    '        _splice(y)                              # y has no left child',
  ],
}

export const bstSortBlock: PseudocodeBlock = {
  id: 'bstSort',
  titleEn: 'BSTSort(A)',
  titleHe: 'מיון בעזרת עץ חיפוש',
  kind: 'main',
  lines: [
    'BSTSort(A)',
    '    root = NIL',
    '    for i = 1 to n',
    '        TreeInsert(A[i])',
    '    InorderTreeWalk(root)',
  ],
  pythonLines: [
    'def bst_sort(A):',
    '    root = None',
    '    for i in range(n):',
    '        root = tree_insert(root, A[i])',
    '    inorder_walk(root)',
  ],
}
