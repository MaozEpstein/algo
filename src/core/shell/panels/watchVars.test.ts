import { describe, it, expect } from 'vitest'
import { deriveFromMarkers, varsForFrame } from './watchVars'
import { runHoarePartition } from '@/courses/algorithms/lectures/quicksort/algorithms/hoarePartition'
import { runMaxHeapify } from '@/courses/algorithms/lectures/heapsort/algorithms/maxHeapify'
import type { Frame, Marker } from '@/core/engine/types'

describe('deriveFromMarkers', () => {
  it('maps each marker to an index var, preserving tone', () => {
    const markers: Marker[] = [
      { label: 'pivot', index: 3, tone: 'pivot' },
      { label: 'i', index: 5, tone: 'i' },
    ]
    expect(deriveFromMarkers(markers)).toEqual([
      { name: 'pivot', value: 3, kind: 'index', tone: 'pivot' },
      { name: 'i', value: 5, kind: 'index', tone: 'i' },
    ])
  })

  it('returns [] for missing markers', () => {
    expect(deriveFromMarkers(undefined)).toEqual([])
  })
})

describe('varsForFrame', () => {
  it('prefers explicit vars over markers', () => {
    const frame = {
      vars: [{ name: 'x', value: 7, kind: 'value' as const }],
      markers: [{ label: 'i', index: 2, tone: 'i' as const }],
    }
    expect(varsForFrame(frame).map((v) => v.name)).toEqual(['x'])
  })

  it('falls back to markers when no vars', () => {
    const frame = { markers: [{ label: 'i', index: 2, tone: 'i' as const }] }
    expect(varsForFrame(frame).map((v) => v.name)).toEqual(['i'])
  })
})

describe('algorithm frames carry watched variables', () => {
  it('Hoare partition exposes the pivot VALUE x and index vars i/j (and freezes them)', () => {
    const frames = runHoarePartition({ array: [5, 3, 2, 6, 4, 1, 3, 7] })
    const withVars = frames.filter((f) => f.vars && f.vars.length)
    expect(withVars.length).toBeGreaterThan(0)

    // x is a value var equal to the pivot A[1] = 5 throughout the partition.
    const x = withVars.flatMap((f) => f.vars!).find((v) => v.name === 'x')
    expect(x).toMatchObject({ kind: 'value', value: 5 })

    // i and j appear as index vars on some mid-partition frame.
    const mid = withVars.find((f) => f.vars!.some((v) => v.name === 'j'))!
    expect(mid.vars!.find((v) => v.name === 'j')).toMatchObject({ kind: 'index' })

    // vars are frozen along with the rest of the frame.
    for (const f of frames) {
      if (f.vars) {
        expect(Object.isFrozen(f.vars)).toBe(true)
        f.vars.forEach((v) => expect(Object.isFrozen(v)).toBe(true))
      }
    }
  })

  it('Max-Heapify (no markers) still exposes i / largest via explicit vars', () => {
    const frames = runMaxHeapify({ array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1], extra: { startIndex: 2 } })
    const names = new Set(frames.flatMap((f: Frame) => f.vars ?? []).map((v) => v.name))
    expect(names.has('i')).toBe(true)
    expect(names.has('largest')).toBe(true)
  })
})
