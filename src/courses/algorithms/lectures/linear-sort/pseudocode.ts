import type { PseudocodeBlock } from '@/core/engine/types'

/** Counting Sort — CLRS form (1-indexed keys in 1..k). */
export const countingSortBlock: PseudocodeBlock = {
  id: 'countingSort',
  titleEn: 'CountingSort(A, B, k)',
  titleHe: 'מיון מנייה',
  kind: 'main',
  lines: [
    'CountingSort(A, B, k)',
    '  for i = 1 to k',
    '    C[i] = 0',
    '  for j = 1 to n',
    '    C[A[j]] = C[A[j]] + 1',
    '  for i = 2 to k',
    '    C[i] = C[i] + C[i-1]',
    '  for j = n downto 1',
    '    B[C[A[j]]] = A[j]',
    '    C[A[j]] = C[A[j]] - 1',
  ],
  pythonLines: [
    'def counting_sort(A, k):',
    '    for i in range(1, k+1):',
    '        C[i] = 0',
    '    for j in range(1, n+1):',
    '        C[A[j]] += 1',
    '    for i in range(2, k+1):',
    '        C[i] += C[i-1]',
    '    for j in range(n, 0, -1):',
    '        B[C[A[j]]] = A[j]',
    '        C[A[j]] -= 1',
  ],
}

/** Radix Sort — sort by each digit, least-significant first, with a stable sort. */
export const radixSortBlock: PseudocodeBlock = {
  id: 'radixSort',
  titleEn: 'RadixSort(A, d)',
  titleHe: 'מיון בסיס',
  kind: 'main',
  lines: [
    'RadixSort(A, d)',
    '  for i = 1 to d',
    '    use a stable sort on digit i',
  ],
  pythonLines: [
    'def radix_sort(A, d):',
    '    for i in range(d):',
    '        A = counting_by_digit(A, i)',
  ],
}

/** Bucket Sort — n reals in [0,1) scattered into n buckets, each sorted, concatenated. */
export const bucketSortBlock: PseudocodeBlock = {
  id: 'bucketSort',
  titleEn: 'BucketSort(A, n)',
  titleHe: 'מיון דלי',
  kind: 'main',
  lines: [
    'BucketSort(A, n)',
    '  for i = 1 to n',
    '    insert A[i] into B[⌊n·A[i]⌋]',
    '  for i = 0 to n-1',
    '    InsertionSort(B[i])',
    '  concatenate B[0..n-1]',
  ],
  pythonLines: [
    'def bucket_sort(A, n):',
    '    for x in A:',
    '        B[int(n*x)].append(x)',
    '    for b in B:',
    '        insertion_sort(b)',
    '    return concat(B)',
  ],
}
