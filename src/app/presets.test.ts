import { describe, it, expect } from 'vitest'
import { LECTURE_LIST } from './registry'

describe('presets', () => {
  it('every preset input is valid for its algorithm and runs', () => {
    for (const lecture of LECTURE_LIST) {
      for (const algo of lecture.algorithms) {
        for (const p of algo.presets ?? []) {
          const res = algo.validateInput(p.input.array.join(', '))
          expect(res.ok, `${algo.id} / ${p.labelHe}`).toBe(true)
          // it should also run without throwing and produce frames
          const frames = algo.run(p.input)
          expect(frames.length, `${algo.id} / ${p.labelHe}`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('every algorithm has ≥4 presets, exactly one marked as the worst case', () => {
    for (const lecture of LECTURE_LIST) {
      for (const algo of lecture.algorithms) {
        const presets = algo.presets ?? []
        expect(presets.length, `${algo.id} preset count`).toBeGreaterThanOrEqual(4)
        const worst = presets.filter((p) => p.worst === true)
        expect(worst.length, `${algo.id} worst count`).toBe(1)
        // the worst-case preset must announce itself clearly in its label
        expect(worst[0].labelHe, `${algo.id} worst label`).toContain('המקרה הגרוע ביותר')
      }
    }
  })
})
