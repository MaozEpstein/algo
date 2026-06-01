import type { CourseModule } from '@/core/platform/types'
import { LECTURES, LECTURE_LIST } from './registry'

/**
 * Semiconductor Devices course. Source material: _source/חומרי קורסים/
 * Semiconductor Devises/ (outside the app). Lectures live under ./lectures/<id>/
 * and are wired in ./registry.ts. Built per the syllabus (PN diode → Schottky →
 * BJT → …); device-physics widgets live in ./viz, ./components, ./lib.
 */
const semiconductorsCourse: CourseModule = {
  manifest: {
    id: 'semiconductors',
    titleHe: 'התקנים של מוליכים למחצה',
    subtitleEn: 'Semiconductor Devices',
    accent: 'violet',
  },
  LECTURES,
  LECTURE_LIST,
}

export default semiconductorsCourse
