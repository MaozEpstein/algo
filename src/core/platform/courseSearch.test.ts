import { describe, it, expect } from 'vitest'
import type { LectureModule } from '@/core/engine/types'
import { buildIndex, search, normalize } from './courseSearch'

const fakeLectures = [
  {
    id: 'mos',
    titleHe: 'קבל MOS',
    formulas: [{ name: 'מתח-סף', tex: 'V_T=V_{FB}+2\\phi_F' }],
    glossary: [
      { term: 'היפוך', def: 'נוצר ערוץ אלקטרונים בשפה.' },
      { term: 'רוחב המחסור', def: 'מרחק החדירה של אזור המחסור.' },
    ],
    symbols: [
      { sym: 'V_T', he: 'מתח-הסף', unit: 'V' },
      { sym: '\\phi_F', he: 'פוטנציאל פרמי', unit: 'V' },
      { sym: '\\psi_s', he: 'פוטנציאל פני-השטח', unit: 'V' },
    ],
  },
] as unknown as LectureModule[]

const idx = buildIndex(fakeLectures)

describe('courseSearch — normalize', () => {
  it('collapses LaTeX punctuation + underscores', () => {
    expect(normalize('V_T')).toBe('vt')
    expect(normalize('V_{T}')).toBe('vt')
    expect(normalize('\\phi_F')).toBe('phif')
  })
})

describe('courseSearch — search', () => {
  it('finds the V_T symbol (and the V_T formula)', () => {
    const hits = search(idx, 'V_T')
    expect(hits.some((h) => h.kind === 'symbol' && h.tex === 'V_T')).toBe(true)
    expect(hits.some((h) => h.kind === 'formula' && h.label === 'מתח-סף')).toBe(true)
  })
  it('matches V_T regardless of braces / case', () => {
    expect(search(idx, 'vt').some((h) => h.tex === 'V_T')).toBe(true)
    expect(search(idx, 'V_{T}').some((h) => h.tex === 'V_T')).toBe(true)
  })
  it('matches a Hebrew concept query', () => {
    const hits = search(idx, 'היפוך')
    expect(hits.some((h) => h.kind === 'concept' && h.label === 'היפוך')).toBe(true)
  })
  it('returns nothing for an empty query', () => {
    expect(search(idx, '')).toEqual([])
    expect(search(idx, '   ')).toEqual([])
  })
  it('finds φ via the glyph, the LaTeX name, "fi" and Hebrew "פיי"', () => {
    for (const q of ['φ', 'phi', 'fi', 'פיי']) {
      expect(search(idx, q).some((h) => h.tex === '\\phi_F'), `query: ${q}`).toBe(true)
    }
  })
  it('finds ψ via the glyph and Hebrew "פסי"', () => {
    expect(search(idx, 'ψ').some((h) => h.tex === '\\psi_s')).toBe(true)
    expect(search(idx, 'פסי').some((h) => h.tex === '\\psi_s')).toBe(true)
  })
  it('does NOT corrupt a legitimate Hebrew query (רוחב stays intact, not aliased to rho)', () => {
    expect(search(idx, 'רוחב').some((h) => h.label === 'רוחב המחסור')).toBe(true)
    // 'רו' alone aliases to rho → must NOT match the רוחב concept
    expect(search(idx, 'רו').some((h) => h.label === 'רוחב המחסור')).toBe(false)
  })
  it('orders formulas before concepts before symbols', () => {
    const kinds = search(idx, 'מתח').map((h) => h.kind)
    // formula 'מתח-סף' and symbol 'מתח-הסף' both match → formula first
    expect(kinds.indexOf('formula')).toBeLessThan(kinds.indexOf('symbol'))
  })
})
