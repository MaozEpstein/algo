import { Navigate, useParams } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { revisionAssetUrl, examsPath } from './links'
import DocViewer from './DocViewer'

/** Full-screen viewer for a lecturer revision-question doc (/c/<course>/revision/:docId). */
export default function RevisionViewer() {
  const { courseId, course } = useCourse()
  const { docId } = useParams()
  const doc = course.revision?.find((d) => d.id === docId)
  if (!doc) return <Navigate to={examsPath(courseId)} replace />

  return (
    <DocViewer
      itemId={doc.id}
      title={doc.titleHe}
      primaryFile={doc.file}
      primaryLabel="שאלות"
      solutionFile={doc.solutionFile}
      solutionLabel="פתרון"
      assetUrl={(f) => revisionAssetUrl(courseId, f)}
      backPath={examsPath(courseId)}
    />
  )
}
