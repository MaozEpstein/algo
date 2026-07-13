/**
 * Pure random-process helpers for lesson 10 (chapter 10). Closed-form marginals
 * and autocorrelations for the textbook processes (counting/Binomial Ex 33, XOR
 * Ex 34, MA(1) and AR(1)), plus deterministic seeded realization generators that
 * feed the ProcessExplorer / MarginalDriftExplorer sandboxes and the lesson test.
 * Total and reproducible — a given seed always yields the same realization.
 */

/** Counting process Xₙ=Σ₁ⁿWᵢ, Wᵢ~Ber(p) (Ex 33): Xₙ~Bin(n,p), E=np, Var=np(1−p). */
export function countingStats(n: number, p: number): { mean: number; variance: number } {
  return { mean: n * p, variance: n * p * (1 - p) }
}

/** XOR process Xₙ=mod2(ΣWᵢ) (Ex 34): P(Xₙ=1)=½[1−(1−2p)ⁿ], P(Xₙ=0)=½[1+(1−2p)ⁿ]. */
export function xorMarginal(n: number, p: number): { p1: number; p0: number } {
  const d = (1 - 2 * p) ** n
  return { p1: 0.5 * (1 - d), p0: 0.5 * (1 + d) }
}

/** MA(1) X[n]=w[n]+w[n−1], w white with the given variance: r(0)=2σ², r(±1)=σ², else 0. */
export function maAutocorr(lag: number, variance = 1): number {
  const k = Math.abs(lag)
  if (k === 0) return 2 * variance
  if (k === 1) return variance
  return 0
}

/** AR(1) Y[n]=aY[n−1]+w[n], |a|<1, w white: r(k)=σ²a^{|k|}/(1−a²). */
export function arAutocorr(lag: number, a: number, variance = 1): number {
  return (variance * a ** Math.abs(lag)) / (1 - a * a)
}

/** Random-phase cosine X(t)=cos(2πf t+Θ), Θ~U[−π,π] (Ex 41): R_X(τ)=½cos(2πf·τ). */
export function cosineAutocorr(lag: number, f: number): number {
  return 0.5 * Math.cos(2 * Math.PI * f * lag)
}

/** Random walk X[n]=Σ₁ⁿW[i], W white (Ex 43): R_X(n,m)=σ²·min(n,m). Not WSS. */
export function randomWalkAutocorr(n: number, m: number, variance = 1): number {
  return variance * Math.min(n, m)
}

/** Output mean of a stable LTI system y=h*x on a WSS input (Ex 45, eq. 319): E[Y]=(Σh[i])·μ_X. */
export function ltiOutputMean(h: number[], muX: number): number {
  return muX * h.reduce((s, hi) => s + hi, 0)
}

/**
 * Output autocorrelation of a stable LTI system y[n]=Σ h[i]x[n−i] on a WSS input
 * (Ex 45, eq. 320): R_Y(k)=Σᵢ Σⱼ h[i]h[j] R_X[k+j−i], where `rX` is the input
 * autocorrelation function. `h` is indexed from tap 0.
 */
export function ltiOutputAutocorr(h: number[], rX: (lag: number) => number, lag: number): number {
  let s = 0
  for (let i = 0; i < h.length; i++)
    for (let j = 0; j < h.length; j++) s += h[i] * h[j] * rX(lag + j - i)
  return s
}

/** Deterministic uniform(0,1) stream from a seed (LCG) — reproducible realizations. */
function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => (s = (1103515245 * s + 12345) >>> 0) / 4294967296
}

/** Standard-normal stream (Box–Muller) built on the LCG. */
function gaussStream(seed: number): () => number {
  const u = lcg(seed)
  return () => {
    const u1 = Math.max(u(), 1e-6)
    const u2 = u()
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  }
}

/** i.i.d. Bernoulli realization: each sample 1 w.p. p, else 0. */
export function iidBernoulli(len: number, p: number, seed: number): number[] {
  const u = lcg(seed)
  return Array.from({ length: len }, () => (u() < p ? 1 : 0))
}

/** Counting / random-walk realization Xₙ=Σ Wᵢ, Wᵢ~Ber(p) (nondecreasing). */
export function randomWalk(len: number, p: number, seed: number): number[] {
  const u = lcg(seed)
  const out: number[] = []
  let acc = 0
  for (let i = 0; i < len; i++) {
    acc += u() < p ? 1 : 0
    out.push(acc)
  }
  return out
}

/** Gaussian MA(1) realization X[n]=w[n]+w[n−1], w~N(0,1). */
export function maProcess(len: number, seed: number): number[] {
  const g = gaussStream(seed)
  const out: number[] = []
  let prev = g()
  for (let i = 0; i < len; i++) {
    const w = g()
    out.push(w + prev)
    prev = w
  }
  return out
}

/** Gaussian AR(1) realization Y[n]=a·Y[n−1]+w[n], w~N(0,1). */
export function arProcess(len: number, a: number, seed: number): number[] {
  const g = gaussStream(seed)
  const out: number[] = []
  let y = 0
  for (let i = 0; i < len; i++) {
    y = a * y + g()
    out.push(y)
  }
  return out
}

/** Random-phase cosine realization A·cos(2πf·n+Θ), Θ~U(0,2π), A~U(0.6,1.4). */
export function cosineProcess(len: number, f: number, seed: number): number[] {
  const u = lcg(seed)
  const theta = u() * 2 * Math.PI
  const amp = 0.6 + 0.8 * u()
  return Array.from({ length: len }, (_, n) => amp * Math.cos(2 * Math.PI * f * n + theta))
}
