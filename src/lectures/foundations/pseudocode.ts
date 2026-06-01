import type { PseudocodeBlock } from '@/engine/types'

/** Insertion Sort — CLRS form (1-indexed), with an aligned Python version. */
export const insertionSortBlock: PseudocodeBlock = {
  id: 'insertionSort',
  titleEn: 'InsertionSort(A, n)',
  titleHe: 'מיון הכנסה',
  kind: 'main',
  lines: [
    'InsertionSort(A, n)',
    '  for j = 2 to n',
    '    key = A[j]',
    '    // מכניסים את המפתח לחלק הממוין שמשמאלו',
    '    i = j - 1',
    '    while i > 0 and A[i] > key',
    '      A[i+1] = A[i]',
    '      i = i - 1',
    '    A[i+1] = key',
  ],
  pythonLines: [
    'def insertion_sort(A):',
    '    for j in range(1, len(A)):',
    '        key = A[j]',
    '        # מכניסים את המפתח לחלק הממוין שמשמאלו',
    '        i = j - 1',
    '        while i >= 0 and A[i] > key:',
    '            A[i+1] = A[i]',
    '            i -= 1',
    '        A[i+1] = key',
  ],
}
