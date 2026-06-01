/**
 * Pure, deterministic math for the recurrence-relations lecture.
 * No React, no DOM — unit-tested in recurrences.test.ts.
 */

const EPS = 1e-9

/** Format a number for LaTeX: integers as-is, otherwise trimmed to ≤2 decimals. */
export function numFmt(x: number): string {
  if (Number.isInteger(x)) return String(x)
  return x.toFixed(2).replace(/\.?0+$/, '')
}

/** LaTeX for n^p, dropping trivial exponents (n^0 → '', n^1 → 'n'). */
function nPow(pNum: number, pTex: string): string {
  if (Math.abs(pNum) < EPS) return ''
  if (Math.abs(pNum - 1) < EPS) return 'n'
  return `n^{${pTex}}`
}

/** LaTeX for (log n)^q, dropping trivial exponents. */
function logPow(q: number): string {
  if (q === 0) return ''
  if (q === 1) return '\\log n'
  return `\\log^{${q}} n`
}

/** Join factors with implicit multiplication; empty product → '1'. */
function product(...parts: string[]): string {
  const ps = parts.filter(Boolean)
  return ps.length ? ps.join(' ') : '1'
}

/** Master-theorem input: T(n) = a·T(n/b) + Θ(n^c · log^k n). */
export interface MasterInput {
  a: number
  b: number
  /** Exponent of n in f(n). */
  c: number
  /** Exponent of log n in f(n) (k ≥ 0). */
  k: number
}

export interface MasterResult {
  /** The watershed exponent e = log_b(a). */
  e: number
  /** LaTeX for e: integer when a is a power of b, else the symbolic log_b a. */
  eTex: string
  /** ' \\approx 2.81' style suffix when e is not an integer, else ''. */
  eApproxTex: string
  caseNo: 1 | 2 | 3
  /** f(n) rendered, e.g. 'n \\log n'. */
  fTex: string
  /** The watershed n^{log_b a}, e.g. 'n' or 'n^{\\log_{2} 7}'. */
  watershedTex: string
  /** The final tight bound, e.g. '\\Theta(n \\log n)'. */
  resultTex: string
  /** One-sentence Hebrew explanation of why this case applies. */
  reasonHe: string
}

/**
 * Classify a recurrence by the Master Theorem (with the common extended
 * case 2 covering log^k factors). Compares c (the exponent of n in f) against
 * the watershed e = log_b a.
 */
export function classifyMaster({ a, b, c, k }: MasterInput): MasterResult {
  const e = Math.log(a) / Math.log(b)
  const eInt = Math.round(e)
  const eIsInt = Math.abs(e - eInt) < EPS
  const eTex = eIsInt ? String(eInt) : `\\log_{${numFmt(b)}} ${numFmt(a)}`
  const eApproxTex = eIsInt ? '' : ` \\approx ${e.toFixed(2)}`

  const fTex = product(nPow(c, numFmt(c)), logPow(k))
  const watershedTex = nPow(e, eTex) || '1'

  let caseNo: 1 | 2 | 3
  let resultTex: string
  let reasonHe: string

  if (c < e - EPS) {
    caseNo = 1
    resultTex = `\\Theta(${product(nPow(e, eTex))})`
    reasonHe =
      'f(n) קטן פולינומיאלית מ-n^{log_b a}, ולכן העלות נשלטת על-ידי העלים — מספר תת-הבעיות גדל מהר יותר מהעבודה בכל רמה.'
  } else if (Math.abs(c - e) <= EPS) {
    caseNo = 2
    resultTex = `\\Theta(${product(nPow(e, eTex), logPow(k + 1))})`
    reasonHe =
      'f(n) באותו סדר גודל כמו n^{log_b a}: כל אחת מ-log_b n הרמות תורמת עלות שווה, ולכן מוסיפים גורם log אחד.'
  } else {
    caseNo = 3
    resultTex = `\\Theta(${product(nPow(c, numFmt(c)), logPow(k))})`
    reasonHe =
      'f(n) גדל פולינומיאלית מהר יותר מ-n^{log_b a}, ולכן העלות נשלטת על-ידי השורש (בהנחה שמתקיים תנאי הרגולריות).'
  }

  return { e, eTex, eApproxTex, caseNo, fTex, watershedTex, resultTex, reasonHe }
}

/** One level of a divide-and-conquer recursion tree. */
export interface DivideLevel {
  /** Level index; 0 = root. */
  i: number
  /** Number of nodes at this level: a^i. */
  nodes: number
  /** Sub-problem size at this level: n / b^i. */
  size: number
}

/**
 * The levels of the recursion tree for T(n) = a·T(n/b) + f, for a concrete n
 * that is a power of b. Shared by the cost-tree visual and the iteration tab.
 */
export function divideLevels(a: number, b: number, n: number): DivideLevel[] {
  const levels: DivideLevel[] = []
  let size = n
  let i = 0
  // Guard against pathological inputs (b ≤ 1) so the loop always terminates.
  const safeB = b > 1 ? b : 2
  while (size >= 1) {
    levels.push({ i, nodes: Math.round(Math.pow(a, i)), size })
    if (size <= 1) break
    size = size / safeB
    i++
    if (i > 64) break
  }
  return levels
}

/**
 * The unrolled sizes of a "decrease-by-one" recurrence T(n) = T(n-1) + f,
 * i.e. n, n-1, …, 1. Used by the iteration tab for the Θ(n²)/Θ(n) family.
 */
export function decreaseLevels(n: number): number[] {
  const out: number[] = []
  for (let s = n; s >= 1; s--) out.push(s)
  return out
}
