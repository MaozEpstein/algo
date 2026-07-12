import { gaussianCdf } from './distributions'

/**
 * Pure detection helpers for lesson 5 (simple hypothesis testing). The Gaussian
 * Q-function and its inverse, the Gaussian ROC, and the Bayesian (min-error)
 * decision threshold + probability of error for two equal-variance Gaussians.
 * Deterministic and total — shared with the DetectionExplorer and the lesson test.
 */

/** Q(x) = Pr(Z > x) = 1 − Φ(x), Z ~ N(0,1). */
export function qFunc(x: number): number {
  return 1 - gaussianCdf(x, 0, 1)
}

/**
 * Inverse standard-normal CDF Φ⁻¹(p) (Acklam's rational approximation,
 * |error| < 1.2e-9). Used for Q⁻¹(p) = Φ⁻¹(1−p).
 */
export function normInv(p: number): number {
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239]
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]
  const plow = 0.02425
  const phigh = 1 - plow
  let q: number, r: number
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p))
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  q = p - 0.5
  r = q * q
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
}

/** Q⁻¹(p) = Φ⁻¹(1−p). */
export function qInv(p: number): number {
  return normInv(1 - p)
}

/** Gaussian ROC: P_D as a function of P_FA and separation d. P_D = Q(Q⁻¹(P_FA) − d). */
export function rocPd(pfa: number, d: number): number {
  return qFunc(qInv(pfa) - d)
}

/**
 * Min-error (Bayesian / MAP) decision threshold on x for H0~N(μ0,σ²) vs
 * H1~N(μ1,σ²) with prior p0=P(H0): decide H1 when x > threshold (assuming μ1>μ0).
 * threshold = (μ0+μ1)/2 + σ²/(μ1−μ0)·ln(p0/(1−p0)).
 */
export function bayesThreshold(mu0: number, mu1: number, sigma: number, p0: number): number {
  return (mu0 + mu1) / 2 + (sigma * sigma / (mu1 - mu0)) * Math.log(p0 / (1 - p0))
}

/** Probability of error at a given threshold: p0·P_FA + (1−p0)·P_miss. */
export function probError(mu0: number, mu1: number, sigma: number, p0: number, threshold: number): number {
  const pfa = qFunc((threshold - mu0) / sigma) // decide H1 (x>thr) when H0 true
  const pmiss = 1 - qFunc((threshold - mu1) / sigma) // decide H0 (x<thr) when H1 true
  return p0 * pfa + (1 - p0) * pmiss
}
