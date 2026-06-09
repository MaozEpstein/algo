import type { PseudocodeBlock } from '@/core/engine/types'

/**
 * Pseudocode for lecture 13 (LCS via dynamic programming, CLRS ch. 15).
 * 1-based line numbers match the `codeLine` emitted by runLcs.
 */

export const lcsLengthBlock: PseudocodeBlock = {
  id: 'lcsLength',
  titleEn: 'LCS-Length(X, Y)',
  titleHe: 'אורך תת-הסדרה',
  kind: 'main',
  lines: [
    'LCS-Length(X, Y)',
    '    for i = 1 to m: c[i,0] = 0     // עמודת ∅',
    '    for j = 0 to n: c[0,j] = 0     // שורת ∅',
    '    for i = 1 to m',
    '        for j = 1 to n',
    '            if X[i] = Y[j]',
    '                c[i,j] = c[i-1,j-1] + 1',
    '            else c[i,j] = max(c[i-1,j], c[i,j-1])',
    '    return c',
  ],
  pythonLines: [
    'def lcs_length(X, Y):',
    '    for i in range(m+1): c[i][0] = 0',
    '    for j in range(n+1): c[0][j] = 0',
    '    for i in range(1, m+1):',
    '        for j in range(1, n+1):',
    '            if X[i-1] == Y[j-1]:',
    '                c[i][j] = c[i-1][j-1] + 1',
    '            else: c[i][j] = max(c[i-1][j], c[i][j-1])',
    '    return c',
  ],
}

export const knapsack01Block: PseudocodeBlock = {
  id: 'knapsack01',
  titleEn: 'Knapsack-01(items, W)',
  titleHe: 'תרמיל 0-1 — ערך מרבי',
  kind: 'main',
  lines: [
    'Knapsack-01(items, W)',
    '    for w = 0 to W: K[0,w] = 0',
    '    for i = 1 to k',
    '        for w = 0 to W',
    '            if wᵢ > w',
    '                K[i,w] = K[i-1,w]                      // לא נכנס',
    '            else',
    '                K[i,w] = max(K[i-1,w], vᵢ + K[i-1,w-wᵢ])  // לדלג / לקחת',
    '    return K[k,W]',
  ],
  pythonLines: [
    'def knapsack_01(items, W):',
    '    for w in range(W+1): K[0][w] = 0',
    '    for i in range(1, k+1):',
    '        wi, vi = items[i-1]',
    '        for w in range(W+1):',
    '            if wi > w:',
    '                K[i][w] = K[i-1][w]',
    '            else:',
    '                K[i][w] = max(K[i-1][w], vi + K[i-1][w-wi])',
    '    return K[k][W]',
  ],
}

export const knapBackBlock: PseudocodeBlock = {
  id: 'knapBack',
  titleEn: 'Knapsack-Items(K, items, W)',
  titleHe: 'אילו פריטים נבחרו',
  kind: 'main',
  lines: [
    'Knapsack-Items(K, items, W)',
    '    i = k;  w = W',
    '    while i > 0',
    '        if K[i,w] = K[i-1,w]            // פריט i לא נלקח',
    '            i = i - 1',
    '        else                             // פריט i נלקח',
    '            take item i;  w = w - wᵢ;  i = i - 1',
  ],
  pythonLines: [
    'def knapsack_items(K, items, W):',
    '    i, w = k, W',
    '    while i > 0:',
    '        if K[i][w] == K[i-1][w]:        # item i not taken',
    '            i -= 1',
    '        else:                            # item i taken',
    '            take(i); w -= items[i-1].w; i -= 1',
  ],
}

export const printLcsBlock: PseudocodeBlock = {
  id: 'printLcs',
  titleEn: 'Print-LCS(c, X, i, j)',
  titleHe: 'שחזור תת-הסדרה',
  kind: 'main',
  lines: [
    'Print-LCS(c, X, i, j)',
    '    if i = 0 or j = 0: return',
    '    if X[i] = Y[j]',
    '        Print-LCS(c, X, i-1, j-1);  print X[i]',
    '    elseif c[i-1,j] ≥ c[i,j-1]',
    '        Print-LCS(c, X, i-1, j)',
    '    else Print-LCS(c, X, i, j-1)',
  ],
  pythonLines: [
    'def print_lcs(c, X, i, j):',
    '    if i == 0 or j == 0: return',
    '    if X[i-1] == Y[j-1]:',
    '        print_lcs(c, X, i-1, j-1); print(X[i-1])',
    '    elif c[i-1][j] >= c[i][j-1]:',
    '        print_lcs(c, X, i-1, j)',
    '    else: print_lcs(c, X, i, j-1)',
  ],
}
