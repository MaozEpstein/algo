/**
 * Pure seeded samplers + Central-Limit-Theorem helpers for the overview's CLT
 * sandbox. Deterministic (LCG) so the histogram is stable across renders, and
 * total. `sampleMeans` draws `count` averages of `n` i.i.d. base samples; by the
 * CLT its distribution approaches N(μ, σ²/n) — `cltTarget` gives that limit.
 */

export type BaseDist = 'uniform' | 'exp' | 'bernoulli'

/** Per-base fixed parameters + their true mean/variance (so the overlay is exact). */
export const BASE_PARAMS: Record<BaseDist, { mean: number; variance: number }> = {
  uniform: { mean: 0.5, variance: 1 / 12 }, // U(0,1)
  exp: { mean: 1, variance: 1 }, // Exp(1)
  bernoulli: { mean: 0.5, variance: 0.25 }, // Bern(0.5)
}

/** Deterministic uniform(0,1) stream from a seed (LCG). */
function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => (s = (1103515245 * s + 12345) >>> 0) / 4294967296
}

/** One draw from the base distribution given a uniform(0,1) source. */
function draw(base: BaseDist, u: () => number): number {
  if (base === 'uniform') return u()
  if (base === 'exp') return -Math.log(Math.max(u(), 1e-12)) // Exp(1) via inverse CDF
  return u() < 0.5 ? 1 : 0 // Bern(0.5)
}

/** The CLT limit for the mean of `n` i.i.d. base samples: N(μ, σ²/n). */
export function cltTarget(base: BaseDist, n: number): { mean: number; variance: number } {
  const p = BASE_PARAMS[base]
  return { mean: p.mean, variance: p.variance / n }
}

/**
 * `count` sample means, each the average of `n` i.i.d. draws from `base`.
 * Deterministic per seed. As n grows the spread shrinks toward the CLT limit.
 */
export function sampleMeans(base: BaseDist, n: number, count: number, seed: number): number[] {
  const u = lcg(seed)
  const out: number[] = []
  for (let c = 0; c < count; c++) {
    let sum = 0
    for (let i = 0; i < n; i++) sum += draw(base, u)
    out.push(sum / n)
  }
  return out
}

/** Empirical mean and (population) variance of a sample — for the sandbox readout/tests. */
export function empiricalStats(xs: number[]): { mean: number; variance: number } {
  const n = xs.length
  const mean = xs.reduce((s, x) => s + x, 0) / n
  const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n
  return { mean, variance }
}
