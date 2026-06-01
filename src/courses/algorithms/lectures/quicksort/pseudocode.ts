import type { PseudocodeBlock } from '@/core/engine/types'

/**
 * Pseudocode for Lecture 5 — Quicksort.
 * Hoare-Partition and Quicksort are transcribed verbatim from שיעור 5.pptx
 * (Hoare partition, slide 8; Quicksort code, slide 5). Lomuto and the
 * Randomized variants follow the standard CLRS form (referenced in the slides).
 * Line numbers are 1-based and shared with Frame.codeLine, so `lines` and
 * `pythonLines` stay line-aligned.
 */

export const hoarePartitionBlock: PseudocodeBlock = {
  id: 'hoarePartition',
  titleEn: 'Partition(A, p, r) — Hoare',
  titleHe: 'חלוקה — Hoare',
  kind: 'helper',
  lines: [
    'Partition(A, p, r)',
    '  x = A[p]',
    '  i = p - 1',
    '  j = r + 1',
    '  while (TRUE)',
    '    repeat',
    '      j--',
    '    until A[j] <= x',
    '    repeat',
    '      i++',
    '    until A[i] >= x',
    '    if (i < j)',
    '      Swap(A, i, j)',
    '    else',
    '      return j',
  ],
  pythonLines: [
    'def partition(A, p, r):',
    '    x = A[p]',
    '    i = p - 1',
    '    j = r + 1',
    '    while True:',
    '        while True:',
    '            j -= 1',
    '            if A[j] <= x: break',
    '        while True:',
    '            i += 1',
    '            if A[i] >= x: break',
    '        if i < j:',
    '            A[i], A[j] = A[j], A[i]',
    '        else:',
    '            return j',
  ],
}

export const quickSortBlock: PseudocodeBlock = {
  id: 'quickSort',
  titleEn: 'Quicksort(A, p, r)',
  titleHe: 'מיון מהיר — Quicksort',
  kind: 'main',
  lines: [
    'Quicksort(A, p, r)',
    '  if (p < r)',
    '    q = Partition(A, p, r)',
    '    Quicksort(A, p, q)',
    '    Quicksort(A, q+1, r)',
  ],
  pythonLines: [
    'def quicksort(A, p, r):',
    '    if p < r:',
    '        q = partition(A, p, r)',
    '        quicksort(A, p, q)',
    '        quicksort(A, q + 1, r)',
  ],
}

export const lomutoPartitionBlock: PseudocodeBlock = {
  id: 'lomutoPartition',
  titleEn: 'Lomuto-Partition(A, p, r)',
  titleHe: 'חלוקה — Lomuto',
  kind: 'helper',
  lines: [
    'Lomuto-Partition(A, p, r)',
    '  x = A[r]',
    '  i = p - 1',
    '  for j = p to r - 1',
    '    if A[j] ≤ x',
    '      i = i + 1',
    '      exchange A[i] with A[j]',
    '  exchange A[i+1] with A[r]',
    '  return i + 1',
  ],
  pythonLines: [
    'def lomuto_partition(A, p, r):',
    '    x = A[r]',
    '    i = p - 1',
    '    for j in range(p, r):',
    '        if A[j] <= x:',
    '            i += 1',
    '            A[i], A[j] = A[j], A[i]',
    '    A[i+1], A[r] = A[r], A[i+1]',
    '    return i + 1',
  ],
}

export const randomizedPartitionBlock: PseudocodeBlock = {
  id: 'randomizedPartition',
  titleEn: 'Randomized-Partition(A, p, r)',
  titleHe: 'חלוקה אקראית',
  kind: 'helper',
  lines: [
    'Randomized-Partition(A, p, r)',
    '  i = Random(p, r)',
    '  exchange A[p] with A[i]',
    '  return Partition(A, p, r)',
  ],
  pythonLines: [
    'def randomized_partition(A, p, r):',
    '    i = random.randint(p, r)',
    '    A[p], A[i] = A[i], A[p]',
    '    return partition(A, p, r)',
  ],
}

export const randomizedQuickSortBlock: PseudocodeBlock = {
  id: 'randomizedQuickSort',
  titleEn: 'Randomized-Quicksort(A, p, r)',
  titleHe: 'מיון מהיר אקראי',
  kind: 'main',
  lines: [
    'Randomized-Quicksort(A, p, r)',
    '  if (p < r)',
    '    q = Randomized-Partition(A, p, r)',
    '    Randomized-Quicksort(A, p, q)',
    '    Randomized-Quicksort(A, q+1, r)',
  ],
  pythonLines: [
    'def randomized_quicksort(A, p, r):',
    '    if p < r:',
    '        q = randomized_partition(A, p, r)',
    '        randomized_quicksort(A, p, q)',
    '        randomized_quicksort(A, q + 1, r)',
  ],
}
