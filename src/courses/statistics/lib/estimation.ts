import { gaussianPdf } from './distributions'

/**
 * Pure estimation helpers for lesson 6 (maximum likelihood). The Gaussian-mean
 * log-likelihood curve, sample statistics, the bias-variance MSE decomposition,
 * the shrinkage-estimator MSE (תרגול 7 §4), and a deterministic normal sampler
 * for the bias-variance sandbox. Deterministic and total — shared with the
 * LikelihoodExplorer / BiasVarianceExplorer visuals and the lesson test.
 */

/** Log-likelihood of data under N(μ, σ²) as a function of μ. Peaks at the sample mean. */
export function logLikGaussianMean(data: number[], mu: number, sigma: number): number {
  let s = 0
  for (const x of data) s += Math.log(gaussianPdf(x, mu, sigma))
  return s
}

export function sampleMean(data: number[]): number {
  return data.reduce((a, b) => a + b, 0) / data.length
}
/** ML variance estimator, ÷N (biased). */
export function sampleVarBiased(data: number[]): number {
  const m = sampleMean(data)
  return data.reduce((a, x) => a + (x - m) ** 2, 0) / data.length
}
/** Unbiased variance estimator, ÷(N−1). */
export function sampleVarUnbiased(data: number[]): number {
  const m = sampleMean(data)
  return data.reduce((a, x) => a + (x - m) ** 2, 0) / (data.length - 1)
}

/** Bias-variance decomposition: MSE = bias² + variance. */
export function mse(bias: number, variance: number): number {
  return bias * bias + variance
}

/**
 * MSE of the shrinkage estimator μ̂=α·(sample mean) for N i.i.d. N(μ,σ²):
 * MSE = α²σ²/N + (α−1)²μ²  (variance + bias²). α=1 recovers the MLE (σ²/N).
 */
export function shrinkageMSE(alpha: number, mu: number, sigma2: number, n: number): number {
  return (alpha * alpha * sigma2) / n + (alpha - 1) ** 2 * mu * mu
}

/** Deterministic N(μ,σ²) samples via a seeded LCG + Box–Muller. */
export function seededNormals(seed: number, mu: number, sigma: number, count: number): number[] {
  let s = (seed >>> 0) || 1
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd())))
    out.push(mu + sigma * r * Math.cos(2 * Math.PI * rnd()))
  }
  return out
}
