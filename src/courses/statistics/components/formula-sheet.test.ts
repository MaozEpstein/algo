import { describe, it, expect } from 'vitest'
import statisticsCourse from '../index'

describe('statistics course wiring', () => {
  it('exposes a course-wide formula sheet (Ctrl+Shift+S) and a syllabus', () => {
    expect(statisticsCourse.formulaSheet).toBeDefined()
    expect(statisticsCourse.syllabus).toBeDefined()
    expect(statisticsCourse.manifest.id).toBe('statistics')
  })
})
