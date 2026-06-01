import type { PseudocodeBlock } from '@/core/engine/types'

export const mergeSortBlock: PseudocodeBlock = {
  id: 'mergeSort',
  titleEn: 'Merge-Sort(A, p, r)',
  titleHe: 'מיון מיזוג — Merge-Sort',
  kind: 'main',
  lines: [
    'Merge-Sort(A, p, r)',
    '  if (p < r)',
    '    mid = ⌊(p + r) / 2⌋',
    '    Merge-Sort(A, p, mid)',
    '    Merge-Sort(A, mid+1, r)',
    '    Merge(A, p, mid, r)',
  ],
  pythonLines: [
    'def merge_sort(A, p, r):',
    '    if p < r:',
    '        mid = (p + r) // 2',
    '        merge_sort(A, p, mid)',
    '        merge_sort(A, mid + 1, r)',
    '        merge(A, p, mid, r)',
  ],
}

export const mergeBlock: PseudocodeBlock = {
  id: 'merge',
  titleEn: 'Merge(A, p, mid, r)',
  titleHe: 'מיזוג — Merge',
  kind: 'helper',
  lines: [
    'Merge(A, p, mid, r)',
    '  i = p;  j = mid + 1',
    '  for k = p to r',
    '    if j > r or (i ≤ mid and A[i] ≤ A[j])',
    '      out[k] = A[i];  i = i + 1',
    '    else',
    '      out[k] = A[j];  j = j + 1',
    '  copy out back into A[p..r]',
  ],
  pythonLines: [
    'def merge(A, p, mid, r):',
    '    i, j = p, mid + 1',
    '    out = []',
    '    for k in range(p, r + 1):',
    '        if j > r or (i <= mid and A[i] <= A[j]):',
    '            out.append(A[i]); i += 1',
    '        else:',
    '            out.append(A[j]); j += 1',
    '    A[p:r+1] = out',
  ],
}

export const hanoiBlock: PseudocodeBlock = {
  id: 'hanoi',
  titleEn: 'Hanoi(n, from, to, via)',
  titleHe: 'מגדלי האנוי — Hanoi',
  kind: 'main',
  lines: [
    'Hanoi(n, from, to, via)',
    '  if (n == 0) return',
    '  Hanoi(n-1, from, via, to)',
    '  move disk n: from → to',
    '  Hanoi(n-1, via, to, from)',
  ],
  pythonLines: [
    'def hanoi(n, frm, to, via):',
    '    if n == 0:',
    '        return',
    '    hanoi(n - 1, frm, via, to)',
    '    print(f"move {n}: {frm} -> {to}")',
    '    hanoi(n - 1, via, to, frm)',
  ],
}
