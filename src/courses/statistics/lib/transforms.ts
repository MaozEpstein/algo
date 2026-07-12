/**
 * Pure helpers for lesson 3 (functions of random variables). The change-of-
 * variables pushforward, the two headline transforms (affine and square), the
 * sigmoid inverse, and inverse-CDFs for inverse-transform sampling. Deterministic
 * and total — shared with the TransformExplorer / InverseSamplingExplorer visuals
 * and the lesson test.
 */

export type Pdf = (x: number) => number

/**
 * Change of variables for an invertible Y=g(X): given the inverse h=g⁻¹ and its
 * derivative, f_Y(y) = f_X(h(y))·|h'(y)|  (Theorem 3.1).
 */
export function pushforwardPdf(fX: Pdf, hInv: (y: number) => number, dhInv: (y: number) => number, y: number): number {
  return fX(hInv(y)) * Math.abs(dhInv(y))
}

/** Affine Y=aX+b (a≠0): f_Y(y) = (1/|a|) f_X((y−b)/a). */
export function affinePdf(fX: Pdf, a: number, b: number, y: number): number {
  if (a === 0) return 0
  return (1 / Math.abs(a)) * fX((y - b) / a)
}

/** Square Y=X² (non-invertible): sum over the two roots ±√y, y>0. */
export function squarePdf(fX: Pdf, y: number): number {
  if (y <= 0) return 0
  const r = Math.sqrt(y)
  return (fX(r) + fX(-r)) / (2 * r)
}

// ── Sigmoid Y=σ(X)=1/(1+e^{−X}), maps ℝ → (0,1) (Example 13) ───────────────────
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}
/** Inverse (logit): x = ln(y/(1−y)), y∈(0,1). */
export function sigmoidInv(y: number): number {
  return Math.log(y / (1 - y))
}
/** |d/dy sigmoidInv| = 1/(y(1−y)). */
export function dSigmoidInv(y: number): number {
  return 1 / (y * (1 - y))
}

// ── Inverse-CDFs for inverse-transform sampling (Theorem 3.5) ──────────────────
/** Exponential: F⁻¹(u) = −ln(1−u)/λ. */
export function expInvCdf(u: number, lambda: number): number {
  return -Math.log(1 - u) / lambda
}
/** Uniform U(a,b): F⁻¹(u) = a + u(b−a). */
export function uniformInvCdf(u: number, a: number, b: number): number {
  return a + u * (b - a)
}
