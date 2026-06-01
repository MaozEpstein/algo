import type { PseudocodeBlock } from '@/core/engine/types'

/**
 * Lecture 7 — Selection. RandomizedSelect is transcribed verbatim from
 * שיעור 7.pptx (slide 8, Lomuto version). Min-Max and the deterministic Select
 * (median of medians, optional material) follow the slides / CLRS.
 */

export const minMaxBlock: PseudocodeBlock = {
  id: 'minMax',
  titleEn: 'Min-Max(A, n)',
  titleHe: 'מינימום ומקסימום',
  kind: 'main',
  lines: [
    'Min-Max(A, n)',
    '  min = max = A[1]',
    '  for i = 2 to n step 2          // in pairs',
    '    if A[i] ≤ A[i+1]',
    '        small = A[i];  large = A[i+1]',
    '    else',
    '        small = A[i+1]; large = A[i]',
    '    if small < min:  min = small',
    '    if large > max:  max = large',
    '  return (min, max)',
  ],
  pythonLines: [
    'def min_max(A, n):',
    '    mn = mx = A[1]',
    '    for i in range(2, n, 2):       # in pairs',
    '        if A[i] <= A[i+1]:',
    '            small, large = A[i], A[i+1]',
    '        else:',
    '            small, large = A[i+1], A[i]',
    '        if small < mn: mn = small',
    '        if large > mx: mx = large',
    '    return (mn, mx)',
  ],
}

export const randomizedSelectBlock: PseudocodeBlock = {
  id: 'randomizedSelect',
  titleEn: 'RandomizedSelect(A, p, r, i)',
  titleHe: 'בחירה אקראית',
  kind: 'main',
  lines: [
    'RandomizedSelect(A, p, r, i)',
    '  if (p == r)',
    '      return A[p]',
    '  q = RandomizedPartition(A, p, r)',
    '  k = q - p + 1',
    '  if (i == k)',
    '      return A[q]',
    '  if (i < k)',
    '      return RandomizedSelect(A, p, q-1, i)',
    '  else',
    '      return RandomizedSelect(A, q+1, r, i-k)',
  ],
  pythonLines: [
    'def randomized_select(A, p, r, i):',
    '    if p == r:',
    '        return A[p]',
    '    q = randomized_partition(A, p, r)',
    '    k = q - p + 1',
    '    if i == k:',
    '        return A[q]',
    '    if i < k:',
    '        return randomized_select(A, p, q-1, i)',
    '    else:',
    '        return randomized_select(A, q+1, r, i-k)',
  ],
}

export const randomizedPartitionBlock: PseudocodeBlock = {
  id: 'randomizedPartition',
  titleEn: 'Randomized-Partition(A, p, r)',
  titleHe: 'חלוקה אקראית',
  kind: 'helper',
  lines: [
    'Randomized-Partition(A, p, r)',
    '  k = Random(p, r)',
    '  exchange A[r] with A[k]',
    '  return Partition(A, p, r)   // Lomuto',
  ],
  pythonLines: [
    'def randomized_partition(A, p, r):',
    '    k = random.randint(p, r)',
    '    A[r], A[k] = A[k], A[r]',
    '    return partition(A, p, r)   # Lomuto',
  ],
}

export const selectBlock: PseudocodeBlock = {
  id: 'select',
  titleEn: 'Select(A, p, r, i) — median of medians',
  titleHe: 'בחירה דטרמיניסטית (רשות)',
  kind: 'main',
  lines: [
    'Select(A, p, r, i)',
    '  divide A[p..r] into ⌈n/5⌉ groups of 5',
    '  find the median of each group',
    '  x = Select(medians, ⌈#medians/2⌉)   // median of medians',
    '  partition A[p..r] around x;  k = rank(x)',
    '  if i == k:  return x',
    '  if i < k:   return Select(left part, i)',
    '  else:       return Select(right part, i - k)',
  ],
  pythonLines: [
    'def select(A, p, r, i):',
    '    groups = [A[j:j+5] for j in range(p, r+1, 5)]',
    '    medians = [sorted(g)[len(g)//2] for g in groups]',
    '    x = select(medians, 0, len(medians)-1, (len(medians)+1)//2)',
    '    q = partition_around(A, p, r, x);  k = q - p + 1',
    '    if i == k: return x',
    '    if i < k:  return select(A, p, q-1, i)',
    '    else:      return select(A, q+1, r, i-k)',
  ],
}
