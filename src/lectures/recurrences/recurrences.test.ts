import { describe, it, expect } from 'vitest'
import { classifyMaster, divideLevels, decreaseLevels } from './logic'
import { recurrencesLecture } from './index'
import { PRESETS } from './tabs/MasterTab'
import { EXAMPLES } from './tabs/SubstitutionTab'

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

describe('Master tab preset bank (sanity)', () => {
  it('has 15 presets, each classifying to a valid case with a result', () => {
    expect(PRESETS).toHaveLength(15)
    for (const p of PRESETS) {
      const r = classifyMaster(p)
      expect([1, 2, 3]).toContain(r.caseNo)
      expect(r.resultTex).toContain('\\Theta(')
      expect(r.fTex.length).toBeGreaterThan(0)
    }
  })

  it('is distributed 6 / 3 / 6 across the three cases', () => {
    const byCase = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>
    for (const p of PRESETS) byCase[classifyMaster(p).caseNo]++
    expect(byCase).toEqual({ 1: 6, 2: 3, 3: 6 })
  })

  it('named presets match their known complexity', () => {
    const find = (name: string) => PRESETS.find((p) => p.nameHe === name)!
    expect(classifyMaster(find('קרצובה')).resultTex).toBe('\\Theta(n^{\\log_{2} 3})')
    expect(classifyMaster(find('מיון מיזוג')).resultTex).toBe('\\Theta(n \\log n)')
    expect(classifyMaster(find('שטראסן')).resultTex).toBe('\\Theta(n^{\\log_{2} 7})')
  })
})

describe('Substitution tab example bank (sanity)', () => {
  it('has 5 examples, each with exactly one correct guess and a real proof', () => {
    expect(EXAMPLES).toHaveLength(5)
    for (const ex of EXAMPLES) {
      expect(ex.options.filter((o) => o.ok)).toHaveLength(1)
      expect(ex.options.length).toBeGreaterThanOrEqual(2)
      expect(ex.proof.result.length).toBeGreaterThan(0)
      expect(ex.proof.steps.length).toBeGreaterThan(0)
      expect(ex.recurrenceTex.length).toBeGreaterThan(0)
    }
  })
})
