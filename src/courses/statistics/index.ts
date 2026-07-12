import type { CourseModule } from '@/core/platform/types'
import { LECTURES, LECTURE_LIST } from './registry'
import Syllabus from './components/Syllabus'

/**
 * Statistical Methods in Engineering and Computer Science. Source material:
 * _source/חומרי קורסים/Statistical Methods in Engineering and Computer Science/
 * (outside the app). The syllabus follows the chapter (פרק) division of
 * "סיכומי מרצה לקורס.pdf" — one lesson per chapter. Lessons are not built yet;
 * only the syllabus is wired.
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
}

export default statisticsCourse
