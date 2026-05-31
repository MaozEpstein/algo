import type { PseudocodeBlock } from '@/engine/types'

/**
 * Pseudocode transcribed (1-indexed, CLRS) from שיעור 4.pptx.
 * Line numbers are 1-based and shared with Frame.codeLine, so the `lines` and
 * `pythonLines` arrays MUST stay line-aligned.
 */

export const maxHeapifyBlock: PseudocodeBlock = {
  id: 'maxHeapify',
  titleEn: 'Max-Heapify(A, i)',
  titleHe: 'הצפה מטה — Max-Heapify',
  kind: 'helper',
  lines: [
    'Max-Heapify(A, i)',
    '  l = Left(i)',
    '  r = Right(i)',
    '  if l ≤ heap-size(A) and A[l] > A[i]',
    '      largest = l',
    '  else largest = i',
    '  if r ≤ heap-size(A) and A[r] > A[largest]',
    '      largest = r',
    '  if largest ≠ i',
    '      exchange A[i] with A[largest]',
    '      Max-Heapify(A, largest)',
  ],
  pythonLines: [
    'def max_heapify(A, i, heap_size):',
    '    l = 2 * i',
    '    r = 2 * i + 1',
    '    if l <= heap_size and A[l] > A[i]:',
    '        largest = l',
    '    else: largest = i',
    '    if r <= heap_size and A[r] > A[largest]:',
    '        largest = r',
    '    if largest != i:',
    '        A[i], A[largest] = A[largest], A[i]',
    '        max_heapify(A, largest, heap_size)',
  ],
}

export const buildMaxHeapBlock: PseudocodeBlock = {
  id: 'buildMaxHeap',
  titleEn: 'Build-Max-Heap(A)',
  titleHe: 'בניית ערימה — Build-Max-Heap',
  kind: 'helper',
  lines: [
    'Build-Max-Heap(A)',
    '  heap-size(A) = length(A)',
    '  for i = ⌊length(A)/2⌋ downto 1',
    '      Max-Heapify(A, i)',
  ],
  pythonLines: [
    'def build_max_heap(A):',
    '    heap_size = len(A)',
    '    for i in range(len(A) // 2, 0, -1):',
    '        max_heapify(A, i, heap_size)',
  ],
}

export const heapSortBlock: PseudocodeBlock = {
  id: 'heapSort',
  titleEn: 'HeapSort(A)',
  titleHe: 'מיון ערימה — HeapSort',
  kind: 'main',
  lines: [
    'HeapSort(A)',
    '  Build-Max-Heap(A)',
    '  for i = length(A) downto 2',
    '      exchange A[1] with A[i]',
    '      heap-size(A) = heap-size(A) − 1',
    '      Max-Heapify(A, 1)',
  ],
  pythonLines: [
    'def heap_sort(A):',
    '    build_max_heap(A)',
    '    for i in range(len(A), 1, -1):',
    '        A[1], A[i] = A[i], A[1]',
    '        heap_size -= 1',
    '        max_heapify(A, 1, heap_size)',
  ],
}

export const heapInsertBlock: PseudocodeBlock = {
  id: 'heapInsert',
  titleEn: 'Max-Heap-Insert(A, key)',
  titleHe: 'הכנסה — Max-Heap-Insert',
  kind: 'main',
  lines: [
    'Max-Heap-Insert(A, key)',
    '  heap-size(A) = heap-size(A) + 1',
    '  A[heap-size(A)] = key',
    '  i = heap-size(A)',
    '  while i > 1 and A[Parent(i)] < A[i]',
    '      exchange A[i] with A[Parent(i)]',
    '      i = Parent(i)',
  ],
  pythonLines: [
    'def max_heap_insert(A, key):',
    '    heap_size += 1',
    '    A[heap_size] = key',
    '    i = heap_size',
    '    while i > 1 and A[i // 2] < A[i]:',
    '        A[i], A[i // 2] = A[i // 2], A[i]',
    '        i = i // 2',
  ],
}

export const heapMaximumBlock: PseudocodeBlock = {
  id: 'heapMaximum',
  titleEn: 'Heap-Maximum(A)',
  titleHe: 'מקסימום — Heap-Maximum',
  kind: 'main',
  lines: ['Heap-Maximum(A)', '  return A[1]'],
  pythonLines: ['def heap_maximum(A):', '    return A[1]'],
}

export const heapExtractMaxBlock: PseudocodeBlock = {
  id: 'heapExtractMax',
  titleEn: 'Heap-Extract-Max(A)',
  titleHe: 'שליפת מקסימום — Heap-Extract-Max',
  kind: 'main',
  lines: [
    'Heap-Extract-Max(A)',
    '  if heap-size(A) < 1',
    '      error "heap underflow"',
    '  max = A[1]',
    '  A[1] = A[heap-size(A)]',
    '  heap-size(A) = heap-size(A) − 1',
    '  Max-Heapify(A, 1)',
    '  return max',
  ],
  pythonLines: [
    'def heap_extract_max(A):',
    '    if heap_size < 1:',
    '        raise Exception("heap underflow")',
    '    maximum = A[1]',
    '    A[1] = A[heap_size]',
    '    heap_size -= 1',
    '    max_heapify(A, 1, heap_size)',
    '    return maximum',
  ],
}
