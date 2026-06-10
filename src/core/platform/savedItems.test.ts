import { describe, it, expect } from 'vitest'
import { makeId, hashText } from './savedItems'
import { isFeatureEnabled } from './features'

describe('savedItems — id & hash', () => {
  it('makeId is stable and namespaced by course/lecture/kind/ref', () => {
    expect(makeId('semi', 'mos', 'symbol', 'V_T')).toBe('semi:mos:symbol:V_T')
    expect(makeId('semi', 'mos', 'symbol', 'V_T')).toBe(makeId('semi', 'mos', 'symbol', 'V_T'))
    expect(makeId('semi', 'mos', 'concept', 'V_T')).not.toBe(makeId('semi', 'mos', 'symbol', 'V_T'))
  })
  it('hashText is deterministic and whitespace-insensitive', () => {
    expect(hashText('שלום עולם')).toBe(hashText('  שלום   עולם '))
    expect(hashText('a')).not.toBe(hashText('b'))
  })
})

describe('features — savedList flag', () => {
  it('defaults to on', () => {
    expect(isFeatureEnabled({}, 'savedList')).toBe(true)
  })
  it('can be turned off', () => {
    expect(isFeatureEnabled({ savedList: false }, 'savedList')).toBe(false)
  })
})
