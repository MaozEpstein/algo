import { describe, it, expect } from 'vitest'
import type { Frame } from '@/engine/types'
import { runFactorial } from './algorithms/factorial'
import { runPower } from './algorithms/power'
import { runMult } from './algorithms/mult'
import { runSum } from './algorithms/sum'
import { runCountDown } from './algorithms/countDown'
import { runListLen } from './algorithms/listLen'
import { recursionLecture } from './index'
import { deriveSteps } from '@/shell/player/steps'
import type { RecursionScene } from './scene'

const lastScene = (frames: Frame[]) => frames[frames.length - 1].scene as RecursionScene
const result = (frames: Frame[]) => lastScene(frames).resultTex
const maxDepth = (frames: Frame[]) => Math.max(...frames.map((f) => f.callDepth ?? 0))

function assertHealthy(frames: Frame[]) {
  expect(frames.length).toBeGreaterThan(0)
  for (const f of frames) {
    expect(Object.isFrozen(f)).toBe(true)
    expect(f.narration.length).toBeGreaterThan(0)
  }
}

describe('recursion — correct results', () => {
  it('factorial', () => {
    expect(result(runFactorial({ array: [5] }))).toBe('120')
    expect(result(runFactorial({ array: [1] }))).toBe('1') // base case
    expect(result(runFactorial({ array: [0] }))).toBe('1')
  })
  it('power', () => {
    expect(result(runPower({ array: [2, 5] }))).toBe('32')
    expect(result(runPower({ array: [3, 4] }))).toBe('81')
    expect(result(runPower({ array: [7, 0] }))).toBe('1')
  })
  it('mult', () => {
    expect(result(runMult({ array: [3, 4] }))).toBe('12')
    expect(result(runMult({ array: [2, 3] }))).toBe('6')
    expect(result(runMult({ array: [5, 0] }))).toBe('0')
  })
  it('sum', () => {
    expect(result(runSum({ array: [5] }))).toBe('15')
    expect(result(runSum({ array: [0] }))).toBe('0')
  })
  it('listLen', () => {
    expect(result(runListLen({ array: [3, 1, 4, 1, 5] }))).toBe('5')
    expect(result(runListLen({ array: [7] }))).toBe('1')
  })
  it('count_down prints n..0 and has no return value', () => {
    const frames = runCountDown({ array: [3] })
    expect(lastScene(frames).printed).toEqual(['3', '2', '1', '0'])
    expect(lastScene(frames).resultTex).toBeUndefined()
  })
})

describe('recursion — call-stack invariants', () => {
  it('the stack grows with the input (depth > 0) and empties at the end', () => {
    const frames = runFactorial({ array: [5] })
    expect(maxDepth(frames)).toBeGreaterThanOrEqual(4) // 5 nested calls → depth 4
    expect(lastScene(frames).stack.length).toBe(0) // fully unwound
  })

  it('frames are frozen + narrated for every function', () => {
    assertHealthy(runFactorial({ array: [5] }))
    assertHealthy(runPower({ array: [2, 5] }))
    assertHealthy(runMult({ array: [3, 4] }))
    assertHealthy(runSum({ array: [5] }))
    assertHealthy(runCountDown({ array: [3] }))
    assertHealthy(runListLen({ array: [3, 1, 4, 1, 5] }))
  })

  it('is deterministic', () => {
    const a = runFactorial({ array: [5] })
    const b = runFactorial({ array: [5] })
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b))
  })

  it('the step timeline has both call (↓) and return (↑) chips', () => {
    const steps = deriveSteps(runFactorial({ array: [3] }))
    expect(steps.filter((s) => s.kind === 'call')).toHaveLength(3) // factorial(3),(2),(1)
    expect(steps.filter((s) => s.kind === 'return')).toHaveLength(3) // returns of (1),(2),(3)
    // calls come before returns (descend then ascend)
    const firstReturn = steps.findIndex((s) => s.kind === 'return')
    expect(steps.slice(0, firstReturn).every((s) => s.kind === 'call')).toBe(true)
  })
})

describe('recursionLecture registration', () => {
  it('is registered as lecture 2 with six functions', () => {
    expect(recursionLecture.id).toBe('recursion')
    expect(recursionLecture.number).toBe(2)
    expect(recursionLecture.algorithms).toHaveLength(6)
  })
})
