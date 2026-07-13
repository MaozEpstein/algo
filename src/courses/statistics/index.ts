import type { CourseModule } from '@/core/platform/types'
import { LECTURES, LECTURE_LIST } from './registry'
import Syllabus from './components/Syllabus'
import FormulaSheet from './components/FormulaSheet'
import { statisticsExams } from './exams'
import { statisticsExamCategories } from './examCategories'
import { statisticsExamStudyGuide } from './examStudyGuide'

/**
 * Statistical Methods in Engineering and Computer Science. Source material:
 * _source/חומרי קורסים/Statistical Methods in Engineering and Computer Science/
 * (outside the app). The syllabus follows the chapter (פרק) division of
 * "סיכומי מרצה לקורס.pdf" — one lesson per chapter. A course-wide formula sheet
 * (Ctrl+Shift+S) aggregates the key formulas across lessons.
 */
const statisticsCourse: CourseModule = {
  manifest: {
    id: 'statistics',
    titleHe: 'שיטות סטטיסטיות בהנדסה ומדעי המחשב',
    subtitleEn: 'Statistical Methods in Engineering and Computer Science',
    accent: 'emerald',
  },
  LECTURES,
  LECTURE_LIST,
  syllabus: Syllabus,
  formulaSheet: FormulaSheet,
  exams: statisticsExams,
  examCategories: statisticsExamCategories,
  examStudyGuide: statisticsExamStudyGuide,
}

export default statisticsCourse
