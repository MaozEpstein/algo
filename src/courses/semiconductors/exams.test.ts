/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { semiconductorsExams } from './exams'

/** Guards the semiconductors exam bank: unique ids, valid moadim, every PDF on disk. */
const DIR = resolve(process.cwd(), 'public/docs/exams/semiconductors')

describe('semiconductors exam bank', () => {
  it('has unique ids and valid moadim', () => {
    const ids = semiconductorsExams.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of semiconductorsExams) expect(['a', 'b', 'c', 's']).toContain(e.moed)
  })

  it('every exam and solution PDF exists on disk', () => {
    for (const e of semiconductorsExams) {
      expect(existsSync(resolve(DIR, e.examFile)), `missing exam ${e.examFile}`).toBe(true)
      if (e.solutionFile) expect(existsSync(resolve(DIR, e.solutionFile)), `missing solution ${e.solutionFile}`).toBe(true)
    }
  })

  it('id matches the exam file slug', () => {
    for (const e of semiconductorsExams) expect(e.examFile).toBe(`${e.id}.pdf`)
  })
})
