/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { algorithmsExams } from './exams'

/** Guards the algorithms exam bank: unique ids, valid moadim, every PDF on disk. */
const DIR = resolve(process.cwd(), 'public/docs/exams/algorithms')

describe('algorithms exam bank', () => {
  it('has unique ids and valid moadim', () => {
    const ids = algorithmsExams.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of algorithmsExams) expect(['a', 'b', 'c', 's']).toContain(e.moed)
  })

  it('every exam and solution PDF exists on disk', () => {
    for (const e of algorithmsExams) {
      expect(existsSync(resolve(DIR, e.examFile)), `missing exam ${e.examFile}`).toBe(true)
      if (e.solutionFile) expect(existsSync(resolve(DIR, e.solutionFile)), `missing solution ${e.solutionFile}`).toBe(true)
    }
  })

  it('id matches the exam file slug', () => {
    for (const e of algorithmsExams) expect(e.examFile).toBe(`${e.id}.pdf`)
  })
})
