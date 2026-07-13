/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { algorithmsRevision } from './revision'

/** Guards the algorithms revision-question docs: unique ids, every PDF on disk. */
const DIR = resolve(process.cwd(), 'public/docs/revision/algorithms')

describe('algorithms revision questions', () => {
  it('has unique ids', () => {
    const ids = algorithmsRevision.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every question (and solution) PDF exists on disk', () => {
    for (const d of algorithmsRevision) {
      expect(existsSync(resolve(DIR, d.file)), `missing ${d.file}`).toBe(true)
      if (d.solutionFile) expect(existsSync(resolve(DIR, d.solutionFile)), `missing solution ${d.solutionFile}`).toBe(true)
    }
  })

  it('id matches the file slug', () => {
    for (const d of algorithmsRevision) expect(d.file).toBe(`${d.id}.pdf`)
  })
})
