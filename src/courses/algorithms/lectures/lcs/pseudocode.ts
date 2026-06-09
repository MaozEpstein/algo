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
