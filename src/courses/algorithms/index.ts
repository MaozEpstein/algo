import type { CourseModule } from '@/core/platform/types'
import { LECTURES, LECTURE_LIST } from './registry'
import OverviewHub from './overview/OverviewHub'
import Syllabus from './components/Syllabus'
import { algorithmsExams } from './exams'
import { algorithmsRevision } from './revision'

/**
 * The Algorithms course as a self-contained, lazily-loaded module. The platform
 * reaches this only through the dynamic `import()` in core/platform/courses.ts,
 * so all the lectures live in their own chunk.
 */
const algorithmsCourse: CourseModule = {
  manifest: {
    id: 'algorithms',
    titleHe: 'מבני נתונים ומבוא לאלגוריתמים',
    subtitleEn: 'Data Structures & Algorithms',
    accent: 'sky',
  },
  LECTURES,
  LECTURE_LIST,
  Overview: OverviewHub,
  syllabus: Syllabus,
  exams: algorithmsExams,
  revision: algorithmsRevision,
}

export default algorithmsCourse
