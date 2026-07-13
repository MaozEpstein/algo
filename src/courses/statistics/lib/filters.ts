/**
 * Pure linear-random-process + optimal-filtering helpers for lesson 12 (the
 * course finale). The AR(1) moment limits (asymptotic stationarity), the finite-
 * horizon Wiener filter (normal equations h=(R_X+σ_W²I)⁻¹r_XY), and the scalar
 * Kalman filter (recursive predict/update). Deterministic and total — shared with
 * the ArConvergenceExplorer / KalmanFilterExplorer visuals and the lesson test.
 * Reuses `solveLinear` from ./leastsquares (no hand-rolled matrix inversion).
 */

import { solveLinear } from './leastsquares'

/**
 * Finite-n moments of AR(1) X_n=αX_{n−1}+W_n started from X_0 (mean 0, var `var0`),
 * W white with mean `muW`, variance `sigmaW2` (eqs. 325–326):
 *   E[X_n]=μ_W(1−αⁿ)/(1−α),  Var(X_n)=σ_W²(1−α^{2n})/(1−α²)+α^{2n}·var0.
 */
export function arMoments(n: number, alpha: number, sigmaW2: number, muW = 0, var0 = 0): { mean: number; variance: number } {
  const a2n = alpha ** (2 * n)
  const mean = alpha === 1 ? muW * n : (muW * (1 - alpha ** n)) / (1 - alpha)
  const variance = alpha * alpha === 1 ? sigmaW2 * n + var0 : (sigmaW2 * (1 - a2n)) / (1 - alpha * alpha) + a2n * var0
  return { mean, variance }
}

/** Stationary limits of a stable AR(1), |α|<1 (eqs. 325–328): mean μ_W/(1−α), var σ_W²/(1−α²). */
export function arLimits(alpha: number, sigmaW2: number, muW = 0): { mean: number; variance: number; cov: (tau: number) => number } {
  const variance = sigmaW2 / (1 - alpha * alpha)
  return {
    mean: muW / (1 - alpha),
    variance,
    cov: (tau: number) => variance * alpha ** Math.abs(tau),
  }
}

/**
 * Finite-horizon Wiener filter (Ex 48, eqs. 334/346–347): estimate X_k from
 * observations Y_n=X_n+W_n (n=1..N) with the optimal taps h=(R_X+σ_W²I)⁻¹ r_{XY},
 * where `rX(lag)` is the input autocorrelation and W is white with variance `sigmaW2`.
 * Returns the length-N tap vector (indexed by observation 1..N).
 */
export function wienerFilter(rX: (lag: number) => number, sigmaW2: number, N: number, k: number): number[] {
  // R_Y = R_X + σ_W² I, with (R_X)_{ij}=rX(i−j); observations indexed 1..N.
  const RY: number[][] = Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) => rX(i - j) + (i === j ? sigmaW2 : 0)),
  )
  // r_{XY}[n] = E[X_k Y_n] = rX(k − n), n=1..N.
  const rxy = Array.from({ length: N }, (_, i) => rX(k - (i + 1)))
  return solveLinear(RY, rxy)
}

/**
 * One Kalman step (recitation §3): from the previous posterior (sHat, P) and a new
 * observation x, predict S_n=a·S and inflate by σ_Q², then update with gain
 * K=P⁻/(P⁻+σ_R²). Returns the new posterior estimate, error variance, and gain.
 */
export function kalmanStep(
  prev: { sHat: number; P: number },
  x: number,
  a: number,
  sigmaQ2: number,
  sigmaR2: number,
): { sHat: number; P: number; K: number } {
  const sPred = a * prev.sHat
  const pPred = a * a * prev.P + sigmaQ2
  const K = pPred / (pPred + sigmaR2)
  return { sHat: sPred + K * (x - sPred), P: pPred * (1 - K), K }
}

/**
 * Run the scalar Kalman filter over a sequence of observations for the model
 * S_n=a·S_{n−1}+Q_n, X_n=S_n+R_n. Returns the filtered estimates, posterior error
 * variances, and gains. `s0Var` is the prior variance of S_0 (prior mean 0).
 */
export function kalmanRun(
  obs: number[],
  a: number,
  sigmaQ2: number,
  sigmaR2: number,
  s0Var: number,
): { sHat: number[]; P: number[]; K: number[] } {
  const sHat: number[] = []
  const P: number[] = []
  const K: number[] = []
  let prev = { sHat: 0, P: s0Var }
  for (const x of obs) {
    const step = kalmanStep(prev, x, a, sigmaQ2, sigmaR2)
    sHat.push(step.sHat)
    P.push(step.P)
    K.push(step.K)
    prev = { sHat: step.sHat, P: step.P }
  }
  return { sHat, P, K }
}
