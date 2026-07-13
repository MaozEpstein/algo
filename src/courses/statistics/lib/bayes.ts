/**
 * Pure Bayesian-estimation helpers for lesson 8. The conjugate-Gaussian
 * posterior (weighted-average MMSE), the Beta posterior for the Bernoulli case,
 * a numeric median of a sampled density, and the soft/hard decision of the
 * bit-through-Gaussian-channel example. Deterministic and total — shared with the
 * PosteriorExplorer / SoftDecisionExplorer visuals and the lesson test.
 */

/**
 * Conjugate Gaussian: prior Y~N(μ,σ_y²), observation X=Y+W with W~N(0,σ_w²).
 * The posterior Y|X=x is Gaussian; its mean is the weighted average of the data
 * and the prior mean, and its variance is σ_y²σ_w²/(σ_y²+σ_w²).
 */
export function gaussianPosterior(muPrior: number, varPrior: number, x: number, varNoise: number): { mean: number; variance: number } {
  const w = varPrior / (varPrior + varNoise)
  return { mean: w * x + (1 - w) * muPrior, variance: (varPrior * varNoise) / (varPrior + varNoise) }
}

/** Unnormalised Beta density x^{a−1}(1−x)^{b−1} on (0,1). */
export function betaPdfUnnorm(x: number, a: number, b: number): number {
  if (x <= 0 || x >= 1) return 0
  return x ** (a - 1) * (1 - x) ** (b - 1)
}
/** Posterior mean of Beta(a,b). */
export function betaMean(a: number, b: number): number {
  return a / (a + b)
}
/** Posterior mode of Beta(a,b) (for a,b>1). */
export function betaMode(a: number, b: number): number {
  return (a - 1) / (a + b - 2)
}

/** Median of a density sampled over [lo,hi] (returns the x where the CDF crosses ½). */
export function numericMedian(pdf: (x: number) => number, lo: number, hi: number, n = 400): number {
  const dx = (hi - lo) / n
  let total = 0
  for (let i = 0; i < n; i++) total += pdf(lo + (i + 0.5) * dx) * dx
  let acc = 0
  for (let i = 0; i < n; i++) {
    acc += pdf(lo + (i + 0.5) * dx) * dx
    if (acc >= total / 2) return lo + (i + 0.5) * dx
  }
  return hi
}

// ── Bit through a Gaussian channel (Example 28) ───────────────────────────────
/** MMSE "soft decision" E[X|Y=y] for X~Bern(p), Y=X+N, N~N(0,σ²). Sigmoid-shaped. */
export function softDecision(y: number, p: number, sigma: number): number {
  const a = p * Math.exp(-((y - 1) ** 2) / (2 * sigma * sigma))
  const b = (1 - p) * Math.exp(-(y ** 2) / (2 * sigma * sigma))
  return a / (a + b)
}
/** MAP "hard decision" threshold: decide 1 when y > ½ + σ²·ln((1−p)/p). */
export function mapThreshold(p: number, sigma: number): number {
  return 0.5 + sigma * sigma * Math.log((1 - p) / p)
}
