import { Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import LectureShell from '@/core/shell/LectureShell'
import CoursePicker from './CoursePicker'
import CourseProvider, { useCourse } from './CourseProvider'
import CourseHome from './CourseHome'
import { coursePath } from './links'

// Match the deploy base (e.g. '/algo' on GitHub Pages) so routes resolve under
// it; '/' locally. import.meta.env.BASE_URL mirrors Vite's `base`. Trailing
// slash stripped because React Router expects no trailing slash in basename=.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
      <span className="animate-pulse text-sm">טוען…</span>
    </div>
  )
}

/** The course's cross-lecture overview page (if it has one). */
function CourseOverview() {
  const { courseId, course } = useCourse()
  const Overview = course.Overview
  return Overview ? <Overview /> : <Navigate to={coursePath(courseId)} replace />
}

/** Backward-compat: old single-course deep links → the algorithms course. */
function LegacyLecture() {
  const { lectureId, mode } = useParams()
  const { search } = useLocation()
  return <Navigate replace to={`/c/algorithms/lecture/${lectureId}${mode ? `/${mode}` : ''}${search}`} />
}
function LegacyOverview() {
  const { search } = useLocation()
  return <Navigate replace to={`/c/algorithms/overview${search}`} />
}

export default function App() {
  return (
    // reducedMotion="user" honors the OS setting; users without it see no change.
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<CoursePicker />} />

          {/* one course subtree, lazily loaded + resolved via CourseProvider */}
          <Route
            path="/c/:courseId/*"
            element={
              <Suspense fallback={<Loading />}>
                <CourseProvider>
                  <Routes>
                    <Route path="" element={<CourseHome />} />
                    <Route path="overview" element={<CourseOverview />} />
                    <Route path="lecture/:lectureId" element={<LectureShell />} />
                    <Route path="lecture/:lectureId/:mode" element={<LectureShell />} />
                    <Route path="*" element={<Navigate to="." replace />} />
                  </Routes>
                </CourseProvider>
              </Suspense>
            }
          />

          {/* backward-compat redirects for pre-platform URLs (preserve query) */}
          <Route path="/lecture/:lectureId" element={<LegacyLecture />} />
          <Route path="/lecture/:lectureId/:mode" element={<LegacyLecture />} />
          <Route path="/overview" element={<LegacyOverview />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
