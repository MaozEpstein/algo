import type { PseudocodeBlock } from '@/core/engine/types'

/** Stack (array-backed, LIFO) — CLRS §10.1. */
export const stackBlock: PseudocodeBlock = {
  id: 'stack',
  titleEn: 'Stack (Push / Pop)',
  titleHe: 'מחסנית',
  kind: 'main',
  lines: [
    'PUSH(S, x)',
    '  S.top = S.top + 1',
    '  S[S.top] = x',
    'POP(S)',
    '  if STACK-EMPTY(S): error "underflow"',
    '  S.top = S.top - 1',
    '  return S[S.top + 1]',
  ],
  pythonLines: [
    'def push(S, x):',
    '    S.append(x)',
    '',
    'def pop(S):',
    '    if not S: raise IndexError("underflow")',
    '    return S.pop()',
    '',
  ],
}

/** Queue (circular array, FIFO) — CLRS §10.1. */
export const queueBlock: PseudocodeBlock = {
  id: 'queue',
  titleEn: 'Queue (Enqueue / Dequeue)',
  titleHe: 'תור',
  kind: 'main',
  lines: [
    'ENQUEUE(Q, x)',
    '  Q[Q.tail] = x',
    '  Q.tail = (Q.tail mod n) + 1',
    'DEQUEUE(Q)',
    '  x = Q[Q.head]',
    '  Q.head = (Q.head mod n) + 1',
    '  return x',
  ],
  pythonLines: [
    'def enqueue(Q, x):',
    '    Q[Q.tail] = x',
    '    Q.tail = (Q.tail + 1) % n',
    'def dequeue(Q):',
    '    x = Q[Q.head]',
    '    Q.head = (Q.head + 1) % n',
    '    return x',
  ],
}

/** Direct-address table — CLRS §11.1. */
export const directAddressBlock: PseudocodeBlock = {
  id: 'directAddress',
  titleEn: 'Direct-Address Table',
  titleHe: 'מיעון ישיר',
  kind: 'main',
  lines: [
    'DIRECT-ADDRESS-INSERT(T, x)',
    '  T[x.key] = x',
    'DIRECT-ADDRESS-SEARCH(T, k)',
    '  return T[k]',
    'DIRECT-ADDRESS-DELETE(T, x)',
    '  T[x.key] = NIL',
  ],
  pythonLines: [
    'def insert(T, x):',
    '    T[x.key] = x',
    'def search(T, k):',
    '    return T[k]',
    'def delete(T, x):',
    '    T[x.key] = None',
  ],
}

/** Hash functions — division & multiplication methods — CLRS §11.3. */
export const hashFunctionsBlock: PseudocodeBlock = {
  id: 'hashFunctions',
  titleEn: 'Hash Functions',
  titleHe: 'פונקציות גיבוב',
  kind: 'main',
  lines: [
    '# שיטת החילוק (Division)',
    'h(k) = k mod m',
    '# שיטת הכפל (Multiplication)',
    'h(k) = floor(m * (k * A mod 1))',
    '# A = (sqrt(5) - 1) / 2 ≈ 0.618',
  ],
  pythonLines: [
    '# division',
    'h = k % m',
    '# multiplication',
    'A = (5 ** 0.5 - 1) / 2',
    'h = int(m * ((k * A) % 1))',
  ],
}

/** Hashing with chaining — CLRS §11.2. */
export const chainingBlock: PseudocodeBlock = {
  id: 'chaining',
  titleEn: 'Chained Hashing',
  titleHe: 'גיבוב בשרשור',
  kind: 'main',
  lines: [
    'CHAINED-HASH-INSERT(T, x)',
    '  insert x at the head of list T[h(x.key)]',
    'CHAINED-HASH-SEARCH(T, k)',
    '  search for key k in list T[h(k)]',
    'CHAINED-HASH-DELETE(T, x)',
    '  delete x from list T[h(x.key)]',
  ],
  pythonLines: [
    'def insert(T, x):',
    '    T[h(x.key)].insert(0, x)',
    'def search(T, k):',
    '    return find(T[h(k)], k)',
    'def delete(T, x):',
    '    T[h(x.key)].remove(x)',
  ],
}

/** Open addressing — linear probing — CLRS §11.4. */
export const openAddressingBlock: PseudocodeBlock = {
  id: 'openAddressing',
  titleEn: 'Open Addressing (Linear Probing)',
  titleHe: 'מיעון פתוח',
  kind: 'main',
  lines: [
    'HASH-INSERT(T, k)',
    '  for i = 0 to m-1',
    '    j = h(k, i)            # = (k mod m + i) mod m',
    '    if T[j] == NIL',
    '      T[j] = k ;  return j',
    '  error "overflow"',
    'HASH-SEARCH(T, k)',
    '  for i = 0 to m-1',
    '    j = h(k, i)',
    '    if T[j] == k:  return j',
    '    if T[j] == NIL:  return NIL',
  ],
  pythonLines: [
    'def hash_insert(T, k):',
    '    for i in range(m):',
    '        j = (k % m + i) % m',
    '        if T[j] is None:',
    '            T[j] = k; return j',
    '    raise OverflowError',
    'def hash_search(T, k):',
    '    for i in range(m):',
    '        j = (k % m + i) % m',
    '        if T[j] == k: return j',
    '        if T[j] is None: return None',
  ],
}
