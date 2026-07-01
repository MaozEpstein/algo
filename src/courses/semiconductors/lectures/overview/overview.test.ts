import { describe, it, expect } from 'vitest'
import { LECTURES } from '../../registry'
import { overviewLecture } from './index'
import { EFFECT_FAMILIES } from './data/crossLinks'
import { QUIZ } from './data/quiz'

describe('overview lecture registration', () => {
  it('is registered at number 0 (sorts to the top)', () => {
    expect(LECTURES['overview']).toBe(overviewLecture)
    expect(overviewLecture.number).toBe(0)
    expect(overviewLecture.explainer).toBe(true)
  })
})

describe('cross-course effect deep-links', () => {
  it('every effect-family has a unique id and at least one member', () => {
    const ids = EFFECT_FAMILIES.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of EFFECT_FAMILIES) expect(f.members.length).toBeGreaterThan(0)
  })

  it('every member deep-links to a lecture that exists in the registry', () => {
    for (const family of EFFECT_FAMILIES) {
      for (const m of family.members) {
        expect(LECTURES[m.lectureId], `${family.id} → ${m.device} → ${m.lectureId}`).toBeDefined()
        expect(m.tab.length).toBeGreaterThan(0)
      }
    }
  })
})

describe('synthesis quiz', () => {
  it('question ids are unique', () => {
    const ids = QUIZ.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('single questions have exactly one correct option; multi have at least one', () => {
    for (const q of QUIZ) {
      const nCorrect = q.options.filter((o) => o.correct).length
      if (q.kind === 'single') expect(nCorrect, q.id).toBe(1)
      else expect(nCorrect, q.id).toBeGreaterThanOrEqual(1)
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('every quiz deep-link points to a lecture that exists', () => {
    for (const q of QUIZ) {
      if (q.lectureId) expect(LECTURES[q.lectureId], `${q.id} → ${q.lectureId}`).toBeDefined()
    }
  })
})
