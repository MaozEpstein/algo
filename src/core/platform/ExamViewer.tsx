import { Navigate, useParams } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { examAssetUrl, examsPath } from './links'
import DocViewer from './DocViewer'
import type { ExamEntry } from './types'

/** Full-screen source-PDF viewer for one exam (/c/<course>/exams/:examId). */

const MOED_LABEL: Record<ExamEntry['moed'], string> = { a: 'מועד א׳', b: 'מועד ב׳', c: 'מועד ג׳', s: 'מועד מיוחד' }

export default function ExamViewer() {
  const { courseId, course } = useCourse()
  const { examId } = useParams()
  const exam = course.exams?.find((e) => e.id === examId)
  if (!exam) return <Navigate to={examsPath(courseId)} replace />

  return (
    <DocViewer
      itemId={exam.id}
      title={exam.titleHe}
      chip={MOED_LABEL[exam.moed]}
      primaryFile={exam.examFile}
      primaryLabel="מבחן"
      solutionFile={exam.solutionFile}
      solutionLabel="פתרון"
      assetUrl={(f) => examAssetUrl(courseId, f)}
      backPath={examsPath(courseId)}
    />
  )
}
