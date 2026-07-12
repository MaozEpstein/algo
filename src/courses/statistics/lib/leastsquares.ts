/**
 * Pure least-squares helpers for lesson 7. The line-fit closed form, the sum of
 * squared residuals, a small Gaussian-elimination solver, ridge polynomial
 * fitting via the normal equations (HᵀH+λI)⁻¹Hᵀy, and the robust median.
 * Deterministic and total — shared with the RegressionExplorer / RidgeExplorer /
 * MeanVsMedian visuals and the lesson test.
 */

/** Ordinary least-squares line y = a + b·x (intercept a, slope b). */
export function lineFit(xs: number[], ys: number[]): { a: number; b: number } {
  const n = xs.length
  const xbar = xs.reduce((s, x) => s + x, 0) / n
  const ybar = ys.reduce((s, y) => s + y, 0) / n
  let sxy = 0
  let sxx = 0
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar)
    sxx += (xs[i] - xbar) ** 2
  }
  const b = sxx === 0 ? 0 : sxy / sxx
  return { a: ybar - b * xbar, b }
}

/** Sum of squared residuals of the line y = a + b·x. */
export function ssr(xs: number[], ys: number[], a: number, b: number): number {
  let s = 0
  for (let i = 0; i < xs.length; i++) s += (ys[i] - (a + b * xs[i])) ** 2
  return s
}

export function median(xs: number[]): number {
  const s = [...xs].sort((p, q) => p - q)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Solve A·x = b for a small square system via Gaussian elimination with partial pivoting. */
export function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length
  const M = A.map((row, i) => [...row, b[i]]) // augmented
  for (let col = 0; col < n; col++) {
    // partial pivot
    let piv = col
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    ;[M[col], M[piv]] = [M[piv], M[col]]
    const d = M[col][col] || 1e-12
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = M[r][col] / d
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c]
    }
  }
  return M.map((row, i) => row[n] / (row[i] || 1e-12))
}

/**
 * Ridge polynomial fit of the given degree: coefficients c₀..c_degree minimizing
 * ‖y − Hc‖² + λ‖c‖², where H is the Vandermonde matrix. Returns the coefficients.
 */
export function polyFit(xs: number[], ys: number[], degree: number, lambda = 0): number[] {
  const K = degree + 1
  const n = xs.length
  // H (n×K) Vandermonde
  const H: number[][] = xs.map((x) => Array.from({ length: K }, (_, j) => x ** j))
  // HᵀH + λI  (K×K),  Hᵀy  (K)
  const A: number[][] = Array.from({ length: K }, () => new Array(K).fill(0))
  const rhs = new Array(K).fill(0)
  for (let j = 0; j < K; j++) {
    for (let k = 0; k < K; k++) {
      let s = 0
      for (let i = 0; i < n; i++) s += H[i][j] * H[i][k]
      A[j][k] = s + (j === k ? lambda : 0)
    }
    let sy = 0
    for (let i = 0; i < n; i++) sy += H[i][j] * ys[i]
    rhs[j] = sy
  }
  return solveLinear(A, rhs)
}

/** Evaluate a polynomial (coefficients low→high) at x via Horner. */
export function predict(coeffs: number[], x: number): number {
  let v = 0
  for (let j = coeffs.length - 1; j >= 0; j--) v = v * x + coeffs[j]
  return v
}
