import { describe, it, expect } from 'vitest'
import { isFeatureEnabled } from './features'
import { cycleStatus, summarize, type Status } from './progress'

describe('features — isFeatureEnabled', () => {
  it('returns the default when there is no override', () => {
    expect(isFeatureEnabled({}, 'progress')).toBe(true)
  })
  it('respects an explicit override', () => {
    expect(isFeatureEnabled({ progress: false }, 'progress')).toBe(false)
    expect(isFeatureEnabled({ progress: true }, 'progress')).toBe(true)
  })
})

describe('progress — cycleStatus & summarize', () => {
  it('cycles not-started → learning → done → review → not-started', () => {
    expect(cycleStatus(undefined)).toBe('learning')
    expect(cycleStatus('learning')).toBe('done')
    expect(cycleStatus('done')).toBe('review')
    expect(cycleStatus('review')).toBe(undefined)
  })
  it('counts done out of total', () => {
    const map: Record<string, Status> = { a: 'done', b: 'learning', c: 'done' }
    expect(summarize(map, ['a', 'b', 'c', 'd'])).toEqual({ done: 2, total: 4 })
    expect(summarize(undefined, ['a', 'b'])).toEqual({ done: 0, total: 2 })
  })
})
