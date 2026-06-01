import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './app/Home'
import OverviewHub from './app/OverviewHub'
import LectureShell from './shell/LectureShell'

export default function App() {
  return (
    // reducedMotion="user" honors the OS setting; users without it see no change.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<OverviewHub />} />
          <Route path="/lecture/:lectureId" element={<LectureShell />} />
          <Route path="/lecture/:lectureId/:mode" element={<LectureShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
