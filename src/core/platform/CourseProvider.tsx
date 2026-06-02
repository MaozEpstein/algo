import { createContext, use, useContext, type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import type { CourseModule } from './types'
import { COURSE_LOADERS, hasCourse } from './courses'

interface CourseCtx {
  courseId: string
  course: CourseModule
}

const CourseContext = createContext<CourseCtx | null>(null)

/** Cache the lazy import per course so navigating away and back is instant. */
const cache = new Map<string, Promise<CourseModule>>()
function loadCourse(id: string): Promise<CourseModule> {
  if (!cache.has(id)) cache.set(id, COURSE_LOADERS[id]().then((m) => m.default))
  return cache.get(id)!
}

/** Access the resolved course + its id. Must be inside a <CourseProvider>. */
export function useCourse(): CourseCtx {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error('useCourse must be used within a CourseProvider')
  return ctx
}

/**
 * Resolves the lazily-loaded course module for the `:courseId` route param and
 * provides it (+ id) via context. Suspends while the course chunk loads (wrap in
 * <Suspense>); redirects to the picker for an unknown course.
 */
export default function CourseProvider({ children }: { children: ReactNode }) {
  const { courseId } = useParams()
  if (!courseId || !hasCourse(courseId)) return <Navigate to="/" replace />
  const course = use(loadCourse(courseId)) // suspends until the chunk resolves
  const FormulaSheet = course.formulaSheet
  return (
    <CourseContext.Provider value={{ courseId, course }}>
      {children}
      {/* Mounted once per course (not per page) so the formula-sheet modal — and
          its global keyboard shortcut — work from any page in the course. */}
      {FormulaSheet && <FormulaSheet />}
    </CourseContext.Provider>
  )
}
