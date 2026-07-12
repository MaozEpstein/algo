/**
 * Pure 2-D Gaussian helpers for lesson 4 (multivariate normal). The eigen-
 * decomposition of a 2×2 covariance (density-contour + whitening axes) and the
 * bivariate conditional (Thm 4.6). Deterministic and total — shared with the
 * GaussianVectorExplorer visual and the lesson test.
 */

/**
 * Eigen-decomposition of the covariance C = [[σx², ρσxσy],[ρσxσy, σy²]].
 * Returns the ellipse semi-axes (√eigenvalues) and the tilt of the major axis.
 * ρ=0 → axis-aligned (angle 0); equal variances with ρ>0 → +45°.
 */
export function covEigen(sx: number, sy: number, rho: number): { major: number; minor: number; angleRad: number } {
  const a = sx * sx
  const c = sy * sy
  const b = rho * sx * sy
  const mean = (a + c) / 2
  const diff = (a - c) / 2
  const rad = Math.sqrt(diff * diff + b * b)
  const l1 = mean + rad // larger eigenvalue
  const l2 = Math.max(0, mean - rad)
  // eigenvector angle of the larger eigenvalue
  const angle = 0.5 * Math.atan2(2 * b, a - c)
  return { major: Math.sqrt(l1), minor: Math.sqrt(l2), angleRad: angle }
}

/**
 * Bivariate conditional X | Y=y for a zero-mean jointly-Gaussian (X,Y) with
 * correlation ρ (Thm 4.6): mean = ρ(σx/σy)y, variance = σx²(1−ρ²).
 */
export function conditionalNormal(sx: number, sy: number, rho: number, y: number): { mean: number; variance: number } {
  return { mean: rho * (sx / sy) * y, variance: sx * sx * (1 - rho * rho) }
}
