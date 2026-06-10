import { useFeature } from '@/core/platform/features'
import { useProgress, STATUS_META } from '@/core/platform/progress'

/**
 * A permanent "did you finish this part?" control at the bottom of every lecture — mark the lecture
 * as נלמד (done) or לחזרה (review). Gated by the progress feature; clicking an active state clears it.
 */
export default function LectureProgressFooter({ courseId, lectureId }: { courseId: string; lectureId: string }) {
  const on = useFeature('progress')
  const progress = useProgress(courseId)
  if (!on) return null
  const st = progress.get(lectureId)

  const btn = (active: boolean, base: string) =>
    `inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition ${active ? base : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`

  return (
    <footer className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-gradient-to-l from-slate-50 to-white p-4" dir="rtl">
      <div className="text-sm">
        <span className="font-bold text-slate-700">סיימת את השלב?</span>
        {st && <span className={`ms-2 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_META[st].chip}`}>מצב נוכחי: {STATUS_META[st].he}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => progress.set(lectureId, st === 'done' ? undefined : 'done')} className={btn(st === 'done', 'border-emerald-300 bg-emerald-500 text-white')}>
          <span aria-hidden>✓</span> סיימתי
        </button>
        <button onClick={() => progress.set(lectureId, st === 'review' ? undefined : 'review')} className={btn(st === 'review', 'border-sky-300 bg-sky-500 text-white')}>
          <span aria-hidden>↻</span> סמן לחזרה
        </button>
      </div>
    </footer>
  )
}
