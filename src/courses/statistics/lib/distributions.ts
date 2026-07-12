/**
 * Pure, dependency-free probability functions for the standard distributions
 * taught in lesson 1 (Uniform, Exponential, Gaussian, Poisson). Shared by the
 * DistributionExplorer visual and the lesson test. Every function is total and
 * deterministic — same input → same output.
 */

/** Error function (Abramowitz & Stegun 7.1.26), max error ~1.5e-7. */
export function erf(x: number): number {
  const sign = Math.sign(x)
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x)
  return sign * y
}

// ── Uniform U(a,b) ────────────────────────────────────────────────────────────
export function uniformPdf(x: number, a: number, b: number): number {
  return x >= a && x <= b ? 1 / (b - a) : 0
}
export function uniformCdf(x: number, a: number, b: number): number {
  if (x < a) return 0
  if (x >= b) return 1
  return (x - a) / (b - a)
}

// ── Exponential Exp(λ) ────────────────────────────────────────────────────────
export function expPdf(x: number, lambda: number): number {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0
}
export function expCdf(x: number, lambda: number): number {
  return x >= 0 ? 1 - Math.exp(-lambda * x) : 0
}

// ── Gaussian N(m, σ²) ─────────────────────────────────────────────────────────
export function gaussianPdf(x: number, m: number, sigma: number): number {
  const z = (x - m) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}
export function gaussianCdf(x: number, m: number, sigma: number): number {
  return 0.5 * (1 + erf((x - m) / (sigma * Math.SQRT2)))
}

// ── Poisson Pois(λ) (discrete) ────────────────────────────────────────────────
export function poissonPmf(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) return 0
  // e^{-λ} λ^k / k!  — computed in log space for stability
  let logf = -lambda + k * Math.log(lambda)
  for (let i = 2; i <= k; i++) logf -= Math.log(i)
  return Math.exp(logf)
}
export function poissonCdf(k: number, lambda: number): number {
  let sum = 0
  for (let i = 0; i <= Math.floor(k); i++) sum += poissonPmf(i, lambda)
  return sum
}

// ── Bernoulli Bern(θ) & Binomial Bin(n,p) (discrete) ──────────────────────────
/** Binomial coefficient "n choose k" (multiplicative form, exact for small n). */
export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  k = Math.min(k, n - k)
  let c = 1
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1)
  return c
}

export function bernoulliPmf(k: number, theta: number): number {
  if (k === 0) return 1 - theta
  if (k === 1) return theta
  return 0
}

export function binomialPmf(k: number, n: number, p: number): number {
  if (k < 0 || k > n || !Number.isInteger(k)) return 0
  return choose(n, k) * p ** k * (1 - p) ** (n - k)
}
