import type { CourseModule } from '@/core/platform/types'
import { LECTURES, LECTURE_LIST } from './registry'
import FormulaSheet from './components/FormulaSheet'
import Syllabus from './components/Syllabus'
import Calculator from './components/Calculator'
import Constants from './components/Constants'
import { semiconductorsExams } from './exams'

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
  formulaSheet: FormulaSheet,
  syllabus: Syllabus,
  calculator: Calculator,
  constants: Constants,
  exams: semiconductorsExams,
}

export default semiconductorsCourse
