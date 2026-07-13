/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { statisticsExams } from './exams'

/**
 * Guards the exam bank: unique ids, valid moadim, and — the important one — every
 * referenced PDF actually exists under public/docs/exams/statistics/. Catches a
 * missing or mis-slugged file at CI time instead of as a 404 in production.
 */
const DIR = resolve(process.cwd(), 'public/docs/exams/statistics')

describe('statistics exam bank', () => {
  it('has unique ids and valid moadim', () => {
    const ids = statisticsExams.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of statisticsExams) expect(['a', 'b', 'c', 's']).toContain(e.moed)
  })

  it('every exam and solution PDF exists on disk', () => {
    for (const e of statisticsExams) {
      expect(existsSync(resolve(DIR, e.examFile)), `missing exam ${e.examFile}`).toBe(true)
      if (e.solutionFile) {
        expect(existsSync(resolve(DIR, e.solutionFile)), `missing solution ${e.solutionFile}`).toBe(true)
      }
    }
  })

  it('id matches the exam file slug', () => {
    for (const e of statisticsExams) expect(e.examFile).toBe(`${e.id}.pdf`)
  })
})
