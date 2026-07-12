/**
 * Pure moment helpers for lesson 2. Analytic mean/variance of the standard
 * families (feeds the MomentsExplorer's balance-point + spread), the law of
 * total variance for a discrete mixture (demoes תרגול 2 שאלה 4), and the
 * bivariate-Gaussian density ellipse geometry (feeds the CorrelationExplorer).
 * Deterministic and total — shared with the lesson test.
 */

export type DistId = 'uniform' | 'exp' | 'gauss' | 'bernoulli' | 'binomial' | 'poisson'

/** Analytic E[X] and Var(X) of a named distribution given its parameters. */
export function distMoments(id: DistId, p: Record<string, number>): { mean: number; variance: number } {
  switch (id) {
    case 'uniform': {
      const a = Math.min(p.a, p.b)
      const b = Math.max(p.a, p.b)
      return { mean: (a + b) / 2, variance: (b - a) ** 2 / 12 }
    }
    case 'exp':
      return { mean: 1 / p.lambda, variance: 1 / p.lambda ** 2 }
    case 'gauss':
      return { mean: p.m, variance: p.sigma ** 2 }
    case 'bernoulli':
      return { mean: p.theta, variance: p.theta * (1 - p.theta) }
    case 'binomial':
      return { mean: p.n * p.p, variance: p.n * p.p * (1 - p.p) }
    case 'poisson':
      return { mean: p.lambda, variance: p.lambda }
  }
}

/**
 * Law of total variance for a discrete mixture: X takes component i (mean μᵢ,
 * variance vᵢ) with weight wᵢ. Returns the overall mean and
 * Var(X)=E_Y[Var(X|Y)] + Var_Y(E[X|Y]).
 */
export function mixtureMoments(
  components: { weight: number; mean: number; variance: number }[],
): { mean: number; withinVar: number; betweenVar: number; variance: number } {
  const mean = components.reduce((s, c) => s + c.weight * c.mean, 0)
  const withinVar = components.reduce((s, c) => s + c.weight * c.variance, 0)
  const betweenVar = components.reduce((s, c) => s + c.weight * (c.mean - mean) ** 2, 0)
  return { mean, withinVar, betweenVar, variance: withinVar + betweenVar }
}

/**
 * Residual (conditional) standard deviation of Y given X for a standardized
 * bivariate Gaussian with correlation ρ: Var(Y|X)=1−ρ² ⇒ std=√(1−ρ²). This is
 * the uncertainty in Y that *remains after knowing X* — full (1) when ρ=0, zero
 * when |ρ|=1. Feeds the correlation sandbox's shrinking prediction band.
 */
export function conditionalStd(rho: number): number {
  const r = Math.max(-1, Math.min(1, rho))
  return Math.sqrt(1 - r * r)
}
