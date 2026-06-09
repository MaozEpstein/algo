import type { PseudocodeBlock } from '@/core/engine/types'

/**
 * Pseudocode for lecture 12 (order-statistic trees, CLRS ch. 14). 1-based line
 * numbers match the `code` emitted by the tracer in ostree.ts.
 */

export const osSelectBlock: PseudocodeBlock = {
  id: 'osSelect',
  titleEn: 'OS-Select(x, i)',
  titleHe: 'בחירת האיבר ה-i',
  kind: 'main',
  lines: [
    'OS-Select(x, i)',
    '    r = size[left[x]] + 1        // rank of x in its subtree',
    '    if i = r: return x',
    '    elseif i < r: return OS-Select(left[x], i)',
    '    else: return OS-Select(right[x], i - r)',
  ],
  pythonLines: [
    'def os_select(x, i):',
    '    r = x.left.size + 1          # rank of x in its subtree',
    '    if i == r: return x',
    '    if i < r:  return os_select(x.left, i)',
    '    return os_select(x.right, i - r)',
  ],
}

export const osRankBlock: PseudocodeBlock = {
  id: 'osRank',
  titleEn: 'OS-Rank(T, x)',
  titleHe: 'דירוג של מפתח',
  kind: 'main',
  lines: [
    'OS-Rank(T, x)',
    '    r = size[left[x]] + 1',
    '    y = x',
    '    while y ≠ root[T]',
    '        if y = right[p[y]]: r = r + size[left[p[y]]] + 1',
    '        y = p[y]',
    '    return r',
  ],
  pythonLines: [
    'def os_rank(T, x):',
    '    r = x.left.size + 1',
    '    y = x',
    '    while y is not T.root:',
    '        if y is y.p.right: r += y.p.left.size + 1',
    '        y = y.p',
    '    return r',
  ],
}
