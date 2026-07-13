import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { useFeature } from './features'
import { useProgress, cycleStatus, STATUS_META } from './progress'

/**
 * Generic full-screen source-PDF viewer, shared by the exam bank and the
 * worksheet bank. A fixed inset-0 overlay covering all app chrome; the body is a
 * full-bleed <iframe> of the PDF → the browser's native viewer (zoom / scroll /
 * search / print). The toolbar carries an optional primary⇄solution toggle,
 * open-in-tab, download, close (also Esc), and a learning-status button. On
 * touch/coarse-pointer devices (which may refuse inline PDFs) it falls back to an
 * open-in-tab call-to-action.
 */

export interface DocViewerProps {
  /** Stable id used for progress-status tracking (unique within the course). */
  itemId: string
  title: string
  /** Small chip after the title (e.g. 'מועד א׳'). */
  chip?: string
  /** Primary PDF file name and its toggle label (e.g. 'מבחן' / 'גיליון'). */
  primaryFile: string
  primaryLabel: string
  /** Optional solution PDF + its toggle label (default 'פתרון'). */
  solutionFile?: string
  solutionLabel?: string
  /** Resolve a file name to a full asset URL. */
  assetUrl: (file: string) => string
  /** Where ✕ / Esc navigate back to (the owning gallery). */
  backPath: string
}

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

export default function DocViewer({ itemId, title, chip, primaryFile, primaryLabel, solutionFile, solutionLabel = 'פתרון', assetUrl, backPath }: DocViewerProps) {
  const { courseId } = useCourse()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [showSolution, setShowSolution] = useState(false)
  const progressOn = useFeature('progress')
  const progress = useProgress(courseId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && navigate(backPath)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, backPath])

  const hasSolution = !!solutionFile
  const file = showSolution && solutionFile ? solutionFile : primaryFile
  const url = assetUrl(file)
  const st = progressOn ? progress.get(itemId) : undefined

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2 text-white">
        <button
          onClick={() => navigate(backPath)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-300 transition hover:bg-slate-700 hover:text-white"
          aria-label="סגירה"
          title="סגירה (Esc)"
        >
          ✕
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-bold">{title}</span>
          {chip && (
            <span className="hidden shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-200 sm:inline">{chip}</span>
          )}
        </div>

        {progressOn && (
          <button
            onClick={() => progress.set(itemId, cycleStatus(st))}
            title="לחצו לשינוי הסטטוס"
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition ${st ? STATUS_META[st].chip : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            {st ? `${STATUS_META[st].icon} ${STATUS_META[st].he}` : '＋ סמן סטטוס'}
          </button>
        )}

        {hasSolution && (
          <div className="ms-auto inline-flex shrink-0 rounded-full bg-slate-700 p-0.5" role="group" aria-label={`${primaryLabel} או ${solutionLabel}`}>
            <ToggleBtn active={!showSolution} onClick={() => setShowSolution(false)}>{primaryLabel}</ToggleBtn>
            <ToggleBtn active={showSolution} onClick={() => setShowSolution(true)}>{solutionLabel}</ToggleBtn>
          </div>
        )}

        <div className={`flex shrink-0 items-center gap-1 ${hasSolution ? '' : 'ms-auto'}`}>
          <a href={url} target="_blank" rel="noopener noreferrer" title="פתח בכרטיסייה" className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-slate-700 hover:text-white">↗</a>
          <a href={url} download title="הורדה" className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-slate-700 hover:text-white">⬇</a>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="text-5xl" aria-hidden>📄</div>
          <p className="max-w-xs leading-relaxed text-slate-300">צפייה מיטבית ב-PDF במכשירך היא בכרטיסייה נפרדת.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-400">
            פתח את ה-PDF ↗
          </a>
        </div>
      ) : (
        <iframe key={url} src={url} title={title} className="min-h-0 flex-1 bg-white" />
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
