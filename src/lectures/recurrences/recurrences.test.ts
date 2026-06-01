import { describe, it, expect } from 'vitest'
import { classifyMaster, divideLevels, decreaseLevels } from './logic'
import { recurrencesLecture } from './index'

describe('classifyMaster', () => {
  it('Merge Sort: T(n)=2T(n/2)+n → case 2 → Θ(n log n)', () => {
    const r = classifyMaster({ a: 2, b: 2, c: 1, k: 0 })
    expect(r.caseNo).toBe(2)
    expect(r.resultTex).toBe('\\Theta(n \\log n)')
    expect(r.e).toBeCloseTo(1)
  })

  it('Binary search: T(n)=T(n/2)+1 → case 2 → Θ(log n)', () => {
    const r = classifyMaster({ a: 1, b: 2, c: 0, k: 0 })
    expect(r.caseNo).toBe(2)
    expect(r.resultTex).toBe('\\Theta(\\log n)')
    expect(r.e).toBeCloseTo(0)
  })

  it('Strassen: T(n)=7T(n/2)+n^2 → case 1 → Θ(n^{log_2 7})', () => {
    const r = classifyMaster({ a: 7, b: 2, c: 2, k: 0 })
    expect(r.caseNo).toBe(1)
    expect(r.resultTex).toBe('\\Theta(n^{\\log_{2} 7})')
    expect(r.e).toBeGreaterThan(2.8)
    expect(r.e).toBeLessThan(2.81)
  })

  it('Leaf-light: T(n)=2T(n/2)+n^2 → case 3 → Θ(n^2)', () => {
    const r = classifyMaster({ a: 2, b: 2, c: 2, k: 0 })
    expect(r.caseNo).toBe(3)
    expect(r.resultTex).toBe('\\Theta(n^{2})')
  })

  it('extended case 2 adds a log factor (log^{k+1})', () => {
    const r = classifyMaster({ a: 2, b: 2, c: 1, k: 1 })
    expect(r.caseNo).toBe(2)
    expect(r.resultTex).toBe('\\Theta(n \\log^{2} n)')
  })
})

describe('divideLevels', () => {
  it('T(n)=2T(n/2), n=8 → 4 levels, doubling nodes, halving size', () => {
    const levels = divideLevels(2, 2, 8)
    expect(levels.map((l) => l.size)).toEqual([8, 4, 2, 1])
    expect(levels.map((l) => l.nodes)).toEqual([1, 2, 4, 8])
  })

  it('depth equals log_b n', () => {
    const levels = divideLevels(3, 2, 16)
    expect(levels.length).toBe(5) // sizes 16,8,4,2,1
    expect(levels[levels.length - 1].size).toBe(1)
    expect(levels.map((l) => l.nodes)).toEqual([1, 3, 9, 27, 81])
  })
})

describe('decreaseLevels', () => {
  it('unrolls n, n-1, …, 1', () => {
    expect(decreaseLevels(5)).toEqual([5, 4, 3, 2, 1])
  })
})

describe('recurrencesLecture registration', () => {
  it('is an explainer lecture with no runnable algorithms', () => {
    expect(recurrencesLecture.explainer).toBe(true)
    expect(recurrencesLecture.algorithms).toHaveLength(0)
    expect(recurrencesLecture.id).toBe('recurrences')
    expect(recurrencesLecture.number).toBeLessThan(4) // ordered before Heapsort
  })
})
