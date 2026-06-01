import type { PseudocodeBlock } from '@/engine/types'

/** All blocks share a 3-line shape (header / base case / recursive return) so the
 *  pseudo and Python line numbers line up for highlighting. */

export const factorialBlock: PseudocodeBlock = {
  id: 'factorial',
  titleEn: 'factorial(n)',
  titleHe: 'עצרת — factorial',
  kind: 'main',
  lines: ['factorial(n)', '  if n ≤ 1: return 1', '  return n * factorial(n-1)'],
  pythonLines: ['def factorial(n):', '    if n <= 1: return 1', '    return n * factorial(n - 1)'],
}

export const powerBlock: PseudocodeBlock = {
  id: 'power',
  titleEn: 'power(b, n)',
  titleHe: 'חזקה — power',
  kind: 'main',
  lines: ['power(b, n)', '  if n == 0: return 1', '  return b * power(b, n-1)'],
  pythonLines: ['def power(b, n):', '    if n == 0: return 1', '    return b * power(b, n - 1)'],
}

export const multBlock: PseudocodeBlock = {
  id: 'mult',
  titleEn: 'mult(a, b)',
  titleHe: 'כפל — mult',
  kind: 'main',
  lines: ['mult(a, b)', '  if b == 0: return 0', '  return a + mult(a, b-1)'],
  pythonLines: ['def mult(a, b):', '    if b == 0: return 0', '    return a + mult(a, b - 1)'],
}

export const sumBlock: PseudocodeBlock = {
  id: 'sum',
  titleEn: 'sum(n)',
  titleHe: 'סכום — sum',
  kind: 'main',
  lines: ['sum(n)', '  if n == 0: return 0', '  return n + sum(n-1)'],
  pythonLines: ['def my_sum(n):', '    if n == 0: return 0', '    return n + my_sum(n - 1)'],
}

export const countDownBlock: PseudocodeBlock = {
  id: 'countDown',
  titleEn: 'count_down(n)',
  titleHe: 'ספירה לאחור — count_down',
  kind: 'main',
  lines: ['count_down(n)', '  print(n)', '  if n > 0: count_down(n-1)'],
  pythonLines: ['def count_down(n):', '    print(n)', '    if n > 0: count_down(n - 1)'],
}

export const listLenBlock: PseudocodeBlock = {
  id: 'listLen',
  titleEn: 'listLen(lst)',
  titleHe: 'אורך רשימה — listLen',
  kind: 'main',
  lines: ['listLen(lst)', '  if lst == []: return 0', '  return 1 + listLen(lst[1:])'],
  pythonLines: ['def list_len(lst):', '    if lst == []: return 0', '    return 1 + list_len(lst[1:])'],
}
