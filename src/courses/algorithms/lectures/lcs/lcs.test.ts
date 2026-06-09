import { describe, it, expect } from 'vitest'
import { runLcs, lcsLength } from './lcs'
import { isLcsScene } from './lcsScene'
import { lcsLecture } from './index'
import type { Frame } from '@/core/engine/types'

/** Is `sub` a subsequence of `s` (order preserved, gaps allowed)? */
function isSubsequence(sub: string, s: string): boolean {
  let k = 0
  for (const ch of s) if (k < sub.length && ch === sub[k]) k++
  return k === sub.length
}

const recovered = (frames: Frame[]): string => {
  const s = frames[frames.length - 1].scene
  if (!isLcsScene(s)) throw new Error('no lcs scene')
  return s.lcs ?? ''
}

const PAIRS: [string, string][] = [
  ['ABCB', 'BDCAB'],
  ['AGCAT', 'GAC'],
  ['ABCD', 'ABCD'],
  ['ABC', 'XYZ'],
  ['AAAA', 'AA'],
  ['XMJYAUZ', 'MZJAWXU'],
]

describe('LCS dynamic programming', () => {
  it('the recovered LCS has the reference DP length and is a common subsequence', () => {
    for (const [X, Y] of PAIRS) {
      const lcs = recovered(runLcs(X, Y))
      const len = lcsLength(X, Y)
      expect(lcs.length, `length for ${X}/${Y}`).toBe(len)
      expect(isSubsequence(lcs, X), `${lcs} ⊆ ${X}`).toBe(true)
      expect(isSubsequence(lcs, Y), `${lcs} ⊆ ${Y}`).toBe(true)
    }
  })

  it('classic example X=ABCB, Y=BDCAB → length 3', () => {
    expect(recovered(runLcs('ABCB', 'BDCAB')).length).toBe(3)
  })

  it('all-match and no-match edge cases', () => {
    expect(recovered(runLcs('ABCD', 'ABCD'))).toBe('ABCD')
    expect(recovered(runLcs('ABC', 'XYZ'))).toBe('')
  })

  it('is deterministic', () => {
    expect(JSON.stringify(runLcs('ABCB', 'BDCAB'))).toEqual(JSON.stringify(runLcs('ABCB', 'BDCAB')))
  })

  it('every frame is a frozen snapshot with an LCS scene and Hebrew narration', () => {
    for (const f of runLcs('ABCB', 'BDCAB')) {
      expect(Object.isFrozen(f)).toBe(true)
      expect(isLcsScene(f.scene)).toBe(true)
      expect(typeof f.narration).toBe('string')
      expect(f.narration.length).toBeGreaterThan(0)
    }
  })

  it('has a fill phase and a traceback phase', () => {
    const frames = runLcs('ABCB', 'BDCAB')
    expect(frames.some((f) => isLcsScene(f.scene) && f.scene.phase === 'fill')).toBe(true)
    expect(frames.some((f) => isLcsScene(f.scene) && f.scene.phase === 'back')).toBe(true)
  })

  it('is registered as lecture 13 (explainer)', () => {
    expect(lcsLecture.number).toBe(13)
    expect(lcsLecture.explainer).toBe(true)
    expect(lcsLecture.algorithms).toHaveLength(0)
  })
})
