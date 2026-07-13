/**
 * Pure linear-Bayesian (LMMSE / BLE) helpers for lesson 9. The scalar affine
 * estimator and its Bayesian MSE, the general (vector) affine form via the
 * shared Gaussian-elimination solver, the two-sensor closed form (Example 31),
 * and the cubic Y=X³ contrast (recitation 10) where LMMSE ≠ MMSE. Deterministic
 * and total — shared with the LmmseExplorer / LinearVsMmseExplorer visuals and
 * the lesson test. Reuses `solveLinear` from ./leastsquares (no hand-rolled
 * matrix inversion).
 */

import { solveLinear } from './leastsquares'

export interface ScalarMoments {
  muX: number
  varX: number
  muY: number
  varY: number
  covXY: number
}

/**
 * Scalar LMMSE of X from the observation y (Thm 9.1, affine form eq. 239):
 * x̂ = μ_x + (σ_xy/σ_y²)(y − μ_y); Bayesian MSE = σ_x² − σ_xy²/σ_y².
 * Cov=0 ⇒ estimate collapses to the prior mean μ_x and MSE stays σ_x².
 */
export function lmmseScalar(m: ScalarMoments, y: number): { estimate: number; mse: number } {
  const gain = m.covXY / m.varY
  return {
    estimate: m.muX + gain * (y - m.muY),
    mse: m.varX - (m.covXY * m.covXY) / m.varY,
  }
}

/**
 * General (vector) affine LMMSE (eq. 239): x̂ = μ_x + C_xy C_yy⁻¹(y − μ_y), with
 * error covariance C_xx − C_xy C_yy⁻¹ C_yx. `Cxy` is dim(x)×dim(y); `Cyy` is
 * dim(y)×dim(y); `Cxx` is dim(x)×dim(x). Solves C_yy w = (y − μ_y) column by
 * column via `solveLinear` rather than inverting.
 */
export function lmmseAffine(
  muX: number[],
  muY: number[],
  Cxy: number[][],
  Cyy: number[][],
  Cxx: number[][],
  y: number[],
): { estimate: number[]; errorCov: number[][] } {
  const dy = muY.length
  const dx = muX.length
  // w = C_yy⁻¹ (y − μ_y)
  const w = solveLinear(Cyy, y.map((yi, i) => yi - muY[i]))
  const estimate = muX.map((mx, r) => mx + Cxy[r].reduce((s, c, k) => s + c * w[k], 0))

  // error covariance: C_xx − C_xy C_yy⁻¹ C_yx. Solve C_yy M = C_yx (column j).
  const Cyx = (i: number, r: number) => Cxy[r][i] // (C_yx)_{i r} = (C_xy)_{r i}
  const errorCov: number[][] = Array.from({ length: dx }, () => new Array(dx).fill(0))
  for (let c = 0; c < dx; c++) {
    const col = solveLinear(Cyy, Array.from({ length: dy }, (_, i) => Cyx(i, c)))
    for (let r = 0; r < dx; r++) {
      const reduction = Cxy[r].reduce((s, cxy, k) => s + cxy * col[k], 0)
      errorCov[r][c] = Cxx[r][c] - reduction
    }
  }
  return { estimate, errorCov }
}

/**
 * Two-sensor fusion (Example 31): y∼N(μ,σ²), x₁=y+n₁, x₂=y+n₂ with
 * n_k∼N(0,σ_k²). The MMSE (=LMMSE, jointly Gaussian) is a precision-weighted
 * average of the two readings and the prior:
 *   ŷ = μ + ((x₁−μ)/σ₁² + (x₂−μ)/σ₂²) / (1/σ₁² + 1/σ₂² + 1/σ²).
 * σ₁≪σ₂ → x₁; both σ→∞ → μ; equal σ (weak prior) → (x₁+x₂)/2.
 */
export function twoSensor(mu: number, sig2: number, s1: number, s2: number, x1: number, x2: number): number {
  const p1 = 1 / (s1 * s1)
  const p2 = 1 / (s2 * s2)
  const num = (x1 - mu) * p1 + (x2 - mu) * p2
  const den = p1 + p2 + 1 / sig2
  return mu + num / den
}

/**
 * The cubic contrast (recitation 10 · שאלה 3): X∼N(0,σ²), Y=X³. LMMSE is a
 * straight line while the true MMSE is a cubic, so they differ. Returns the BLE
 * slopes in both directions and the two Bayesian MSEs.
 *   Ŷ_MMSE = x³ (curve),  Ŷ_BLE = 3σ²·x,   X̂_BLE = y/(5σ²)
 *   MSE(Ŷ_BLE) = 6σ⁶,     MSE(X̂_BLE) = (2/5)σ²
 */
export function cubicExample(sigmaX: number): {
  bleYslope: number
  bleXslope: number
  mseBLEy: number
  mseBLEx: number
} {
  const s2 = sigmaX * sigmaX
  return {
    bleYslope: 3 * s2,
    bleXslope: 1 / (5 * s2),
    mseBLEy: 6 * s2 * s2 * s2,
    mseBLEx: (2 / 5) * s2,
  }
}
