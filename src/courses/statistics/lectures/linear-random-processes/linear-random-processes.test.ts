import { describe, it, expect } from 'vitest'
import { arMoments, arLimits, wienerFilter, kalmanRun, kalmanStep } from '../../lib/filters'
import { linearRPLecture } from './index'
import { LECTURE_LIST } from '../../registry'

describe('filters — AR moment limits (eqs. 325–328)', () => {
  it('arLimits: mean μ_W/(1−α), variance σ²/(1−α²)', () => {
    expect(arLimits(0.5, 1, 2).mean).toBeCloseTo(2 / 0.5, 12) // 4
    expect(arLimits(0.5, 1).variance).toBeCloseTo(1 / (1 - 0.25), 12) // 4/3
    expect(arLimits(0.5, 1).cov(2)).toBeCloseTo(arLimits(0.5, 1).variance * 0.25, 12)
  })
  it('arMoments → arLimits as n grows', () => {
    const lim = arLimits(0.7, 1).variance
    expect(arMoments(200, 0.7, 1).variance).toBeCloseTo(lim, 6)
    expect(arMoments(1, 0.7, 1).variance).toBeCloseTo(1, 12) // first step = σ²
  })
})

describe('filters — Wiener filter (Ex 48)', () => {
  it('white input gives shrinkage h = e_k/(1+σ_W²)', () => {
    const white = (k: number) => (k === 0 ? 1 : 0)
    const h = wienerFilter(white, 3, 4, 2) // target k=2, N=4, σ_W²=3
    // R_Y = I + 3I = 4I ; r_XY has a single 1 at n=k=2 → h = (1/4) e_2
    expect(h[1]).toBeCloseTo(1 / 4, 12) // observation index 2 (0-based 1)
    for (const i of [0, 2, 3]) expect(h[i]).toBeCloseTo(0, 12)
  })
  it('reduces to the scalar LMMSE gain for N=1, k=1', () => {
    const rX = (k: number) => (k === 0 ? 5 : 0) // Var(X)=5
    const h = wienerFilter(rX, 2, 1, 1) // one observation
    expect(h[0]).toBeCloseTo(5 / (5 + 2), 12) // σ_x²/(σ_x²+σ_w²)
  })
})

describe('filters — Kalman filter (recitation §3)', () => {
  it('one step matches the weighted-average update', () => {
    const s = kalmanStep({ sHat: 0, P: 1 }, 4, 1, 0, 3) // σ_Q²=0, σ_R²=3
    // pPred = 1, K = 1/(1+3) = 0.25, sHat = 0.25·4 = 1
    expect(s.K).toBeCloseTo(0.25, 12)
    expect(s.sHat).toBeCloseTo(1, 12)
    expect(s.P).toBeCloseTo(0.75, 12)
  })
  it('noiseless observations of a constant state converge to the true value', () => {
    const obs = new Array(30).fill(5)
    const run = kalmanRun(obs, 1, 0, 0.01, 1) // tiny measurement noise
    expect(run.sHat[run.sHat.length - 1]).toBeCloseTo(5, 2)
    // posterior error variance shrinks monotonically toward 0
    expect(run.P[run.P.length - 1]).toBeLessThan(run.P[0])
  })
  it('reaches a steady state: the gain/variance stop changing and satisfy the update fixed point', () => {
    const sigQ2 = 0.5, sigR2 = 1
    const run = kalmanRun(new Array(200).fill(0), 1, sigQ2, sigR2, 1)
    const K = run.K[run.K.length - 1]
    const P = run.P[run.P.length - 1]
    expect(run.K[run.K.length - 2]).toBeCloseTo(K, 8) // converged
    // fixed point: P_pred = P + σ_Q² (a=1), K = P_pred/(P_pred+σ_R²), P = P_pred(1−K)
    const pPred = P + sigQ2
    expect(K).toBeCloseTo(pPred / (pPred + sigR2), 8)
    expect(P).toBeCloseTo(pPred * (1 - K), 8)
  })
})

describe('lecture registration', () => {
  it('is an explainer numbered 12, registered in the statistics course', () => {
    expect(linearRPLecture.explainer).toBe(true)
    expect(linearRPLecture.number).toBe(12)
    expect(linearRPLecture.id).toBe('linear-random-processes')
    expect(LECTURE_LIST.some((l) => l.id === 'linear-random-processes')).toBe(true)
  })
})
