import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './app/Home'
import OverviewHub from './app/OverviewHub'
import LectureShell from './shell/LectureShell'

// Match the deploy base (e.g. '/algo' on GitHub Pages) so routes resolve under
// it; '/' locally and on Vercel/Netlify. import.meta.env.BASE_URL mirrors Vite's
// `base`. Trailing slash stripped because React Router expects no trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    // reducedMotion="user" honors the OS setting; users without it see no change.
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={basename}>
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
