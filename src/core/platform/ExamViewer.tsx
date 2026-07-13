import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { examAssetUrl, examsPath } from './links'
import type { ExamEntry } from './types'

/**
 * Full-screen source-PDF viewer (/c/<course>/exams/:examId). A fixed inset-0
 * overlay so it covers all app chrome; the body is a full-bleed <iframe> of the
 * original PDF → the browser's native viewer (zoom / scroll / search / print).
 * A slim toolbar carries the exam⇄solution toggle, open-in-tab, download, and
 * close (also Esc). On touch/coarse-pointer devices (which may refuse inline
 * PDFs) it falls back to an open-in-tab call-to-action.
 */

const MOED_LABEL: Record<ExamEntry['moed'], string> = { a: 'מועד א׳', b: 'מועד ב׳', c: 'מועד ג׳', s: 'מועד מיוחד' }

/** True on coarse-pointer / narrow devices where inline PDF rendering is unreliable. */
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 640px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return mobile
}

export default function ExamViewer() {
  const { courseId, course } = useCourse()
  const { examId } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [showSolution, setShowSolution] = useState(false)

  const exam = course.exams?.find((e) => e.id === examId)
  const close = () => navigate(examsPath(courseId))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  if (!exam) return <Navigate to={examsPath(courseId)} replace />

  const hasSolution = !!exam.solutionFile
  const file = showSolution && exam.solutionFile ? exam.solutionFile : exam.examFile
  const url = examAssetUrl(courseId, file)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
      {/* toolbar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2 text-white">
        <button
          onClick={close}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-300 transition hover:bg-slate-700 hover:text-white"
          aria-label="סגירה"
          title="סגירה (Esc)"
        >
          ✕
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-bold">{exam.titleHe}</span>
          <span className="hidden shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-200 sm:inline">
            {MOED_LABEL[exam.moed]}
          </span>
        </div>

        {hasSolution && (
          <div className="ms-auto inline-flex shrink-0 rounded-full bg-slate-700 p-0.5" role="group" aria-label="מבחן או פתרון">
            <ToggleBtn active={!showSolution} onClick={() => setShowSolution(false)}>מבחן</ToggleBtn>
            <ToggleBtn active={showSolution} onClick={() => setShowSolution(true)}>פתרון</ToggleBtn>
          </div>
        )}

        <div className={`flex shrink-0 items-center gap-1 ${hasSolution ? '' : 'ms-auto'}`}>
          <a href={url} target="_blank" rel="noopener noreferrer" title="פתח בכרטיסייה" className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-slate-700 hover:text-white">↗</a>
          <a href={url} download title="הורדה" className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-slate-700 hover:text-white">⬇</a>
        </div>
      </div>

      {/* body */}
      {isMobile ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="text-5xl" aria-hidden>📄</div>
          <p className="max-w-xs leading-relaxed text-slate-300">
            צפייה מיטבית ב-PDF במכשירך היא בכרטיסייה נפרדת.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-400"
          >
            פתח את ה-PDF ↗
          </a>
        </div>
      ) : (
        <iframe key={url} src={url} title={exam.titleHe} className="min-h-0 flex-1 bg-white" />
      )}
    </div>
  )
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1 text-xs font-bold transition ${active ? 'bg-white text-slate-800 shadow' : 'text-slate-300 hover:text-white'}`}
    >
      {children}
    </button>
  )
}
